# Security Notes

- Do not commit `.env` files or API keys.
- Claude integration is optional and uses `ANTHROPIC_API_KEY` from the local environment.
- The local Ollama path does not require an API key.
- Uploaded tender/RFP files and local runtime state are ignored by Git.
- The repository intentionally excludes local ChromaDB runtime files and trained model artifacts so they can be regenerated locally.
