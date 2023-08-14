const condition = document.getElementById("condition");
const city = document.getElementById("city");
const country = document.getElementById("country");
const mainText = document.getElementById("main");
const description = document.getElementById("description");
const temp = document.getElementById("temp");
const pressure = document.getElementById("pressure");
const humidity = document.getElementById("humidity");

const cityInput = document.getElementById("cityInput");
const historyElm = document.getElementById("historyElm");
const masterHistory = document.getElementById("masterHistory");

const API_KEY = "3195a744f4c1137995d86351b3dcd3b3";
const BASE_URL = `https://api.openweathermap.org/data/2.5/weather?appid=${API_KEY}`;
const ICON_URL = "https://openweathermap.org/img/wn/";
const DEFAULT_CITY = "dhaka,bd";

window.onload = function () {
 navigator.geolocation.getCurrentPosition(
  (s) => {
   getWeatherData(null, s.coords);
  },
  (e) => {
   getWeatherData(DEFAULT_CITY);
  }
 );
};

function getWeatherData(city = DEFAULT_CITY, coords) {
 let url = BASE_URL;

 city === null
  ? (url = `${url}&lat=${coords.latitude}&lon=${coords.longitude}`)
  : (url = `${url}&q=${city}`);

 axios
  .get(url)
  .then(({ data }) => {
   let weather = {
    icon: data.weather[0].icon,
    city: data.name,
    country: data.sys.country,
    main: data.weather[0].main,
    description: data.weather[0].description,
    temp: data.main.temp,
    pressure: data.main.pressure,
    humidity: data.main.humidity,
   };
   console.log(data);
   setWeather(weather);
  })
  .catch((e) => {
   console.error("City Not Found!");
   console.error(e);
  });
}

function setWeather(weather) {
 condition.src = `${ICON_URL}${weather.icon}@2x.png`;
 city.innerHTML = weather.city;
 country.innerHTML = weather.country;
 mainText.innerHTML = weather.main;
 description.innerHTML = weather.description;
 temp.innerHTML = `${Math.round(100 * ((weather.temp)-273.15))/100}°C`;
 pressure.innerHTML = `${weather.pressure} <small>hPA</small>`;
 humidity.innerHTML = `${weather.humidity}%`;
}
