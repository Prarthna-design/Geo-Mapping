earthquakeUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"
d3.json(earthquakeUrl, function(earthquakeData) {
    console.log(earthquakeData);
    createMap(earthquakeData);
});

function createMap(earthquakeData) {
    // Create a map object
    var myMap = L.map("map", {
        center: [15.5994, -28.6731],
        zoom: 3
    });

    L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
        tileSize: 512,
        maxZoom: 18,
        zoomOffset: -1,
        id: "mapbox/streets-v11",
        accessToken: API_KEY
    }).addTo(myMap);

    function getColor(d) {
        return d >= 5 ? '#006d2c' :
            d >= 4 ? '#31a354' :
            d >= 3 ? '#74c476' :
            d >= 2 ? '#a1d99b' :
            d >= 1 ? '#c7e9c0' :
            '#edf8e9';
    }
    // Creating a GeoJSON layer with the retrieved data
    L.geoJson(earthquakeData, {
        pointToLayer: function(feature, latlng) {
            return L.circleMarker(latlng, {
                radius: feature.properties.mag * 3,
                fillColor: getColor(feature.properties.mag),
                color: "#000",
                weight: 1,
                opacity: 1,
                fillOpacity: 1
            });
        },
        onEachFeature: onEachFeature
    }).addTo(myMap);
    var legend = L.control({ position: 'bottomright' });

    legend.onAdd = function(myMap) {

        var div = L.DomUtil.create('div', 'info legend'),
            grades = [0, 1, 2, 3, 4, 5];

        // loop through our density intervals and generate a label with a colored square for each interval
        for (var i = 0; i < grades.length; i++) {
            div.innerHTML +=
                '<i style="background:' + getColor(grades[i]) + '"></i> ' +
                grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
        }

        return div;
    };

    legend.addTo(myMap);
    // Define a function we want to run once for each feature in the features array
    // Give each feature a popup describing the place and time of the earthquake
    function onEachFeature(feature, layer) {
        layer.bindPopup(" <h3> Magnitude: " + feature.properties.mag + "</h3><br/><h3>" + feature.properties.place +
            "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
    }

}