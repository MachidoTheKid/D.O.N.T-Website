const startTime = ()=> {
    let today = new Date();
    let h = today.getHours();
    let m = today.getMinutes();
    let s = today.getSeconds();

    h = checkTime(h);
    m = checkTime(m);
    s = checkTime(s);

    setTimeout(startTime, 1000);

    document.querySelector("#clock").innerHTML = (h + ":" + m);
}

function checkTime(i) {
if (i < 10) {i = "0" + i};  // add zero in front of numbers < 10
return i;
}

$(document).ready(function(){
    let x = [];

    const getData = async ()=>{
        const covidResponse = await fetch('https://api.covid19api.com/summary');
        const covidData = await covidResponse.json();
        
        const glblData = covidData['Global'];
        const cntyData = covidData['Countries'];

        const eqData = await fetch('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson');
        const f_eqData = await eqData.json();

        const eqCount = f_eqData['metadata']['count'];
        let hiMagn = [];
        for(let i = 0; i < eqCount; i++){
            let magn = f_eqData['features'][i]['properties']['mag'];
            
            if(magn >= 4.5){
                hiMagn.push(magn);
            }
        }

        x.push(glblData, cntyData, [eqCount, hiMagn]);
    }

    async function defaultCards(){
        await getData();
        //startTime();

        document.querySelector(".grid-card2 .front-face").innerHTML = (
            `<div>
                <p>
                    Did you know that there have been a total of <strong style="color: #FF5714;">${x[2][0]}</strong> earthquakes around the world
                    within the past week alone!
                </p>
            </div>
            `
        );
        document.querySelector(".grid-card2 .back-face").innerHTML = (
            `<div>
                <p>
                    Out of these at least <strong>${x[2][1].length}</strong> were concidered servere, with a magnitude of more than 4.5!
                </p>
            </div>
            `
        );
    }
    defaultCards();

    async function accessGranted(){
        await getData();

        navigator.geolocation.getCurrentPosition(async function(position){

            const usrData = await fetch('https://revgeocode.search.hereapi.com/v1/revgeocode?at='+ position.coords.latitude +'%2C'+ position.coords.longitude +'&lang=en-US&apikey=aBYnf2wLOm-J85_5v6FmNOYFRYKxzS5LQxLfQiD6Jk4');
            const data = await usrData.json();

            const cntryNm = data['items'][0]['address']['countryName'];
            const ctyNm = data['items'][0]['address']['city'];

            let matches = x[1].filter(country => {
                const regex = new RegExp(`^${cntryNm}`, 'gi');
                return country.Country.match(regex);
            });

            //Get location Key of the city that the user is in
            const locations = await fetch("http://dataservice.accuweather.com/locations/v1/cities/search?apikey=zVPYSg54sk5yXACOSMcQtQlqk8Oir6d8&q=" + ctyNm);
            const locInfo = await locations.json();

            let locKey = locInfo[0]['Key'];

            //Get Current Conditions from API
            const currentResponse = await fetch("http://dataservice.accuweather.com/currentconditions/v1/" + locKey + "?apikey=zVPYSg54sk5yXACOSMcQtQlqk8Oir6d8");
            const currentData = await currentResponse.json();

            document.querySelector(".grid-card1 .front-face").innerHTML = (
                `<div>
                    <p>Currently, there is a total</p>
                    <h3 style="color: #FF5714;"><strong>${matches[0]['TotalConfirmed']}</strong></h3>
                    <p>confirmed COVID-19 cases in ${cntryNm} </p>
                </div>`
            );
            document.querySelector(".grid-card1 .back-face").innerHTML =(
                `<div>
                    <small>New Confirmed cases:</small>
                    <h4 style="margin: .8rem;">${matches[0]['NewConfirmed']}</h4>
                    <small>Total deaths:</small>
                    <h4 style="margin: .8rem;">${matches[0]['TotalDeaths']}</h4>
                </div>`
            );
            document.querySelector(".grid-card3 .front-face").innerHTML = (
                `<div>
                    <p>Current Condition</p>
                    <p style="color: #FF5714;">${currentData[0]['WeatherText']}</p>
                </div>`
            );
            
            document.querySelector(".grid-card3 .back-face").innerHTML =(
                `<div>
                    <small>Time</small>
                    <p id="clock">0030</p>
                    <small>Temp</small>
                    <p>${currentData[0]['Temperature']['Metric']['Value']}&deg;C</p>
                </div>`
            );
        });
    }

    async function accessDenied(){
        await getData();

        document.querySelector(".grid-card1 .front-face").innerHTML = (
            `<div>
                <p>Currently, there is a total</p>
                <h3 style="color: #FF5714;"><strong>${x[0]['TotalConfirmed']}</strong></h3>
                <p>confirmed COVID-19 cases in the world </p>
            </div>`
        );
        document.querySelector(".grid-card1 .back-face").innerHTML =(
            `<div>
                <small>New Confirmed cases:</small>
                <h4 style="margin: .8rem;">${x[0]['NewConfirmed']}</h4>
                <small>Total deaths:</small>
                <h4 style="margin: .8rem;">${x[0]['TotalDeaths']}</h4>
            </div>`
        );            
    }

    $(".yes").on('click',function(){
        accessGranted();
    });

    $(".no").on('click',function(){
        accessDenied();
    });
});