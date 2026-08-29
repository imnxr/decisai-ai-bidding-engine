# Module 1 — RUN ORDER (from clean checkout)

```bash
# 0. One-time setup (NEEDS internet — do before demo): see setup.md
pip install -r requirements.txt
ollama pull qwen2.5:1.5b
python -c "from sentence_transformers import SentenceTransformer; SentenceTransformer('all-MiniLM-L6-v2')"

# 1. Sanity-check data loading
python data_prep.py

# 2. Train + save Model A (prints accuracy/F1 — screenshot this for judges)
python train_models.py

# 3. Build the ChromaDB index + smoke-test retrieval
python rag_setup.py

# 4. Run both test suites (work offline; re-run with wifi off)
python test_module1.py
python test_doc_intel.py

# 5. Start the API
python -m uvicorn main:app --reload
```

## curl examples

```bash
# Compliance match & classify
curl -X POST http://127.0.0.1:8000/api/llm/match_and_classify \
  -H "Content-Type: application/json" \
  -d '{"requirement_id":"R-01","requirement_text":"ISO 27001 certification required","category":"IT Services","mandatory":true}'

# Grounded answer generation (LLM with template fallback)
curl -X POST http://127.0.0.1:8000/api/llm/answer \
  -H "Content-Type: application/json" \
  -d '{"rfp_id":"RFP-1","question_id":"Q-01","question":"Describe your cybersecurity experience.","category":"IT Services","evidence":[{"cap_id":"CAP-001","domain":"Cybersecurity","certification":"ISO 27001","client_type":"International","contract_value":"PKR 15M","duration_months":34,"year_completed":2023,"match_reason":"domain match"}]}'

# Win probability (trained RandomForest)
curl "http://127.0.0.1:8000/api/score?sector=Energy&budget=PKR%2050M&compliance_pct=85&score_pct=90"

# Full RFP workflow (document intelligence)
curl -X POST http://127.0.0.1:8000/api/upload -F "file=@sample_rfp.txt"
# -> returns rfp_id, then:
curl http://127.0.0.1:8000/api/rfp/<rfp_id>/extract
curl -X POST http://127.0.0.1:8000/api/rfp/<rfp_id>/match
curl -X POST http://127.0.0.1:8000/api/rfp/<rfp_id>/draft -H "Content-Type: application/json" -d '{"use_llm": false}'
curl "http://127.0.0.1:8000/api/rfp/<rfp_id>/decision?sector=IT%20Services&budget=PKR%2085M&compliance_pct=85&score_pct=88"
curl http://127.0.0.1:8000/api/rfp/<rfp_id>/export
```

## Files

| File | Purpose |
|---|---|
| `doc_intel.py` | Document intelligence: PDF/DOCX/TXT → chunks + requirements/criteria/deadlines/questions/financials JSON |
| `sample_rfp.txt` / `sample_rfp_extracted.json` | Sample RFP + its extraction (UI can build against this without the server) |
| `test_doc_intel.py` | 9 PASS/FAIL checks for the extraction layer |
| `data_prep.py` | Load/clean xlsx (header row 3), `parse_pkr`, sector→domain map, enriched embed text |
| `train_models.py` | Model A: trained RandomForest win classifier. Model B: rule-based PASS/PARTIAL/FAIL |
| `rag_setup.py` | MiniLM embeddings + ChromaDB, `retrieve_evidence()` with domain boost + 0.30 threshold |
| `template_fallback.py` | Zero-dependency grounded template (cannot hallucinate) |
| `ollama_client.py` | Local Ollama HTTP client, few-shot prompt, returns None on failure |
| `claude_client.py` | Optional Claude provider; disabled with `DISABLE_CLAUDE=1` for local tests |
| `llm_module.py` | Orchestrator: Claude → local LLM → JSON parse → CAP-id hallucination check → fallback |
| `main.py` | FastAPI: /api/llm/match_and_classify, /api/llm/answer, /api/score |
| `test_module1.py` | 10 PASS/FAIL checks incl. hallucination + timeout-fallback tests |

## Judge talking points

- **Real trained model**: Model A's accuracy/F1 printed by `train_models.py` — trained on the 120 real bids. Score (%) dominates feature importance (Win avg 82.8 vs Loss 56.7), confirming the data.
- **Honest ML**: Model B is deliberately rule-based — the dataset has no PASS/FAIL labels, and training on fabricated labels would be fake ML.
- **Anti-hallucination**: any CAP-id the LLM cites that wasn't in its evidence → entire output discarded, grounded template used instead. Citations are checkable; prose isn't.
- **Offline-safe runtime**: MiniLM + ChromaDB + Ollama/template fallback work locally. Claude is optional quality mode; set `DISABLE_CLAUDE=1` for fully offline/no-token tests.
