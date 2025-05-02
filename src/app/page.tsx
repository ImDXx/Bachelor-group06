import Navbar from "./components/Navbar";
import Vessels from "./components/dashboard/Vessels";
import Turbines from "./components/dashboard/Turbines";
import Weather from "./components/dashboard/Weather";
import ServiceEvents from "./components/dashboard/ServiceEvents";
import ServiceMap from "./components/dashboard/ServiceMap";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="text-center mt-8">
        <Navbar />
        <h1 className="text-2xl font-bold mt-4 text-gray-800">Ulstein Service performance under demanding weather conditions</h1>
        <p className="mt-2 text-gray-700">Comparison of serviceability of wind turbines under varying weather conditions</p>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <ServiceMap />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-8">
            <Vessels />
            <Turbines />
          </div>
          <div className="space-y-8">
            <Weather />
            <ServiceEvents />
          </div>
        </div>
      </div>
    </div>
  );
}