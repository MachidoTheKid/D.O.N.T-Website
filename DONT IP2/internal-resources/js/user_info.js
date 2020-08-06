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

    async function populateCards(){
        await getData();

        if(!navigator.geolocation){
            console.log(x);
        }
        else{
        navigator.geolocation.getCurrentPosition(async function(position){
    
            const usrData = await fetch('https://revgeocode.search.hereapi.com/v1/revgeocode?at='+ position.coords.latitude +'%2C'+ position.coords.longitude +'&lang=en-US&apikey=aBYnf2wLOm-J85_5v6FmNOYFRYKxzS5LQxLfQiD6Jk4');
            const data = await usrData.json();
        
            const cntryNm = data['items'][0]['address']['countryName'];

            let matches = x[1].filter(country => {
                const regex = new RegExp(`^${cntryNm}`, 'gi');
                return country.Country.match(regex);
            });

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
        });
        }
    }
    populateCards();  
});