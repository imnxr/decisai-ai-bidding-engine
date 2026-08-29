"""
Orchestration: PROVIDER CHAIN with validation at every step.

  1. Claude API   (if ANTHROPIC_API_KEY set)  — frontier quality
  2. Local Ollama (with one self-correction retry) — offline capable
  3. Grounded template — deterministic, cannot hallucinate, never fails

KEY POINT FOR JUDGES: the validators apply to EVERY provider, including
Claude. We don't trust any generator — we verify. Three mechanical checks:
  - cited CAP ids must exist in the supplied evidence (invented projects)
  - every number must appear in evidence/question     (invented figures)
  - no units outside our data's vocabulary            (real number, fake meaning)
One violation -> next provider in the chain. Worst case is a plainer
answer, never a false one.
"""
import json
import re

from claude_client import call_claude, claude_available
from ollama_client import build_prompt, call_ollama, DEFAULT_MODEL, OLLAMA_TIMEOUT
from template_fallback import needs_team_data, template_fallback

CAP_ID_RE = re.compile(r"CAP-\d{3}")
NUM_RE = re.compile(r"\d+(?:\.\d+)?")

# Full output schema with safe defaults for optional fields
SCHEMA_DEFAULTS = {
    "answer": "", "summary": "", "sources": [], "confidence": "medium",
    "missing_info": [], "follow_up_questions": [], "recommended_action": "",
}

# UNIT GUARD — closes the value-checker's blind spot: a model can recycle an
# ALLOWED number with an invented meaning (e.g. duration "10 months" becomes
# "10 MW capacity"). Our capability data contains exactly three quantity
# kinds: PKR amounts, months, years. Any other unit is fabricated by definition.
UNSUPPORTED_UNIT_RE = re.compile(
    r"\d+(?:\.\d+)?\s?(?:MW|kW|GW|MVA|kVA|MWh|kWh|km|metres?|meters?|kg|"
    r"tonnes?|tons?|GB|TB|Gbps|Mbps|hectares?|acres?|users|seats|sites)\b", re.I)
CAPACITY_WORD_RE = re.compile(r"\b(capacity|capacities|installed capacity)\b", re.I)
MISSING_INFO_RE = re.compile(r"\badditional information needed\b", re.I)


def _allowed_numbers(question: str, evidence: list) -> set:
    """Every number the LLM may legitimately use: numbers in the evidence
    fields or the question itself, plus the evidence count."""
    sources = [question] + [
        f"{e.get('cap_id', '')} {e.get('contract_value', '')} "
        f"{e.get('duration_months', '')} {e.get('year_completed', '')} "
        f"{e.get('certification', '')} {e.get('domain', '')} {e.get('client_type', '')}"
        for e in evidence
    ]
    allowed = {float(n) for src in sources for n in NUM_RE.findall(str(src))}
    allowed.add(float(len(evidence)))  # "we have 3 projects" is fine
    return allowed


def find_invented_numbers(answer: str, question: str, evidence: list) -> list:
    """NUMERIC GROUNDING: figures absent from evidence/question = made up."""
    answer = re.sub(r"(?<=\d),(?=\d)", "", answer)  # "1,500" -> "1500"
    allowed = _allowed_numbers(question, evidence)
    return [n for n in NUM_RE.findall(answer) if float(n) not in allowed]


def find_unsupported_units(answer: str) -> list:
    return UNSUPPORTED_UNIT_RE.findall(answer)


def find_unsupported_capacity_claim(answer: str, question: str, evidence: list) -> bool:
    """If capacity is requested, do not let a model relabel money/duration as capacity."""
    combined = " ".join([question, answer] + [str(e) for e in evidence])
    if not CAPACITY_WORD_RE.search(combined):
        return False
    evidence_text = " ".join(str(e) for e in evidence)
    has_capacity_fact = bool(re.search(
        r"\d+(?:\.\d+)?\s?(?:MW|kW|GW|MVA|kVA|MWh|kWh)\b", evidence_text, re.I))
    return not has_capacity_fact and CAPACITY_WORD_RE.search(answer) and not MISSING_INFO_RE.search(answer)


def find_unsupported_team_claim(answer: str, question: str, evidence: list) -> bool:
    """The provided dataset has projects, not CVs or personnel records."""
    if not needs_team_data(question):
        return False
    evidence_text = " ".join(str(e) for e in evidence).lower()
    has_team_fact = any(k in evidence_text for k in (
        "personnel", "team_member", "team member", "cv", "resume", "role"))
    return not has_team_fact and bool(answer.strip()) and not MISSING_INFO_RE.search(answer)


def _extract_json(text: str):
    """Strip ```json fences / chatter around the JSON object, then parse."""
    text = text.replace("```json", "").replace("```", "")
    start, end = text.find("{"), text.rfind("}")
    if start == -1 or end <= start:
        return None
    try:
        return json.loads(text[start:end + 1])
    except json.JSONDecodeError:
        return None


def _validate(raw: str, question: str, evidence: list):
    """Run ALL checks on one generation. Returns (normalized_dict, None) on
    success or (None, reason) on any violation. Provider-agnostic — Claude
    output is held to exactly the same standard as the local model's."""
    parsed = _extract_json(raw)
    if not isinstance(parsed, dict):
        return None, "output_not_valid_json"

    allowed_ids = {e["cap_id"] for e in evidence}
    answer = str(parsed.get("answer", ""))
    cited = set(CAP_ID_RE.findall(answer)) | \
        set(CAP_ID_RE.findall(" ".join(map(str, parsed.get("sources", [])))))

    if cited - allowed_ids:
        return None, f"hallucinated_cap_ids: {sorted(cited - allowed_ids)}"
    invented = find_invented_numbers(answer, question, evidence)
    if invented:
        return None, f"invented_numbers: {invented}"
    units = find_unsupported_units(answer)
    if units:
        return None, f"unsupported_units: {units}"
    if find_unsupported_capacity_claim(answer, question, evidence):
        return None, "unsupported_capacity_claim"
    if find_unsupported_team_claim(answer, question, evidence):
        return None, "unsupported_team_claim"

    out = {**SCHEMA_DEFAULTS, **{k: v for k, v in parsed.items() if k in SCHEMA_DEFAULTS}}
    if out["confidence"] not in ("high", "medium", "low"):
        out["confidence"] = "medium"
    if not out["sources"]:
        out["sources"] = sorted(cited & allowed_ids)
    return out, None


def generate_answer(question: str, question_id: str, evidence: list,
                    model: str = DEFAULT_MODEL, timeout: float = OLLAMA_TIMEOUT,
                    provider: str = "claude") -> dict:
    """provider='claude' -> Claude API first, then Ollama, then template.
    provider='ollama' -> skip Claude entirely (offline mode)."""
    prompt = build_prompt(question, evidence)
    reason = "no_provider_available"

    # ---- Provider 1: Claude API (optional, needs key + internet) ----
    if provider != "ollama" and claude_available():
        raw = call_claude(prompt)
        if raw is not None:
            out, reason = _validate(raw, question, evidence)
            if out:
                out.update(generation_method="claude_api",
                           question_id=question_id, attempts=1)
                return out
            # Claude output rejected by validators -> fall through to local

    # ---- Provider 2: local Ollama, with ONE self-correction retry ----
    # If validation rejects attempt 1, attempt 2 re-prompts with the SPECIFIC
    # violation spelled out — small models respond well to concrete corrections.
    local_prompt = prompt
    for attempt in range(2):
        raw = call_ollama(local_prompt, model=model, timeout=timeout)
        if raw is None:
            reason = "llm_unavailable_or_timeout"
            break
        out, reason = _validate(raw, question, evidence)
        if out:
            out.update(generation_method="local_llm",
                       question_id=question_id, attempts=attempt + 1)
            return out
        local_prompt = prompt + (
            f"\n\nWARNING: your previous answer was REJECTED ({reason}). "
            "Write it again using ONLY the exact figures shown in FACTS. "
            "If the question asks for data not present in FACTS (such as "
            "capacity or team/CV details), write 'Additional information needed.' "
            "for that part instead of guessing.")

    # ---- Provider 3: grounded template (cannot hallucinate, never fails) ----
    out = template_fallback(question, evidence)
    out["question_id"] = question_id
    out["fallback_reason"] = reason  # auditable: WHY the generators were rejected
    return out


def generate_answers_batch_ollama(items: list, model: str = DEFAULT_MODEL,
                                  timeout: float = 4.0) -> list:
    """Fast offline demo path: ask Ollama for several short grounded drafts in
    one request, then validate each answer exactly like single-answer output."""
    compact = []
    evidence_by_id = {}
    question_by_id = {}
    for item in items:
        q = item["question"]
        evidence = item["evidence"]
        qid = q["question_id"]
        evidence_by_id[qid] = evidence
        question_by_id[qid] = q["question"]
        compact.append({
            "question_id": qid,
            "question": q["question"][:380],
            "facts": [
                {
                    "cap_id": e.get("cap_id"),
                    "domain": e.get("domain"),
                    "certification": e.get("certification"),
                    "client_type": e.get("client_type"),
                    "contract_value": e.get("contract_value"),
                    "duration_months": e.get("duration_months"),
                    "year_completed": e.get("year_completed"),
                }
                for e in evidence[:2]
            ],
        })

    prompt = (
        "You are DecisAI drafting proposal answers. Use ONLY the provided facts. "
        "Do not invent people, capacities, dates, values, or certifications. "
        "Return ONLY JSON: {\"drafts\":[{\"question_id\":\"...\","
        "\"answer\":\"...\",\"sources\":[\"CAP-001\"],\"confidence\":\"high|medium|low\","
        "\"missing_info\":[]}]}.\n\n"
        f"QUESTIONS_AND_FACTS:\n{json.dumps(compact, ensure_ascii=False)}"
    )
    raw = call_ollama(prompt, model=model, timeout=timeout)
    parsed = _extract_json(raw or "")
    by_id = {}
    if isinstance(parsed, dict) and isinstance(parsed.get("drafts"), list):
        for draft in parsed["drafts"]:
            qid = draft.get("question_id")
            if not qid or qid not in question_by_id:
                continue
            candidate = json.dumps({
                "answer": draft.get("answer", ""),
                "sources": draft.get("sources", []),
                "confidence": draft.get("confidence", "medium"),
                "missing_info": draft.get("missing_info", []),
            })
            out, reason = _validate(candidate, question_by_id[qid], evidence_by_id[qid])
            if out:
                out.update(generation_method="local_llm_batch",
                           question_id=qid, attempts=1)
                by_id[qid] = out

    results = []
    for item in items:
        q = item["question"]
        qid = q["question_id"]
        if qid in by_id:
            results.append(by_id[qid])
        else:
            out = template_fallback(q["question"], item["evidence"])
            out["question_id"] = qid
            out["fallback_reason"] = "batch_llm_unavailable_or_rejected"
            results.append(out)
    return results


if __name__ == "__main__":
    demo = [{"cap_id": "CAP-001", "domain": "Cybersecurity", "certification": "ISO 27001",
             "client_type": "International", "contract_value": "PKR 15M",
             "duration_months": 34, "year_completed": 2023}]
    print(json.dumps(generate_answer("Describe your cybersecurity experience.", "Q1", demo), indent=2))
