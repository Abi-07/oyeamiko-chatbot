from langchain_huggingface import HuggingFacePipeline
from transformers import AutoModelForCausalLM, AutoTokenizer, pipeline
from langgraph.graph import StateGraph, START, END
from langgraph.graph.message import add_messages
from typing import List, Annotated, TypedDict

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
    response = llm.invoke(state["messages"])
    clean_response = response.split("User:")[0].split("Human:")[0].strip()
    return {"messages": [("assistant", clean_response)]}

graph_builder = StateGraph(State)
graph_builder.add_node("chatbot", chatbot)
graph_builder.add_edge(START, "chatbot")
graph_builder.add_edge("chatbot", END)
runnable = graph_builder.compile()

def run_chat(message: str, history: List[dict]):
    max_history = 10
    recent_history = history[-max_history:]
    messages = [("system", "system_prompt = 'You are a friendly, witty AI collaborator. Give concise, natural answers and don't be afraid to show a bit of personality, but keep it grounded.'")]
    for msg in recent_history:
        role = "user" if msg["role"] == "user" else "assistant"
        messages.append((role, msg["content"]))
    messages.append(("user", message))
    result = runnable.invoke({"messages": messages})
    return result["messages"][-1].content
