"""
Optional Claude API provider — the QUALITY tier of the provider chain.

Chain: Claude API (if ANTHROPIC_API_KEY set) -> local Ollama -> template.
The system never *requires* this: without a key or internet, everything
still works locally. With it, narrative quality is frontier-grade.

Local setup: copy `module1/.env.example` to `.env` and set your own
`ANTHROPIC_API_KEY` only when you want to use Claude. Never commit `.env`.
A real environment variable takes precedence over the local file.
"""
import os
import requests

# ---- .env auto-load: set the key ONCE in module1/.env and forget it ----
# Lines like  ANTHROPIC_API_KEY=sk-ant-...  (no quotes needed).
# No python-dotenv dependency required.
_ENV_PATH = os.path.join(os.path.dirname(__file__), ".env")
try:
    if os.path.exists(_ENV_PATH):
        with open(_ENV_PATH, "r", encoding="utf-8") as _f:
            for _line in _f:
                _line = _line.strip()
                if not _line or _line.startswith("#") or "=" not in _line:
                    continue
                _k, _v = _line.split("=", 1)
                _k, _v = _k.strip(), _v.strip().strip('"').strip("'")
                if _k and _v and _k not in os.environ:
                    os.environ[_k] = _v
except Exception:
    pass  # a broken .env must never stop the server

CLAUDE_URL = "https://api.anthropic.com/v1/messages"
# haiku = fastest/cheapest, plenty for short grounded paragraphs.
# Override with CLAUDE_MODEL=claude-sonnet-4-6 for maximum quality.
CLAUDE_MODEL = os.environ.get("CLAUDE_MODEL", "claude-haiku-4-5-20251001")


def claude_available() -> bool:
    disabled = os.environ.get("DISABLE_CLAUDE", "").lower() in ("1", "true", "yes")
    return bool(os.environ.get("ANTHROPIC_API_KEY")) and not disabled


def call_claude(prompt: str, timeout: float = 20, max_tokens: int = 500) -> "str | None":
    """Same contract as call_ollama: text on success, None on ANY failure
    (no key, no internet, rate limit, ...) so the chain just moves on.
    max_tokens: 500 suffices for drafts; extraction needs ~2000 (a truncated
    JSON fails parsing and silently falls back to regex)."""
    if not claude_available():
        return None
    try:
        r = requests.post(CLAUDE_URL, json={
            "model": CLAUDE_MODEL,
            "max_tokens": max_tokens,
            "messages": [{"role": "user", "content": prompt}],
        }, headers={
            "x-api-key": os.environ["ANTHROPIC_API_KEY"],
            "anthropic-version": "2023-06-01",
            "content-type": "application/json",
        }, timeout=timeout)
        r.raise_for_status()
        return r.json()["content"][0]["text"]
    except Exception:
        return None  # fall through to local model — never crash the demo
