/**
 *  =================================================================================
 *  @description
 *  Code in this file handle load API of Google Map, OpenWeatherMap and Foursquare
 *  asynchronously to get map service, weather data and location details
 *  ViewModel managed by knockout.js also created here
 *  =================================================================================
 */

/**
 * @description Declare global variable to be used
 * @param {FromGoogleMap} map a instance of Google Map Class
 * @param {array} markers a array for all the listing markers
 * @param {FromGoogleMap} largeInfowindow a window to show marker information
 * @param {FromGoogleMap} bounds a instance of Google Map LatLngBounds class
 * @param {FromGoogleMap} flagIcon a customized marker icon
 * @param {FromOpenWeatherMap} weatherInfo weather API response form OpenWeatherMap
 */

  var map;
  var markers;
  var largeInfowindow;
  var bounds;
  var flagIcon;
  var weatherInfo;

/**
 * @description
 * Function initMap is a callback function to be executed after Google Map API loaded
 * Global variable declared above will be defined here.
 * And then ,use getWeather() to load weather data
 */
  function initMap() {
    // Create a map object and specify the DOM element for display.
    map = new google.maps.Map(document.getElementById('map'), {
      center: {
        lat: 40.7413549,
        lng: -73.9980244
      },
      styles: styles,
      mapTypeControl: false,
      zoom: 13
    });

    // Create a new blank array for all the listing markers
    markers = [];

    // Create infowindow
    largeInfowindow = new google.maps.InfoWindow();

    // Extend the boundaries of the map for each marker and display the marker
    bounds = new google.maps.LatLngBounds();

    // This will be my animation marker icon when select an place in placesList
    flagIcon = markMarkerIcon('0091ff');

    // marker flagIcon
    function markMarkerIcon(markerColor) {
      var markerImage = new google.maps.MarkerImage(
        'image/beachflag.png',
        new google.maps.Size(31, 34),
        new google.maps.Point(0, 0),
        new google.maps.Point(10, 34),
        new google.maps.Size(21, 34));
      return markerImage;
    };

    // Load weather data form OpenWeatherMap
    getWeather();
  };


  /**
    * @description
    * Function getWeather load weather data form OpenWeatherMap asynchronously
    * And then ,use knockout.js to manage viewModel by ko.applyBindings(new ViewModel());
    */
  function getWeather() {
    $.getJSON("http://api.openweathermap.org/data/2.5/weather?q=New%20York&APPID=6e60598959607c579f6ccf9bb51890bb", function(json) {
       weatherInfo = JSON.parse(JSON.stringify(json));
       ko.applyBindings(new ViewModel());
     }).fail(function(){
       ko.applyBindings(new ViewModel());
       $('.weather').css('height','50%').text('Something went wrong about weather info');
     });
  };

  /**
    * @description
    * Function foursquareInfos load location details data form Foursquare asynchronously
    * it managed by knockout.js and called in ViewModel.createMarkers
    */
   function foursquareInfos(location, details) {
      var client_id = '2E25PY0MVBJ4GOLQE0GRPVXAHG1R5C2KXFYIQLIV2LGMPIMD';
      var client_secret = 'TIE2CIPA3WDIVSAMKKD5GWGX4WIRNDTHJO5KGCCM3L3UHEAU';
      var position = location.location.lat + ',' + location.location.lng;
      var query = location.title;
      var url = 'https://api.foursquare.com/v2/venues/search?client_id=' + client_id + '&client_secret=' + client_secret + '&v=20170801&ll=' + position + '&query=' + query + '&limit=1';
      $.ajax({
        dataType: "json",
        url: url,
      }).done(function(result){
        if (result.response.venues.length > 0) {
          var name = result.response.venues[0].name;
          var formattedAddress = result.response.venues[0].location.formattedAddress;
          var street = formattedAddress[0];
          var city = formattedAddress[1];
          var state = formattedAddress[2];

          var detailsHtml = '<div>' + name + ' nearby';
          if (formattedAddress) {
            detailsHtml += '<br>' + street;
            detailsHtml += '<br>' + city;
            detailsHtml += '<br>' + state;
          }
          detailsHtml += '<br>(Information from <a href="https://foursquare.com/">Foursquare</a>)'
          detailsHtml += '</div>';
          details(detailsHtml);
        } else {
          var detailsHtml = '<div><p>(Foursquare has no data about this place)</p></div>';
          details(detailsHtml);
        }
      }).fail(function(){
        var detailsHtml = '<div><p>(Error occurs when loading Foursquare data)</p></div>';
        details(detailsHtml);
      });
    };



/**
  * @description
  * ViewModel contains code about createMarkers, toggleBounce, display placesList, selectPlace, filterMarker,
  * resetMarkersToDefault, populateInfowindow, getStreetView and weatherInfo bindings.
  * if weatherInfo loaded failed, it will handle error by exiting code
  */
  var ViewModel = function() {
    var self = this;

    // Create markers when initialize the app -- Udacity Course
    this.createMarkers = function() {
      for (var i = 0; i < locations.length; i++) {
        var position = locations[i].location;
        var title = locations[i].title;
        // Create a marker per location, and put into markers array
        var marker = new google.maps.Marker({
          map: map,
          position: position,
          title: title,
          animation: google.maps.Animation.DROP,
          id: i,
          details: ko.observable('')
        });
        // Load data asynchronously form Foursquare
        foursquareInfos(locations[i], marker.details);
        // Push the marker to our array of markers
        markers.push(marker);
        // Create an onclick event to open an infowindow at each marker
        marker.addListener('click', function() {
          self.toggleBounce(this);
          self.populateInfowindow(this, largeInfowindow);
        });
        // Create an mouseover event to change default icon to flagIcon at each marker
        marker.addListener('mouseover', function() {
          this.setIcon(flagIcon);
        });
        // When an mouseout event happen, reset this marker icon to default
        // if there isn't any animation on this marker
        marker.addListener('mouseout', function() {
          if (this.getAnimation() === null) {
            this.setIcon(null);
          }
        });
        // Adjust the boundaries of the map for each marker
        bounds.extend(marker.position);
      }
      // Adjust to make boundaries fit the map
      map.fitBounds(bounds);
    };

    // Execute createMarkers
    this.createMarkers();

    // Toggle this marker icon's bounce state when an click event happen on it
    this.toggleBounce = function(marker) {
      // Stop other marker icon's animation and set their icon to default
      for (var i = 0; i < markers.length; i++) {
        markers[i].setAnimation(null);
        markers[i].setIcon(null);
      }
      // If there is animation on this marker
      if (marker.getAnimation() !== null) {
        // Set animation to null
        marker.setAnimation(null);
      } else {
        // otherwise, set bounce animation on it and change its icon to flagIcon
        marker.setAnimation(google.maps.Animation.BOUNCE);
        marker.setIcon(flagIcon);
      }
    }

    // All default location titles will be listed in ul element at first
    // then, they will be filtered according to the value of search filter input,
    // all place items except the matched parts will disappear
    this.searchInput = ko.observable('');
    this.placesList = ko.dependentObservable(function() {
      var search = self.searchInput().toUpperCase();
        return ko.utils.arrayFilter(locations, function(location) {
          return location.title.toUpperCase().indexOf(search) >= 0;
        });
    });

    // Click a place item to see its streetview and other infos ,its associate marker icon will be animate to flagIcon
    // All bounce animation will stop, Other markers will disappear to Highlight the selected place
    this.selectPlace = function(selectedPlace) {
      for (var i = 0; i < markers.length; i++) {
        markers[i].setAnimation(null);
        markers[i].setIcon(null);
        if (markers[i].title == selectedPlace.title) {
          markers[i].setIcon(flagIcon);
          markers[i].setMap(map);
          self.populateInfowindow(markers[i], largeInfowindow);
        }
      }
    };

    // Filter Markers if its associated place item value don't contain the value of search input
    this.filterMarker = function() {
      var filterInput = self.searchInput();
      for (i = 0; i < markers.length; i++) {
        if (markers[i].title.toUpperCase().indexOf(filterInput.toUpperCase()) > -1) {
          markers[i].setVisible(true);
        } else {
          markers[i].setVisible(false);
        }
      }
    };

    // Reset markers icons to default, clear the value of search input and close largeInfowindow
    // if clear-search span has been clicked
    this.resetMarkersToDefault = function() {
      for (var i = 0; i < markers.length; i++) {
        markers[i].setIcon(null);
        markers[i].setMap(map);
      }
      largeInfowindow.close();
      self.searchInput('');
      this.filterMarker();
    };

    // This function populate the infowindow when the marker is clicked. We will only allow
    // one infowindow which will open at the marker that is clicked, and populate based
    // on that markers position -- Udacity comments
    this.populateInfowindow = function(marker, infowindow) {
      // Check to make sure the infowindow is not already opened on this marker.
      if (infowindow.marker != marker) {
        // Clear the infowindow content to reload new streetview.
        infowindow.setContent('');
        infowindow.marker = marker;
        // Make sure the marker property is cleared, maker icons back to default if the infowindow is closed.
        infowindow.addListener('closeclick', function() {
          for (var i = 0; i < markers.length; i++) {
            markers[i].setIcon(null);
          }
          infowindow.marker = null;
          self.filterMarker();
        });
        // Get Street View in largeInfowindow
        // as street view comments, marker.details() which stored location datas from Foursquare
        // has also been put into largeInfowindow.
        // Handle error, show 'No Street View Found' prompt when fail to load Street View
        function getStreetView (data, status) {
          if (status == google.maps.StreetViewStatus.OK) {
            var nearStreetViewLocation = data.location.latLng;
            largeInfowindow.setContent('<div>' + marker.details() + '</div><div id="pano"></div>');
            var panoramaOptions = {
              // Stree view position
              position: nearStreetViewLocation,
              // Set angle of view
              pov: {
                heading: 100,
                pitch: 30
              }
            };
            var panorama = new google.maps.StreetViewPanorama(
              document.getElementById('pano'), panoramaOptions);
          } else {
            largeInfowindow.setContent('<div>No Street View Found</div>');
          }
        };
        // Get Google map's StreetViewService
        var streetViewService = new google.maps.StreetViewService();
        // Use streetview service to get the closest streetview image within
        // 50 meters of the markers position
        var radius = 50;
        streetViewService.getPanoramaByLocation(marker.position, radius, getStreetView);
        // Open the infowindow on the correct marker.
        infowindow.open(map, marker);
      }
    };

    // if weather API loaded failed, use return to exit code
    ;(function() {
      if (weatherInfo) {
        this.weatherInfo = new Weather(weatherInfo);
      } else {
        return;
      }
    })();
  }


  /**
   * @description
   * Display error info when map data can't be loaded
   * Fill the map div with the error information.
   */
    var handleMapLoadError = function() {
      var mapContainer = $('#map')[0];
      var errorInfoContainer = $('<div id="error-info"></div>');
      errorInfoContainer.css({
        'position': 'absolute',
        'left': '0',
        'right': '0',
        'top': '0',
        'bottom': '0',
        'textAlign': 'center'
      });
      errorInfoContainer.html(
        '<span class="map-error-info"> Map could not get loaded </span>' +
        '<span class="map-error-info"> Please check network or firewall </span>'
      );
      mapContainer.append(errorInfoContainer[0]);
    };
