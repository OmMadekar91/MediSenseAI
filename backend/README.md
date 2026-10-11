# MediSense AI — Backend API & Retrieval-Augmented Generation (RAG)

FastAPI-powered backend service for **MediSense AI**, providing laboratory PDF extraction, biological status classification, and evidence-grounded health Q&A powered by **Mistral AI**.

---

## 🔬 Core Capabilities

1. **Digital Laboratory PDF Extraction**
   - High-throughput text and table extraction using `PyMuPDF` (`fitz`).
   - Standardized biomarker regex matching for CBC, Metabolic, Lipid, Thyroid, and Iron panels.
   - Robust reference range normalization and biological plausibility verification.

2. **Evidence-Grounded RAG Engine**
   - Local semantic vector search using `sentence-transformers/all-MiniLM-L6-v2` and `FAISS`.
   - Curated clinical knowledge base derived from peer-reviewed sources (MedlinePlus, NIH, AHA, NIDDK).
   - Strict citation grounding (`[S1]`, `[S2]`) with automated hallucination pruning.

3. **Cloud LLM Generation via Mistral AI**
   - High-performance cloud LLM completion using **Mistral AI** (`open-mistral-7b` / `mistral-small-latest`).
   - Automatic model fallback to handle transient provider rate limits.
   - Integrated medical safety guardrails and acute emergency symptom detection.

---

## 📁 Directory Structure

```
backend/
├── api/
│   ├── chat.py                 # /api/chat/search and /api/chat/ask endpoints
│   └── reports.py              # /api/reports/analyze PDF upload endpoint
├── data/
│   ├── index/                  # FAISS vector index & metadata
│   └── medical_knowledge/      # Curated reference literature & sources
├── rag/
│   ├── ingest.py               # Vector knowledge ingestion & chunking script
│   └── retriever.py            # Local FAISS embedding search engine
├── safety/
│   └── guardrails.py           # Medical safety disclaimers & citation validation
├── schemas/
│   ├── chat.py                 # Pydantic schemas for search & answers
│   └── reports.py              # Pydantic schemas for lab biomarker results
├── services/
│   ├── answer_generator.py     # Mistral AI prompt construction & completion engine
│   ├── pdf_extractor.py        # PDF text & table coordinate parser
│   └── report_parser.py        # Lab panel regex matching & range comparison
├── tests/                      # Integration and unit tests
├── requirements.txt            # Python dependencies
├── .env.example                # Configuration template
└── main.py                     # FastAPI application entrypoint
```

---

## 🚀 Getting Started

### 1. Requirements
- Python 3.10+
- Mistral AI API Key ([console.mistral.ai](https://console.mistral.ai/))

### 2. Environment Setup
```bash
cd backend
cp .env.example .env
```
Edit `.env` to configure your API key:
```env
MISTRAL_API_KEY=your_mistral_api_key_here
MISTRAL_MODEL=open-mistral-7b
RAG_MIN_SIMILARITY=0.30
```

### 3. Install Dependencies
```bash
pip install -r requirements.txt
```

### 4. Run Development Server
```bash
python -m uvicorn main:app --port 8000 --reload
```
The API documentation and interactive Swagger UI will be available at: [http://localhost:8000/docs](http://localhost:8000/docs)

---

## 📡 API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/health` | Health check probe (`status: running`). |
| `POST` | `/api/reports/analyze` | Accepts a multipart PDF upload and returns extracted biomarkers with status classifications. |
| `POST` | `/api/chat/search` | Retrieves relevant medical reference passages based on cosine similarity. |
| `POST` | `/api/chat/ask` | Generates an evidence-grounded clinical explanation citing retrieved sources via Mistral AI. |

---

## 📄 License

Part of the **MediSense AI** project, licensed under the [MIT License](../LICENSE).
