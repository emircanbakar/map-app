import React, { createContext, useState, useRef } from "react";

const MapContext = createContext();

export const MapProvider = ({ children }) => {
  const lastMarker = useRef(null);
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);

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
  const [parkTypes, setParkTypes] = useState([]);
  const [distinctParkTypes, setDistinctParkTypes] = useState([]);
  const [selectedType, setSelectedType] = useState("");
  const [locationUser, setLocationUser] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    type: "",
    _id: "",
    longitude: "",
    latitude: "",
    ilce: "",
    koordinat: "",
    saat: "",
    kapasite: "",
    county: "",
    type_desc: "",
    fieldType: "",
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
        parkTypes,
        setParkTypes,
        distinctParkTypes,
        setDistinctParkTypes,
        selectedType,
        setSelectedType,
        locationUser,
        setLocationUser,
        lastMarker,
        mapContainerRef,
        mapRef,
      }}
    >
      {children}
    </MapContext.Provider>
  );
};

export default MapContext;
