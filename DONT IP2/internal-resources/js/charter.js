///////////////////////////////////////////////////////////////
//             AUTOCOMPLETE SECTION                          //
///////////////////////////////////////////////////////////////


const search = document.getElementById('search');
let covidResults = []
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

const getData = async () => {

    if (dataJSON != []) {
        dataJSON = [];
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

    let locKey = locInfo[0]['Key']

    //Get 5 day weather forecast
    const weatherResponse = await fetch("http://dataservice.accuweather.com/forecasts/v1/daily/5day/" + locKey + "?apikey=oS152H6tFLAwJDF1RjHnDXIKr56AtTQs&metric=true");
    const weatherData = await weatherResponse.json();


    let lat = locInfo[0]['GeoPosition']['Latitude'];
    let lon = locInfo[0]['GeoPosition']['Longitude'];
    dataJSON.push(matches, weatherData, {
        lat,
        lon
    })

    ////////////////////covid19 Data//////////////////////////////////////////////////////

    let newConfirmed = dataJSON[0][0]['NewConfirmed'];
    let totalConfirmed = dataJSON[0][0]['TotalConfirmed'];
    let totalDeaths = dataJSON[0][0]['TotalDeaths'];
    let countryName = dataJSON[0][0]['Country'];

    covidResults.push(newConfirmed, totalConfirmed, totalDeaths);
    document.getElementById('countryTitle').innerHTML = countryName;
    /////////////////////////////////////////////////////////////////////////////////////

    ///////////////////weather data (Days)//////////////////////////////////////////////

    let day1 = dataJSON[1]['DailyForecasts'][0]['Date'];
    let day1Desc = dataJSON[1]['DailyForecasts'][0]['Day']['IconPhrase'];
    let day1Low = dataJSON[1]['DailyForecasts'][0]['Temperature']['Minimum']['Value'];
    let day1High = dataJSON[1]['DailyForecasts'][0]['Temperature']['Maximum']['Value'];
    let day1Date = new Date(day1);

    let day2 = dataJSON[1]['DailyForecasts'][1]['Date'];
    let day2Desc = dataJSON[1]['DailyForecasts'][1]['Day']['IconPhrase'];
    let day2Low = dataJSON[1]['DailyForecasts'][1]['Temperature']['Minimum']['Value'];
    let day2High = dataJSON[1]['DailyForecasts'][1]['Temperature']['Maximum']['Value'];
    let day2Date = new Date(day2);

    let day3 = dataJSON[1]['DailyForecasts'][2]['Date'];
    let day3Desc = dataJSON[1]['DailyForecasts'][2]['Day']['IconPhrase'];
    let day3Low = dataJSON[1]['DailyForecasts'][2]['Temperature']['Minimum']['Value'];
    let day3High = dataJSON[1]['DailyForecasts'][2]['Temperature']['Maximum']['Value'];
    let day3Date = new Date(day3);

    let day4 = dataJSON[1]['DailyForecasts'][3]['Date'];
    let day4Desc = dataJSON[1]['DailyForecasts'][3]['Day']['IconPhrase'];
    let day4Low = dataJSON[1]['DailyForecasts'][3]['Temperature']['Minimum']['Value'];
    let day4High = dataJSON[1]['DailyForecasts'][3]['Temperature']['Maximum']['Value'];
    let day4Date = new Date(day4);

    let day5 = dataJSON[1]['DailyForecasts'][4]['Date'];
    let day5Desc = dataJSON[1]['DailyForecasts'][4]['Day']['IconPhrase'];
    let day5Low = dataJSON[1]['DailyForecasts'][4]['Temperature']['Minimum']['Value'];
    let day5High = dataJSON[1]['DailyForecasts'][4]['Temperature']['Maximum']['Value'];
    let day5Date = new Date(day5);

    let dayOfWeek1;
    let dayOfWeek2;
    let dayOfWeek3;
    let dayOfWeek4;
    let dayOfWeek5;

    //Logic For Setting The Day Of The Week

    switch (day1Date.getDay()) {
        case 0:
            dayOfWeek1 = "Sunday";
            break;
        case 1:
            dayOfWeek1 = "Monday";
            break;

        case 2:
            dayOfWeek1 = "Tuesday";
            break;

        case 3:
            dayOfWeek1 = "Wednesday";
            break;

        case 4:
            dayOfWeek1 = "Thursday";
            break;

        case 5:
            dayOfWeek1 = "Friday";
            break;

        case 6:
            dayOfWeek1 = "Saturday";
            break;
    }

    switch (day2Date.getDay()) {
        case 0:
            dayOfWeek2 = "Sunday";
            break;
        case 1:
            dayOfWeek2 = "Monday";
            break;

        case 2:
            dayOfWeek2 = "Tuesday";
            break;

        case 3:
            dayOfWeek2 = "Wednesday";
            break;

        case 4:
            dayOfWeek2 = "Thursday";
            break;

        case 5:
            dayOfWeek2 = "Friday";
            break;

        case 6:
            dayOfWeek2 = "Saturday";
            break;
    }
    switch (day3Date.getDay()) {
        case 0:
            dayOfWeek3 = "Sunday";
            break;
        case 1:
            dayOfWeek3 = "Monday";
            break;

        case 2:
            dayOfWeek3 = "Tuesday";
            break;

        case 3:
            dayOfWeek3 = "Wednesday";
            break;

        case 4:
            dayOfWeek3 = "Thursday";
            break;

        case 5:
            dayOfWeek3 = "Friday";
            break;

        case 6:
            dayOfWeek3 = "Saturday";
            break;
    }
    switch (day4Date.getDay()) {
        case 0:
            dayOfWeek4 = "Sunday";
            break;
        case 1:
            dayOfWeek4 = "Monday";
            break;

        case 2:
            dayOfWeek4 = "Tuesday";
            break;

        case 3:
            dayOfWeek4 = "Wednesday";
            break;

        case 4:
            dayOfWeek4 = "Thursday";
            break;

        case 5:
            dayOfWeek4 = "Friday";
            break;

        case 6:
            dayOfWeek4 = "Saturday";
            break;
    }
    switch (day5Date.getDay()) {
        case 0:
            dayOfWeek5 = "Sunday";
            break;
        case 1:
            dayOfWeek5 = "Monday";
            break;

        case 2:
            dayOfWeek5 = "Tuesday";
            break;

        case 3:
            dayOfWeek5 = "Wednesday";
            break;

        case 4:
            dayOfWeek5 = "Thursday";
            break;

        case 5:
            dayOfWeek5 = "Friday";
            break;

        case 6:
            dayOfWeek5 = "Saturday";
            break;
    }
    //////////////////////////////////////////////////////////////////////////////////////////

    //Day Of The Week
    document.getElementById('weekday1').innerHTML = dayOfWeek1;
    document.getElementById('weekday2').innerHTML = dayOfWeek2;
    document.getElementById('weekday3').innerHTML = dayOfWeek3;
    document.getElementById('weekday4').innerHTML = dayOfWeek4;
    document.getElementById('weekday5').innerHTML = dayOfWeek5;

    //Description Of Weather
    document.getElementById('weatherDesc1').innerHTML = day1Desc;
    document.getElementById('weatherDesc2').innerHTML = day2Desc;
    document.getElementById('weatherDesc3').innerHTML = day3Desc;
    document.getElementById('weatherDesc4').innerHTML = day4Desc;
    document.getElementById('weatherDesc5').innerHTML = day5Desc;

    //Weather Lows
    document.getElementById('low1').innerHTML = "Low: " + day1Low + "C";
    document.getElementById('low2').innerHTML = "Low: " + day2Low + "C";
    document.getElementById('low3').innerHTML = "Low: " + day3Low + "C";
    document.getElementById('low4').innerHTML = "Low: " + day4Low + "C";
    document.getElementById('low5').innerHTML = "Low: " + day5Low + "C";

    //Weather Highs
    document.getElementById('high1').innerHTML = "High: " + day1High + "C";
    document.getElementById('high2').innerHTML = "High: " + day2High + "C";
    document.getElementById('high3').innerHTML = "High: " + day3High + "C";
    document.getElementById('high4').innerHTML = "High: " + day4High + "C";
    document.getElementById('high5').innerHTML = "High: " + day5High + "C";


}

$("#search-btn").on('click', function () {

    getData();
    createChart();
    //initMap();
    console.log(dataJSON);


});

function initMap() {
    const mapProp = {
        center: new google.maps.LatLng(dataJSON[2]['lat'], dataJSON[2]['lon']),
        zoom: 14
    };

    const map = new google.maps.Map(document.getElementById("map"), mapProp);

    const marker = new google.maps.Marker({
        position: mapProp.center,
        animation: google.maps.Animation.BOUNCE
    });

    marker.setMap(map);
}

///////////////////////////////////////////////////////////////
//             COVID-19 DATA SECTION                         //
///////////////////////////////////////////////////////////////



async function createChart() {

    await getData();

    var ctx = document.getElementById('chart').getContext('2d');
    var myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Newly Confirmed', 'Total Confirmed', 'Total Deaths'],
            datasets: [{
                label: '# of Covid-19 Cases in ' + dataJSON[0][0]['Country'],
                data: covidResults,
                backgroundColor: [
                    'rgba(255, 87, 20)',
                    'rgba(255, 87, 20)',
                    'rgba(255, 87, 20)',
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