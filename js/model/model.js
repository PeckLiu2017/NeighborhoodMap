/**
 *  ============================================================================================
 *  @description This file store locations and map style datas as well as create Class Location
 *  and Class Weather
 *  ============================================================================================
 */


/**
 *  @description location datas form Udacity course
 */
var locations = [{
    title: 'Park Ave Penthouse',
    location: {
      lat: 40.7713024,
      lng: -73.9632393
    }
  },
  {
    title: 'Chelsea Loft',
    location: {
      lat: 40.7444883,
      lng: -73.9949465
    }
  },
  {
    title: 'Union Square Open Floor Plan',
    location: {
      lat: 40.7347062,
      lng: -73.9895759
    }
  },
  {
    title: 'East Village Hip Studio',
    location: {
      lat: 40.7281777,
      lng: -73.984377
    }
  },
  {
    title: 'The Spotted Pig',
    location: {
      lat: 40.7356067,
      lng: -74.0066706
    }
  },
  {
    title: 'Tenement Museum',
    location: {
      lat: 40.7187958,
      lng: -73.99006969999999
    }
  }
];

/**
 *  @description style datas form Udacity course
 *  it will be used to create a new StyledMapType object that passing it as an array of styles
 */
var styles = [{
    elementType: 'geometry',
    stylers: [{
      color: '#ebe3cd'
    }]
  },
  {
    elementType: 'labels.text.fill',
    stylers: [{
      color: '#523735'
    }]
  },
  {
    elementType: 'labels.text.stroke',
    stylers: [{
      color: '#f5f1e6'
    }]
  },
  {
    featureType: 'administrative',
    elementType: 'geometry.stroke',
    stylers: [{
      color: '#c9b2a6'
    }]
  },
  {
    featureType: 'administrative.land_parcel',
    elementType: 'geometry.stroke',
    stylers: [{
      color: '#dcd2be'
    }]
  },
  {
    featureType: 'administrative.land_parcel',
    elementType: 'labels.text.fill',
    stylers: [{
      color: '#ae9e90'
    }]
  },
  {
    featureType: 'landscape.natural',
    elementType: 'geometry',
    stylers: [{
      color: '#dfd2ae'
    }]
  },
  {
    featureType: 'poi',
    elementType: 'geometry',
    stylers: [{
      color: '#dfd2ae'
    }]
  },
  {
    featureType: 'poi',
    elementType: 'labels.text.fill',
    stylers: [{
      color: '#93817c'
    }]
  },
  {
    featureType: 'poi.park',
    elementType: 'geometry.fill',
    stylers: [{
      color: '#a5b076'
    }]
  },
  {
    featureType: 'poi.park',
    elementType: 'labels.text.fill',
    stylers: [{
      color: '#447530'
    }]
  },
  {
    featureType: 'road',
    elementType: 'geometry',
    stylers: [{
      color: '#f5f1e6'
    }]
  },
  {
    featureType: 'road.arterial',
    elementType: 'geometry',
    stylers: [{
      color: '#fdfcf8'
    }]
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry',
    stylers: [{
      color: '#f8c967'
    }]
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry.stroke',
    stylers: [{
      color: '#e9bc62'
    }]
  },
  {
    featureType: 'road.highway.controlled_access',
    elementType: 'geometry',
    stylers: [{
      color: '#e98d58'
    }]
  },
  {
    featureType: 'road.highway.controlled_access',
    elementType: 'geometry.stroke',
    stylers: [{
      color: '#db8555'
    }]
  },
  {
    featureType: 'road.local',
    elementType: 'labels.text.fill',
    stylers: [{
      color: '#806b63'
    }]
  },
  {
    featureType: 'transit.line',
    elementType: 'geometry',
    stylers: [{
      color: '#dfd2ae'
    }]
  },
  {
    featureType: 'transit.line',
    elementType: 'labels.text.fill',
    stylers: [{
      color: '#8f7d77'
    }]
  },
  {
    featureType: 'transit.line',
    elementType: 'labels.text.stroke',
    stylers: [{
      color: '#ebe3cd'
    }]
  },
  {
    featureType: 'transit.station',
    elementType: 'geometry',
    stylers: [{
      color: '#dfd2ae'
    }]
  },
  {
    featureType: 'water',
    elementType: 'geometry.fill',
    stylers: [{
      color: '#b9d3c2'
    }]
  },
  {
    featureType: 'water',
    elementType: 'labels.text.fill',
    stylers: [{
      color: '#92998d'
    }]
  }
];


/**
 *  @description Use konckout to manage Class Location
 */
var Location = function(data) {
  this.title = data.title;
  this.location = data.location;
};

/**
 *  @description Use konckout to manage Class Weather
 */
var Weather = function(data) {
  this.city = data.name;
  this.temp = data.main.temp + '℉';
  this.description = data.weather[0].description;
  this.icon = 'http://openweathermap.org/img/w/' + data.weather[0].icon + '.png';
};
