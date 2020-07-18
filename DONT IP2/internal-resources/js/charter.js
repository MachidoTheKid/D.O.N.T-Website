///////////////////////////////////////////////////////////////
//             AUTOCOMPLETE SECTION                          //
///////////////////////////////////////////////////////////////


const search = document.getElementById('search');
const matchList = document.getElementById('dialogue-box');

//Search and filter countries
const searchCountry = async searchText =>{
    const response = await fetch('internal-resources/js/countries.json');
    const countries = await response.json();

   //Get Input matches
   let matches = countries.filter(country => {
       const regex = new RegExp(`^${searchText}`, 'gi');
       return country.name.match(regex) || country.country_code.match(regex);
   });

   if(searchText.length === 0){
       matches = [];
       matchList.innerHTML = '';
   }
   outputHtml(matches);

   //Complete input once user clicks on the country
   $('body').on('click', '#dialogue-box > div',function()
    {
        matches = [];
        matchList.innerHTML = '';
        $('.search-bar input').val($(this).text().trim()).focus();
    });
};

//Push results to html
const outputHtml = matches => {
    if(matches.length > 0)
    {
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

const getData =  async () => {

    if(dataJSON != [])
    {
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
    const weatherResponse = await fetch("http://dataservice.accuweather.com/forecasts/v1/daily/5day/"+ locKey +"?apikey=oS152H6tFLAwJDF1RjHnDXIKr56AtTQs");
    const weatherData = await weatherResponse.json();

    let lat = locInfo[0]['GeoPosition']['Latitude'];
    let lon = locInfo[0]['GeoPosition']['Longitude'];
    dataJSON.push(matches, weatherData, {lat, lon})
}

$("#search-btn").on('click', function()
{
    getData();
    //initMap();
    console.log(dataJSON);
});

function initMap()
{
    const mapProp= { center: new google.maps.LatLng(dataJSON[2]['lat'], dataJSON[2]['lon']), zoom: 14 };
    
    const map = new google.maps.Map(document.getElementById("map"),mapProp);

    const marker = new google.maps.Marker({position:mapProp.center, animation:google.maps.Animation.BOUNCE});
      
    marker.setMap(map); 
}

///////////////////////////////////////////////////////////////
//             COVID-19 DATA SECTION                         //
///////////////////////////////////////////////////////////////

const covidValues = [];

//createChart();


async function createChart() {

    await getData();

    var ctx = document.getElementById('myChart').getContext('2d');
    var myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Newly Confirmed', 'New Deaths', 'New Recoveries'],
            datasets: [{
                label: '# of Covid-19 Cases Worldwide',
                data: covidValues,
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