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
    populateTweets();
  });

  var $tweets = $('<div id="feed"></div>');
  $tweets.appendTo($app);

  var state = 0;
  var addTweets = function(index) {
    var tweet = streams.home[index];
    var $tweet = $('<div class="tweet"></div>');
    $tweet.text('@' + tweet.user + ': ' + tweet.message);
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