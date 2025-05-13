'use client';

import { useParams, useRouter } from 'next/navigation';
import { mockVessels } from '../../../../public/data/mockVessels';

export default function VesselDetails() {
    const params = useParams(); // Get the parameters from the URL
    const router = useRouter(); // Initialize the router
    const vesselId = params?.vesselId as string; // Safely extract vesselId as a string

    // Find the vessel by ID
    const vessel = mockVessels.find((v) => v.id === vesselId);

    if (!vessel) {
        return (
            <div className="flex items-center justify-center h-screen bg-white text-black">
                <div className="p-6 text-center">
                    <p>Vessel not found bruh</p>
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
                <button
                    className="absolute top-4 left-4 px-4 py-2 bg-gray-200 text-black rounded hover:bg-gray-300"
                    onClick={() => router.back()}
                >
                    Go Back
                </button>
                <h1 className="text-2xl font-bold">{vessel.name}</h1>
                <div className="mt-4">
                    <p className="text-lg">Latest Position:</p>
                    <p className="text-sm">
                        Lat: {vessel.positions[vessel.positions.length - 1].latitude.toFixed(6)}
                        <br />
                        Long: {vessel.positions[vessel.positions.length - 1].longitude.toFixed(6)}
                        <br />
                        Time: {new Date(vessel.positions[vessel.positions.length - 1].timestamp).toLocaleString()}
                    </p>
                </div>
            </div>
        </div>
    );
}