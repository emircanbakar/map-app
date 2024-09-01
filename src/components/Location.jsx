import React, { useState, useEffect } from "react";

const Location = ({ onLocationUpdate }) => { // Callback prop'unu ekleyin
  const [error, setError] = useState(null);
  const [position, setPosition] = useState(() => {
    const savedPosition = localStorage.getItem("geolocation");
    if (savedPosition) {
      console.log(
        "LocalStorage'dan alınan konum verisi:",
        JSON.parse(savedPosition)
      );
      return JSON.parse(savedPosition);
    }
    return null;
  });
  const [isFetching, setIsFetching] = useState(false);

  const getLocation = () => {
    if (isFetching) return;

    if (navigator.geolocation) {
      setIsFetching(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newPosition = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setPosition(newPosition);
          localStorage.setItem("geolocation", JSON.stringify(newPosition));
          console.log(
            "Yeni konum verisi kaydedildi ve localStorage'a eklendi:",
            newPosition
          );
          setError(null);
          setIsFetching(false);
          onLocationUpdate(newPosition); // Konum bilgisini Map bileşenine gönder
        },
        (error) => {
          setError(error.message);
          setPosition(null);
          setIsFetching(false);
        }
      );
    } else {
      setError("Geolocation is not supported by this browser.");
      setIsFetching(false);
    }
  };

  useEffect(() => {
    const savedPosition = localStorage.getItem("geolocation");
    if (savedPosition) {
      console.log(
        "LocalStorage'dan alınan konum verisi:",
        JSON.parse(savedPosition)
      );
      setPosition(JSON.parse(savedPosition));
    }
  }, []);

  return (
    <div>
      <button
        className="relative mx-4 p-2 text-center bg-gray-200 rounded-md hover:text-white hover:bg-green-500 transition-all"
        onClick={getLocation}
        disabled={isFetching}
      >
        Konum Al
      </button>
    </div>
  );
};

export default Location;
