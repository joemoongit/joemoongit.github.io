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

  var $tweets = $('<div class="tweets"></div>');
  $tweets.appendTo($app);

  $updateButton.on('click', function(event) {
    var $tweetCount = $('.tweet').length;
    for (var i = $tweetCount; i < streams.home.length; i++) {
      var tweet = streams.home[i];
      var $tweet = $('<div class="tweet"></div>');
      $tweet.text('@' + tweet.user + ': ' + tweet.message);
      $tweet.prependTo($tweets);
    }
  });

  var index = streams.home.length - 1;
  while (index >= 0) {
    var tweet = streams.home[index];
    var $tweet = $('<div class="tweet"></div>');
    $tweet.text('@' + tweet.user + ': ' + tweet.message);
    $tweet.appendTo($tweets);
    index -= 1;
  }
});