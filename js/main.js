//load map
var map = L.map('map', {
  center: [40.708020, -73.986775],
  zoom: 11,
  zoomControl: false
});

//add zoom control top right
L.control.zoom({
  position:'topright'
}).addTo(map);

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
  // Your existing code for handling the geocode result
  if (currentMarker) {
    map.removeLayer(currentMarker);
  }

  currentMarker = L.marker(e.geocode.center).addTo(map);

  // Check if the marker is touching or intersecting with any GeoJSON layer
  var touchingGeoJSON = getTouchingGeoJSON(currentMarker);

  if (touchingGeoJSON) {
    // Print the message in the sidebar
    var sidebarContent = document.getElementById('sidebar-content');
    sidebarContent.innerHTML = "Your address is contained within " + touchingGeoJSON;
  } else {
    // If not touching any GeoJSON, you can clear the sidebar content
    var sidebarContent = document.getElementById('sidebar-content');
    sidebarContent.innerHTML = "";
  }
}).addTo(map);

// Function to check if a marker is touching or intersecting with any GeoJSON
function getTouchingGeoJSON(marker) {
  // Iterate through each GeoJSON layer
  for (var geojsonName in geojsonSources) {
    if (geojsonSources.hasOwnProperty(geojsonName)) {
      var geojsonLayer = L.geoJSON(geojsonSources[geojsonName]);

      // Check if the marker is touching or intersecting with any of the polygons
      if (isMarkerTouchingGeoJSON(marker, geojsonLayer)) {
        return geojsonName; // Return the name of the GeoJSON layer
      }
    }
  }

  return null; // Return null if not touching any GeoJSON
}

// Function to check if a marker is touching or intersecting with a GeoJSON
function isMarkerTouchingGeoJSON(marker, geoJSON) {
  // Check if the marker is touching or intersecting with any of the polygons
  return geoJSON.getLayers().some(function (polygon) {
    return polygon.getBounds().contains(marker.getLatLng()) || polygon.getBounds().intersects(marker.getLatLng().toBounds(1));
  });
}

// Append the geocoder container to the sidebar
geocoderContainer.appendChild(geocoder.getContainer());

var currentMarker = null; // To track the currently added marker



//control map
function changeMapState(src,tgt){
  tgt.setZoom(src.getZoom());
  tgt.panTo(src.getCenter());
}

map.on('moveend', function(e) {
  changeMapState(map);

});


//FIRE STATIONS
//load fire stations
var features = [];
features = FireStations.features;
newArray = []
for (var i = 0; i < features.length; i = i + 1 ) {  
  newArray.push(Object.values(features[i]))
  };

//add and remove marker functions
var addToMap = function(){markers.forEach(function(marker){marker.addTo(map)})}
var removeMap = function(){markers.forEach(function(marker){map.removeLayer(marker)})}



//create markers
// var markers =[];
// newArray.forEach((element, i) => 
// markers[i] =   L.marker([element[2].coordinates[1], element[2].coordinates[0]],{icon: L.icon({  
//  iconUrl: 'images/fire-station.png', iconSize: [25, 25]})}).bindPopup(element[1].Name+"<br>"+element[1].Website.link("https://"+element[1].Website)+"<br>"+element[1].Description+"<br>"+"<img src='" + element[1].Image + "'" + " class=popupImage " + "/>").addTo(map))
//  removeMap()

var geojsonSources = {
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
  //"NorthernManhattan": NorthernManhattan,
   "northfield": northfield,
   "ravenswood": ravenswood,
  "realE": realE,
   "WeStay": WeStay,
  "WesternQueens": WesternQueens,
};

var markers = [];
var currentGeoJSONLayer = null; // To track the currently displayed GeoJSON layer

var sidebarContent = document.getElementById('sidebar-content');


newArray.forEach((element, i) => {
    var marker = L.marker([element[2].coordinates[1], element[2].coordinates[0]], {
        icon: L.icon({
            iconUrl: 'images/fire-station.png',
            iconSize: [25, 25]
        })
    }).bindPopup(element[1].Name + "<br>" + element[1].Website.link("https://" + element[1].Website) + "<br>" + element[1].Description + "<br>" + "<img src='" + element[1].Image + "'" + " class=popupImage " + "/").addTo(map);

    // Add a click event to load and display the GeoJSON when the marker is clicked
    marker.on('click', function () {
      // Clear previous content in the sidebar
      sidebarContent.innerHTML = "";

      // Add information to the sidebar
      var content = "<strong>Name:</strong> " + element[1].Name + "<br>" +
          "<strong>Website:</strong> <a href='https://" + element[1].Website + "' target='_blank'>" + element[1].Website + "</a><br>" +
          "<strong>Description:</strong> " + element[1].Description + "<br>" +
          "<strong>Image:</strong> <img src='" + element[1].Image + "' class='popupImage' />";

      sidebarContent.innerHTML = content;

      // Optionally, you can add code to handle GeoJSON layers here if needed
        var geojsonName = element[1].Catchment;
        if (geojsonName && geojsonSources.hasOwnProperty(geojsonName)) {
            if (currentGeoJSONLayer) {
                map.removeLayer(currentGeoJSONLayer); // Remove the currently displayed GeoJSON layer
            }
            currentGeoJSONLayer = L.geoJSON(geojsonSources[geojsonName]).addTo(map);
        }
    });

    markers.push(marker);
});




// hide and show fire station markers
// function showFireStations() {
// if(map.hasLayer(markers[0])==true){
//   removeMap()
// }
// else{
//   addToMap()
// }}

addToMap()





//FIRE DISTRICTS
//neutral style
function styleb(feature) {
  return {
      fillColor: "#d3d3d3",
      weight: .6,
      opacity: 1,
      color: 'black',
      fillOpacity: 0.7
  };
}

//hide and show fire districts
var FireDistrictsLayer= L.geoJSON(FireDistricts, {style: styleb,
  onEachFeature: function (feature, layer) {
    layer.bindPopup('District:'+feature.properties.DistName+"<br>"+'Budget: '+feature.properties.Budget+"<br>"+
    'Average Busy Minutes: '+feature.properties.AvgBusyMin+"<br>"+'Annual Busy Hours: '+feature.properties.AnBusyHour+"<br>"+
    "Total Staff: "+feature.properties.TotStaff+"<br>"+
    "Percent Career: "+feature.properties.PerCareer+"<br>"+
    "Average Predicted Risk: "+feature.properties.RiskMean + "<br>"+
    "Average Predicted Risk (normalized): "+feature.properties.RiskMeanNo);
  }
});
var FireDistrictsLayer2= L.geoJSON(FireDistricts, {style: styleb,
  onEachFeature: function (feature, layer) {
    layer.bindPopup('District:'+feature.properties.DistName+"<br>"+'Budget: '+feature.properties.Budget+"<br>"+
    'Average Busy Minutes: '+feature.properties.AvgBusyMin+"<br>"+'Annual Busy Hours: '+feature.properties.AnBusyHour+"<br>"+
    "Total Staff: "+feature.properties.TotStaff+"<br>"+
    "Percent Career: "+feature.properties.PerCareer+"<br>"+
    "Average Predicted Risk: "+feature.properties.RiskMean + "<br>"+
    "Average Predicted Risk (normalized): "+feature.properties.RiskMeanNo);
  }
});
function showFireDistricts() {
if(map.hasLayer(FireDistrictsLayer)==true){
  map.removeLayer(FireDistrictsLayer)
  x = document.getElementById("legend-gradient");
    x.style.display = 'none';
  y = document.getElementById("table");
  y.style.display = 'none';
  y2 = document.getElementById("table2");
  y2.style.display = 'none';
}
else{
  FireDistrictsLayer= L.geoJSON(FireDistricts, {style: styleb,
    onEachFeature: function (feature, layer) {
      layer.bindPopup('District:'+feature.properties.DistName+"<br>"+'Budget: '+feature.properties.Budget+"<br>"+
      'Average Busy Minutes: '+feature.properties.AvgBusyMin+"<br>"+'Annual Busy Hours: '+feature.properties.AnBusyHour+"<br>"+
      "Total Staff: "+feature.properties.TotStaff+"<br>"+
      "Percent Career: "+feature.properties.PerCareer+"<br>"+
      "Median Predicted Risk: "+feature.properties.RiskMed+ "<br>"+
      "Median Predicted Risk (normalized): "+feature.properties.RiskMedNo);
    }
  });
  map.addLayer(FireDistrictsLayer)
}
if(map2.hasLayer(FireDistrictsLayer2)==true){
  map2.removeLayer(FireDistrictsLayer2)
}
else{
  FireDistrictsLayer2= L.geoJSON(FireDistricts, {style: styleb,
    onEachFeature: function (feature, layer) {
      layer.bindPopup('District:'+feature.properties.DistName+"<br>"+'Budget: '+feature.properties.Budget+"<br>"+
      'Average Busy Minutes: '+feature.properties.AvgBusyMin+"<br>"+'Annual Busy Hours: '+feature.properties.AnBusyHour+"<br>"+
      "Total Staff: "+feature.properties.TotStaff+"<br>"+
      "Percent Career: "+feature.properties.PerCareer+"<br>"+
      "Median Predicted Risk: "+feature.properties.RiskMed+ "<br>"+
      "Median Predicted Risk (normalized): "+feature.properties.RiskMedNo);
    }
  });
  map2.addLayer(FireDistrictsLayer2)
}
}


//show about page 
function showAbout() {
  var x = document.getElementById("about");
  var y = document.getElementById("markdown");
  y.style.display ="none";
  if(x.style.display == 'block')
  x.style.display = 'none';
  else
  x.style.display = 'block';
  }

//show home page
function showHome() {
  var x = document.getElementById("about");
  var y = document.getElementById("markdown");
  x.style.display = "none";
  y.style.display ="none";

}


//show and get rid of modal page
function showModal() {
  var x = document.getElementById("modal");
  if(x.style.display == 'block')
  x.style.display = 'none';
  else
  x.style.display = 'block';
  }

function byeModal() {
    var x = document.getElementById("modal");
    x.style.display ="none";}


//zoom to district
function myFunction() {
  document.getElementById("myDropdown").classList.toggle("show");
}

function zoom1() {
  $('.district-name').text("Alamance Community")
  zoom =12
  map.flyTo([36.02022, -79.70769],zoom);
  map2.flyTo([36.02022, -79.70769],zoom);
}
function zoom2() {
  $('.district-name').text("Climax")
  zoom =12
  map.flyTo([35.92295, -79.71042],zoom);
  map2.flyTo([35.92295, -79.71042],zoom);
}
function zoom3() {
  $('.district-name').text("Colfax")
  zoom =12
  map.flyTo([36.1024, -80.02234],zoom);
  map2.flyTo([36.1024, -80.02234],zoom);
}
function zoom4() {
  $('.district-name').text("District 13")
  zoom =12
  map.flyTo([36.16105, -79.74041],zoom);
  map2.flyTo([36.16105, -79.74041],zoom);
}
function zoom5() {
  $('.district-name').text("District 28")
  zoom =12
  map.flyTo([36.15991, -79.57037],zoom);
  map2.flyTo([36.15991, -79.57037],zoom);
}
function zoom6() {
  $('.district-name').text("Gibsonville")
  zoom =12
  map.flyTo([36.10716, -79.54003],zoom);
  map2.flyTo([36.10716, -79.54003],zoom);
}
function zoom7() {
  $('.district-name').text("Guil-Rand")
  zoom =12
  map.flyTo([35.92944, -79.93953],zoom);
  map2.flyTo([35.92944, -79.93953],zoom);
}
function zoom8() {
  $('.district-name').text("High Point")
  zoom =12
  map.flyTo([35.9828, -80.00133],zoom);
  map2.flyTo([35.9828, -80.00133],zoom);
}
function zoom9() {
  $('.district-name').text("Julian")
  zoom =12
  map.flyTo([35.91943, -79.63466],zoom);
  map2.flyTo([35.91943, -79.63466],zoom);
}
function zoom10() {
  $('.district-name').text("Kernersville")
  zoom =12
  map.flyTo([36.10932, -80.02858],zoom);
  map2.flyTo([36.10932, -80.02858],zoom);
}
function zoom11() {
  $('.district-name').text("Kimesville")
  zoom =12
  map.flyTo([35.93282, -79.57655],zoom);
  map2.flyTo([35.93282, -79.57655],zoom);
}
function zoom12() {
  $('.district-name').text("McLeansville")
  zoom =12
  map.flyTo([36.12385, -79.64453],zoom);
  map2.flyTo([36.12385, -79.64453],zoom);
}
function zoom13() {
  $('.district-name').text("Mt. Hope")
  zoom =12
  map.flyTo([36.00037, -79.59946],zoom);
  map2.flyTo([36.00037, -79.59946],zoom);
}
function zoom14() {
  $('.district-name').text("NE Guilford")
  zoom =12
  map.flyTo([36.22154, -79.67172],zoom);
  map2.flyTo([36.22154, -79.67172],zoom);
}
function zoom15() {
  $('.district-name').text("Oak Ridge")
  zoom =12
  map.flyTo([36.1735, -79.99428],zoom);
  map2.flyTo([36.1735, -79.99428],zoom);
}
function zoom16() {
  $('.district-name').text("Piedmont Triad Ambulance and Rescue")
  zoom =12
  map.flyTo([36.10033, -79.94108],zoom);
  map2.flyTo([36.10033, -79.94108],zoom);
}
function zoom17() {
  $('.district-name').text("Pinecroft-Sedgefield")
  zoom =12
  map.flyTo([35.9637, -79.87617],zoom);
  map2.flyTo([35.9637, -79.87617],zoom);
}
function zoom18() {
  $('.district-name').text("Pleasant Garden")
  zoom =12
  map.flyTo([35.96092, -79.76768],zoom);
  map2.flyTo([35.96092, -79.76768],zoom);
}
function zoom19() {
  $('.district-name').text("Southeast")
  zoom =12
  map.flyTo([35.95481, -79.66331],zoom);
  map2.flyTo([35.95481, -79.66331],zoom);
}

function zoom20() {
  $('.district-name').text("Stokesdale")
  zoom =12
  map.flyTo([36.24147, -79.98476],zoom);
  map2.flyTo([36.24147, -79.98476],zoom);
}
function zoom21() {
  $('.district-name').text("Summerfield")
  zoom =12
  map.flyTo([36.22486, -79.87496],zoom);
  map2.flyTo([36.22486, -79.87496],zoom);
}
function zoom22() {
  $('.district-name').text("Whitsett")
  zoom =12
  map.flyTo([36.07571, -79.57812],zoom);
  map2.flyTo([36.07571, -79.57812],zoom);
}

function greensboro(){
  $('.district-name').text("Greensboro")
  zoom =12
  map.flyTo([36.087231, -79.833755],zoom);
  map2.flyTo([36.087231, -79.833755],zoom);
}

