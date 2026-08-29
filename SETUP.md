# DecisAI Quick Setup

DecisAI is split into a React frontend (`UI/`) and a Python/FastAPI backend (`files-worker/`). Runtime folders, secrets, ChromaDB data, and generated model artifacts are intentionally excluded from the public repository.

## 1. Backend

```bash
cd files-worker
python -m venv venv

# Windows
venv\Scripts\activate

# macOS/Linux
source venv/bin/activate

pip install -r requirements.txt
```

Build the local capability index and trained win-probability model when needed:

```bash
python data_prep.py
python train_models.py
python rag_setup.py
```

Start FastAPI:

```bash
python -m uvicorn main:app --reload
```

Interactive API docs:

```text
http://127.0.0.1:8000/docs
```

## 2. Local LLM

Install Ollama and download the lightweight local model:

```bash
ollama pull qwen2.5:1.5b
```

The local path does not require an external LLM API key.

Claude is optional. To enable it, copy `files-worker/.env.example` to `files-worker/.env` and add your own `ANTHROPIC_API_KEY` locally. Never commit `.env`.

## 3. Frontend

```bash
cd UI
npm install
npm run dev
```

The Vite development server normally runs on:

```text
http://127.0.0.1:5173
```

Start the backend before the frontend.

## 4. Tests

```bash
cd files-worker
python test_doc_intel.py
python test_module1.py
```

## 5. Data

The included XLSX sample contains bid-history and capability-library data. `data_prep.py` cleans the workbook and prepares the capability records for embedding/retrieval. A replacement workbook can be supplied through the `MODULE1_XLSX` environment variable.
