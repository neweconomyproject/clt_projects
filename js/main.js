// Load map
var map = L.map('map', {
  center: [40.708020, -73.986775],
  zoom: 11,
  zoomControl: false
});

// Add zoom control top right
L.control.zoom({
  position: 'topright'
}).addTo(map);

//load leaflet map
var Stamen_TonerLite = L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
  attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  subdomains: 'abcd',
  minZoom: 0,
  maxZoom: 20,
  ext: 'png'
}).addTo(map);

// Create a geocoding control and add it to the new div in the sidebar
var geocoderContainer = L.DomUtil.get('geocoder-container');
var geocoder = L.Control.geocoder({
  defaultMarkGeocode: false
}).on('markgeocode', function (e) {
  if (currentMarker) {
    map.removeLayer(currentMarker);
  }
  currentMarker = L.marker(e.geocode.center).addTo(map);

  // Check if the marker is touching or intersecting with any GeoJSON layer
  var touchingGeoJSON = getTouchingGeoJSON(currentMarker);
  if (touchingGeoJSON) {
    // Print the message in the sidebar
    var sidebarContent = document.getElementById('sidebar-content');
    sidebarContent.innerHTML =
      "Your address is contained within " + touchingGeoJSON.join(', ');
  } else {
    // If not touching any GeoJSON, you can clear the sidebar content
    var sidebarContent = document.getElementById('sidebar-content');
    sidebarContent.innerHTML = "";
  }
}).addTo(map);

//define the above function getTouchingGeoJson which identifies if the marker is touching a geojson and returns the name of the Geojson the marker is touching
function getTouchingGeoJSON(marker) {
  var touchingLayers = [];

  //These are the ones that ONLY polygons
  var geojsonSources2 = {
    "bkLVLup": bkLVLup,
    "BronxCLT": BronxCLT,
    "brownsville": brownsville,
    "centralBK": centralBK,
    "chhaya": chhaya,
    "chinatown": chinatown,
    "cooperSQ": cooperSQ,
    "EastHarlem": EastHarlem,
    "EastNY": EastNY,
    "MaryMitchell": MaryMitchell,
    "MottHaven": MottHaven,
    "NorthernManhattan": NorthernManhattan,
    "northfield": northfield,
    "ravenswood": ravenswood,
    "realE": realE,
    "WeStay": WeStay,
    "WesternQueens": WesternQueens,
  };

  // Iterate through each GeoJSON layer
  for (var geojsonName in geojsonSources2) {
    if (geojsonSources2.hasOwnProperty(geojsonName)) {
      var geojsonLayer = L.geoJSON(geojsonSources2[geojsonName]);

      // Check if the marker is touching or intersecting with any of the polygons
      if (isMarkerTouchingGeoJSON(marker, geojsonLayer)) {
        touchingLayers.push(geojsonnames[geojsonName]); // Add the name of the GeoJSON layer to the array
      }
    }
  }
  return touchingLayers.length > 0 ? touchingLayers : null; // Return the array of names or null if not touching any GeoJSON
}

// Function to check if a marker is touching or intersecting with a GeoJSON
function isMarkerTouchingGeoJSON(marker, geoJSON) {
  // Check if the marker is touching or intersecting with any of the polygons
  return geoJSON.getLayers().some(function (polygon) {
    return (
      polygon.getBounds().contains(marker.getLatLng()) ||
      polygon.getBounds().intersects(marker.getLatLng().toBounds(1))
    );
  });
}

// Append the geocoder container to the sidebar
geocoderContainer.appendChild(geocoder.getContainer());
var currentMarker = null; // To track the currently added marker

// Control map
function changeMapState(src, tgt) {
  if (tgt && src) {
    tgt.setView(src.getCenter(), src.getZoom());
  }
}

map.on('moveend', function (e) {
  changeMapState(map);
});


// Add CLT catchment areas
var features = [];
features = CLT.features;
newArray = [];
for (var i = 0; i < features.length; i = i + 1) {
  newArray.push(Object.values(features[i]));
}

// Add and remove marker functions
var addToMap = function () {
  markers.forEach(function (marker) {
    marker.addTo(map);
  });
};

//these are the ones that are polygons and points
var geojsonSources = {
  "bkLVLup": bkLVLup,
  "BronxCLT2": BronxCLT2,
  "brownsville": brownsville,
  "centralBK": centralBK,
  "chhaya": chhaya,
  "chinatown": chinatown,
  "cooperSQ": cooperSQ,
  "EastHarlem2": EastHarlem2,
  "EastNY": EastNY,
  "MaryMitchell": MaryMitchell,
  "MottHaven": MottHaven,
  "NorthernManhattan": NorthernManhattan,
  "northfield": northfield,
  "ravenswood": ravenswood,
  "realE": realE,
  "WeStay": WeStay,
  "WesternQueens2": WesternQueens2, 
};

//these are the js file name on left and actual name on right
var geojsonnames = {
  "bkLVLup": "Brooklyn Level Up",
  "BronxCLT2": "Bronx CLT",
  "brownsville": "Brownsville CLT",
  "centralBK": "Central Brooklyn CLT",
  "chhaya": "Chhaya CDC",
  "chinatown": "Chinatown CLT",
  "cooperSQ": "Cooper Square CLT",
  "EastHarlem2": "East Harlem El Barrio CLT",
  "EastNY": "East New York CLT",
  "MaryMitchell": "Mary Mitchell Family & Youth Center",
  "MottHaven": "Mott Haven Port Morris Community Land Stewards",
  "NorthernManhattan": "Northern Manhattan CLT",
  "northfield": "Northfield",
  "ravenswood": "Ravenswood",
  "realE": "ReAL Edgemere CLT",
  "WeStay": "We Stay/Nos Quedamos",
  "WesternQueens2": "Western Queens CLT"
};
var markers = [];
var currentGeoJSONLayer = null; // To track the currently displayed GeoJSON layer

var sidebarContent = document.getElementById('sidebar-content');

//define icon style
var blackIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-black.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

var greyIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-grey.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

var yellowIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-yellow.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [12.5, 20.5],
  iconAnchor: [6, 20.5],
  popupAnchor: [.5, -17],
  shadowSize: [20.5, 20.5]
});

var currentSelectedMarker = null; // Keep track of the currently selected marker

// Function to handle GeoJSON layers with custom styling
function handleGeoJSONLayer(geojsonName) {
  if (geojsonName && geojsonSources.hasOwnProperty(geojsonName)) {
    if (currentGeoJSONLayer) {
      map.removeLayer(currentGeoJSONLayer);
    }

    // Create GeoJSON layer with custom style
    currentGeoJSONLayer = L.geoJSON(geojsonSources[geojsonName], {
      style: {
        fillColor: 'lightgray',  
        color: 'darkgray',       
        weight: 1                
      },
      pointToLayer: function (feature, latlng) {
        return L.marker(latlng, { icon: yellowIcon });
      }
    }).addTo(map);
  }
}

// Modify the marker click event to call the handleGeoJSONLayer function
newArray.forEach((element, i) => {
  var marker = L.marker([element[2].coordinates[1], element[2].coordinates[0]], { icon: blackIcon }).addTo(map);

  function markerClickHandler() {
    // Check if there's a previously selected marker
    if (currentSelectedMarker) {
      // Reset the icon of the previously selected marker to black
      currentSelectedMarker.setIcon(blackIcon);
    }
    // Set the icon of the clicked marker to grey
    marker.setIcon(greyIcon);
    // Update the currently selected marker
    currentSelectedMarker = marker;
    // Clear previous content in the sidebar
    sidebarContent.innerHTML = "";
    // Add information to the sidebar
    var content =
      "<div class='sidebar-info'>" +
      "<h2 class='sidebar-name'>" + element[1].Name + "</h2>" +
      "<a class='sidebar-website' href='https://" + element[1].Website + "' target='_blank'>" + element[1].Website + "</a>" +
      "<p class='sidebar-description'>" + element[1].Description + "</p>" +
      "<img src='" + element[1].Image + "' class='sidebar-image' />" +
      "</div>";
    sidebarContent.innerHTML = content;
    // Handle GeoJSON layers with custom styling
    var geojsonName = element[1].Catchment;
    handleGeoJSONLayer(geojsonName);
  }

  // Remove existing click event listeners
  marker.off('click', markerClickHandler);

  // Add new click event listener
  marker.on('click', markerClickHandler);

  markers.push(marker);
});

// Add the markers to the map
addToMap();
