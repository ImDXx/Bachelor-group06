'use client';

import { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css';
import Papa from 'papaparse';
import { MarkerInfo } from '@/types/data';
import { haversineDistance } from '@/utils/distance'; // Import the haversineDistance function
import L from 'leaflet';

// Dynamically import map components with no SSR
const MapContainer = dynamic(
  () => import('react-leaflet').then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import('react-leaflet').then((mod) => mod.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import('react-leaflet').then((mod) => mod.Marker),
  { ssr: false }
);
const CircleMarker = dynamic(
  () => import('react-leaflet').then((mod) => mod.CircleMarker),
  { ssr: false }
);
const Popup = dynamic(
  () => import('react-leaflet').then((mod) => mod.Popup),
  { ssr: false }
);
const Pane = dynamic(
  () => import('react-leaflet').then((mod) => mod.Pane),
  { ssr: false }
);

// Dynamically import MarkerClusterGroup
const MarkerClusterGroup = dynamic(
  () => import('react-leaflet-markercluster').then(mod => mod.default),
  { ssr: false }
) as any;

// Create custom boat icons
const boatIcon = L.divIcon({
  html: `<div style="font-size: 24px;">🛥️</div>`,
  className: 'boat-icon',
  iconSize: [24, 24],
  iconAnchor: [12, 12],
});
// Increasing the icon size when selected
const selectedBoatIcon = L.divIcon({
  html: `<div style="font-size: 32px;">🛥️</div>`,
  className: 'boat-icon selected',
  iconSize: [32, 32],
  iconAnchor: [16, 16],
});

export default function ServiceMap() {
  const [csvTurbines, setCsvTurbines] = useState<MarkerInfo[]>([]); // Store turbines from CSV
  const [vessels, setVessels] = useState<MarkerInfo[]>([]); // Store vessels from CSV
  const [filteredTurbines, setFilteredTurbines] = useState<MarkerInfo[]>([]); // Store turbines close to vessels
  const [selectedMarker, setSelectedMarker] = useState<MarkerInfo | null>(null); // Store the selected marker
  const [mapLoaded, setMapLoaded] = useState(false);
  const markerRefs = useRef<Map<string, any>>(new Map()); // Store refs for all markers

  const PROXIMITY_THRESHOLD = 25; // Distance in kilometers to consider turbines close to vessels

  useEffect(() => {
    setMapLoaded(true);
  }, []);

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
        const response = await fetch('/data/vessels.csv'); // Ensure the file is in the public/data folder
        if (!response.ok) {
          throw new Error(`Failed to fetch vessel CSV file: ${response.statusText}`);
        }
        const csvText = await response.text();

        Papa.parse(csvText, {
          header: true,
          skipEmptyLines: true,
          complete: (result) => {
            // Group data by IMO and keep only the latest entry for each vessel
            const groupedVessels = result.data.reduce((acc: Record<string, any>, row: any) => {
              const imo = row.IMO;
              const timestamp = new Date(row.TIMESTAMP).getTime();

              if (!acc[imo] || acc[imo].timestamp < timestamp) {
                acc[imo] = {
                  id: imo,
                  name: `Vessel ${imo}`,
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
                  type: 'ulstein', // 
                  timestamp, // Store the timestamp for comparison
                };
              }

              return acc;
            }, {});

            // Convert grouped data back to an array
            const latestVessels = Object.values(groupedVessels);
            setVessels(latestVessels);
          },
        });
      } catch (error) {
        console.error('Error fetching vessel data:', error);
      }
    };

    fetchVesselData();
  }, []);

  // Filter turbines based on proximity to vessels
  useEffect(() => {
    if (vessels.length > 0 && csvTurbines.length > 0) {
      const nearbyTurbines = csvTurbines.filter((turbine) =>
        vessels.some((vessel) => haversineDistance(turbine, vessel) <= PROXIMITY_THRESHOLD)
      );
      setFilteredTurbines(nearbyTurbines);
    }
  }, [vessels, csvTurbines]);

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

  if (!mapLoaded) {
    return (
      <div className="h-[500px] bg-gray-100 rounded-lg animate-pulse flex items-center justify-center">
        Loading Map...
      </div>
    );
  }

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
            {/* Map Layers */}
            <Pane name="turbinePane" style={{ zIndex: 400 }} />
            <Pane name="vesselPane" style={{ zIndex: 500 }} />

            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {/* Render Turbines with Clustering */}
            <MarkerClusterGroup
              chunkedLoading // Enable chunked loading for better performance
              maxClusterRadius={50} // Adjust clustering radius
              disableClusteringAtZoom={10} // Disable clustering at zoom level 10
            >
              {filteredTurbines.map((turbine) => (
                <CircleMarker
                  key={turbine.id}
                  center={[turbine.latitude, turbine.longitude]}
                  radius={6}
                  fillColor="#FFD700"
                  color="#000"
                  weight={1}
                  opacity={1}
                  fillOpacity={0.8}
                  pane="turbinePane" // Use the turbine pane
                  eventHandlers={{
                    click: () => setSelectedMarker(turbine),
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
              <Marker
                key={vessel.id}
                position={[vessel.latitude, vessel.longitude]}
                icon={selectedMarker?.id === vessel.id ? selectedBoatIcon : boatIcon}
                eventHandlers={{
                  click: () => handleMarkerClick(vessel),
                }}
                ref={(ref) => {
                  if (ref) {
                    markerRefs.current.set(vessel.id, ref);
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
                  </div>
                </Popup>
              </Marker>
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
          <div className="flex items-center justify-center w-6 h-6 mr-2">🛥️</div>
          <span className="text-sm text-gray-700">Ulstein Vessels</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-yellow-400 rounded-full mr-2" />
          <span className="text-sm text-gray-700">Wind Turbines</span>
        </div>
      </div>
    </div>
  );
}