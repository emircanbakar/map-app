import { useContext } from "react";
import MapContext from "../context/MapContext";
import axios from "axios";
import maplibregl from "maplibre-gl";

const PopUpSave = ({ markers }) => {
  const { editingMarker, formData, setFormData, setIsEditing } =
    useContext(MapContext);
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const upsertData = async (data, id) => {
    try {
      const [isparkResponse, greenSpacesResponse] = await Promise.all([
        data.fieldType === "ispark"
          ? axios.post(`http://127.0.0.1:8000/UpdateParkData/${id}`, data)
          : Promise.resolve(null),
        data.fieldType === "greenSpaces"
          ? axios.post(`http://127.0.0.1:8000/UpdateGreenFields/${id}`, data)
          : Promise.resolve(null),
      ]);

      return {
        isparkSuccess: !!isparkResponse?.data,
        greenSpacesSuccess: !!greenSpacesResponse?.data,
      };
    } catch (error) {
      console.error("Error updating data:", error);
      return { isparkSuccess: false, greenSpacesSuccess: false };
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    console.log("Form Data on Submit: ", formData); // Konsola form verisini yazdır

    if (editingMarker) {
      let dataForRequest;
      if (formData.fieldType === "ispark") {
        dataForRequest = {
          _id: formData._id,
          fieldType: formData.fieldType,
          PARK_NAME: formData.name || "",
          LOCATION_NAME: formData.description || "",
          PARK_TYPE_ID: formData.type || "",
          PARK_TYPE_DESC: formData.type_desc || "",
          CAPACITY_OF_PARK: Number(formData.kapasite) || "",
          WORKING_TIME: formData.saat || "",
          COUNTY_NAME: formData.county || "",
          LONGITUDE: parseFloat(formData.longitude) || "",
          LATITUDE: parseFloat(formData.latitude) || "",
        };
        console.log("ispark data formdata", dataForRequest);
      } else if (formData.fieldType === "greenSpaces") {
        dataForRequest = {
          _id: formData._id,
          fieldType: formData.fieldType,
          TUR: formData.description || "",
          MAHAL_ADI: formData.name || "",
          ILCE: formData.ilce || "",
          KOORDINAT: formData.latitude + "," + formData.longitude || "",
        };
        console.log("greenspaces formdata", dataForRequest);
      }

      if (dataForRequest) {
        const { isparkSuccess, greenSpacesSuccess } = await upsertData(
          dataForRequest,
          formData._id
        );

        if (isparkSuccess || greenSpacesSuccess) {
          const updatedPopupHTML = `
            <p>Düzenlenmiş Konum</p>
            <strong>${formData.name || "No Name"}</strong><br/>
            ${formData.description || "No Description"}<br/>
            ${formData.type ? formData.type : ""}<br/>
            ${formData.ilce ? formData.ilce : ""}<br/>
            ${formData.saat ? formData.saat : ""}<br/>
            ${formData.kapasite ? formData.kapasite : ""}<br/>
            ${formData.county ? formData.county : ""}<br/>`;
          editingMarker.setPopup(
            new maplibregl.Popup({ offset: 25 }).setHTML(updatedPopupHTML)
          );
          setIsEditing(false);
        } else {
          console.error("Failed to update data in one or both APIs");
        }
      }
    }
  };

  return (
    <div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 p-4 bg-white rounded-lg shadow-md">
        <form onSubmit={handleFormSubmit}>
          <div>
            <label>
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
