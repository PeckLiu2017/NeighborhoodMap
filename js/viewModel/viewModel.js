/**
 *  =================================================================================
 *  @description
 *  Code in this file handle load Google Map API asynchronously to get map service
 *  and create ViewModel managed by knockout.js
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
 * And then ,use getWeather() to load weather data knockout.js to manage viewModel by ko.applyBindings(new ViewModel());
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

    // Style the markers a bit. This will be my animation marker icon
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

  };

  // Load weather data form OpenWeatherMap
  getWeather();

  /**
    * @description
    * Function getWeather load weather data form OpenWeatherMap asynchronously
    * And then ,use knockout.js to manage viewModel by ko.applyBindings(new ViewModel());
    */
  function getWeather() {
    $.getJSON("http://api.openweathermap.org/data/2.5/weather?q=New%20York&APPID=6e60598959607c579f6ccf9bb51890b", function(json) {
       weatherInfo = JSON.parse(JSON.stringify(json));
       ko.applyBindings(new ViewModel());
     }).fail(function(){
       ko.applyBindings(new ViewModel());
       $('.weather').css('height','50%').text('Something went wrong about weather info');
     });
  };


/**
  * @description
  * ViewModel contains code about createMarkers, selectPlace, filterPlace, filterMarker, resetMarkersToDefault
  * populateInfowindow, getStreetView and weatherInfo bindings.
  * if weatherInfo loaded failed, it will handle error by exiting code
  */
  var ViewModel = function() {
    var self = this;
    // Push all default location titles will be listed in ul element into placesList
    this.placesList = ko.observableArray([]);
    locations.forEach(function(locationItem) {
      self.placesList.push(new Location(locationItem));
    });

    // Create markers when initialize the app
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
          id: i
        });
        // Push the marker to our array of markers
        markers.push(marker);
        // Create an onclick event to open an infowindow at each marker
        marker.addListener('click', function() {
          self.populateInfowindow(this, largeInfowindow);
        });
        // Create an mouseover event to change default icon to flagIcon at each marker
        marker.addListener('mouseover', function() {
          this.setIcon(flagIcon);
        });
        // Create an mouseout event to reset all marker icon to default
        marker.addListener('mouseout', function() {
          this.setIcon(null);
        });
        // Adjust the boundaries of the map for each marker
        bounds.extend(marker.position);
      }
      // Adjust to make boundaries fit the map
      map.fitBounds(bounds);
    };

    // Execute createMarkers
    this.createMarkers();

    // Click a place item to see its streetview and other infos ,its associate marker icon will be animate to flagIcon
    // Other markers will disappear to Highlight the selected place
    this.selectPlace = function(selectedPlace) {
      for (var i = 0; i < markers.length; i++) {
        if (markers[i].title == selectedPlace.title) {
          markers[i].setIcon(flagIcon);
          markers[i].setMap(map);
          self.populateInfowindow(markers[i], largeInfowindow);
        } else {
          markers[i].setIcon(null);
          markers[i].setMap(null);
        }
      }
    };

    // Watch the value of search input
    this.searchInput = ko.observable('');

    // Filter place in the placelists,
    // all place items except the selected one will disappear by set its display attriabute to none
    this.filterPlace = function() {
      var filterInput = self.searchInput();
      var placesToBeFilter = $('.places').find('li');
      for (i = 0; i < placesToBeFilter.length; i++) {
        if (placesToBeFilter[i].innerHTML.toUpperCase().indexOf(filterInput.toUpperCase()) > -1) {
          placesToBeFilter[i].style.display = "";
        } else {
          placesToBeFilter[i].style.display = "none";
        }
      }
      this.filterMarker();
    };

    // Filter Markers if its associated place item value don't contain the value of search input
    this.filterMarker = function() {
      var filterInput = self.searchInput();
      for (i = 0; i < markers.length; i++) {
        if (markers[i].title.toUpperCase().indexOf(filterInput.toUpperCase()) > -1) {
          markers[i].setMap(map);
        } else {
          markers[i].setMap(null);
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
      $('.search-input').val('');
      self.searchInput = ko.observable('');
      this.filterPlace();
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
            markers[i].setMap(map);
          }
          infowindow.marker = null;
          self.filterPlace();
        });
        // Get Google map's StreetViewService
        var streetViewService = new google.maps.StreetViewService();
        // Use streetview service to get the closest streetview image within
        // 50 meters of the markers position
        var radius = 50;
        streetViewService.getPanoramaByLocation(marker.position, radius, self.getStreetView);
        // Open the infowindow on the correct marker.
        infowindow.open(map, marker);
      }
    };

    // In case the status is OK, which means the pano was found, compute the
    // position of the streetview image, then calculate the heading, then get a
    // panorama from that and set the options
    // Otherwise, show 'No Street View Found' prompt
    this.getStreetView = function(data, status) {
      if (status == google.maps.StreetViewStatus.OK) {
        var nearStreetViewLocation = data.location.latLng;
        largeInfowindow.setContent('<div>' + 'Neighborhood And Nearby Area' + '</div><div id="pano"></div>');
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
