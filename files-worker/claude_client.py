"""
Optional Claude API provider — the QUALITY tier of the provider chain.

Chain: Claude API (if ANTHROPIC_API_KEY set) -> local Ollama -> template.
The system never requires Claude: without a key or internet, the local path
still works with Ollama and the deterministic fallback.

Local setup: copy `files-worker/.env.example` to `files-worker/.env` and set
your own `ANTHROPIC_API_KEY` only when you intentionally enable Claude.
Never commit `.env`. A real environment variable takes precedence.
"""
import os
import requests

# ---- Optional .env auto-load ----
# This file contains no credential. It only reads a developer's local .env.
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
    pass

CLAUDE_URL = "https://api.anthropic.com/v1/messages"
CLAUDE_MODEL = os.environ.get("CLAUDE_MODEL", "claude-haiku-4-5-20251001")


def claude_available() -> bool:
    disabled = os.environ.get("DISABLE_CLAUDE", "").lower() in ("1", "true", "yes")
    return bool(os.environ.get("ANTHROPIC_API_KEY")) and not disabled


def call_claude(prompt: str, timeout: float = 20, max_tokens: int = 500) -> "str | None":
    """Return generated text, or None on any failure so the provider chain can fall back."""
    if not claude_available():
        return None
    try:
        r = requests.post(
            CLAUDE_URL,
            json={
                "model": CLAUDE_MODEL,
                "max_tokens": max_tokens,
                "messages": [{"role": "user", "content": prompt}],
            },
            headers={
                "x-api-key": os.environ["ANTHROPIC_API_KEY"],
                "anthropic-version": "2023-06-01",
                "content-type": "application/json",
            },
            timeout=timeout,
        )
        r.raise_for_status()
        return r.json()["content"][0]["text"]
    except Exception:
        return None
