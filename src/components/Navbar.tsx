import React, { useState } from "react";

function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav>
      <div className="px-4 dark:bg-gray-900">
        <div className="flex items-center justify-between h-16  ">
          <h1 className="px-4 font-['Lobster'] text-gray-900 text-2xl dark:text-white">
            SweepEase.
          </h1>
          <div className="flex md:hidden">
            <button
              onClick={toggleMobileMenu}
              className="text-gray-300 hover:text-black focus:outline-none focus:text-black"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16m-7 6h7"
                ></path>
              </svg>
            </button>
          </div>
          <div className="hidden md:flex items-center space-x-4 px-6">
            <a
              href="#"
              className="text-gray-500 hover:text-black dark:text-white"
            >
              Pricing
            </a>
            <a
              href="#"
              className="text-gray-500 hover:text-black dark:text-white"
            >
              Services
            </a>
            <a
              href="#"
              className="text-gray-500 hover:text-black dark:text-white"
            >
              Sign In
            </a>
          </div>
        </div>
      </div>
      <div
        className={`md:hidden bg-gray-700 py-2 px-4 text-gray-300 space-y-2 absolute top-16 left-0 right-0 z-20 ${
          isMobileMenuOpen ? "" : "hidden"
        }`}
      >
        <a href="#" className="block">
          Home
        </a>
        <a href="#" className="block">
          About
        </a>
        <a href="#" className="block">
          Services
        </a>
        <a href="#" className="block">
          Contact
        </a>
      </div>
    </nav>
  );
}

export default Navbar;
