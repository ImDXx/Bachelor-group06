/**
 * AboutUsPage.tsx
 * 
 * A React component that displays an about us page
 * 
 * 
 */

import Navbar from "../components/Navbar";

export default function AboutUsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="">
        <Navbar />
        <div className="text-center pt-8">
          <h1 className="text-2xl font-bold text-gray-800">About Us</h1>
          <p className="mt-2 text-gray-700">
            Welcome to the About Us page. Learn more about our team and mission here.
          </p>
        </div>
      </div>
    </div>
  );
}
