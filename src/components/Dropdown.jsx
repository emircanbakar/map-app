import React, { useContext } from "react";
import MapContext from "../context/MapContext";
import maplibregl from "maplibre-gl";

const Dropdown = ({ mapRef, markers, showPopup, formData }) => {
  const {
    selectedParking,
    selectedGreenSpace,
    apiLocations,
    greenSpaces,
    setSelectedGreenSpace,
    setSelectedParking,
  } = useContext(MapContext);

  const addParkingMarker = (longitude, latitude, name, description, parkTypeId, capacity, workingTime, county) => {
    // Mevcut markerları temizle
    markers.current.forEach((markerObj) => {
      if (markerObj && markerObj.marker) {
        markerObj.marker.remove();
      }
    });
    markers.current = []; // Marker dizisini temizle

    // Yeni marker oluştur
    const newMarker = new maplibregl.Marker()
      .setLngLat([longitude, latitude])
      .addTo(mapRef.current);

    // Yeni popup oluştur ve marker'e ekle
    const popup = new maplibregl.Popup({ offset: 25 })
      .setHTML(
        `<h3>${name}</h3>
         <p>${description}</p>
         <p>Park Type ID: ${parkTypeId}</p>
         <p>Capacity: ${capacity}</p>
         <p>Working Time: ${workingTime}</p>
         <p>County: ${county}</p>`
      )
      .setLngLat([longitude, latitude])
      .addTo(mapRef.current);

    newMarker.setPopup(popup).togglePopup();

    // Marker'ı diziye ekle
    markers.current.push({ marker: newMarker, type: "custom" });
  };

  const addGreenSpaceMarker = (longitude, latitude, name, type, ilce) => {
    // Mevcut markerları temizle
    markers.current.forEach((markerObj) => {
      if (markerObj && markerObj.marker) {
        markerObj.marker.remove();
      }
    });
    markers.current = []; // Marker dizisini temizle

    // Yeni marker oluştur
    const newMarker = new maplibregl.Marker()
      .setLngLat([longitude, latitude])
      .addTo(mapRef.current);

    // Yeni popup oluştur ve marker'e ekle
    const popup = new maplibregl.Popup({ offset: 25 })
      .setHTML(
        `<h3>${name}</h3>
         <p>Tür: ${type}</p>
         <p>ilçe: ${ilce}</p>`
      )
      .setLngLat([longitude, latitude])
      .addTo(mapRef.current);

    newMarker.setPopup(popup).togglePopup();

    // Marker'ı diziye ekle
    markers.current.push({ marker: newMarker, type: "custom" });
  };

  const handleFlyToParking = () => {
    if (selectedParking) {
      const location = apiLocations.find(
        (loc) => loc.PARK_NAME === selectedParking
      );
      if (location && location.LONGITUDE && location.LATITUDE) {
        const longitude = parseFloat(location.LONGITUDE);
        const latitude = parseFloat(location.LATITUDE);

        handleFlyToLocation(longitude, latitude);
        addParkingMarker(
          longitude,
          latitude,
          location.PARK_NAME,
          location.LOCATION_NAME,
          location.PARK_TYPE_ID,
          location.CAPACITY_OF_PARK,
          location.WORKING_TIME,
          location.COUNTY_NAME
        );
      }
    }
  };

  const handleFlyToGreenSpace = () => {
    if (selectedGreenSpace) {
      const space = greenSpaces.find(
        (sp) => sp.MAHAL_ADI === selectedGreenSpace
      );
      if (space) {
        const coordinates = space["KOORDINAT"];
        if (coordinates) {
          const [latitude, longitude] = coordinates
            .split(",")
            .map((coord) => parseFloat(coord.trim()));

          handleFlyToLocation(longitude, latitude);
          addGreenSpaceMarker(
            longitude,
            latitude,
            space.MAHAL_ADI,
            space.TUR,
            space.ILCE
          );
        }
      }
    }
  };

  const handleFlyToLocation = (longitude, latitude) => {
    if (mapRef.current) {
      mapRef.current.flyTo({ center: [longitude, latitude], zoom: 18 });
    }
  };

  return (
    <div>
      <div className="my-4 bg-white p-4 rounded-lg border-2 border-gray-300 z-10">
        <div className="mb-4">
          <label className="mr-2">İspark Otoparkları:</label>
          <div className="flex justify-between">
            <select
              id="isparkDropdown"
              value={selectedParking}
              onChange={(e) => setSelectedParking(e.target.value)}
              className="w-full border border-gray-300 rounded p-2 my-2"
            >
              <option value={""} key={""}>
                Seçiniz
              </option>
              {apiLocations.map((loc) => (
                <option key={loc.PARK_NAME} value={loc.PARK_NAME}>
                  {loc.PARK_NAME}
                </option>
              ))}
            </select>
            <button
              onClick={handleFlyToParking}
              className="m-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600 transition-all"
            >
              Git
            </button>
          </div>
        </div>
        <div>
          <label className="mr-2">Yeşil Alanlar:</label>
          <div className="flex justify-between">
            <select
              id="greenSpacesDropdown"
              value={selectedGreenSpace}
              onChange={(e) => setSelectedGreenSpace(e.target.value)}
              className="w-full border border-gray-300 rounded p-2 my-2"
            >
              <option value={""} key={""}>
                Seçiniz
              </option>
              {greenSpaces.map((space) => (
                <option key={space.MAHAL_ADI} value={space.MAHAL_ADI}>
                  {space.MAHAL_ADI}
                </option>
              ))}
            </select>
            <button
              onClick={handleFlyToGreenSpace}
              className="m-2 px-4 bg-green-500 text-white rounded hover:bg-green-600 transition-all"
            >
              Git
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dropdown;
