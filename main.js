    // Use your own Mapbox access token
    var accessToken = 'pk.eyJ1IjoiZmFyc2FobWVkIiwiYSI6ImNsZnRuOGpjYjAybDIzZHIzcjJ4YnFhNGsifQ.Vmggsp-lmxMgSumkuCJn_g';
    mapboxgl.accessToken = accessToken;

    // Initialize map
    var map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [0, 0],
      zoom: 2
    });

    // Set up marker and popup
    var marker = new mapboxgl.Marker();
    var popup = new mapboxgl.Popup({ offset: 25 });

    // When user clicks on map
    map.on('click', function(e) {
      // Get longitude and latitude values from clicked point
      var lon = e.lngLat.lng;
      var lat = e.lngLat.lat;

      // Set the marker and popup
      marker.setLngLat([lon, lat]).addTo(map);
      popup.setLngLat([lon, lat])
        .setHTML('<p>Loading weather data...</p>')
        .addTo(map);

      // Call WeatherAPI to get weather data for clicked location
      $.getJSON('https://api.weatherapi.com/v1/forecast.json?key=16c5d649a07f44ef9d1122348232903&q=' + lat + ',' + lon + '&days=3', function(data) {
        // Get location and current weather information
        var location = data.location.name + ', ' + data.location.region + ', ' + data.location.country;
        var currentTemp = data.current.temp_c;
        var currentCondition = data.current.condition.text.toLowerCase().replace(/ /g, '-');
        var currentIconUrl = 'https:' + data.current.condition.icon;

        // Update location weather card with location and current temperature
        $('#location-weather').html('<h3>' + location + '</h3><strong>Current Temperature:</strong> ' + currentTemp + ' ℃');

        // Update location weather image
        $('#location-weather-image').css('background-image', 'url(' + currentIconUrl + ')');

        // Update current weather card with condition image and text
        $('#current-weather-image').css('background-image', 'url(' + currentIconUrl + ')');
        $('#current-weather').html('<h3>' + currentCondition + '</h3>');

        // Loop through forecast data for the next 3 days and update each card with date, weather image, min and max temperature
        for (var i = 0; i < data.forecast.forecastday.length; i++) {
          var day = data.forecast.forecastday[i];
          // Get date, min and max temperature, and weather condition for the day
          var date = day.date;
          var minTemp = day.day.mintemp_c;
          var maxTemp = day.day.maxtemp_c;
          var condition = day.day.condition.text.toLowerCase().replace(/ /g, '-');
          var iconUrl = 'https:' + day.day.condition.icon;

          // Update forecast card with date, weather image, min and max temperature
          $('#day' + (i + 1) + '-weather-image').css('background-image', 'url(' + iconUrl + ')');
          $('#day' + (i + 1) + '-weather').html('<h3>' + date + '</h3><strong>Min:</strong> ' + minTemp + ' ℃<br><strong>Max:</strong> ' + maxTemp + ' ℃<br><strong>Condition:</strong> ' + condition);
        }

        // Close popup
        popup.remove();
      });
    });

    // When user clicks on search button
    $('#search-btn').on('click', function() {
      // Get country name from input field
      var country = $('#search-input').val();

      // Call WeatherAPI to get weather data for country
      $.getJSON('https://api.weatherapi.com/v1/forecast.json?key=16c5d649a07f44ef9d1122348232903&q=' + country + '&days=3', function(data) {

        // Get longitude and latitude of first location in search result
        var lon = data.location.lon;
        var lat = data.location.lat;

        // Set the marker and popup
        marker.setLngLat([lon, lat]).addTo(map);
        popup.setLngLat([lon, lat])
          .setHTML('<p>Loading weather data...</p>')
          .addTo(map);

        // Get location and current weather information
        var location = data.location.name + ', ' + data.location.region + ', ' + data.location.country;
        var currentTemp = data.current.temp_c;
        var currentCondition = data.current.condition.text.toLowerCase().replace(/ /g, '-');
        var currentIconUrl = 'https:' + data.current.condition.icon;

        // Update location weather card with location and current temperature
        $('#location-weather').html('<h3>' + location + '</h3><strong>Current Temperature:</strong> ' + currentTemp + ' ℃');

        // Update location weather image
        $('#location-weather-image').css('background-image', 'url(' + currentIconUrl + ')');

        // Update current weather card with condition image and text
        $('#current-weather-image').css('background-image', 'url(' + currentIconUrl + ')');
        $('#current-weather').html('<h3>' + currentCondition + '</h3>');

        // Loop through forecast data for the next 3 days and update each card with date, weather image, min and max temperature
        for (var i = 0; i < data.forecast.forecastday.length; i++) {
          var day = data.forecast.forecastday[i];

          // Get date, min and max temperature, and weather condition for the day
          var date = day.date;
          var minTemp = day.day.mintemp_c;
          var maxTemp = day.day.maxtemp_c;
          var condition = day.day.condition.text.toLowerCase().replace(/ /g, '-');
          var iconUrl = 'https:' + day.day.condition.icon;

          // Update forecast card with date, weather image, min and max temperature
          $('#day' + (i + 1) + '-weather-image').css('background-image', 'url(' + iconUrl + ')');
          $('#day' + (i + 1) + '-weather').html('<h3>' + date + '</h3><strong>Min:</strong> ' + minTemp + ' ℃<br><strong>Max:</strong> ' + maxTemp + ' ℃<br><strong>Condition:</strong> ' + condition);
        }

        // Center map on location
        map.setCenter([lon, lat]);

        // Close popup
        popup.remove();
      });

      // Clear input field
      $('#search-input').val('');
    });

    // When user clicks on geolocation button
    $('#geo-btn').on('click', function() {
      // Check if geolocation is supported by browser
      if ('geolocation' in navigator) {
        // Get user's current position
        navigator.geolocation.getCurrentPosition(function(position) {
          var lon = position.coords.longitude;
          var lat = position.coords.latitude;

          // Set the marker and popup
          marker.setLngLat([lon, lat]).addTo(map);
          popup.setLngLat([lon, lat])
            .setHTML('<p>Loading weatherdata...</p>')
            .addTo(map);

          // Call WeatherAPI to get weather data for user's location
          $.getJSON('https://api.weatherapi.com/v1/forecast.json?key=16c5d649a07f44ef9d1122348232903&q=' + lat + ',' + lon + '&days=3', function(data) {
            // Get location and current weather information
            var location = data.location.name + ', ' + data.location.region + ', ' + data.location.country;
            var currentTemp = data.current.temp_c;
            var currentCondition = data.current.condition.text.toLowerCase().replace(/ /g, '-');
            var currentIconUrl = 'https:' + data.current.condition.icon;

            // Update location weather card with location and current temperature
            $('#location-weather').html('<h3>' + location + '</h3><strong>Current Temperature:</strong> ' + currentTemp + ' ℃');

            // Update location weather image
            $('#location-weather-image').css('background-image', 'url(' + currentIconUrl + ')');

            // Update current weather card with condition image and text
            $('#current-weather-image').css('background-image', 'url(' + currentIconUrl + ')');
            $('#current-weather').html('<h3>' + currentCondition + '</h3>');

            // Loop through forecast data for the next 3 days and update each card with date, weather image, min and max temperature
            for (var i = 0; i < data.forecast.forecastday.length; i++) {
              var day = data.forecast.forecastday[i];

              // Get date, min and max temperature, and weather condition for the day
              var date = day.date;
              var minTemp = day.day.mintemp_c;
              var maxTemp = day.day.maxtemp_c;
              var condition = day.day.condition.text.toLowerCase().replace(/ /g, '-');
              var iconUrl = 'https:' + day.day.condition.icon;

              // Update forecast card with date, weather image, min and max temperature
              $('#day' + (i + 1) + '-weather-image').css('background-image', 'url(' + iconUrl + ')');
              $('#day' + (i + 1) + '-weather').html('<h3>' + date + '</h3><strong>Min:</strong> ' + minTemp + ' ℃<br><strong>Max:</strong> ' + maxTemp + ' ℃<br><strong>Condition:</strong> ' + condition);
            }

            // Center map on user's location
            map.setCenter([lon, lat]);

            // Close popup
            popup.remove();
          });
        }, function() {
          // If there is an error getting user's location, display error message
          alert('Unable to get your location. Please try again later.');
        });
      } else {
        // If geolocation is not supported by browser, display error message
        alert('Geolocation is not supported by your browser. Please use the search bar instead.');
      }
    });
