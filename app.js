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

  var state = 0;
  var addTweets = function(index) {
    var tweet = streams.home[index];
    var $tweet = $('<div class="tweet"></div>');

    var $msg = $('<p class="message"></p>');
    $msg.text(tweet.message);

    var $name = $('<h6 class="username"></h6>');
    $name.text('@' + tweet.user + ':')

    $name.appendTo($tweet);
    $msg.appendTo($tweet);

    $tweet.prependTo($tweets);
    state += 1
  };

  var populateTweets = function() {
    for (var i = state; i < streams.home.length; i++) {
      addTweets(i);
    }
  };

  populateTweets();
});