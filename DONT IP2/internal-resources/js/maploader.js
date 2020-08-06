let map;
var magSetting = 4.5;

function initMap() {

    var lat = 2.8;
    var long = -187.3

    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 3,
        center: new google.maps.LatLng(lat, long),
        mapTypeId: 'terrain'
    });


    // Create a <script> tag and set the USGS URL as the source.
    var script = document.createElement('script');
    // This example uses a local copy of the GeoJSON stored at
    // http://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_week.geojsonp
    script.src =
        `https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/${magSetting}_week.geojsonp`;
    document.getElementsByTagName('head')[0].appendChild(script);

    //Removes the script to be prevent continuous appending of data
    function removeMarkers() {

        document.getElementsByTagName('head')[0].removeChild(script);
    }



    window.eqfeed_callback = function (results) {


        for (var i = 0; i < results.features.length; i++) {
            var largestNum = 0;
            var coords = results.features[i].geometry.coordinates;
            var magnitude = results.features[i].properties.mag;
            var latLng = new google.maps.LatLng(coords[1], coords[0]);
            var title = results.features[i].properties.title;
            var marker = new google.maps.Marker({
                position: latLng,
                map: map,
                infoWindow: infoWindow,

                icon: {
                    path: google.maps.SymbolPath.CIRCLE,
                    fillColor: '#FF5714',
                    fillOpacity: .4,
                    scale: Math.pow(2, magnitude) / 2,
                    strokeColor: 'white',
                    strokeWeight: .5
                },


            });

            var contentString = '<div id="content" style="text-align: center; color: black;">' +
                '<div id="siteNotice">' +
                '</div>' +
                '<h3 id="firstHeading" class="firstHeading" >' + 'Location: ' + '</h3>' + title +
                '<h3 id="secondHeading" class="secondHeading">Coordinates: </h3>' + latLng +
                '<div id="bodyContent">' + '<h3 id="secondHeading" class="secondHeading">Magnitude: </h3>' +
                magnitude +
                '</div>';

            var infoWindow = new google.maps.InfoWindow({
                content: contentString
            });



            google.maps.event.addListener(marker, 'click', function () {
                this.infoWindow.open(map, this);

            });
        }

        document.getElementById('earthquakeNumbers').innerHTML = "There are currently a total of " + "<b style='color: #FF5714;'>" + i + "</b>" + " earthquakes of at least magnitude " + "<b style='color: #FF5714;'>" + magSetting + "</b>" + " that have occured in the past week.";


    }





    $(".loader").fadeOut(500);

    //Earthquake Magnitude Button Functionality

    document.getElementById("mag45").addEventListener("click", magChanger45);
    document.getElementById("mag25").addEventListener("click", magChanger25);
    document.getElementById("mag10").addEventListener("click", magChanger10);

    function magChanger45() {
        mapReset();

        magSetting = 4.5;
        initMap();


    }

    function magChanger25() {
        mapReset();
        magSetting = 2.5;
        initMap();


    }

    function magChanger10() {
        mapReset();
        magSetting = "1.0";
        initMap();


    }

    function mapReset() {

        event.preventDefault();
        removeMarkers();
    }
}