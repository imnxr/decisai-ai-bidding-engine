# Module 1 — Setup

> ⚠ **Do ALL downloads below BEFORE the demo / before going offline.**
> After setup, everything runs 100% locally — zero internet, zero API calls.

## 1. Python deps

```bash
python -m venv venv
# Windows: venv\Scripts\activate   |   Mac/Linux: source venv/bin/activate
pip install -r requirements.txt
```

## 2. Ollama (local LLM)

```bash
# Install: download from https://ollama.com/download (Win/Mac installers)
# or Linux:
curl -fsSL https://ollama.com/install.sh | sh

ollama pull qwen2.5:1.5b       # PRIMARY local model
```

Recommended demo env vars before starting `uvicorn`:

```bash
# Windows cmd
set OLLAMA_MODEL=qwen2.5:1.5b
set OLLAMA_NUM_GPU=0
set OLLAMA_TIMEOUT=90
```

`OLLAMA_NUM_GPU=0` forces CPU mode and avoids CUDA out-of-memory errors on
demo laptops. Qwen 2.5 1.5B is the recommended lightweight local model for the demo.

Verify it works **offline** (turn off wifi after the pull, then):

```bash
ollama run qwen2.5:1.5b "hello"
```

If you get a response with wifi off, you're demo-safe.

## 3. Pre-download the embedding model (one-time, caches to ~/.cache)

```bash
python -c "from sentence_transformers import SentenceTransformer; SentenceTransformer('all-MiniLM-L6-v2')"
```

## 4. Dataset

Put `Problem#1_Sample_Datasets (TEKROWE).xlsx` in this folder (next to the .py files),
or set env var `MODULE1_XLSX=/path/to/file.xlsx`.

## 4b. Document intelligence deps (new)

`pip install -r requirements.txt` now also installs `pymupdf` (PDF) and
`python-docx` (DOCX). If you added them after the first install, run:

```bash
pip install pymupdf python-docx
```

## 5. Demo-day checklist

- [ ] `ollama serve` running (the desktop app auto-starts it)
- [ ] wifi OFF, `python test_module1.py` -> all green
- [ ] `uvicorn main:app --reload` -> http://127.0.0.1:8000/docs
