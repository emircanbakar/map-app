import React from "react";

const ChangeMap = ({ onStyleChange }) => {
  return (
    <div className="absolute left-0 z-10 mt-2 flex w-auto bg-white border border-gray-300 rounded-md shadow-lg transition-all">
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
  );
};

export default ChangeMap;
