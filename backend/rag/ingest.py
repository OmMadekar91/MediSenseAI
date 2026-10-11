import json
from pathlib import Path

import faiss
import pymupdf as fitz
import numpy as np
from sentence_transformers import SentenceTransformer


BASE_DIR = Path(__file__).resolve().parents[1]
KNOWLEDGE_DIR = BASE_DIR / "data" / "medical_knowledge"
INDEX_DIR = BASE_DIR / "data" / "index"

MODEL_NAME = "sentence-transformers/all-MiniLM-L6-v2"
CHUNK_SIZE = 1200
CHUNK_OVERLAP = 200


def load_source_metadata():
    path = KNOWLEDGE_DIR / "sources.json"

    if not path.exists():
        return {}

    with path.open("r", encoding="utf-8") as file:
        records = json.load(file)

    return {
        record["filename"]: record
        for record in records
        if "filename" in record
    }


def extract_pages(path: Path):
    """Yield page-level text from supported source files."""
    suffix = path.suffix.lower()

    if suffix == ".pdf":
        with fitz.open(path) as document:
            for page_number, page in enumerate(document, start=1):
                text = page.get_text("text").strip()
                if text:
                    yield page_number, text

    elif suffix in {".txt", ".md"}:
        text = path.read_text(encoding="utf-8").strip()
        if text:
            yield None, text


def chunk_text(text: str):
    """Create overlapping chunks without discarding source context."""
    text = " ".join(text.split())
    chunks = []
    start = 0

    while start < len(text):
        end = min(start + CHUNK_SIZE, len(text))
        chunk = text[start:end].strip()

        if chunk:
            chunks.append(chunk)

        if end == len(text):
            break

        start = end - CHUNK_OVERLAP

    return chunks


def build_index():
    INDEX_DIR.mkdir(parents=True, exist_ok=True)

    if not KNOWLEDGE_DIR.exists():
        raise FileNotFoundError(
            f"Knowledge directory not found: {KNOWLEDGE_DIR}"
        )

    sources = load_source_metadata()
    texts = []
    metadata = []

    for path in sorted(KNOWLEDGE_DIR.iterdir()):
        if path.name == "sources.json":
            continue

        if path.suffix.lower() not in {".pdf", ".txt", ".md"}:
            continue

        source_info = sources.get(path.name, {})

        for page_number, page_text in extract_pages(path):
            for chunk_number, chunk in enumerate(
                chunk_text(page_text), start=1
            ):
                texts.append(chunk)
                metadata.append({
                    "text": chunk,
                    "filename": path.name,
                    "title": source_info.get("title", path.name),
                    "source_url": source_info.get("source_url"),
                    "organization": source_info.get("organization"),
                    "accessed_date": source_info.get("accessed_date"),
                    "page": page_number,
                    "chunk_number": chunk_number,
                })

    if not texts:
        raise ValueError(
            "No text was found. Add non-empty PDF, TXT, or MD files."
        )

    print(f"Embedding {len(texts)} chunks...")
    model = SentenceTransformer(MODEL_NAME)

    embeddings = model.encode(
        texts,
        convert_to_numpy=True,
        normalize_embeddings=True,
        show_progress_bar=True,
    )

    embeddings = np.asarray(embeddings, dtype="float32")
    index = faiss.IndexFlatIP(embeddings.shape[1])
    index.add(embeddings)

    faiss.write_index(index, str(INDEX_DIR / "medical.faiss"))

    with (INDEX_DIR / "metadata.json").open(
        "w", encoding="utf-8"
    ) as file:
        json.dump(metadata, file, ensure_ascii=False, indent=2)

    print(f"Index built successfully: {index.ntotal} chunks")
    print(f"Saved to: {INDEX_DIR}")


if __name__ == "__main__":
    build_index()
