import React, { createContext, useState,  } from "react";

const MapContext = createContext();

export const MapProvider = ({ children }) => {
  const [mapStyle, setMapStyle] = useState(
    "https://api.maptiler.com/maps/streets/style.json?key=9HThlwugrS3kGNIjxi5r"
  );
  const [searchResult, setSearchResult] = useState(null);
  const [apiLocations, setApiLocations] = useState([]);
  const [greenSpaces, setGreenSpaces] = useState([]);
  const [details, setDetails] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeMarkerType, setActiveMarkerType] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editingMarker, setEditingMarker] = useState(null);
  const [selectedParking, setSelectedParking] = useState(null);
  const [selectedGreenSpace, setSelectedGreenSpace] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    type: "",
    _id: "",
  });

  return (
    <MapContext.Provider
      value={{
        mapStyle,
        setMapStyle,
        searchResult,
        setSearchResult,
        apiLocations,
        setApiLocations,
        greenSpaces,
        setGreenSpaces,
        activeMarkerType,
        setActiveMarkerType,
        isEditing,
        setIsEditing,
        editingMarker,
        setEditingMarker,
        formData,
        setFormData,
        details, 
        setDetails,
        isOpen,
        setIsOpen,
        searchQuery,
        setSearchQuery,
        selectedParking,
        setSelectedParking,
        selectedGreenSpace,
        setSelectedGreenSpace,
        markers,
        setMarkers,
      }}
    >
      {children}
    </MapContext.Provider>
  );
};

export default MapContext;
