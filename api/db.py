import motor.motor_asyncio
import os
import asyncio
from datetime import datetime

MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017")
client = motor.motor_asyncio.AsyncIOMotorClient(MONGO_URL, serverSelectionTimeoutMS=2000)
db = client.pathfinder_db

async def save_prediction(user_id: str, profile_type: str, input_data: dict, prediction_result: dict):
    try:
        collection = db.user_predictions
        record = {
            "user_id": user_id,
            "profile_type": profile_type,
            "input_data": input_data,
            "prediction": prediction_result,
            "timestamp": datetime.utcnow()
        }
        await collection.insert_one(record)
        return True
    except Exception as e:
        print(f"⚠️ MongoDB Error (save_prediction): {e}")
        return False

async def get_user_history(user_id: str):
    try:
        collection = db.user_predictions
        cursor = collection.find({"user_id": user_id}).sort("timestamp", -1)
        history = await cursor.to_list(length=100)
        for h in history:
            h["_id"] = str(h["_id"])
        return history
    except Exception as e:
        print(f"⚠️ MongoDB Error (get_user_history): {e}")
        return []

