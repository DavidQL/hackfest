$(document).ready(function() {
  $('input#search').keyup(function(e) {
    var query, twitter_data;
    window.twitter_data = [];
    window.countries = {};
    if (e.keyCode === 13) {
      $('.results').empty();
      $('.blocker').show(200);
      
      $('img').animate({
       width: '1000px'
      },2500, function() {
        $(this).animate({
          width: '1px'
        },500);
      });
      
      query = $(this).val();
      for (i = 1; i < 10; i++) {
        $.getJSON("http://search.twitter.com/search.json?q="+query+"&rpp=100&page="+i+"&callback=?", function(data) {
          window.twitter_data.push(data);
        });
      }
      myInterval = setInterval(function() {
        if (window.twitter_data !== undefined && window.twitter_data.length > 8) {
          clearInterval(myInterval);
          window.tweets = [];
          _.each(window.twitter_data, function(results) {
            window.tweets.push(results.results);
          });
          window.tweet_list = _.flatten(window.tweets); 
          window.geo_tweets = 0;         
          _.each(window.tweet_list, function(tweet) {
            
            if (tweet.geo !== null) {
              
              console.log(tweet.geo.coordinates);
              geocoder = new google.maps.Geocoder();
              myloc = new google.maps.LatLng(tweet.geo.coordinates[0], tweet.geo.coordinates[1]);
              geocoder.geocode({location: myloc}, function(results, status) {
                if (results !== undefined && results !== null && results[0] !== undefined) {
                  myarray = results[0].formatted_address.split(',');
                  country = myarray[myarray.length-1];
                  
                  if (_.keys(window.countries).indexOf(country) >= 0) {
                    window.countries[country]++;
                    window.geo_tweets++;
                  }
                  else {
                    window.countries[country] = 1;
                    window.geo_tweets++;
                  }
                }       
              });
            }
          });
          
          console.log(window.countries);
          
          mynewinterval = setInterval(function() {
            console.log('my new interval');
            if (_.keys(window.countries).length > 0) {
              
              clearInterval(mynewinterval);
              
              $('.results').append($('<p> Found ' + window.tweet_list.length + ' tweets with that search term. (API maxes out at 900)</p>'));
              $('.results').append($('<p> Only ' + window.geo_tweets + ' of those had a geolocation. </p>'));
              
              setTimeout(function() {
                _.each(window.countries, function(val, key){
                  $('.results').append($('<p>' + val + ' tweets from ' + key + '</p>'));
                  console.log(val + " tweets from " + key);
                });
                $('.blocker').hide(200);
              },300);
              
            }
          }, 100);
          
          
          
        }
      },100);
      
    }
  });
});