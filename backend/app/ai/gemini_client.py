import requests
from config import GEMINI_API_KEY, GEMINI_API

HEADERS = {
    "Content-Type": "application/json"
}

def generate_ai_response(user_prompt: str) -> str:
    payload = {
        "contents": [
            {
                "parts": [
                    {
                        "text": f"""
You are a research assistant.
Answer clearly, factually, and concisely.

Question:
{user_prompt}
"""
                    }
                ]
            }
        ]
    }

    response = requests.post(
        f"{GEMINI_API}?key={GEMINI_API_KEY}",
        headers=HEADERS,
        json=payload,
        timeout=30
    )

    if response.status_code != 200:
        raise Exception(f"Gemini API Error: {response.text}")

    data = response.json()

    return data["candidates"][0]["content"]["parts"][0]["text"]
