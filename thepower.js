$(document).ready(function() {
  $('input#search').keyup(function(e) {
    var query;
    if (e.keyCode === 13) {
      query = $(this).val();
      $.getJSON("http://search.twitter.com/search.json?q="+query+"&rpp=100&callback=?", function(data) { 
        _.each(data.results, function(tweet) {
          if (tweet.geo !== null) {
            console.log(tweet.geo);
          }
        });
      });
    }
  });
});