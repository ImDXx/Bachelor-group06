"use client";

import { useEffect, useState } from "react";
import { WeatherData } from "@/types/data";

export default function Weather() {
  const [weatherData, setWeatherData] = useState<WeatherData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const response = await fetch("/api/get-weather");
        if (response.ok) {
          const data: WeatherData[] = await response.json();
          setWeatherData(data);
        } else {
          setError(`Failed to fetch weather data: ${response.status}`);
        }
      } catch (error) {
        setError("Error fetching weather data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, []);

  if (loading) {
    return <div>Loading weather data...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4 text-gray-800">Weather Conditions</h2>
      <div className="space-y-4">
        {weatherData.map((weather, index) => (
          <div key={index} className="border rounded p-4">
            <div className="mt-2">
              <p className="text-sm text-gray-700">Location: Unknown</p> {/* Placeholder for location*/}
              <p className="text-sm text-gray-800">
                Lat: {weather.LAT.toFixed(2)}
                <br />
                Lon: {weather.LON.toFixed(2)}
                <br />
                Time: {new Date(weather.TIMESTAMP_UTC).toLocaleString()}
              </p>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-700">Air Temperature</p>
                <p className="text-lg font-semibold text-gray-800">{weather.AIR_TEMPERATURE}°C</p>
              </div>
              <div>
                <p className="text-sm text-gray-700">Wind Speed</p>
                <p className="text-lg font-semibold text-gray-800">{weather.WIND_SPEED} m/s</p>
              </div>
              <div>
                <p className="text-sm text-gray-700">Wind Direction</p>
                <p className="text-lg font-semibold text-gray-800">{weather.WIND_DIRECTION}°</p>
              </div>
              <div>
                <p className="text-sm text-gray-700">Wave Height</p>
                <p className="text-lg font-semibold text-gray-800">{weather.WAVE_HEIGHT} m</p>
              </div>
              <div>
                <p className="text-sm text-gray-700">Wave Direction</p>
                <p className="text-lg font-semibold text-gray-800">{weather.WAVE_DIRECTION}°</p>
              </div>
              <div>
                <p className="text-sm text-gray-700">Current Speed</p>
                <p className="text-lg font-semibold text-gray-800">{weather.CURRENT_SPEED} m/s</p>
              </div>
              <div>
                <p className="text-sm text-gray-700">Cloud Cover</p>
                <p className="text-lg font-semibold text-gray-800">{weather.CLOUD_COVER}%</p>
              </div>
              <div>
                <p className="text-sm text-gray-700">Humidity</p>
                <p className="text-lg font-semibold text-gray-800">{weather.HUMIDITY}%</p>
              </div>
              <div>
                <p className="text-sm text-gray-700">Pressure</p>
                <p className="text-lg font-semibold text-gray-800">{weather.PRESSURE} hPa</p>
              </div>
              <div>
                <p className="text-sm text-gray-700">Visibility</p>
                <p className="text-lg font-semibold text-gray-800">{(weather.VISIBILITY / 1000).toFixed(1)} km</p>
              </div>
              <div>
                <p className="text-sm text-gray-700">Source</p>
                <p className="text-lg font-semibold text-gray-800">{weather.SOURCE}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}