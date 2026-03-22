const apiKey = "";
const weatherInfo = document.querySelector(".weather-info");
const errorMessage = document.getElementById("error-message");

// Initialize map directly
const map = L.map("map").setView([20, 77], 5);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: '© OpenStreetMap'
}).addTo(map);

async function getWeather() {
    const city = document.getElementById("city-input").value.trim();

    if (!city) {
        errorMessage.innerText = "Please enter a city name!";
        return;
    }

    errorMessage.innerText = "⏳ Loading...";

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.cod === 401) {
            errorMessage.innerText = "❌ Invalid API Key!";
            return;
        }
        if (data.cod === "404") {
            errorMessage.innerText = "❌ City not found!";
            return;
        }

        displayWeather(data);

    } catch (error) {
        errorMessage.innerText = "❌ Error: " + error.message;
        weatherInfo.style.display = "none";
    }
}

function displayWeather(data) {
    document.getElementById("city-name").innerText = data.name;
    document.getElementById("temperature").innerText = `🌡 Temperature: ${data.main.temp}°C`;
    document.getElementById("humidity").innerText = `💧 Humidity: ${data.main.humidity}%`;
    document.getElementById("description").innerText = `🌤 Condition: ${data.weather[0].description}`;
    document.getElementById("weather-icon").src =
        `https://openweathermap.org/img/wn/${data.weather[0].icon}.png`;

    weatherInfo.style.display = "block";
    errorMessage.innerText = "";

    map.setView([data.coord.lat, data.coord.lon], 10);

    map.eachLayer((layer) => {
        if (layer instanceof L.Marker) {
            map.removeLayer(layer);
        }
    });

    L.marker([data.coord.lat, data.coord.lon])
        .addTo(map)
        .bindPopup(`<b>${data.name}</b><br>🌡 ${data.main.temp}°C<br>💧 ${data.main.humidity}%`)
        .openPopup();
}