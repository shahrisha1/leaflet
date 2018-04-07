

// Store the API endpoint inside the queryURL.
var queryURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson";

// Perform a GET request to the query URL.
d3.json(queryURL, function (data) {
    //CreateFeatures object for the Create features function.
    createFeatures(data.features);
});


Create function to set color based on earthquake magnitudels

function getColor(c) {
    x = Math.ceil(c);
    switch (Math.ceil(x)) {
        case 1:
            return "#ffffcc";
        case 2:
            return "#c7e9b4";
        case 3:
            return "#7fcdbb";
        case 4:
            return "#41b6c4";
        case 5:
            return "#2c7fb8";
        default:
            return "#253494";
    }
}

// function getColor(d) {
//     return d > 1000 ? '#800026' :
//         d > 500 ? '#BD0026' :
//             d > 200 ? '#E31A1C' :
//                 d > 100 ? '#FC4E2A' :
//                     d > 50 ? '#FD8D3C' :
//                         d > 20 ? '#FEB24C' :
//                             d > 10 ? '#FED976' :
//                                 '#FFEDA0';
// }

// //Create the function to determine marker size base on eartkquake magnitude.
// function getColor(d) {
//     return d > 5 ? '#E31A1C' :
//         d > 4 ? '#FC4E2A' :
//             d > 3 ? '#FD8D3C' :
//                 d > 2 ? '#FEB24C' :
//                     d > 1 ? '#FED976' :
//                         '#FFEDA0';
// }



function createFeatures(earthquakeData) {
    function onEachFeature(feature, layer) {
        layer.bindPopup("<h2>" + feature.properties.place +
            "<h3><hr><p>" + new Date(feature.properties.time) + "<p>");
    }

    var earthquakes = L.geoJSON(earthquakeData, {
        onEachFeature: onEachFeature,
        pointToLayer: pointToLayer
    });

    //Sending the earthquakes layer to the createMap function.
    createMap(earthquakes);

    function pointToLayer(feature, latlng) {
        return new L.circle(latlng, {
            stroke: false,
            fillOpacity: 0.7,
            //color:"blue",
            fillColor: getColor(feature.properties.mag),
            radius: feature.properties.mag * 50000


        })
    }
}
function createMap(earthquakes) {
    //Define outdoor and satellite map layers.

    var satelliteMap = L.tileLayer("https://api.mapbox.com/styles/v1/shahrisha1/cjfo655622skl2ruc1yphl3id/tiles/256/{z}/{x}/{y}?"+
    "access_token=pk.eyJ1Ijoic2hhaHJpc2hhMSIsImEiOiJjamV2b3BobG4wajMyMndwaHkzcDBsdGk2In0.NawKFuMeUmVk6Xfr20WA-A");

    var outdoorMap = L.tileLayer("https://api.mapbox.com/styles/v1/shahrisha1/cjfo616i30e642qpco0r7gp6i/tiles/256/{z}/{x}/{y}?"+
    "access_token=pk.eyJ1Ijoic2hhaHJpc2hhMSIsImEiOiJjamV2b3BobG4wajMyMndwaHkzcDBsdGk2In0.NawKFuMeUmVk6Xfr20WA-A");


    //Define a baseMaps object to hold the baselayers.
    var baseMaps = {
        "Outdoor Map": outdoorMap,
        "Satellite Map": satelliteMap
    };

    //Create an overlay object to hold the overlay layer.
    var overlayMaps = {
        Earthquakes: earthquakes
    };

    //Create the map giving it the outdoormak and earthquake layers to display the map on load.
    var myMap = L.map("map", {
        center: [37.09, -95.71],
        zoom: 5,
        layers: [outdoorMap, earthquakes]
    });

    //Create a layer control.
    //Pass in the baseMaps and overlayMaps
    //Add the control layer to the map.
    L.control.layers(baseMaps, overlayMaps, {
        collapse: false
    }).addTo(myMap);

    //Adding a legend to the map.
    var legend = L.control({ position: 'bottomright' });
    legend.onAdd = function (myMap) {

        var div = L.DomUtil.create('div', 'info legend'),
            grades = [1, 2, 3, 4, 5],
            labels = [];

        // loop through our density intervals and generate a label with a colored square for each interval
        for (var i = 0; i < grades.length; i++) {
            div.innerHTML +=
                '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
                grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
        }

        return div;
    };

    legend.addTo(myMap);

};  