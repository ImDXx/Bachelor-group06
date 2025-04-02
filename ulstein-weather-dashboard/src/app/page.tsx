import Image from "next/image";
import Link from "next/link";

// NavBar component
function NavBar() {
  return (
    <nav className="flex justify-end p-6 bg-gray-100">
      <Link href="#home" className="no-underline font-bold text-black ml-6 hover:text-blue-600">
        Home
      </Link>
      <Link href="#about-us" className="no-underline font-bold text-black ml-6 hover:text-blue-600">
        About Us
      </Link>
    </nav>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen">
      <div className="text-center mt-8">
        <NavBar />
        <h1 className="text-2xl font-bold mt-4">Ulstein Service performance under demanding weather conditions</h1>
        <p className="mt-2">Comparison of serviceability of wind turbines under varying weather conditions</p>
      </div>
      
      <div className="flex flex-col items-center mt-8">
        <div className="bg-gray-200 border border-gray-300 p-8 text-center text-lg font-bold h-[150px] flex justify-center items-center w-4/5 mb-8">
          <span role="img" aria-label="wrench">🔧</span> Under Development
        </div>
        
        <div className="flex justify-between w-4/5">
          <div className="bg-gray-200 border border-gray-300 p-8 text-center text-lg font-bold h-[150px] flex justify-center items-center w-[48%]">
            <span role="img" aria-label="wrench">🔧</span> Under Development
          </div>
          <div className="bg-gray-200 border border-gray-300 p-8 text-center text-lg font-bold h-[150px] flex justify-center items-center w-[48%]">
            <span role="img" aria-label="wrench">🔧</span> Under Development
          </div>
        </div>
      </div>
    </div>
  );
}