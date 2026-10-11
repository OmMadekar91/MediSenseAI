import json
from pathlib import Path

import faiss
from sentence_transformers import SentenceTransformer


BASE_DIR = Path(__file__).resolve().parents[1]
INDEX_DIR = BASE_DIR / "data" / "index"
MODEL_NAME = "sentence-transformers/all-MiniLM-L6-v2"


class MedicalRetriever:
    def __init__(self):
        index_path = INDEX_DIR / "medical.faiss"
        metadata_path = INDEX_DIR / "metadata.json"

        if not index_path.exists() or not metadata_path.exists():
            raise RuntimeError(
                "Knowledge index is missing. Run "
                "'python -m rag.ingest' first."
            )

        self.model = SentenceTransformer(MODEL_NAME)
        self.index = faiss.read_index(str(index_path))

        with metadata_path.open("r", encoding="utf-8") as file:
            self.metadata = json.load(file)

        if self.index.ntotal != len(self.metadata):
            raise RuntimeError(
                "Index and metadata are inconsistent. Rebuild the index."
            )

    def search(self, question: str, top_k: int = 3):
        question = question.strip()

        if not question:
            raise ValueError("Question cannot be empty.")

        if not 1 <= top_k <= 10:
            raise ValueError("top_k must be between 1 and 10.")

        if self.index.ntotal == 0:
            return []

        query_vector = self.model.encode(
            [question],
            convert_to_numpy=True,
            normalize_embeddings=True,
        )

        scores, indices = self.index.search(
            query_vector.astype("float32"),
            min(top_k, self.index.ntotal),
        )

        results = []

        for score, idx in zip(scores[0], indices[0]):
            if idx < 0:
                continue

            item = self.metadata[int(idx)]

            results.append({
                **item,
                "similarity_score": round(float(score), 4),
            })

        return results
