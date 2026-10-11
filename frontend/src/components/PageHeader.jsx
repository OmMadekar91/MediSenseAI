import React from "react";

/**
 * PageHeader component renders the header area above the table card:
 * - Green uppercase eyebrow: STRUCTURED BIOMARKER REVIEW
 * - Bold dark navy title: Lab Results
 * - Upper-right pill: Example workspace (with toggle option if report loaded)
 */
export default function PageHeader({
  eyebrow = "STRUCTURED BIOMARKER REVIEW",
  title = "Lab Results",
  workspaceLabel = "Example workspace",
  hasLiveReport = false,
  isDemo = true,
  onToggleWorkspace,
}) {
  return (
    <header className="dashboard-page-header">
      <div className="header-left">
        <span className="eyebrow-label">{eyebrow}</span>
        <h1 className="page-title">{title}</h1>
      </div>

      <div className="header-right">
        {hasLiveReport && onToggleWorkspace ? (
          <button
            type="button"
            className="workspace-pill-btn"
            onClick={onToggleWorkspace}
            title={isDemo ? "Switch to your uploaded report" : "Switch to example workspace"}
            aria-label="Toggle workspace"
          >
            <span className="workspace-dot" />
            <span>{isDemo ? "Example workspace" : workspaceLabel}</span>
            <span className="workspace-switch-hint">({isDemo ? "view live" : "view demo"})</span>
          </button>
        ) : (
          <div className="workspace-pill" aria-label="Current workspace">
            <span>{workspaceLabel}</span>
          </div>
        )}
      </div>
    </header>
  );
}
