import React, { useContext } from "react";
import MapContext from "../context/MapContext";

const ClusterButton = ({onShowMarkers}) => {
  const { activeMarkerType, setActiveMarkerType } = useContext(MapContext);

  const handleButtonClick = (type) => {
    if (activeMarkerType === type) {
      setActiveMarkerType(null);
      onShowMarkers(null);
    } else {
      setActiveMarkerType(type);
      onShowMarkers(type);
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
