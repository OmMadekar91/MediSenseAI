import React from "react";
import LabResultsTable from "./LabResultsTable.jsx";

/**
 * LabResultsCard component matches the uploaded report card
 * from the reference design.
 * Features:
 * - "Uploaded report" title on the top left
 * - Emerald-green "Open source PDF" button on the top right
 * - Clean 4-column biomarker table
 * - Handles active PDF viewing or friendly disabled state
 */
export default function LabResultsCard({
  results = [],
  sourcePdfUrl = null,
  fileName = null,
  _isDemo = false,
  isLoading = false,
  onOpenPdf,
  selectedTest,
  onSelectTest,
  guideData = null,
  onAskAboutTest,
  onNavigate,
  onToggleWorkspace,
}) {
  const hasPdf = Boolean(sourcePdfUrl);

  const handlePdfClick = () => {
    if (hasPdf && onOpenPdf) {
      onOpenPdf();
    }
  };

  const hasResults = results && results.length > 0;

  return (
    <section className="uploaded-report-card" aria-labelledby="card-heading">
      {/* Card Header Row */}
      <div className="card-header-row">
        <h2 id="card-heading" className="card-title">
          {hasResults ? "Uploaded report" : "Lab Results"}
        </h2>

        {hasResults && (
          <div className="card-actions">
            <button
              type="button"
              className={`btn-open-pdf ${!hasPdf ? "btn-disabled" : ""}`}
              onClick={handlePdfClick}
              disabled={!hasPdf}
              title={
                hasPdf
                  ? `Open original source PDF: ${fileName || "document.pdf"}`
                  : "No source PDF file attached to this demo workspace. Upload a report in 'Upload Labs' to view the original PDF."
              }
              aria-label={hasPdf ? "Open original uploaded PDF report" : "Source PDF unavailable in demo mode"}
            >
              Open source PDF
            </button>
          </div>
        )}
      </div>

      {/* Loading Skeleton / Pulse */}
      {isLoading ? (
        <div className="table-loading-container" aria-live="polite">
          <div className="table-loading-spinner" />
          <p>Extracting biomarker records from report...</p>
        </div>
      ) : !hasResults ? (
        <div className="empty-results-container">
          <div className="empty-results-icon-box" aria-hidden="true">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#00a884" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="12" y1="18" x2="12" y2="12" />
              <line x1="9" y1="15" x2="15" y2="15" />
            </svg>
          </div>
          <h3 className="empty-results-title">No Lab Reports Uploaded Yet</h3>
          <p className="empty-results-desc">
            Upload your medical lab report (PDF) in the Upload section to extract and view your active biomarker values, laboratory reference ranges, and doctor discussion points.
          </p>
          <div className="empty-results-actions">
            {onNavigate && (
              <button
                type="button"
                className="btn-primary-action"
                onClick={() => onNavigate("upload")}
              >
                + Go to Upload Section
              </button>
            )}
            {onToggleWorkspace && (
              <button
                type="button"
                className="btn-secondary-action"
                onClick={onToggleWorkspace}
              >
                Preview Example Workspace Demo
              </button>
            )}
          </div>
        </div>
      ) : (
        <LabResultsTable
          results={results}
          onSelectRow={onSelectTest}
          selectedTestName={selectedTest?.marker}
        />
      )}

      {/* Selected Test Educational Drawer (Educational guidance without diagnosing) */}
      {selectedTest && guideData && (
        <div className="biomarker-detail-drawer" aria-live="polite">
          <div className="drawer-header">
            <div className="drawer-title-group">
              <span className="drawer-category">{guideData.category || "Biomarker Guide"}</span>
              <h3 className="drawer-title">{guideData.displayName || selectedTest.marker}</h3>
            </div>
            <button
              type="button"
              className="drawer-close-btn"
              onClick={() => onSelectTest(null)}
              aria-label="Close biomarker details"
            >
              ✕
            </button>
          </div>

          <div className="drawer-body">
            <div className="drawer-section">
              <h4>What this measures</h4>
              <p>{guideData.whatItIs}</p>
            </div>

            <div className="drawer-section">
              <h4>Why it matters</h4>
              <p>{guideData.whyItMatters}</p>
            </div>

            {guideData.doctorQuestions && guideData.doctorQuestions.length > 0 && (
              <div className="drawer-section">
                <h4>Suggested questions for your doctor</h4>
                <ul>
                  {guideData.doctorQuestions.map((q, idx) => (
                    <li key={idx}>{q}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="drawer-footer-actions">
              <span className="drawer-disclaimer">
                MediSense AI provides educational explanations only. Always consult your healthcare provider.
              </span>
              {onAskAboutTest && (
                <button
                  type="button"
                  className="btn-ask-about-test"
                  onClick={() => onAskAboutTest(selectedTest)}
                >
                  Ask MediSense about this ↗
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
