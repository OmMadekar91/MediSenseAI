from typing import Optional
from pydantic import BaseModel, Field


class SearchRequest(BaseModel):
    question: str = Field(min_length=3, max_length=1000)
    top_k: int = Field(default=3, ge=1, le=5)


class SourceItem(BaseModel):
    source_id: str
    title: Optional[str] = None
    organization: Optional[str] = None
    source_url: Optional[str] = None
    page: Optional[int] = None
    similarity_score: Optional[float] = None


class SearchResponse(BaseModel):
    status: str
    question: str
    message: str
    sources: list[SourceItem]
    passages: list[dict]


class AnswerResponse(BaseModel):
    status: str
    answer: str
    sources: list[SourceItem]
    cited_source_ids: list[str]
    requires_review: bool
    disclaimer: str
