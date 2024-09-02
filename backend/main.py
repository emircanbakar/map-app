import uvicorn
from fastapi import FastAPI,HTTPException
from pymongo import MongoClient
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
origins = [
    "*",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# MongoDB bağlantı bilgileri
client = MongoClient('mongodb://localhost:27017')
db = client['ispark']
collection = db['isparkvar']
collection2 = db['yesilalanvar']

class Park(BaseModel):
    PARK_NAME: str
    LOCATION_NAME: str
    PARK_TYPE_ID: str
    PARK_TYPE_DESC: str
    CAPACITY_OF_PARK: int
    WORKING_TIME: str
    COUNTY_NAME: str
    LONGITUDE: float
    LATITUDE: float

class GreenField(BaseModel):
    TUR: str
    MAHAL_ADI: str
    ILCE: str
    KOORDINAT: str



@app.get("/GetParkData/{park_id}")
def get_park(park_id: str):
    document = collection.find_one({"_id": park_id})
    if document:
        return {
            "PARK_NAME": document.get("PARK_NAME"),
            "LOCATION_NAME": document.get("LOCATION_NAME"),
            "PARK_TYPE_ID": document.get("PARK_TYPE_ID"),
            "PARK_TYPE_DESC": document.get("PARK_TYPE_DESC"),
            "CAPACITY_OF_PARK": document.get("CAPACITY_OF_PARK"),
            "WORKING_TIME": document.get("WORKING_TIME"),
            "COUNTY_NAME": document.get("COUNTY_NAME"),
            "LONGITUDE": document.get("LONGITUDE"),
            "LATITUDE": document.get("LATITUDE")
        }
    else:
        raise HTTPException(status_code=404, detail="Park not found")

@app.post("/UpdateParkData/{park_id}")
def update_park(park_id: str, park: Park):
    result = collection.update_one(
        {"_id": int(park_id)},
        {"$set": park.model_dump()},
        upsert=True
    )
    if result.modified_count > 0 or result.upserted_id:
        return park
    else:
        raise HTTPException(status_code=400, detail="Failed to update park")

@app.get("/GetAllParkData/")
def get_all_park():
    documents = collection.find()
    if documents:
        park_list = [
            {
                "PARK_NAME": doc.get("PARK_NAME"),
                "LOCATION_NAME": doc.get("LOCATION_NAME"),
                "PARK_TYPE_ID": doc.get("PARK_TYPE_ID"),
                "PARK_TYPE_DESC": doc.get("PARK_TYPE_DESC"),
                "CAPACITY_OF_PARK": doc.get("CAPACITY_OF_PARK"),
                "WORKING_TIME": doc.get("WORKING_TIME"),
                "COUNTY_NAME": doc.get("COUNTY_NAME"),
                "LONGITUDE": doc.get("LONGITUDE"),
                "LATITUDE": doc.get("LATITUDE")
            }
            for doc in documents
        ]
        return park_list
    else:
        raise HTTPException(status_code=404, detail="No parks found")
    
@app.get("/GetGreenFields/{green_id}")
def get_green_fields(green_id: str):
    document = collection2.find_one({"_id": green_id})
    if document:
        return {
            "TUR": document.get("TUR"),
            "MAHAL_ADI": document.get("MAHAL_ADI"),
            "ILCE": document.get("ILCE"),
            "KOORDINAT": document.get("KOORDINAT")
        }
    else:
        raise HTTPException(status_code=404, detail="Green Field not found")

@app.get("/GetAllGreenFields/")
def get_all_green_fields():
    documents = list(collection2.find())

    if documents:
        # Her bir belgeyi işleyerek döndürme
        park_list = [
            {   
                "_id": doc.get("_id"),
                "TUR": doc.get("TUR"),
                "MAHAL_ADI": doc.get("MAHAL_ADI"),
                "ILCE": doc.get("ILCE"),
                "KOORDINAT": doc.get("KOORDINAT")
            }
            for doc in documents
        ]
        return park_list
    else:
        raise HTTPException(status_code=404, detail="No parks found")

@app.post("/UpdateGreenFields/{green_id}")
def update_greenField(green_id: str, greenField: GreenField):

    result = collection2.update_one(
        {"_id": int(green_id)},
        {"$set": greenField.model_dump()},
        upsert=True
    )
    if result.modified_count > 0 or result.upserted_id:
        return greenField
    else:
        raise HTTPException(status_code=400, detail="Failed to update Green Field")


if __name__ == "__main__":
   uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)

