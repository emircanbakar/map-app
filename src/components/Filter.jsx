import React, { useState, useEffect } from "react";
import axios from "axios";

const Filter = ({ onFilter }) => {
  const [parkTypes, setParkTypes] = useState([]);
  const [distinctParkTypes, setDistinctParkTypes] = useState([]);
  const [selectedType, setSelectedType] = useState("");

  useEffect(() => {
    const uniqueTypes = Array.from(
      new Set(parkTypes.map((type) => type.PARK_TYPE_ID))
    );
    setDistinctParkTypes(uniqueTypes);
  }, [parkTypes]);

  useEffect(() => {
    const fetchParkTypes = async () => {
      try {
        const response = await axios.get(
          "https://data.ibb.gov.tr/api/3/action/datastore_search?resource_id=f4f56e58-5210-4f17-b852-effe356a890c"
        );
        const data = response.data;
        if (data.success && data.result && Array.isArray(data.result.records)) {
          setParkTypes(data.result.records);
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
    console.log("Dropdown changed to:", newType);
    setSelectedType(newType);
  };

  const handleFilter = () => {
    onFilter(selectedType);
  };

  return (
    <div className="relative flex justify-between text-left mt-4">
      <select
        value={selectedType}
        onChange={handleChange}
        className="block w-full p-2 text-gray-700 border border-gray-300 rounded-md shadow-sm focus:border-blue-500 transition-all"
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
        onClick={() => handleFilter("ispark")}
      >
        Filter
      </button>
    </div>
  );
};

export default Filter;
