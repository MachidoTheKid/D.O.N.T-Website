///////////////////////////////////////////////////////////////
//             AUTOCOMPLETE SECTION                          //
///////////////////////////////////////////////////////////////



const search = document.getElementById('search');
const matchList = document.getElementById('dialogue-box');




//Search and filter countries
const searchCountry = async searchText => {
    const response = await fetch('internal-resources/js/countries.json');
    const countries = await response.json();

    //Get Input matches
    let matches = countries.filter(country => {
        const regex = new RegExp(`^${searchText}`, 'gi');
        return country.name.match(regex) || country.country_code.match(regex);
    });

    //Checks to see if there is input in the input field and clears the drop-down dialogue if not
    if (searchText.length === 0) {
        matches = [];
        matchList.innerHTML = '';
    }
    outputHtml(matches);

    //Completes input once user clicks on the country
    $('body').on('click', '#dialogue-box > div', function () {
        matches = [];
        matchList.innerHTML = '';
        $('.search-bar input').val($(this).text().trim()).focus();
    });
};

//Push results of filtered data to html
const outputHtml = matches => {
    if (matches.length > 0) {
        const html = matches.map(
            match => `
            <div class="result">
                <p>${match.name}, <small style = "color: #FF5714">${match.capital}</small></p>
            </div>
        `).join('');

        matchList.innerHTML = html;
    }
}

if (search) {
    search.addEventListener('input', () => searchCountry(search.value));
}

///////////////////////////////////////////////////////////////
//             SEARCH SECTION                                //
///////////////////////////////////////////////////////////////

//Initialization
let dataJSON = [];
let covidResults = []

const getData = async () => {

    //Clears the dataJSON and covidResults arrays so that new data doesnt append over old data
    if (dataJSON != []) {
        dataJSON = [];
    }

    if (covidResults != []) {
        covidResults = [];
    }

    //Access COVID-19 Data from API
    const covidResponse = await fetch('https://api.covid19api.com/summary');
    const covidData = await covidResponse.json();

    let ctryData = covidData["Countries"];

    //Filter through country data to isolate search results

    const nameArray = search.value.toLowerCase().split(","); //Converts the input value to lowercase for uniformity

    let matches = ctryData.filter(country => {
        const regex = new RegExp(`^${nameArray[0]}`, 'gi');
        return country.Country.match(regex);
    });



    //Get location Key of the country that has been searched
    const locations = await fetch("http://dataservice.accuweather.com/locations/v1/cities/search?apikey=zVPYSg54sk5yXACOSMcQtQlqk8Oir6d8&q=" + nameArray[1]);
    const locInfo = await locations.json();

    let locKey = locInfo[0]['Key'];

    //Get 5 day weather forecast from API
    const weatherResponse = await fetch("http://dataservice.accuweather.com/forecasts/v1/daily/5day/" + locKey + "?apikey=zVPYSg54sk5yXACOSMcQtQlqk8Oir6d8&metric=true");
    const weatherData = await weatherResponse.json();

    let lat = locInfo[0]['GeoPosition']['Latitude'];
    let lon = locInfo[0]['GeoPosition']['Longitude'];
    dataJSON.push(matches, weatherData, {
        latitude: lat,
        longitude: lon
    });

    //Get forex data from API
    const forexResponse = await fetch("http://data.fixer.io/api/latest?access_key=78e3dc8317947167988c08b3cd2d9a24&symbols=GBP,USD");
    const forexData = await forexResponse.json();

    console.log(forexData);

    ////////////////////covid19 Data//////////////////////////////////////////////////////

    let newConfirmed = dataJSON[0][0]['NewConfirmed'];
    let totalConfirmed = dataJSON[0][0]['TotalConfirmed'];
    let newDeaths = dataJSON[0][0]['NewDeaths'];
    let totalDeaths = dataJSON[0][0]['TotalDeaths'];
    let newRecovered = dataJSON[0][0]['NewRecovered'];
    let totalRecovered = dataJSON[0][0]['TotalRecovered'];
    let countryName = dataJSON[0][0]['Country'];

    covidResults.push(newConfirmed, totalConfirmed, newDeaths, totalDeaths, newRecovered, totalRecovered);
    document.getElementById('countryTitle').innerHTML = countryName;
    /////////////////////////////////////////////////////////////////////////////////////

    ///////////////////weather data (Days)//////////////////////////////////////////////

    let dayData = [];

    //Accesses and assigns data received from API to different variables
    for (let i = 0; i < 5; i++) {
        let day = dataJSON[1]['DailyForecasts'][i]['Date'];
        let dayDesc = dataJSON[1]['DailyForecasts'][i]['Day']['IconPhrase'];
        let dayIcon = dataJSON[1]['DailyForecasts'][i]['Day']['Icon'];
        let dayLow = dataJSON[1]['DailyForecasts'][i]['Temperature']['Minimum']['Value'];
        let dayHigh = dataJSON[1]['DailyForecasts'][i]['Temperature']['Maximum']['Value'];
        let dayDate = new Date(day);

        const icons = await fetch("internal-resources/js/weather-icons.json");
        const iconData = await icons.json();

        const icon = iconData[dayIcon];

        dayData.push([dayDate.toUTCString().substr(0, 3), dayDesc, icon, dayLow, dayHigh]);
    }
    //////////////////////////////////////////////////////////////////////////////////////////

    //Push weather data to HTML
    for (let i = 0; i < 5; i++) {
        document.getElementById('weekday' + (i + 1)).innerHTML = dayData[i][0];
        document.getElementById('weatherDesc' + (i + 1)).innerHTML = dayData[i][1];
        document.getElementById('icon' + (i + 1)).innerHTML = (`<img src="${dayData[i][2]}" class="w_icon"></img>`);
        document.getElementById('low' + (i + 1)).innerHTML = "Low: " + dayData[i][3] + "C";
        document.getElementById('high' + (i + 1)).innerHTML = "High: " + dayData[i][4] + "C";
    }


}

//Map initialization function

let map;
var magSetting = 4.5;
async function initMap() {
    await getData();

    var lat = dataJSON[2]['latitude'];
    var long = dataJSON[2]['longitude'];

    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 3,
        backgroundColor: "#383838b3",
        center: new google.maps.LatLng(lat, long),
        mapTypeId: 'terrain',
        style: "cc947975130c4d08"
    });

    let mainMarker = new google.maps.Marker({
        position: {lat:lat, lng:long},
        map: map
    });

    mainMarker.setAnimation(google.maps.Animation.BOUNCE);

    // Create a <script> tag and set the USGS URL as the source.
    var script = document.createElement('script');
    // This example uses a local copy of the GeoJSON stored at
    // http://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_week.geojsonp
    script.src =
        `https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/${magSetting}_week.geojsonp`;
    document.getElementsByTagName('head')[0].appendChild(script);

    window.eqfeed_callback = function (results) {
        for (let i = 0; i < results.features.length; i++) {
            let largestNum = 0;
            let coords = results.features[i].geometry.coordinates;
            let magnitude = results.features[i].properties.mag;
            let latLng = new google.maps.LatLng(coords[1], coords[0]);
            let title = results.features[i].properties.title;
            let contentString = '<div class="card-2" style="text-align: center">' +
                '<h3>' + 'Location: ' + '</h3>' + title +
                '<h3>Coordinates: </h3>' + latLng +
                '<div>' + 
                    '<h3 >Magnitude: </h3>' + magnitude +
                '</div>';

            let infoWindow = new google.maps.InfoWindow({
                content: contentString
            });

            let marker = new google.maps.Marker({
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

            google.maps.event.addListener(marker, 'click', function () {
                this.infoWindow.open(map, this);
            });
        }



    }



    $(".loader").fadeOut(500);


}


///////////////////////////////////////////////////////////////
//             COVID-19 DATA SECTION                         //
///////////////////////////////////////////////////////////////



async function createChart() {

    await getData();

    let ctx = document.getElementById('chart').getContext('2d');
    let myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Newly Confirmed', 'Total Confirmed', 'New Deaths', 'Total Deaths', 'New Recovered', 'Total Recovered'],
            datasets: [{
                label: 'Number of Covid-19 Cases in ' + dataJSON[0][0]['Country'],
                data: covidResults,
                backgroundColor: [
                    'rgba(255, 87, 20)',
                    'rgba(255, 87, 20)',
                    'rgba(255, 87, 20)',
                    'rgba(255, 87, 20)',
                    'rgba(255, 87, 20)',
                    'rgba(255, 87, 20)'
                ],

                borderWidth: 0
            }]
        },
        options: {

            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    },

                    gridlines: {

                        display: false
                    }
                }],

                xAxes: [{
                    ticks: {
                        beginAtZero: true
                    },

                    gridLines: {

                        display: false
                    }
                }],


            }
        }
    });
}

$("#search-btn").on('click', function () {
    getData();
    createChart();
    initMap().then(function () {
        $(".loader").fadeOut(500);
    });
});