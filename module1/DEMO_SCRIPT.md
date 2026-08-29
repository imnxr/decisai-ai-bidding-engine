# Demo Script — 5 minutes (rehearse twice!)

## Before going on stage (15 min prior)
- [ ] Close Chrome tabs you don't need (RAM!)
- [ ] `ollama run qwen2.5:1.5b "hello"` — warm the model
- [ ] Start uvicorn, hit `/health`, upload the PDF once, run one /match (warms embeddings)
- [ ] Wi-Fi OFF. Everything keeps working. Leave it off.

## The 5 minutes

**[0:00] Hook (say this first):**
"Companies lose tenders because responding takes weeks of manual work. We built an
engine that reads an RFP, checks compliance against real past projects, drafts
grounded answers, and gives a GO/NO-GO call — fully offline, on this laptop,
because tender documents are confidential. Wi-Fi is off right now."

**[0:30] Upload** the OGDCL solar PDF → extraction summary appears in seconds.
"Requirements, deadlines, evaluation criteria, financials — structured automatically."

**[1:00] Compliance matrix** (/match): "Each requirement matched semantically against
our 50-project capability library. Solar requirement → our four real solar projects,
with similarity scores."

**[2:00] The differentiator — say it slowly:**
"Local LLMs hallucinate. We don't trust ours. Three validators check every answer:
cited project IDs must exist in the evidence; every NUMBER must appear in our data;
and units — when the model turned '10 months' into '10 megawatts', we catch that too.
If validation fails, the model gets ONE retry with the exact violation explained.
Still wrong? A deterministic template answers from pure facts."
→ Run the Q-001 draft. Whatever happens is a win:
   - attempts: 2 → "it hallucinated, we caught it, it corrected itself — live"
   - fallback_reason → "it kept inventing capacity figures, so the system refused
     to ship them. The worst case is a plainer answer, never a false one."

**[3:30] GO/NO-GO** (/decision): "Trained RandomForest on 120 real historical bids
— win probability 90%, all mandatory requirements covered: GO."

**[4:00] Close:** "Zero API calls, zero data leaving the machine, every claim
traceable to a project ID. That's AI you can put in front of a procurement officer."

## Q&A — they WILL ask these

**"100% accuracy? Overfit much?"**
"Fair challenge. 24-row test set, and one feature dominates — internal bid score
(Win avg 82.8 vs Loss 56.7 in the data). The model's feature importances confirm it
learned the real pattern, including that compliance % alone does NOT predict wins,
which matches the raw data. With 120 rows we report it transparently rather than
inflate the task."

**"Why is compliance classification rule-based, not ML?"**
"The dataset has no PASS/FAIL labels. Training on labels we invented would be
fake ML. We'd rather show one honest trained model than two dishonest ones."

**"What can't your validators catch?"**
"Non-numeric attribute swaps — calling an international client 'provincial'.
That needs claim-level NLI, out of scope here. It's why every draft ships with
'review before use' — the human stays in the loop. We know exactly where our
guarantees end."

**"Why Ollama / why not X?"**
"LM Studio, llamafile, GPT4All all wrap the same llama.cpp engine. Ollama gave us
clean model-server/orchestration separation, JSON-constrained decoding, and the
LLM is optional anyway — the template fallback means the system works with no
model at all."

## If something breaks on stage
- Draft endpoint slow/fails → use_llm:false — instant, grounded, still impressive.
- Server dies → restart uvicorn + re-upload (15 seconds; practice it once).
- Total disaster → test_module1.py output screenshots tell the whole story.
