// My position
var latitude = 0;
var longitude = 0;
var whereami = new google.maps.LatLng(latitude, longitude);
// Mark myself
var marker;
// Which marker has an open infoWindow on it?
var openWindow;

var closest_station = {
    distance: 0,
    name: "None",
};

// Trains split by destination
var timeUntil = {};

// Since I'd like to count down every five seconds or so...
var date = new Date()
var timeAtRq;

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

var rq = new XMLHttpRequest();
var json;
var redLine;

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

    google.maps.event.addListener(infoWindow, 'closeclick',
                                  function () {
                                    openWindow = "AbsolutelyNotAStation";
                                  });

    useMBTAData();
}

function useMBTAData() {
    rq = new XMLHttpRequest();
    rq.open("GET", "https://dry-dawn-67469.herokuapp.com/redline.json");

    // A 404 is not an http error, so this never gets called unless a network
    // occurs
    rq.onerror = useMBTAData;
    rq.onloadend = tryAgainIf404;

    timeAtRq = date.getTime();
    rq.send();
}

function tryAgainIf404() {
    if (rq.status == 200) {
        json = JSON.parse(rq.responseText);
        redLine = json["TripList"]["Trips"];
        showTrainData();
    } else {
        // Try again :(
        useMBTAData();
    }
}

window.setInterval(function () {
    showTrainData();
}, 5000);

window.setInterval(function () {
    useMBTAData();
}, 60000);

function splitTrainsByPath() {
    stubTimeUntil();
    var whereTo;
    for (var i = 0; i < redLine.length; ++i) {
        // 5 predictions per train, under redLine[i]
        goingThrough = redLine[i]["Predictions"];
        if (typeof(goingThrough) === "undefined") continue;
        for (var j = 0; j < goingThrough.length; ++j) {
            timeUntil[goingThrough[j]["Stop"]].push(goingThrough[j]["Seconds"]);
        }
    }

    // Sort times per station
    for (var i = 0; i < s_names.length; ++i) {
        timeUntil[s_names[i]].sort(function (lhs, rhs) { return lhs - rhs; });
    }

}

// This just does the Red Line for now. If it needs to do more, add here or
// refactor
function showTrainData() {
    splitTrainsByPath();

    var content = "";

    for (var i = 0; i < s_names.length; ++i) {
        content = "";
        setInfoFun(s_names[i], function (name) {
            content = buildTimeString(name);

            infoWindow.setContent(content);
            infoWindow.open(map, stations[name]);
        });
    }

    if (s_names.indexOf(openWindow) !== -1) {
        // Dummy event, just need to trigger the event
        google.maps.event.trigger(stations[openWindow], 'click', {});
    }
}

function buildTimeString(name) {
    var timeString = ["<h4>" + name + "</h4>"
                    , "<p>Next trains in:</p>"
                    , "<ul>"];
    var times = timeUntil[name];

    var timeSinceRq = new Date().getTime();

    for (var i = 0; i < times.length; ++i) {
        var secondsSince = ((timeSinceRq - timeAtRq) / 1000);

        var seconds = (times[i] - secondsSince).toFixed(0);
        // The times are in seconds, but we'd like minutes
        var minutes = (seconds / 60).toFixed(1);
        var time = ((seconds < 60) ? (seconds + " sec") : (minutes + " min"));

        var arrivedString = ((minutes <= 0 && -0.5 <= minutes) ?
            "Arrived" : "Departed");

        timeString.push("<li>"
                      + ((minutes <= 0) ? arrivedString : time)
                      + "</li>");
    }

    if (times.length === 0) {
        timeString.push("No nearby trains");
    }

    timeString.push("</ul>");
    return timeString.join("");
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

    var dst2 = path_2.map(function(pos, i, arr) {
        return {
            distance: google.maps.geometry.spherical.computeDistanceBetween(pos.getPosition(), whereami),
            name: arr[i].getTitle(),
        };
    });

    var s_dst = dst.sort(function (lhs, rhs) {
        return lhs.distance - rhs.distance;
    });

    var s_dst2 = dst2.sort(function (lhs, rhs) {
        return lhs.distance - rhs.distance;
    });

    if (s_dst[0].distance < s_dst2[0].distance) closest_station = dst[0];
    else closest_station = dst2[0];

    showClosestStation();
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
function setInfoFun (name, f) {
    if (!(f instanceof Function)) {
        var f = function (name) {
            infoWindow.setContent(stations[name].title);
            infoWindow.open(map, stations[name]);
        };
    }
    google.maps.event.addListener(stations[name], 'click',
                                  function () {
                                    f(name);
                                    openWindow = name;
                                });
}

// Consider navigator.geolocation.watchPosition instead!
function findMe() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            latitude = position.coords.latitude;
            longitude = position.coords.longitude;
            renderMap();
            findClosestStation();

        });
    } else {
        console.log("Geolocation not supported, sorry!");
    }
}

function renderMap() {
    whereami = new google.maps.LatLng(latitude, longitude);

    map.setZoom(13); // Setting zoom via map_options always fails. ಠ_ಠ

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
