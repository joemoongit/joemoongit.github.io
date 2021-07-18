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
   // $tweets.removeAttr(event.target.innerHTML);
    populateTweets();
  });

  var $tweets = $('<div id="feed"></div>');
  $tweets.appendTo($app);

  var elementGenerator = function(object) {
    var res = '<' + object.type;
    for (var key in object.attributes) {
      if (typeof(object.attributes[key]) === 'string') {
        res += ' ' + key + '=\"' + object.attributes[key] + '\"';
      } else if (typeof(object.attributes[key]) === 'object') {
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
      'type': 'img',
      'attributes': {
        'class': ['icon', 'comment'],
        'src': './assets/icons/placeholder.png'
      }
    },
    'icon2': {
      'type': 'img',
      'attributes': {
        'class': ['icon', 'retweet'],
        'src': './assets/icons/placeholder.png'
      }
    },
    'icon3': {
      'type': 'img',
      'attributes': {
        'class': ['icon', 'like'],
        'src': './assets/icons/placeholder.png'
      }
    },
    'icon4': {
      'type': 'img',
      'attributes': {
        'class': ['icon', 'share'],
        'src': './assets/icons/placeholder.png'
      }
    }
  };

  var createTweet = function(tweet, $tweet) {
    var components = elements(tweet);
    for (var key in tweet) {
      var $key = elementGenerator(components[key]);
      if (key === 'user') {
        $key.text('@' + tweet[key] + ': ')
      } else {
        $key.text(tweet[key]);
      }
      $key.appendTo($tweet);
    }

    // footer
    for (var key in footer) {
      var $key = elementGenerator(footer[key]);
      $key.appendTo($tweet);
    }
  };

  var state = 0;
  var addTweet = function(index) {
    var tweet = streams.home[index];
    var $tweet = $('<div class="tweet"></div>');

    createTweet(tweet, $tweet);

    $tweet.prependTo($tweets);
    state += 1
  };

  var populateTweets = function() {
    for (var i = state; i < streams.home.length; i++) {
      addTweet(i);
    }
  };

  populateTweets();
});