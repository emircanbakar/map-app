import React, { useContext } from "react";
import MapContext from "../context/MapContext";
import Dropdown from "./Dropdown";
import maplibregl from "maplibre-gl";
import Filter from "./Filter";
import Search from "./Search";
import ClusterButton from "./ClusterButton";
import MapStyleDropdown from "./MapStyleDropdown";

const Card = ({ onShowMarkers, markers, showPopup, setLocation }) => {
  const { details, apiLocations, mapRef } = useContext(MapContext);

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
      <Search markers={markers} />
      {details && (
        <div className="mt-4 transition-all">
          <ClusterButton onShowMarkers={onShowMarkers} />
          <Filter onFilter={handleFilter} />
          <Dropdown markers={markers} />
          <MapStyleDropdown setLocation={setLocation} />
        </div>
      )}
    </div>
  );
};

export default Card;
