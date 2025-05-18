'use client';

/**
 * Vessels.tsx
 * 
 * A React component that displays a list of vessels with their latest entry
 * 
 * Key Features:
 * - Filters to show only latest entry for each vessel
 * - Displays information including:
 *   - Vessel name
 *   - Latitude and longitude
 *   - Timestamp of the latest entry
 *
 */
import { useState, useEffect } from 'react';
import { Vessel } from '@/types/data';
import Papa from 'papaparse';

/**
 * Vessels Component
 * Displays a list of vessels with their latest entry
 * 
 * @returns {JSX.Element} Rendered vessels dashboard
 */
export default function Vessels() {
  const [vessels, setVessels] = useState<Vessel[]>([]); // Renamed to "vessels" since all are Ulstein vessels

  /**
   * Effect: Load and process vessel data
   * - Fetches vessel data from CSV
   * - Processes to keep only latest entry for each vessel
   * - Updates state with filtered vessel data
   */
  useEffect(() => {
    const fetchVesselData = async () => {
      try {
        const response = await fetch('/data/vessels.csv'); // Ensure the file is in the public/data folder
        if (!response.ok) {
          throw new Error(`Failed to fetch vessel CSV file: ${response.statusText}`);
        }
        const csvText = await response.text();

        // Parse CSV data
        Papa.parse(csvText, {
          header: true,
          skipEmptyLines: true,
          complete: (result) => {
            const parsedVessels = result.data.map((row: any) => ({
              id: row.IMO,
              name: `Vessel ${row.IMO}`,
              latitude: parseFloat(row.LATITUDE),
              longitude: parseFloat(row.LONGITUDE),
              timestamp: new Date(row.TIMESTAMP).getTime(),
            })) as Vessel[];

            // Get the latest entry for each vessel
            const latestVessels = Object.values(
              parsedVessels.reduce((acc: Record<string, Vessel>, vessel) => {
                if (!acc[vessel.id] || vessel.timestamp > acc[vessel.id].timestamp) {
                  acc[vessel.id] = vessel;
                }
                return acc;
              }, {})
            );

            setVessels(latestVessels); // Directly set the latest vessels
          },
        });
      } catch (error) {
        console.error('Error fetching vessel data:', error);
      }
    };

    fetchVesselData();
  }, []);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4 text-gray-800">Service Vessels</h2>

      <div className="space-y-6">
        {/* Display Vessels */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Ulstein Vessels</h3>
          <div className="space-y-4">
            {vessels.map((vessel) => (
              <div key={vessel.id} className="border rounded p-4 bg-blue-50">
                <h4 className="font-semibold text-gray-800">{vessel.name}</h4>
                <div className="mt-2">
                  <p className="text-sm text-gray-700">Latest Position:</p>
                  <p className="text-sm text-gray-800">
                    Lat: {vessel.latitude.toFixed(6)}
                    <br />
                    Long: {vessel.longitude.toFixed(6)}
                    <br />
                    Time: {new Date(vessel.timestamp).toLocaleString()}
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