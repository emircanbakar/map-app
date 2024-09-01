import React, { useEffect, useState } from "react";
import axios from "axios";

const DataPanel = () => {
  const [data, setData] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  const togglePanel = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://data.ibb.gov.tr/api/3/action/datastore_search?resource_id=f4f56e58-5210-4f17-b852-effe356a890c"
        );
        if (
          response.data &&
          response.data.result &&
          Array.isArray(response.data.result.records)
        ) {
          setData(response.data.result.records);
        } else {
          console.error("Data format is incorrect");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="relative z-20">
      <button
        onClick={togglePanel}
        className="px-4 py-2 bg-blue-500 text-white rounded-md absolute top-2 right-2 z-30"
      >
        {isOpen ? "Close Panel" : "Open Panel"}
      </button>
      <div className="relative">
        <div
          className={`absolute top-12 right-2 w-[600px] h-[200px] overflow-x-auto bg-white shadow-lg transition-transform z-20 ${
            isOpen ? "block" : "hidden"
          }`}
        >
          <table className="divide-y-2 divide-gray-200 text-sm bg-blue-200 my-2 w-full h-full">
            <thead className="ltr:text-left">
              <tr>
                <th className="whitespace-nowrap px-4 font-medium text-gray-900">
                  Park Name
                </th>
                <th className="whitespace-nowrap px-4 font-medium text-gray-900">
                  Location Name
                </th>
                <th className="whitespace-nowrap px-4 font-medium text-gray-900">
                  Park Type
                </th>
                <th className="whitespace-nowrap px-4 font-medium text-gray-900">
                  Capacity
                </th>
                <th className="whitespace-nowrap px-4 font-medium text-gray-900">
                  Working Time
                </th>
                <th className="whitespace-nowrap px-4 font-medium text-gray-900">
                  County
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {data.map((item) => (
                <tr key={item._id} className="odd:bg-gray-50">
                  <td className="whitespace-nowrap px-4 font-medium text-gray-900">
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
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DataPanel;
