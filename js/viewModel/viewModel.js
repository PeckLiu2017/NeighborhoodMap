  // Create a map object and specify the DOM element for display.
  map = new google.maps.Map(document.getElementById('map'), {
    center: {
      lat: 40.7413549,
      lng: -73.9980244
    },
    // center: {lat: 31.8390, lng: 117.2576},
    styles: styles,
    mapTypeControl: false,
    zoom: 13
  });

  // Create infowindow
  largeInfowindow = new google.maps.InfoWindow();

  // Style the markers a bit. This will be our listing marker icon.
  flagIcon = markMarkerIcon('0091ff');

  function createMarkers(places) {
    // Extend the boundaries of the map for each marker and display the marker
    bounds = new google.maps.LatLngBounds();
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
        populateInfowindow(this, largeInfowindow);
      });
      marker.addListener('mouseover', function() {
        this.setIcon(flagIcon);
      });
      marker.addListener('mouseout', function() {
        this.setIcon(null);
      });
      bounds.extend(marker.position);
    }
    map.fitBounds(bounds);
  }

  createMarkers(locations);
  // document.getElementById('show-listings').addEventListener('click', showListings);
  // document.getElementById('hide-listings').addEventListener('click', hideListings);
  // document.getElementById('search-input').addEventListener('keyup', filterPlace);

  document.getElementById('clear-search').addEventListener('click', resetMarkersToDefault);

  function resetMarkersToDefault() {
    for (var i = 0; i < markers.length; i++) {
      markers[i].setIcon(null);
      markers[i].setMap(map);
    }
    largeInfowindow.open(null, null);
    $('.search-input').val('');
    filterPlace();
  }

  // This function populate the infowindow when the marker is clicked. We will only allow
  // one infowindow which will open at the marker that is clicked, and populate based
  // on that markers position
  function populateInfowindow(marker, infowindow) {
    // Check to make sure the infowindow is not already opened on this marker.
    if (infowindow.marker != marker) {
      // Clear the infowindow content to give the streetview time to load.
      infowindow.setContent('');
      infowindow.marker = marker;
      // Make sure the marker property is cleared if the infowindow is closed.
      infowindow.addListener('closeclick', function() {
        for (var i = 0; i < markers.length; i++) {
          markers[i].setIcon(null);
          markers[i].setMap(map);
        }
        infowindow.marker = null;
        filterPlace();
      });
      var streetViewService = new google.maps.StreetViewService();
      var radius = 50;
      // In case the status is OK, which means the pano was found, compute the
      // position of the streetview image, then calculate the heading, then get a
      // panorama from that and set the options
      function getStreetView(data, status) {
        if (status == google.maps.StreetViewStatus.OK) {
          var nearStreetViewLocation = data.location.latLng;
          var heading = google.maps.geometry.spherical.computeHeading(
            nearStreetViewLocation, marker.position);
          infowindow.setContent('<div>' + marker.title + '</div><div id="pano"></div>');
          var panoramaOptions = {
            position: nearStreetViewLocation,
            pov: {
              heading: heading,
              pitch: 30
            }
          };
          var panorama = new google.maps.StreetViewPanorama(
            document.getElementById('pano'), panoramaOptions);
        } else {
          infowindow.setContent('<div>' + marker.title + '</div>' +
            '<div>No Street View Found</div>');
        }
      }
      // Use streetview service to get the closest streetview image within
      // 50 meters of the markers position
      streetViewService.getPanoramaByLocation(marker.position, radius, getStreetView);
      // Open the infowindow on the correct marker.
      infowindow.open(map, marker);
    }
  }

  // This function will loop through the markers array and display them all
  function showListings() {
    // Extend the boundaries of the map for each marker and display the marker
    var bounds = new google.maps.LatLngBounds();
    for (var i = 0; i < markers.length; i++) {
      markers[i].setMap(map);
      // Extend the boundaries of the map for each marker
      bounds.extend(markers[i].position);
    }
    map.fitBounds(bounds);
  }

  // This function will loop through the markers array and hide them all
  function hideListings() {
    for (var i = 0; i < markers.length; i++) {
      markers[i].setMap(null);
    }
  }

  // Filter Places according to filter input field
  function filterPlace() {
    var filterInput = $('.search-input').get(0);
    for (i = 0; i < placesToBeFilter.length; i++) {
      if (placesToBeFilter[i].innerHTML.toUpperCase().indexOf(filterInput.value.toUpperCase()) > -1) {
        placesToBeFilter[i].style.display = "";
      } else {
        placesToBeFilter[i].style.display = "none";
      }
    }
    filterMarker();
  }

  // Filter Markers according to filter input field
  function filterMarker() {
    var filterInput = $('.search-input').get(0);
    for (i = 0; i < markers.length; i++) {
      if (markers[i].title.toUpperCase().indexOf(filterInput.value.toUpperCase()) > -1) {
        markers[i].setMap(map);
      } else {
        markers[i].setMap(null);
      }
    }
  }

  // marker Icon
  function markMarkerIcon(markerColor) {
    var markerImage = new google.maps.MarkerImage(
      'image/beachflag.png',
      new google.maps.Size(31, 34),
      new google.maps.Point(0, 0),
      new google.maps.Point(10, 34),
      new google.maps.Size(21, 34));
    return markerImage;
  }

let ViewModel = function() {
  var self = this;
  this.placesList = ko.observableArray([]);
  locations.forEach(function(locationItem) {
    self.placesList.push(new Location(locationItem));
  });

  // Click a place to change its marker icon ,see its streetview and other infos
  this.selectPlace = function (selectedPlace) {
    for (var i = 0; i < markers.length; i++) {
      if (markers[i].title == selectedPlace.title) {
        markers[i].setIcon(flagIcon);
        markers[i].setMap(map);
        populateInfowindow(markers[i], largeInfowindow);
      } else {
        markers[i].setIcon(null);
        markers[i].setMap(null);
      }
    }
  };

}

ko.applyBindings(new ViewModel());
