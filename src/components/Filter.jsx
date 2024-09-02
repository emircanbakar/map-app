import React, { useEffect, useContext } from "react";
import axios from "axios";
import MapContext from "../context/MapContext";

const Filter = ({ onFilter }) => {
  const {
    parkTypes,
    setParkTypes,
    distinctParkTypes,
    setDistinctParkTypes,
    selectedType,
    setSelectedType,
  } = useContext(MapContext);

  // API'den gelen park verilerini filtrelemek için özel hook
  useEffect(() => {
    const uniqueTypes = Array.from(
      new Set(parkTypes.map((type) => type.PARK_TYPE_ID))
    );
    setDistinctParkTypes(uniqueTypes);
  }, [parkTypes]);

  useEffect(() => {
    const fetchParkTypes = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/GetAllParkData/");
        const data = response.data;
        if (Array.isArray(data)) {  // Gelen veri bir array ise park verilerini ayarla
          setParkTypes(data);
        } else {
          console.error("Expected an array of park types but got:", data);
        }
      } catch (error) {
        console.error("Error fetching park types:", error);
      }
    };

    fetchParkTypes();
  }, []);

  const handleChange = (event) => {
    const newType = event.target.value;
    setSelectedType(newType);
  };

  const handleFilter = () => {
    onFilter(selectedType);  // Seçili park tipini filtrelemek için fonksiyon çağrısı
  };

  return (
    <div>
      <p className="mt-2">Otopark Çeşitleri</p>
      <div className="relative flex justify-between text-left">
        <select
          value={selectedType}
          onChange={handleChange}
          className="block w-full my-2 p-2 text-gray-700 border border-gray-300 rounded-md shadow-sm focus:border-blue-500 transition-all"
        >
          <option value="">Select Park Type</option>
          {distinctParkTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>

        <button
          className="m-2 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-all"
          onClick={handleFilter}  // Butonun onclick olayında doğrudan filtrele fonksiyonunu çağır
        >
          Filtrele
        </button>
      </div>
    </div>
  );
};

export default Filter;
