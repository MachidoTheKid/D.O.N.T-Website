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

    if (searchText.length === 0) {
        matches = [];
        matchList.innerHTML = '';
    }
    outputHtml(matches);

    //Complete input once user clicks on the country
    $('body').on('click', '#dialogue-box > div', function () {
        matches = [];
        matchList.innerHTML = '';
        $('.search-bar input').val($(this).text().trim()).focus();
    });
};

//Push results to html
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

search.addEventListener('input', () => searchCountry(search.value));

///////////////////////////////////////////////////////////////
//             SEARCH SECTION                                //
///////////////////////////////////////////////////////////////
let dataJSON = [];
let covidResults = []

const getData = async () => {

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

    const nameArray = search.value.toLowerCase().split(",");

    let matches = ctryData.filter(country => {

        const regex = new RegExp(`^${nameArray[0]}`, 'gi');
        return country.Country.match(regex);
    });



    //Get location Key
    const locations = await fetch("http://dataservice.accuweather.com/locations/v1/cities/search?apikey=%09oS152H6tFLAwJDF1RjHnDXIKr56AtTQs&q=" + nameArray[1]);
    const locInfo = await locations.json();

    let locKey = locInfo[0]['Key'];

    //Get 5 day weather forecast
    const weatherResponse = await fetch("http://dataservice.accuweather.com/forecasts/v1/daily/5day/" + locKey + "?apikey=oS152H6tFLAwJDF1RjHnDXIKr56AtTQs&metric=true");
    const weatherData = await weatherResponse.json();


    let lat = locInfo[0]['GeoPosition']['Latitude'];
    let lon = locInfo[0]['GeoPosition']['Longitude'];
    dataJSON.push(matches, weatherData, {latitude: lat, longitude: lon});

    ////////////////////covid19 Data//////////////////////////////////////////////////////

    let newConfirmed = dataJSON[0][0]['NewConfirmed'];
    let totalConfirmed = dataJSON[0][0]['TotalConfirmed'];
    let totalDeaths = dataJSON[0][0]['TotalDeaths'];
    let countryName = dataJSON[0][0]['Country'];

    covidResults.push(newConfirmed, totalConfirmed, totalDeaths);
    document.getElementById('countryTitle').innerHTML = countryName;
    /////////////////////////////////////////////////////////////////////////////////////

    ///////////////////weather data (Days)//////////////////////////////////////////////

    let dayData = [];

    for (let i = 0; i < 5; i++) {
        let day = dataJSON[1]['DailyForecasts'][i]['Date'];
        let dayDesc = dataJSON[1]['DailyForecasts'][i]['Day']['IconPhrase'];
        let dayLow = dataJSON[1]['DailyForecasts'][i]['Temperature']['Minimum']['Value'];
        let dayHigh = dataJSON[1]['DailyForecasts'][i]['Temperature']['Maximum']['Value'];
        let dayDate = new Date(day);

        dayData.push([dayDate.toUTCString().substr(0, 3), dayDesc, dayLow, dayHigh]);
    }
    //////////////////////////////////////////////////////////////////////////////////////////

    //Push weather data to HTML
    for (let i = 0; i < 5; i++) {
        document.getElementById('weekday' + (i + 1)).innerHTML = dayData[i][0];
        document.getElementById('weatherDesc' + (i + 1)).innerHTML = dayData[i][1];
        document.getElementById('low' + (i + 1)).innerHTML = "Low: " + dayData[i][2] + "C";
        document.getElementById('high' + (i + 1)).innerHTML = "High: " + dayData[i][3] + "C";
    }


}

async function initMap() {
    await getData();

    const mapProp = {
        center: new google.maps.LatLng(dataJSON[2]['latitude'], dataJSON[2]['longitude']),
        zoom: 14
    };

    const map = new google.maps.Map(document.getElementById("map"), mapProp);

    const marker = new google.maps.Marker({
        position: mapProp.center,
        animation: google.maps.Animation.BOUNCE
    });

    marker.setMap(map);
    $(".loader").fadeOut(500);
}

$("#search-btn").on('click', function () {
    getData();
    createChart();
    initMap();

});


///////////////////////////////////////////////////////////////
//             COVID-19 DATA SECTION                         //
///////////////////////////////////////////////////////////////



async function createChart() {

    await getData();

    let ctx = document.getElementById('chart').getContext('2d');
    let myChart = new Chart(ctx, {
        type: 'horizontalBar',
        data: {
            labels: ['Newly Confirmed', 'Total Confirmed', 'Total Deaths'],
            datasets: [{
                label: 'Number of Covid-19 Cases in ' + dataJSON[0][0]['Country'],
                data: covidResults,
                backgroundColor: [
                    'rgba(255, 87, 20)',
                    'rgba(255, 87, 20)',
                    'rgba(255, 87, 20)'
                ],
                borderColor: [


                ],
                borderWidth: 1
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