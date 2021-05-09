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
    q: "Vienna", // Location
    days: 3, // Forecast days
    aqi: "no", // airquality
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

// declaring the variables
let url = GenerateURL(),
  currentDATA = GetCurrent(url),
  locationDATA = GetLocation(url),
  forecastDATA = GetForecast(url),
  locationDisplay = document.querySelector(".locationDisplay"),
  timeMeasuredDisplay = document.querySelector(".timeMeasuredDisplay"),
  currentTemperaturDisplay = document.querySelector(".currentTemperaturDisplay"),
  currentConditionTextDisplay = document.querySelector(".currentConditionTextDisplay"),
  currentConditionIconDisplay = document.querySelector(".currentConditionIconDisplay"),
  currentWindSpeedDisplay = document.querySelector(".currentWindSpeedDisplay"),
  currentHumidityDisplay = document.querySelector(".currentHumidityDisplay"),
  currentVisibilityDisplay = document.querySelector(".currentVisibilityDisplay"),
  currentFeelsLike = document.querySelector(".currentFeelsLike");

ShowData(currentDATA, locationDATA, forecastDATA);
