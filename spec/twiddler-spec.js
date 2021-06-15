/* eslint-disable */

// Configurable Cypress env:
//   ALL_TESTS: run all tests, don't fail fast
//   SKIP_FLAVOR_TEST: skips final "say when you feel like you are done" test
//   SKIP_EXTRA_CREDIT: skips extra credit tests
//   INDEX_PATH: path to Twiddler index (default: "./index.html")

/**
 * Constants
 */
var INDEX_PATH = Cypress.env('INDEX_PATH') || './index.html';
var APP_FILENAME = 'app.js';
var CSS_PATH = '/styles.css';

// Store global references to flatten Cypress call chains
var _window, _document;

// Store number of tweets that existed last time a tweet was rendered
// This avoids any mismatch when tweets are added to the dataset while other
// tests are still executing, as it gets updated exactly at render-time
var numberOfTweetsAtLastRender = 0;

/**
 * Helpers
 */
function getCSSRules(ruleFilter) {
  var styleSheet = Array.from(_document.styleSheets)
    .filter(function(s) { return s.href && s.href.endsWith(CSS_PATH); })
    .pop();
  return Array.from(styleSheet.rules)
    .filter(ruleFilter);
}

function getNewestRenderedTweetIndex() {
  return new Promise(function(resolve) {
    cy.get('.tweet').first().then(function($tweet) {
      var text = $tweet.text();
      for (var i = _window.streams.home.length - 1; i >= 0; i--) {
        if (text.includes(_window.streams.home[i].message)) {
          return resolve(i);
        }
      }
    });
  });
}

/**
 * Tests used in multiple places
 */
var sharedTests = {
  noDuplicateTweetsRendered: function() {
    it('does not render duplicate Tweets', function() {
      // A Set is an object which stores unique values:
      // each value may only occur in a Set once.
      // Adding a value that already exists in the Set will do nothing.
      var renderedTweets = new Set();
      cy.get('.tweet').each(function($tweet) {
        expect(renderedTweets.has($tweet.text())).to.eq(false);
        renderedTweets.add($tweet.text());
      });
    });
  },
  
  tweetsRenderInReverseChronologicalOrder: function() {
    it('displays Tweets in reverse chronological order (newest first)', function() {
      getNewestRenderedTweetIndex().then(function(firstTweetIndex) {
        cy.get('.tweet').each(function($tweet, index) {
          var expectedTweet = _window.streams.home[firstTweetIndex - index];
          expect($tweet).to.contain(expectedTweet.message);
        });
      });
    });
  },

  pageDoesNotRefreshAfter: function(callback) {
    it('does not refresh the browser window', function() {
      cy.intercept('*', function() {
        expect(false, 'A page reload has been detected').to.eq(true);
      });
      callback();
      cy.wait(100);
    });
  },
};

// Fail fast: stop the test suite when a single test has failed
// Disable with Cypress env ALL_TESTS
afterEach(function() {
  if (!Cypress.env('ALL_TESTS') && this.currentTest.state === 'failed') {
    if (!this.currentTest._retries || this.currentTest._currentRetry === this.currentTest._retries - 1) {
      Cypress.runner.stop();
    }
  }
});

// Load the page once before the suite begins
before(function() {
  cy.visit(INDEX_PATH, {
    onBeforeLoad: function(contentWindow) {
      // Store persistent references, since this is the only cy.visit call
      _window = contentWindow;
      _document = contentWindow.document;

      // Update numberOfTweetsAtLastRender when new tweets are added to the page
      var observer = new MutationObserver(function(mutations) {
        if (mutations.some(function(mutation) {
          return Array.from(mutation.addedNodes).some(function(node) {
            return node.classList && node.classList.contains('tweet');
          });
        })) {
          numberOfTweetsAtLastRender = _window.streams.home.length;
        }
      });
      observer.observe(contentWindow.document, { childList: true, subtree: true });
    }
  });
});

/**
 * The test suite begins!
 */
describe('Project', function() {
  it('does not throw an error when loading the page', function() {
    // empty block: runtime errors will fail on the first test
  });

  it('contains the JavaScript in its own ' + APP_FILENAME + ' file', function() {
    cy.get('script[src$="' + APP_FILENAME + '"]').should('exist');
  });

  it('does not contain JavaScript in the HTML, only in .js files', function() {
    cy.get('script').each(function($script) {
      var scriptContent = $script.text().trim();
      // avoid asserting against test runner code
      if (scriptContent.includes('window.Cypress')) return;
      expect(scriptContent).to.be.empty;
    });
  });
});

describe('Home Feed', function() {
  it('exists with an ID of "feed" within #app', function() {
    cy.get('#app #feed').should('exist');
  });

  it('contains one element with a class of "tweet" for every Tweet', function() {
    cy.get('#feed .tweet').should('have.length', numberOfTweetsAtLastRender);
  });
  
  sharedTests.tweetsRenderInReverseChronologicalOrder();

  describe('Update Feed button', function() {
    it('exists with an ID of "update-feed"', function() {
      cy.get('#update-feed').should('exist');
    });

    it('is not empty', function() {
      cy.get('#update-feed').should(function($elem) {
        expect($elem.text()).to.not.be.empty;
      });
    });

    context('when clicked', function() {
      sharedTests.pageDoesNotRefreshAfter(function() {
        cy.get('#update-feed').click();
      });

      it('makes the Feed grow larger', function() {
        var initialNumTweets = Cypress.$('.tweet').length;
        _window.generateRandomTweet();
        cy.get('#update-feed').click().then(function() {
          expect(Cypress.$('.tweet').length).to.be.greaterThan(initialNumTweets);
        });
      });
      
      sharedTests.noDuplicateTweetsRendered();
      sharedTests.tweetsRenderInReverseChronologicalOrder();

      it('does not affect any other elements on the page except #feed', function() {
        function getFeedSiblings() {
          return Array.from(_document.getElementById('feed').parentElement.children)
            .filter(function(elem) {
              return elem.id !== 'feed';
            });
        }
        var before = getFeedSiblings();
        cy.get('#update-feed').click().then(function() {
          var after = getFeedSiblings();
          expect(before).to.deep.eq(after);
        });
      });
    });
  });
});

describe('Tweet UI Component', function() {
  var newestTweetIndex;
  before(function() {
    getNewestRenderedTweetIndex().then(function(tweetIndex) {
      newestTweetIndex = tweetIndex;
    });
  });

  // Run assertions by associating each tweet element with its data
  // This should be safe since we've already passed the tests asserting order
  // If no callback is provided, assert existence of the selector,
  // otherwise, the callback is invoked with the element and the associated data
  function assertEveryTweet(testName, selector, callback) {
    it(testName, function() {
      cy.get(selector).each(function($elem, index) {
        var expectedTweet = _window.streams.home[newestTweetIndex - index];
        expect(expectedTweet).not.to.be.undefined;
        if (callback) {
          callback($elem, expectedTweet, _window);
        } else {
          expect($elem).to.exist;
        }
      });
    });
  }

  assertEveryTweet('exists with a class of "tweet"', '.tweet');

  assertEveryTweet('contains a child with a class of "message"', '.tweet .message');
  assertEveryTweet(
    'contains the message in the child with a class of "message"',
    '.tweet .message',
    function($message, tweet) {
      expect($message).to.contain(tweet.message);
    }
  );
  
  assertEveryTweet('contains a child with a class of "username"', '.tweet .username');
  assertEveryTweet(
    'contains the username, prefixed by "@", in the child with a class of "username"',
    '.tweet .username',
    function($username, tweet) {
      expect($username).to.contain('@' + tweet.user);
    }
  );

  assertEveryTweet(
    'has no text nodes as direct descendants',
    '.tweet',
    function($tweet, tweet) {
      var textNodeChildren = Array.from($tweet.get(0).childNodes)
        .filter(function(node) {
          return node.nodeType === 3 && node.textContent.trim().length > 0
        });
      expect(textNodeChildren.length).to.eq(0);
    }
  );

  assertEveryTweet('contains an img tag with a class of "profile-photo"', '.tweet img.profile-photo');

  assertEveryTweet('contains a child with a class of "timestamp"', '.tweet .timestamp');
  assertEveryTweet(
    'contains the timestamp in the child with a class of "timestamp"',
    '.tweet .timestamp',
    function($timestamp, tweet, _window) {
      if (_window.jQuery.timeago) {
        expect($timestamp, 'timeago should be used to format the timestamp text.\n')
          .to.contain(_window.jQuery.timeago(tweet.created_at));
      } else {
        expect($timestamp).to.contain(tweet.created_at);
      }
    }
  );

  it('uses the time from the Tweet data, not the current time', function() {
    var propertyAccessCount = 0;
    var propertySpy = {
      get: function(target, prop) {
        if (prop === 'created_at') propertyAccessCount++;
        return target[prop];
      },
    };
    _window.streams.home = _window.streams.home.map(function(tweet) {
      return new Proxy(tweet, propertySpy);
    });

    cy.get('#update-feed').click().then(function() {
      expect(propertyAccessCount).to.be.at.least(numberOfTweetsAtLastRender);
    });
  });

  describe('icons', function() {
    var iconClasses = ['comment', 'retweet', 'like', 'share'];
    iconClasses.forEach(function(iconClass) {
      it('contains a ' + iconClass + ' icon with a class of "' + iconClass + '"', function() {
        var hasFontAwesome = _window.FontAwesome || _window.FontAwesomeKitConfig;
        if (hasFontAwesome) {
          cy.log('Since FontAwesome is present, this icon should be an I tag with a FontAwesome class applied.');
          cy.get('.tweet i.' + iconClass + '[class*="fa-"]').should('exist');
        } else {
          cy.log('This should be an IMG tag using assets/icons/placeholder.png')
          cy.get('.tweet img.' + iconClass + '[src$="assets/icons/placeholder.png"]').should('exist');
        }
      });
    });
  });
});

describe('Libraries', function() {
  describe('timeago', function() {
    it('is included as a library in the project', function() {
      var message = [
        'timeago is a jQuery plugin that can be used to format timestamps.',
        'Visit its website for instructions on downloading and using it:',
        '  https://timeago.yarp.com/',
        'Remember to `git add` this new file to your next git commit!',
        '',
      ].join('\n');
      expect(_window.jQuery.timeago, message).to.not.be.undefined;
    });

    it('is used at least once', function() {
      cy.spy(_window.jQuery, 'timeago');
      cy.spy(_window.jQuery.prototype, 'timeago');
      _window.generateRandomTweet();
      cy.get('#update-feed').click().then(function() {
        expect(
          Math.max(
            _window.jQuery.timeago.callCount,
            _window.jQuery.prototype.timeago.callCount
          )
        ).not.to.eq(0);
      });
    });
  });

  describe('FontAwesome', function() {
    it('is included', function() {
      var message = [
        'FontAwesome is a library which provides icons for use in web apps.',
        'Visit its website for more information on using it:',
        '  https://fontawesome.com/',
        'Click "Start for Free" and create a "Kit".',
        'For best results, make sure "Technology" is set to "Web Font", not "SVG".',
        'The "How to Use" page on the FontAwesome website can provide more information.',
        '',
      ].join('\n');
      expect(_window.FontAwesome || _window.FontAwesomeKitConfig, message).to.not.be.undefined;
    });

    it('is used', function() {
      cy.get('[class*="fa-"]').should('exist');
    });
  });

  describe('Google Fonts', function() {
    it('is included', function() {
      // check for CSS @import first
      var hasGoogleFontsImport = getCSSRules(function(rule) {
        return rule.href && rule.href.includes('fonts.googleapis.com');
      }).length > 0;
      if (!hasGoogleFontsImport) {
        // if no import rule found, assert on link tag at least
        cy.get('link[href*="fonts.googleapis.com"]').should('exist');
      }
    });
  });
});

describe('User Feed', function() {
  context('clicking on a username in a Tweet', function() {
    var selectedUsername;
    before(function() {
      cy.get('.tweet .username').first().then(function($username) {
        selectedUsername = $username.text();
        $username.click();
      });
    });

    it('changes the Feed so only the clicked user\'s Tweets show', function() {
      cy.get('.tweet .username').each(function($username) {
        expect($username.text()).to.eq(selectedUsername);
      });
    });
  
    it('changes the "Update Feed" button into a "Back" button', function() {
      cy.get('#update-feed').contains('Back', { matchCase: false });
    });

    describe('"Back" button', function() {
      it('switches from the User Feed back to the Home Feed', function() {
        cy.get('#update-feed').click().then(function() {
          expect(Cypress.$('.tweet').length).to.eq(numberOfTweetsAtLastRender);
        });
      });

      sharedTests.noDuplicateTweetsRendered();
    });
  });
});

describe('CSS Styling and Layout', function() {
  describe('Properties', function() {
    var requiredProperties = [
      'background-color',
      'border-radius',
      'color',
      'height',
      'font-family',
      'font-style',
      'font-weight',
      'margin',
      'padding',
      'text-align',
      'width',
    ];
    requiredProperties.forEach(function(propertyName) {
      it('uses the "' + propertyName + '" CSS property with a valid value', function() {
        expect(getCSSRules(function(rule) {
          return rule.style && rule.style.getPropertyValue(propertyName);
        })).not.to.be.empty;
      })
    });

    it('uses one or more border CSS properties (besides border-radius)', function() {
      expect(getCSSRules(function(rule) {
        return rule.style && Array.from(rule.style).some(function(ruleName) {
          return ruleName === 'border' || (ruleName !== 'border-radius' && ruleName.startsWith('border-'));
        });
      })).not.to.be.empty;
    });
  });

  if (!Cypress.env('SKIP_FLAVOR_TEST')) {
    describe('Finishing up', function() {
      it('the page is as beautiful as you want it to be', function() {
        var message = [
          'Nice work, you\'ve completed the Bare Minimum Requirements!',
          'Once you\'re satisfied with how your page looks, set',
          '',
          '    window.isItBeautifulYet = true',
          '',
          'at the end of your application code.',
          '',
          'If you would like to continue on to the extra credit,',
          '  open this test file (' + __filename + ')',
          '  and change the "xdescribe" to "describe" in the block',
          '  labelled as "Extra credit" near the end of the file.',
          '',
          '',
        ].join('\n');
        expect(_window.isItBeautifulYet, message).to.eq(true);
      });
    });
  }
});

if (!Cypress.env('SKIP_EXTRA_CREDIT')) {
  xdescribe('Extra credit', function() {
    describe('Friends list', function() {
      it('exists as a UL tag with an ID of "friends-list"', function() {
        cy.get('ul#friends-list').should('exist');
      });

      it('has an LI element with a class of "friend" for each user', function() {
        var numUsers = Object.keys(_window.streams.users).length;
        cy.get('#friends-list li.friend').should('have.length', numUsers);
      });

      context('when a user is clicked', function() {
        var selectedUsername;
        before(function() {
          for (var user in _window.streams.users) {
            if (_window.streams.users[user].length > 0) {
              selectedUsername = '@' + user;
              break;
            }
          }
          cy.get('#friends-list li.friend').contains(selectedUsername).click();
        });

        after(function() {
          // return to home stream
          cy.get('#update-feed').click();
        });

        it('opens the user\'s feed', function() {
          cy.get('.tweet .username').each(function($username) {
            expect($username.text()).to.eq(selectedUsername);
          });
        });
      });
    });

    describe('New Tweet form', function() {
      it('exists with an ID of "new-tweet-form"', function() {
        cy.get('form#new-tweet-form').should('exist');
      });

      var inputNames = ['username', 'message'];
      inputNames.forEach(function(inputName) {
        it('has an input with a name attribute of "' + inputName + '"', function() {
          cy.get('#new-tweet-form input[name="' + inputName + '"]').should('exist');
        });

        it('has a label for the ' + inputName + ' input', function() {
          cy.get('#new-tweet-form input[name="' + inputName + '"]').invoke('attr', 'id').then(function(id) {
            expect(id).not.to.be.undefined;
            cy.get('label[for="' + id + '"]').should('exist');
          });
        });
      });

      it('has a button to submit the form', function() {
        var submitButton;
        cy.get('#new-tweet-form').then(function($form) {
          submitButton = $form.find('button') || $form.find('input[type="submit"]');
          expect(submitButton).to.not.be.undefined;
        });
      });

      sharedTests.pageDoesNotRefreshAfter(function() {
        cy.get('#new-tweet-form input[name="username"]').invoke('val', 'foo');
        cy.get('#new-tweet-form input[name="message"]').invoke('val', 'bar');
        var submitButton;
        cy.get('#new-tweet-form').then(function($form) {
          submitButton = $form.find('button') || $form.find('input[type="submit"]');
          submitButton.click();
        });
        
      });

      context('when submitted', function() {
        var testUsername = 'Test User';
        var testMessages = [
          'This is a test message, stay in school!',
          'Always tip your bartender #kindness',
        ];
        before(function() {
          testMessages.forEach(function(testMessage) {
            cy.get('#new-tweet-form input[name="username"]').invoke('val', testUsername);
            cy.get('#new-tweet-form input[name="message"]').invoke('val', testMessage);
            var submitButton;
            cy.get('#new-tweet-form').then(function($form) {
              submitButton = $form.find('button') || $form.find('input[type="submit"]');
              submitButton.click();
            });
          });
        });

        it('adds the tweet data to the user\'s stream array', function() {
          expect(_window.streams.users[testUsername]).to.not.be.undefined;
          expect(_window.streams.users[testUsername]).to.have.lengthOf(testMessages.length);
        });

        it('adds the tweet data to the home stream array', function() {
          testMessages.forEach(function(testMessage) {
            expect(_window.streams.home.some(function(tweet) {
              return tweet.user === testUsername && tweet.message === testMessage;
            })).to.be.true;
          });
        });

        it('renders the new tweet immediately', function() {
          testMessages.forEach(function(testMessage) {
            expect(cy.get('.tweet').contains(testMessage)).to.exist;
          });
        });
      });
    });
  });
}
