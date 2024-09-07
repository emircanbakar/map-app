import React, { useContext, useEffect } from "react";
import axios from "axios";
import MapContext from "../context/MapContext";

const DataPanel = () => {
  const {
    parkData,
    setParkData,
    greenFieldData,
    setGreenFieldData,
    activePanel,
    setActivePanel,
  } = useContext(MapContext)
  // bu fetch işlemi contexten çekilebilir 
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const [response1, response2] = await Promise.all([
          axios.get("http://127.0.0.1:8000/GetAllParkData/"),
          axios.get("http://127.0.0.1:8000/GetAllGreenFields/"),
        ]);

        if (Array.isArray(response1.data)) {
          setParkData(response1.data);
        } else {
          console.error("Park data format is incorrect", response1.data);
        }

        if (Array.isArray(response2.data)) {
          setGreenFieldData(response2.data);
        } else {
          console.error("Green field data format is incorrect", response2.data);
        }
      } catch (error) {
        console.error("API verisi alınırken hata oluştu:", error);
      }
    };
    fetchLocations();
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
          <div className="p-2">
            <h2 className="text-lg font-semibold mb-2">
              {activePanel === "park" ? "Park Data" : "Green Field Data"}
            </h2>
            <table
              className={`divide-y-2 divide-gray-200 text-sm my-2 w-full ${
                activePanel === "park" ? "bg-blue-200" : "bg-green-200"
              }`}
            >
              <thead className="ltr:text-left">
                <tr>
                  {activePanel === "park" ? (
                    <>
                      <th className="whitespace-nowrap px-2 font-medium text-gray-900">
                        Park Name
                      </th>
                      <th className="whitespace-nowrap px-2 font-medium text-gray-900">
                        Location Name
                      </th>
                      <th className="whitespace-nowrap px-2 font-medium text-gray-900">
                        Park Type
                      </th>
                      <th className="whitespace-nowrap px-2 font-medium text-gray-900">
                        Capacity
                      </th>
                      <th className="whitespace-nowrap px-2 font-medium text-gray-900">
                        Working Time
                      </th>
                      <th className="whitespace-nowrap px-2 font-medium text-gray-900">
                        County
                      </th>
                      <th className="whitespace-nowrap px-2 font-medium text-gray-900">
                        Longitude
                      </th>
                      <th className="whitespace-nowrap px-2 font-medium text-gray-900">
                        Latitude
                      </th>
                    </>
                  ) : (
                    <>
                      <th className="whitespace-nowrap px-2 font-medium text-gray-900">
                        Type
                      </th>
                      <th className="whitespace-nowrap px-2 font-medium text-gray-900">
                        Name
                      </th>
                      <th className="whitespace-nowrap px-2 font-medium text-gray-900">
                        District
                      </th>
                      <th className="whitespace-nowrap px-2 font-medium text-gray-900">
                        Coordinates
                      </th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {activePanel === "park"
                  ? parkData.map((item) => (
                      <tr key={item._id} className="odd:bg-gray-50">
                        <td className="whitespace-nowrap px-4 text-gray-700">
                          {item.PARK_NAME}
                        </td>
                        <td className="whitespace-nowrap px-4 text-gray-700">
                          {item.LOCATION_NAME}
                        </td>
                        <td className="whitespace-nowrap px-4 text-gray-700">
                          {item.PARK_TYPE_DESC}
                        </td>
                        <td className="whitespace-nowrap px-4 text-gray-700">
                          {item.CAPACITY_OF_PARK}
                        </td>
                        <td className="whitespace-nowrap px-4 text-gray-700">
                          {item.WORKING_TIME}
                        </td>
                        <td className="whitespace-nowrap px-4 text-gray-700">
                          {item.COUNTY_NAME}
                        </td>
                        <td className="whitespace-nowrap px-4 text-gray-700">
                          {item.LONGITUDE}
                        </td>
                        <td className="whitespace-nowrap px-4 text-gray-700">
                          {item.LATITUDE}
                        </td>
                      </tr>
                    ))
                  : greenFieldData.map((item) => (
                      <tr key={item._id} className="odd:bg-gray-50">
                        <td className="whitespace-nowrap px-4 text-gray-700">
                          {item.TUR}
                        </td>
                        <td className="whitespace-nowrap px-4 text-gray-700">
                          {item.MAHAL_ADI}
                        </td>
                        <td className="whitespace-nowrap px-4 text-gray-700">
                          {item.ILCE}
                        </td>
                        <td className="whitespace-nowrap px-4 text-gray-700">
                          {item.KOORDINAT}
                        </td>
                      </tr>
                    ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataPanel;
