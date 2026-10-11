import os
from fastapi import APIRouter, HTTPException

from rag.retriever import MedicalRetriever
from schemas.chat import SearchRequest, SearchResponse, AnswerResponse, SourceItem
from safety.guardrails import (
    sanitize_medical_query,
    check_for_emergency_symptoms,
    STANDARD_DISCLAIMER,
)

router = APIRouter(prefix="/api/chat", tags=["Medical Q&A"])

_retriever = None


def get_retriever() -> MedicalRetriever:
    global _retriever
    if _retriever is None:
        try:
            _retriever = MedicalRetriever()
        except RuntimeError as exc:
            raise HTTPException(
                status_code=503,
                detail="Knowledge base index is missing or building. Please run 'python -m rag.ingest' first.",
            ) from exc
    return _retriever


MIN_SIMILARITY = float(
    os.getenv("RAG_MIN_SIMILARITY", "0.30")
)


def retrieve_passages(question: str, top_k: int):
    retriever = get_retriever()
    passages = retriever.search(question, top_k)

    if not passages:
        return []

    if max(
        item["similarity_score"] for item in passages
    ) < MIN_SIMILARITY:
        return []

    return passages


def prepare_sources(passages: list[dict]) -> list[dict]:
    sources = []
    for i, passage in enumerate(passages, start=1):
        sources.append({
            "source_id": f"S{i}",
            "title": passage.get("title"),
            "organization": passage.get("organization"),
            "source_url": passage.get("source_url"),
            "page": passage.get("page"),
            "similarity_score": passage.get("similarity_score"),
        })
    return sources


@router.post("/search", response_model=SearchResponse)
def search_medical_knowledge(request: SearchRequest):
    try:
        clean_question = sanitize_medical_query(request.question)
        passages = retrieve_passages(
            clean_question,
            request.top_k,
        )

        return {
            "status": "retrieved" if passages else "no_evidence",
            "question": clean_question,
            "message": (
                "Retrieved passages require verification."
                if passages
                else "No sufficiently similar passages were found."
            ),
            "sources": prepare_sources(passages),
            "passages": passages,
        }

    except HTTPException:
        raise
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@router.post("/ask", response_model=AnswerResponse)
def ask_medical_question(request: SearchRequest):
    try:
        clean_question = sanitize_medical_query(request.question)

        # Check for acute emergency symptom signals
        emergency_notice = check_for_emergency_symptoms(clean_question)

        passages = retrieve_passages(
            clean_question,
            request.top_k,
        )

        disclaimer = (
            f"{emergency_notice}\n\n{STANDARD_DISCLAIMER}"
            if emergency_notice
            else STANDARD_DISCLAIMER
        )

        if not passages:
            return {
                "status": "no_evidence",
                "answer": (
                    "I could not find sufficiently relevant information "
                    "in the available references. Please consult a "
                    "qualified healthcare professional for medical "
                    "interpretation."
                ),
                "sources": [],
                "cited_source_ids": [],
                "requires_review": True,
                "disclaimer": disclaimer,
            }

        from services.answer_generator import generate_grounded_answer

        generated = generate_grounded_answer(
            clean_question,
            passages,
        )

        answer_text = generated["answer"]
        if emergency_notice:
            answer_text = f"⚠️ **URGENT SAFETY NOTICE**: {emergency_notice}\n\n{answer_text}"

        return {
            "status": (
                "requires_review"
                if generated["requires_review"]
                else "answered"
            ),
            "answer": answer_text,
            "sources": prepare_sources(passages),
            "cited_source_ids": generated["cited_source_ids"],
            "requires_review": generated["requires_review"],
            "disclaimer": disclaimer,
        }

    except HTTPException:
        raise
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    except Exception as exc:
        err_msg = str(exc)
        if "mistral" in err_msg.lower():
            detail = err_msg
        elif "connect" in err_msg.lower() or "connection" in err_msg.lower() or "refused" in err_msg.lower():
            detail = (
                "The AI service is currently unreachable. "
                "Please verify your internet connection and Mistral API key configuration."
            )
        else:
            detail = f"The answer service encountered an issue: {err_msg}"
        raise HTTPException(status_code=503, detail=detail) from exc
