'use client';

import { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-markercluster'; // Import clustering library
import 'leaflet/dist/leaflet.css';
import Papa from 'papaparse';

interface MarkerInfo {
  id: string;
  name?: string;
  latitude: number;
  longitude: number;
  type: 'ulstein' | 'competitor' | 'turbine';
  speed?: number;
  connectionStatus?: string;
  airTemperature?: number;
  currentSpeed?: number;
  gust?: number;
  swellHeight?: number;
  waterTemperature?: number;
  waveHeight?: number;
  windSpeed?: number;
}

export default function ServiceMap() {
  const [csvTurbines, setCsvTurbines] = useState<MarkerInfo[]>([]); // Store turbines from CSV
  const [vessels, setVessels] = useState<MarkerInfo[]>([]); // Store vessels from CSV
  const [selectedMarker, setSelectedMarker] = useState<MarkerInfo | null>(null); // Store the selected marker
  const markerRefs = useRef<Map<string, any>>(new Map()); // Store refs for all markers

  // Fetch and parse the turbine CSV file
  useEffect(() => {
    const fetchTurbineData = async () => {
      try {
        const response = await fetch('/data/turbine_position.csv'); // Ensure the file is in the public/data folder
        if (!response.ok) {
          throw new Error(`Failed to fetch turbine CSV file: ${response.statusText}`);
        }
        const csvText = await response.text();

        Papa.parse(csvText, {
          header: true,
          skipEmptyLines: true,
          complete: (result) => {
            const parsedTurbines = result.data.map((row: any) => ({
              id: row.id,
              latitude: parseFloat(row.lat),
              longitude: parseFloat(row.lon),
              type: 'turbine' as const,
            })) as MarkerInfo[];
            setCsvTurbines(parsedTurbines);
          },
        });
      } catch (error) {
        console.error('Error fetching turbine data:', error);
      }
    };

    fetchTurbineData();
  }, []);

  // Fetch and parse the vessel CSV file
  useEffect(() => {
    const fetchVesselData = async () => {
      try {
        const response = await fetch('/data/ulstein_vessels.csv'); // Ensure the file is in the public/data folder
        if (!response.ok) {
          throw new Error(`Failed to fetch vessel CSV file: ${response.statusText}`);
        }
        const csvText = await response.text();

        Papa.parse(csvText, {
          header: true,
          skipEmptyLines: true,
          complete: (result) => {
            const parsedVessels = result.data.map((row: any) => ({
              id: `${row.IMO}-${row.TIMESTAMP}`, // Combine IMO and TIMESTAMP to create a unique ID
              name: `Vessel ${row.IMO}`,
              latitude: parseFloat(row.LATITUDE),
              longitude: parseFloat(row.LONGITUDE),
              speed: row.SPEED ? parseFloat(row.SPEED) : undefined,
              connectionStatus: row.CONNECTION_STATUS,
              airTemperature: row.AIRTEMPERATURE ? parseFloat(row.AIRTEMPERATURE) : undefined,
              currentSpeed: row.CURRENTSPEED ? parseFloat(row.CURRENTSPEED) : undefined,
              gust: row.GUST ? parseFloat(row.GUST) : undefined,
              swellHeight: row.SWELLHEIGHT ? parseFloat(row.SWELLHEIGHT) : undefined,
              waterTemperature: row.WATERTEMPERATURE ? parseFloat(row.WATERTEMPERATURE) : undefined,
              waveHeight: row.WAVEHEIGHT ? parseFloat(row.WAVEHEIGHT) : undefined,
              windSpeed: row.WINDSPEED ? parseFloat(row.WINDSPEED) : undefined,
              type: 'ulstein' as const,
            }));
            setVessels(parsedVessels);
          },
        });
      } catch (error) {
        console.error('Error fetching vessel data:', error);
      }
    };

    fetchVesselData();
  }, []);

  const handleMarkerClick = (vessel: MarkerInfo) => {
    setSelectedMarker(vessel); // Set the selected vessel
  };

  const handleListClick = (vessel: MarkerInfo) => {
    setSelectedMarker(vessel); // Highlight the marker
    const markerRef = markerRefs.current.get(vessel.id);
    if (markerRef) {
      markerRef.openPopup(); // Programmatically open the popup
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex gap-6">
        {/* Map Section */}
        <div className="h-[500px] flex-1">
          <MapContainer
            center={[54.5, 2.3]} // Default center
            zoom={7} // Default map zoom upon opening
            style={{ height: '100%', width: '100%' }}
            scrollWheelZoom={true}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {/* Render Turbines with Clustering */}
            <MarkerClusterGroup
              chunkedLoading // Enable chunked loading for better performance.. hopefully
              maxClusterRadius={50}
              disableClusteringAtZoom={10} // Disable clustering at zoom 10, default is 7
            >
              {csvTurbines.map((turbine) => (
                <CircleMarker
                  key={turbine.id}
                  center={[turbine.latitude, turbine.longitude]}
                  radius={6}
                  fillColor="#FFD700"
                  color="#000"
                  weight={1}
                  opacity={1}
                  fillOpacity={0.8}
                  eventHandlers={{
                    click: () => setSelectedMarker(turbine), // Highlight turbine on click
                  }}
                >
                  <Popup>
                    <div>
                      <p><strong>Turbine ID:</strong> {turbine.id}</p>
                      <p><strong>Latitude:</strong> {turbine.latitude.toFixed(4)}</p>
                      <p><strong>Longitude:</strong> {turbine.longitude.toFixed(4)}</p>
                    </div>
                  </Popup>
                </CircleMarker>
              ))}
            </MarkerClusterGroup>

            {/* Render Vessels */}
            {vessels.map((vessel) => (
              <CircleMarker
                key={vessel.id}
                center={[vessel.latitude, vessel.longitude]}
                radius={selectedMarker?.id === vessel.id ? 10 : 6} // Highlight selected marker
                fillColor={selectedMarker?.id === vessel.id ? '#FF0000' : '#3B82F6'} // Change color for selected marker
                color="#000"
                weight={1}
                opacity={1}
                fillOpacity={0.8}
                eventHandlers={{
                  click: () => handleMarkerClick(vessel),
                }}
                ref={(ref) => {
                  if (ref) {
                    markerRefs.current.set(vessel.id, ref); // Store the marker ref
                  }
                }}
              >
                <Popup>
                  <div>
                    <p><strong>Vessel ID:</strong> {vessel.id}</p>
                    <p><strong>Name:</strong> {vessel.name}</p>
                    <p><strong>Latitude:</strong> {vessel.latitude.toFixed(4)}</p>
                    <p><strong>Longitude:</strong> {vessel.longitude.toFixed(4)}</p>
                    <p><strong>Speed:</strong> {vessel.speed ? `${vessel.speed} knots` : 'N/A'}</p>
                    <p><strong>Connection Status:</strong> {vessel.connectionStatus || 'N/A'}</p>

                    {/* Display weather data if connectionStatus is "approaching" or "connected" */}
                    {(vessel.connectionStatus === 'approaching' || vessel.connectionStatus === 'connected') && (
                      <div className="mt-2">
                        <h4 className="font-semibold">Weather Information</h4>
                        <p><strong>Air Temperature:</strong> {vessel.airTemperature ? `${vessel.airTemperature} °C` : 'N/A'}</p>
                        <p><strong>Current Speed:</strong> {vessel.currentSpeed ? `${vessel.currentSpeed} m/s` : 'N/A'}</p>
                        <p><strong>Gust:</strong> {vessel.gust ? `${vessel.gust} m/s` : 'N/A'}</p>
                        <p><strong>Swell Height:</strong> {vessel.swellHeight ? `${vessel.swellHeight} m` : 'N/A'}</p>
                        <p><strong>Water Temperature:</strong> {vessel.waterTemperature ? `${vessel.waterTemperature} °C` : 'N/A'}</p>
                        <p><strong>Wave Height:</strong> {vessel.waveHeight ? `${vessel.waveHeight} m` : 'N/A'}</p>
                        <p><strong>Wind Speed:</strong> {vessel.windSpeed ? `${vessel.windSpeed} m/s` : 'N/A'}</p>
                      </div>
                    )}
                  </div>
                </Popup>
              </CircleMarker>
            ))}
          </MapContainer>
        </div>

        {/* Vessel List */}
        <div className="w-64 flex flex-col gap-6">
          <div>
            <h3 className="font-semibold mb-2 text-gray-800">Vessels</h3>
            <div className="space-y-2 overflow-y-auto max-h-[500px]">
              {vessels.map((vessel) => (
                <div
                  key={vessel.id}
                  className={`p-2 rounded cursor-pointer transition-colors ${selectedMarker?.id === vessel.id
                    ? 'bg-gray-100 border-2 border-gray-300'
                    : 'hover:bg-gray-50 border border-gray-200'
                    }`}
                  onClick={() => handleListClick(vessel)} // Highlight marker and open popup
                >
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-3 h-3 rounded-full ${vessel.type === 'ulstein' ? 'bg-blue-500' : 'bg-orange-500'
                        }`}
                    />
                    <span className="text-sm font-medium text-gray-700">{vessel.name}</span>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {vessel.latitude.toFixed(4)}, {vessel.longitude.toFixed(4)}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {vessel.connectionStatus || 'No Connection Status'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-4 flex items-center justify-center space-x-6">
        <div className="flex items-center">
          <div className="w-4 h-4 bg-blue-500 rounded-full mr-2" />
          <span className="text-sm text-gray-700">Ulstein Vessels</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-orange-500 rounded-full mr-2" />
          <span className="text-sm text-gray-700">Competitor Vessels</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-yellow-400 rounded-full mr-2" />
          <span className="text-sm text-gray-700">Wind Turbines</span>
        </div>
      </div>
    </div>
  );
}