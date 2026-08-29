"""
PART 4 — Rule-based grounded template. ZERO external dependencies, <10ms.

This is the safety net: if the local LLM is down, slow, or hallucinates,
we still return a valid, fully-grounded answer built purely from retrieved
evidence. Every fact in the output comes verbatim from the evidence dicts,
so this path CANNOT hallucinate by construction.
"""
import re


TEAM_DATA_RE = re.compile(
    r"\b(team|personnel|staff|cv|cvs|resume|resumes|key personnel|"
    r"project manager|engineer|engineers|organizational structure)\b", re.I)


def needs_team_data(question: str) -> bool:
    return bool(TEAM_DATA_RE.search(question))


def template_fallback(question: str, evidence: list) -> dict:
    if needs_team_data(question):
        return {
            "answer": "",
            "summary": "Team/CV data is not present in the provided capability dataset.",
            "sources": [],
            "confidence": "low",
            "missing_info": [
                "Key personnel names, roles, CVs, and staff certifications are not available in the dataset."
            ],
            "follow_up_questions": [
                "Which project manager and technical leads should be proposed?",
                "Can the bid manager attach CVs and personnel certifications?",
            ],
            "recommended_action": "Bid manager/technical team to provide team structure and CV evidence.",
            "generation_method": "template_fallback",
        }

    if not evidence:
        return {
            "answer": "",
            "summary": "No matching past-project evidence found for this question.",
            "sources": [],
            "confidence": "low",
            "missing_info": [f"No capability evidence found for: '{question}'"],
            "follow_up_questions": [
                "Do we have undocumented experience relevant to this requirement?",
                "Can a partner or subcontractor cover this requirement?",
            ],
            "recommended_action": "Manager to provide evidence.",
            "generation_method": "template_fallback",
        }

    sentences = [
        (f"Our company completed project {e['cap_id']} in the {e['domain']} domain "
         f"({e['certification']}, {e['contract_value']}, {e['duration_months']} months, "
         f"completed {e['year_completed']}).")
        for e in evidence
    ]
    return {
        "answer": " ".join(sentences),
        "summary": (f"{len(evidence)} relevant past project(s) found in domains: "
                    f"{', '.join(sorted({e['domain'] for e in evidence}))}."),
        "sources": [e["cap_id"] for e in evidence],
        "confidence": "high" if len(evidence) >= 2 else "medium",
        "missing_info": [],
        "follow_up_questions": [],
        "recommended_action": "Review draft and tailor wording to the RFP question.",
        "generation_method": "template_fallback",
    }


if __name__ == "__main__":
    demo = [{"cap_id": "CAP-001", "domain": "Cybersecurity", "certification": "ISO 27001",
             "client_type": "International", "contract_value": "PKR 15M",
             "duration_months": 34, "year_completed": 2023}]
    import json
    print(json.dumps(template_fallback("Describe your cybersecurity experience.", demo), indent=2))
    print(json.dumps(template_fallback("Anything?", []), indent=2))
