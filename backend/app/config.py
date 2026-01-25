import os

MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017")
DB_NAME = os.getenv("DB_NAME", "test_database")
CORS_ORIGINS = os.getenv("CORS_ORIGINS", "http://localhost:3000")

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
GEMINI_API = os.getenv(
    "GEMINI_API",
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent"
)

if not GEMINI_API_KEY:
    raise RuntimeError("GEMINI_API_KEY is not set")
