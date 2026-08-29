"""
PART 2 — Models.

Model A (TRAINED ML): RandomForest win-probability classifier on real bid history.
Model B (RULE-BASED): PASS/PARTIAL/FAIL compliance status.

WHY Model B is rule-based, not ML: our dataset has NO labelled PASS/PARTIAL/FAIL
examples. Training a classifier on labels we invented ourselves would just be the
rules with extra steps — and dishonest to present as ML. Model A is the genuine
trained model; Model B is transparent, auditable logic. Say exactly this to judges.
"""
import os
import joblib
from sklearn.compose import ColumnTransformer
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, f1_score
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder

from data_prep import load_data

MODEL_A_PATH = os.path.join(os.path.dirname(__file__), "model_a_win_probability.pkl")

CAT_FEATURES = ["Sector"]
NUM_FEATURES = ["Budget_PKR", "Score (%)", "Compliance %",
                "Response Time (hrs)", "Doc Pages", "Gaps Found"]
FEATURES = CAT_FEATURES + NUM_FEATURES


# ---------------- Model B: rule-based compliance status ----------------
def compliance_status(requirement_mandatory: bool,
                      num_strong_matches: int,
                      num_partial_matches: int) -> str:
    """
    INTENTIONALLY RULE-BASED (see module docstring).
      2+ strong matches            -> PASS
      some match but not 2 strong  -> PARTIAL
      0 matches + mandatory        -> FAIL
      0 matches + optional         -> INFO
    """
    if num_strong_matches >= 2:
        return "PASS"
    if num_strong_matches + num_partial_matches >= 1:
        return "PARTIAL"
    return "FAIL" if requirement_mandatory else "INFO"


# ---------------- Model A: trained win-probability classifier ----------------
def train_model_a():
    bid, _ = load_data()
    X = bid[FEATURES]
    y = (bid["Outcome"] == "Win").astype(int)  # 1 = Win

    pipe = Pipeline([
        ("prep", ColumnTransformer([
            ("sector", OneHotEncoder(handle_unknown="ignore"), CAT_FEATURES),
        ], remainder="passthrough")),
        # RandomForest: robust on 120 rows of mixed-type features, no scaling needed
        ("rf", RandomForestClassifier(n_estimators=300, random_state=42,
                                      class_weight="balanced")),
    ])

    X_tr, X_te, y_tr, y_te = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y)
    pipe.fit(X_tr, y_tr)

    pred = pipe.predict(X_te)
    acc = accuracy_score(y_te, pred)
    f1 = f1_score(y_te, pred)

    # Feature importances (map one-hot names back)
    feat_names = (list(pipe.named_steps["prep"].named_transformers_["sector"]
                       .get_feature_names_out(CAT_FEATURES)) + NUM_FEATURES)
    importances = sorted(zip(feat_names, pipe.named_steps["rf"].feature_importances_),
                         key=lambda t: -t[1])

    # Save model + per-feature defaults so /api/score can fill features the
    # caller doesn't supply (e.g. only sector+budget+compliance given).
    bundle = {
        "model": pipe,
        "features": FEATURES,
        "defaults": {c: float(bid[c].median()) for c in NUM_FEATURES},
        "test_accuracy": acc,
        "test_f1": f1,
    }
    joblib.dump(bundle, MODEL_A_PATH)
    return acc, f1, importances


if __name__ == "__main__":
    acc, f1, importances = train_model_a()
    print("=" * 60)
    print("MODEL A — Win Probability (RandomForest, trained on 120 real bids)")
    print(f"  Test accuracy : {acc:.2%}")
    print(f"  Test F1 (Win) : {f1:.2f}")
    print("  Top feature importances:")
    for name, imp in importances[:6]:
        print(f"    {name:<28} {imp:.3f}")
    print(f"  Saved -> {MODEL_A_PATH}")
    print("=" * 60)
    print("MODEL B — Compliance status: rule-based (no PASS/FAIL labels exist")
    print("  in the dataset; fabricating labels to train on would be dishonest).")
