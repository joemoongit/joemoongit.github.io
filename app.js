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

  var createTweet = function(tweet, $tweet) {
    var components = elements(tweet);
    for (var key in components) {
      var $component = elementGenerator(components[key]);
      if (key === 'user') {
        $component.text('@' + tweet[key] + ': ')
      } else if (key === 'created_at') {
        $component.text(jQuery.timeago(tweet[key]));
      } else {
        $component.text(tweet[key]);
      }
      $component.appendTo($tweet);
    }

    for (var icon in footer) {
      var $component = elementGenerator(footer[icon]);
      $component.appendTo($tweet);
    }

    return $tweet;
  };

  var addTweet = function(index) {
    var tweet = streams.home[index];
    var $tweet = $('<div class="tweet"></div>');

    $tweet = createTweet(tweet, $tweet);

    $tweet.prependTo($feed);
  };

  var renderFeed = function() {
    $feed.empty();
    for (var i = 0; i < streams.home.length; i++) {
      addTweet(i);
    }
  };

  renderFeed();
});