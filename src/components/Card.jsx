import React, { useContext } from "react";
import MapContext from "../context/MapContext";
import Dropdown from "./Dropdown";
import Search from "./Search";

const Card = ({
  onStyleChange,
  onShowMarkers,
  markers,
  mapRef,
  showPopup,
  formData,
}) => {
  const {
    activeMarkerType,
    setActiveMarkerType,
    isOpen,
    setIsOpen,
    details,
  } = useContext(MapContext);

  const handleButtonClick = (type) => {
    if (activeMarkerType === type) {
      setActiveMarkerType(null);
      onShowMarkers(null);
    } else {
      setActiveMarkerType(type);
      onShowMarkers(type);
    }
  };

  const toggleDropdown = () => setIsOpen(!isOpen);

  return (
    <div className="fixed top-4 left-4 bg-white w-[350px] h-auto shadow-lg p-4 z-10 rounded-md">
      <Search markers={markers} mapRef={mapRef}/>

      {details && (
        <div className="mt-4 transition-all">

          {/* ispark ve yeşil alan için divler yapılacak + dropdown fullsize olabilir UI düzeltmeleri yap DAHA APİLERİ EKLEMEDİN UNUTMA**** */}
          <div className="mt-4 flex items-center justify-between">
            <button
              onClick={() => handleButtonClick("ispark")}
              className={`flex justify-center items-center m-4 flex-1 h-16 p-4 text-center transition-all duration-300 ${
                activeMarkerType === "ispark"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-800"
              } rounded-md`}
            >
              Otoparklar
            </button>
            <button
              onClick={() => handleButtonClick("greenSpaces")}
              className={`flex justify-center items-center m-4 flex-1 h-16 p-4 text-center transition-all duration-300 ${
                activeMarkerType === "greenSpaces"
                  ? "bg-green-500 text-white"
                  : "bg-gray-200 text-gray-800"
              } rounded-md`}
            >
              Yeşil Alanlar
            </button>
          </div>

          <Dropdown markers={markers} mapRef={mapRef} showPopup={showPopup} formData={formData} />

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
                      "https://api.maptiler.com/maps/topo-v2-dark/style.json?key=9HThlwugrS3kGNIjxi5r"
                    )
                  }
                  className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-blue-600 hover:text-white transition-all"
                >
                  Topo night
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
