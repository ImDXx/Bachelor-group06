import { lazy, Suspense } from "react";
import Navbar from "../components/Navbar";

const Vessels = lazy(() => import("../components/dashboard/Vessels"));
const Turbines = lazy(() => import("../components/dashboard/Turbines"));
const ServiceEvents = lazy(() => import("../components/dashboard/ServiceEvents"));
const ServiceMap = lazy(() => import("../components/dashboard/ServiceMap"));

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
        <Suspense fallback={<div>Loading Map...</div>}>
          <div className="mb-8">
            <ServiceMap />
          </div>
        </Suspense>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-8">
            <Suspense fallback={<div>Loading Vessels...</div>}>
              <Vessels />
            </Suspense>
            <Suspense fallback={<div>Loading Turbines...</div>}>
              <Turbines />
            </Suspense>
          </div>
          <div className="space-y-8">
            <Suspense fallback={<div>Loading Service Events...</div>}>
              <ServiceEvents />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}