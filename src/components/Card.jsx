import React, { useContext } from "react";
import MapContext from "../context/MapContext";
import Dropdown from "./Dropdown";
import maplibregl from "maplibre-gl";
import Filter from "./Filter";
import ChangeMap from "./ChangeMap";
import Search from "./Search";
import Location from "./Location";

const Card = ({
  onStyleChange,
  onShowMarkers,
  markers,
  mapRef,
  showPopup,
  formData,
  searchLocation,
  setLocation,
}) => {
  const {
    activeMarkerType,
    setActiveMarkerType,
    isOpen,
    setIsOpen,
    details,
    setDetails,
    searchQuery,
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
    const filteredMarkers = apiLocations
      .filter((location) => location.PARK_TYPE_ID === typeId)
      .map((location) => {
        const longitude = parseFloat(location.LONGITUDE);
        const latitude = parseFloat(location.LATITUDE);
        if (isNaN(longitude) || isNaN(latitude)) {
          console.log("Invalid coordinates:", longitude, latitude);
          return null;
        }
        const el = document.createElement("div");
        el.className = typeId === "ispark" ? "ibb-marker" : "default-marker";

        const marker = new maplibregl.Marker(el).setLngLat([
          longitude,
          latitude,
        ]);

        const popup = new maplibregl.Popup({ offset: 25 }).setHTML(`
          <p>Otopark</p>
          <strong>${location.PARK_NAME || "Unknown"}</strong><br/>
          ${location.LOCATION_NAME || "Unknown"}<br/>
          <button onclick="handleEditClick('${location.PARK_NAME || ""}', '${
          location.LOCATION_NAME || ""
        }', '${typeId}', ${longitude}, ${latitude}, '${
          location._id || ""
        }')" class="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Edit</button>
        `);

        marker.setPopup(popup);

        return { marker, type: typeId };
      })
      .filter((markerObj) => markerObj !== null);

    markers.current.forEach((markerObj) => {
      if (markerObj && markerObj.marker) {
        markerObj.marker.remove();
      }
    });
    markers.current = [];
    filteredMarkers.forEach((markerObj) => {
      markerObj.marker.addTo(mapRef.current);
      markers.current.push(markerObj);
    });

    console.log("Filtered markers added:", filteredMarkers);
  };

  return (
    <div className="fixed top-4 left-4 bg-white w-[350px] h-auto shadow-lg p-4 z-10 rounded-md">
      <Search handleDetails={handleDetails} handleSearch={handleSearch} />

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

          <Filter onFilter={handleFilter} />

          <Dropdown
            markers={markers}
            mapRef={mapRef}
            showPopup={showPopup}
            formData={formData}
          />

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

            {isOpen && <ChangeMap onStyleChange={onStyleChange} />}
          </div>
        </div>
      )}
    </div>
  );
};

export default Card;
