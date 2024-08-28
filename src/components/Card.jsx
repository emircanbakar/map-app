import React, { useState } from "react";

const Card = () => {
  const [details, setDetails] = useState(false);

  const handleDetails = () => {
    setDetails(!details);
  };

  return (
    <div className="fixed top-4 left-4 bg-white w-[350px] h-auto shadow-lg p-4 z-10 rounded-md">
      <div className="flex items-center space-x-2">
        <div className="relative flex-grow">
          <label htmlFor="Search" className="sr-only">
            Search
          </label>

          <input
            type="text"
            id="Search"
            placeholder="Search for..."
            className="w-full rounded-md p-2.5 pe-10 shadow-sm sm:text-sm border-2 border-gray-200"
          />

          <span className="absolute inset-y-0 end-0 grid w-10 place-content-center">
            <button type="button" className="text-gray-600 hover:text-gray-700">
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
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
        >
          More
        </button>
      </div>

      {details && (
        <div className="mt-4">
          <div className="mt-4">park yeşil alan</div>
          <div className="mt-4">
            <label
              htmlFor="AcceptConditions"
              className="relative inline-block h-8 w-14 cursor-pointer rounded-full bg-gray-300 transition [-webkit-tap-highlight-color:_transparent] peer-checked:bg-green-500"
            >
              <input
                type="checkbox"
                id="AcceptConditions"
                className="peer sr-only"
              />
              <span className="absolute inset-y-0 start-0 m-1 size-6 rounded-full bg-white transition-all peer-checked:start-6"></span>
            </label>
          </div>
        </div>
      )}
    </div>
  );
};

export default Card;
