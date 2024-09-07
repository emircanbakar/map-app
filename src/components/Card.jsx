import React, { useContext } from "react";
import MapContext from "../context/MapContext";
import Dropdown from "./Dropdown";
import Filter from "./Filter";
import Search from "./Search";
import ClusterButton from "./ClusterButton";
import MapStyleDropdown from "./MapStyleDropdown";

const Card = ({ onShowMarkers, markers, setLocation}) => {
  const { details } = useContext(MapContext);

  return (
    <div className="fixed top-4 left-4 bg-white w-[350px] h-auto shadow-lg p-4 z-10 rounded-md">
      <Search markers={markers} />
      {details && (
        <div className="mt-4 transition-all">
          <ClusterButton onShowMarkers={onShowMarkers} />
          <Filter markers={markers} />
          <Dropdown markers={markers} />
          <MapStyleDropdown setLocation={setLocation} />
        </div>
      )}
    </div>
  );
};

export default Card;
