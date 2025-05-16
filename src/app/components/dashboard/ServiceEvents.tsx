'use client';

import { useState, useEffect } from 'react';
import { serVessel } from '@/types/data';
import Papa from 'papaparse';

export default function ServiceEvents() {
  const [serviceVessels, setServiceVessels] = useState<serVessel[]>([]);

  // Fetch and parse the vessel CSV file
  useEffect(() => {
    const fetchVesselData = async () => {
      try {
        const response = await fetch('/data/vessels.csv'); // Ensure the file is in the public/data folder
        if (!response.ok) {
          throw new Error(`Failed to fetch vessel CSV file: ${response.statusText}`);
        }
        const csvText = await response.text();

        Papa.parse(csvText, {
          header: true,
          skipEmptyLines: true,
          complete: (result) => {
            const parsedVessels = result.data.map((row: any) => ({
              id: row.IMO,
              name: `Vessel ${row.IMO}`,
              latitude: parseFloat(row.LATITUDE),
              longitude: parseFloat(row.LONGITUDE),
              speed: row.SPEED ? parseFloat(row.SPEED) : undefined,
              connectionStatus: row.CONNECTION_STATUS,
              timestamp: new Date(row.TIMESTAMP).getTime(),
              weatherConditions: {
                windSpeed: row.WINDSPEED ? parseFloat(row.WINDSPEED) : 0,
                waveHeight: row.WAVEHEIGHT ? parseFloat(row.WAVEHEIGHT) : 0,
                beaufortScale: row.BEAUFORT_SCALE ? parseInt(row.BEAUFORT_SCALE, 10) : 0,
                airTemperature: row.AIRTEMPERATURE ? parseFloat(row.AIRTEMPERATURE) : 0,
                currentSpeed: row.CURRENTSPEED ? parseFloat(row.CURRENTSPEED) : 0,
                gust: row.GUST ? parseFloat(row.GUST) : 0,
                swellHeight: row.SWELLHEIGHT ? parseFloat(row.SWELLHEIGHT) : 0,
                waterTemperature: row.WATERTEMPERATURE ? parseFloat(row.WATERTEMPERATURE) : 0,
              },
            })) as serVessel[];

            // Group vessels by ID
            const groupedVessels = parsedVessels.reduce((acc: Record<string, serVessel[]>, vessel) => {
              if (!acc[vessel.id]) {
                acc[vessel.id] = [];
              }
              acc[vessel.id].push(vessel);
              return acc;
            }, {});

            // Filter vessels that have both connected and disconnected statuses
            const servicedVessels = Object.values(groupedVessels)
              .filter((vesselGroup) =>
                vesselGroup.some((v) => v.connectionStatus === 'connected') &&
                vesselGroup.some((v) => v.connectionStatus === 'disconnected')
              )
              .map((vesselGroup) => {
                // Find the first "connected" and "disconnected" entries
                const connectedEntry = vesselGroup
                  .filter((v) => v.connectionStatus === 'connected')
                  .sort((a, b) => a.timestamp - b.timestamp)[0];

                const disconnectedEntry = vesselGroup
                  .filter((v) => v.connectionStatus === 'disconnected')
                  .sort((a, b) => a.timestamp - b.timestamp)[0];

                // Calculate service time
                let serviceTime = 'N/A';
                if (connectedEntry && disconnectedEntry) {
                  const timeDifference = Math.abs(disconnectedEntry.timestamp - connectedEntry.timestamp);
                  const hours = Math.floor(timeDifference / (1000 * 60 * 60));
                  const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
                  serviceTime = `${hours}h ${minutes}m`;
                }

                // Combine data: Use weather data from the connected entry and other details from the disconnected entry
                return {
                  ...disconnectedEntry,
                  weatherConditions: connectedEntry.weatherConditions,
                  serviceTime,
                };
              });

            setServiceVessels(servicedVessels);
          },
        });
      } catch (error) {
        console.error('Error fetching vessel data:', error);
      }
    };

    fetchVesselData();
  }, []);

  // Function to determine the color for the Beaufort scale
  const getBeaufortColor = (beaufortScale: number) => {
    if (beaufortScale >= 1 && beaufortScale <= 5) {
      // Transition from light blue (hsl(200, 100%, 70%)) to green (hsl(120, 100%, 50%))
      const hue = 200 - (beaufortScale - 1) * 20; // Decrease hue from 200 to 120
      const lightness = 70 - (beaufortScale - 1) * 4; // Decrease lightness from 70% to 50%
      return `hsl(${hue}, 100%, ${lightness}%)`;
    } else if (beaufortScale >= 6 && beaufortScale <= 12) {
      // Transition from yellow (hsl(60, 100%, 50%)) to strong red (hsl(0, 100%, 40%))
      const hue = 60 - (beaufortScale - 6) * 10; // Decrease hue from 60 to 0
      const lightness = 50 - (beaufortScale - 6) * 2; // Decrease lightness from 50% to 40%
      return `hsl(${hue}, 100%, ${lightness}%)`;
    }
    return 'gray'; // Default color for invalid or 0
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4 text-gray-800">Historic Service Events</h2>

      <div className="space-y-6">
        {serviceVessels.map((vessel) => (
          <div key={vessel.id} className="p-4 border rounded-lg shadow-sm relative">
            <h3 className="text-lg font-semibold text-gray-800">{vessel.name}</h3>
            <div className="mt-2">
              <p className="text-sm text-gray-700">Latitude: {vessel.latitude.toFixed(4)}</p>
              <p className="text-sm text-gray-700">Longitude: {vessel.longitude.toFixed(4)}</p>
              <p className="text-sm text-gray-700">Speed: {vessel.speed ? `${vessel.speed} knots` : 'N/A'}</p>
              <p className="text-sm text-gray-700">Time of service: {vessel.timestamp ? new Date(vessel.timestamp).toLocaleString() : 'N/A'}</p>
            </div>

            {/* Service Time on Top Right */}
            <div className="absolute top-4 right-4 text-right">
              <p className="text-sm text-gray-700">Service Time</p>
              <p className="text-lg font-semibold text-gray-800">{vessel.serviceTime}</p>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-700">Wind Speed</p>
                <p className="text-lg font-semibold text-gray-800">{vessel.weatherConditions.windSpeed} m/s</p>
              </div>
              <div>
                <p className="text-sm text-gray-700">Wave Height</p>
                <p className="text-lg font-semibold text-gray-800">{vessel.weatherConditions.waveHeight} m</p>
              </div>
              <div>
                <p className="text-sm text-gray-700">Beaufort Scale</p>
                <p
                  className="text-lg font-semibold"
                  style={{ color: getBeaufortColor(vessel.weatherConditions.beaufortScale) }}
                >
                  {vessel.weatherConditions.beaufortScale}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-700">Air Temperature</p>
                <p className="text-lg font-semibold text-gray-800">{vessel.weatherConditions.airTemperature}°C</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}