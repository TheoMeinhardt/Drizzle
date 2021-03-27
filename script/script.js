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
  let url = "http://api.weatherapi.com/v1/forecast.json?";
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

function ShowData(current, location, forecast) {
  location.then((value) => {
    locationDisplay.innerHTML = `${value.name}, ${value.country}`;
  });

  current.then((value) => {
    timeMeasuredDisplay.innerHTML = value.last_updated.substring(11, 16);
    currentTemperaturDisplay.innerHTML = value.temp_c + " °C";
    currentConditionDisplay.innerHTML = value.condition.text.toLowerCase();
    currentConditionIconDisplay.src = value.condition.icon;
  });
}

let url = GenerateURL(),
  currentDATA = GetCurrent(url),
  locationDATA = GetLocation(url),
  forecastDATA = GetForecast(url),
  locationDisplay = document.querySelector(".locationDisplay"),
  timeMeasuredDisplay = document.querySelector(".timeMeasuredDisplay"),
  currentTemperaturDisplay = document.querySelector(".currentTemperaturDisplay"),
  currentConditionDisplay = document.querySelector(".currentConditionDisplay"),
  currentConditionIconDisplay = document.querySelector(".currentConditionIconDisplay");

ShowData(currentDATA, locationDATA, forecastDATA);
