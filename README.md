# Oyeamiko Chatbot

This repository contains both the frontend (Next.js) and backend (FastAPI) for the Oyeamiko Chatbot project.

## Project Structure

```
oyeamiko-bot/
├── chatbot-backend/   # FastAPI backend
└── chatbot-frontend/  # Next.js frontend
```

---

## Running the Backend (FastAPI)

1. Navigate to the backend directory:
   ```sh
   cd chatbot-backend
   ```
2. (Optional) Create and activate a virtual environment:
   ```sh
   python3 -m venv .venv
   source .venv/bin/activate
   ```
3. Install dependencies:
   ```sh
   pip install -r requirements.txt
   ```
4. Start the FastAPI server:
   ```sh
   uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   ```
5. The backend will be running at [http://localhost:8000](http://localhost:8000)

---

## Running the Frontend (Next.js)

1. Open a new terminal and navigate to the frontend directory:
   ```sh
   cd chatbot-frontend
   ```
2. Install dependencies:
   ```sh
   npm install
   # or
   yarn install
   ```
3. Start the development server:
   ```sh
   npm run dev
   # or
   yarn dev
   ```
4. The frontend will be running at [http://localhost:3000](http://localhost:3000)

---

## Notes

- Ensure the backend is running before using the chat features in the frontend.
- Update API endpoints in the frontend if your backend runs on a different host/port.

---

## License

MIT
