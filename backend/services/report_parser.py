import re
from typing import Optional


# Common laboratory test names and aliases.
KNOWN_TESTS = {
    "hemoglobin": ["hemoglobin", "haemoglobin", "hgb", "hb"],
    "hematocrit": ["hematocrit", "haematocrit", "hct", "pcv", "packed cell volume"],
    "wbc": ["wbc", "white blood cell count", "white blood cells", "total leukocyte count", "tlc"],
    "rbc": ["rbc", "red blood cell count", "red blood cells", "total erythrocyte count"],
    "platelets": ["platelet count", "platelets", "plt", "total platelets"],
    "mcv": ["mcv", "mean corpuscular volume"],
    "mch": ["mch", "mean corpuscular hemoglobin", "mean corpuscular haemoglobin"],
    "mchc": ["mchc", "mean corpuscular hemoglobin concentration", "mean corpuscular haemoglobin concentration"],
    "glucose": ["fasting blood sugar", "fasting blood glucose", "fasting glucose", "blood glucose", "blood sugar", "glucose, fasting", "glucose"],
    "hba1c": ["hba1c", "glycated hemoglobin", "glycosylated hemoglobin", "hemoglobin a1c", "a1c"],
    "creatinine": ["serum creatinine", "sr. creatinine", "creatinine"],
    "bun": ["blood urea nitrogen", "bun", "urea"],
    "egfr": ["egfr", "estimated glomerular filtration rate", "estimated gfr", "gfr"],
    "sodium": ["serum sodium", "sodium", "na+"],
    "potassium": ["serum potassium", "potassium", "k+"],
    "chloride": ["serum chloride", "chloride", "cl-"],
    "calcium": ["serum calcium", "calcium", "ca++"],
    "total protein": ["total protein", "protein, total"],
    "albumin": ["serum albumin", "albumin"],
    "total cholesterol": ["total cholesterol", "cholesterol, total", "serum cholesterol", "cholesterol"],
    "hdl cholesterol": ["hdl cholesterol", "hdl-c", "hdl", "high density lipoprotein"],
    "ldl cholesterol": ["ldl cholesterol", "ldl-c", "ldl", "low density lipoprotein"],
    "triglycerides": ["serum triglycerides", "triglycerides", "tg"],
    "alt": ["alanine aminotransferase", "alanine transaminase", "alt", "sgpt"],
    "ast": ["aspartate aminotransferase", "aspartate transaminase", "ast", "sgot"],
    "alp": ["alkaline phosphatase", "alp"],
    "total bilirubin": ["total bilirubin", "bilirubin, total", "t. bilirubin", "bilirubin"],
    "direct bilirubin": ["direct bilirubin", "conjugated bilirubin", "d. bilirubin"],
    "tsh": ["thyroid stimulating hormone", "thyroid-stimulating hormone", "tsh", "thyrotropin"],
    "free t4": ["free t4", "ft4", "free thyroxine"],
    "free t3": ["free t3", "ft3", "free triiodothyronine"],
}

NUMBER = r"[+-]?\d+(?:,\d{3})*(?:\.\d+)?"

RANGE_PATTERN = re.compile(
    rf"(?P<low>{NUMBER})\s*(?:-|–|—|to)\s*(?P<high>{NUMBER})",
    re.IGNORECASE,
)

UPPER_BOUND_PATTERN = re.compile(
    rf"(?:<|<=|less than|up to)\s*(?P<high>{NUMBER})",
    re.IGNORECASE,
)

LOWER_BOUND_PATTERN = re.compile(
    rf"(?:>|>=|greater than|more than)\s*(?P<low>{NUMBER})",
    re.IGNORECASE,
)

# Matches a numeric result followed by an optional unit.
VALUE_PATTERN = re.compile(
    rf"(?P<value>{NUMBER})\s*(?P<unit>"
    r"g/dL|mg/dL|mmol/L|g/L|mg/L|"
    r"10\^?\d*/[uμµ]?L|"
    r"cells/[uμµ]?L|"
    r"million/[uμµ]?L|"
    r"mIU/L|uIU/mL|IU/L|U/L|%|fL|pg|"
    r"mL/min(?:/1\.73\s*m2)?|"
    r"ng/mL|μg/dL|ug/dL|"
    r"μmol/L|umol/L|"
    r"10\^?\d*/L"
    r")?",
    re.IGNORECASE,
)


def normalize_number(value: str) -> float:
    """Convert a numeric string to a float."""
    return float(value.replace(",", ""))


def find_test_name(line: str) -> Optional[str]:
    """Identify known test names in a line."""
    normalized = line.lower()

    for canonical_name, aliases in KNOWN_TESTS.items():
        for alias in sorted(aliases, key=len, reverse=True):
            if re.search(
                rf"(?<!\w){re.escape(alias)}(?!\w)",
                normalized,
            ):
                return canonical_name

    return None


def parse_report_text(text: str) -> list[dict]:
    """
    Parse laboratory results from single-line, table-reconstructed,
    or multi-line cell formats.
    """
    results = []
    seen_tests = set()
    raw_lines = [l.strip() for l in text.splitlines() if l.strip()]

    i = 0
    while i < len(raw_lines):
        line = raw_lines[i]
        test_name = find_test_name(line)
        if not test_name:
            i += 1
            continue

        value_match = VALUE_PATTERN.search(line)
        effective_line = line
        consumed = 1

        # Multi-line cell sequence support:
        # If the line contains a test name but no value, look ahead up to 5 lines.
        if not value_match:
            lookahead_parts = [line]
            for k in range(1, 6):
                if i + k < len(raw_lines):
                    next_l = raw_lines[i + k]
                    if find_test_name(next_l):
                        break
                    lookahead_parts.append(next_l)
                    candidate = " ".join(lookahead_parts)
                    cand_match = VALUE_PATTERN.search(candidate)
                    if cand_match:
                        # Check if any further non-test lines contain reference interval
                        for m in range(k + 1, min(k + 4, len(raw_lines) - i)):
                            further_l = raw_lines[i + m]
                            if find_test_name(further_l):
                                break
                            extended = candidate + " " + further_l
                            if (
                                RANGE_PATTERN.search(extended)
                                or UPPER_BOUND_PATTERN.search(extended)
                                or LOWER_BOUND_PATTERN.search(extended)
                            ):
                                candidate = extended
                                k = m
                                break
                        effective_line = candidate
                        value_match = VALUE_PATTERN.search(effective_line)
                        consumed = k + 1
                        break

        if not value_match:
            i += 1
            continue

        # Prevent duplicate tests when table lines and raw text both exist
        if test_name in seen_tests:
            i += consumed
            continue

        try:
            value = normalize_number(value_match.group("value"))
        except (ValueError, AttributeError):
            i += consumed
            continue

        # Search for a reference range after the result
        remaining = effective_line[value_match.end():]
        range_match = RANGE_PATTERN.search(remaining)

        low = high = None
        if range_match:
            try:
                low = normalize_number(range_match.group("low"))
                high = normalize_number(range_match.group("high"))
            except ValueError:
                low = high = None
        else:
            # Check for upper-bound only (e.g., "< 100", "<= 200", "Less than 200")
            ub_match = UPPER_BOUND_PATTERN.search(remaining)
            if ub_match:
                try:
                    high = normalize_number(ub_match.group("high"))
                except ValueError:
                    high = None
            else:
                # Check for lower-bound only (e.g., "> 60")
                lb_match = LOWER_BOUND_PATTERN.search(remaining)
                if lb_match:
                    try:
                        low = normalize_number(lb_match.group("low"))
                    except ValueError:
                        low = None

        # Determine reference status based on extracted bounds
        if low is not None and high is not None and low <= high:
            if value < low:
                status = "below_reported_range"
            elif value > high:
                status = "above_reported_range"
            else:
                status = "within_reported_range"
        elif high is not None and low is None:
            if value > high:
                status = "above_reported_range"
            else:
                status = "within_reported_range"
        elif low is not None and high is None:
            if value < low:
                status = "below_reported_range"
            else:
                status = "within_reported_range"
        else:
            status = "not_assessed"

        seen_tests.add(test_name)
        results.append({
            "test_name": test_name,
            "observed_value": value,
            "unit": value_match.group("unit"),
            "reference_range": {
                "low": low,
                "high": high,
            } if (low is not None or high is not None) else None,
            "status": status,
            "source_line": effective_line,
            "source_line_number": i + 1,
            "needs_review": True,
        })
        i += consumed

    return results
