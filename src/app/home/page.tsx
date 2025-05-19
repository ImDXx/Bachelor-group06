'use client';
/**
 * Home.tsx
 * 
 * The main dashboard page for the application
 * Implements dynamic Loading of components and displays a comprehensive view
 * of service operations and vessel locations.
 * 
 * Features:
 * - Interactive map
 * - Vessel information display
 * - Service event tracking
 */
import dynamic from 'next/dynamic';
import { Suspense } from "react";
import Navbar from "../components/Navbar";

/**
 * Dynamic Components Imports
 * 
 * 
 * ssr: false - Required for components using browser-specific features - Error if not used.
 */
const ServiceMap = dynamic(() => import("../components/dashboard/ServiceMap"), {
  ssr: false,
  loading: () => <div className="h-[500px] bg-gray-100 rounded-lg animate-pulse flex items-center justify-center">Loading Map...</div>
});

const Vessels = dynamic(() => import("../components/dashboard/Vessels"), {
  ssr: false,
  loading: () => <div className="h-[200px] bg-gray-100 rounded-lg animate-pulse flex items-center justify-center">Loading Vessels...</div>
});

const ServiceEvents = dynamic(() => import("../components/dashboard/ServiceEvents"), {
  ssr: false,
  loading: () => <div className="h-[200px] bg-gray-100 rounded-lg animate-pulse flex items-center justify-center">Loading Service Events...</div>
});


/**
 * Home Component
 * 
 * Structure:
 * - Navigation bar
 * - Page title and description
 * - Map, vessel and service event components
 * 
 *  
 */
export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section - NavBar and Page Title */}
      <div className="text-center">
        <Navbar />
        <h1 className="text-2xl font-bold mt-4 text-gray-800">
          Ulstein Vessel Performance in Adverse Weather
        </h1>
        <p className="mt-2 text-gray-700">
          Turbine Serviceability Across Weather Conditions
        </p>
      </div>

      {/* Main Content Section - Map, Vessels and Service Events */}
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <ServiceMap />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-8">
            <Vessels />
          </div>
          <div className="space-y-8">
            <ServiceEvents />
          </div>
        </div>
      </div>
    </div>
  );
}