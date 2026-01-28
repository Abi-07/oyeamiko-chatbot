from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Annotated, TypedDict

from langchain_huggingface import HuggingFacePipeline
from transformers import AutoModelForCausalLM, AutoTokenizer, pipeline
from langgraph.graph import StateGraph, START, END
from langgraph.graph.message import add_messages

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# 1. Load Local Model
model_id = "Qwen/Qwen2.5-1.5B-Instruct"
tokenizer = AutoTokenizer.from_pretrained(model_id)
model_pipeline = pipeline(
    "text-generation",
    model=model_id,
    tokenizer=tokenizer,
    device_map="cpu",
    max_new_tokens=128,
    return_full_text=False, # Prevents echoing the input prompt
    clean_up_tokenization_spaces=True,
    temperature=0.7
)
llm = HuggingFacePipeline(pipeline=model_pipeline)

# 2. Define LangGraph State
class State(TypedDict):
    messages: Annotated[List, add_messages]

def chatbot(state: State):
    """
    Invokes the LLM and strips any trailing role-play text.
    """
    response = llm.invoke(state["messages"])
    
    # Logic to stop the model from hallucinating the user's next response
    # Local models often try to continue the transcript as "User: ..."
    clean_response = response.split("User:")[0].split("Human:")[0].strip()
    
    return {"messages": [("assistant", clean_response)]}

# Build Graph
graph_builder = StateGraph(State)
graph_builder.add_node("chatbot", chatbot)
graph_builder.add_edge(START, "chatbot")
graph_builder.add_edge("chatbot", END)
runnable = graph_builder.compile()

# 3. API Schema & Endpoint
class ChatRequest(BaseModel):
    message: str
    history: List[dict] = [] # Expects [{"role": "user", "content": "..."}, ...]

@app.post("/chat")
async def chat_endpoint(request: ChatRequest):
    # Define a Window: Keep only the last 5 exchanges (10 messages) to save memory
    max_history = 10
    recent_history = request.history[-max_history:]

    # Construct the message list for the graph
    messages = [("system", "system_prompt = 'You are a friendly, witty AI collaborator. Give concise, natural answers and don't be afraid to show a bit of personality, but keep it grounded.'")]
    
    for msg in recent_history:
        role = "user" if msg["role"] == "user" else "assistant"
        messages.append((role, msg["content"]))
    
    # Add the latest user message
    messages.append(("user", request.message))

    # Run Graph
    result = runnable.invoke({"messages": messages})

    # Return only the content of the last assistant message
    return {"response": result["messages"][-1].content}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)