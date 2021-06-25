const Chart = require("chart.js");
const dateFormat = require("dateformat");
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
function GenerateForecastURL(place) {
    let url = "https://api.weatherapi.com/v1/forecast.json?";
    let data = {
        key: "2ff45aa75d644a10b9b112141212403",
        q: place,
        days: 3,
        aqi: "no",
        alerts: "no",
    };
    url += `key=${data.key}&q=${data.q}&days=${data.days}&aqi=${data.aqi}&alerts=${data.alerts}`;
    return url;
}
function RefreshData(place) {
    url = GenerateForecastURL(place);
    currentDATA = GetCurrent(url);
    locationDATA = GetLocation(url);
    forecastDATA = GetForecast(url);
    updateChart(forecastDATA);
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
    });
}
function BuildChart(forecast) {
    return forecast.then((value) => {
        let labels = [];
        let temperatures = [];
        let currentHour = Number(dateFormat(new Date(), "HH")) + 1;
        if (currentHour + 12 <= 24) {
            for (let i = currentHour; i < currentHour + 12; i++) {
                labels.push(dateFormat(value.forecastday[0].hour[i].time, "HH:MM"));
                temperatures.push(value.forecastday[0].hour[i].temp_c);
            }
        }
        else if (currentHour + 12 > 24) {
            for (let i = currentHour; i < 24; i++) {
                labels.push(dateFormat(value.forecastday[0].hour[i].time, "HH:MM"));
                temperatures.push(value.forecastday[0].hour[i].temp_c);
            }
            for (let i = 0; i < 12 - (24 - currentHour); i++) {
                labels.push(dateFormat(value.forecastday[1].hour[i].time, "HH:MM"));
                temperatures.push(value.forecastday[1].hour[i].temp_c);
            }
        }
        let chart = new Chart(forecastChartCanvas, {
            type: "line",
            data: {
                labels: labels,
                datasets: [
                    {
                        label: "Temperature °C",
                        data: temperatures,
                        // backgroundColor: "#F1A208",
                        borderColor: "#F1A208",
                        pointHitRadius: 20,
                        pointRadius: 5,
                        fill: {
                            target: "start",
                            above: "#F26430",
                        },
                    },
                ],
            },
            options: {
                scales: {
                    y: {
                        ticks: {
                            callback: function (value, index, values) {
                                if (value % 1 == 0) {
                                    return value + " °C";
                                }
                            },
                        },
                    },
                },
                plugins: {
                    legend: {
                        display: true,
                        position: "top",
                        align: "end",
                    },
                },
            },
        });
        return chart;
    });
}
function writeFavouriteCookies() {
    let cookieString = "";
    favourites.forEach((item) => {
        cookieString += `${item};`;
    });
    document.cookie = `favourites=${cookieString}`;
}
function readFavouriteCookies() {
    return [];
}
function updateChart(forecast) {
    forecastChartCanvas.remove();
    let canvas = document.createElement("canvas");
    canvas.id = "forecastChart";
    canvas.classList.add("forecastChart");
    document.querySelector("#forecast").appendChild(canvas);
    forecastChartCanvas = document.querySelector("#forecastChart");
    forecastChart = BuildChart(forecast);
}
function saveSearches(query) {
    storage.setItem(query, query);
    let option = document.createElement("option");
    option.value = storage.getItem(query);
    cityDataList.appendChild(option);
}
//#endregion
// declaring the variables
let url = GenerateForecastURL("New York"), currentDATA = GetCurrent(url), locationDATA = GetLocation(url), forecastDATA = GetForecast(url), locationDisplay = document.querySelector(".locationDisplay"), timeMeasuredDisplay = document.querySelector(".timeMeasuredDisplay"), currentTemperaturDisplay = document.querySelector(".currentTemperaturDisplay"), currentConditionTextDisplay = document.querySelector(".currentConditionTextDisplay"), currentConditionIconDisplay = document.querySelector(".currentConditionIconDisplay"), currentWindSpeedDisplay = document.querySelector(".currentWindSpeedDisplay"), currentHumidityDisplay = document.querySelector(".currentHumidityDisplay"), currentVisibilityDisplay = document.querySelector(".currentVisibilityDisplay"), currentFeelsLike = document.querySelector(".currentFeelsLike"), forecastChartCanvas = document.querySelector("#forecastChart"), forecastChart = BuildChart(forecastDATA), searchArea = document.querySelector("#searchArea"), searchBar = document.querySelector("#searchBar"), searchButton = document.querySelector("#searchButton"), storage = localStorage, cityDataList = document.querySelector("#cityDataList"), favourites = [], favouriteButton = document.querySelector("#favouriteButton"), favouriteBack = document.querySelector("#favouriteBack"), favouriteNext = document.querySelector("#favouriteNext");
let days;
//#region Eventlisteners:
searchBar.addEventListener("keydown", (event) => {
    if (event.key == "Enter") {
        RefreshData(searchBar.value);
        ShowData(currentDATA, locationDATA, forecastDATA);
        saveSearches(searchBar.value);
    }
});
searchBar.addEventListener("focus", (event) => {
    searchArea.classList.add("searchbarFocus");
});
searchBar.addEventListener("blur", (event) => {
    searchArea.classList.remove("searchbarFocus");
});
searchButton.addEventListener("click", (event) => {
    RefreshData(searchBar.value);
    ShowData(currentDATA, locationDATA, forecastDATA);
    saveSearches(searchBar.value);
});
favouriteButton.addEventListener("click", (event) => {
    let alreadyFavourite;
    for (let i = 0; i < favourites.length; i++) {
        let item = favourites[i];
    }
    favourites.forEach((item) => {
        alreadyFavourite = item == locationDisplay.innerHTML ? true : false;
    });
    switch (alreadyFavourite) {
        case true:
            favourites.splice(favourites.indexOf(locationDisplay.innerHTML, 1));
            break;
        case false:
            favourites.push(locationDisplay.innerHTML);
            break;
    }
    console.log(favourites.length);
    // writeFavouriteCookies();
});
favouriteBack.addEventListener("click", (event) => { });
favouriteNext.addEventListener("click", (event) => { });
//#endregion
favourites = readFavouriteCookies();
ShowData(currentDATA, locationDATA, forecastDATA);
