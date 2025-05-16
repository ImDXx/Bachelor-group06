'use client';

import Navbar from "../components/Navbar";
import VesselComparison from "../components/VesselComparison";

export default function VesselComparisonPage() {
    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-4xl font-bold text-center mb-4 text-gray-900">
                    Vessel Service Performance Comparison
                </h1>
                <p className="text-xl text-center text-gray-700 mb-8 max-w-3xl mx-auto">
                    Compare vessel performance based on weather conditions and service metrics to evaluate operational efficiency
                </p>
                <VesselComparison />
            </div>
        </div>
    );
} 