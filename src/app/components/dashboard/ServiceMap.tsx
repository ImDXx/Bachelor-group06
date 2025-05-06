'use client';

import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, Circle } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { mockVessels } from '../../../../public/data/mockVessels';
import { mockTurbines } from '../../../../public/data/mockTurbines';
import Papa from 'papaparse';

interface MarkerInfo {
  id: string;
  name?: string;
  latitude: number;
  longitude: number;
  atService?: boolean;
  type: 'ulstein' | 'competitor' | 'turbine';
}

export default function ServiceMap() {
  const [selectedMarker, setSelectedMarker] = useState<string | null>(null);
  const [csvTurbines, setCsvTurbines] = useState<MarkerInfo[]>([]);

  // Fetch and parse the CSV file
  useEffect(() => {
    const fetchTurbineData = async () => {
      try {
        const response = await fetch('/data/turbine_position.csv'); // Ensure the file is in the public/data folder
        if (!response.ok) {
          throw new Error(`Failed to fetch CSV file: ${response.statusText}`);
        }
        const csvText = await response.text();

        Papa.parse(csvText, {
          header: true,
          skipEmptyLines: true,
          complete: (result) => {
            const turbines = result.data.map((row: any) => ({
              id: row.id,
              latitude: parseFloat(row.lat),
              longitude: parseFloat(row.lon),
              type: 'turbine' as 'turbine',
            })) as MarkerInfo[];
            setCsvTurbines(turbines);
          },
        });
      } catch (error) {
        console.error('Error fetching turbine data:', error);
      }
    };

    fetchTurbineData();
  }, []);

  const markers: MarkerInfo[] = [
    ...mockVessels.map((vessel) => ({
      id: vessel.id,
      name: vessel.name,
      latitude: vessel.positions[vessel.positions.length - 1].latitude,
      longitude: vessel.positions[vessel.positions.length - 1].longitude,
      atService: vessel.atService,
      type: vessel.id.startsWith('UV') ? 'ulstein' as 'ulstein' : 'competitor' as 'competitor',
    })),
    ...mockTurbines.map((turbine) => ({
      id: turbine.id,
      name: turbine.name,
      latitude: turbine.position.latitude,
      longitude: turbine.position.longitude,
      type: 'turbine' as 'turbine',
    })),
    ...csvTurbines, // Add turbines from the CSV file
  ];

  const handleMarkerClick = (markerId: string) => {
    setSelectedMarker(markerId === selectedMarker ? null : markerId);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex gap-6">
        <div className="h-[500px] flex-1">
          <MapContainer
            center={[54.5, 2.3]} // Default center
            zoom={7}
            style={{ height: '100%', width: '100%' }}
            scrollWheelZoom={true}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {markers.map((marker) => {
              if (marker.type === 'turbine') {
                return (
                  <div key={marker.id}>
                    <Circle
                      center={[marker.latitude, marker.longitude]}
                      radius={50}
                      pathOptions={{
                        color: '#FFD700',
                        fillColor: '#FFD700',
                        fillOpacity: 0.1,
                        weight: 1,
                        dashArray: '5, 5',
                      }}
                    />
                    <CircleMarker
                      center={[marker.latitude, marker.longitude]}
                      radius={6}
                      fillColor={selectedMarker === marker.id ? '#FFA500' : '#FFD700'}
                      color="#000"
                      weight={selectedMarker === marker.id ? 3 : 1}
                      opacity={1}
                      fillOpacity={0.8}
                      eventHandlers={{
                        click: () => handleMarkerClick(marker.id),
                      }}
                    >
                      <Popup>
                        <div className="p-2">
                          <h3 className="font-semibold">Turbine ID: {marker.id}</h3>
                          <p className="text-sm">
                            Position: {marker.latitude.toFixed(4)}, {marker.longitude.toFixed(4)}
                          </p>
                        </div>
                      </Popup>
                    </CircleMarker>
                  </div>
                );
              }
              return (
                <CircleMarker
                  key={marker.id}
                  center={[marker.latitude, marker.longitude]}
                  radius={8}
                  fillColor={marker.type === 'ulstein' ? '#3B82F6' : '#F97316'}
                  color="#fff"
                  weight={selectedMarker === marker.id ? 3 : 2}
                  opacity={1}
                  fillOpacity={selectedMarker === marker.id ? 1 : 0.8}
                  eventHandlers={{
                    click: () => handleMarkerClick(marker.id),
                  }}
                >
                  <Popup>
                    <div className="p-2">
                      <h3 className="font-semibold">{marker.name}</h3>
                      <p className="text-sm">Service Vessel ({marker.type})</p>
                      <p className="text-sm">
                        Position: {marker.latitude.toFixed(4)}, {marker.longitude.toFixed(4)}
                      </p>
                    </div>
                  </Popup>
                </CircleMarker>
              );
            })}
          </MapContainer>
        </div>

        {/* Vessel List */}
        <div className="w-64 flex flex-col gap-6">
          <div>
            <h3 className="font-semibold mb-2 text-gray-800">Vessels</h3>
            <div className="space-y-2">
              {markers.filter((m) => m.type !== 'turbine').map((vessel) => (
                <div
                  key={vessel.id}
                  className={`p-2 rounded cursor-pointer transition-colors ${selectedMarker === vessel.id
                    ? 'bg-gray-100 border-2 border-gray-300'
                    : 'hover:bg-gray-50 border border-gray-200'
                    }`}
                  onClick={() => handleMarkerClick(vessel.id)}
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
                    {vessel.atService ? 'At Service' : 'Not At Service'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

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