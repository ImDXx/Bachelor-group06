import { WeatherData } from '@/types/data';
import { mockWeather } from '@/data/mockWeather';

export default function Weather() {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4 text-gray-800">Weather Conditions</h2>
      <div className="space-y-4">
        {mockWeather.map((weather, index) => (
          <div key={index} className="border rounded p-4">
            <div className="mt-2">
              <p className="text-sm text-gray-700">Location:</p>
              <p className="text-sm text-gray-800">
                Lat: {weather.position.latitude.toFixed(6)}
                <br />
                Long: {weather.position.longitude.toFixed(6)}
                <br />
                Time: {new Date(weather.position.timestamp).toLocaleString()}
              </p>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-700">Wind Speed</p>
                <p className="text-lg font-semibold text-gray-800">{weather.windSpeed} m/s</p>
              </div>
              <div>
                <p className="text-sm text-gray-700">Wave Height</p>
                <p className="text-lg font-semibold text-gray-800">{weather.waveHeight} m</p>
              </div>
              <div>
                <p className="text-sm text-gray-700">Beaufort Scale</p>
                <p className="text-lg font-semibold text-gray-800">{weather.beaufortScale}</p>
              </div>
              <div>
                <p className="text-sm text-gray-700">Temperature</p>
                <p className="text-lg font-semibold text-gray-800">{weather.temperature}°C</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 