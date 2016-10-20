// My position
var latitude = 0;
var longitude = 0;
var whereami = new google.maps.LatLng(latitude, longitude);
// Mark myself
var marker;

var closest_station = {
    distance: 0,
    name: "None",
};

// Change this to a path type thing if time permits
var pathToStation = new google.maps.Polyline({
    path: [new google.maps.LatLng()],
    geodesic: true,
    strokeColor: "#00FF00",
    strokeOpacity: 1.0,
    strokeWeight: 2,
});

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

// Since JS automatically hoists up all function declarations, we can just put
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

// From http://stackoverflow.com/a/1669222

Array.prototype.min = function(getComparableField) {
    if (typeof(getComparableField) === "undefined") {
        return Math.min.apply(null, this);
    } else {
        return Math.min.apply(null, this.map(function (thing, i, arr) {
            return getComparableField(thing);
        }));
    }
}

// From http://stackoverflow.com/a/14561433
function haversineDst(a, b) {
    var lat1 = a.lat();
    var lon1 = a.lng();

    var lat2 = b.lat();
    var lon2 = b.lng();

    var R = 6371; // km
    var x1 = lat2 - lat1;
    var dLat = toRad(x1);
    var x2 = lon2 - lon1;
    var dLon = toRad(x2);
    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + 
                    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
                    Math.sin(dLon / 2) * Math.sin(dLon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c;

    return d;
}

function toRad(x) {
    return x * Math.PI / 180.0;
}

function findClosestStation() {
    // This is in meters
    var dst = path_1.map(function(pos, i, arr) {
        return {
            distance: google.maps.geometry.spherical.computeDistanceBetween(pos.getPosition(), whereami),
            name: arr[i].getTitle(),
        };
    });

    var s_dst = dst.sort(function (lhs, rhs) {
        return lhs.distance - rhs.distance;
    });

    closest_station = s_dst[0];
}

function showClosestStation() {
    // Set self marker to name closest station
    google.maps.event.addListener(marker, 'click', function () {
        infoWindow.setContent("Closest Red Line station: "
                              + closest_station.name
                              + " ("
                              + (closest_station.distance / 1000).toFixed(2)
                              + " km)");
    });

    // Draw the line
    // Change this to a path if time permits
    pathToStation = new google.maps.Polyline({
        path:  [whereami,
                stations[closest_station.name].getPosition()],
        geodesic: true,
        strokeColor: "#00FF00",
        strokeOpacity: 0.5,
        strokeWeight: 2,
    });
    pathToStation.setMap(map);
}

// Shenanigans! Closures created in loops are references to the same closure!
function setInfoFun (name) {
    google.maps.event.addListener(stations[name], 'click', function () {
        infoWindow.setContent(stations[name].title);
        infoWindow.open(map, stations[name]);
    });
}

function findMe() {
    // console.log("Locating self...");
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            latitude = position.coords.latitude;
            longitude = position.coords.longitude;
            renderMap();
            findClosestStation();
            showClosestStation();
        });
    } else {
        console.log("Geolocation not supported, sorry!");
    }
}

function renderMap() {
    whereami = new google.maps.LatLng(latitude, longitude);
    // console.log("After finding myself: ", whereami.lat(), whereami.lng());

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