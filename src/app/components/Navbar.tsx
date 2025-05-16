import Link from "next/link";

const Navbar = () => {
  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="text-xl font-bold text-gray-800">
                Ulstein Dashboard
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link href="/"
                className="inline-flex items-center px-1 pt-1 text-gray-500 hover:text-gray-700">
                Home
              </Link>
              <Link href="/vessel-comparison"
                className="inline-flex items-center px-1 pt-1 text-gray-500 hover:text-gray-700">
                Vessel Comparison
              </Link>
              <Link href="/about-us"
                className="inline-flex items-center px-1 pt-1 text-gray-500 hover:text-gray-700">
                About Us
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;