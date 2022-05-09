//load map
var map = L.map('map', {
  center: [36.09, -79.885],
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

//load fire stations
var features = [];
features = FireStations.features;
newArray = []
for (var i = 0; i < features.length; i = i + 1 ) {  
  newArray.push(Object.values(features[i]))
  };
// for (var i = 1; i < newArray.length; i = i + 1 ) {
//   L.marker([newArray[i][2].coordinates[1], newArray[i][2].coordinates[0]],{icon: L.icon({  
//     iconUrl: 'images/fire-station.png', iconSize: [25, 25]})}).bindPopup("Name: "+ newArray[i][1].Name).addTo(map) 
//   }

//add and remove marker functions
var addToMap = function(){markers.forEach(function(marker){marker.addTo(map)})}
var removeMap = function(){markers.forEach(function(marker){map.removeLayer(marker)})}

//create markers
var markers =[];
newArray.forEach((element, i) => 
markers[i] =   L.marker([element[2].coordinates[1], element[2].coordinates[0]],{icon: L.icon({  
 iconUrl: 'images/fire-station.png', iconSize: [25, 25]})}).bindPopup("Name: "+ element[1].Name).addTo(map))

removeMap()

// hide and show fire station markers
function showFireStations() {
if(typeof(markers)== 'undefined'){
  console.log('help')
  removeMap()
}
else{

  addToMap()
}}

//hide and show fire districts
var FireDistricts= L.geoJSON(FireDistricts)
FireDistricts.setStyle({color: "gray"});
function showFireDistricts() {
if(map.hasLayer(FireDistricts)==true){
  map.removeLayer(FireDistricts)
}
else{
  map.addLayer(FireDistricts)
}}

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

//show markdown page
function showMarkdown() {
  var x = document.getElementById("markdown");
  var y = document.getElementById("about");
  y.style.display ="none";
  if(x.style.display == 'block')
  x.style.display = 'none';
  else
  x.style.display = 'block';
  }
