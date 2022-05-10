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

//FIRE STATIONS
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
if(map.hasLayer(markers[0])==true){
  removeMap()
}
else{
  addToMap()
}}

//FIRE DISTRICTS
//neutral style
function styleb(feature) {
  return {
      fillColor: "#d3d3d3",
      weight: .6,
      opacity: 1,
      color: 'white',
      fillOpacity: 0.7
  };
}

//hide and show fire districts
//need to figure out come back on click
var FireDistrictsLayer= L.geoJSON(FireDistricts, {style: styleb,
  onEachFeature: function (feature, layer) {
    layer.bindPopup('District:'+feature.properties.DistName+"<br>"+'Budget: '+feature.properties.Budget);
  }
});
function showFireDistricts() {
if(map.hasLayer(FireDistrictsLayer)==true){
  map.removeLayer(FireDistrictsLayer)
  x = document.getElementById("legend-gradient");
    x.style.display = 'none';
  y = document.getElementById("table");
  y.style.display = 'none';
}
else{
  FireDistrictsLayer= L.geoJSON(FireDistricts, {style: styleb,
    onEachFeature: function (feature, layer) {
      layer.bindPopup('District:'+feature.properties.DistName+"<br>"+'Budget: '+feature.properties.Budget);
    }
  });
  map.addLayer(FireDistrictsLayer)
}}

//BUDGET
function getColorBUDGET(d) {
 return d > 1500000 ? '#922b26' :
        d > 1000000  ? '#A85551' :
        d > 500000  ? '#BE807D' :
        d > 250000  ? '#D3AAA8' :
        d > 0   ? '#E9D5D4' :
          '#d3d3d3';
      }

function styleBUDGET(feature) {
          return {
          fillColor: getColorBUDGET(feature.properties.Budget),
            weight: .6,
            opacity: 1,
            color: 'white',
            fillOpacity: 0.7
        };
      }

function Budget() {
  if(map.hasLayer(FireDistrictsLayer)==true){
 
    map.removeLayer(FireDistrictsLayer)
    FireDistrictsLayer= L.geoJSON(FireDistricts, {style: styleBUDGET,
      onEachFeature: function (feature, layer) {
        layer.bindPopup('District:'+feature.properties.DistName+"<br>"+'Budget: '+feature.properties.Budget);
      }
    });
    map.addLayer(FireDistrictsLayer)
    $('.legend-name').text("Budget")
    $('.legend-class1').text("$0 - $250,000")
    $('.legend-class2').text("$250,001 - $500,000")
    $('.legend-class3').text("$500,001 - $1MM")
    $('.legend-class4').text("$1MM - $1.5MM")
    $('.legend-class5').text(">$1.5MM")
    y = document.getElementById("legend-risk");
    y.style.display = 'none';
     x = document.getElementById("legend-gradient");
    x.style.display = 'block';
    $('.high-1').text("Summerfield")
    $('.high-2').text("Pinecroft-Sedgefield")
    $('.high-3').text("Oak Ridge")
    $('.low-1').text("Gibsonville")
    $('.low-2').text("Julian")
    $('.low-3').text("Kimesville")
    x = document.getElementById("table");
    x.style.display = 'block';
  }}



//RISK NET
//hide and show risk net

// var RiskNet= L.geoJSON(RiskNet)
// set color palette risk surface
function getColor(d) {
  return d > 4.14 ? '#922B26' :
         d > 1.19  ? '#B97527' :
         d > 0  ? '#E0BE28' :
                    '#FFEDA0';
}

//style function risk surface
//SAME ISSUE PULLING PREDICTIONS
function style(feature) {
  return {
      fillColor: getColor(feature.properties.pred),
      weight: .6,
      opacity: 1,
      color: 'white',
      fillOpacity: 0.7
  };
}

//map RiskNet
var RiskNet=L.geoJson(RiskNet, {style: style});
console.log(RiskNet.properties.pred)

// RiskNet.setStyle({color: "#f94144"});
function showRiskNet() {
if(map.hasLayer(RiskNet)==true){
  map.removeLayer(RiskNet)
  z = document.getElementById("legend-risk");
  z.style.display = 'none';
}
else{
  x = document.getElementById("legend-gradient");
  x.style.display = 'none';
  y = document.getElementById("legend-risk");
  y.style.display = 'block';
  map.addLayer(RiskNet)
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

function filterFunction() {
  var input, filter, ul, li, a, i;
  input = document.getElementById("myInput");
  filter = input.value.toUpperCase();
  div = document.getElementById("myDropdown");
  a = div.getElementsByTagName("a");
  for (i = 0; i < a.length; i++) {
    txtValue = a[i].textContent || a[i].innerText;
    if (txtValue.toUpperCase().indexOf(filter) > -1) {
      a[i].style.display = "";
    } else {
      a[i].style.display = "none";
    }
  }
}

function filterFunction2() {
  var input, filter, ul, li, a, i;
  input = document.getElementById("myInput2");
  filter = input.value.toUpperCase();
  div = document.getElementById("myDropdown2");
  a = div.getElementsByTagName("a");
  for (i = 0; i < a.length; i++) {
    txtValue = a[i].textContent || a[i].innerText;
    if (txtValue.toUpperCase().indexOf(filter) > -1) {
      a[i].style.display = "";
    } else {
      a[i].style.display = "none";
    }
  }
}

function zoom1() {
  $('.district-name').text("Alamance Community")
  zoom =12
  map.flyTo([36.02022, -79.70769],zoom);
}
function zoom2() {
  $('.district-name').text("Climax")
  zoom =12
  map.flyTo([35.92295, -79.71042],zoom);
}
function zoom3() {
  $('.district-name').text("Colfax")
  zoom =12
  map.flyTo([36.1024, -80.02234],zoom);
}
function zoom4() {
  $('.district-name').text("District 13")
  zoom =12
  map.flyTo([36.16105, -79.74041],zoom);
}
function zoom5() {
  $('.district-name').text("District 28")
  zoom =12
  map.flyTo([36.15991, -79.57037],zoom);
}
function zoom6() {
  $('.district-name').text("Gibsonville")
  zoom =12
  map.flyTo([36.10716, -79.54003],zoom);
}
function zoom7() {
  $('.district-name').text("Guil-Rand")
  zoom =12
  map.flyTo([35.92944, -79.93953],zoom);
}
function zoom8() {
  $('.district-name').text("High Point")
  zoom =12
  map.flyTo([35.9828, -80.00133],zoom);
}
function zoom9() {
  $('.district-name').text("Julian")
  zoom =12
  map.flyTo([35.91943, -79.63466],zoom);
}
function zoom10() {
  $('.district-name').text("Kernersville")
  zoom =12
  map.flyTo([36.10932, -80.02858],zoom);
}
function zoom11() {
  $('.district-name').text("Kimesville")
  zoom =12
  map.flyTo([35.93282, -79.57655],zoom);
}
function zoom12() {
  $('.district-name').text("McLeansville")
  zoom =12
  map.flyTo([36.12385, -79.64453],zoom);
}
function zoom13() {
  $('.district-name').text("Mt. Hope")
  zoom =12
  map.flyTo([36.00037, -79.59946],zoom);
}
function zoom14() {
  $('.district-name').text("NE Guilford")
  zoom =12
  map.flyTo([36.22154, -79.67172],zoom);
}
function zoom15() {
  $('.district-name').text("Oak Ridge")
  zoom =12
  map.flyTo([36.1735, -79.99428],zoom);
}
function zoom16() {
  $('.district-name').text("Piedmont Triad Ambulance and Rescue")
  zoom =12
  map.flyTo([36.10033, -79.94108],zoom);
}
function zoom17() {
  $('.district-name').text("Pinecroft-Sedgefield")
  zoom =12
  map.flyTo([35.9637, -79.87617],zoom);
}
function zoom18() {
  $('.district-name').text("Pleasant Garden")
  zoom =12
  map.flyTo([35.96092, -79.76768],zoom);
}
function zoom19() {
  $('.district-name').text("Southeast")
  zoom =12
  map.flyTo([35.95481, -79.66331],zoom);
}

function zoom20() {
  $('.district-name').text("Stokesdale")
  zoom =12
  map.flyTo([36.24147, -79.98476],zoom);
}
function zoom21() {
  $('.district-name').text("Summerfield")
  zoom =12
  map.flyTo([36.22486, -79.87496],zoom);
}
function zoom22() {
  $('.district-name').text("Whitsett")
  zoom =12
  map.flyTo([36.07571, -79.57812],zoom);
}

//filter
function myFunction2() {
  document.getElementById("myDropdown2").classList.toggle("show");
}

// Close the dropdown if the user clicks outside of it
window.onclick = function(event) {
  if (!event.target.matches('.dropbtn2')) {
    var dropdowns = document.getElementsByClassName("dropdown-content2");
    var i;
    for (i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.classList.contains('show')) {
        openDropdown.classList.remove('show');
      }
    }
  }
}