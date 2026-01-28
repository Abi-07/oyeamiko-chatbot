# Chatbot Backend

## Project Structure

```
chatbot-backend/
├── app/
│   ├── __init__.py
│   ├── main.py         # FastAPI app entrypoint
│   ├── api.py          # API routes
│   └── services/
│       └── chat_service.py  # LLM and chat logic
├── requirements.txt    # Python dependencies
└── README.md
```

## Development

1. Install dependencies:
   ```sh
   pip install -r requirements.txt
   ```
2. Run the server:
   ```sh
   uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   ```

## API
- POST `/chat` with JSON `{ "message": "...", "history": [{"role": "user", "content": "..."}, ...] }`
- Returns: `{ "response": "..." }`
