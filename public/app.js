const loading = document.getElementById("loading");
const app = document.getElementById("app");
const alertMain = document.getElementById("alert");

const condition = document.getElementById("condition");
const city = document.getElementById("city");
const country = document.getElementById("country");
const mainText = document.getElementById("main");
const description = document.getElementById("description");
const temp = document.getElementById("temp");
const pressure = document.getElementById("pressure");
const humidity = document.getElementById("humidity");
const countryIcon = document.getElementById("country-icon");

const cityInput = document.getElementById("city-input");
const historyElm = document.getElementById("historyElm");
const masterHistory = document.getElementById("master-history");

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

 axios
  .get("/api/history")
  .then(({ data }) => {
   if (data.length > 0) {
    updateHistory(data);
   } else {
    historyElm.innerHTML = "<p class='text-muted'>No History Found!</p>";
   }
  })
  .catch((e) => {
   alertMain.style.display = "block";
   loading.style.display = "none";
   alertMain.getElementsByTagName("p")[0].innerHTML = e.message;
   console.error(e);
  });

 cityInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
   if (e.target.value !== "") {
    getWeatherData(e.target.value, null, (weather) => {
     e.target.value = "";
     axios
      .post("/api/history", weather)
      .then(({ data }) => {
       updateHistory(data);
      })
      .catch((e) => {
       alertMain.style.display = "block";
       loading.style.display = "none";
       alertMain.getElementsByTagName("p")[0].innerHTML = e.message;
       console.error(e);
      });
    });
    e.target.value = "";
   }
  }
 });
};

function getWeatherData(city = DEFAULT_CITY, coords, cb) {
 let url = BASE_URL;

 city === null
  ? (url = `${url}&lat=${coords.latitude}&lon=${coords.longitude}`)
  : (url = `${url}&q=${city}`);

 axios
  .get(url)
  .then(({ data }) => {
   let weather = {
    icon: data.weather[0].icon,
    name: data.weather[0].main,
    city: data.name,
    country: data.sys.country,
    countryIcon: "",
    description: data.weather[0].description,
    temp: data.main.temp,
    pressure: data.main.pressure,
    humidity: data.main.humidity,
   };
   loading.style.display = "none";
   alertMain.style.display = "none";
   app.style.display = "block";
   getCityProfile(weather, cb);
  })
  .catch((e) => {
   alertMain.style.display = "block";
   loading.style.display = "none";
   alertMain.getElementsByTagName("p")[0].innerHTML =
    "<code>'" +
    city +
    "'</code> City Not Found! Check your spelling and try again. <br/>" +
    e.message;
   console.error(e);
  });
}

function getCityProfile(weather, cb) {
 axios
  .get(`https://restcountries.com/v3.1/alpha/${weather.country}`)
  .then(({ data }) => {
   weather.country = data[0].name.common;
   weather.countryIcon = data[0].flags.png;
   setWeather(weather);
   if (cb) cb(weather);
  });
}

function setWeather(weather) {
 condition.src = `${ICON_URL}${weather.icon}@2x.png`;
 condition.alt = weather.name;
 city.innerHTML = weather.city;
 country.innerHTML = weather.country;
 countryIcon.src = weather.countryIcon;
 countryIcon.style.display = "";
 countryIcon.alt = weather.country;
 mainText.innerHTML = weather.name;
 description.innerHTML = weather.description;
 temp.innerHTML = `${Math.round(100 * (weather.temp - 273.15)) / 100}°C`;
 pressure.innerHTML = `${weather.pressure} <small>hPA</small>`;
 humidity.innerHTML = `${weather.humidity}%`;
}

function updateHistory(history) {
 historyElm.innerHTML = "";
 history = history.reverse();
 history.forEach((h) => {
  let elm = masterHistory.cloneNode(true);
  elm.style.display = "flex";
  elm.getElementsByClassName(
   "condition"
  )[0].src = `${ICON_URL}${h.icon}@2x.png`;
  elm.getElementsByClassName("condition")[0].alt = h.name;
  elm.getElementsByClassName("city")[0].innerHTML = h.city;
  elm.getElementsByClassName("country")[0].innerHTML = h.country;
  elm.getElementsByClassName("country-icon")[0].src = h.countryIcon;
  elm.getElementsByClassName("country-icon")[0].style.display = "";
  elm.getElementsByClassName("main")[0].innerHTML = h.name;
  elm.getElementsByClassName("description")[0].innerHTML = h.description;
  elm.getElementsByClassName("temp")[0].innerHTML = `${
   Math.round(100 * (h.temp - 273.15)) / 100
  }°C`;
  elm.getElementsByClassName(
   "pressure"
  )[0].innerHTML = `${h.pressure} <small>hPA</small>`;
  elm.getElementsByClassName("humidity")[0].innerHTML = `${h.humidity}%`;
  historyElm.appendChild(elm);
 });
}
