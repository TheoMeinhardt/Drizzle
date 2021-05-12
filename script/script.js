var Chart = require("chart.js");
console.log("test");
//#region functions
async function GetLocation(URL) {
    let response = await fetch(URL).then((Response) => Response.json());
    return response.location;
}
async function GetCurrent(URL) {
    let response = await fetch(URL).then((Response) => Response.json());
    return response.current;
}
async function GetForecast(URL) {
    let response = await fetch(URL).then((Response) => Response.json());
    return response.forecast;
}
function GenerateURL() {
    let url = "https://api.weatherapi.com/v1/forecast.json?";
    let data = {
        key: "2ff45aa75d644a10b9b112141212403",
        q: "Vienna",
        days: 3,
        aqi: "no",
        alerts: "no",
    };
    url += `key=${data.key}&q=${data.q}&days=${data.days}&aqi=${data.aqi}&alerts=${data.alerts}`;
    return url;
}
// updating the data in html
function ShowData(current, location, forecast) {
    location.then((value) => {
        locationDisplay.innerHTML = `${value.name}, ${value.country}`;
    });
    current.then((value) => {
        timeMeasuredDisplay.innerHTML = "last updated " + value.last_updated.substring(11, 16);
        currentTemperaturDisplay.innerHTML = value.temp_c + " °C";
        currentConditionTextDisplay.innerHTML = value.condition.text.toLowerCase();
        currentConditionIconDisplay.src = value.condition.code == 1000 ? "../icons/night/113.png" : value.condition.icon;
        currentWindSpeedDisplay.innerHTML = value.wind_kph + '<span class="superSmall">kph</span>';
        currentHumidityDisplay.innerHTML = value.humidity + '<span class="superSmall">%</span>';
        currentVisibilityDisplay.innerHTML = value.vis_km + '<span class="superSmall">km</span>';
        currentFeelsLike.innerHTML = "feels like " + value.feelslike_c + " °C";
        console.log("value");
    });
}
//#endregion
// declaring the variables
let url = GenerateURL(), currentDATA = GetCurrent(url), locationDATA = GetLocation(url), forecastDATA = GetForecast(url), locationDisplay = document.querySelector(".locationDisplay"), timeMeasuredDisplay = document.querySelector(".timeMeasuredDisplay"), currentTemperaturDisplay = document.querySelector(".currentTemperaturDisplay"), currentConditionTextDisplay = document.querySelector(".currentConditionTextDisplay"), currentConditionIconDisplay = document.querySelector(".currentConditionIconDisplay"), currentWindSpeedDisplay = document.querySelector(".currentWindSpeedDisplay"), currentHumidityDisplay = document.querySelector(".currentHumidityDisplay"), currentVisibilityDisplay = document.querySelector(".currentVisibilityDisplay"), currentFeelsLike = document.querySelector(".currentFeelsLike"), forecastChartCanvas = document.querySelector("#forecastChart");
let forecastChart = new Chart(forecastChartCanvas, {
    type: "bar",
    data: {
        labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
        datasets: [
            {
                label: "# of Votes",
                data: [12, 19, 3, 5, 2, 3],
                backgroundColor: ["rgba(255, 99, 132, 0.2)", "rgba(54, 162, 235, 0.2)", "rgba(255, 206, 86, 0.2)", "rgba(75, 192, 192, 0.2)", "rgba(153, 102, 255, 0.2)", "rgba(255, 159, 64, 0.2)"],
                borderColor: ["rgba(255, 99, 132, 1)", "rgba(54, 162, 235, 1)", "rgba(255, 206, 86, 1)", "rgba(75, 192, 192, 1)", "rgba(153, 102, 255, 1)", "rgba(255, 159, 64, 1)"],
                borderWidth: 1,
            },
        ],
    },
    options: {
        scales: {
            y: {
                beginAtZero: true,
            },
        },
    },
});
ShowData(currentDATA, locationDATA, forecastDATA);
