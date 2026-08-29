"""
PART 5 — Local LLM via Ollama's HTTP API. Never raises: returns None on any failure
so the orchestrator (llm_module.py) can fall back to the template.
"""
import os
import requests

OLLAMA_URL = "http://localhost:11434/api/generate"
# qwen2.5:1.5b is the default offline model (matches the UI selector).
# Override without code changes via: set OLLAMA_MODEL=qwen2.5:1.5b
DEFAULT_MODEL = os.environ.get("OLLAMA_MODEL", "qwen2.5:1.5b")
OLLAMA_TIMEOUT = float(os.environ.get("OLLAMA_TIMEOUT", "12"))
OLLAMA_NUM_GPU = int(os.environ.get("OLLAMA_NUM_GPU", "0"))  # CPU mode avoids CUDA OOM
OLLAMA_NUM_PREDICT = int(os.environ.get("OLLAMA_NUM_PREDICT", "140"))
OLLAMA_NUM_CTX = int(os.environ.get("OLLAMA_NUM_CTX", "1024"))
OLLAMA_KEEP_ALIVE = os.environ.get("OLLAMA_KEEP_ALIVE", "10m")

# Short system prompt + ONE few-shot example: small local models follow a
# concrete example far better than long lists of rules.
SYSTEM = (
    "You write short, factual proposal text for a company bidding on a government "
    "tender. Use ONLY the project facts given below. Do not add any other facts. "
    "Do not invent any numbers, capacities, or measurements — use only the exact "
    "figures shown in FACTS. If the facts don't fully answer the question, say "
    "'Additional information needed.' Output ONLY JSON in the exact format shown "
    "in the example."
)

FEW_SHOT = """EXAMPLE INPUT:
QUESTION: Describe your cybersecurity experience.
FACTS:
- CAP-001 | Cybersecurity | ISO 27001 | International | PKR 15M | 34 months | 2023

EXAMPLE OUTPUT:
{"answer": "Our company completed a 34-month cybersecurity project (CAP-001) for an international client, valued at PKR 15M, certified to ISO 27001.", "sources": ["CAP-001"], "confidence": "high", "missing_info": []}"""


def evidence_lines(evidence: list) -> str:
    return "\n".join(
        f"- {e['cap_id']} | {e['domain']} | {e['certification']} | {e['client_type']} | "
        f"{e['contract_value']} | {e['duration_months']} months | {e['year_completed']}"
        for e in evidence
    ) or "- (no facts available)"


def build_prompt(question: str, evidence: list) -> str:
    return (f"SYSTEM:\n{SYSTEM}\n\n{FEW_SHOT}\n\nACTUAL QUERY:\n"
            f"QUESTION: {question}\nFACTS:\n{evidence_lines(evidence)}\n\nOutput JSON now:")


def call_ollama(prompt: str, model: str = DEFAULT_MODEL, timeout: float = OLLAMA_TIMEOUT) -> "str | None":
    """Returns generated text, or None on ANY error/timeout (never raises)."""
    try:
        r = requests.post(OLLAMA_URL, json={
            "model": model,
            "prompt": prompt,
            "stream": False,
            "keep_alive": OLLAMA_KEEP_ALIVE,
            # Ollama's JSON mode: constrains decoding so output is always
            # syntactically valid JSON — removes the parse-failure fallback path.
            # (Content can still be wrong; our validators handle that.)
            "format": "json",
            # low temp = less drift; num_ctx=2048 caps the KV cache so the
            # model fits in RAM on 8GB machines (our prompts are well under 2k tokens)
            "options": {"temperature": 0.1, "num_predict": OLLAMA_NUM_PREDICT,
                        "num_ctx": OLLAMA_NUM_CTX, "num_gpu": OLLAMA_NUM_GPU},
        }, timeout=timeout)
        r.raise_for_status()
        return r.json().get("response")
    except Exception:
        return None  # caller decides to fall back; demo must never crash here


if __name__ == "__main__":
    out = call_ollama("Say hello in 3 words.")
    print("Ollama reachable!" if out else "Ollama NOT reachable (fallback would be used).")
    if out:
        print(out)
