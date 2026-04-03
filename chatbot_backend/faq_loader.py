import csv
import os

_faq_cache = None

def load_faq(csv_path: str = None) -> list[dict]:
    global _faq_cache
    if _faq_cache:
        return _faq_cache

    if csv_path is None:
        csv_path = os.path.join(os.path.dirname(__file__), "mngl_faq.csv")

    faqs = []
    with open(csv_path, encoding="utf-8-sig") as f:   # utf-8-sig strips BOM
        reader = csv.DictReader(f)
        for row in reader:
            faqs.append({
                "id":       row["id"].strip(),
                "category": row["category"].strip(),
                "question": row["question"].strip(),
                "answer":   row["answer"].strip(),
                "tags":     [t.strip() for t in row["tags"].split(",") if t.strip()],
            })

    _faq_cache = faqs
    print(f"📋 Loaded {len(faqs)} FAQ entries.")
    return faqs


def get_faq_context() -> str:
    """Return FAQ formatted as plain text for the system prompt."""
    faqs = load_faq()
    lines = []
    for f in faqs:
        lines.append(f"[{f['category']}]\nQ: {f['question']}\nA: {f['answer']}")
    return "\n\n".join(lines)