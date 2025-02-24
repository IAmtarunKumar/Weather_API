import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Dashboard.css";
import { WiDaySunny, WiHumidity, WiStrongWind, WiSunrise, WiSunset, WiCloudy, WiRain, WiDayThunderstorm } from "react-icons/wi";
import { FaSearchLocation, FaMapMarkerAlt, FaRegClock, FaTint, FaWind, FaCloud, FaEye, FaTemperatureHigh, FaTemperatureLow, FaSun, FaMoon } from "react-icons/fa";
import { TbTemperatureCelsius, TbGauge } from "react-icons/tb";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Dashboard = () => {
  const [city, setCity] = useState("");
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    // Update time every second
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    // Fetch weather for current location by default
    fetchCurrentLocationWeather();

    return () => clearInterval(timer);
  }, []);

  // Fetch weather for the user's current location
  const fetchCurrentLocationWeather = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          fetchWeatherByCoords(latitude, longitude);
        },
        (error) => {
          toast.error("Unable to fetch your location. Please enable location access.");
          console.error("Geolocation error:", error);
        }
      );
    } else {
      toast.error("Geolocation is not supported by your browser.");
    }
  };

  // Fetch weather by coordinates
  const fetchWeatherByCoords = async (lat, lon) => {
    setLoading(true);
    try {
      const apiKey = "983e8e575f721eee71b10d919655ecdb";
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
      );
      setWeatherData(response.data);
      toast.success(`Weather data fetched for ${response.data.name}`);
    } catch (error) {
      toast.error("Failed to fetch weather data. Please try again.");
      console.error("Error fetching weather data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch weather by city name
  const fetchWeather = async () => {
    if (!city) {
      toast.warning("Please enter a city name!");
      return;
    }
    setLoading(true);
    try {
      const apiKey = "983e8e575f721eee71b10d919655ecdb";
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
      );
      setWeatherData(response.data);
      toast.success(`Weather data fetched for ${response.data.name}`);
    } catch (error) {
      toast.error("City not found! Please try again.");
      console.error("Error fetching weather data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Get weather icon based on weather condition code
  const getWeatherIcon = (weatherCode) => {
    if (weatherCode >= 200 && weatherCode < 300) return <WiDayThunderstorm />;
    if (weatherCode >= 300 && weatherCode < 600) return <WiRain />;
    if (weatherCode >= 600 && weatherCode < 700) return <WiCloudy />;
    return <WiDaySunny />;
  };

  // Format time from timestamp
  const formatTime = (timestamp) => {
    return new Date(timestamp * 1000).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Toggle dark/light mode
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <div className={`dashboard ${isDarkMode ? "dark-mode" : "light-mode"}`}>
      <nav className="navbar">
        <div className="nav-content">
          <div className="nav-left">
            <h1 className="nav-title">Weather Dashboard</h1>
          </div>
          <div className="nav-right">
            <button onClick={toggleDarkMode} className="mode-toggle">
              {isDarkMode ? <FaSun /> : <FaMoon />}
            </button>
          </div>
        </div>
      </nav>

      <div className="search-container">
        <input
          type="text"
          placeholder="Search for a city..."
          value={city}
          onChange={(e) => setCity(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && fetchWeather()}
          className="search-input"
        />
        <button onClick={fetchWeather} className="search-btn" disabled={loading}>
          {loading ? (
            <div className="loader"></div>
          ) : (
            <FaSearchLocation />
          )}
        </button>
      </div>

      {weatherData && (
        <div className="weather-content">
          <div className="main-weather-card">
            <div className="location-info">
              <div className="location-header">
                <FaMapMarkerAlt className="location-icon" />
                <h2>{weatherData.name}, {weatherData.sys.country}</h2>
              </div>
              <p className="date">{currentTime.toLocaleDateString([], {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}</p>
              <p className="time">{currentTime.toLocaleTimeString()}</p>
            </div>

            <div className="weather-info">
              <div className="temperature-container">
                <h1>{Math.round(weatherData.main.temp)}°C</h1>
                <p className="feels-like">Feels like: {Math.round(weatherData.main.feels_like)}°C</p>
              </div>
              <div className="weather-icon-container">
                {getWeatherIcon(weatherData.weather[0].id)}
                <p className="weather-description">{weatherData.weather[0].description}</p>
              </div>
            </div>
          </div>

          <div className="weather-details-grid">
            <div className="detail-card">
              <FaTemperatureHigh className="detail-icon" />
              <div className="detail-info">
                <h3>Max Temp</h3>
                <p>{Math.round(weatherData.main.temp_max)}°C</p>
              </div>
            </div>

            <div className="detail-card">
              <FaTemperatureLow className="detail-icon" />
              <div className="detail-info">
                <h3>Min Temp</h3>
                <p>{Math.round(weatherData.main.temp_min)}°C</p>
              </div>
            </div>

            <div className="detail-card">
              <FaTint className="detail-icon" />
              <div className="detail-info">
                <h3>Humidity</h3>
                <p>{weatherData.main.humidity}%</p>
              </div>
            </div>

            <div className="detail-card">
              <FaWind className="detail-icon" />
              <div className="detail-info">
                <h3>Wind Speed</h3>
                <p>{weatherData.wind.speed} m/s</p>
              </div>
            </div>

            <div className="detail-card">
              <TbGauge className="detail-icon" />
              <div className="detail-info">
                <h3>Pressure</h3>
                <p>{weatherData.main.pressure} hPa</p>
              </div>
            </div>

            <div className="detail-card">
              <FaEye className="detail-icon" />
              <div className="detail-info">
                <h3>Visibility</h3>
                <p>{weatherData.visibility / 1000} km</p>
              </div>
            </div>

            <div className="detail-card">
              <FaCloud className="detail-icon" />
              <div className="detail-info">
                <h3>Cloudiness</h3>
                <p>{weatherData.clouds.all}%</p>
              </div>
            </div>

            <div className="detail-card">
              <WiSunrise className="detail-icon" />
              <div className="detail-info">
                <h3>Sunrise</h3>
                <p>{formatTime(weatherData.sys.sunrise)}</p>
              </div>
            </div>

            <div className="detail-card">
              <WiSunset className="detail-icon" />
              <div className="detail-info">
                <h3>Sunset</h3>
                <p>{formatTime(weatherData.sys.sunset)}</p>
              </div>
            </div>
          </div>
        </div>
      )}
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default Dashboard;