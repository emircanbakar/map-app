import React, { useEffect, useContext } from "react";
import maplibregl from "maplibre-gl";
import axios from "axios";
import MapContext from "../context/MapContext";

const Filter = ({ markers }) => {
  const {
    parkTypes,
    setParkTypes,
    distinctParkTypes,
    setDistinctParkTypes,
    selectedType,
    setSelectedType,
    apiLocations,
    mapRef,
  } = useContext(MapContext);

  const onFilter = (typeId) => {
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
        // edit butonu sonucu popup oluşmuyor??
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

  // API'den gelen park verilerini filtrelemek için özel hook
  useEffect(() => {
    const uniqueTypes = Array.from(
      new Set(parkTypes.map((type) => type.PARK_TYPE_ID))
    );
    setDistinctParkTypes(uniqueTypes);
  }, [parkTypes]);

  useEffect(() => {
    const fetchParkTypes = async () => {
      try {
        const response = await axios.get(
          "http://127.0.0.1:8000/GetAllParkData/"
        );
        const data = response.data;
        if (Array.isArray(data)) {
          setParkTypes(data);
        } else {
          console.error("Expected an array of park types but got:", data);
        }
      } catch (error) {
        console.error("Error fetching park types:", error);
      }
    };

    fetchParkTypes();
  }, []);

  const handleChange = (event) => {
    const newType = event.target.value;
    setSelectedType(newType);
  };

  const handleFilter = () => {
    onFilter(selectedType);
  };

  const handleClearFilter = () => {
    setSelectedType("");
    onFilter("");
  };

  return (
    <div>
      <p className="mt-2">Otopark Çeşitleri</p>
      <div className="relative flex justify-between text-left">
        <select
          key={undefined}
          value={selectedType}
          onChange={handleChange}
          className="block w-full my-2 p-2 text-gray-700 border border-gray-300 rounded-md shadow-sm focus:border-blue-500 transition-all"
        >
          <option value={undefined} key={undefined}>
            Select Park Type
          </option>
          {distinctParkTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>

        <div className="flex">
          <button
            className="m-2 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-all"
            onClick={handleFilter}
          >
            Filtrele
          </button>

          <button
            className="my-2 bg-red-500 text-white px-4 rounded-md hover:bg-red-600 transition-all"
            onClick={handleClearFilter}
          >
            X
          </button>
        </div>
      </div>
    </div>
  );
};

export default Filter;
