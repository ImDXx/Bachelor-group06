import { ServiceEvent } from '@/types/data';
import { mockServiceEvents } from '../../../../public/data/mockServiceEvents';

export default function ServiceEvents() {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4 text-gray-800">Service Events</h2>
      <div className="space-y-4">
        {mockServiceEvents.map((event) => (
          <div key={`${event.vesselId}-${event.turbineId}`} className="border rounded p-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-gray-800">Service Event</h3>
                <p className="text-sm text-gray-700">
                  Vessel: {event.vesselId}
                  <br />
                  Turbine: {event.turbineId}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-700">Duration</p>
                <p className="text-lg font-semibold text-gray-800">{event.duration} min</p>
              </div>
            </div>
            <div className="mt-4">
              <p className="text-sm text-gray-700">Time Period:</p>
              <p className="text-sm text-gray-800">
                Start: {new Date(event.startTime).toLocaleString()}
                <br />
                End: {new Date(event.endTime).toLocaleString()}
              </p>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-700">Wind Speed</p>
                <p className="text-lg font-semibold text-gray-800">{event.weatherConditions.windSpeed} m/s</p>
              </div>
              <div>
                <p className="text-sm text-gray-700">Wave Height</p>
                <p className="text-lg font-semibold text-gray-800">{event.weatherConditions.waveHeight} m</p>
              </div>
              <div>
                <p className="text-sm text-gray-700">Beaufort Scale</p>
                <p className="text-lg font-semibold text-gray-800">{event.weatherConditions.beaufortScale}</p>
              </div>
              <div>
                <p className="text-sm text-gray-700">Temperature</p>
                <p className="text-lg font-semibold text-gray-800">{event.weatherConditions.temperature}°C</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 