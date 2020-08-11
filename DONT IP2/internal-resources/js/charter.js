///////////////////////////////////////////////////////////////
//             AUTOCOMPLETE SECTION                          //
///////////////////////////////////////////////////////////////



const search = document.getElementById('search');
const matchList = document.getElementById('dialogue-box');

//Search and filter countries
const searchCountry = async searchText => {
    try{
        const response = await fetch('https://restcountries.eu/rest/v2/all');
        const countries = await response.json();


        //Get Input matches
        let matches = countries.filter(country => {
            const regex = new RegExp(`^${searchText}`, 'gi');
            return country.name.match(regex) || country.alpha2Code.match(regex);
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
    }
    catch(e){
        console.log("Couldn't fetch Country data from REST Countries API");
    }
};

//Push results of filtered data to html
const outputHtml = matches => {
    if (matches.length > 0) {
        const html = matches.map(
            match => `
            <div class="result">
                <p>${match.name}, <small style = "color: #FF5714">${match.capital}</small>, ${match.alpha2Code}</p>
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
 //Converts the input value to lowercase for uniformity

const getCovid = async () =>{
    if (covidResults != []) {
        covidResults = [];
    }

    const nameArray = search.value.toUpperCase().split(",");

    //Access COVID-19 Data from API
    try{
        const covidResponse = await fetch('https://api.covid19api.com/summary');
        const covidData = await covidResponse.json();
    

        let ctryData = covidData["Countries"];

        //Filter through country data to isolate search results
        let matches = ctryData.filter(country => {
            const regex = new RegExp(`^${(nameArray[2]).trim()}`, 'gi');
            return country.CountryCode.match(regex);
        });

        if(matches.length == 0){
            console.log("No data available");
        }
        else{
            let newConfirmed = matches[0]['NewConfirmed'];
            let totalConfirmed = matches[0]['TotalConfirmed'];
            let newDeaths = matches[0]['NewDeaths'];
            let totalDeaths = matches[0]['TotalDeaths'];
            let newRecovered = matches[0]['NewRecovered'];
            let totalRecovered = matches[0]['TotalRecovered'];
            let countryName = matches[0]['Country'];
        
            covidResults.push(newConfirmed, totalConfirmed, newDeaths, totalDeaths, newRecovered, totalRecovered);
            document.getElementById('countryTitle').innerHTML = countryName;
        }
        return matches;
    }
    catch(e){
        console.log("Couldn't retrive data from COVID-19 API");
    }
}

const getWeather = async () =>{
    const nameArray = search.value.toLowerCase().split(",");
    //Get location Key of the capital to the country that has been searched
    try{
        const locations = await fetch("https://dataservice.accuweather.com/locations/v1/cities/search?apikey=3oOG7f0AptkQ2O9kUg08Hlvo0YD2JaA5&q=" + (nameArray[1]).trim());
        const locInfo = await locations.json();
    


        if(locInfo){
            let locKey = locInfo[0]['Key'];

            //Get 5 day weather forecast from API
            const weatherResponse = await fetch("https://dataservice.accuweather.com/forecasts/v1/daily/5day/" + locKey + "?apikey=3oOG7f0AptkQ2O9kUg08Hlvo0YD2JaA5&metric=true");
            const weatherData = await weatherResponse.json();

                ///////////////////weather data (Days)//////////////////////////////////////////////

            let dayData = [];

            //Accesses and assigns data received from API to different variables
            for (let i = 0; i < 5; i++) {
                let day = weatherData['DailyForecasts'][i]['Date'];
                let dayDesc = weatherData['DailyForecasts'][i]['Day']['IconPhrase'];
                let dayIcon = weatherData['DailyForecasts'][i]['Day']['Icon'];
                let dayLow = weatherData['DailyForecasts'][i]['Temperature']['Minimum']['Value'];
                let dayHigh = weatherData['DailyForecasts'][i]['Temperature']['Maximum']['Value'];
                let dayDate = new Date(day);

                const icons = await fetch("DONT IP2/internal-resources/js/weather-icons.json");
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
        else{
            console.log("No weather info available at the time")
        }
    }
    catch(e){
        console.log("Couldn't retrive location info from AccuWeather: " + e);
    }
}


const getForex = async () => {
    
    let date = new Date();

    const day = date.getDate();
    const month = date.getMonth();
    const year = date.getFullYear();

    const calcStart = () =>{
        if(month < 10){
            if((day - 1) < 10){
                return (year).toString() + "-0" + (month + 1).toString() + "-0" + (day - 1).toString();
            }
            else{
                return (year).toString() + "-0" + (month + 1).toString() + "-" + (day - 1).toString();
            }
        }
        else{
            if((day - 1) < 10){
                return (year).toString() + "-" + (month + 1).toString() + "-0" + (day - 1).toString();
            }
            else{
                return (year).toString() + "-" + (month + 1).toString() + "-" + (day - 1).toString();
            }
        }
    }

    const calcEnd = () =>{
        let finDay = day - 30;
        //return finDay
        if(finDay < 1){
            if(month < 10){
                if(day < 10){
                    return (year).toString() + "-0" + (month).toString() + "-0" + (finDay + 30).toString();
                }
                else{
                    return (year).toString() + "-0" + (month).toString() + "-" + (finDay + 30).toString();
                }
            }
            else{
                if(day < 10){
                    return (year).toString() + "-" + (month).toString() + "-0" + (finDay + 30).toString();
                }
                else{
                    return (year).toString() + "-" + (month).toString() + "-" + (finDay + 30).toString();
                }
            }
            
        }
        else{
            if(month < 10){
                if(day < 10){
                    return (year).toString() + "-0" + (month + 1).toString() + "-0" + (finDay).toString();
                }
                else{
                    return (year).toString() + "-0" + (month + 1).toString() + "-" + (finDay).toString();
                }
            }
            else{
                if(day < 10){
                    return (year).toString() + "-" + (month + 1).toString() + "-0" + (finDay).toString();
                }
                else{
                    return (year).toString() + "-" + (month + 1).toString() + "-" + (finDay).toString();
                }
            }
            
        }
    }

    let startdate = calcStart();
    let enddate = calcEnd();

    try{
        const nameArray = search.value.toLowerCase().split(",");

        const response = await fetch('https://restcountries.eu/rest/v2/all');
        const countries = await response.json();


        //Get Input matches
        let currMatch = countries.filter(country => {
            const regex = new RegExp(`^${(nameArray[2]).trim()}`, 'gi');
            return country.alpha2Code.match(regex);
        });
        
        let curr = currMatch[0]['currencies'][0]['code'];

        //Get forex data from API
        const forexResponse = await fetch("https://fcsapi.com/api-v2/forex/history?symbol=USD/" + curr + "&period=1d&from=" + enddate + "&to=" + startdate + "&access_key=DMp8zgiikH1CSk734LE2yVUBEwHFt1u3fx4Co2XRP1E7gA");
        const forexData = await forexResponse.json();

        let oData = [];
        let hData = [];
        let lData = [];
        let cData = [];
        let tmData = [];
        for(let i = 0; i < forexData['response'].length; i++){
            let o = forexData['response'][i]['o'];
            oData.push(o);
        }
        for(let i = 0; i < forexData['response'].length; i++){
            let h = forexData['response'][i]['h'];
            hData.push(h);
        }
        for(let i = 0; i < forexData['response'].length; i++){
            let l = forexData['response'][i]['l'];
            lData.push(l);
        }
        for(let i = 0; i < forexData['response'].length; i++){
            let c = forexData['response'][i]['c'];
            cData.push(c);
        }
        for(let i = 0; i < forexData['response'].length; i++){
            let tm = forexData['response'][i]['tm'];
            tmData.push((tm).substr(5, 5));
        }
        return [oData, hData, lData, cData, tmData];
    }
    catch(e){
        console.log("An error ocured while fetching the Forex Data from the API");
    }
}

//Map initialization function

let map;
var magSetting = 4.5;
async function initMap() {

    const nameArray = search.value.toUpperCase().split(",");

    try{
        const response = await fetch('https://restcountries.eu/rest/v2/all');
        const countries = await response.json();


        //Get Input matches
        let matches = countries.filter(country => {
            const regex = new RegExp(`^${(nameArray[2]).trim()}`, 'gi');
            return country.name.match(regex) || country.alpha2Code.match(regex);
        });

        let lat = matches[0]['latlng'][0];
        let long = matches[0]['latlng'][1];

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
                let contentString =
                    '<div class="card-2" style="text-align: center">' +
                    '<h3>Location: </h3>' + title +
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
    }
    catch(e){
        console.log("Couldn't load map data from Google Maps" + e);
    }
    $(".loader").fadeOut(500);
}


///////////////////////////////////////////////////////////////
//             COVID-19 DATA CHART SECTION                   //
///////////////////////////////////////////////////////////////



async function covidChart() {
    try{
        let cdt = await getCovid();
        if(cdt.length != 0){
            let ctx = document.getElementById('covidChart').getContext('2d');
            let myChart = new Chart(ctx, {
                type: 'horizontalBar',
                data: {
                    labels: ['Newly Confirmed', 'Total Confirmed', 'New Deaths', 'Total Deaths', 'New Recovered', 'Total Recovered'],
                    datasets: [{
                        label: 'Number of Covid-19 Cases in ' + cdt[0]['Country'],
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
        else{
            let c = document.getElementById("covidChart");
            let ctx = c.getContext("2d");

            ctx.font = "15px Source Code Pro";
            ctx.fillStyle = "#383838";
            ctx.textAlign = "center";
            ctx.fillText("Sorry, no COVID-19 data", c.width/2, c.height/2 - 10);
            ctx.fillText("available for this country", c.width/2, c.height/2 + 10);

            ctx.globalCompositeOperation = "destination-over";
            ctx.fillStyle = "#9C9C9CCC";
            ctx.fillRect(0, 0, c.width, c.height);
        }
    }
    catch(e){
        console.log("Couldn't Graph the COVID-19 Data Chart");
    }
}

async function forexChart() {

    let cdt = await getForex();
    //console.log(cdt)
    try{
        let ctx = document.getElementById('forexChart').getContext('2d');
        let myChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: cdt[4],
                datasets: [{
                    label: "Opening Value",
                    data: cdt[0],
                    backgroundColor: 'rgba(255, 87, 20)',
                    fill: false,
                    borderWidth: 1,
                    borderColor: '#D8D4F2b3'
                },
                {
                    label: "Highest Value",
                    data: cdt[1],
                    backgroundColor: 'rgba(255, 87, 20)',
                    fill: false,
                    borderWidth: 1,
                    borderColor: '#009c11b3'
                },
                {
                    label: "Lowest Value",
                    data: cdt[2],
                    backgroundColor: 'rgba(255, 87, 20)',
                    fill: false,
                    borderWidth: 1,
                    borderColor: '#9c2200b3'
                },
                {
                    label: "Closing Value",
                    data: cdt[3],
                    backgroundColor: 'rgba(255, 87, 20)',
                    fill: false,
                    borderWidth: 1,
                    borderColor: '#FF5714b3'
                }],
            },
            options: {

                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: false,
                            stepSize: 0.05,
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
    catch(e){
        console.log("An error occured while graphing the Forex data");
    }
}

$("#search-btn").on('click', function () {
    initMap();
    covidChart();
    getWeather();
    forexChart();
});