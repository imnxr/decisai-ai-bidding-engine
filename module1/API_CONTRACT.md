# Module 1 API Contract — for UI integration

Base URL: `http://127.0.0.1:8000`
CORS: open (`*`) — call directly from React/Vue dev server.
Errors: any endpoint may return `500` with body `{"error": "<message>"}`. Always handle it.
Interactive docs: `http://127.0.0.1:8000/docs`

---

## 1. Win Probability — `GET /api/score`

Query params:

| param | type | required | example |
|---|---|---|---|
| sector | string | yes | `Energy` (one of: Construction, IT Services, Energy, Healthcare, Education, Telecom, Finance, Logistics) |
| budget | string | no (default `PKR 50M`) | `PKR 50M` |
| compliance_pct | float | no (default 80) | `85` |
| score_pct | float | no (defaults to training median) | `90` — strongest feature, pass it if the UI has an estimate |

```
GET /api/score?sector=Energy&budget=PKR%2050M&compliance_pct=85&score_pct=90
```

Response `200`:
```json
{
  "win_probability": 88.3,
  "model": "trained_random_forest",
  "features_used": {
    "Sector": "Energy", "Budget_PKR": 50000000.0, "Score (%)": 90.0,
    "Compliance %": 85.0, "Response Time (hrs)": 91.0,
    "Doc Pages": 251.0, "Gaps Found": 4.0
  }
}
```

UI use: gauge/dial on the GO/NO-GO dashboard. `win_probability` is 0–100.

---

## 2. Compliance check — `POST /api/llm/match_and_classify`

Request body:
```json
{
  "requirement_id": "R-01",
  "requirement_text": "ISO 27001 certification required",
  "category": "IT Services",
  "mandatory": true
}
```
`category` is optional (use the bid's Sector if known; boosts retrieval). `mandatory` defaults true.

Response `200`:
```json
{
  "requirement_id": "R-01",
  "status": "PASS",
  "evidence": [
    {
      "cap_id": "CAP-001", "domain": "Cybersecurity",
      "certification": "ISO 27001", "client_type": "International",
      "contract_value": "PKR 15M", "duration_months": 34,
      "year_completed": 2023, "similarity_score": 0.727
    }
  ]
}
```

`status` ∈ `PASS | PARTIAL | FAIL | INFO`. `evidence` may be empty (length 0–5).
UI use: compliance matrix — green/amber/red/grey row per requirement. Call once per requirement (it's fast, ~50ms).

---

## 3. Draft answer — `POST /api/llm/answer`

Request body (pass the `evidence` array you got from endpoint 2):
```json
{
  "rfp_id": "RFP-1",
  "question_id": "Q-01",
  "question": "Describe your cybersecurity experience.",
  "category": "IT Services",
  "evidence": [
    {
      "cap_id": "CAP-001", "domain": "Cybersecurity",
      "certification": "ISO 27001", "client_type": "International",
      "contract_value": "PKR 15M", "duration_months": 34,
      "year_completed": 2023, "match_reason": "domain match"
    }
  ]
}
```

Response `200` — ALWAYS this full schema, both LLM and fallback paths:
```json
{
  "answer": "Our company completed a cybersecurity project (CAP-001) ...",
  "summary": "...",
  "sources": ["CAP-001"],
  "confidence": "high",
  "missing_info": [],
  "follow_up_questions": [],
  "recommended_action": "...",
  "generation_method": "local_llm",
  "question_id": "Q-01"
}
```

UI notes:
- `confidence` ∈ `high | medium | low` — badge color.
- `generation_method` ∈ `claude_api | local_llm | template_fallback` — show a small tag; fallback is a feature (guaranteed grounded), not an error.
- **This call can take 5–15s on CPU** (local LLM). Show a spinner; don't set client timeout below 30s.
- If `confidence == "low"` and `answer == ""`: render `missing_info` + `recommended_action` instead of the answer.

---

---

# RFP workflow endpoints (document intelligence)

State is **in-memory** — restarting the server clears uploaded RFPs. Upload again after restart.
A pre-extracted sample (`sample_rfp_extracted.json`) is in the repo for building UI without the server.

## 4. Upload RFP — `POST /api/upload`

Multipart form, field name `file`, accepts `.pdf` / `.docx` / `.txt`.

```bash
curl -X POST "http://127.0.0.1:8000/api/upload?use_llm=false" -F "file=@sample_rfp.txt"
```
`use_llm=true` is the default and enables optional Claude-assisted extraction
when your local `ANTHROPIC_API_KEY` is present. Use `use_llm=false` for local/offline tests.

Response `200`:
```json
{
  "rfp_id": "RFP-a1b2c3d4",
  "filename": "sample_rfp.txt",
  "summary": {"chunks": 2, "requirements": 11, "mandatory": 7,
              "evaluation_criteria": 4, "deadlines": 4, "questions": 4, "financials": 2}
}
```
Save `rfp_id` — every endpoint below needs it.

## 5. Full extraction — `GET /api/rfp/{rfp_id}/extract`

Returns the complete structured RFP JSON:
`{rfp_id, filename, raw_text_chars, chunks[], requirements[], evaluation_criteria[], deadlines[], questions[], financials[]}`
- requirement: `{requirement_id, text, mandatory, category, requirement_type}`
- `requirement_type` is `capability | administrative`; administrative rows are tracked but not RAG-matched.
- question: `{question_id, question, category}`
- criterion: `{criterion, weight_pct}` · deadline: `{date, context}` · financial: `{amount, context}`

## 6. Compliance matrix — `POST /api/rfp/{rfp_id}/match` (no body)

Classifies ALL extracted requirements in one call. Response:
```json
{
  "rfp_id": "...",
  "counts": {"PASS": 5, "PARTIAL": 3, "FAIL": 2, "INFO": 1},
  "results": [{"requirement_id": "R-001", "text": "...", "mandatory": true,
               "status": "PASS", "evidence": [ ...same shape as endpoint 2... ]}]
}
```

## 7. Draft all answers — `POST /api/rfp/{rfp_id}/draft`

Body (optional): `{"question_ids": ["Q-001"], "use_llm": true}`
- empty `question_ids` = all questions
- `use_llm: false` = instant grounded templates (use this while building UI; LLM mode is 5–15s **per question**)

Response: `{"rfp_id": "...", "drafts": [ ...same schema as endpoint 3... ]}`

## 8. GO/NO-GO — `GET /api/rfp/{rfp_id}/decision`

Query params: same as `/api/score` (`sector`, `budget`, `compliance_pct`, `score_pct`).
**Requires `/match` to have been called first** (else 400).

```json
{
  "rfp_id": "...", "decision": "GO" | "CONDITIONAL GO" | "NO-GO",
  "rationale": "All mandatory requirements covered; win probability favourable.",
  "win_probability": 88.3, "mandatory_requirements": 7, "mandatory_failures": []
}
```

## 9. Export — `GET /api/rfp/{rfp_id}/export`

- `?format=json` (default): `{rfp_id, extraction, compliance_matrix, drafts, score, decision_log}`
- `?format=docx`: downloads the polished proposal document (cover page, exec summary, compliance table, technical responses, past performance). Wire to a "Download DOCX" button.
- `?format=pdf`: downloads the same proposal package as a PDF. Wire to a "Download PDF" button.

## 10. Win-score dashboard — `GET /api/rfp/{rfp_id}/score?competitor_presence=low|medium|high`

Requires `/match` first. Powers Screen 6 (5 criteria bars + overall):
```json
{
  "rfp_id": "...", "overall": 76.8,
  "breakdown": {"compliance": 66.7, "domain_match": 88.0, "budget_alignment": 100.0,
                "past_win_rate": 65.0, "competitor_risk": 50},
  "weights": {"compliance": 30, "domain_match": 25, "budget_alignment": 20,
              "past_win_rate": 15, "competitor_risk": 10},
  "dominant_sector": "Energy",
  "decision": "GO" | "CONDITIONAL GO" | "HIGH RISK" | "NO-GO"
}
```
Thresholds: 80+ GO · 60-79 CONDITIONAL GO · 40-59 HIGH RISK · <40 NO-GO.
`competitor_presence` is the manager's input (Screen 7 dropdown).

## 11. Log manager decision — `POST /api/rfp/{rfp_id}/decision`

Body: `{"decision": "GO", "manager": "Name", "notes": "..."}`
Returns the logged record with UTC timestamp. (The GET variant computes the
recommendation; this POST records the human's confirmed call — Screen 7 buttons.)

## Extraction extras (Screen 3)

`/extract` now also returns `meta: {title, issuer, reference}`,
`warnings: []` (e.g. scanned-PDF/OCR warning), and
`extraction_method: "heuristic" | "claude+heuristic"`.

---

## Typical UI flow

1. `POST /api/upload` → show extraction summary, keep `rfp_id`.
2. `GET /api/rfp/{id}/extract` → render requirements / deadlines / criteria tabs.
3. `POST /api/rfp/{id}/match` → compliance matrix (green/amber/red/grey).
4. `POST /api/rfp/{id}/draft` (start with `use_llm: false` for instant results) → answer drafts.
5. `GET /api/rfp/{id}/decision` → GO/NO-GO banner + win-probability gauge.
6. `GET /api/rfp/{id}/export` → download button.
