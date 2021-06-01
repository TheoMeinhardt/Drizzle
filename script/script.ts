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

function GenerateForecastURL(place: string): string {
  let url = "https://api.weatherapi.com/v1/forecast.json?";
  let data = {
    key: "2ff45aa75d644a10b9b112141212403",
    q: place, // Location
    days: 3, // Forecast days
    aqi: "no", // airquality
    alerts: "no",
  };

  url += `key=${data.key}&q=${data.q}&days=${data.days}&aqi=${data.aqi}&alerts=${data.alerts}`;

  return url;
}

function RefreshData(place: string): void {
  url = GenerateForecastURL(place);
  currentDATA = GetCurrent(url);
  locationDATA = GetLocation(url);
  forecastDATA = GetForecast(url);

  updateChart(forecastChart, forecastDATA);
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

function BuildChart(forecast): typeof Chart {
  return forecast.then((value) => {
    let labels: number[] = [];
    let temperatures: number[] = [];
    let currentHour: number = Number(dateFormat(new Date(), "HH")) + 1;
    if (currentHour + 12 <= 24) {
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
            pointHitRadius: 20,
            pointRadius: 5,
            fill: {
              target: "origin",
              above: "hsl(222, 100%, 93%)",
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

function updateChart(chart: typeof Chart, forecast): void {
  forecast.then((value) => {
    let labels: number[] = [];
    let temperatures: number[] = [];
    let currentHour: number = Number(dateFormat(new Date(), "HH")) + 1;
    if (currentHour + 12 <= 24) {
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

    forecastChart.then((value) => {
      value.data.labels = labels;
      value.data.datasets.forEach((dataset) => {
        dataset.data = temperatures;
      });
    });

    forecastChart.update;
  });
}

//#endregion

// declaring the variables
let url = GenerateForecastURL("New York"),
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
  forecastChart: typeof Chart = BuildChart(forecastDATA),
  searchBar: HTMLInputElement = document.querySelector("#searchBar");

let days: Date[];

searchBar.addEventListener("keydown", (event: KeyboardEvent): void => {
  if (event.key == "Enter") {
    RefreshData(searchBar.value);
    ShowData(currentDATA, locationDATA, forecastDATA);
  }
});

ShowData(currentDATA, locationDATA, forecastDATA);

// forecastChart.then((value) => {
//   value.data.labels = ["test1", "test2"];
//   value.data.datasets.forEach((dataset) => {
//     dataset.data = [1, 2];
//   });
// });

// forecastChart.update;
