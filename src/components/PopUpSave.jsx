import React from "react";

const PopUpSave = ({ formData, setFormData, setIsEditing, handleFormSubmit }) => {
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 p-4 bg-white rounded-lg shadow-md">
        <form onSubmit={handleFormSubmit}>
          <div>
            <label>
              İsim:
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="border p-2 rounded"
              />
            </label>
          </div>
          <div>
            <label>
              Açıklama:
              <input
                type="text"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="border p-2 rounded"
              />
            </label>
          </div>
          <button
            type="submit"
            className="m-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-all"
          >
            Save
          </button>
          <button
            type="button"
            className="m-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-all"
            onClick={() => setIsEditing(false)}
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
};

export default PopUpSave;
