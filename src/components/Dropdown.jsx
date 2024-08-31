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

  const addMarkerToLocation = (longitude, latitude) => {

    // Mevcut markerları temizle
    markers.current.forEach((marker) => marker.remove());
    markers.current = [];

    // Yeni marker oluştur
    const newMarker = new maplibregl.Marker()
      .setLngLat([longitude, latitude])
      .addTo(mapRef.current);

    // Marker'ı diziye ekle
    markers.current.push(newMarker);
    showPopup(
      formData.name,
      formData.description,
      formData.type,
      longitude,
      latitude
    );
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
        showPopup(location.PARK_NAME, location.LOCATION_NAME, 'ispark', longitude, latitude); // Popup'ı göster
      }
    }
  };
  
  const handleFlyToGreenSpace = () => {
    if (selectedGreenSpace) {
      const space = greenSpaces.find(
        (sp) => sp["MAHAL ADI"] === selectedGreenSpace
      );
      if (space) {
        const coordinates = space["KOORDINAT\n(Yatay , Dikey)"];
        if (coordinates) {
          const [latitude, longitude] = coordinates
            .split(",")
            .map((coord) => parseFloat(coord.trim()));
          
          handleFlyToLocation(longitude, latitude);
          showPopup(space["MAHAL ADI"], space.TUR, 'greenSpaces', longitude, latitude); // Popup'ı göster
        }
      }
    }
  };

  const handleFlyToLocation = (longitude, latitude) => {
    if (mapRef.current) {
      mapRef.current.flyTo({ center: [longitude, latitude], zoom: 18 });
      addMarkerToLocation(longitude, latitude); 
    }
  };

  return (
    <div>
      <div className="m-4 bg-white p-4 rounded-lg border-2 border-gray-300 z-10">
        <div className="mb-4">
          <label htmlFor="isparkDropdown" className="mr-2">
            İspark Otoparkları:
          </label>
          <select
            id="isparkDropdown"
            value={selectedParking}
            onChange={(e) => setSelectedParking(e.target.value)}
            className="w-full border border-gray-300 rounded p-2 my-2"
          >
            <option value="">Seçiniz</option>
            {apiLocations.map((loc) => (
              <option key={loc.PARK_NAME} value={loc.PARK_NAME}>
                {loc.PARK_NAME}
              </option>
            ))}
          </select>
          <button
            onClick={handleFlyToParking}
            className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-all"
          >
            Git
          </button>
        </div>
        <div>
          <label htmlFor="greenSpacesDropdown" className="mr-2">
            Yeşil Alanlar:
          </label>
          <select
            id="greenSpacesDropdown"
            value={selectedGreenSpace}
            onChange={(e) => setSelectedGreenSpace(e.target.value)}
            className="w-full border border-gray-300 rounded p-2 my-2"
          >
            <option value="">Seçiniz</option>
            {greenSpaces.map((space) => (
              <option key={space["MAHAL ADI"]} value={space["MAHAL ADI"]}>
                {space["MAHAL ADI"]}
              </option>
            ))}
          </select>
          <button
            onClick={handleFlyToGreenSpace}
            className="px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition-all"
          >
            Git
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dropdown;
