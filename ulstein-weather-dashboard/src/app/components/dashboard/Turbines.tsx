import { WindTurbine } from '@/types/data';
import { mockTurbines } from '@/data/mockTurbines';

export default function Turbines() {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4 text-gray-800">Wind Turbines</h2>
      <div className="space-y-4">
        {mockTurbines.map((turbine) => (
          <div key={turbine.id} className="border rounded p-4">
            <h3 className="font-semibold text-gray-800">{turbine.name}</h3>
            <div className="mt-2">
              <p className="text-sm text-gray-700">Position:</p>
              <p className="text-sm text-gray-800">
                Lat: {turbine.position.latitude.toFixed(6)}
                <br />
                Long: {turbine.position.longitude.toFixed(6)}
                <br />
                Last Updated: {new Date(turbine.position.timestamp).toLocaleString()}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 