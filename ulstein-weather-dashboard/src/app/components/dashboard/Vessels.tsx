import { Vessel } from '@/types/data';
import { mockVessels } from '@/data/mockVessels';

export default function Vessels() {
  const ulsteinVessels = mockVessels.filter(v => v.id.startsWith('UV'));
  const competitorVessels = mockVessels.filter(v => v.id.startsWith('CV'));

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4 text-gray-800">Service Vessels</h2>
      
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Ulstein Vessels</h3>
          <div className="space-y-4">
            {ulsteinVessels.map((vessel) => (
              <div key={vessel.id} className="border rounded p-4 bg-blue-50">
                <h4 className="font-semibold text-gray-800">{vessel.name}</h4>
                <div className="mt-2">
                  <p className="text-sm text-gray-700">Latest Position:</p>
                  <p className="text-sm text-gray-800">
                    Lat: {vessel.positions[vessel.positions.length - 1].latitude.toFixed(6)}
                    <br />
                    Long: {vessel.positions[vessel.positions.length - 1].longitude.toFixed(6)}
                    <br />
                    Time: {new Date(vessel.positions[vessel.positions.length - 1].timestamp).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Competitor Vessels</h3>
          <div className="space-y-4">
            {competitorVessels.map((vessel) => (
              <div key={vessel.id} className="border rounded p-4 bg-gray-50">
                <h4 className="font-semibold text-gray-800">{vessel.name}</h4>
                <div className="mt-2">
                  <p className="text-sm text-gray-700">Latest Position:</p>
                  <p className="text-sm text-gray-800">
                    Lat: {vessel.positions[vessel.positions.length - 1].latitude.toFixed(6)}
                    <br />
                    Long: {vessel.positions[vessel.positions.length - 1].longitude.toFixed(6)}
                    <br />
                    Time: {new Date(vessel.positions[vessel.positions.length - 1].timestamp).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 