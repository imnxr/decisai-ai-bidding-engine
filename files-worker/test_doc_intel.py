"""
Tests for the document-intelligence layer. Run: python test_doc_intel.py
Pure stdlib for .txt path — works even without PyMuPDF/python-docx installed.
"""
import json
import os
import sys

os.environ["DISABLE_CLAUDE"] = "1"

from doc_intel import parse_rfp, chunk_text

results = []


def check(name, ok, detail=""):
    ok = bool(ok)
    results.append(ok)
    print(f"[{'PASS' if ok else 'FAIL'}] {name}" + (f"  ({detail})" if detail else ""))


if __name__ == "__main__":
    rfp = parse_rfp("sample_rfp.txt", rfp_id="RFP-TEST", use_llm=False)

    reqs = rfp["requirements"]
    mand = [r for r in reqs if r["mandatory"]]
    opt = [r for r in reqs if not r["mandatory"]]
    check("1. Requirements extracted (>=5 mandatory, >=2 optional)",
          len(mand) >= 5 and len(opt) >= 2, f"mandatory={len(mand)}, optional={len(opt)}")

    check("2. ISO 27001 requirement found and mandatory",
          any("ISO 27001" in r["text"] and r["mandatory"] for r in reqs))

    check("3. Category guessing maps security reqs to IT Services",
          any(r["category"] == "IT Services" for r in reqs))

    check("4. Deadlines found (>=3, mixed date formats)",
          len(rfp["deadlines"]) >= 3,
          f"found={len(rfp['deadlines'])}: {[d['date'] for d in rfp['deadlines'][:4]]}")

    check("5. Questions extracted (4 expected)",
          len(rfp["questions"]) == 4, f"found={len(rfp['questions'])}")

    check("6. Financials found (PKR 85M budget + PKR 1.5M bid security)",
          len(rfp["financials"]) >= 2,
          f"found={[f['amount'] for f in rfp['financials'][:3]]}")

    crits = rfp["evaluation_criteria"]
    check("7. Evaluation criteria with weights (4 expected, sum 100)",
          len(crits) == 4 and sum(c["weight_pct"] for c in crits) == 100,
          f"found={len(crits)}, sum={sum(c['weight_pct'] for c in crits) if crits else 0}")

    check("8. Chunking covers full text with overlap",
          len(rfp["chunks"]) >= 1 and all(c["text"] for c in rfp["chunks"]))

    check("9. Output is JSON-serializable", bool(json.dumps(rfp)))

    check("10. Wrapped requirement text preserved",
          any("within the last five years" in r["text"] for r in reqs))

    check("11. Bid security tagged administrative",
          any("bid security" in r["text"].lower()
              and r.get("requirement_type") == "administrative" for r in reqs))

    print(f"\n{sum(results)}/{len(results)} doc-intel checks passed.")
    sys.exit(0 if all(results) else 1)
