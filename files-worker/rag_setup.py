"""
PART 3 — Local embeddings + ChromaDB retrieval. Fully offline after first model download.
"""
import os
import chromadb
from sentence_transformers import SentenceTransformer

from data_prep import load_data, SECTOR_TO_DOMAINS

EMBED_MODEL_NAME = "all-MiniLM-L6-v2"   # 80MB, CPU-friendly, cached locally after 1st run
CHROMA_PATH = os.path.join(os.path.dirname(__file__), "chroma_db")
COLLECTION_NAME = "capabilities"

SIM_THRESHOLD = 0.30   # below this cosine similarity = "no match" (tune if time allows)
DOMAIN_BOOST = 0.05    # small nudge for capabilities in the requirement's mapped domains

_model = None
_collection = None


def get_model() -> SentenceTransformer:
    global _model
    if _model is None:
        # WHY local_files_only first: with wifi off, the HF hub library tries a
        # network HEAD check BEFORE using the cache and crashes (getaddrinfo
        # failed). Loading cache-only first works both offline and online once
        # the model has been downloaded; the fallback handles first-ever setup.
        try:
            _model = SentenceTransformer(EMBED_MODEL_NAME, local_files_only=True)
        except Exception:
            _model = SentenceTransformer(EMBED_MODEL_NAME)  # first download (needs internet)
    return _model


def build_index():
    """Embed all 50 enriched capability texts into a persistent Chroma collection."""
    _, cap = load_data()
    client = chromadb.PersistentClient(path=CHROMA_PATH)
    try:
        client.delete_collection(COLLECTION_NAME)  # rebuild cleanly each time
    except Exception:
        pass
    col = client.create_collection(COLLECTION_NAME, metadata={"hnsw:space": "cosine"})

    embeddings = get_model().encode(cap["embed_text"].tolist(), show_progress_bar=False)
    col.add(
        ids=cap["Cap ID"].tolist(),
        embeddings=embeddings.tolist(),
        documents=cap["embed_text"].tolist(),
        metadatas=[{
            "cap_id": r["Cap ID"], "domain": r["Domain"],
            "certification": r["Certification"], "client_type": r["Client Type"],
            "contract_value": str(r["Contract Value"]),
            "duration_months": int(r["Duration (months)"]),
            "year": int(r["Year Completed"]),
        } for _, r in cap.iterrows()],
    )
    print(f"Indexed {col.count()} capabilities -> {CHROMA_PATH}")
    return col


def get_collection():
    global _collection
    if _collection is None:
        client = chromadb.PersistentClient(path=CHROMA_PATH)
        try:
            _collection = client.get_collection(COLLECTION_NAME)
        except Exception:
            _collection = build_index()  # auto-build on first use
    return _collection


def retrieve_evidence(requirement_text: str, requirement_category: str = "", k: int = 5):
    """
    Semantic search over the capability library.
    Returns list of evidence dicts sorted by (boosted) similarity, best first.
    Items below SIM_THRESHOLD are dropped — an empty list means "no evidence".
    """
    col = get_collection()
    q_emb = get_model().encode([requirement_text])[0].tolist()
    # 50 records is tiny: over-fetch, then boost + threshold + trim. Cheap and simple.
    res = col.query(query_embeddings=[q_emb], n_results=min(15, col.count()))

    # Map the requirement's category (a bid Sector) to capability Domains for boosting
    boost_domains = set(SECTOR_TO_DOMAINS.get(requirement_category, []))

    out = []
    for meta, dist in zip(res["metadatas"][0], res["distances"][0]):
        sim = 1.0 - dist  # chroma cosine space returns distance = 1 - cos_sim
        if meta["domain"] in boost_domains:
            sim += DOMAIN_BOOST
        if sim < SIM_THRESHOLD:
            continue
        out.append({
            "cap_id": meta["cap_id"],
            "domain": meta["domain"],
            "certification": meta["certification"],
            "client_type": meta["client_type"],
            "contract_value": meta["contract_value"],
            "duration_months": meta["duration_months"],
            "year_completed": meta["year"],
            "similarity_score": round(sim, 3),
        })
    out.sort(key=lambda e: -e["similarity_score"])
    return out[:k]


if __name__ == "__main__":
    build_index()
    for ev in retrieve_evidence("ISO 27001 certified cybersecurity experience", "IT Services"):
        print(ev)
