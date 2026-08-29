"""
PART 1 — Data loading & prep for Module 1.

Loads the two sheets from the TEKROWE xlsx, cleans money fields,
and builds enriched embedding text for the Capability Library.
"""
import os
import pandas as pd

# Path: xlsx sits next to this file by default; override via env var if needed.
EXCEL_PATH = os.environ.get(
    "MODULE1_XLSX", os.path.join(os.path.dirname(__file__), "Problem#1_Sample_Datasets (TEKROWE).xlsx")
)
SHEET_BIDS = "PS1 – Bid History"        # note: en-dash, not hyphen
SHEET_CAPS = "PS1 – Capability Library"

# Verified against the actual file: rows 1-2 are title/description,
# the real header is Excel row 3 -> pandas header=2 (0-indexed). Data starts Excel row 4.
HEADER_ROW = 2

# Bid History uses "Sector" vocabulary; Capability Library uses "Domain".
# This map bridges the two so retrieval can boost/filter relevant capabilities.
SECTOR_TO_DOMAINS = {
    "IT Services": ["Cybersecurity", "Cloud Infrastructure", "Network Design", "ERP Implementation"],
    "Construction": ["Road Construction", "Bridge Engineering"],
    "Healthcare": ["Hospital IT", "Medical Equipment"],
    "Energy": ["Solar Energy"],
    "Logistics": ["Fleet Management"],
    "Education": ["LMS Development"],
    "Finance": ["Mobile Banking"],
    "Telecom": ["Network Design", "Cloud Infrastructure"],
}


def parse_pkr(value) -> float:
    """'PKR 22M' -> 22_000_000.0 ; 'PKR 5.5M' -> 5_500_000.0. Returns 0.0 on garbage."""
    try:
        s = str(value).upper().replace("PKR", "").replace("M", "").strip()
        return float(s) * 1_000_000
    except (ValueError, TypeError):
        return 0.0


def enriched_text(row) -> str:
    """
    Embedding text for one capability record.
    WHY: the 'Project Summary' column is templated placeholder text with zero
    differentiating content — embedding it would make every record look alike.
    Instead we embed the fields that actually distinguish records.
    """
    return (
        f"Domain: {row['Domain']}. Certification: {row['Certification']}. "
        f"Client type: {row['Client Type']}. Contract value: {row['Contract Value']}. "
        f"Duration: {row['Duration (months)']} months. Completed {row['Year Completed']}."
    )


def load_data(path: str = None):
    """Returns (bid_history_df, capability_df), cleaned and ready for training/embedding.
    Path resolves at call time so an uploaded company dataset can replace the default."""
    path = path or EXCEL_PATH
    bid = pd.read_excel(path, sheet_name=SHEET_BIDS, header=HEADER_ROW)
    cap = pd.read_excel(path, sheet_name=SHEET_CAPS, header=HEADER_ROW)

    # Normalise column names (strip stray whitespace from Excel)
    bid.columns = [str(c).strip() for c in bid.columns]
    cap.columns = [str(c).strip() for c in cap.columns]

    # --- Bid History cleaning ---
    bid = bid.dropna(subset=["Bid ID", "Outcome"]).copy()
    bid["Budget_PKR"] = bid["Budget"].apply(parse_pkr)
    bid["Outcome"] = bid["Outcome"].astype(str).str.strip()
    for col in ["Score (%)", "Compliance %", "Response Time (hrs)", "Doc Pages", "Gaps Found"]:
        bid[col] = pd.to_numeric(bid[col], errors="coerce")
    bid = bid.dropna(subset=["Score (%)", "Compliance %"])

    # --- Capability Library cleaning ---
    cap = cap.dropna(subset=["Cap ID"]).copy()
    cap["Certification"] = cap["Certification"].fillna("N/A").astype(str).str.strip()
    cap["Contract_Value_PKR"] = cap["Contract Value"].apply(parse_pkr)
    cap["embed_text"] = cap.apply(enriched_text, axis=1)

    return bid, cap


if __name__ == "__main__":
    bid_history_df, capability_df = load_data()
    print(f"Bid History: {len(bid_history_df)} rows | win rate "
          f"{(bid_history_df['Outcome'] == 'Win').mean():.0%}")
    print(f"Capability Library: {len(capability_df)} rows")
    print("\nSample enriched text:\n ", capability_df["embed_text"].iloc[0])
