import React, { useRef, useEffect, useState } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import Card from "./Card";
import axios from "axios";

const Map = () => {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const [mapStyle, setMapStyle] = useState(
    "https://api.maptiler.com/maps/streets/style.json?key=9HThlwugrS3kGNIjxi5r"
  );
  const [searchResult, setSearchResult] = useState(null);
  const [apiLocations, setApiLocations] = useState([]);
  const [greenSpaces, setGreenSpaces] = useState([]);
  const [activeMarkerType, setActiveMarkerType] = useState(null);
  const markers = useRef([]);

  // Edit modunu ve düzenlenen marker bilgilerini takip etmek için yeni state'ler
  const [isEditing, setIsEditing] = useState(false);
  const [editingMarker, setEditingMarker] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  const handleStyleChange = (styleUrl) => {
    setMapStyle(styleUrl);
  };

  const searchLocation = async (query) => {
    try {
      const response = await axios.get(
        `https://api.maptiler.com/geocoding/${encodeURIComponent(
          query
        )}.json?key=9HThlwugrS3kGNIjxi5r`
      );
      const coordinates = response.data.features[0].geometry.coordinates;
      setSearchResult(coordinates);
    } catch (error) {
      console.error("Error fetching geocoding data:", error);
    }
  };

  const toggleMarkers = (type) => {
    if (activeMarkerType === type) {
      markers.current.forEach((marker) => marker.remove());
      markers.current = [];
      setActiveMarkerType(null);
    } else {
      markers.current.forEach((marker) => marker.remove());
      markers.current = [];
      setActiveMarkerType(type);

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

              const popup = new maplibregl.Popup({ offset: 25 }).setHTML(`
                <p>Otopark</p>
                <strong>${location.PARK_NAME || "Unknown"}</strong><br/>
                ${location.LOCATION_NAME || "Unknown"}</br>${
                location.PARK_TYPE_ID || "Unknown"
              }
                </br>${location.CAPACITY_OF_PARK || "Unknown"}</br>${
                location.COUNTY_NAME || "Unknown"
              }</br>
                <button onclick="handleEditClick('${location.PARK_NAME}', '${
                location.LOCATION_NAME
              }')" class="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Edit</button>
              `);

              marker.setPopup(popup);
              markers.current.push(marker);
            }
          }
        });
      } else if (type === "greenSpaces") {
        greenSpaces.forEach((space) => {
          const coordinates = space["KOORDINAT\n(Yatay , Dikey)"];
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
                <p>Park veya Yeşil Alan</p>
                <strong>${space["MAHAL ADI"] || "Unknown"}</strong><br/>
                ${space.TUR || "Unknown"}</br>${space.ILCE || "Unknown"}
                <button onclick="handleEditClick('${space["MAHAL ADI"]}', '${
                space.TUR
              }')" class="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Edit</button>
              `);

              marker.setPopup(popup);
              markers.current.push(marker);
            }
          }
        });
      }
    }
  };

  window.handleEditClick = (name, description) => {
    setFormData({ name, description });
    setIsEditing(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();

    if (editingMarker) {
      const updatedPopupHTML = `
        <p>Düzenlenmiş Konum</p>
        <strong>${formData.name}</strong><br/>
        ${formData.description}
        <button onclick="handleEditClick('${formData.name}', '${formData.description}')">Edit</button>
      `;
      editingMarker.setPopup(
        new maplibregl.Popup({ offset: 25 }).setHTML(updatedPopupHTML)
      );
      setIsEditing(false);
    }
  };

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response1 = await axios.get(
          "https://data.ibb.gov.tr/api/3/action/datastore_search?resource_id=f4f56e58-5210-4f17-b852-effe356a890c"
        );
        setApiLocations(response1.data.result.records);

        const response2 = await axios.get(
          "https://data.ibb.gov.tr/api/3/action/datastore_search?resource_id=d588f256-2982-43d2-b372-c38978d7200b"
        );
        setGreenSpaces(response2.data.result.records);
      } catch (error) {
        console.error("Error fetching API data:", error);
      }
    };

    fetchLocations();
  }, []);

  useEffect(() => {
    if (!mapRef.current) {
      mapRef.current = new maplibregl.Map({
        container: mapContainerRef.current,
        style: mapStyle,
        center: [29.0784, 41.0882],
        zoom: 10,
        maxBounds: [
          [26.0, 36.0],
          [45.0, 42.0],
        ],
      });

      mapRef.current.on("load", () => {
        mapRef.current.addLayer({
          id: "3d-buildings",
          source: "composite",
          "source-layer": "building",
          filter: ["==", "extrude", "true"],
          type: "fill-extrusion",
          minzoom: 15,
          paint: {
            "fill-extrusion-height": [
              "interpolate",
              ["linear"],
              ["zoom"],
              15,
              0,
              15.05,
              ["get", "height"],
            ],
            "fill-extrusion-base": [
              "interpolate",
              ["linear"],
              ["zoom"],
              15,
              0,
              15.05,
              ["get", "min_height"],
            ],
            "fill-extrusion-opacity": 0.4,
          },
        });
      });

      mapRef.current.dragRotate.enable();
      mapRef.current.on("contextmenu", () => {
        mapRef.current.dragRotate.disable();
        mapRef.current.dragRotate.enable({ mouseButton: "right" });
      });
    } else {
      mapRef.current.setStyle(mapStyle);
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [mapStyle]);

  useEffect(() => {
    if (searchResult && mapRef.current) {
      markers.current.forEach((marker) => marker.remove());
      markers.current = [];

      mapRef.current.flyTo({ center: searchResult, zoom: 14 });
      const newMarker = new maplibregl.Marker()
        .setLngLat(searchResult)
        .addTo(mapRef.current);
      markers.current.push(newMarker);
    }
  }, [searchResult]);

  return (
    <div style={{ position: "relative", width: "100%", height: "100vh" }}>
      <div ref={mapContainerRef} style={{ width: "100%", height: "100%" }} />

      <Card
        onStyleChange={handleStyleChange}
        searchLocation={searchLocation}
        onShowMarkers={toggleMarkers}
      />

      {isEditing && (
        <div
          style={{
            position: "absolute",
            top: "10%",
            left: "50%",
            transform: "translateX(-50%)",
            padding: "1em",
            backgroundColor: "white",
            borderRadius: "8px",
            boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
          }}
        >
          <form onSubmit={handleFormSubmit}>
            <div>
              <label>
                Name:
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                />
              </label>
            </div>
            <div>
              <label>
                Description:
                <input
                  type="text"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                />
              </label>
            </div>
            <button type="submit" class="m-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Save</button>
            <button type="button" class="m-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600" onClick={() => setIsEditing(false)}>
              Cancel
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Map;
