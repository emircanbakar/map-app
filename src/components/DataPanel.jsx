import React, { useEffect, useState } from "react";
import axios from "axios";

const DataPanel = () => {
  const [parkData, setParkData] = useState([]);
  const [greenFieldData, setGreenFieldData] = useState([]);
  const [activePanel, setActivePanel] = useState(null);

  const fetchData = async () => {
    try {
      // Park verilerini al
      const parkResponse = await axios.get(
        "http://127.0.0.1:8000/GetAllParkData/"
      );
      if (Array.isArray(parkResponse.data)) {
        setParkData(parkResponse.data);
      } else {
        console.error("Park data format is incorrect", parkResponse.data);
      }

      // Yeşil alan verilerini al
      const greenFieldResponse = await axios.get(
        "http://127.0.0.1:8000/GetAllGreenFields/"
      );
      if (Array.isArray(greenFieldResponse.data)) {
        setGreenFieldData(greenFieldResponse.data);
      } else {
        console.error("Green field data format is incorrect", greenFieldResponse.data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleButtonClick = (panel) => {
    setActivePanel((prevPanel) => (prevPanel === panel ? null : panel));
  };

  return (
    <div className="relative z-20">
      <div className="fixed top-4 right-4 z-30 flex flex-col space-y-2">
        <button
          onClick={() => handleButtonClick("park")}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-all"
        >
          Park Data
        </button>
        <button
          onClick={() => handleButtonClick("greenField")}
          className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-all"
        >
          Green Field Data
        </button>
      </div>
      <div className="relative">
        <div
          className={`fixed top-32 right-4 w-[600px] h-[400px] overflow-x-auto bg-white shadow-lg transition-transform z-20 rounded-md ${
            activePanel ? "block" : "hidden"
          }`}
        >
          {activePanel === "park" && (
            <div className="p-2">
              <h2 className="text-lg font-semibold mb-2">Park Data</h2>
              <table className="divide-y-2 divide-gray-200 text-sm bg-blue-200 my-2 w-full">
                <thead className="ltr:text-left">
                  <tr>
                    <th className="whitespace-nowrap px-4 font-medium text-gray-900">Park Name</th>
                    <th className="whitespace-nowrap px-4 font-medium text-gray-900">Location Name</th>
                    <th className="whitespace-nowrap px-4 font-medium text-gray-900">Park Type</th>
                    <th className="whitespace-nowrap px-4 font-medium text-gray-900">Capacity</th>
                    <th className="whitespace-nowrap px-4 font-medium text-gray-900">Working Time</th>
                    <th className="whitespace-nowrap px-4 font-medium text-gray-900">County</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {parkData.map((item) => (
                    <tr key={item._id} className="odd:bg-gray-50">
                      <td className="whitespace-nowrap px-4 text-gray-700">{item.PARK_NAME}</td>
                      <td className="whitespace-nowrap px-4 text-gray-700">{item.LOCATION_NAME}</td>
                      <td className="whitespace-nowrap px-4 text-gray-700">{item.PARK_TYPE_DESC}</td>
                      <td className="whitespace-nowrap px-4 text-gray-700">{item.CAPACITY_OF_PARK}</td>
                      <td className="whitespace-nowrap px-4 text-gray-700">{item.WORKING_TIME}</td>
                      <td className="whitespace-nowrap px-4 text-gray-700">{item.COUNTY_NAME}</td>
                      <td className="whitespace-nowrap px-4 text-gray-700">{item.LONGITUDE}</td>
                      <td className="whitespace-nowrap px-4 text-gray-700">{item.LATITUDE}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {activePanel === "greenField" && (
            <div className="p-2">
              <h2 className="text-lg font-semibold mb-2">Green Field Data</h2>
              <table className="divide-y-2 divide-gray-200 text-sm bg-green-200 my-2 w-full">
                <thead className="ltr:text-left">
                  <tr>
                    <th className="whitespace-nowrap px-4 font-medium text-gray-900">Type</th>
                    <th className="whitespace-nowrap px-4 font-medium text-gray-900">Name</th>
                    <th className="whitespace-nowrap px-4 font-medium text-gray-900">District</th>
                    <th className="whitespace-nowrap px-4 font-medium text-gray-900">Coordinates</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {greenFieldData.map((item) => (
                    <tr key={item._id} className="odd:bg-gray-50">
                      <td className="whitespace-nowrap px-4 text-gray-700">{item.TUR}</td>
                      <td className="whitespace-nowrap px-4 text-gray-700">{item.MAHAL_ADI}</td>
                      <td className="whitespace-nowrap px-4 text-gray-700">{item.ILCE}</td>
                      <td className="whitespace-nowrap px-4 text-gray-700">{item.KOORDINAT}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DataPanel;
