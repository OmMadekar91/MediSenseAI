import React, { useState, useRef } from "react";

export default function UploadSection({
  onAnalyzeSuccess,
  apiBaseUrl = "http://127.0.0.1:8000",
  currentFile = null,
  uploadedReports = [],
  activeReportId = null,
  onSelectReport,
  onDeleteReport,
  onLoadSampleReport,
  onNavigate,
}) {
  const [file, setFile] = useState(currentFile);
  const [dragOver, setDragOver] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);

  function handleFileSelect(selectedFile) {
    if (!selectedFile) return;

    if (
      selectedFile.type !== "application/pdf" &&
      !selectedFile.name.endsWith(".pdf")
    ) {
      setError("Please upload a medical report in PDF format.");
      return;
    }

    if (selectedFile.size > 10 * 1024 * 1024) {
      setError("File size exceeds 10 MB limit. Please select a smaller PDF.");
      return;
    }

    setFile(selectedFile);
    setError("");
  }

  function handleDrop(e) {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  }

  async function handleAnalyze(e) {
    if (e) e.preventDefault();
    if (!file) return;

    setLoading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(`${apiBaseUrl}/api/reports/parse`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.detail || "Unable to extract lab results from report.");
      }

      if (onAnalyzeSuccess) {
        onAnalyzeSuccess(data, file);
      }
    } catch (err) {
      setError(
        `${err.message}. Ensure backend server is running on ${apiBaseUrl} and PDF is not password-protected.`
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="upload-view-shell">
      <div className="upload-view-header">
        <span className="eyebrow-label">DOCUMENT EXTRACTION</span>
        <h2 className="view-title">Upload Laboratory Report</h2>
        <p className="view-desc">
          Upload your medical lab report (PDF) to parse biomarker measurements into your structured review table and longitudinal progress tracker.
        </p>
      </div>

      {error && (
        <div className="alert-banner alert-banner-error" role="alert">
          <span className="alert-icon" aria-hidden="true">⚠️</span>
          <div className="alert-text">
            <strong>Upload Notice</strong>
            <p>{error}</p>
          </div>
          <button
            type="button"
            className="alert-dismiss"
            onClick={() => setError("")}
            aria-label="Dismiss alert"
          >
            ✕
          </button>
        </div>
      )}

      <div className="upload-panel-card">
        <div
          className={`dropzone-box ${dragOver ? "dropzone-active" : ""} ${file ? "dropzone-filled" : ""}`}
          onDrop={handleDrop}
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={(e) => {
            e.preventDefault();
            setDragOver(false);
          }}
          onClick={() => fileInputRef.current?.click()}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              fileInputRef.current?.click();
            }
          }}
          aria-label="Upload laboratory PDF file"
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="application/pdf,.pdf"
            className="visually-hidden"
            onChange={(e) => handleFileSelect(e.target.files?.[0])}
          />

          <div className="dropzone-content">
            <div className="dropzone-icon" aria-hidden="true">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#00a884" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="12" y1="18" x2="12" y2="12" />
                <polyline points="9 15 12 12 15 15" />
              </svg>
            </div>

            {file ? (
              <div className="file-ready-info">
                <strong className="file-name-text">{file.name}</strong>
                <span className="file-size-meta">
                  {(file.size / 1024 / 1024).toFixed(2)} MB · Ready to parse
                </span>
                <span className="file-replace-hint">Click or drag another file to replace</span>
              </div>
            ) : (
              <div className="dropzone-instruction">
                <strong className="instruction-heading">Choose a PDF report or drag it here</strong>
                <span className="instruction-note">
                  Standard PDF medical reports · Maximum 10 MB
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="upload-actions-bar">
          <button
            type="button"
            className="btn-primary-action"
            onClick={handleAnalyze}
            disabled={!file || loading}
          >
            {loading ? (
              <>
                <span className="action-spinner" aria-hidden="true" />
                <span>Extracting Biomarkers...</span>
              </>
            ) : (
              "Extract & View Lab Results"
            )}
          </button>

          {file && !loading && (
            <button
              type="button"
              className="btn-text-action"
              onClick={() => {
                setFile(null);
                setError("");
              }}
            >
              Clear
            </button>
          )}
        </div>

        <div className="upload-privacy-callout">
          <span className="callout-icon" aria-hidden="true">🔒</span>
          <p className="callout-text">
            <strong>Private & Secure:</strong> All parsing runs locally in your own environment. Your health records are never uploaded to third-party public tracking servers.
          </p>
        </div>
      </div>

      {/* Reports Uploaded to System Section */}
      <div className="uploaded-reports-history-section">
        <div className="reports-history-header">
          <div className="history-title-group">
            <h3 className="history-title">Reports Uploaded to System</h3>
            <span className="history-count-badge">
              {uploadedReports.length} {uploadedReports.length === 1 ? "Report" : "Reports"}
            </span>
          </div>
          {onLoadSampleReport && (
            <button
              type="button"
              className="btn-load-sample-report"
              onClick={onLoadSampleReport}
              title="Add sample medical report to system"
            >
              + Load Sample Demo Report
            </button>
          )}
        </div>

        {uploadedReports.length === 0 ? (
          <div className="history-empty-card">
            <div className="history-empty-icon" aria-hidden="true">📄</div>
            <p className="history-empty-title">No reports uploaded to the system yet</p>
            <p className="history-empty-desc">
              Drop a medical PDF report in the upload box above or click "Load Sample Demo Report" to populate your workspace.
            </p>
          </div>
        ) : (
          <div className="reports-history-list">
            {uploadedReports.map((report) => {
              const isActive = activeReportId === report.id;
              return (
                <div
                  key={report.id}
                  className={`report-history-item ${isActive ? "item-active" : ""}`}
                >
                  <div className="report-item-left">
                    <div className="report-pdf-icon" aria-hidden="true">
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                        <polyline points="14 2 14 8 20 8" />
                        <line x1="16" y1="13" x2="8" y2="13" />
                        <line x1="16" y1="17" x2="8" y2="17" />
                        <polyline points="10 9 9 9 8 9" />
                      </svg>
                    </div>
                    <div className="report-item-meta">
                      <div className="report-name-row">
                        <strong className="report-item-name">{report.fileName}</strong>
                        {isActive && (
                          <span className="report-active-badge">Active</span>
                        )}
                      </div>
                      <span className="report-item-details">
                        {report.uploadedAt} · {report.fileSize || "PDF"} · <span className="report-biomarker-count">{report.biomarkersCount} biomarkers</span>
                      </span>
                    </div>
                  </div>

                  <div className="report-item-actions">
                    <button
                      type="button"
                      className="btn-history-view"
                      onClick={() => {
                        if (onSelectReport) onSelectReport(report.id);
                        if (onNavigate) onNavigate("results");
                      }}
                      title="View extracted biomarkers in Lab Results table"
                    >
                      View Results →
                    </button>
                    {onNavigate && (
                      <button
                        type="button"
                        className="btn-history-progress"
                        onClick={() => {
                          if (onSelectReport) onSelectReport(report.id);
                          onNavigate("progress");
                        }}
                        title="View biomarker progress meters"
                      >
                        Progress
                      </button>
                    )}
                    {onDeleteReport && (
                      <button
                        type="button"
                        className="btn-history-delete"
                        onClick={() => onDeleteReport(report.id)}
                        aria-label={`Remove report ${report.fileName}`}
                        title="Remove report from system"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
