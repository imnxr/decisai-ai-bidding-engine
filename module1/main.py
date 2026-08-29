"""
PART 7 — FastAPI endpoints for Module 1.

Run:  uvicorn main:app --reload
Every endpoint body is wrapped in try/except -> clean JSON 500, never a
traceback page during the demo.
"""
import os
import traceback
import joblib
import pandas as pd
from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, JSONResponse
from pydantic import BaseModel

from doc_intel import classify_requirement_type, parse_rfp
from llm_module import generate_answer, generate_answers_batch_ollama
from rag_setup import retrieve_evidence
from template_fallback import template_fallback
from train_models import compliance_status, MODEL_A_PATH, FEATURES

app = FastAPI(title="Module 1 — Bid & Proposal Engine")

# WHY: the UI runs on a different port (e.g. localhost:3000/5173); without CORS
# the browser silently blocks every API call. Wide-open is fine for a local demo.
app.add_middleware(CORSMiddleware, allow_origins=["*"],
                   allow_methods=["*"], allow_headers=["*"])

# Similarity bands for Model B's rule inputs (tune against rag_setup.SIM_THRESHOLD)
STRONG_SIM = 0.45   # >= this -> "strong match"
# between SIM_THRESHOLD and STRONG_SIM -> "partial match" (already filtered upstream)

_model_bundle = None


def get_model_bundle():
    global _model_bundle
    if _model_bundle is None:
        if not os.path.exists(MODEL_A_PATH):
            raise RuntimeError("model_a not trained — run `python train_models.py` first")
        _model_bundle = joblib.load(MODEL_A_PATH)
    return _model_bundle


def err500(e: Exception):
    traceback.print_exc()
    return JSONResponse(status_code=500, content={"error": str(e)})


# ---------- request models ----------
class MatchRequest(BaseModel):
    requirement_id: str
    requirement_text: str
    category: str = ""
    mandatory: bool = True


class AnswerRequest(BaseModel):
    rfp_id: str = ""
    question_id: str
    question: str
    category: str = ""
    evidence: list = []   # dicts: cap_id, domain, certification, client_type,
                          # contract_value, duration_months, year_completed, match_reason


def match_requirement(requirement_id: str, text: str, category: str = "",
                      mandatory: bool = True) -> dict:
    """Shared compliance matcher for single-row and full-RFP endpoints."""
    req_type = classify_requirement_type(text)
    if req_type != "capability":
        return {
            "requirement_id": requirement_id,
            "text": text,
            "mandatory": mandatory,
            "requirement_type": req_type,
            "status": "INFO",
            "evidence": [],
            "notes": "Administrative/financial clause; track manually, not matched to capability evidence.",
        }

    evidence = retrieve_evidence(text, category, k=5)
    strong = sum(1 for e in evidence if e["similarity_score"] >= STRONG_SIM)
    partial = len(evidence) - strong
    status = compliance_status(mandatory, strong, partial)
    return {
        "requirement_id": requirement_id,
        "text": text,
        "mandatory": mandatory,
        "requirement_type": req_type,
        "status": status,
        "evidence": evidence,
    }


# ---------- endpoints ----------
@app.post("/api/llm/match_and_classify")
def match_and_classify(req: MatchRequest):
    try:
        result = match_requirement(req.requirement_id, req.requirement_text,
                                   req.category, req.mandatory)
        result.pop("text", None)
        return result
    except Exception as e:
        return err500(e)


@app.post("/api/llm/answer")
def answer(req: AnswerRequest):
    try:
        return generate_answer(req.question, req.question_id, req.evidence)
    except Exception as e:
        return err500(e)


@app.get("/api/score")
def score(sector: str, budget: str = "PKR 50M", compliance_pct: float = 80.0,
          score_pct: float = None):
    try:
        from data_prep import parse_pkr
        bundle = get_model_bundle()
        # Caller supplies key features; fill the rest with training medians so the
        # trained pipeline always gets a complete feature vector.
        # NOTE: Score (%) carries ~69% of feature importance — if the caller can
        # estimate it, pass score_pct, otherwise predictions barely move.
        row = dict(bundle["defaults"])
        row["Sector"] = sector
        row["Budget_PKR"] = parse_pkr(budget)
        row["Compliance %"] = compliance_pct
        if score_pct is not None:
            row["Score (%)"] = score_pct
        X = pd.DataFrame([row])[FEATURES]
        win_prob = float(bundle["model"].predict_proba(X)[0][1]) * 100
        return {
            "win_probability": round(win_prob, 1),
            "model": "trained_random_forest",
            "features_used": {k: row[k] for k in FEATURES},
        }
    except Exception as e:
        return err500(e)


@app.get("/health")
def health():
    return {"status": "ok"}


# ====================== DOCUMENT INTELLIGENCE + RFP WORKFLOW ======================
# Team X persistent store: {rfp_id: {"rfp": <parsed json>, "match": [...], "drafts": [...]}}
# Persisted to a local JSON file so uploads/extractions/decisions survive restarts
# and work fully offline (no external DB needed).
import json as _json_store
from threading import Lock

RFP_STORE = {}
UPLOAD_DIR = os.path.join(os.path.dirname(__file__), "uploaded_rfps")
TEAMX_DB_PATH = os.path.join(os.path.dirname(__file__), "team_x_store.json")
CLASSIFIERS_PATH = os.path.join(os.path.dirname(__file__), "generated_classifiers.json")
_store_lock = Lock()


def _load_store():
    """Load Team X data (uploaded docs, matches, drafts, decisions) from disk."""
    global RFP_STORE
    try:
        if os.path.exists(TEAMX_DB_PATH):
            with open(TEAMX_DB_PATH, "r", encoding="utf-8") as f:
                RFP_STORE = _json_store.load(f)
    except Exception:
        RFP_STORE = {}  # corrupted file -> start clean rather than crash


def _save_store():
    """Persist Team X data after every mutation. Cheap at demo scale."""
    try:
        with _store_lock:
            with open(TEAMX_DB_PATH, "w", encoding="utf-8") as f:
                _json_store.dump(RFP_STORE, f, ensure_ascii=False, default=str)
    except Exception:
        pass  # persistence is best-effort; never break a request over it


_load_store()


def _get_rfp(rfp_id: str):
    if rfp_id not in RFP_STORE:
        raise KeyError(f"Unknown rfp_id '{rfp_id}' — upload a document first "
                       f"(POST /api/upload). Known: {list(RFP_STORE)}")
    return RFP_STORE[rfp_id]


@app.post("/api/upload")
async def upload(file: UploadFile = File(...), use_llm: bool = True,
                 model: str = "claude", doc_type: str = "RFP"):
    """PDF/DOCX/TXT -> structured RFP JSON. Returns summary + rfp_id for next calls.
    model: 'claude' (Claude Haiku 4.5, online) or 'ollama' (local Qwen 2.5 1.5B, offline).
    doc_type: RFP | RFQ | Tender — used to separate workspaces."""
    try:
        os.makedirs(UPLOAD_DIR, exist_ok=True)
        dest = os.path.join(UPLOAD_DIR, os.path.basename(file.filename))
        with open(dest, "wb") as f:
            f.write(await file.read())
        rfp = parse_rfp(dest, use_llm=use_llm, provider=model)
        rfp["doc_type"] = doc_type
        rfp["model_used"] = model
        RFP_STORE[rfp["rfp_id"]] = {"rfp": rfp, "match": None, "drafts": None,
                                    "uploaded_path": dest,
                                    "doc_type": doc_type, "model": model}
        _save_store()
        return {
            "rfp_id": rfp["rfp_id"],
            "filename": rfp["filename"],
            "doc_type": doc_type,
            "model": model,
            "summary": {
                "chunks": len(rfp["chunks"]),
                "requirements": len(rfp["requirements"]),
                "mandatory": sum(r["mandatory"] for r in rfp["requirements"]),
                "evaluation_criteria": len(rfp["evaluation_criteria"]),
                "deadlines": len(rfp["deadlines"]),
                "questions": len(rfp["questions"]),
                "financials": len(rfp["financials"]),
            },
        }
    except Exception as e:
        return err500(e)


@app.get("/api/rfp/{rfp_id}/extract")
def rfp_extract(rfp_id: str):
    """Full structured RFP JSON (requirements, criteria, deadlines, questions, financials)."""
    try:
        return _get_rfp(rfp_id)["rfp"]
    except Exception as e:
        return err500(e)


@app.get("/api/rfp/{rfp_id}/file")
def rfp_file(rfp_id: str):
    """Return the original uploaded document for UI preview."""
    try:
        entry = _get_rfp(rfp_id)
        path = entry.get("uploaded_path")
        if not path:
            path = os.path.join(UPLOAD_DIR, entry["rfp"].get("filename", ""))
        if not path or not os.path.exists(path):
            return JSONResponse(status_code=404, content={"error": "Original uploaded file not found."})
        return FileResponse(path, filename=os.path.basename(path))
    except Exception as e:
        return err500(e)


@app.post("/api/rfp/{rfp_id}/match")
def rfp_match(rfp_id: str):
    """Run compliance match/classify across ALL extracted requirements."""
    try:
        entry = _get_rfp(rfp_id)
        results = []
        for r in entry["rfp"]["requirements"]:
            results.append(match_requirement(
                r["requirement_id"], r["text"], r.get("category", ""), r["mandatory"]))
        entry["match"] = results
        _save_store()
        counts = {s: sum(1 for x in results if x["status"] == s)
                  for s in ("PASS", "PARTIAL", "FAIL", "INFO")}
        return {"rfp_id": rfp_id, "counts": counts, "results": results}
    except Exception as e:
        return err500(e)


class DraftRequest(BaseModel):
    question_ids: list = []   # empty = draft all extracted questions
    use_llm: bool = True      # False = instant grounded templates (fast demo mode)
    model: str = "claude"     # 'claude' (online) or 'ollama' (offline)
    max_sections: int = 4     # keeps offline demo drafting in the 3-4s target range


@app.post("/api/rfp/{rfp_id}/draft")
def rfp_draft(rfp_id: str, req: DraftRequest = DraftRequest()):
    """Draft grounded answers for the RFP's questions. NOTE: with use_llm=true this
    takes ~5-15s PER question on CPU — the UI should draft one at a time or use
    use_llm=false for the instant template path. If the document contains no
    explicit questions, sections are drafted from the top extracted requirements
    so the user is never left with an empty proposal."""
    try:
        entry = _get_rfp(rfp_id)
        wanted = set(req.question_ids)
        questions = list(entry["rfp"]["questions"])
        # Fallback: no questions extracted -> draft sections from key requirements
        if not questions:
            cap_reqs = [r for r in entry["rfp"]["requirements"]
                        if r.get("requirement_type") == "capability"][:5]
            questions = [{
                "question_id": f"S-{i+1:03d}",
                "question": f"Describe how the company meets this requirement: {r['text']}",
                "category": r.get("category", ""),
            } for i, r in enumerate(cap_reqs)]
        if not wanted and req.max_sections and req.max_sections > 0:
            questions = questions[:req.max_sections]

        if req.use_llm and req.model == "ollama" and len(questions) > 1:
            packed = []
            for q in questions:
                if wanted and q["question_id"] not in wanted:
                    continue
                ev = retrieve_evidence(q["question"], q["category"], k=3)
                packed.append({"question": q, "evidence": ev})
            drafts = generate_answers_batch_ollama(packed)
            for d in drafts:
                q = next((item["question"] for item in packed
                          if item["question"]["question_id"] == d["question_id"]), None)
                if q:
                    d["question"] = q["question"]
            entry["drafts"] = drafts
            _save_store()
            return {"rfp_id": rfp_id, "drafts": drafts}

        drafts = []
        for q in questions:
            if wanted and q["question_id"] not in wanted:
                continue
            ev = retrieve_evidence(q["question"], q["category"], k=3)
            if req.use_llm:
                d = generate_answer(q["question"], q["question_id"], ev,
                                    provider=req.model)
            else:
                d = template_fallback(q["question"], ev)
                d["question_id"] = q["question_id"]
            d["question"] = q["question"]
            drafts.append(d)
        entry["drafts"] = drafts
        _save_store()
        return {"rfp_id": rfp_id, "drafts": drafts}
    except Exception as e:
        return err500(e)


@app.get("/api/rfp/{rfp_id}/decision")
def rfp_decision(rfp_id: str, sector: str = "IT Services", budget: str = "PKR 50M",
                 compliance_pct: float = 80.0, score_pct: float = None):
    """GO / NO-GO: combines mandatory-requirement compliance with Model A win probability.
    Run /match first."""
    try:
        entry = _get_rfp(rfp_id)
        if entry["match"] is None:
            return JSONResponse(status_code=400, content={
                "error": "Run POST /api/rfp/{rfp_id}/match before requesting a decision."})

        capability_rows = [m for m in entry["match"] if m.get("requirement_type") == "capability"]
        mand_fail = [m["requirement_id"] for m in capability_rows
                     if m["mandatory"] and m["status"] == "FAIL"]
        n_mand = sum(1 for m in capability_rows if m["mandatory"])

        win = score(sector=sector, budget=budget,
                    compliance_pct=compliance_pct, score_pct=score_pct)
        if isinstance(win, JSONResponse):  # score() errored
            return win
        wp = win["win_probability"]

        # Transparent rules — explain these to judges, don't pretend they're ML:
        if score_pct is not None:
            weighted = float(score_pct)
            if mand_fail:
                decision = "CONDITIONAL GO" if len(mand_fail) <= 2 and weighted >= 60 else "NO-GO"
                rationale = f"Weighted score {weighted}% with mandatory evidence gap(s): {mand_fail}."
            elif weighted >= 80:
                decision = "GO"
                rationale = f"Weighted score {weighted}% and no mandatory failures."
            elif weighted >= 60:
                decision = "CONDITIONAL GO"
                rationale = f"Weighted score {weighted}%: viable, but requires manager review before bidding."
            elif weighted >= 40:
                decision = "HIGH RISK"
                rationale = f"Weighted score {weighted}%: high-risk bid unless gaps are resolved."
            else:
                decision = "NO-GO"
                rationale = f"Weighted score {weighted}% is below bidding threshold."
        elif not mand_fail and wp >= 50:
            decision, rationale = "GO", "All mandatory requirements covered; win probability favourable."
        elif len(mand_fail) <= 2 and wp >= 50:
            decision = "CONDITIONAL GO"
            rationale = f"Win probability favourable but {len(mand_fail)} mandatory gap(s) need evidence: {mand_fail}."
        else:
            decision = "NO-GO"
            rationale = (f"{len(mand_fail)} mandatory requirement(s) unmet "
                         f"and/or win probability {wp}% below threshold.")
        return {
            "rfp_id": rfp_id, "decision": decision, "rationale": rationale,
            "win_probability": wp,
            "mandatory_requirements": n_mand,
            "mandatory_failures": mand_fail,
        }
    except Exception as e:
        return err500(e)


@app.get("/api/rfp/{rfp_id}/export")
def rfp_export(rfp_id: str, format: str = "json"):
    """format=json -> full data bundle. format=docx -> polished proposal document."""
    try:
        entry = _get_rfp(rfp_id)
        if format == "docx":
            from fastapi.responses import FileResponse
            from proposal_export import build_proposal_docx
            path = os.path.join(os.path.dirname(__file__), f"proposal_{rfp_id}.docx")
            build_proposal_docx(entry, path)
            return FileResponse(path, filename=f"proposal_{rfp_id}.docx")
        if format == "pdf":
            from fastapi.responses import FileResponse
            from proposal_export import build_proposal_pdf
            path = os.path.join(os.path.dirname(__file__), f"proposal_{rfp_id}.pdf")
            build_proposal_pdf(entry, path)
            return FileResponse(path, filename=f"proposal_{rfp_id}.pdf",
                                media_type="application/pdf")
        return {"rfp_id": rfp_id, "extraction": entry["rfp"],
                "compliance_matrix": entry["match"], "drafts": entry["drafts"],
                "score": entry.get("score"), "decision_log": entry.get("decision_log")}
    except Exception as e:
        return err500(e)


# ================= 5-CRITERIA WIN SCORE (design doc, Module 3) =================
# Weights from the design: compliance 30%, domain match 25%, budget alignment 20%,
# past win rate 15%, competitor presence 10%. Transparent formula — each criterion
# is computed from real data and explainable to judges line by line.
_data_cache = {}


def _dfs():
    if "bid" not in _data_cache:
        from data_prep import load_data
        _data_cache["bid"], _data_cache["cap"] = load_data()
    return _data_cache["bid"], _data_cache["cap"]


def dominant_category(requirements: list) -> "str | None":
    """Most frequent category, with first-seen order as the tie breaker."""
    counts, order = {}, []
    for req in requirements:
        if req.get("requirement_type") != "capability":
            continue
        category = req.get("category")
        if not category:
            continue
        if category not in counts:
            counts[category] = 0
            order.append(category)
        counts[category] += 1
    if not counts:
        return None
    return max(order, key=lambda c: (counts[c], -order.index(c)))


@app.get("/api/rfp/{rfp_id}/score")
def rfp_score(rfp_id: str, competitor_presence: str = "medium"):
    """5-criteria weighted score + threshold decision. Run /match first."""
    try:
        entry = _get_rfp(rfp_id)
        if entry["match"] is None:
            return JSONResponse(status_code=400, content={
                "error": "Run POST /api/rfp/{rfp_id}/match first."})
        bid_df, cap_df = _dfs()
        match, rfp = entry["match"], entry["rfp"]

        # 1. Compliance (30%): capability clauses only; INFO rows are admin
        # reminders and should not inflate or punish the evidence score.
        actionable = [m for m in match if m.get("requirement_type") == "capability"
                      and m["status"] != "INFO"]
        compliance = 100 * (
            sum(1 for m in actionable if m["status"] == "PASS") +
            0.5 * sum(1 for m in actionable if m["status"] == "PARTIAL")
        ) / max(1, len(actionable))

        # 2. Domain match (25%): mean top-evidence similarity, scaled so that a
        # strong match (>=0.65 cosine) maps to ~100
        tops = [m["evidence"][0]["similarity_score"] for m in actionable if m["evidence"]]
        domain_match = min(100.0, (sum(tops) / len(tops)) / 0.65 * 100) if tops else 0.0

        # 3. Budget alignment (20%): is the RFP budget inside the range of bids
        # we have actually COMPETED for? (bid history spans up to PKR 500M incl.
        # wins — the capability library's delivered values are a narrower subset
        # and would unfairly penalize larger tenders)
        from data_prep import parse_pkr
        budget = max((parse_pkr(f["amount"]) for f in rfp["financials"]), default=0.0)
        lo, hi = bid_df["Budget_PKR"].quantile([0.1, 0.9])
        if budget == 0:
            budget_alignment = 50.0      # unknown budget -> neutral
        elif lo <= budget <= hi:
            budget_alignment = 100.0
        else:
            edge = lo if budget < lo else hi
            budget_alignment = max(20.0, 100 - 100 * abs(budget - edge) / edge)

        # 4. Past win rate (15%): historical win % in the RFP's dominant sector
        sector = dominant_category(rfp["requirements"])
        sec = bid_df[bid_df["Sector"] == sector] if sector else bid_df
        past_win_rate = float(100 * (sec["Outcome"] == "Win").mean()) if len(sec) else 57.0

        # 5. Competitor presence (10%): manager input per the design doc
        competitor = {"low": 80, "medium": 50, "high": 20}.get(
            competitor_presence.lower(), 50)

        breakdown = {
            "compliance": round(float(compliance), 1),
            "domain_match": round(float(domain_match), 1),
            "budget_alignment": round(float(budget_alignment), 1),
            "past_win_rate": round(float(past_win_rate), 1),
            "competitor_risk": competitor,
        }
        overall = round(float(0.30 * compliance + 0.25 * domain_match +
                              0.20 * budget_alignment + 0.15 * past_win_rate +
                              0.10 * competitor), 1)
        decision = ("GO" if overall >= 80 else
                    "CONDITIONAL GO" if overall >= 60 else
                    "HIGH RISK" if overall >= 40 else "NO-GO")
        result = {"rfp_id": rfp_id, "overall": overall, "breakdown": breakdown,
                  "weights": {"compliance": 30, "domain_match": 25,
                              "budget_alignment": 20, "past_win_rate": 15,
                              "competitor_risk": 10},
                  "dominant_sector": sector, "decision": decision}
        entry["score"] = result
        _save_store()
        return result
    except Exception as e:
        return err500(e)


class DecisionLog(BaseModel):
    decision: str          # "GO" | "NO-GO"
    manager: str = ""
    notes: str = ""


@app.post("/api/rfp/{rfp_id}/decision")
def log_decision(rfp_id: str, req: DecisionLog):
    """Log the bid manager's confirmed GO/NO-GO with timestamp (design doc:
    'logs manager decision with timestamp'). The GET variant computes a
    recommendation; this POST records the human's final call."""
    try:
        from datetime import datetime, timezone
        entry = _get_rfp(rfp_id)
        record = {"decision": req.decision.upper(), "manager": req.manager,
                  "notes": req.notes,
                  "timestamp": datetime.now(timezone.utc).isoformat()}
        entry.setdefault("decision_log", []).append(record)
        _save_store()
        return {"rfp_id": rfp_id, "logged": record}
    except Exception as e:
        return err500(e)


# ====================== TEAM X DATASET -> CLASSIFIER GENERATION ======================
# A company uploads its past data (bid history / capability library as XLSX, CSV,
# or JSON). The system derives classifiers from it (sector keyword maps, win-rate
# stats, evidence index), stores them as JSON, and uses them for future analysis:
# the Chroma evidence index is rebuilt from the uploaded capability records, and
# win-rate statistics feed the 5-criteria score.
DATASET_DIR = os.path.join(os.path.dirname(__file__), "uploaded_datasets")


def _records_from_upload(dest: str) -> "tuple[pd.DataFrame | None, pd.DataFrame | None]":
    """Returns (bid_df, cap_df) — either may be None if not present in the file."""
    ext = os.path.splitext(dest)[1].lower()
    if ext in (".xlsx", ".xls"):
        import data_prep
        try:  # exact TEKROWE schema first
            bid, cap = data_prep.load_data(dest)
            return bid, cap
        except Exception:
            pass
        # generic xlsx: scan sheets for capability-like / bid-like columns
        xl = pd.ExcelFile(dest)
        bid = cap = None
        for sheet in xl.sheet_names:
            for header in (0, 1, 2):
                try:
                    df = pd.read_excel(dest, sheet_name=sheet, header=header)
                except Exception:
                    continue
                df.columns = [str(c).strip() for c in df.columns]
                if cap is None and {"Cap ID", "Domain"}.issubset(df.columns):
                    cap = df.dropna(subset=["Cap ID"]).copy()
                    break
                if bid is None and {"Bid ID", "Outcome"}.issubset(df.columns):
                    bid = df.dropna(subset=["Bid ID"]).copy()
                    break
        return bid, cap
    if ext == ".csv":
        df = pd.read_csv(dest)
    elif ext == ".json":
        with open(dest, "r", encoding="utf-8") as f:
            payload = _json_store.load(f)
        if isinstance(payload, dict):
            payload = (payload.get("capabilities") or payload.get("records")
                       or payload.get("data") or [])
        df = pd.DataFrame(payload)
    else:
        raise ValueError(f"Unsupported dataset format '{ext}'. Use XLSX, CSV, or JSON.")
    df.columns = [str(c).strip() for c in df.columns]
    if {"Bid ID", "Outcome"}.issubset(df.columns):
        return df, None
    return None, df  # default: treat flat records as capability/past-project data


def _build_classifiers(bid, cap) -> dict:
    """Derive transparent JSON classifiers from the company's own past data."""
    from datetime import datetime, timezone
    classifiers = {"generated_at": datetime.now(timezone.utc).isoformat(),
                   "source": "company_dataset", "version": 1}
    if cap is not None and len(cap):
        domain_col = next((c for c in ("Domain", "Sector", "Category") if c in cap.columns), None)
        if domain_col:
            domains = sorted(set(str(d).strip() for d in cap[domain_col].dropna()))
            classifiers["domain_classifier"] = {
                "type": "keyword",
                "labels": domains,
                "keywords": {d: [w.lower() for w in str(d).split() if len(w) > 2]
                             for d in domains},
            }
        cert_col = next((c for c in ("Certification", "Certifications") if c in cap.columns), None)
        if cert_col:
            classifiers["certifications"] = sorted(
                set(str(c).strip() for c in cap[cert_col].dropna() if str(c).strip() not in ("", "N/A")))
        classifiers["capability_records"] = int(len(cap))
    if bid is not None and len(bid) and "Outcome" in bid.columns:
        sec_col = "Sector" if "Sector" in bid.columns else None
        if sec_col:
            stats = {}
            for sector, grp in bid.groupby(sec_col):
                total = int(len(grp))
                won = int((grp["Outcome"].astype(str).str.strip() == "Win").sum())
                stats[str(sector)] = {"total": total, "won": won,
                                      "win_rate": round(100 * won / max(1, total), 1)}
            classifiers["sector_win_classifier"] = {"type": "historical_win_rate",
                                                    "stats": stats}
        classifiers["bid_records"] = int(len(bid))
    return classifiers


@app.post("/api/dataset/upload")
async def dataset_upload(file: UploadFile = File(...)):
    """Upload company past data (XLSX / CSV / JSON). Generates classifiers, stores
    them as JSON, and rebuilds the evidence index when capability records with the
    expected schema are present — so future RFP/RFQ/Tender analysis uses YOUR data."""
    try:
        os.makedirs(DATASET_DIR, exist_ok=True)
        dest = os.path.join(DATASET_DIR, os.path.basename(file.filename))
        with open(dest, "wb") as f:
            f.write(await file.read())

        bid, cap = _records_from_upload(dest)
        if bid is None and (cap is None or not len(cap)):
            return JSONResponse(status_code=400, content={
                "error": "No usable records found. Expected capability records "
                         "(Cap ID / Domain ...) and/or bid history (Bid ID / Outcome ...)."})

        classifiers = _build_classifiers(bid, cap)
        classifiers["source_file"] = os.path.basename(dest)

        # Rebuild the semantic evidence index from the uploaded data when it
        # carries the full capability schema (this is what powers matching).
        indexed = False
        full_schema = {"Cap ID", "Domain", "Certification", "Client Type",
                       "Contract Value", "Duration (months)", "Year Completed"}
        if cap is not None and full_schema.issubset(set(cap.columns)):
            try:
                import data_prep
                import rag_setup
                data_prep.EXCEL_PATH = dest if dest.lower().endswith((".xlsx", ".xls")) else data_prep.EXCEL_PATH
                if dest.lower().endswith((".xlsx", ".xls")):
                    rag_setup._collection = None
                    rag_setup.build_index()
                    _data_cache.clear()
                    indexed = True
            except Exception:
                indexed = False  # classifiers still saved; index rebuild is best-effort
        classifiers["evidence_index_rebuilt"] = indexed

        with open(CLASSIFIERS_PATH, "w", encoding="utf-8") as f:
            _json_store.dump(classifiers, f, indent=2, ensure_ascii=False)
        return {"status": "ok", "classifiers": classifiers,
                "classifiers_path": os.path.basename(CLASSIFIERS_PATH)}
    except Exception as e:
        return err500(e)


@app.get("/api/dataset/info")
def dataset_info():
    """Current generated classifiers (if a company dataset has been uploaded)."""
    try:
        if not os.path.exists(CLASSIFIERS_PATH):
            return {"status": "empty", "classifiers": None}
        with open(CLASSIFIERS_PATH, "r", encoding="utf-8") as f:
            return {"status": "ok", "classifiers": _json_store.load(f)}
    except Exception as e:
        return err500(e)
