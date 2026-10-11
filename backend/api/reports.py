from fastapi import APIRouter, UploadFile, File, HTTPException

from services.pdf_extractor import extract_pdf_text
from services.report_parser import parse_report_text
from schemas.reports import ReportExtractResponse, ReportParseResponse

router = APIRouter(prefix="/api/reports", tags=["Reports"])

MAX_FILE_SIZE = 10 * 1024 * 1024  # 10 MB


@router.post("/extract", response_model=ReportExtractResponse)
async def upload_and_extract_report(
    file: UploadFile = File(...)
):
    if file.content_type != "application/pdf":
        raise HTTPException(
            status_code=400,
            detail="Please upload a PDF medical report.",
        )

    try:
        # Read at most 10 MB plus one byte to detect oversized uploads.
        content = await file.read(MAX_FILE_SIZE + 1)

        if len(content) > MAX_FILE_SIZE:
            raise HTTPException(
                status_code=413,
                detail="File size must not exceed 10 MB.",
            )

        result = extract_pdf_text(content)

        if result["ocr_required"]:
            return {
                "filename": file.filename or "unknown.pdf",
                "page_count": result["page_count"],
                "extracted_text": "",
                "ocr_required": True,
                "message": (
                    "No selectable text was found. "
                    "This report may require OCR."
                ),
            }

        return {
            "filename": file.filename or "unknown.pdf",
            "page_count": result["page_count"],
            "extracted_text": result["extracted_text"],
            "ocr_required": result["ocr_required"],
            "message": "PDF text extracted successfully.",
        }

    except HTTPException:
        raise
    except ValueError as exc:
        raise HTTPException(
            status_code=400,
            detail=str(exc),
        ) from exc
    finally:
        await file.close()


@router.post("/parse", response_model=ReportParseResponse)
async def parse_medical_report(
    file: UploadFile = File(...)
):
    if file.content_type != "application/pdf":
        raise HTTPException(
            status_code=400,
            detail="Please upload a PDF medical report.",
        )

    try:
        content = await file.read(MAX_FILE_SIZE + 1)

        if len(content) > MAX_FILE_SIZE:
            raise HTTPException(
                status_code=413,
                detail="File size must not exceed 10 MB.",
            )

        extracted = extract_pdf_text(content)

        if extracted["ocr_required"]:
            return {
                "filename": file.filename or "unknown.pdf",
                "page_count": extracted["page_count"],
                "results_found": 0,
                "results": [],
                "message": "OCR is required for this scanned report.",
                "requires_ocr": True,
            }

        results = parse_report_text(
            extracted["extracted_text"]
        )

        return {
            "filename": file.filename or "unknown.pdf",
            "page_count": extracted["page_count"],
            "results_found": len(results),
            "results": results,
            "message": (
                "Review the extracted values against the original report."
                if results
                else "No supported lab-result patterns were detected."
            ),
            "requires_ocr": False,
        }

    except HTTPException:
        raise
    except ValueError as exc:
        raise HTTPException(
            status_code=400,
            detail=str(exc),
        ) from exc
    finally:
        await file.close()
