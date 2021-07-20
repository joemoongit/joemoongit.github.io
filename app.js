$(document).ready(function() {
  var $app = $('#app');
  $app.html('');

  var $title = $('<h1 id="title">Twiddler</h1>');
  $title.appendTo($app);
  $title.on('click', function(event) {
    console.log(event);
    alert('The title of this page is: ' + event.target.innerText);
  });

  var $updateButton = $('<button id="update-feed"></button>');
  $updateButton.text('Update Feed');
  $updateButton.appendTo($app);
  $updateButton.on('click', function(event) {
 //   $feed.removeAttr(event.target.innerHTML);
    if ($updateButton.text() === 'Back') {
      $updateButton.text('Update Feed');
    }
    renderFeed();
  });

  var $feed = $('<div id="feed"></div>');
  $feed.appendTo($app);

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

  var returnHomer = function() {
    var $homer = $('<div id="homer"></div>');

    var $head = $('<div class="head"></div>');
    $head.appendTo($homer);

    var $hair1 = $('<div class="hair1"></div>');
    var $hair2 = $('<div class="hair2"></div>');
    var $hair3 = $('<div class="body head-top"></div>');
    var $hair4 = $('<div class="no-border body head-main"></div>');

    $hair1.appendTo($head);
    $hair2.appendTo($head);
    $hair3.appendTo($head);
    $hair4.appendTo($head);

    var $hair5 = $('<div class="no-border m1"></div>');
    var $hair6 = $('<div class="no-border m2"></div>');
    var $hair7 = $('<div class="no-border m3"></div>');
    var $hair8 = $('<div class="no-border m4"></div>');

    $hair5.appendTo($head);
    $hair6.appendTo($head);
    $hair7.appendTo($head);
    $hair8.appendTo($head);

    var $neck1 = $('<div class="no-border neck1"></div>');
    var $neck2 = $('<div class="body neck2"></div>');

    $neck1.appendTo($head);
    $neck2.appendTo($head);


    var $ear = $('<div class="body ear"></div>');
    var $ear1 = $('<div class="no-border inner1"></div>');
    var $ear2 = $('<div class="no-border inner2"></div>');
    var $ear3 = $('<div class="no-border body clip"></div>');

    $ear1.appendTo($ear);
    $ear2.appendTo($ear);
    $ear3.appendTo($ear);
    $ear.appendTo($head);

    var $mouth = $('<div class="mouth"></div>');
    var $mouth1 = $('<div class="mouth5"></div>');
    var $mouth2 = $('<div class="mouth2"></div>');
    var $mouth3 = $('<div class="mouth1"></div>');
    var $mouth4 = $('<div class="mouth7"></div>');
    var $mouth5 = $('<div class="no-border mouth3"></div>');
    var $mouth6 = $('<div class="no-border mouth4"></div>');
    var $mouth7 = $('<div class="no-border mouth6"></div>');
    var $mouth8 = $('<div class="no-border mouth8"></div>');

    $mouth1.appendTo($mouth);
    $mouth2.appendTo($mouth);
    $mouth3.appendTo($mouth);
    $mouth4.appendTo($mouth);
    $mouth5.appendTo($mouth);
    $mouth6.appendTo($mouth);
    $mouth7.appendTo($mouth);
    $mouth8.appendTo($mouth);
    $mouth.appendTo($head);

    var $rightEye = $('<div class="right-eye"></div>');
    var $rightEye1 = $('<div class="no-border right-eye-pupil"></div>');
    var $rightEye2 = $('<div class="no-border body eyelid-top"></div>');
    var $rightEye3 = $('<div class="no-border body eyelid-bottom"></div>');
    $rightEye1.appendTo($rightEye);
    $rightEye2.appendTo($rightEye);
    $rightEye3.appendTo($rightEye);
    $rightEye.appendTo($head);

    var $nose1 = $('<div class="body nose"></div>');
    var $nose2 = $('<div class="body nose-tip"></div>');
    $nose1.appendTo($head);
    $nose2.appendTo($head);


    var $leftEye = $('<div class="left-eye"></div>');
    var $leftEye1 = $('<div class="no-border left-eye-pupil"></div>');
    var $leftEye2 = $('<div class="no-border body eyelid-top"></div>');
    var $leftEye3 = $('<div class="no-border body eyelid-bottom"></div>');
    $leftEye1.appendTo($leftEye);
    $leftEye2.appendTo($leftEye);
    $leftEye3.appendTo($leftEye);
    $leftEye.appendTo($head);

    return $homer;
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
        if (key === 'ear') {
          $part = elementGenerator2('div', {'class': `body ${key}`})
        } else if (name === 'maggie' && key === 'ear') {
          $part = elementGenerator2('div', {'class': `circle body ${key}`})
        } else if (name === 'maggie' && (key === 'left-eye' || key === 'right-eye')) {
          $part = elementGenerator2('div', {'class': `circle eye ${key}`})
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
      for (var i = 0; i < streams.home.length; i++) {
        addTweet(streams.home[i]);
      }
    } else {
      $updateButton.text('Back');
      for (var i = 0; i < streams.home.length; i++) {
        if (streams.home[i]['user'] === user) {
          addTweet(streams.home[i]);
        }
      }
    }
  };

  renderFeed();
});