import React, { useEffect, useContext, useRef } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import Card from "./Card";
import axios from "axios";
import PopUpSave from "./PopUpSave";
import MapContext from "../context/MapContext";

const Map = ({ location, setLocation }) => {
  const markers = useRef([]);
  const {
    mapStyle,
    setMapStyle,
    apiLocations,
    setApiLocations,
    greenSpaces,
    setGreenSpaces,
    setActiveMarkerType,
    isEditing,
    setIsEditing,
    editingMarker,
    setEditingMarker,
    formData,
    setFormData,
    lastMarker,
    activeMarkerType,
    mapRef,
    mapContainerRef,
    searchResult,
  } = useContext(MapContext);

  //harita görünümü değiştirme
  const handleStyleChange = (styleUrl) => {
    setMapStyle(styleUrl);
  };

  //haritayı oluşturma ve 3d hale getirme, sağ tık ile döndürme, harita görünmü değişimi ve bu değişim sonrası temizleme işlemi
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

    // stil değiştiğinde markerleri siler
    // return () => {
    //   if (mapRef.current) {
    //     mapRef.current.remove();
    //     mapRef.current = null;
    //   }
    // };
  }, [mapStyle]);

  //ibbden datayı çekme
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        // const response1 = await axios.get(
        //   "https://data.ibb.gov.tr/api/3/action/datastore_search?resource_id=f4f56e58-5210-4f17-b852-effe356a890c"
        // );
        const response1 = await axios.get(
          "http://127.0.0.1:8000/GetAllParkData/"
        );
        setApiLocations(response1.data);
        // tekli istek yapısı
        const response2 = await axios.get(
          "http://127.0.0.1:8000/GetAllGreenFields/"
        );
        setGreenSpaces(response2.data);
      } catch (error) {
        console.error("Error fetching API data:", error);
      }
    };

    fetchLocations();
  }, []);

  useEffect(() => {
    // Arama işlemi yapıldıktan sonra, önceki marker varsa kaldırılır ve yeni bulunan konuma marker eklenir
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

      // Yeni markerı kaydet
      markers.current.push({ marker: newMarker, type: "searchResult" });

      lastMarker.current = newMarker;
    }
  }, [searchResult]);


  const toggleMarkers = (type) => {
    //markerleri temizleme
    markers.current.forEach((markerObj) => {
      if (markerObj && markerObj.marker) {
        markerObj.marker.remove();
      }
    });
    markers.current = [];
    // eğer bir marker butonu açıksa üstüne tıklandığında tekrar kapatır (ispark ve yeşil alan butonu)
    if (activeMarkerType === type) {
      setActiveMarkerType(null);
    } else {
      setActiveMarkerType(type);
      //apiloctan gelen long lat bilgileri geçerli mi kontrol edilip geçerliyse bir div olarak marker oluşturur
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
              //popup eklenir
              const popup = new maplibregl.Popup({ offset: 25 }).setHTML(`
                <p>${location._id}</p>
                <p>Otopark</p>
                <strong>${location.PARK_NAME || "Unknown"}</strong><br/>
                ${location.LOCATION_NAME || "Unknown"}<br/>
                ${location.PARK_TYPE_ID || "Unknown"}<br/>
                ${location.CAPACITY_OF_PARK || "Unknown"}<br/>
                ${location.WORKING_TIME || "Unknown"}<br/>
                ${location.COUNTY_NAME || "Unknown"}<br/>
                <button onclick="handleEditClick(
                '${location._id || ""}',
                '${location.PARK_NAME || ""}', 
                '${location.LOCATION_NAME || ""}', 
                '${location.PARK_TYPE_ID || ""}', 
                '${location.PARK_TYPE_DESC || ""}', 
                '${location.CAPACITY_OF_PARK || ""}', 
                '${location.WORKING_TIME || ""}', 
                '${location.COUNTY_NAME || ""}', 
                '${longitude}', 
                '${latitude}',
                )" class="mt-2 px-4 py-2 bg-blue-400 text-white rounded hover:bg-blue-600">Edit</button>
              `);

              marker.setPopup(popup);
              markers.current.push({ marker, type: "ispark" });
            }
          }
        });
      } else if (type === "greenSpaces") {
        greenSpaces.forEach((space) => {
          const coordinates = space["KOORDINAT"];
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
                <p> ${space._id} </p>
                <p>Park veya Yeşil Alan</p>
                <strong>${space.MAHAL_ADI || "Unknown"}</strong><br/>
                ${space.TUR || "Unknown"}<br/>
                ${space.ILCE} <br/>
                <button onclick="handleEditClickGreen(
                '${space._id}', 
                '${space.MAHAL_ADI || ""}', 
                '${space.TUR || ""}', 
                '${space.ILCE}',
                '${space.KOORDINAT}',
                '${longitude}',
                '${latitude}'
                )" class="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-green-600">Edit</button>
              `);

              marker.setPopup(popup);
              markers.current.push({ marker, type: "greenSpaces" });
            }
          }
        });
      }
    }
  };

  useEffect(() => {
    // Kullanıcı konum bilgisi geldiğinde marker ekleme işlemi
    if (location && mapRef.current) {
      const { lat, lng } = location;

      // Eski marker'ları kaldırma
      markers.current.forEach((markerObj) => {
        if (markerObj && markerObj.marker) {
          markerObj.marker.remove();
        }
      });
      markers.current = [];

      // Yeni marker ekle
      const newMarker = new maplibregl.Marker()
        .setLngLat([lng, lat])
        .addTo(mapRef.current);

      // Yeni markerı kaydet
      markers.current.push({ marker: newMarker, type: "geolocation" });
      mapRef.current.flyTo({ center: [lng, lat], zoom: 14 });
      lastMarker.current = newMarker;
    }
  }, [location]);

  // dataibbye upsert atılmasa da güncelleme metodu
  const upsertIsparkData = async (data, id) => {
    try {
      const response1 = await axios.post(
        `http://127.0.0.1:8000/UpdateParkData/${id}`,
        data
      );
      return response1.data;
    } catch (error) {
      console.error("Error updating data:", error);
      return false;
    }
  };
  const upsertGreenSpacesData = async (data, id) => {
    try {
      const response2 = await axios.post(
        `http://127.0.0.1:8000/UpdateGreenFields/${id}`,
        data
      );
      return response2.data;
    } catch (error) {
      console.error("Error updating Green Spaces data:", error);
      return false;
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    console.log("Form Data on Submit: ", formData); // Konsola form verisini yazdır

    if (editingMarker) {
      let isparkSuccess = false;
      let greenSpacesSuccess = false;
      if (formData.fieldType === "ispark") {
        const dataForIspark = {
          _id: formData._id,
          PARK_NAME: formData.name || "",
          LOCATION_NAME: formData.description || "",
          PARK_TYPE_ID: formData.type || "",
          PARK_TYPE_DESC: formData.type_desc || "",
          CAPACITY_OF_PARK: Number(formData.kapasite) || "",
          WORKING_TIME: formData.saat || "",
          COUNTY_NAME: formData.county || "",
          LONGITUDE: parseFloat(formData.longitude) || "",
          LATITUDE: parseFloat(formData.latitude) || "",
        };
        console.log("ispark data formdata", dataForIspark);
        isparkSuccess = await upsertIsparkData(dataForIspark, formData._id);
      }

      if (formData.fieldType === "greenSpaces") {
        const dataForGreenSpaces = {
          TUR: formData.description || "",
          MAHAL_ADI: formData.name || "",
          ILCE: formData.ilce || "",
          KOORDINAT: formData.latitude + "," + formData.longitude || "", // Koordinat verisi burada kullanılacak
        };
        console.log("greenspaces formdata", dataForGreenSpaces);
        greenSpacesSuccess = await upsertGreenSpacesData(
          dataForGreenSpaces,
          formData._id
        );
      }
      if (isparkSuccess || greenSpacesSuccess) {
        const updatedPopupHTML = `
          <p>Düzenlenmiş Konum</p>
          <strong>${formData.name || "No Name"}</strong><br/>
          ${formData.description || "No Description"}<br/>
          ${formData.type ? formData.type : ""}<br/>
          ${formData.ilce ? formData.ilce : ""}<br/>
          ${formData.saat ? formData.saat : ""}<br/>
          ${formData.kapasite ? formData.kapasite : ""}<br/>
          ${formData.county ? formData.county : ""}<br/>`;
        editingMarker.setPopup(
          new maplibregl.Popup({ offset: 25 }).setHTML(updatedPopupHTML)
        );
        setIsEditing(false);
      } else {
        console.error("Failed to update data in one or both APIs");
      }
    }
  };

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
      setEditingMarker(marker.marker); // Burada doğrudan marker'ı ayarlıyoruz
      setIsEditing(true);
    }
  };

  const showPopup = (name, description, type, longitude, latitude, _id) => {
    const popupHTML = `
      <p>${type === "ispark" ? "Otopark" : "Park veya Yeşil Alan"}</p>
      <p> ${_id} </p>
      <strong>${name || "Unknown"}</strong><br/>
      ${description || "Unknown"}<br/>
      <button onclick="handleEditClick('
      '${_id}',
      '${name || ""}', 
      '${description || ""}', 
      '${type || ""}', 
      ${latitude || ""}, 
      ${longitude || ""},

    
    )" class="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Edit</button>
    `;

    const popup = new maplibregl.Popup({ offset: 25 }).setHTML(popupHTML);
    const marker = new maplibregl.Marker()
      .setLngLat([latitude, longitude])
      .setPopup(popup)
      .addTo(mapRef.current);

    markers.current.push(marker);
  };


  //harita üzerinde hareket edildikçe kordinat ve zoom bilgisi urlye eklenecek bu sayede url yönetimi sağlanacak
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
      <Card
        onStyleChange={handleStyleChange}
        onShowMarkers={toggleMarkers}
        markers={markers}
        formData={formData}
        showPopup={showPopup}
        setLocation={setLocation}
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
