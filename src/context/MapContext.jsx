import React, { createContext, useState, useRef, useEffect } from "react";
import axios from "axios";

const MapContext = createContext();

export const MapProvider = ({ children }) => {
  const lastMarker = useRef(null);
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const [mapStyle, setMapStyle] = useState("https://api.maptiler.com/maps/streets/style.json?key=9HThlwugrS3kGNIjxi5r");
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
  const [location, setLocation] = useState(null);
  const [parkData, setParkData] = useState([]);
  const [greenFieldData, setGreenFieldData] = useState([]);
  const [activePanel, setActivePanel] = useState(null);
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

  const fetchLocations = async () => {
    try {
      const [response1, response2] = await Promise.all([
        axios.get("http://127.0.0.1:8000/GetAllParkData/"),
        axios.get("http://127.0.0.1:8000/GetAllGreenFields/"),
      ]);

      setApiLocations(response1.data);
      setGreenSpaces(response2.data);
      console.log("API verileri alındı.");
    } catch (error) {
      console.error("API verilerini alırken hata oluştu:", error);
    }
  };

  useEffect(() => {
    fetchLocations();
  }, []);

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
        location,
        setLocation,
        parkData,
        setParkData,
        activePanel,
        setActivePanel,
        greenFieldData,
        setGreenFieldData,
        fetchLocations,
      }}
    >
      {children}
    </MapContext.Provider>
  );
};

export default MapContext;
