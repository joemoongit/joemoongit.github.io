$(document).ready(function() {
  var $app = $('#app');
  $app.html('');

  var $header = $('<div class="header"></div>');
  $header.appendTo($app);

  var $title = $('<h1 id="title">Twiddler</h1>');
  $title.appendTo($header);
  $title.on('click', function(event) {
    alert('The title of this page is: ' + event.target.innerText);
  });

  var $updateButton = $('<button id="update-feed"></button>');
  $updateButton.text('Update Feed');
  $updateButton.appendTo($header);
  $updateButton.on('click', function(event) {
    if ($updateButton.text() === 'Back') {
      $updateButton.text('Update Feed');
    }
    renderFeed();
  });

  var $section = $('<div class="section"></div>');
  $section.appendTo($app);

  var $container = $('<div class="container"></div>');
  $container.appendTo($section);

  var $newTweetForm = $(`<form id="new-tweet-form" method="post" type="submit"></form>`);
  $newTweetForm.appendTo($container);

  var newTweetForm = function() {
    $header = $('<h2 id="new-tweet"></h2>');
    $header.text('New Tweet');
    $header.appendTo($newTweetForm);

    $labelUser = $('<label id="new-tweet-user" for="user"></label>');
    $labelUser.text('Username');
    $inputUser = $('<input type="text" id="user" name="username" attribute="username" placeholder="username" required>');

    $labelTweet = $('<label id="new-tweet-message" for="m"></label>');
    $labelTweet.text('Tweet');
    $inputTweet = $('<input type="text" id="m" name="message" attribute="message" placeholder="what\'s new?" required>');

    $labelUser.appendTo($newTweetForm);
    $inputUser.appendTo($newTweetForm);
    $labelTweet.appendTo($newTweetForm);
    $inputTweet.appendTo($newTweetForm);

    $buttonWrapper = $('<div id=new-tweet-wrapper></div>');
    $submit = $('<button id="new-tweet-button" type="submit" value="Post"></button>');
    $submit.text('Post');
    $submit.appendTo($buttonWrapper);
    $buttonWrapper.appendTo($newTweetForm);
    $newTweetForm.submit(function(e) {
      e.preventDefault();
      console.log(e);

      window.visitor = $inputUser.val();
      writeTweet($inputTweet.val());

      renderFeed();
      populateFriendsList();
      $inputUser.val('');
      $inputTweet.val('');
    });
  };

  newTweetForm();

  var $friendsList = $('<div id="friends-list-entries"></div>');
  $friendsList.appendTo($container);

  var populateFriendsList = function() {
    $friendsList.empty();
    $header = $('<h2 id="list"></h2>');
    $header.text('Friends List');
    $header.appendTo($friendsList);
    $list = $('<ul id="friends-list"></ul>');
    $list.appendTo($friendsList);

    for (var user in window.streams.users) {
      let u = user;
      $friend = $('<li class="friend"></li>');
      $friend.text(`@${u}`);
      $friend.appendTo($list);
      $friend.on('click', function() {
        renderFeed(u);
      });
    }
  };

  populateFriendsList();

  var $feed = $('<div id="feed"></div>');
  $feed.appendTo($section);

  var elementGenerator = function(object) {
    var res = '<' + object.type;
    for (var key in object.attributes) {
      if (Array.isArray(object.attributes[key])) {
        res += ' ' + key + '=\"' + (object.attributes[key]).join(' ') + '\"';
      } else {
        res += ' ' + key + '=\"' + object.attributes[key] + '\"';
      }
    }
    // if html tag does not require ending tag
    if (object.type === 'img') {
      res += '>';
    } else {
      res += '></' + object.type + '>';
    }
    return $(res);
  };

  var elementGeneratorUsingJquery = function(object) {
    var res = '<' + object.type + '>';
    var $res = $(res);
    if (object.type !== 'img') {
      res += '</' + object.type + '>';
    }
    for (var key in object.attributes) {
      if (Array.isArray(object.attributes[key])) {
        $res.attr(key, (object.attributes[key]).join(' '));
      } else {
        $res.attr(key, object.attributes[key]);
      }
    }
    return $res;
  };

  var flexElements = {
    'header': {
      'type': 'div',
      'attributes': {
        'class': 'tweet-header'
      }
    },
    'section' : {
      'type': 'div',
      'attributes': {
        'class': 'tweet-section'
      }
    },
    'footer' : {
      'type': 'div',
      'attributes': {
        'class': 'tweet-footer'
      }
    },
  };

  var elements = function(tweet){
    return {
      'user': {
        'type': 'div',
        'attributes': {
          'class': 'username'
        }
      },
      'message': {
        'type': 'p',
        'attributes': {
          'class': 'message'
        }
      },
      'created_at': {
        'type': 'span',
        'attributes': {
          'class': 'timestamp'
        }
      },
      'profilePhotoURL': {
        'type': 'img',
        'attributes': {
          'class': 'profile-photo',
          'src': tweet.profilePhotoURL
        }
      }
    };
  };

  var footer = {
    'icon1': {
      'type': 'i',
      'attributes': {
        'class': ['icon', 'comment', 'far', 'fa-comments']
      }
    },
    'icon2': {
      'type': 'i',
      'attributes': {
        'class': ['icon', 'retweet', 'fas', 'fa-retweet']
      }
    },
    'icon3': {
      'type': 'i',
      'attributes': {
        'class': ['icon', 'like', 'far', 'fa-thumbs-up']
      }
    },
    'icon4': {
      'type': 'i',
      'attributes': {
        'class': ['icon', 'share', 'far', 'fa-share-square']
      }
    }
  };

  var homer = {
    'head' : {
      'hair1': 'hair1',
      'hair2': 'hair2',
      'hair3': 'body head-top',
      'hair4': 'no-border body head-main',
      'hair5': 'no-border m1',
      'hair6': 'no-border m2',
      'hair7': 'no-border m3',
      'hair8': 'no-border m4',
      'neck1': 'no-border neck1',
      'neck2': 'body neck2',
      'ear': {
        'ear1': 'no-border inner1',
        'ear2': 'no-border inner2',
        'ear3': 'no-border body clip'
      },
      'mouth': {
        'mouth1': 'mouth5',
        'mouth2': 'mouth2',
        'mouth3': 'mouth1',
        'mouth4': 'mouth7',
        'mouth5': 'no-border mouth3',
        'mouth6': 'no-border mouth4',
        'mouth7': 'no-border mouth6',
        'mouth8': 'no-border mouth8'
      },
      'right-eye': {
        'right-eye1': 'no-border right-eye-pupil',
        'right-eye2': 'no-border body eyelid-top',
        'right-eye3': 'no-border body eyelid-bottom'
      },
      'nose1': 'body nose',
      'nose2': 'body nose-tip',
      'left-eye': {
        'left-eye1': 'no-border left-eye-pupil',
        'left-eye2': 'no-border body eyelid-top',
        'left-eye3': 'no-border body eyelid-bottom'
      }
    }
  };

  var bart = {
    'head': {
      'hair1': 'no-border body hair hair1',
      'hair2': 'no-border body hair hair2',
      'hair3': 'no-border body hair hair3',
      'hair4': 'no-border body hair hair4',
      'hair5': 'no-border body hair hair5',
      'hair6': 'no-border body hair hair6',
      'hair7': 'no-border body hair hair7',
      'hair8': 'no-border body hair hair8',
      'hair9': 'no-border body hair hair9',
      'mouth': 'body mouth-lip2',
      'left1': 'no-border body head-left1',
      'left2': 'no-border body head-left2',
      'left3': 'no-border body head-left3',
      'left4': 'no-border body head-left4',
      'left5': 'no-border body head-left5',
      'left6': 'no-border body head-left6',
      'left7': 'no-border body head-left7',
      'eyelid': 'body eyelid',
      'mouth2':'no-border body mouth',
      'lip': 'body mouth-lip',
      'right1': 'no-border body head-right1',
      'right2': 'no-border body head-right2',
      'right3': 'no-border body head-right3',
      'ear' : {
        'ear1': 'no-border inner1',
        'ear2': 'no-border inner2',
        'ear3': 'no-border body clip'
      },
      'right-eye': {
        'right-eye1': 'no-border right-eye-pupil',
        'right-eye2': 'no-border body eyelid-top',
        'right-eye3': 'no-border body eyelid-bottom'
      },
      'nose1': 'no-border body nose',
      'nose2': 'body nose-tip',
      'left-eye': {
        'left-eye1': 'no-border left-eye-pupil',
        'left-eye2': 'no-border body eyelid-top',
        'left-eye3': 'no-border body eyelid-bottom'
      },
      'smile': 'no-border mouth-smile'
    }
  };

  var lisa = {
    'head': {
      'head1': 'no-border body head-main',
      'head2': 'no-border body head-main2',
      'head3': 'no-border body head-main3',
      'hair9': 'no-border hair9',
      'hair10': 'no-border hair10',
      'hair1': 'body hair hair1',
      'hair2': 'body hair hair2',
      'hair3': 'body hair hair3',
      'hair4': 'body hair hair4',
      'hair5': 'body hair hair5',
      'hair6': 'body hair hair6',
      'hair7': 'body hair hair7',
      'hair8': 'body hair hair8',
      'lip2': 'body mouth-lip2',
      'lip': 'body mouth-lip',
      'neck1': 'no-border body neck',
      'mouth': 'no-border body mouth',
      'neck2': 'no-border body neck2',
      'neck3': 'no-border body neck3',
      'smile': 'no-border mouth-smile',
      'ear': {
        'ear1': 'no-border inner1',
        'ear2': 'no-border inner2',
        'ear3': 'no-border body clip'
      },
      'eyelash1': 'no-border eyelash1 eyelash',
      'eyelash2': 'no-border eyelash2 eyelash',
      'eyelash3': 'no-border eyelash3 eyelash',
      'eyelash4': 'no-border eyelash4 eyelash',
      'eyelash5': 'no-border eyelash5 eyelash',
      'eyelash6': 'no-border eyelash6 eyelash',
      'eyelash7': 'no-border eyelash7 eyelash',
      'eyelash8': 'no-border eyelash8 eyelash',
      'right-eye': {
        'right-eye1': 'no-border right-eye-pupil',
        'right-eye2': 'no-border body eyelid-top',
        'right-eye3': 'no-border body eyelid-bottom'
      },
      'nose1': 'no-border body nose',
      'nose2': 'body nose-tip',
      'left-eye': {
        'left-eye1': 'no-border left-eye-pupil',
        'left-eye2': 'no-border body eyelid-top',
        'left-eye3': 'no-border body eyelid-bottom'
      },
      'necklace1': 'necklace necklace1',
      'necklace2': 'necklace necklace2',
      'necklace3': 'necklace necklace3',
      'necklace5': 'necklace necklace5',
      'necklace4': 'necklace necklace4'
    }
  };

  var maggie = {
    'head': {
      'main': 'no-border body head-main',
      'hair2': 'body hair hair2',
      'hair1': 'body hair hair1',
      'hair3': 'body hair hair3',
      'hair4': 'body hair hair4',
      'hair5': 'body hair hair5',
      'hair6': 'body hair hair6',
      'hair7': 'body hair hair7',
      'hair8': 'body hair hair8',
      'bow': 'bow bow1',
      'bow2': 'circle bow bow2',
      'bow3': 'bow bow3',
      'neck': 'no-border body neck',
      'ear': {
        'ear1': 'no-border circle inner1',
        'ear2': 'no-border circle inner2',
        'ear3': 'no-border body clip'
      },
      'cheek': 'circle body cheek',
      'eyelash1': 'no-border eyelash1 eyelash',
      'eyelash2': 'no-border eyelash2 eyelash',
      'eyelash3': 'no-border eyelash3 eyelash',
      'eyelash4': 'no-border eyelash4 eyelash',
      'eyelash5': 'no-border eyelash5 eyelash',
      'eyelash6': 'no-border eyelash6 eyelash',
      'eyelash7': 'no-border eyelash7 eyelash',
      'eyelash8': 'no-border eyelash8 eyelash',
      'right-eye': {
        'right-eye1': 'no-border circle pupil',
        'right-eye2': 'no-border body eyelid-top',
        'right-eye3': 'no-border body eyelid-bottom'
      },
      'nose': 'body nose-tip',
      'left-eye': {
        'left-eye1': 'no-border circle pupil',
        'left-eye2': 'no-border body eyelid-top',
        'left-eye3': 'no-border body eyelid-bottom'
      },
      'mouth': 'circle body mouth',
      'dummy1': 'circle dummy dummy1',
      'dummy2': 'dummy dummy3'
    }
  };

  var ned = {
    'head': {
      'hair1': 'hair-top hair',
      'hair2': 'hair-side hair',
      'neck1': 'no-border neck-bottom',
      'neck2': 'no-border neck-left',
      'lip': 'body lip',
      'main': 'no-border body head-main',
      'hair3': 'no-border hair-line1 hair-line',
      'hair4': 'no-border hair-line2 hair-line',
      'hair5': 'no-border hair-line3 hair-line',
      'hair6': 'no-border hair-line4 hair-line',
      'hair7': 'no-border hair-line5 hair-line',
      'hair8': 'body head-top',
      'hair9': 'no-border body eye-bulge',
      'hair10': 'no-border body head-top-inner',
      'neck3': 'no-border neck-right',
      'ear': {
        'ear1': 'no-border inner'
      },
      'hair11': 'no-border sideburn hair',
      'hair12': 'no-border body head-side',
      'left-eye': {
        'left-eye1': 'no-border pupil',
        'left-eye2': 'no-border body eyelid-top',
        'left-eye3': 'no-border body eyelid-bottom'
      },
      'right-eye': {
        'right-eye1': 'no-border pupil',
        'right-eye2': 'no-border body eyelid-top',
        'right-eye3': 'no-border body eyelid-bottom'
      },
      'glasses': 'no-border glasses',
      'mouth1': 'no-border mouth-top',
      'mouth2': 'no-border mouth-left',
      'mouth3': 'no-border mouth-right',
      'mouth4': 'no-border mouth-inner',
      'tongue': 'no-border tongue',
      'moustache': {
        'moustache1': 'no-border moustache-hair1 hair left',
        'moustache2': 'no-border moustache-hair2 hair left',
        'moustache3': 'no-border moustache-hair3 hair left',
        'moustache4': 'no-border moustache-hair4 hair right',
        'moustache5': 'no-border moustache-hair5 hair right',
        'moustache6': 'no-border moustache-hair6 hair right'
      },
      'nose': 'body nose'
    }
  };

  var elementGenerator2 = function(element, attributes) {
    var attr = '';
    for (var key in attributes) {
      attr += ` ${key}="${attributes[key]}"`
    }
    return $(`<${element}${attr}></${element}>`);
  };

  var generateSimpsonsCharacter = function(name, character) {
    var $name = elementGenerator2('div', {'id': name});
    var $head = elementGenerator2('div', {'class': 'head'});
    $head.appendTo($name);

    var $part;
    for (var key in character.head) {
      if (typeof(character.head[key]) === 'object') {
        if (name !=='maggie' && key === 'ear') {
          $part = elementGenerator2('div', {'class': `body ${key}`})
        } else if (name === 'maggie' && key === 'ear') {
          $part = elementGenerator2('div', {'class': `circle body ${key}`})
        } else if (name === 'maggie' && (key === 'left-eye' || key === 'right-eye')) {
          $part = elementGenerator2('div', {'class': `circle eye ${key}`})
        } else if (name === 'ned-flanders' && (key === 'left-eye' || key === 'right-eye')) {
          $part = elementGenerator2('div', {'class': `${key} eye`})
        } else {
          $part = elementGenerator2('div', {'class': key})
        }
        $part.appendTo($head);
        for (var k in character.head[key]) {
          $elem = elementGenerator2('div', {'class': character.head[key][k]});
          $elem.appendTo($part);
        }
      } else {
        if (name === 'maggie' && key === 'dummy2') {
          var $p = elementGenerator2('div', {'class': `dummy ${key}`});
          $part = elementGenerator2('div', {'class': character.head[key]});
          $part.appendTo($p);
          $p.appendTo($head);

        } else {
          $part = elementGenerator2('div', {'class': character.head[key]});
          $part.appendTo($head);
        }
      }
    }
    return $name;
  };

  var createTweet = function(tweet, $tweet) {
    var components = elements(tweet);

    var $header = elementGenerator(flexElements.header);
    var $section = elementGenerator(flexElements.section);
    var $footer = elementGenerator(flexElements.footer);

    for (var key in components) {
      var $component = elementGenerator(components[key]);
      if (key === 'user') {
        var user = tweet[key];
        $component.text('@' + user);
        $component.on('click', function() {
          renderFeed(user);
        });
        $component.appendTo($header)
      } else if (key === 'message') {
        $component.text(tweet[key]);
        $component.appendTo($section)
      } else if (key === 'created_at') {
        $component.text(jQuery.timeago(tweet[key]));
        $component.appendTo($footer)
      } else if (key === 'profilePhotoURL') {
        if (tweet[key].includes('douglascalhoun')) {
          $component = generateSimpsonsCharacter('homer', homer);
        } else if (tweet[key].includes('sharksforcheap')) {
          $component = generateSimpsonsCharacter('bart', bart);
        } else if (tweet[key].includes('shawndrost')) {
          $component = generateSimpsonsCharacter('lisa', lisa);
        } else if (tweet[key].includes('mracus')) {
          $component = generateSimpsonsCharacter('maggie', maggie);
        } else if (user === visitor) {
          $component = generateSimpsonsCharacter('ned-flanders', ned);
        }
        $component.appendTo($header);
      } else {
        $component.text(tweet[key]);
      }
    }

    for (var icon in footer) {
      var $component = elementGenerator(footer[icon]);
      $component.appendTo($footer);
    }

    $header.appendTo($tweet);
    $section.appendTo($tweet);
    $footer.appendTo($tweet);

    return $tweet;
  };

  var addTweet = function(tweet) {
    var tweet = tweet;
    var $tweet = $('<div class="tweet"></div>');

    $tweet = createTweet(tweet, $tweet);

    $tweet.prependTo($feed);
  };

  var renderFeed = function(user) {
    $feed.empty();
    if (user === undefined) {
      for (var i = 0; i < window.streams.home.length; i++) {
        addTweet(window.streams.home[i]);
      }
    } else {
      $updateButton.text('Back');
      for (var i = 0; i < window.streams.home.length; i++) {
        if (window.streams.home[i]['user'] === user) {
          addTweet(window.streams.home[i]);
        }
      }
    }
  };

  renderFeed();
  window.isItBeautifulYet = true;
});