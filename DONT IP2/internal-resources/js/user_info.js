$(document).ready(function(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(async function(position){
            console.log(position);
            const usrData = fetch('https://maps.googleapis.com/maps/api/geocode/json?latlng=' + position.coords.latitude + ',' + position.coords.longitude + '&sensor=false');
            const data = await usrData;

            console.log(data);
        });
    }
});