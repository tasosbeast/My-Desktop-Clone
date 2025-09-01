import React, { useState, useEffect } from "react";
import styles from "./WeatherWidget.module.css";

export default function WeatherWidget() {
  const [weather, setWeather] = useState({
    temperature: "--°",
    condition: "Loading...",
    location: "...",
    icon: "⟳",
    loading: true,
  });

  // Weather icon mapping for different conditions
  const getWeatherIcon = (weatherCode, isDay = true) => {
    const iconMap = {
      200: "⛈️", // thunderstorm with light rain
      201: "⛈️", // thunderstorm with rain
      202: "⛈️", // thunderstorm with heavy rain
      210: "🌩️", // light thunderstorm
      211: "🌩️", // thunderstorm
      212: "⛈️", // heavy thunderstorm
      221: "🌩️", // ragged thunderstorm
      230: "⛈️", // thunderstorm with light drizzle
      231: "⛈️", // thunderstorm with drizzle
      232: "⛈️", // thunderstorm with heavy drizzle
      300: "🌦️", // light intensity drizzle
      301: "🌦️", // drizzle
      302: "🌧️", // heavy intensity drizzle
      310: "🌦️", // light intensity drizzle rain
      311: "🌧️", // drizzle rain
      312: "🌧️", // heavy intensity drizzle rain
      313: "🌧️", // shower rain and drizzle
      314: "🌧️", // heavy shower rain and drizzle
      321: "🌦️", // shower drizzle
      500: "🌦️", // light rain
      501: "🌧️", // moderate rain
      502: "🌧️", // heavy intensity rain
      503: "🌧️", // very heavy rain
      504: "🌧️", // extreme rain
      511: "🌨️", // freezing rain
      520: "🌦️", // light intensity shower rain
      521: "🌧️", // shower rain
      522: "🌧️", // heavy intensity shower rain
      531: "🌧️", // ragged shower rain
      600: "🌨️", // light snow
      601: "❄️", // snow
      602: "❄️", // heavy snow
      611: "🌨️", // sleet
      612: "🌨️", // light shower sleet
      613: "🌨️", // shower sleet
      615: "🌨️", // light rain and snow
      616: "🌨️", // rain and snow
      620: "🌨️", // light shower snow
      621: "❄️", // shower snow
      622: "❄️", // heavy shower snow
      701: "🌫️", // mist
      711: "💨", // smoke
      721: "🌫️", // haze
      731: "💨", // sand/dust whirls
      741: "🌫️", // fog
      751: "💨", // sand
      761: "💨", // dust
      762: "🌋", // volcanic ash
      771: "💨", // squalls
      781: "🌪️", // tornado
      800: isDay ? "☀️" : "🌙", // clear sky
      801: isDay ? "🌤️" : "🌙", // few clouds
      802: "⛅", // scattered clouds
      803: "☁️", // broken clouds
      804: "☁️", // overcast clouds
    };
    return iconMap[weatherCode] || (isDay ? "☀️" : "🌙");
  };

  // Fetch real weather data
  useEffect(() => {
    const fetchWeather = async () => {
      try {
        setWeather((prev) => ({ ...prev, loading: true }));

        // Get user's location
        const getLocation = () => {
          return new Promise((resolve, reject) => {
            if (!navigator.geolocation) {
              reject(new Error("Geolocation not supported"));
              return;
            }

            navigator.geolocation.getCurrentPosition(
              (position) => {
                resolve({
                  lat: position.coords.latitude,
                  lon: position.coords.longitude,
                });
              },
              (error) => {
                // Fallback to Athens coordinates if geolocation fails
                console.warn(
                  "Geolocation error, using default location:",
                  error
                );
                resolve({ lat: 37.9838, lon: 23.7275 }); // Athens, Greece
              },
              { timeout: 5000, enableHighAccuracy: false }
            );
          });
        };

        const { lat, lon } = await getLocation();

        // OpenWeatherMap API (free tier)
        const API_KEY = "6590b7c7506e041c5547fab04655ecc5"; // Your API key
        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;

        // Fetch real weather data from OpenWeatherMap
        const response = await fetch(url);

        if (response.ok) {
          const data = await response.json();
          const isDay =
            new Date().getHours() >= 6 && new Date().getHours() < 20;

          setWeather({
            temperature: `${Math.round(data.main.temp)}°`,
            condition:
              data.weather[0].description.charAt(0).toUpperCase() +
              data.weather[0].description.slice(1),
            location: data.name,
            icon: getWeatherIcon(data.weather[0].id, isDay),
            loading: false,
          });
        } else {
          throw new Error("Weather data not available");
        }
      } catch (error) {
        console.error("Error fetching weather:", error);
        setWeather({
          temperature: "--°",
          condition: "Unavailable",
          location: "Unknown",
          icon: "❌",
          loading: false,
        });
      }
    };

    fetchWeather();

    // Update weather every 10 minutes
    const interval = setInterval(fetchWeather, 10 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const handleClick = () => {
    // Could open a detailed weather panel
    console.log("Weather widget clicked");
  };

  if (weather.loading) {
    return (
      <div className={styles.weatherWidget}>
        <div className={styles.loadingSpinner}>⟳</div>
      </div>
    );
  }

  return (
    <div
      className={styles.weatherWidget}
      onClick={handleClick}
      title={`Weather in ${weather.location}`}
    >
      <div className={styles.weatherIcon}>{weather.icon}</div>
      <div className={styles.weatherInfo}>
        <div className={styles.temperature}>{weather.temperature}</div>
        <div className={styles.condition}>{weather.condition}</div>
      </div>
    </div>
  );
}
