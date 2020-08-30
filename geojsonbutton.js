/*
Code prebared by sk1me on 20.08.2020
https://github.com/sk1me/Add-GeoJSON-Button
*/

//Variables used later

var geojsonlayer9 = null;
var map = null;

//Initialize map

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 10,
        center: new google.maps.LatLng(42.5, -83.0),
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        mapTypeControl: true,
        mapTypeControlOptions: {
            style: google.maps.MapTypeControlStyle.DEFAULT,
        }
    });

    //Load GeoJSONs
    geojsonlayer9 = new google.maps.Data();

    //Tooltips
    var infowindow = new google.maps.InfoWindow();

    geojsonlayer9.addListener('click', function (event) {
        var html_props = "";

        for (i = 0; i < keys.length; i++) {
            html_props += keys[i] + " : " + event.feature.getProperty(keys[i]) + "<br />"
        };

        let html = "<b>GeoJSON properties</b> <br /><br />" + html_props;
        infowindow.setContent(html);
        infowindow.setPosition(event.latLng);
        infowindow.setOptions({ pixelOffset: new google.maps.Size(0, -10) });
        infowindow.open(map);
    });

    //GeoJSON layer style
    geojsonlayer9.setStyle({
        icon: {
            url: "icons/measle_red_8px.png",
            scaledSize: new google.maps.Size(7, 7),
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(7, 6)
        }
    });

    // Load GeoJSON by button, zoom it, style it and add tooltips
    function loadGeoJsonString(geoString) {
        geojsonlayer9.forEach(function (feature) {
            geojsonlayer9.remove(feature);
        });
        var geojson = JSON.parse(geoString);
        geojsonlayer9.addGeoJson(geojson);
        geojsonlayer9.setMap(map);
        zoom(map);

        var propert = geojson.features[0].properties;
        keys = [];
        for (var key in propert) keys.push(key);

        function zoom(map) {
            var bounds = new google.maps.LatLngBounds();
            geojsonlayer9.forEach(function (feature) {
                processPoints(feature.getGeometry(), bounds.extend, bounds);
            });
            map.fitBounds(bounds);
        }

        function processPoints(geometry, callback, thisArg) {
            if (geometry instanceof google.maps.LatLng) {
                callback.call(thisArg, geometry);
            } else if (geometry instanceof google.maps.Data.Point) {
                callback.call(thisArg, geometry.get());
            } else {
                geometry.getArray().forEach(function (g) {
                    processPoints(g, callback, thisArg);
                });
            }
        }
    }

    document.getElementById('add_geojson_button').onchange = function (evt) {
        try {
            let files = evt.target.files;
            if (!files.length) {
                alert('No file selected!');
                return;
            }
            let file = files[0];
            let reader = new FileReader();
            const self = this;
            reader.onload = (event) => {
                loadGeoJsonString(event.target.result)
            };
            reader.readAsText(file);
        } catch (err) {
            console.error(err);
        }
    }
}