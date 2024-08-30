import React, { useRef, useEffect, useState } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import Card from "./Card";
import axios from "axios";
import PopUpSave from "./PopUpSave";

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

  const [isEditing, setIsEditing] = useState(false);
  const [editingMarker, setEditingMarker] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    type: "",
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
                ${location.LOCATION_NAME || "Unknown"}</br>
                <button onclick="handleEditClick('${location.PARK_NAME}', '${
                location.LOCATION_NAME
              }', 'ispark', ${longitude}, ${latitude})" class="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Edit</button>
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
                ${space.TUR || "Unknown"}</br>
                <button onclick="handleEditClick('${space["MAHAL ADI"]}', '${
                space.TUR
              }', 'greenSpaces', ${longitude}, ${latitude})" class="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Edit</button>
              `);

              marker.setPopup(popup);
              markers.current.push(marker);
            }
          }
        });
      }
    }
  };

  window.handleEditClick = (name, description, type, longitude, latitude) => {
    setFormData({ name, description, longitude, latitude, type });
    setEditingMarker({ name, description, type, longitude, latitude });
    setIsEditing(true);
  };

  const upsertIsparkData = async (data) => {
    try {
      const response = await axios.post(
        "https://data.ibb.gov.tr/api/3/action/datastore_upsert",
        data,
        {
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "https://data.ibb.gov.tr/api/3/action/datastore_upsert",
            "Access-Control-Allow-Methods":
              "GET, POST, PATCH, PUT, DELETE, OPTIONS",
            "Access-Control-Allow-Headers":
              "Origin, Content-Type, X-Auth-Token",
            " Access-Control-Max-Age": 86400,
          },
        }
      );
      return response.data.success;
    } catch (error) {
      console.error("Error updating İspark data:", error);
      return false;
    }
  };

  const upsertGreenSpacesData = async (data) => {
    try {
      const response = await axios.post(
        "https://data.ibb.gov.tr/api/3/action/datastore_upsert",
        data,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return response.data.success;
    } catch (error) {
      console.error("Error updating Green Spaces data:", error);
      return false;
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (editingMarker) {
      let isparkSuccess = false;
      let greenSpacesSuccess = false;

      if (formData.type === "ispark") {
        const dataForIspark = {
          resource_id: "f4f56e58-5210-4f17-b852-effe356a890c",
          records: [
            {
              PARK_NAME: formData.name || "",
              LOCATION_NAME: formData.description || "",
            },
          ],
        };
        isparkSuccess = await upsertIsparkData(dataForIspark);
      }

      if (formData.type === "greenSpaces") {
        const dataForGreenSpaces = {
          resource_id: "d588f256-2982-43d2-b372-c38978d7200b",
          records: [
            {
              MAHAL_ADI: formData.name || "",
              TUR: formData.description || "",
            },
          ],
        };
        greenSpacesSuccess = await upsertGreenSpacesData(dataForGreenSpaces);
      }

      if (isparkSuccess || greenSpacesSuccess) {
        console.log("Data updated successfully");

        const updatedPopupHTML = `
          <p>Düzenlenmiş Konum</p>
          <strong>${formData.name || "No Name"}</strong><br/>
          ${formData.description || "No Description"}</br>
          <button onclick="handleEditClick('${formData.name || ""}', '${
          formData.description || ""
        }', '${formData.type || ""}', ${formData.longitude || 0}, ${
          formData.latitude || 0
        })" class="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Edit</button>
        `;
        editingMarker.setPopup(
          new maplibregl.Popup({ offset: 25 }).setHTML(updatedPopupHTML)
        );
        setIsEditing(false);
      } else {
        console.error("Failed to update data in one or both APIs");
      }
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
        <PopUpSave
          formData={formData}
          setFormData={setFormData}
          setIsEditing={setIsEditing}
          handleFormSubmit={handleFormSubmit}
        />
      )}
    </div>
  );
};

export default Map;
