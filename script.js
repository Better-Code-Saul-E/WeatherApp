
const apiKey = "ff43027e47423798a2e692d59c3ebba9";
let apiURL ;

const weatherIconDisplay = document.querySelector(".weather-icon");

const searchBox = document.querySelector("nav input");
const searchButton = document.getElementById("search-button");
const locationButton = document.getElementById("location-button");
let locationImage = document.getElementById("location-image");
const countryCode = document.getElementById("country-code");

const tempIcon = document.getElementById("temp-icon");
const temp = document.getElementById("temp");
const tempDescription = document.getElementById("temp-description");

const humidity = document.getElementById("humidity");
const windspeed = document.getElementById("windSpeed");

const errorBox = document.getElementById("error");
const weatherBox = document.getElementById("weather");
let locationOn = false;

const weatherTypes = {
    "01": "Clear",
    "02": "FewClouds",
    "03": "ScatteredClouds",
    "04": "BrokenClouds",
    "09": "Shower",
    "10": "Rain",
    "11": "Thunderstorm",
    "13": "Snow",
    "50": "Mist"
};

const weatherIconType = (iconCode) => {
    const timeOfDay = iconCode[2] === "d" ? "Day" : "Night";
    const weather = weatherTypes[iconCode.slice(0, 2)];
    return (weather === "ScatteredClouds" || weather === "BrokenClouds")
        ? weather
        : `${timeOfDay}${weather}`;
};

searchButton.addEventListener("click", () => {
    getCityData(searchBox.value);
    searchBox.value = "";
});

locationButton.addEventListener("click", () => {
    if (locationOn) {
        locationOn = false;
        locationImage.src = "images/LocationOff.svg";
    }  else if (navigator.geolocation) {
        locationOn = true;
        navigator.geolocation.getCurrentPosition(onSuccess, OnError);
    }
});

function onSuccess(position){
    const {latitude, longitude} = position.coords;
    apiURL = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric`;
    locationImage.src = "images/LocationOn.svg";
    displayWeather();
}

function OnError(position){
    console.log(position);
}

function getCityData(city) {
    apiURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric`;
    displayWeather();
}

async function displayWeather() {
    const response = await fetch(apiURL + `&appid=${apiKey}`);

    const data = await response.json();
    if (response.status == 404) {
        errorBox.style.display = "block";
        weatherBox.style.display = "none";
        return;
    } else {
        errorBox.style.display = "none";
        weatherBox.style.display = "block";

        countryCode.innerHTML = `${data.name.toUpperCase()}, ${data.sys.country}`;

        tempIcon.src = `images/${weatherIconType(data.weather[0].icon)}.svg`;
        tempDescription.innerHTML = data.weather[0].description;
        temp.innerHTML = Math.round(data.main.temp) + "&degc";

        humidity.innerHTML = data.main.humidity + "%";
        windspeed.innerHTML = data.wind.speed + " km/h";
    }
}

getCityData("chicago");