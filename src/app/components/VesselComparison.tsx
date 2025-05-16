import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';

interface ServiceData {
    vesselId: string;
    vesselName: string;
    beaufortScale: number;
    serviceTime: string;
    waveHeight: number;
    windSpeed: number;
    connectionStatus: string;
    type: 'ulstein' | 'competitor';
    timeUsed: string;
    isCompetitor: boolean;
}

const getBeaufortDescription = (scale: number): string => {
    const descriptions = {
        0: 'Calm',
        1: 'Light air',
        2: 'Light breeze',
        3: 'Gentle breeze',
        4: 'Moderate breeze',
        5: 'Fresh breeze',
        6: 'Strong breeze',
        7: 'High wind',
        8: 'Gale',
        9: 'Strong gale',
        10: 'Storm',
        11: 'Violent storm',
        12: 'Hurricane force'
    };
    return descriptions[scale as keyof typeof descriptions] || 'Unknown';
};

const VesselComparison: React.FC = () => {
    const [availableVessels, setAvailableVessels] = useState<ServiceData[]>([]);
    const [selectedVessels, setSelectedVessels] = useState<ServiceData[]>([]);
    const [loading, setLoading] = useState(true);
    const [competitorVessels, setCompetitorVessels] = useState<Set<string>>(new Set());

    useEffect(() => {
        const fetchVesselData = async () => {
            try {
                const response = await fetch('/data/vessels.csv');
                if (!response.ok) {
                    throw new Error(`Failed to fetch vessel CSV file: ${response.statusText}`);
                }
                const csvText = await response.text();

                Papa.parse(csvText, {
                    header: true,
                    skipEmptyLines: true,
                    complete: (result) => {
                        const processedVessels = processVesselData(result.data);
                        setAvailableVessels(processedVessels);
                        setLoading(false);
                    },
                });
            } catch (error) {
                console.error('Error fetching vessel data:', error);
                setLoading(false);
            }
        };

        fetchVesselData();
    }, []);

    const processVesselData = (data: any[]): ServiceData[] => {
        // First, group vessels by their ID to track their connection status history
        const vesselGroups = data.reduce((acc: Record<string, any[]>, row) => {
            const vesselId = row.IMO;
            if (!acc[vesselId]) {
                acc[vesselId] = [];
            }
            acc[vesselId].push({
                ...row,
                timestamp: new Date(row.TIMESTAMP).getTime()
            });
            return acc;
        }, {});

        // Filter and process vessels that have completed services
        const processedVessels = Object.entries(vesselGroups)
            .filter(([_, vesselEntries]) =>
                // Check if vessel has both connected and disconnected states
                vesselEntries.some(entry => entry.CONNECTION_STATUS === 'connected') &&
                vesselEntries.some(entry => entry.CONNECTION_STATUS === 'disconnected')
            )
            .map(([vesselId, vesselEntries]) => {
                // Find the first connected entry for weather data
                const connectedEntry = vesselEntries
                    .filter(entry => entry.CONNECTION_STATUS === 'connected')
                    .sort((a, b) => a.timestamp - b.timestamp)[0];

                // Find the first disconnected entry
                const disconnectedEntry = vesselEntries
                    .filter(entry => entry.CONNECTION_STATUS === 'disconnected')
                    .sort((a, b) => a.timestamp - b.timestamp)[0];

                // Calculate service time
                let serviceTime = 'N/A';
                if (connectedEntry && disconnectedEntry) {
                    const timeDifference = Math.abs(disconnectedEntry.timestamp - connectedEntry.timestamp);
                    const hours = Math.floor(timeDifference / (1000 * 60 * 60));
                    const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
                    serviceTime = `${hours}h ${minutes}m`;
                }

                // Use weather data from the connected entry, as that's when it's available
                return {
                    vesselId,
                    vesselName: `Vessel ${vesselId}`,
                    beaufortScale: parseInt(connectedEntry.BEAUFORT_SCALE) || 0,
                    serviceTime,
                    waveHeight: parseFloat(connectedEntry.WAVEHEIGHT) || 0,
                    windSpeed: parseFloat(connectedEntry.WINDSPEED) || 0,
                    connectionStatus: disconnectedEntry.CONNECTION_STATUS || 'unknown', // Use latest status
                    isCompetitor: false,
                    timeUsed: calculateSuccessRate({
                        TIMESTAMP: disconnectedEntry.TIMESTAMP,
                        CONNECTED_TIMESTAMP: connectedEntry.TIMESTAMP
                    }),
                    type: 'ulstein' as const
                };
            });

        return processedVessels;
    };

    const calculateServiceTime = (vesselData: any): string => {
        if (vesselData.CONNECTION_STATUS === 'connected') {
            return 'Active';
        }
        return vesselData.CONNECTION_STATUS || 'N/A';
    };

    const calculateSuccessRate = (vesselData: any): string => {
        const connectedTimestamp = new Date(vesselData.CONNECTED_TIMESTAMP).getTime();
        const disconnectedTimestamp = new Date(vesselData.TIMESTAMP).getTime();
        const durationMs = Math.abs(disconnectedTimestamp - connectedTimestamp);

        const hours = Math.floor(durationMs / (1000 * 60 * 60));
        const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));

        return `${hours}h ${minutes}m`;
    };

    const toggleVesselType = (vesselId: string) => {
        setCompetitorVessels(prev => {
            const newSet = new Set(prev);
            if (newSet.has(vesselId)) {
                newSet.delete(vesselId);
            } else {
                newSet.add(vesselId);
            }
            return newSet;
        });
    };

    const handleVesselSelect = (vessel: ServiceData) => {
        if (selectedVessels.find(v => v.vesselId === vessel.vesselId)) {
            setSelectedVessels(selectedVessels.filter(v => v.vesselId !== vessel.vesselId));
        } else if (selectedVessels.length < 2) {
            setSelectedVessels([...selectedVessels, vessel]);
        }
    };

    const handleVesselRemove = (vesselId: string) => {
        setSelectedVessels(selectedVessels.filter(v => v.vesselId !== vesselId));
    };

    const getPerformanceColor = (value: number, metric: 'time' | 'weather'): string => {
        if (metric === 'weather') {
            return value <= 4 ? 'text-green-600 font-medium' : value <= 7 ? 'text-yellow-600 font-medium' : 'text-red-600 font-medium';
        }
        return 'text-gray-900 font-medium';
    };

    if (loading) {
        return <div className="text-center p-8">Loading vessel data...</div>;
    }

    return (
        <div className="space-y-6">
            {/* Vessel Selection */}
            <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-3xl font-bold mb-6 text-gray-900">Select Vessels to Compare</h2>
                <p className="text-lg text-gray-700 mb-6">Choose up to two vessels to compare their performance</p>
                <div className="space-y-4">
                    <div className="grid grid-cols-1 gap-4">
                        {availableVessels.map(vessel => (
                            <div key={vessel.vesselId} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                <div className="flex items-center space-x-4">
                                    <button
                                        onClick={() => handleVesselSelect(vessel)}
                                        className={`px-4 py-2 rounded ${selectedVessels.find(v => v.vesselId === vessel.vesselId)
                                            ? 'bg-blue-500 text-white'
                                            : 'bg-white hover:bg-gray-50 text-gray-800'
                                            } border transition-colors`}
                                    >
                                        {vessel.vesselName}
                                        {selectedVessels.find(v => v.vesselId === vessel.vesselId) &&
                                            <span className="ml-2 text-xs">(Click to deselect)</span>
                                        }
                                    </button>
                                    <div className="flex items-center space-x-2">
                                        <label className="inline-flex items-center">
                                            <input
                                                type="checkbox"
                                                checked={competitorVessels.has(vessel.vesselId)}
                                                onChange={() => toggleVesselType(vessel.vesselId)}
                                                className="form-checkbox h-5 w-5 text-blue-600"
                                            />
                                            <span className="ml-2 text-gray-700 font-medium">Mark as Competitor</span>
                                        </label>
                                    </div>
                                </div>
                                <div className="text-sm text-gray-700 font-medium">
                                    Beaufort: {vessel.beaufortScale} | Wind: {vessel.windSpeed} m/s
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Comparison Table */}
            {selectedVessels.length > 0 && (
                <div className="bg-white rounded-lg shadow-lg p-6">
                    <h2 className="text-3xl font-bold mb-6 text-gray-900">Vessel Service Comparison</h2>

                    <div className="overflow-x-auto">
                        <table className="min-w-full table-auto">
                            <thead>
                                <tr className="bg-gray-200">
                                    <th className="px-4 py-3 text-left text-gray-900 font-bold text-lg">Metric</th>
                                    {selectedVessels.map((vessel) => (
                                        <th key={vessel.vesselId} className="px-4 py-3 text-left text-gray-900 font-bold text-lg">
                                            {vessel.vesselName}
                                            <button
                                                onClick={() => handleVesselRemove(vessel.vesselId)}
                                                className="ml-2 text-red-600 hover:text-red-800 font-bold"
                                            >
                                                ×
                                            </button>
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="text-gray-900">
                                <tr className="border-b hover:bg-gray-50">
                                    <td className="px-4 py-3 font-bold">Type</td>
                                    {selectedVessels.map((vessel) => (
                                        <td key={vessel.vesselId} className="px-4 py-3 capitalize">
                                            {competitorVessels.has(vessel.vesselId) ? 'Competitor' : 'Ulstein'}
                                        </td>
                                    ))}
                                </tr>
                                <tr className="border-b bg-gray-50 hover:bg-gray-100">
                                    <td className="px-4 py-3 font-bold">Beaufort Scale</td>
                                    {selectedVessels.map((vessel) => (
                                        <td
                                            key={vessel.vesselId}
                                            className={`px-4 py-3 ${getPerformanceColor(vessel.beaufortScale, 'weather')}`}
                                        >
                                            {vessel.beaufortScale} - {getBeaufortDescription(vessel.beaufortScale)}
                                        </td>
                                    ))}
                                </tr>
                                <tr className="border-b hover:bg-gray-50">
                                    <td className="px-4 py-3 font-bold">Wave Height</td>
                                    {selectedVessels.map((vessel) => (
                                        <td key={vessel.vesselId} className="px-4 py-3">
                                            {vessel.waveHeight}m
                                        </td>
                                    ))}
                                </tr>
                                <tr className="border-b bg-gray-50 hover:bg-gray-100">
                                    <td className="px-4 py-3 font-bold">Wind Speed</td>
                                    {selectedVessels.map((vessel) => (
                                        <td key={vessel.vesselId} className="px-4 py-3">
                                            {vessel.windSpeed} m/s
                                        </td>
                                    ))}
                                </tr>
                                <tr className="border-b hover:bg-gray-50">
                                    <td className="px-4 py-3 font-bold">Service Status</td>
                                    {selectedVessels.map((vessel) => (
                                        <td key={vessel.vesselId} className="px-4 py-3">
                                            <span className="text-green-600 font-medium">
                                                Service Complete
                                            </span>
                                        </td>
                                    ))}
                                </tr>
                                <tr className="border-b bg-gray-50 hover:bg-gray-100">
                                    <td className="px-4 py-3 font-bold">Time Used</td>
                                    {selectedVessels.map((vessel) => (
                                        <td
                                            key={vessel.vesselId}
                                            className="px-4 py-3 text-gray-900"
                                        >
                                            {vessel.timeUsed}
                                        </td>
                                    ))}
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default VesselComparison; 