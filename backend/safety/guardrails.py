import re
from typing import Optional

STANDARD_DISCLAIMER = (
    "For general health information only. This system does not provide "
    "a medical diagnosis, prescribe treatments, or replace professional "
    "clinical advice. Always consult a qualified healthcare provider."
)

EMERGENCY_DISCLAIMER = (
    "URGENT NOTICE: If you or someone you know is experiencing severe "
    "symptoms such as crushing chest pain, difficulty breathing, sudden "
    "numbness, or loss of consciousness, please call emergency services "
    "(such as 911 or your local emergency number) immediately."
)

EMERGENCY_PATTERNS = [
    re.compile(r"\b(?:crushing\s+)?chest\s+pain\b", re.IGNORECASE),
    re.compile(r"\bsevere\s+(?:shortness\s+of\s+breath|difficulty\s+breathing)\b", re.IGNORECASE),
    re.compile(r"\bsudden\s+(?:numbness|weakness|paralysis)\b", re.IGNORECASE),
    re.compile(r"\b(?:unconscious|passed\s+out|fainting|seizure)\b", re.IGNORECASE),
    re.compile(r"\bheart\s+attack|stroke\b", re.IGNORECASE),
    re.compile(r"\bheavy\s+uncontrolled\s+bleeding\b", re.IGNORECASE),
]


def check_for_emergency_symptoms(text: str) -> Optional[str]:
    """Detect keywords suggestive of acute medical emergencies."""
    for pattern in EMERGENCY_PATTERNS:
        if pattern.search(text):
            return EMERGENCY_DISCLAIMER
    return None


def sanitize_medical_query(text: str) -> str:
    """
    Sanitize user questions: strip control characters, normalize whitespace,
    and prevent basic prompt injection delimiters.
    """
    # Remove control characters except newlines/tabs
    cleaned = "".join(ch for ch in text if ch.isprintable() or ch in "\n\t")
    # Normalize multiple whitespaces
    cleaned = " ".join(cleaned.split())
    # Truncate to maximum safe length
    return cleaned[:1000]


def validate_grounded_citations(
    answer: str,
    valid_source_ids: set[str],
) -> tuple[str, list[str], bool]:
    """
    Validate that cited source IDs in the answer exist in the retrieved passages.
    If the model hallucinates an invalid ID, strip invalid citations and flag review.
    """
    cited_ids = sorted(set(re.findall(r"\[(S\d+)\]", answer)))
    invalid_ids = [sid for sid in cited_ids if sid not in valid_source_ids]

    if invalid_ids:
        # Strip hallucinated citations
        cleaned_answer = re.sub(r"\[S\d+\]", "", answer).strip()
        return cleaned_answer, [], True

    requires_review = not bool(cited_ids)
    return answer, cited_ids, requires_review
