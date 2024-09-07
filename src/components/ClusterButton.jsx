import React, { useContext } from "react";
import MapContext from "../context/MapContext";
import maplibregl from "maplibre-gl";

const ClusterButton = ({ markers }) => {
  const {
    activeMarkerType,
    setActiveMarkerType,
    apiLocations,
    mapRef,
    greenSpaces,
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

  const onShowMarkers = (type) => {
    //markerleri temizleme
    markers.current.forEach((markerObj) => {
      if (markerObj && markerObj.marker) {
        markerObj.marker.remove();
      }
    });
    markers.current = [];
    // eğer bir marker butonu açıksa üstüne tıklandığında tekrar kapatır (ispark ve yeşil alan butonu)
    if (activeMarkerType === type) {
      setActiveMarkerType(null);
    } else {
      setActiveMarkerType(type);
      //apiloctan gelen long lat bilgileri geçerli mi kontrol edilip geçerliyse bir div olarak marker oluşturur
      if (type === "ispark") {
        apiLocations.forEach((location) => {
          if (location.LONGITUDE && location.LATITUDE) {
            const longitude = parseFloat(location.LONGITUDE);
            const latitude = parseFloat(location.LATITUDE);

            if (!isNaN(longitude) && !isNaN(latitude)) {
              const el = document.createElement("div");
              el.className = "ibb-marker";

              const marker = new maplibregl.Marker(el)
                .setLngLat([longitude, latitude])
                .addTo(mapRef.current);
              //popup eklenir
              const popup = new maplibregl.Popup({ offset: 25 }).setHTML(`
                <p>${location._id}</p>
                <p>Otopark</p>
                <strong>${location.PARK_NAME || "Unknown"}</strong><br/>
                ${location.LOCATION_NAME || "Unknown"}<br/>
                ${location.PARK_TYPE_ID || "Unknown"}<br/>
                ${location.CAPACITY_OF_PARK || "Unknown"}<br/>
                ${location.WORKING_TIME || "Unknown"}<br/>
                ${location.COUNTY_NAME || "Unknown"}<br/>
                <button onclick="handleEditClick(
                '${location._id || ""}',
                '${location.PARK_NAME || ""}', 
                '${location.LOCATION_NAME || ""}', 
                '${location.PARK_TYPE_ID || ""}', 
                '${location.PARK_TYPE_DESC || ""}', 
                '${location.CAPACITY_OF_PARK || ""}', 
                '${location.WORKING_TIME || ""}', 
                '${location.COUNTY_NAME || ""}', 
                '${longitude}', 
                '${latitude}',
                )" class="mt-2 px-4 py-2 bg-blue-400 text-white rounded hover:bg-blue-600">Edit</button>
              `);

              marker.setPopup(popup);
              markers.current.push({ marker, type: "ispark" });
            }
          }
        });
      } else if (type === "greenSpaces") {
        greenSpaces.forEach((space) => {
          const coordinates = space["KOORDINAT"];
          if (coordinates) {
            const [latitude, longitude] = coordinates
              .split(",")
              .map((coord) => parseFloat(coord.trim()));

            if (!isNaN(longitude) && !isNaN(latitude)) {
              const el = document.createElement("div");
              el.className = "green-marker";

              const marker = new maplibregl.Marker(el)
                .setLngLat([longitude, latitude])
                .addTo(mapRef.current);

              const popup = new maplibregl.Popup({ offset: 25 }).setHTML(`
                <p> ${space._id} </p>
                <p>Park veya Yeşil Alan</p>
                <strong>${space.MAHAL_ADI || "Unknown"}</strong><br/>
                ${space.TUR || "Unknown"}<br/>
                ${space.ILCE} <br/>
                <button onclick="handleEditClickGreen(
                '${space._id}', 
                '${space.MAHAL_ADI || ""}', 
                '${space.TUR || ""}', 
                '${space.ILCE}',
                '${space.KOORDINAT}',
                '${longitude}',
                '${latitude}'
                )" class="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-green-600">Edit</button>
              `);

              marker.setPopup(popup);
              markers.current.push({ marker, type: "greenSpaces" });
            }
          }
        });
      }
    }
  };

  return (
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
  );
};

export default ClusterButton;
