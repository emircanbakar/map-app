import React, { useContext, } from "react";
import MapContext from "../context/MapContext";
import axios from "axios";

const Search = () => {
  const {
    searchQuery,
    setSearchQuery,
    details,
    setDetails,
    setSearchResult,
  } = useContext(MapContext);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      searchLocation(searchQuery);
    } else {
      console.error("Search query is empty");
    }
  };

  const handleDetails = () => setDetails(!details);

  // search bar, maptiler geocoding ile arama işlemi yapma
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
      console.error("Error fetching geocoding data:", error);
    }
  };

  return (
    <div>
      <div className="flex items-center space-x-2 transition-all">
        <div className="relative flex-grow transition-all">
          <label htmlFor="Search" className="sr-only">
            Search
          </label>
          <input
            type="text"
            id="Search"
            placeholder="Search for..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-md p-2.5 pe-10 shadow-sm sm:text-sm border-2 border-gray-200 focus:border-blue-500 transition-all"
          />

          <span className="absolute inset-y-0 end-0 grid w-10 place-content-center">
            <button
              type="button"
              onClick={handleSearch}
              className="text-gray-600 hover:text-gray-700"
            >
              <span className="sr-only">Search</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="size-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                />
              </svg>
            </button>
          </span>
        </div>
        <button
          onClick={handleDetails}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-all"
        >
          <svg
            className="h-6 w-6"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default Search;
