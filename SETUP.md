# Quick Setup (DecisAI / BidPilot System)

This archive contains the full system: the React frontend (`UI/`) and the Python
backend + database (`module1/`). Dependency folders (`venv`, `node_modules`,
`__pycache__`) were excluded to keep the download small — they are regenerated
below.

## 1. Backend (module1)

```bash
cd module1
python -m venv venv
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

pip install -r requirements.txt
```

Run the backend (FastAPI / uvicorn):

```bash
uvicorn main:app --reload
```

Notes:
- `chroma_db/` (vector store) and `model_a_win_probability.pkl` (trained model)
  are included, so you don't need to retrain or re-index.
- Ollama runs locally. Claude is optional and requires your own `ANTHROPIC_API_KEY` in a local `.env` file.
  See `README.md`, `setup.md`, and `API_CONTRACT.md` in `module1/`.

## 2. Frontend (UI)

```bash
cd UI
npm install
npm run dev
```

The dev server (Vite) will print a local URL (usually http://localhost:5173).

## 3. Order

Start the backend first, then the frontend. Confirm the frontend's API base URL
points at the running backend.
