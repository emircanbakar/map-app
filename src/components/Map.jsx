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
  const markers = useRef([]); //markeri ref ile depoladım
  const handleStyleChange = (styleUrl) => {
    setMapStyle(styleUrl);
  };

  //search butonunun maptiler geocoding ile adres araması yapabilmesi
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
      // buraya toast ile bir uyarı popup gelebilir.
      console.error("Error fetching geocoding data:", error);
    }
  };

  useEffect(() => {
    //harita oluşturma
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
      // 3d oluşturma kısmı fill extrusion
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
      // marker birden fazla konumda kalmasın diye öncekisini siliyorum
      markers.current.forEach((marker) => marker.remove());
      markers.current = [];
      //aratılan konuma gidiş
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
      <Card onStyleChange={handleStyleChange} searchLocation={searchLocation} />
    </div>
  );
};

export default Map;
