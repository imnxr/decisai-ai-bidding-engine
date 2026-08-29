"""
PART 8 — Test script. Run: python test_module1.py
Prints PASS/FAIL per check. All checks work offline (LLM checks gracefully
exercise the fallback path if Ollama isn't running).
"""
import json
import os
import sys

os.environ["DISABLE_CLAUDE"] = "1"

import joblib

from data_prep import parse_pkr
from main import match_requirement
from rag_setup import retrieve_evidence, build_index
from train_models import compliance_status, MODEL_A_PATH
from llm_module import (generate_answer, find_invented_numbers,
                        find_unsupported_team_claim,
                        find_unsupported_units, CAP_ID_RE)
from template_fallback import template_fallback

SCHEMA_KEYS = {"answer", "summary", "sources", "confidence", "missing_info",
               "follow_up_questions", "recommended_action", "generation_method"}

results = []


def check(name, ok, detail=""):
    ok = bool(ok)  # coerce: `x and y` returns the last operand, not True/False
    results.append(ok)
    print(f"[{'PASS' if ok else 'FAIL'}] {name}" + (f"  ({detail})" if detail else ""))


def valid_schema(d):
    return isinstance(d, dict) and SCHEMA_KEYS.issubset(d.keys()) and \
        d["confidence"] in ("high", "medium", "low")


if __name__ == "__main__":
    build_index()  # ensure fresh index

    # 1. Normal query: ISO 27001 -> PASS with 2+ ISO 27001 caps in evidence
    ev = retrieve_evidence("ISO 27001 certification required", "IT Services", k=5)
    iso = [e for e in ev if e["certification"] == "ISO 27001"]
    strong = sum(1 for e in ev if e["similarity_score"] >= 0.45)
    status = compliance_status(True, strong, len(ev) - strong)
    check("1. ISO 27001 query -> PASS, 2+ ISO caps",
          status == "PASS" and len(iso) >= 2, f"status={status}, iso_caps={len(iso)}")

    # 2. Irrelevant query -> low confidence / near-empty sources
    ev2 = retrieve_evidence("What is your favorite color?", "", k=5)
    resp2 = template_fallback("What is your favorite color?", ev2)
    check("2. Irrelevant query -> low confidence",
          len(ev2) == 0 and resp2["confidence"] == "low", f"matches={len(ev2)}")

    # 3. Missing evidence: no Port-logistics domain exists -> FAIL (mandatory) / INFO (optional)
    ev3 = retrieve_evidence("Deep-sea port logistics experience", "", k=5)
    s3 = sum(1 for e in ev3 if e["similarity_score"] >= 0.45)
    st_m = compliance_status(True, s3, len(ev3) - s3)
    st_o = compliance_status(False, s3, len(ev3) - s3)
    check("3. Port logistics -> FAIL/PARTIAL (mandatory), INFO/PARTIAL (optional)",
          st_m in ("FAIL", "PARTIAL") and st_o in ("INFO", "PARTIAL"),
          f"mandatory={st_m}, optional={st_o}")

    # 4. Hallucination check: only CAP-001/002 supplied -> no other CAP id in answer
    ev4 = [
        {"cap_id": "CAP-001", "domain": "Cybersecurity", "certification": "ISO 27001",
         "client_type": "International", "contract_value": "PKR 15M",
         "duration_months": 34, "year_completed": 2023},
        {"cap_id": "CAP-002", "domain": "ERP Implementation", "certification": "N/A",
         "client_type": "Federal Govt", "contract_value": "PKR 159M",
         "duration_months": 14, "year_completed": 2021},
    ]
    r4 = generate_answer("Describe your IT experience.", "Q4", ev4)
    cited = set(CAP_ID_RE.findall(r4["answer"]))
    check("4. No hallucinated CAP ids", cited <= {"CAP-001", "CAP-002"},
          f"cited={sorted(cited)}, method={r4['generation_method']}")

    # 5. JSON validity: 10 questions, all valid schema dicts
    questions = ["Describe cybersecurity experience", "Solar energy projects?",
                 "Bridge engineering capability", "Hospital IT systems",
                 "Mobile banking apps", "Cloud infrastructure", "ERP rollouts",
                 "Fleet management", "LMS platforms", "Road construction record"]
    ok5 = True
    for i, q in enumerate(questions):
        e = retrieve_evidence(q, "", k=3)
        r = generate_answer(q, f"Q5-{i}", e)
        if not valid_schema(r):
            ok5 = False
    check("5. 10/10 responses valid schema", ok5)

    # 6. Offline test (manual)
    print("[INFO] 6. Offline test: disconnect wifi, re-run this script — all "
          "checks must still pass (embeddings + Ollama are local).")

    # 7. Forced timeout -> template fallback still returns valid response
    r7 = generate_answer("Describe your cybersecurity experience.", "Q7",
                         ev4, timeout=0.001)
    check("7. Timeout -> template_fallback, valid schema",
          r7["generation_method"] == "template_fallback" and valid_schema(r7))

    # 8. Model A metrics (document these numbers for the judges)
    try:
        b = joblib.load(MODEL_A_PATH)
        check("8. Model A loaded", True,
              f"test accuracy={b['test_accuracy']:.2%}, F1={b['test_f1']:.2f}")
    except Exception as e:
        check("8. Model A loaded", False, f"run train_models.py first ({e})")

    # 9. parse_pkr correctness
    check("9. parse_pkr", parse_pkr("PKR 22M") == 22_000_000.0
          and parse_pkr("PKR 5.5M") == 5_500_000.0)

    # 10. End-to-end: requirement -> retrieve -> classify -> generate -> valid JSON
    ev10 = retrieve_evidence("ISO 27001 certified information security", "IT Services")
    s10 = sum(1 for e in ev10 if e["similarity_score"] >= 0.45)
    st10 = compliance_status(True, s10, len(ev10) - s10)
    r10 = generate_answer("Describe your information security capability.", "Q10", ev10)
    try:
        json.dumps(r10)  # verify response is JSON-serializable
        serializable = True
    except (TypeError, ValueError):
        serializable = False
    check("10. End-to-end pipeline", st10 in ("PASS", "PARTIAL") and valid_schema(r10)
          and serializable, f"status={st10}, method={r10['generation_method']}")

    # 11. Numeric grounding validator: invented figures (e.g. "5 MW") are caught,
    # while answers using only evidence numbers pass.
    ok_ans = "We completed a 34-month project (CAP-001) valued at PKR 15M in 2023."
    bad_ans = "Our 5 MW solar plant (CAP-001) was delivered in 2023."
    check("11. Numeric grounding validator",
          not find_invented_numbers(ok_ans, "Describe your experience", ev4)
          and find_invented_numbers(bad_ans, "Describe your experience", ev4) == ["5"])

    # 12. Unit guard: an ALLOWED number recycled with an invented unit
    # ("34 months" -> "34 MW") must be caught; normal money/duration text passes.
    check("12. Unit guard (recycled number, invented meaning)",
          find_unsupported_units("Installed capacity of 34 MW (CAP-001).")
          and not find_unsupported_units(ok_ans))

    # 13. Admin/financial clauses are tracked as INFO, not matched to random
    # capability records. This prevents false PASS rows for bid-security clauses.
    admin = match_requirement("R-ADMIN", "A bid security of PKR 4.2M must accompany each proposal.", "", True)
    check("13. Administrative clause -> INFO with no evidence",
          admin["status"] == "INFO" and admin["evidence"] == []
          and admin["requirement_type"] == "administrative")

    # 14. Team/CV questions cannot be answered from project-only evidence.
    # This prevents fake staffing claims like "CAP-021 is a team member".
    team_q = "Describe your project team and relevant certifications?"
    fake_team = "Our project team includes CAP-001 as project manager."
    team_resp = template_fallback(team_q, ev4)
    check("14. Team/CV question -> human review required",
          find_unsupported_team_claim(fake_team, team_q, ev4)
          and team_resp["confidence"] == "low"
          and team_resp["answer"] == ""
          and team_resp["missing_info"])

    # results contains only booleans (check() coerces); [INFO] lines are never counted.
    print(f"\n{sum(results)}/{len(results)} automated checks passed.")
    sys.exit(0 if all(results) else 1)
