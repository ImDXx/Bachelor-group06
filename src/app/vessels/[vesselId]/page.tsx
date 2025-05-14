'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Papa from 'papaparse';

interface VesselInfo {
    id: string;
    name: string;
    latitude: number;
    longitude: number;
    speed?: number;
    connectionStatus?: string;
    timestamp: string;
    airTemperature?: number;
    currentSpeed?: number;
    gust?: number;
    swellHeight?: number;
    waterTemperature?: number;
    waveHeight?: number;
    windSpeed?: number;
}

export default function VesselDetails() {
    const params = useParams(); // Get the parameters from the URL
    const router = useRouter(); // Initialize the router
    const vesselId = params?.vesselId as string; // Safely extract vesselId as a string

    const [vessel, setVessel] = useState<VesselInfo | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchVesselData = async () => {
            try {
                const response = await fetch('/data/ulstein_vessels.csv'); // Ensure the file is in the public/data folder
                if (!response.ok) {
                    throw new Error(`Failed to fetch vessel data: ${response.statusText}`);
                }
                const csvText = await response.text();

                Papa.parse(csvText, {
                    header: true,
                    skipEmptyLines: true,
                    complete: (result) => {
                        const parsedVessels = result.data.map((row: any) => ({
                            id: row.IMO, // Use IMO as the unique ID
                            name: `Vessel ${row.IMO}`, // Optional: Add a name for the vessel
                            latitude: parseFloat(row.LATITUDE),
                            longitude: parseFloat(row.LONGITUDE),
                            speed: row.SPEED ? parseFloat(row.SPEED) : undefined,
                            connectionStatus: row.CONNECTION_STATUS,
                            timestamp: row.TIMESTAMP,
                            airTemperature: row.AIRTEMPERATURE ? parseFloat(row.AIRTEMPERATURE) : undefined,
                            currentSpeed: row.CURRENTSPEED ? parseFloat(row.CURRENTSPEED) : undefined,
                            gust: row.GUST ? parseFloat(row.GUST) : undefined,
                            swellHeight: row.SWELLHEIGHT ? parseFloat(row.SWELLHEIGHT) : undefined,
                            waterTemperature: row.WATERTEMPERATURE ? parseFloat(row.WATERTEMPERATURE) : undefined,
                            waveHeight: row.WAVEHEIGHT ? parseFloat(row.WAVEHEIGHT) : undefined,
                            windSpeed: row.WINDSPEED ? parseFloat(row.WINDSPEED) : undefined,
                        }));

                        // Find the vessel by ID
                        const foundVessel = parsedVessels.find((v: VesselInfo) => v.id === vesselId);
                        setVessel(foundVessel || null);
                        setLoading(false);
                    },
                });
            } catch (error) {
                console.error('Error fetching vessel data:', error);
                setLoading(false);
            }
        };

        fetchVesselData();
    }, [vesselId]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen bg-white text-black">
                <p>Loading vessel data...</p>
            </div>
        );
    }

    if (!vessel) {
        return (
            <div className="flex items-center justify-center h-screen bg-white text-black">
                <div className="p-6 text-center">
                    <p>Vessel not found</p>
                    <button
                        className="mt-4 px-4 py-2 bg-gray-200 text-black rounded hover:bg-gray-300"
                        onClick={() => router.back()}
                    >
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center h-screen bg-white text-black">
            <div className="p-6 text-center">
                <h1 className="text-2xl font-bold">{vessel.name}</h1>
                <div className="mt-4">
                    <p className="text-lg">Latest Position:</p>
                    <p className="text-sm">
                        Lat: {vessel.latitude.toFixed(6)}
                        <br />
                        Long: {vessel.longitude.toFixed(6)}
                        <br />
                        Speed: {vessel.speed ? `${vessel.speed} knots` : 'N/A'}
                        <br />
                        Connection Status: {vessel.connectionStatus || 'N/A'}
                        <br />
                        Timestamp: {new Date(vessel.timestamp).toLocaleString()}
                    </p>
                </div>
                {vessel.connectionStatus === 'approaching' || vessel.connectionStatus === 'connected' ? (
                    <div className="mt-4">
                        <p className="text-lg">Weather Data:</p>
                        <p className="text-sm">
                            Air Temperature: {vessel.airTemperature ? `${vessel.airTemperature} °C` : 'N/A'}
                            <br />
                            Current Speed: {vessel.currentSpeed ? `${vessel.currentSpeed} m/s` : 'N/A'}
                            <br />
                            Gust: {vessel.gust ? `${vessel.gust} m/s` : 'N/A'}
                            <br />
                            Swell Height: {vessel.swellHeight ? `${vessel.swellHeight} m` : 'N/A'}
                            <br />
                            Water Temperature: {vessel.waterTemperature ? `${vessel.waterTemperature} °C` : 'N/A'}
                            <br />
                            Wave Height: {vessel.waveHeight ? `${vessel.waveHeight} m` : 'N/A'}
                            <br />
                            Wind Speed: {vessel.windSpeed ? `${vessel.windSpeed} m/s` : 'N/A'}
                        </p>
                    </div>
                ) : null}
                <button
                    className="mt-4 px-4 py-2 bg-gray-200 text-black rounded hover:bg-gray-300"
                    onClick={() => router.back()}
                >
                    Go Back
                </button>
            </div>
        </div>
    );
}