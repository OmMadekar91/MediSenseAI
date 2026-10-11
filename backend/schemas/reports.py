from typing import Optional
from pydantic import BaseModel, Field


class ReferenceRange(BaseModel):
    low: Optional[float] = None
    high: Optional[float] = None


class LabResult(BaseModel):
    test_name: str
    observed_value: float
    unit: Optional[str] = None
    reference_range: Optional[ReferenceRange] = None
    status: str
    source_line: str
    source_line_number: int
    needs_review: bool = True


class ReportExtractResponse(BaseModel):
    filename: str
    page_count: int
    extracted_text: str
    ocr_required: bool
    message: str


class ReportParseResponse(BaseModel):
    filename: str
    page_count: int
    results_found: int
    results: list[LabResult]
    message: str
    requires_ocr: bool
