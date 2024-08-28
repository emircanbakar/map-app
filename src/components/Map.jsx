import React, { useRef, useEffect } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

const Map = () => {
  const mapContainerRef = useRef(null);

  useEffect(() => {
    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: 'https://api.maptiler.com/maps/streets/style.json?key=9HThlwugrS3kGNIjxi5r', // MapTiler'dan temin edilen stil
      center: [29.0784, 41.0882], // İstanbul koordinatları
      zoom: 10,
      maxBounds: [[26.0, 36.0], [45.0, 42.0]], // Türkiye sınırları
    });

    return () => map.remove();
  }, []);

  return <div ref={mapContainerRef} className="map-container" />;
};

export default Map;
