import React, { useEffect, useContext, useRef } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import Card from "./Card";
import axios from "axios";
import PopUpSave from "./PopUpSave";
import MapContext from "../context/MapContext";

const Map = () => {
  const markers = useRef([]);
  const {
    mapStyle,
    setApiLocations,
    setGreenSpaces,
    isEditing,
    lastMarker,
    mapContainerRef,
    searchResult,
    mapRef,
    location,
    setFormData,
    setEditingMarker,
    setIsEditing,
  } = useContext(MapContext);

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
          source: "openmaptiles",
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
  }, [mapStyle]);

  // DATA FETCH GET
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const [response1, response2] = await Promise.all([
          axios.get("http://127.0.0.1:8000/GetAllParkData/"),
          axios.get("http://127.0.0.1:8000/GetAllGreenFields/"),
        ]);

        setApiLocations(response1.data);
        setGreenSpaces(response2.data);
        console.log("response çalışıyor");
      } catch (error) {
        console.error("Error fetching API data:", error);
      }
    };

    fetchLocations();
  }, []);

  // edit onclicki için global metod, burda formdatadan gelen değişkenler setformdata ile değiştirilebilir hale gelip düzenleme modunu etkinleştirir.
  window.handleEditClick = (
    _id,
    name,
    description,
    type,
    type_desc,
    kapasite,
    saat,
    county,
    longitude,
    latitude
  ) => {
    console.log("_id:", _id); //
    const marker = markers.current.find(
      (m) =>
        m.marker.getLngLat().toArray().join(",") ===
        [longitude, latitude].join(",")
    );

    if (marker) {
      setFormData({
        _id,
        name,
        description,
        longitude,
        latitude,
        type,
        saat,
        kapasite,
        county,
        type_desc,
        fieldType: "ispark",
      });
      setEditingMarker(marker.marker); // Burada doğrudan marker'ı ayarlıyoruz
      setIsEditing(true);
    }
  };

  window.handleEditClickGreen = (
    _id,
    name,
    description,
    ilce,
    koordinat,
    longitude,
    latitude
  ) => {
    console.log("_id:", _id); //
    const marker = markers.current.find(
      (m) =>
        m.marker.getLngLat().toArray().join(",") ===
        [longitude, latitude].join(",")
    );

    if (marker) {
      setFormData({
        _id,
        name,
        description,
        longitude,
        latitude,
        koordinat,
        ilce,
        fieldType: "greenSpaces",
      });
      setEditingMarker(marker.marker);
      setIsEditing(true);
    }
  };

  //current hatası yediğimiz için bunu search componentine yerleştiremiyoruz, lastmarker, mapref refinden kaynaklı olabilir, refleri prop olarak geçmeyi dene
  useEffect(() => {
    if (searchResult && mapRef.current) {
      markers.current.forEach((markerObj) => {
        if (markerObj && markerObj.marker) {
          markerObj.marker.remove();
        }
      });
      markers.current = [];
      // Eğer önceden eklenen bir marker varsa, onu da kaldır
      if (lastMarker.current) {
        lastMarker.current.remove();
        lastMarker.current = null;
      }

      mapRef.current.flyTo({ center: searchResult, zoom: 14 });
      const newMarker = new maplibregl.Marker()
        .setLngLat(searchResult)
        .addTo(mapRef.current);
      markers.current.push({ marker: newMarker, type: "searchResult" });
      lastMarker.current = newMarker;
    }
  }, [searchResult]);

  // Kullanıcı konum bilgisi geldiğinde marker ekleme işlemi
  useEffect(() => {
    if (location && mapRef.current) {
      const { lat, lng } = location;
      markers.current.forEach((markerObj) => {
        if (markerObj && markerObj.marker) {
          markerObj.marker.remove();
        }
      });
      markers.current = [];

      const newMarker = new maplibregl.Marker()
        .setLngLat([lng, lat])
        .addTo(mapRef.current);
      markers.current.push({ marker: newMarker, type: "geolocation" });
      mapRef.current.flyTo({ center: [lng, lat], zoom: 14 });
      lastMarker.current = newMarker;
    }
  }, [location]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const centerLat = params.get("lat");
    const centerLng = params.get("lng");
    const zoom = params.get("zoom");
    if (centerLat && centerLng && zoom) {
      mapRef.current.setCenter([parseFloat(centerLng), parseFloat(centerLat)]);
      mapRef.current.setZoom(parseFloat(zoom));
    }
  }, []);

  const handleMapMove = () => {
    const { lng, lat } = mapRef.current.getCenter();
    const zoom = mapRef.current.getZoom();
    const url = new URL(window.location.href);
    url.searchParams.set("lat", lat);
    url.searchParams.set("lng", lng);
    url.searchParams.set("zoom", zoom);
    window.history.replaceState(null, "", url);
  };

  useEffect(() => {
    mapRef.current.on("moveend", handleMapMove);
    return () => {
      mapRef.current.off("moveend", handleMapMove);
    };
  }, []);

  return (
    <div className="relative h-screen w-full">
      <div ref={mapContainerRef} className="w-full h-full" />
      <Card markers={markers} mapRef={mapRef} />
      {isEditing && <PopUpSave markers={markers} />}
    </div>
  );
};

export default Map;
