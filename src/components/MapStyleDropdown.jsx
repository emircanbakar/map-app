import React, { useContext } from "react";
import Location from "./Location";
import MapContext from "../context/MapContext";

const MapStyleDropdown = ({ setLocation }) => {
  const { setIsOpen, isOpen, setMapStyle } = useContext(MapContext);
  const toggleDropdown = () => setIsOpen(!isOpen);
  const onStyleChange = (styleUrl) => {
    setMapStyle(styleUrl);
  };

  return (
    <div>
      <div className="relative flex justify-between text-left mt-4">
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
        <Location onLocationUpdate={setLocation} />
        {isOpen && (
          <div className="absolute left-0 z-10 mt-12 flex w-auto bg-white border border-gray-300 rounded-md shadow-lg transition-all">
            <button
              onClick={() =>
                onStyleChange(
                  "https://api.maptiler.com/maps/streets/style.json?key=9HThlwugrS3kGNIjxi5r"
                )
              }
              className="flex-1 text-left px-4 py-2 text-gray-700 hover:bg-blue-600 hover:text-white transition-all"
            >
              Streets
            </button>
            <button
              onClick={() =>
                onStyleChange(
                  "https://api.maptiler.com/maps/streets-dark/style.json?key=9HThlwugrS3kGNIjxi5r"
                )
              }
              className="flex-1 text-left px-4 py-2 text-gray-700 hover:bg-blue-600 hover:text-white transition-all"
            >
              Streets Dark
            </button>
            <button
              onClick={() =>
                onStyleChange(
                  "https://api.maptiler.com/maps/hybrid/style.json?key=9HThlwugrS3kGNIjxi5r"
                )
              }
              className="flex-1 text-left px-4 py-2 text-gray-700 hover:bg-blue-600 hover:text-white transition-all"
            >
              Satellite Hybrid
            </button>
            <button
              onClick={() =>
                onStyleChange(
                  "https://api.maptiler.com/maps/topo-v2-dark/style.json?key=9HThlwugrS3kGNIjxi5r"
                )
              }
              className="flex-1 text-left px-4 py-2 text-gray-700 hover:bg-blue-600 hover:text-white transition-all"
            >
              Topo Night
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MapStyleDropdown;
