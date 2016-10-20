//      stop_name     |  stop_lat   |      stop_lon      
// -------------------+-------------+--------------------
//  South Station     |   42.352271 | -71.05524200000001
//  Andrew            |   42.330154 |         -71.057655
//  Porter Square     |     42.3884 | -71.11914899999999
//  Harvard Square    |   42.373362 |         -71.118956
//  JFK/UMass         |   42.320685 |         -71.052391
//  Savin Hill        |    42.31129 |         -71.053331
//  Park Street       | 42.35639457 |        -71.0624242
//  Broadway          |   42.342622 |         -71.056967
//  North Quincy      |   42.275275 |         -71.029583
//  Shawmut           | 42.29312583 | -71.06573796000001
//  Davis             |    42.39674 |         -71.121815
//  Alewife           |   42.395428 |         -71.142483
//  Kendall/MIT       | 42.36249079 |       -71.08617653
//  Charles/MGH       |   42.361166 |         -71.070628
//  Downtown Crossing |   42.355518 |         -71.060225
//  Quincy Center     |   42.251809 |         -71.005409
//  Quincy Adams      |   42.233391 |         -71.007153
//  Ashmont           |   42.284652 | -71.06448899999999
//  Wollaston         |  42.2665139 |        -71.0203369
//  Fields Corner     |   42.300093 |         -71.061667
//  Central Square    |   42.365486 |         -71.103802
//  Braintree         |  42.2078543 |        -71.0011385

var Marker = google.maps.Marker;
var LatLng = google.maps.LatLng;

//  Yes, the layout is repetitive with the station name appearing three times
// total each. Bite me.
 var stations = {
    "South Station": new Marker({
        position: new LatLng(42.352271, -71.05524200000001),
        title: "South Station",
    }),
    "Andrew": new Marker({
        position: new LatLng(42.330154, -71.057655),
        title: "Andrew"
    }),
    "Porter Square": new Marker({
        position: new LatLng(42.3884, -71.11914899999999),
        title: "Porter Square",
    }),
    "Harvard Square": new Marker({
        position: new LatLng(42.373362, -71.118956),
        title: "Harvard Square",
    }),
    "JFK/UMass": new Marker({
        position: new LatLng(42.320685, -71.052391),
        title: "JFK/UMass",
    }), 
    "Savin Hill": new Marker ({
        position: new LatLng(42.31129, -71.053331),
        title: "Savin Hill",
    }),
    "Park Street": new Marker({
        position: new LatLng(42.35639457, -71.0624242),
        title: "Park Street"
    }),
    "Broadway": new Marker({
        position: new LatLng(42.342622, -71.056967),
        title: "Broadway",
    }),
    "North Quincy": new Marker({
        position: new LatLng(42.275275, -71.029583),
        title: "North Quincy",
    }),
    "Shawmut": new Marker({
        position: new LatLng(42.29312583, -71.06573796000001),
        title: "Shawmut",
    }),
    "Davis": new Marker({
        position: new LatLng(42.39674, -71.121815),
        title: "Davis",
    }),
    "Alewife": new Marker({
        position: new LatLng(42.395428, -71.142483),
        title: "Alewife",
    }),
    "Kendall/MIT": new Marker({
        position: new LatLng(42.36249079, -71.08617653),
        title: "Kendall/MIT",
    }),
    "Charles/MGH": new Marker({
        position: new LatLng(42.361166, -71.070628),
        title: "Charles/MGH",
    }),
    "Downtown Crossing": new Marker({
        position: new LatLng(42.355518, -71.060225),
        title: "Downtown Crossing",
    }),
    "Quincy Center": new Marker({
        position: new LatLng(42.251809, -71.005409),
        title: "Quincy Center",
    }),
    "Quincy Adams": new Marker({
        position: new LatLng(42.233391, -71.007153),
        title: "Quincy Adams",
    }),
    "Ashmont": new Marker({
        position: new LatLng(42.284652, -71.06448899999999),
        title: "Ashmont",
    }),
    "Wollaston": new Marker({
        position: new LatLng(42.2665139, -71.0203369),
        title: "Wollaston",
    }),
    "Fields Corner": new Marker({
        position: new LatLng(42.300093, -71.061667),
        title: "Fields Corner",
    }),
    "Central Square": new Marker({
        position: new LatLng(42.365486, -71.103802),
        title: "Central Square",
    }),
    "Braintree": new Marker({
        position: new LatLng(42.2078543, -71.0011385),
        title: "Braintree",
    }),
};

var s_names = [];

for (var key in stations) {
    if (stations.hasOwnProperty(key)) {
        s_names.push(key);
    }
}

// Stub out trainsTo
for (var i = 0; i < s_names.length; ++i) {
    timeUntil[s_names[i]] = [];
}

var path_1 = [
    stations["Alewife"],
    stations["Davis"],
    stations["Porter Square"],
    stations["Harvard Square"],
    stations["Central Square"],
    stations["Kendall/MIT"],
    stations["Charles/MGH"],
    stations["Park Street"],
    stations["Downtown Crossing"],
    stations["South Station"],
    stations["Broadway"],
    stations["Andrew"],
    stations["JFK/UMass"],
    stations["North Quincy"],
    stations["Wollaston"],
    stations["Quincy Center"],
    stations["Quincy Adams"],
    stations["Braintree"],
];

var path_2 = [
    stations["JFK/UMass"],
    stations["Savin Hill"],
    stations["Fields Corner"],
    stations["Shawmut"],
    stations["Ashmont"],
];

var longPath = new google.maps.Polyline({
    path: path_1.map(function (item, i, arr) {
        return item.getPosition();
    }),
    geodesic: true,
    strokeColor: "#FF0000",
    strokeOpacity: 0.5,
    strokeWeight: 2,
});

var shortPath = new google.maps.Polyline({
    path: path_2.map(function (item, i, arr) {
        return item.getPosition();
    }),
    geodesic: true,
    strokeColor: "#FF0000",
    strokeOpacity: 0.5,
    strokeWeight: 2,
});