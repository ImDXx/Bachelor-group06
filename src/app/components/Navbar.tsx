import Link from "next/link";

export default function Navbar() {
    return (
      <nav className="flex justify-start p-6 bg-gray-100">
        <Link href="#home" className="no-underline font-bold text-black ml-6 hover:text-blue-600">
          Home
        </Link>
        <Link href="#about-us" className="no-underline font-bold text-black ml-6 hover:text-blue-600">
          About Us
        </Link>
      </nav>
    );
  }