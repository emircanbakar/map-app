import React, { useState } from "react";

const Card = ({ onStyleChange, searchLocation }) => {
  const [details, setDetails] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const toggleDropdown = () => setIsOpen(!isOpen);
  const handleDetails = () => setDetails(!details);

  const handleSearch = () => {
    searchLocation(searchQuery);
  };

  return (
    <div className="fixed top-4 left-4 bg-white w-[350px] h-auto shadow-lg p-4 z-10 rounded-md">
      <div className="flex items-center space-x-2 transition-all">
        <div className="relative flex-grow transition-all">
          <label htmlFor="Search" className="sr-only">
            Search
          </label>
          <input
            type="text"
            id="Search"
            placeholder="Search for..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-md p-2.5 pe-10 shadow-sm sm:text-sm border-2 border-gray-200 focus:border-blue-500 transition-all"
          />

          <span className="absolute inset-y-0 end-0 grid w-10 place-content-center">
            <button
              type="button"
              onClick={handleSearch}
              className="text-gray-600 hover:text-gray-700"
            >
              <span className="sr-only">Search</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="size-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                />
              </svg>
            </button>
          </span>
        </div>
        <button
          onClick={handleDetails}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-all"
        >
          <svg
            className="h-6 w-6"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>
      </div>

      {details && (
        <div className="mt-4 transition-all">
          {/* ispark ve yeşil alan için divler yapılacak + dropdown fullsize olabilir UI düzeltmeleri yap DAHA APİLERİ EKLEMEDİN UNUTMA**** */}
          <div className="mt-4 flex items-center">
            <button className="p-6 m-4 bg-blue-300">ispark</button>
            <button className="p-6 m-4 bg-blue-300">ispark</button>
          </div>

          <div className="relative inline-block text-left mt-4">
            <button
              onClick={toggleDropdown}
              className="inline-flex items-center px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-100 focus:outline-none transition-all"
            >
              Harita Görünümleri
              <svg
                className="-mr-1 ml-2 h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
            {isOpen && (
              <div className="absolute right-0 z-10 mt-2 w-auto bg-white border border-gray-300 rounded-md shadow-lg transition-all">
                <button
                  onClick={() =>
                    onStyleChange(
                      "https://api.maptiler.com/maps/streets/style.json?key=9HThlwugrS3kGNIjxi5r"
                    )
                  }
                  className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-blue-600 hover:text-white transition-all"
                >
                  Streets
                </button>
                <button
                  onClick={() =>
                    onStyleChange(
                      "https://api.maptiler.com/maps/streets-dark/style.json?key=9HThlwugrS3kGNIjxi5r"
                    )
                  }
                  className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-blue-600 hover:text-white transition-all"
                >
                  Streets Dark
                </button>
                <button
                  onClick={() =>
                    onStyleChange(
                      "https://api.maptiler.com/maps/hybrid/style.json?key=9HThlwugrS3kGNIjxi5r"
                    )
                  }
                  className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-blue-600 hover:text-white transition-all"
                >
                  Satellite Hybrid
                </button>
                <button
                  onClick={() =>
                    onStyleChange(
                      "https://api.maptiler.com/maps/outdoor/style.json?key=9HThlwugrS3kGNIjxi5r"
                    )
                  }
                  className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-blue-600 hover:text-white transition-all"
                >
                  Outdoor
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Card;
