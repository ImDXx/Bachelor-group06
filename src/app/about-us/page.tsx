/**
 * AboutUsPage.tsx
 * 
 * A React component that displays an about us page
 * 
 * 
 */

import Navbar from "../components/Navbar";
import Image from "next/image";

export default function AboutUsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="">
        <Navbar />
        <div className="text-center pt-8">
          <h1 className="text-2xl font-bold text-gray-800">About Us</h1>
          <p className="mt-2 text-gray-700">
            This project is developed as part of our bachelor thesis at NTNU.
            Our research focuses on analyzing vessel performance in adverse weather conditions
            during offshore wind turbine service operations.
          </p>

          {/* NTNU Logo */}
          <div className="flex justify-center items-center mt-12 mb-8">
            <div className="relative w-48 h-48">
              <Image
                src="/NTNULogo.svg"
                alt="NTNU Logo"
                fill
                style={{ objectFit: 'contain' }}
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
