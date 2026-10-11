import React, { useState } from "react";
import { MEDICAL_TEST_GUIDES } from "../data/medicalGuides";

// Icons for the three redesigned dashboard cards
function BarChartIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="#00a884" aria-hidden="true">
      <rect x="4" y="13" width="3.5" height="8" rx="1.75" />
      <rect x="10.25" y="6" width="3.5" height="15" rx="1.75" />
      <rect x="16.5" y="10" width="3.5" height="11" rx="1.75" />
    </svg>
  );
}

function WarningTriangleIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="#f59e0b" stroke="#f59e0b" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" fill="#f59e0b" />
      <line x1="12" y1="9" x2="12" y2="13" stroke="#ffffff" strokeWidth="2.2" strokeLinecap="round" />
      <circle cx="12" cy="17" r="1.1" fill="#ffffff" stroke="none" />
    </svg>
  );
}

function DocumentPlusIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0284c7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="12" y1="18" x2="12" y2="12" />
      <line x1="9" y1="15" x2="15" y2="15" />
    </svg>
  );
}

function SmallArrowRight() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  );
}

/**
 * DashboardView with redesigned 3 cards matching the reference screenshot:
 * 1. Active Biomarkers: Mint accent, bar chart icon, prominent count, link, circular arrow button
 * 2. Status Summary: Amber accent, warning icon, 2-line dot breakdown, reference note, circular arrow button
 * 3. New Reports: Blue accent, document-plus icon, bold + Upload, link, circular arrow button
 */
export function DashboardView({ onNavigate, results = [] }) {
  const hasResults = results && results.length > 0;
  const biomarkerCount = results ? results.length : 0;

  // Compute status counts from actual application results data
  const statusCounts = {
    inRange: 0,
    lowReview: 0,
    watch: 0,
  };

  if (hasResults) {
    results.forEach((item) => {
      const s = String(item.status || "").toLowerCase();
      if (s.includes("in range") || s.includes("within") || s.includes("normal")) {
        statusCounts.inRange += 1;
      } else if (s.includes("low") || s.includes("review") || s.includes("below")) {
        statusCounts.lowReview += 1;
      } else if (s.includes("watch") || s.includes("above") || s.includes("high")) {
        statusCounts.watch += 1;
      } else {
        // Unverified or outside
        statusCounts.lowReview += 1;
      }
    });
  }

  return (
    <div className="tab-view-container">
      {/* Workspace Summary Header */}
      <div className="tab-view-header">
        <span className="eyebrow-label">WORKSPACE SUMMARY</span>
        <h2 className="view-title">Dashboard</h2>
        <p className="view-desc">
          Overview of your recent laboratory submissions, active biomarker observations, and doctor consultation checklists.
        </p>
      </div>

      {/* Redesigned Three Dashboard Cards in a single row */}
      <div className="dashboard-cards-row">
        {/* Card 1 — Active Biomarkers */}
        <div
          className="metric-card-redesign card-biomarkers"
          onClick={() => onNavigate("results")}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              onNavigate("results");
            }
          }}
          aria-label="View Active Biomarkers in Lab Results table"
        >
          <div className="card-top-content">
            <div className="card-icon-box icon-mint" aria-hidden="true">
              <BarChartIcon />
            </div>
            <div className="card-info-group">
              <span className="card-label-text">Active Biomarkers</span>
              <span className="card-primary-number">{biomarkerCount}</span>
            </div>
          </div>

          <div className="card-bottom-bar">
            <span className="card-action-link link-emerald">
              {hasResults ? "View in Lab Results table →" : "Upload report to view biomarkers →"}
            </span>
            <button
              type="button"
              className="card-circle-btn btn-circle-mint"
              aria-label="Navigate to Lab Results"
              tabIndex={-1}
            >
              <SmallArrowRight />
            </button>
          </div>
        </div>

        {/* Card 2 — Status Summary */}
        <div
          className="metric-card-redesign card-status"
          onClick={() => onNavigate("results")}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              onNavigate("results");
            }
          }}
          aria-label="View Status Summary breakdown in Lab Results"
        >
          <div className="card-top-content">
            <div className="card-icon-box icon-amber" aria-hidden="true">
              <WarningTriangleIcon />
            </div>
            <div className="card-info-group">
              <span className="card-label-text">Status Summary</span>
              <div className="status-breakdown-lines">
                <div className="status-line">
                  <span className="status-bullet bullet-green" />
                  <span className="status-count-text">{statusCounts.inRange} In range</span>
                  <span className="status-sep-dot">·</span>
                  <span className="status-bullet bullet-amber" />
                  <span className="status-count-text">{statusCounts.lowReview} Low/Review</span>
                </div>
                <div className="status-line">
                  <span className="status-bullet bullet-rose" />
                  <span className="status-count-text">{statusCounts.watch} Watch</span>
                </div>
              </div>
            </div>
          </div>

          <div className="card-bottom-bar">
            <span className="card-supporting-note">
              {hasResults ? "Based on laboratory reference intervals" : "Awaiting report submission"}
            </span>
            <button
              type="button"
              className="card-circle-btn btn-circle-amber"
              aria-label="Navigate to Lab Results"
              tabIndex={-1}
            >
              <SmallArrowRight />
            </button>
          </div>
        </div>

        {/* Card 3 — New Reports */}
        <div
          className="metric-card-redesign card-upload"
          onClick={() => onNavigate("upload")}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              onNavigate("upload");
            }
          }}
          aria-label="Upload New Reports"
        >
          <div className="card-top-content">
            <div className="card-icon-box icon-blue" aria-hidden="true">
              <DocumentPlusIcon />
            </div>
            <div className="card-info-group">
              <span className="card-label-text">New Reports</span>
              <span className="card-primary-action-text">+ Upload</span>
            </div>
          </div>

          <div className="card-bottom-bar">
            <span className="card-action-link link-emerald">
              Parse digital PDF report →
            </span>
            <button
              type="button"
              className="card-circle-btn btn-circle-blue"
              aria-label="Navigate to Upload Labs"
              tabIndex={-1}
            >
              <SmallArrowRight />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper to find educational test guide with alias and fuzzy matching
function findTestGuide(markerName) {
  if (!markerName) return null;
  const raw = String(markerName).toLowerCase().trim();
  const noSpace = raw.replace(/[\s\-_/().]+/g, "");

  if (MEDICAL_TEST_GUIDES[raw]) return MEDICAL_TEST_GUIDES[raw];
  if (MEDICAL_TEST_GUIDES[noSpace]) return MEDICAL_TEST_GUIDES[noSpace];

  const aliases = {
    hb: "hemoglobin",
    hgb: "hemoglobin",
    plt: "platelets",
    platelet: "platelets",
    wbc: "wbc",
    rbc: "rbc",
    hct: "hematocrit",
    a1c: "hba1c",
    "hba1-c": "hba1c",
    glu: "glucose",
    fbs: "glucose",
    fbg: "glucose",
    creat: "creatinine",
    chol: "total cholesterol",
    cholesterol: "total cholesterol",
    tg: "triglycerides",
    vitd: "vitamin d",
    vit_d: "vitamin d",
    "vit-d": "vitamin d",
    sgpt: "alt",
    sgot: "ast",
  };

  if (aliases[raw] && MEDICAL_TEST_GUIDES[aliases[raw]]) {
    return MEDICAL_TEST_GUIDES[aliases[raw]];
  }
  if (aliases[noSpace] && MEDICAL_TEST_GUIDES[aliases[noSpace]]) {
    return MEDICAL_TEST_GUIDES[aliases[noSpace]];
  }

  for (const [key, guide] of Object.entries(MEDICAL_TEST_GUIDES)) {
    if (raw.includes(key) || key.includes(raw) || guide.displayName?.toLowerCase().includes(raw)) {
      return guide;
    }
  }

  return null;
}

function formatGeneratedDate() {
  return new Date().toLocaleDateString();
}

// Generate dynamic clinical questions and consultation tasks from parsed lab results
function generateDoctorQuestions(results = []) {
  if (!results || results.length === 0) return [];

  const items = results.map((item, index) => {
    const rawMarker = String(item.marker || item.test_name || `Biomarker ${index + 1}`).trim();
    const guide = findTestGuide(rawMarker);
    const statusStr = String(item.status || "");
    const statusLower = statusStr.toLowerCase();

    const isAbnormal =
      statusLower.includes("low") ||
      statusLower.includes("below") ||
      statusLower.includes("watch") ||
      statusLower.includes("high") ||
      statusLower.includes("above") ||
      statusLower.includes("review") ||
      statusLower.includes("verification") ||
      statusLower.includes("outside");

    let priorityBadge = "In range";
    let priorityClass = "badge-inrange";

    if (statusLower.includes("low") || statusLower.includes("below")) {
      priorityBadge = "Low / Below range";
      priorityClass = "badge-low";
    } else if (statusLower.includes("watch") || statusLower.includes("high") || statusLower.includes("above")) {
      priorityBadge = "High / Watch";
      priorityClass = "badge-watch";
    } else if (statusLower.includes("review") || statusLower.includes("verification")) {
      priorityBadge = "Review needed";
      priorityClass = "badge-review";
    }

    let title = "";
    let question = "";

    if (guide && guide.doctorQuestions && guide.doctorQuestions.length > 0) {
      if (isAbnormal) {
        title = `Review abnormal ${rawMarker} level`;
        question = `${rawMarker} was reported at ${item.value} (${statusStr}). Ask: "${guide.doctorQuestions[0]}"${
          guide.doctorQuestions[1] ? ` Also inquire: "${guide.doctorQuestions[1]}"` : ""
        }`;
      } else {
        title = `Confirm ${rawMarker} target stability`;
        question = `${rawMarker} is optimal at ${item.value} (ref: ${item.range || "standard"}). Ask: "${guide.doctorQuestions[0]}"`;
      }
    } else {
      if (isAbnormal) {
        title = `Discuss out-of-range ${rawMarker}`;
        question = `${rawMarker} was observed at ${item.value} (reference interval: ${item.range || "not specified"}), flagged as ${statusStr}. Ask what could explain this reading and whether dietary intervention, medication review, or re-testing is warranted.`;
      } else {
        title = `Routine verification of ${rawMarker}`;
        question = `${rawMarker} is reported at ${item.value} (reference interval: ${item.range || "normal"}). Confirm with your clinician if this observation remains consistent with your ongoing preventive health.`;
      }
    }

    return {
      id: `task-${index}-${rawMarker.replace(/[^a-zA-Z0-9]/g, "")}`,
      marker: rawMarker,
      value: item.value,
      range: item.range,
      status: statusStr,
      isAbnormal,
      priorityBadge,
      priorityClass,
      title,
      question,
      category: guide?.category || (isAbnormal ? "Clinical Attention" : "General Health"),
    };
  });

  // Sort out-of-range/abnormal tests to the top of the consultation checklist
  return items.sort((a, b) => {
    if (a.isAbnormal && !b.isAbnormal) return -1;
    if (!a.isAbnormal && b.isAbnormal) return 1;
    return 0;
  });
}

export function AssignmentsView({ results = [], workspaceLabel = "", onNavigate }) {
  const [checkedMap, setCheckedMap] = useState({});
  const [filterMode, setFilterMode] = useState("all");
  const [copied, setCopied] = useState(false);

  const hasResults = results && results.length > 0;
  const questions = generateDoctorQuestions(results);

  const priorityCount = questions.filter((q) => q.isAbnormal).length;
  const routineCount = questions.length - priorityCount;

  const filteredQuestions = questions.filter((q) => {
    if (filterMode === "priority") return q.isAbnormal;
    if (filterMode === "routine") return !q.isAbnormal;
    return true;
  });

  const completedCount = questions.filter((q) => checkedMap[q.id]).length;
  const progressPercent = questions.length > 0 ? Math.round((completedCount / questions.length) * 100) : 0;

  function toggleTask(id) {
    setCheckedMap((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  }

  function handleCopyQuestions() {
    if (questions.length === 0) return;
    const header = `MediSense AI — Doctor Consultation Questions\nReport: ${workspaceLabel || "Laboratory Analysis"}\nGenerated: ${formatGeneratedDate()}\n\n`;

    const priorityItems = questions
      .filter((q) => q.isAbnormal)
      .map((q, idx) => `${idx + 1}. [${q.marker.toUpperCase()}] (${q.value} · ${q.priorityBadge})\n   ${q.question}`)
      .join("\n\n");

    const routineItems = questions
      .filter((q) => !q.isAbnormal)
      .map((q, idx) => `${idx + 1}. [${q.marker.toUpperCase()}] (${q.value} · In range)\n   ${q.question}`)
      .join("\n\n");

    let fullText = header;
    if (priorityItems) {
      fullText += `=== PRIORITY TALKING POINTS ===\n${priorityItems}\n\n`;
    }
    if (routineItems) {
      fullText += `=== ROUTINE HEALTH INQUIRIES ===\n${routineItems}\n\n`;
    }

    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(fullText.trim()).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      }).catch(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      });
    } else {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  }

  return (
    <div className="tab-view-container">
      <div className="tab-view-header">
        <span className="eyebrow-label">CLINICAL PREPARATION</span>
        <h2 className="view-title">Assignments & Doctor Questions</h2>
        <p className="view-desc">
          Recommended talking points and preparation steps personalized to your current laboratory report.
        </p>
      </div>

      {!hasResults ? (
        <div className="assignments-empty-card">
          <div className="assignments-empty-icon" aria-hidden="true">📋</div>
          <h3 className="assignments-empty-title">No Lab Report Loaded</h3>
          <p className="assignments-empty-desc">
            No lab reports have been parsed yet. Upload your laboratory PDF report to automatically generate personalized consultation talking points, abnormal marker discussions, and questions for your doctor.
          </p>
          {onNavigate && (
            <button
              type="button"
              className="btn-primary-action"
              onClick={() => onNavigate("upload")}
            >
              + Upload Report to Prepare Questions
            </button>
          )}
        </div>
      ) : (
        <div className="assignments-card">
          {/* Toolbar / Header Meta */}
          <div className="assignments-toolbar">
            <div className="assignments-meta-info">
              <span className="assignments-report-pill">
                <span className="report-dot" />
                {workspaceLabel || "Active Report"}
              </span>
              <span className="assignments-progress-text">
                <strong>{completedCount}</strong> of <strong>{questions.length}</strong> questions checked ({progressPercent}%)
              </span>
            </div>

            <div className="assignments-actions">
              <button
                type="button"
                className={`btn-copy-questions ${copied ? "copied" : ""}`}
                onClick={handleCopyQuestions}
                title="Copy all questions to clipboard"
              >
                {copied ? (
                  <>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                    </svg>
                    <span>Copy Questions</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Progress Mini Track */}
          <div className="assignments-progress-track">
            <div
              className="assignments-progress-fill"
              style={{ width: `${progressPercent}%` }}
              role="progressbar"
              aria-valuenow={progressPercent}
              aria-valuemin="0"
              aria-valuemax="100"
            />
          </div>

          {/* Filter Pills */}
          <div className="assignments-filter-row">
            <button
              type="button"
              className={`assignment-filter-pill ${filterMode === "all" ? "active" : ""}`}
              onClick={() => setFilterMode("all")}
            >
              All Questions ({questions.length})
            </button>
            {priorityCount > 0 && (
              <button
                type="button"
                className={`assignment-filter-pill ${filterMode === "priority" ? "active" : ""}`}
                onClick={() => setFilterMode("priority")}
              >
                <span className="filter-dot dot-warn" />
                Priority Review ({priorityCount})
              </button>
            )}
            {routineCount > 0 && (
              <button
                type="button"
                className={`assignment-filter-pill ${filterMode === "routine" ? "active" : ""}`}
                onClick={() => setFilterMode("routine")}
              >
                <span className="filter-dot dot-inrange" />
                Routine ({routineCount})
              </button>
            )}
          </div>

          {/* Dynamic Question List */}
          <ul className="assignment-list">
            {filteredQuestions.map((q) => {
              const isChecked = !!checkedMap[q.id];
              return (
                <li
                  key={q.id}
                  className={`assignment-item ${q.isAbnormal ? "task-attention" : ""} ${isChecked ? "task-completed" : ""}`}
                >
                  <input
                    type="checkbox"
                    id={q.id}
                    className="assignment-check"
                    checked={isChecked}
                    onChange={() => toggleTask(q.id)}
                  />
                  <label htmlFor={q.id} className="assignment-label">
                    <div className="assignment-title-row">
                      <strong>{q.title}</strong>
                      <div className="assignment-badges">
                        <span className={`task-badge ${q.priorityClass}`}>
                          {q.priorityBadge}
                        </span>
                        <span className="task-val-pill">
                          {q.marker}: <strong>{q.value}</strong>
                          {q.range && <span className="ref-hint"> (Ref: {q.range})</span>}
                        </span>
                      </div>
                    </div>
                    <p className="assignment-question-text">{q.question}</p>
                    <span className="assignment-category-tag">{q.category}</span>
                  </label>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}

// Helper to calculate visual range meter position & status
function computeRangeMeter(item) {
  const statusLower = String(item.status || "").toLowerCase();
  const numValue = parseFloat(String(item.value || "").replace(/[^0-9.-]/g, ""));
  
  let low = null;
  let high = null;
  const rangeStr = String(item.range || "");
  const rangeParts = rangeStr.split("-");
  if (rangeParts.length === 2) {
    low = parseFloat(rangeParts[0].replace(/[^0-9.-]/g, ""));
    high = parseFloat(rangeParts[1].replace(/[^0-9.-]/g, ""));
  }

  let positionPercent = 50;
  let statusType = "normal";
  let guidanceText = "Observation is within standard reference intervals.";

  if (statusLower.includes("in range") || statusLower.includes("normal") || statusLower.includes("within")) {
    statusType = "normal";
    guidanceText = "✓ Biomarker level is currently within optimal clinical reference interval.";
    if (!isNaN(numValue) && low !== null && high !== null && high > low) {
      const ratio = Math.max(0, Math.min(1, (numValue - low) / (high - low)));
      positionPercent = 32 + ratio * 36;
    } else {
      positionPercent = 50;
    }
  } else if (statusLower.includes("low") || statusLower.includes("review") || statusLower.includes("below")) {
    statusType = "low";
    guidanceText = "↓ Observed value is below reported reference interval. Discuss dietary or supplemental support with clinician.";
    if (!isNaN(numValue) && low !== null && low > 0) {
      const ratio = Math.max(0, Math.min(1, numValue / low));
      positionPercent = 8 + ratio * 20;
    } else {
      positionPercent = 18;
    }
  } else if (statusLower.includes("watch") || statusLower.includes("high") || statusLower.includes("above")) {
    statusType = "high";
    guidanceText = "↑ Observed value is elevated above reference boundaries. Clinical review and monitoring recommended.";
    if (!isNaN(numValue) && high !== null && high > 0) {
      const excess = Math.max(0, numValue - high);
      const ratio = Math.min(1, excess / (high * 0.5));
      positionPercent = 74 + ratio * 18;
    } else {
      positionPercent = 84;
    }
  } else {
    statusType = "review";
    guidanceText = "Biomarker reported without direct standard interval. Verify against original laboratory printout.";
    positionPercent = 50;
  }

  return {
    positionPercent: Math.round(positionPercent),
    statusType,
    guidanceText,
  };
}

export function ProgressView({ results = [], onNavigate }) {
  const hasResults = results && results.length > 0;

  const total = results.length;
  let inRangeCount = 0;
  let lowCount = 0;
  let watchCount = 0;

  if (hasResults) {
    results.forEach((item) => {
      const s = String(item.status || "").toLowerCase();
      if (s.includes("in range") || s.includes("within") || s.includes("normal")) {
        inRangeCount += 1;
      } else if (s.includes("low") || s.includes("review") || s.includes("below")) {
        lowCount += 1;
      } else if (s.includes("watch") || s.includes("above") || s.includes("high")) {
        watchCount += 1;
      } else {
        lowCount += 1;
      }
    });
  }

  const optimalPercent = total > 0 ? Math.round((inRangeCount / total) * 100) : 0;

  return (
    <div className="tab-view-container">
      <div className="tab-view-header">
        <span className="eyebrow-label">LONGITUDINAL TRACKING</span>
        <h2 className="view-title">Biomarker Progress</h2>
        <p className="view-desc">
          Track biomarker levels against laboratory reference intervals and observe optimization progress toward clinical targets.
        </p>
      </div>

      {!hasResults ? (
        <div className="progress-empty-card">
          <div className="progress-empty-icon" aria-hidden="true">📈</div>
          <h3 className="progress-empty-title">No Biomarker Progress Recorded</h3>
          <p className="progress-empty-desc">
            No lab reports have been parsed yet. Upload your laboratory PDF report in the Upload section to automatically generate visual range meters, target comparisons, and progress summaries.
          </p>
          {onNavigate && (
            <button
              type="button"
              className="btn-primary-action"
              onClick={() => onNavigate("upload")}
            >
              + Upload Report to Track Progress
            </button>
          )}
        </div>
      ) : (
        <>
          {/* Progress Summary Cards */}
          <div className="progress-overview-grid">
            <div className="progress-stat-card card-optimal">
              <span className="stat-card-label">In Target Range</span>
              <div className="stat-card-val-row">
                <span className="stat-card-number">{inRangeCount}</span>
                <span className="stat-card-total">/ {total}</span>
              </div>
              <span className="stat-card-subtext">{optimalPercent}% optimal across active biomarkers</span>
            </div>

            <div className="progress-stat-card card-review">
              <span className="stat-card-label">Requiring Review</span>
              <div className="stat-card-val-row">
                <span className="stat-card-number">{lowCount + watchCount}</span>
                <span className="stat-card-badge-warn">Attention</span>
              </div>
              <span className="stat-card-subtext">{lowCount} Low · {watchCount} Watch</span>
            </div>

            <div className="progress-stat-card card-tracked">
              <span className="stat-card-label">Total Observations</span>
              <div className="stat-card-val-row">
                <span className="stat-card-number">{total}</span>
                <span className="stat-card-badge-info">Active</span>
              </div>
              <span className="stat-card-subtext">Extracted biomarker records</span>
            </div>
          </div>

          {/* List of Biomarker Progress Range Bars */}
          <div className="biomarker-progress-section">
            <h3 className="progress-section-heading">Active Biomarker Range Progress</h3>
            <div className="biomarker-progress-list">
              {results.map((item, idx) => {
                const meterData = computeRangeMeter(item);
                return (
                  <div key={item.id || idx} className="biomarker-progress-card">
                    <div className="progress-card-top">
                      <div className="progress-marker-identity">
                        <h4 className="progress-marker-name">{item.marker}</h4>
                        <span className="progress-ref-text">
                          Reference interval: <strong>{item.range}</strong>
                        </span>
                      </div>
                      <div className="progress-value-badge-group">
                        <span className="progress-marker-value">{item.value}</span>
                        <span className={`status-pill pill-${meterData.statusType}`}>
                          {item.status}
                        </span>
                      </div>
                    </div>

                    {/* Visual Segmented 3-Zone Range Meter */}
                    <div className="range-meter-container">
                      <div className="range-meter-track" aria-hidden="true">
                        <div className="meter-segment segment-low" title="Below reference range" />
                        <div className="meter-segment segment-target" title="Target normal range" />
                        <div className="meter-segment segment-high" title="Above reference range" />
                        
                        {/* Dynamic Marker Pin */}
                        <div
                          className={`meter-pin-indicator pin-${meterData.statusType}`}
                          style={{ left: `${meterData.positionPercent}%` }}
                          title={`Observed value: ${item.value}`}
                        >
                          <div className="pin-pulse" />
                          <div className="pin-head" />
                        </div>
                      </div>

                      <div className="range-meter-labels">
                        <span className="label-low">Below Target</span>
                        <span className="label-target">Optimal Normal Zone</span>
                        <span className="label-high">Above Target</span>
                      </div>
                    </div>

                    <div className="progress-card-note">
                      <span className="note-text">{meterData.guidanceText}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export function CheckInView() {
  return (
    <div className="tab-view-container">
      <div className="tab-view-header">
        <span className="eyebrow-label">PATIENT WELLNESS</span>
        <h2 className="view-title">Weekly Check-in</h2>
        <p className="view-desc">
          Log subjective energy levels, symptoms, and lifestyle notes to correlate with laboratory values.
        </p>
      </div>
      <div className="checkin-card">
        <p className="checkin-prompt">How have your general energy and vitality levels felt this week?</p>
        <div className="checkin-options">
          {["High Energy", "Normal", "Mild Fatigue", "Significant Fatigue"].map((opt, i) => (
            <button key={i} type="button" className="btn-checkin-option">
              {opt}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export function ProfileView() {
  return (
    <div className="tab-view-container">
      <div className="tab-view-header">
        <span className="eyebrow-label">ACCOUNT PREFERENCES</span>
        <h2 className="view-title">Health Profile</h2>
        <p className="view-desc">
          Manage your personal workspace settings and local data storage preferences.
        </p>
      </div>
      <div className="profile-card">
        <div className="profile-row">
          <span className="profile-field">Workspace Mode</span>
          <span className="profile-value">Local Offline Processing</span>
        </div>
        <div className="profile-row">
          <span className="profile-field">Data Retention</span>
          <span className="profile-value">Client-Side Memory & Local Session Only</span>
        </div>
        <div className="profile-row">
          <span className="profile-field">Active Brand</span>
          <span className="profile-value">MediSense AI: Medical Reports, Made Clear</span>
        </div>
      </div>
    </div>
  );
}
