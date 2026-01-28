from fastapi import APIRouter
from pydantic import BaseModel
from typing import List

from app.services.chat_service import run_chat

router = APIRouter()

class ChatRequest(BaseModel):
    message: str
    history: List[dict] = []

@router.post("/chat")
async def chat_endpoint(request: ChatRequest):
    response = run_chat(request.message, request.history)
    return {"response": response}
