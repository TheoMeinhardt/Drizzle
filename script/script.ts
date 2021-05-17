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

async function GetPlaces(placeName: string): Promise<JSON> {
  let URL = GeneratePlacesURL(placeName);
  let response: Promise<JSON> = await fetch(URL).then((Response) => Response.json());
  console.log(response);
  return null;
}

function GenerateForecastURL() {
  let url = "https://api.weatherapi.com/v1/forecast.json?";
  let data = {
    key: "2ff45aa75d644a10b9b112141212403",
    q: "Vienna", // Location
    days: 3, // Forecast days
    aqi: "no", // airquality
    alerts: "no",
  };

  url += `key=${data.key}&q=${data.q}&days=${data.days}&aqi=${data.aqi}&alerts=${data.alerts}`;

  return url;
}

function GeneratePlacesURL(placeName: string): string {
  let url = "https://api.weatherapi.com/v1/search.json?key=2ff45aa75d644a10b9b112141212403&q=";
  url += placeName;
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
  });
}

function BuildChart(forecast): void {
  forecast.then((value) => {
    let labels: number[] = [];
    let temperatures: number[] = [];
    let currentHour: number = Number(dateFormat(new Date(), "HH"));
    if (currentHour + 12 < 24) {
      for (let i = currentHour; i < currentHour + 12; i++) {
        labels.push(dateFormat(value.forecastday[0].hour[i].time, "HH:MM"));
        temperatures.push(value.forecastday[0].hour[i].temp_c);
      }
    } else if (currentHour + 12 > 24) {
      for (let i = currentHour; i < 24; i++) {
        labels.push(dateFormat(value.forecastday[0].hour[i].time, "HH:MM"));
        temperatures.push(value.forecastday[0].hour[i].temp_c);
      }
      for (let i = 0; i < 12 - (24 - currentHour); i++) {
        labels.push(dateFormat(value.forecastday[1].hour[i].time, "HH:MM"));
        temperatures.push(value.forecastday[1].hour[i].temp_c);
      }
    }

    let chart: typeof Chart = new Chart(forecastChartCanvas, {
      type: "line",
      data: {
        labels: labels,
        datasets: [
          {
            label: "Temperature °C",
            data: temperatures,
            backgroundColor: "hsl(132, 100%, 93%)",
            borderColor: "hsl(222, 100%, 93%)",
            pointHitRadius: 5,
            pointRadius: 3.5,
            fill: {
              target: "origin",
              above: "hsl(222, 100%, 93%)",
            },
          },
        ],
      },
    });
  });
}

function search(searchBar: HTMLInputElement): void {}

//#endregion

// declaring the variables
let url = GenerateForecastURL(),
  currentDATA = GetCurrent(url),
  locationDATA = GetLocation(url),
  forecastDATA = GetForecast(url),
  locationDisplay = document.querySelector(".locationDisplay"),
  timeMeasuredDisplay = document.querySelector(".timeMeasuredDisplay"),
  currentTemperaturDisplay = document.querySelector(".currentTemperaturDisplay"),
  currentConditionTextDisplay = document.querySelector(".currentConditionTextDisplay"),
  currentConditionIconDisplay: HTMLImageElement = document.querySelector(".currentConditionIconDisplay"),
  currentWindSpeedDisplay = document.querySelector(".currentWindSpeedDisplay"),
  currentHumidityDisplay = document.querySelector(".currentHumidityDisplay"),
  currentVisibilityDisplay = document.querySelector(".currentVisibilityDisplay"),
  currentFeelsLike = document.querySelector(".currentFeelsLike"),
  forecastChartCanvas: HTMLCanvasElement = document.querySelector("#forecastChart"),
  searchBar: HTMLInputElement = document.querySelector("#searchBar");

let days: Date[];
let forecastChart = BuildChart(forecastDATA);

ShowData(currentDATA, locationDATA, forecastDATA);
search(searchBar);

console.log(forecastDATA);
