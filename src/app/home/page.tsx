'use client';

import dynamic from 'next/dynamic';
import { Suspense } from "react";
import Navbar from "../components/Navbar";

// Use dynamic imports with ssr: false for components that need browser APIs
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

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="text-center">
        <Navbar />
        <h1 className="text-2xl font-bold mt-4 text-gray-800">
          Ulstein Service performance under demanding weather conditions
        </h1>
        <p className="mt-2 text-gray-700">
          Comparison of serviceability of wind turbines under varying weather conditions
        </p>
      </div>

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