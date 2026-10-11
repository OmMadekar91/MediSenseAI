import React, { useState, useEffect } from "react";
import "./App.css";

// Reusable UI Components
import Sidebar from "./components/Sidebar.jsx";
import PageHeader from "./components/PageHeader.jsx";
import LabResultsCard from "./components/LabResultsCard.jsx";
import UploadSection from "./components/UploadSection.jsx";
import HealthInsightsSection from "./components/HealthInsightsSection.jsx";
import {
  DashboardView,
  AssignmentsView,
  ProgressView,
} from "./components/OtherViews.jsx";

import {
  MEDICAL_TEST_GUIDES,
  getPatientFriendlyStatus,
} from "./data/medicalGuides";

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (typeof window !== "undefined" && window.location.hostname === "localhost"
    ? "http://localhost:8000"
    : "http://127.0.0.1:8000");

/**
 * Exact mock data from the reference screenshot.
 * Strictly labeled for the "Example workspace".
 */
const DEMO_WORKSPACE_RESULTS = [
  {
    id: "ferritin",
    marker: "Ferritin",
    value: "12 ng/mL",
    range: "30-150",
    status: "Review",
  },
  {
    id: "vitamin-d",
    marker: "Vitamin D",
    value: "24 ng/mL",
    range: "30-100",
    status: "Low",
  },
  {
    id: "hba1c",
    marker: "HbA1c",
    value: "5.8%",
    range: "4.8-5.6",
    status: "Watch",
  },
  {
    id: "hdl",
    marker: "HDL",
    value: "58 mg/dL",
    range: "40-90",
    status: "In range",
  },
];

export default function App() {
  // Navigation State — "dashboard" is active by default to match reference screenshot
  const [activeTab, setActiveTab] = useState("dashboard");
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Uploaded Reports List State (persisted in localStorage)
  const [uploadedReports, setUploadedReports] = useState(() => {
    try {
      const stored = localStorage.getItem("medisense_reports_history");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [activeReportId, setActiveReportId] = useState(() => {
    try {
      const stored = localStorage.getItem("medisense_reports_history");
      const list = stored ? JSON.parse(stored) : [];
      return list[0]?.id || null;
    } catch {
      return null;
    }
  });

  const [sourcePdfUrl, setSourcePdfUrl] = useState(null);
  const [isDemoMode, setIsDemoMode] = useState(false);

  // Biomarker inspection & Q&A prefill state
  const [selectedTest, setSelectedTest] = useState(null);
  const [insightsQuestion, setInsightsQuestion] = useState("");

  // Clean up Object URL when component unmounts or new file arrives
  useEffect(() => {
    return () => {
      if (sourcePdfUrl) {
        URL.revokeObjectURL(sourcePdfUrl);
      }
    };
  }, [sourcePdfUrl]);

  // Current active report
  const activeReport =
    uploadedReports.find((r) => r.id === activeReportId) ||
    uploadedReports[0] ||
    null;

  // Handle successful report parsing from UploadSection
  function handleAnalyzeSuccess(data, file) {
    if (sourcePdfUrl) {
      URL.revokeObjectURL(sourcePdfUrl);
    }
    const objectUrl = file instanceof Blob ? URL.createObjectURL(file) : null;
    setSourcePdfUrl(objectUrl);
    setIsDemoMode(false);

    const newReport = {
      id: `rep_${Date.now()}`,
      fileName: file?.name || "medical-report.pdf",
      fileSize: file?.size ? `${(file.size / 1024).toFixed(1)} KB` : "PDF",
      uploadedAt:
        new Date().toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }) +
        " " +
        new Date().toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      biomarkersCount: data?.results?.length || 0,
      data: data,
    };

    const updated = [newReport, ...uploadedReports.filter((r) => r.fileName !== newReport.fileName)];
    setUploadedReports(updated);
    setActiveReportId(newReport.id);
    try {
      localStorage.setItem("medisense_reports_history", JSON.stringify(updated));
    } catch (e) {
      console.warn("Storage quota exceeded", e);
    }

    setActiveTab("results");
  }

  // Handle selecting a report from the uploaded reports history
  function handleSelectReport(reportId) {
    setActiveReportId(reportId);
    setIsDemoMode(false);
    setSelectedTest(null);
  }

  // Handle removing a report from history
  function handleDeleteReport(reportId) {
    const updated = uploadedReports.filter((r) => r.id !== reportId);
    setUploadedReports(updated);
    try {
      localStorage.setItem("medisense_reports_history", JSON.stringify(updated));
    } catch (e) {
      console.warn(e);
    }
    if (activeReportId === reportId) {
      setActiveReportId(updated[0]?.id || null);
    }
  }

  // Handle loading sample demo report into system
  function handleLoadSampleReport() {
    const sampleData = {
      filename: "sample-report.pdf",
      page_count: 1,
      results: [
        { test_name: "Ferritin", observed_value: "12", unit: "ng/mL", reference_range: { low: 30, high: 150 }, status: "below_reported_range" },
        { test_name: "Vitamin D", observed_value: "24", unit: "ng/mL", reference_range: { low: 30, high: 100 }, status: "below_reported_range" },
        { test_name: "HbA1c", observed_value: "5.8", unit: "%", reference_range: { low: 4.8, high: 5.6 }, status: "above_reported_range" },
        { test_name: "HDL", observed_value: "58", unit: "mg/dL", reference_range: { low: 40, high: 90 }, status: "within_reported_range" },
      ],
    };
    handleAnalyzeSuccess(sampleData, { name: "sample-report.pdf", size: 142000, type: "application/pdf" });
  }

  // Handle opening the source PDF in a new browser tab
  function handleOpenSourcePdf() {
    if (sourcePdfUrl) {
      window.open(sourcePdfUrl, "_blank", "noopener,noreferrer");
    } else {
      window.open("/sample-report.pdf", "_blank", "noopener,noreferrer");
    }
  }

  // Toggle between live uploaded report and Example workspace
  function handleToggleWorkspace() {
    setIsDemoMode((prev) => !prev);
    setSelectedTest(null);
  }

  // Handle ask question shortcut from table row
  function handleAskAboutTest(testRow) {
    const prompt = `What does a ${testRow.marker} result of ${testRow.value} mean, and what questions should I ask my doctor?`;
    setInsightsQuestion(prompt);
    setActiveTab("insights");
  }

  function formatMarkerName(name) {
    if (!name) return "";
    const upper = name.toUpperCase();
    if (
      ["WBC", "RBC", "HCT", "MCV", "MCH", "MCHC", "BUN", "EGFR", "ALT", "AST", "ALP", "TSH", "HDL", "LDL", "FT4", "FT3"].includes(upper)
    ) {
      return upper;
    }
    if (name.toLowerCase() === "hba1c") return "HbA1c";
    return name.replace(/\b\w/g, (c) => c.toUpperCase());
  }

  // Prepare results array
  let currentResults = [];
  let currentWorkspaceLabel = "No report loaded";

  if (isDemoMode) {
    currentResults = DEMO_WORKSPACE_RESULTS;
    currentWorkspaceLabel = "Example workspace";
  } else if (activeReport && activeReport.data && activeReport.data.results) {
    currentWorkspaceLabel = activeReport.fileName.length > 22
      ? `${activeReport.fileName.slice(0, 19)}...`
      : activeReport.fileName;

    currentResults = activeReport.data.results.map((item, idx) => {
      const statusInfo = getPatientFriendlyStatus(item);

      let rangeDisplay = "Needs verification";
      if (item.reference_range) {
        const { low, high } = item.reference_range;
        if (low !== null && high !== null) {
          rangeDisplay = `${low}-${high}`;
        } else if (high !== null) {
          rangeDisplay = `< ${high}`;
        } else if (low !== null) {
          rangeDisplay = `> ${low}`;
        }
      }

      let statusLabel = "In range";
      if (statusInfo.code === "outside_range") {
        statusLabel = item.status === "below_reported_range" ? "Low" : "Watch";
      } else if (statusInfo.code === "needs_verification" || statusInfo.code === "range_unavailable") {
        statusLabel = "Needs verification";
      }

      return {
        id: `extracted-${idx}`,
        marker: formatMarkerName(item.test_name),
        value: `${item.observed_value} ${item.unit || ""}`.trim(),
        range: rangeDisplay,
        status: statusLabel,
        raw: item,
      };
    });
  }

  // Get educational guide for currently selected test (if any)
  const currentGuideData = selectedTest
    ? MEDICAL_TEST_GUIDES[selectedTest.marker.toLowerCase()] ||
      MEDICAL_TEST_GUIDES[selectedTest.marker.toLowerCase().replace(/\s+/g, "")]
    : null;

  return (
    <div className="medisense-app-layout">
      {/* 1. Left Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        onSelectTab={(tabId) => {
          setActiveTab(tabId);
          setSelectedTest(null);
        }}
        mobileOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
      />

      {/* 2. Main Content Shell */}
      <main className="dashboard-main-content">
        {/* Mobile Header Bar (shown on smaller screens) */}
        <div className="mobile-top-bar">
          <button
            type="button"
            className="mobile-menu-trigger"
            onClick={() => setMobileSidebarOpen(true)}
            aria-label="Open navigation menu"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>

          <span className="brand-logo-text">
            <span className="brand-name-medisense">MediSense</span>
            <span className="brand-name-ai">AI</span>
          </span>

          <div style={{ width: 24 }} />
        </div>

        {/* TAB: LAB RESULTS */}
        {activeTab === "results" && (
          <>
            {/* Page Header matching screenshot */}
            <PageHeader
              eyebrow="STRUCTURED BIOMARKER REVIEW"
              title="Lab Results"
              workspaceLabel={currentWorkspaceLabel}
              hasLiveReport={Boolean(activeReport)}
              isDemo={isDemoMode}
              onToggleWorkspace={handleToggleWorkspace}
            />

            {/* Uploaded Report Card matching screenshot */}
            <LabResultsCard
              results={currentResults}
              sourcePdfUrl={sourcePdfUrl || (isDemoMode ? "/sample-report.pdf" : null)}
              fileName={activeReport?.fileName || (isDemoMode ? "sample-report.pdf" : null)}
              isDemo={isDemoMode}
              onOpenPdf={handleOpenSourcePdf}
              selectedTest={selectedTest}
              onSelectTest={setSelectedTest}
              guideData={currentGuideData}
              onAskAboutTest={handleAskAboutTest}
              onNavigate={(tab) => setActiveTab(tab)}
              onToggleWorkspace={handleToggleWorkspace}
            />
          </>
        )}

        {/* TAB: UPLOAD LABS */}
        {activeTab === "upload" && (
          <UploadSection
            apiBaseUrl={API_BASE_URL}
            onAnalyzeSuccess={handleAnalyzeSuccess}
            currentFile={null}
            uploadedReports={uploadedReports}
            activeReportId={activeReport?.id}
            onSelectReport={handleSelectReport}
            onDeleteReport={handleDeleteReport}
            onLoadSampleReport={handleLoadSampleReport}
            onNavigate={(tab) => setActiveTab(tab)}
          />
        )}

        {/* TAB: HEALTH INSIGHTS (Evidence-grounded medical Q&A) */}
        {activeTab === "insights" && (
          <HealthInsightsSection
            apiBaseUrl={API_BASE_URL}
            initialQuestion={insightsQuestion}
          />
        )}

        {/* TAB: DASHBOARD */}
        {activeTab === "dashboard" && (
          <DashboardView
            onNavigate={(tab) => setActiveTab(tab)}
            results={currentResults}
          />
        )}

        {/* TAB: ASSIGNMENTS */}
        {activeTab === "assignments" && (
          <AssignmentsView
            results={currentResults}
            workspaceLabel={currentWorkspaceLabel}
            onNavigate={(tab) => setActiveTab(tab)}
          />
        )}

        {/* TAB: PROGRESS */}
        {activeTab === "progress" && (
          <ProgressView
            results={currentResults}
            onNavigate={(tab) => setActiveTab(tab)}
          />
        )}


      </main>
    </div>
  );
}
