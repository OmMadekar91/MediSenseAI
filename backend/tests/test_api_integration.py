import io
import pymupdf as fitz
from fastapi.testclient import TestClient

import sys
from pathlib import Path

# Add backend to path
sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from main import app

client = TestClient(app)


def create_sample_medical_pdf() -> bytes:
    """Create a sample synthetic PDF medical report for testing."""
    doc = fitz.open()
    page = doc.new_page()

    report_text = """
    METROPOLITAN CLINICAL LABORATORY
    Patient: John Doe    Age: 45    Sex: Male    Date: 2026-10-10
    ----------------------------------------------------------------------
    TEST NAME                     RESULT    UNIT      REFERENCE RANGE
    ----------------------------------------------------------------------
    Hemoglobin                    9.8       g/dL      13.8 - 17.2
    WBC                           6500      cells/uL  4500 - 11000
    Platelet Count                280       10^3/uL   150 - 450
    Fasting Blood Glucose         128       mg/dL     < 100
    Serum Creatinine              1.1       mg/dL     0.7 - 1.3
    TSH                           5.8       mIU/L     0.4 - 4.0
    Total Cholesterol             245       mg/dL     < 200
    ----------------------------------------------------------------------
    End of Report.
    """
    page.insert_text((50, 50), report_text, fontsize=10)
    pdf_bytes = doc.write()
    doc.close()
    return pdf_bytes


def test_health_endpoint():
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "running"
    assert data["project"] == "MediSense AI"


def test_report_extract_endpoint():
    pdf_bytes = create_sample_medical_pdf()
    files = {"file": ("report.pdf", pdf_bytes, "application/pdf")}
    response = client.post("/api/reports/extract", files=files)
    assert response.status_code == 200
    data = response.json()
    assert data["page_count"] == 1
    assert not data["ocr_required"]
    assert "Hemoglobin" in data["extracted_text"]


def test_report_parse_endpoint():
    pdf_bytes = create_sample_medical_pdf()
    files = {"file": ("report.pdf", pdf_bytes, "application/pdf")}
    response = client.post("/api/reports/parse", files=files)
    assert response.status_code == 200
    data = response.json()
    assert data["results_found"] >= 5
    results = {r["test_name"]: r for r in data["results"]}

    # Low hemoglobin -> below_reported_range
    assert "hemoglobin" in results
    assert results["hemoglobin"]["observed_value"] == 9.8
    assert results["hemoglobin"]["status"] == "below_reported_range"

    # High fasting glucose -> above_reported_range
    assert "glucose" in results
    assert results["glucose"]["observed_value"] == 128.0
    assert results["glucose"]["status"] == "above_reported_range"

    # High TSH -> above_reported_range
    assert "tsh" in results
    assert results["tsh"]["observed_value"] == 5.8
    assert results["tsh"]["status"] == "above_reported_range"

    # Normal creatinine -> within_reported_range
    assert "creatinine" in results
    assert results["creatinine"]["observed_value"] == 1.1
    assert results["creatinine"]["status"] == "within_reported_range"


def test_chat_search_endpoint():
    payload = {"question": "What is normal hemoglobin level?", "top_k": 3}
    response = client.post("/api/chat/search", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "retrieved"
    assert len(data["sources"]) > 0
    assert data["sources"][0]["similarity_score"] > 0.30


def test_chat_ask_emergency_guardrail():
    payload = {"question": "I have sudden severe crushing chest pain, what is it?", "top_k": 3}
    response = client.post("/api/chat/ask", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "URGENT" in data["disclaimer"]
    assert "emergency services" in data["disclaimer"].lower()
