import React, { useContext } from "react";
import MapContext from "../context/MapContext";
import Dropdown from "./Dropdown";
import maplibregl from "maplibre-gl";
import Filter from "./Filter"; // Filter bileşenini içe aktar

const Card = ({
  onStyleChange,
  onShowMarkers,
  markers,
  mapRef,
  showPopup,
  formData,
  searchLocation,
}) => {
  const {
    activeMarkerType,
    setActiveMarkerType,
    isOpen,
    setIsOpen,
    details,
    setDetails,
    searchQuery,
    setSearchQuery,
    apiLocations,
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

  const handleDetails = () => setDetails(!details);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      searchLocation(searchQuery);
    } else {
      console.error("Search query is empty");
    }
  };

  const toggleDropdown = () => setIsOpen(!isOpen);
  const handleFilter = (typeId) => {
    console.log("Handle filter for typeId:", typeId);
    // Uncomment the following line if you need to debug API locations
    // console.log("API Locations:", apiLocations);
  
    // Filter and map markers based on typeId
    const filteredMarkers = apiLocations
      .filter((location) => location.PARK_TYPE_ID === typeId)
      .map((location) => {
        const longitude = parseFloat(location.LONGITUDE);
        const latitude = parseFloat(location.LATITUDE);
  
        // Log invalid coordinates for debugging
        if (isNaN(longitude) || isNaN(latitude)) {
          console.log("Invalid coordinates:", longitude, latitude);
          return null;
        }
  
        // Create marker element based on typeId
        const el = document.createElement("div");
        el.className = typeId === "ispark" ? "ibb-marker" : "default-marker";
  
        // Create and configure the marker
        const marker = new maplibregl.Marker(el).setLngLat([longitude, latitude]);
  
        // Create and configure the popup
        const popup = new maplibregl.Popup({ offset: 25 }).setHTML(`
          <p>${typeId === "ispark" ? "Otopark" : "Park veya Yeşil Alan"}</p>
          <strong>${location.PARK_NAME || "Unknown"}</strong><br/>
          ${location.LOCATION_NAME || "Unknown"}<br/>
          <button onclick="handleEditClick('${location.PARK_NAME || ""}', '${location.LOCATION_NAME || ""}', '${typeId}', ${longitude}, ${latitude}, '${location._id || ""}')" class="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Edit</button>
        `);
  
        marker.setPopup(popup);
  
        return { marker, type: typeId };
      })
      .filter((markerObj) => markerObj !== null);
  
    // Remove existing markers
    markers.current.forEach((markerObj) => {
      if (markerObj && markerObj.marker) {
        markerObj.marker.remove(); // Ensure marker is removed from the map
      }
    });
    markers.current = []; // Clear the markers array
  
    // Add filtered markers to the map
    filteredMarkers.forEach((markerObj) => {
      markerObj.marker.addTo(mapRef.current);
      markers.current.push(markerObj); // Store the marker object
    });
  
    console.log("Filtered markers added:", filteredMarkers);
  };
  
  return (
    <div className="fixed top-4 left-4 bg-white w-[350px] h-auto shadow-lg p-4 z-10 rounded-md">
      {/*search bar*/}
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
          <div className="mt-4 flex items-center justify-between">
            <button
              onClick={() => handleButtonClick("ispark")}
              className={`flex justify-center items-center my-4 mr-2 flex-1 h-16 p-4 text-center transition-all duration-300 ${
                activeMarkerType === "ispark"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-800"
              } rounded-md`}
            >
              Otoparklar
            </button>
            <button
              onClick={() => handleButtonClick("greenSpaces")}
              className={`flex justify-center items-center my-4 flex-1 h-16 p-4 text-center transition-all duration-300 ${
                activeMarkerType === "greenSpaces"
                  ? "bg-green-500 text-white"
                  : "bg-gray-200 text-gray-800"
              } rounded-md`}
            >
              Yeşil Alanlar
            </button>
          </div>
          <p>Otopark Çeşitleri</p>
          <Filter onFilter={handleFilter} />

          <Dropdown
            markers={markers}
            mapRef={mapRef}
            showPopup={showPopup}
            formData={formData}
          />

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
