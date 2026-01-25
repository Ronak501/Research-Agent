from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional
import uuid
from datetime import datetime, timezone
from ai.gemini_client import generate_ai_response

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

app = FastAPI()
api_router = APIRouter(prefix="/api")

class Message(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    conversation_id: str
    role: str
    content: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class Conversation(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class ConversationCreate(BaseModel):
    title: str = "New Research"

class MessageCreate(BaseModel):
    conversation_id: str
    content: str

class MessageResponse(BaseModel):
    model_config = ConfigDict(extra="ignore")
    user_message: Message
    ai_message: Message

@api_router.get("/")
async def root():
    return {"message": "Research Agent API"}

@api_router.post("/chat/conversations", response_model=Conversation)
async def create_conversation(input: ConversationCreate):
    conversation = Conversation(title=input.title)
    doc = conversation.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    doc['updated_at'] = doc['updated_at'].isoformat()
    await db.conversations.insert_one(doc)
    return conversation

@api_router.get("/chat/conversations", response_model=List[Conversation])
async def get_conversations():
    conversations = await db.conversations.find({}, {"_id": 0}).sort("updated_at", -1).to_list(100)
    for conv in conversations:
        if isinstance(conv['created_at'], str):
            conv['created_at'] = datetime.fromisoformat(conv['created_at'])
        if isinstance(conv['updated_at'], str):
            conv['updated_at'] = datetime.fromisoformat(conv['updated_at'])
    return conversations

@api_router.get("/chat/conversations/{conversation_id}", response_model=List[Message])
async def get_conversation_messages(conversation_id: str):
    messages = await db.messages.find(
        {"conversation_id": conversation_id}, 
        {"_id": 0}
    ).sort("timestamp", 1).to_list(1000)
    
    for msg in messages:
        if isinstance(msg['timestamp'], str):
            msg['timestamp'] = datetime.fromisoformat(msg['timestamp'])
    return messages

@api_router.delete("/chat/conversations/{conversation_id}")
async def delete_conversation(conversation_id: str):
    await db.messages.delete_many({"conversation_id": conversation_id})
    result = await db.conversations.delete_one({"id": conversation_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Conversation not found")
    return {"message": "Conversation deleted"}

@api_router.post("/chat/message", response_model=MessageResponse)
async def send_message(input: MessageCreate):
    user_message = Message(
        conversation_id=input.conversation_id,
        role="user",
        content=input.content
    )
    
    user_doc = user_message.model_dump()
    user_doc['timestamp'] = user_doc['timestamp'].isoformat()
    await db.messages.insert_one(user_doc)
    
    try:
    ai_response = generate_ai_response(input.content)

    ai_message = Message(
        conversation_id=input.conversation_id,
        role="assistant",
        content=ai_response
    )

    except Exception as e:
        logging.error(f"Gemini error: {e}")
        ai_message = Message(
            conversation_id=input.conversation_id,
            role="assistant",
            content="I encountered an error while generating a response. Please try again."
        )

    
    ai_doc = ai_message.model_dump()
    ai_doc['timestamp'] = ai_doc['timestamp'].isoformat()
    await db.messages.insert_one(ai_doc)
    
    await db.conversations.update_one(
        {"id": input.conversation_id},
        {"$set": {"updated_at": datetime.now(timezone.utc).isoformat()}}
    )
    
    return MessageResponse(user_message=user_message, ai_message=ai_message)

app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()