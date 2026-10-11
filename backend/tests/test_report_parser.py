from services.report_parser import parse_report_text


def test_extracts_hemoglobin_and_reference_range():
    text = (
        "Hemoglobin 9.8 g/dL "
        "Reference Range: 12.0 - 15.5"
    )

    results = parse_report_text(text)

    assert len(results) == 1

    result = results[0]
    assert result["test_name"] == "hemoglobin"
    assert result["observed_value"] == 9.8
    assert result["unit"] == "g/dL"
    assert result["reference_range"]["low"] == 12.0
    assert result["reference_range"]["high"] == 15.5
    assert result["status"] == "below_reported_range"


def test_does_not_invent_missing_reference_range():
    text = "Hemoglobin 13.2 g/dL"

    results = parse_report_text(text)

    assert len(results) == 1
    assert results[0]["reference_range"] is None
    assert results[0]["status"] == "not_assessed"


def test_ignores_unrecognized_test():
    text = "Patient age 24"

    results = parse_report_text(text)

    assert results == []


def test_extracts_upper_bounded_glucose():
    text = "Fasting Blood Glucose 118 mg/dL Normal: < 100"

    results = parse_report_text(text)

    assert len(results) == 1
    result = results[0]
    assert result["test_name"] == "glucose"
    assert result["observed_value"] == 118.0
    assert result["reference_range"]["high"] == 100.0
    assert result["reference_range"]["low"] is None
    assert result["status"] == "above_reported_range"


def test_extracts_lower_bounded_egfr():
    text = "eGFR 85 mL/min/1.73 m2 Normal: > 60"

    results = parse_report_text(text)

    assert len(results) == 1
    result = results[0]
    assert result["test_name"] == "egfr"
    assert result["observed_value"] == 85.0
    assert result["reference_range"]["low"] == 60.0
    assert result["reference_range"]["high"] is None
    assert result["status"] == "within_reported_range"


def test_extracts_tsh_and_lipid_panel():
    text = """
    TSH: 5.8 mIU/L (0.4 - 4.0)
    Total Cholesterol: 240 mg/dL (< 200)
    Platelet Count: 250 10^3/uL (150 - 450)
    """

    results = parse_report_text(text)

    assert len(results) == 3
    tsh = next(r for r in results if r["test_name"] == "tsh")
    assert tsh["observed_value"] == 5.8
    assert tsh["status"] == "above_reported_range"

    chol = next(r for r in results if r["test_name"] == "total cholesterol")
    assert chol["observed_value"] == 240.0
    assert chol["status"] == "above_reported_range"

    plt = next(r for r in results if r["test_name"] == "platelets")
    assert plt["observed_value"] == 250.0
    assert plt["status"] == "within_reported_range"
