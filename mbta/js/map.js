// My position
var latitude = 0;
var longitude = 0;
var whereami = new google.maps.LatLng(latitude, longitude);
// Mark myself
var marker;

var map_options = {
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    zoom: 13, // This actually isn't readable by the maps API and needs to be
              // set separately regardless.
    center: whereami, // If you put this first, the maps API doesn't see it
};

// Well, we need a map if we're going to do anything at all
var map;

// Let's display some words
var infoWindow = new google.maps.InfoWindow();

// Since JS automatically elevantes all function declarations, we can just put
// our functions wherever

function init() {
    map = new google.maps.Map(document.getElementById("map", map_options));
    findMe();

    for (var i = 0; i < s_names.length; ++i) {
        stations[s_names[i]].setMap(map);
        stations[s_names[i]].setIcon("img/T.png");
        setInfoFun(s_names[i]);
    };

    // Draw polylines showing Red Line Path
    longPath.setMap(map);
    shortPath.setMap(map);
}

// Shenanigans! Closures created in loops are references to the same closure!
function setInfoFun (name) {
    google.maps.event.addListener(stations[name], 'click', function () {
        infoWindow.setContent(stations[name].title);
        infoWindow.open(map, stations[name]);
    });
}

function findMe() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            latitude = position.coords.latitude;
            longitude = position.coords.longitude;
            renderMap();
        });
    } else {
        console.log("Geolocation not supported, sorry!");
    }
}

function renderMap() {
    whereami = new google.maps.LatLng(latitude, longitude);

    map.setZoom(13); // Setting this via map_options always fails

    map.panTo(whereami);
    marker = new google.maps.Marker({
        position: whereami,
        title: "You are here",
    });
    marker.setMap(map);

    google.maps.event.addListener(marker, 'click', function () {
        infoWindow.setContent(marker.title);
        infoWindow.open(map, marker);
    });
}