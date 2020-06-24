console.log("I am running");

const covidValues = [];

createChart();

async function getData() {

    fetch('https://api.covid19api.com/summary')
        .then(response => response.json())
        .then(data => {

            console.log(data);

            var newConfirmed = data['Global']['NewConfirmed'];
            var newDeaths = data['Global']['NewDeaths'];
            var newRecovered = data['Global']['NewRecovered'];
            var totalConfirmed = data['Global']['TotalConfirmed'];
            var totalDeaths = data['Global']['TotalDeaths'];
            var totalRecovered = data['Global']['TotalRecovered'];

            console.log("There are " + newConfirmed + " new cases of Covid-19");
            console.log(newDeaths + " new deaths have been confirmed.");
            console.log(newRecovered + " have newly recovered");
            console.log("The total cases is " + totalConfirmed);
            console.log("The total death toll is " + totalDeaths);
            console.log("The total amount of revoveries is " + totalRecovered);

            covidValues.push(newConfirmed, newDeaths, newRecovered);

            console.log(covidValues);

            document.getElementById("numbers").innerHTML = "The world currently has a total of " + "<b style='color: #FF5714'>" + totalConfirmed + "</b>" + " <b>confirmed</b> Covid-19 cases."







        })





};

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