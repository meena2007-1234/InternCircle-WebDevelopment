const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");
const weatherResult = document.getElementById("weatherResult");
const errorMessage = document.getElementById("errorMessage");


// Weather condition based on WMO weather code
function getWeatherInfo(code) {

    if (code === 0) {
        return {
            icon: "☀️",
            text: "Clear Sky"
        };
    }

    if (code === 1 || code === 2 || code === 3) {
        return {
            icon: "🌤️",
            text: "Partly Cloudy"
        };
    }

    if (code === 45 || code === 48) {
        return {
            icon: "🌫️",
            text: "Foggy"
        };
    }

    if (code >= 51 && code <= 67) {
        return {
            icon: "🌧️",
            text: "Rainy"
        };
    }

    if (code >= 71 && code <= 77) {
        return {
            icon: "❄️",
            text: "Snowy"
        };
    }

    if (code >= 80 && code <= 82) {
        return {
            icon: "🌦️",
            text: "Rain Showers"
        };
    }

    if (code >= 95) {
        return {
            icon: "⛈️",
            text: "Thunderstorm"
        };
    }

    return {
        icon: "🌤️",
        text: "Unknown"
    };
}


// Format date
function formatDate(dateString) {

    const date = new Date(dateString);

    return date.toLocaleDateString("en-IN", {
        weekday: "short",
        day: "numeric",
        month: "short"
    });
}


// Search weather
async function searchWeather() {

    const city = cityInput.value.trim();

    errorMessage.textContent = "";
    weatherResult.innerHTML = "";

    // Input validation
    if (city === "") {
        errorMessage.textContent = "Please enter a city name.";
        return;
    }

    weatherResult.innerHTML = `
        <p class="loading">Loading weather data...</p>
    `;

    try {

        // Step 1: Find city coordinates
        const geoResponse = await fetch(
            `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`
        );

        if (!geoResponse.ok) {
            throw new Error("Unable to find city.");
        }

        const geoData = await geoResponse.json();

        // City not found
        if (!geoData.results || geoData.results.length === 0) {
            throw new Error("City not found. Please enter a valid city name.");
        }

        const location = geoData.results[0];

        const latitude = location.latitude;
        const longitude = location.longitude;

        // Step 2: Get weather data
        const weatherResponse = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto&forecast_days=5`
        );

        if (!weatherResponse.ok) {
            throw new Error("Unable to fetch weather data.");
        }

        const weatherData = await weatherResponse.json();

        // Step 3: Display data
        displayWeather(location, weatherData);

    } catch (error) {

        weatherResult.innerHTML = "";

        errorMessage.textContent = error.message;
    }
}


// Display weather on webpage
function displayWeather(location, weatherData) {

    const current = weatherData.current;
    const daily = weatherData.daily;

    const currentInfo = getWeatherInfo(current.weather_code);

    let forecastHTML = "";

    for (let i = 0; i < daily.time.length; i++) {

        const info = getWeatherInfo(daily.weather_code[i]);

        forecastHTML += `
            <div class="forecast-card">

                <div class="forecast-date">
                    ${formatDate(daily.time[i])}
                </div>

                <div class="forecast-icon">
                    ${info.icon}
                </div>

                <div class="forecast-temp">
                    ${Math.round(daily.temperature_2m_max[i])}°C /
                    ${Math.round(daily.temperature_2m_min[i])}°C
                </div>

                <div class="forecast-condition">
                    ${info.text}
                </div>

            </div>
        `;
    }


    weatherResult.innerHTML = `

        <div class="current-weather">

            <div class="city-name">
                ${location.name}, ${location.country}
            </div>

            <div class="current-icon">
                ${currentInfo.icon}
            </div>

            <div class="temperature">
                ${Math.round(current.temperature_2m)}°C
            </div>

            <div class="condition">
                ${currentInfo.text}
            </div>

            <div class="details">

                <div class="detail-box">
                    💧 Humidity:
                    ${current.relative_humidity_2m}%
                </div>

                <div class="detail-box">
                    💨 Wind:
                    ${Math.round(current.wind_speed_10m)} km/h
                </div>

            </div>

        </div>

        <h2 class="forecast-title">
            5-Day Forecast
        </h2>

        <div class="forecast-container">
            ${forecastHTML}
        </div>
    `;
}


// Search button click
searchBtn.addEventListener("click", searchWeather);


// Press Enter to search
cityInput.addEventListener("keydown", function(event) {

    if (event.key === "Enter") {
        searchWeather();
    }

});