import React from "react";

// Clean medical brain emblem SVG for the brand logo
function BrainLogoIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="white"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 4.44-2.04Z" />
      <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-4.44-2.04Z" />
    </svg>
  );
}

function NavIcon({ name }) {
  switch (name) {
    case "dashboard":
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
      );
    case "upload":
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="12" y1="18" x2="12" y2="12" />
          <line x1="9" y1="15" x2="15" y2="15" />
        </svg>
      );
    case "results":
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="6" y1="20" x2="6" y2="14" />
          <line x1="12" y1="20" x2="12" y2="8" />
          <line x1="18" y1="20" x2="18" y2="11" />
        </svg>
      );
    case "assignments":
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
          <rect width="8" height="4" x="8" y="2" rx="1" ry="1" />
          <path d="m9 14 2 2 4-4" />
        </svg>
      );
    case "progress":
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
          <polyline points="16 7 22 7 22 13" />
        </svg>
      );
    case "insights":
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" />
          <path d="M9 18h6" />
          <path d="M10 22h4" />
        </svg>
      );
    default:
      return null;
  }
}

const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard" },
  { id: "upload", label: "Upload Labs" },
  { id: "results", label: "Lab Results" },
  { id: "assignments", label: "Assignments" },
  { id: "progress", label: "Progress" },
  { id: "insights", label: "Health Insights" },
];

/**
 * Sidebar component matching reference screenshot:
 * - Brand logo: MediSense (dark navy) AI (teal)
 * - Navigation links with clean icons
 * - Active pill with pale mint background and emerald left border
 * - Bottom promo card with crown icon
 */
export default function Sidebar({
  activeTab = "dashboard",
  onSelectTab,
  mobileOpen = false,
  onCloseMobile,
}) {
  return (
    <>
      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          className="sidebar-backdrop"
          onClick={onCloseMobile}
          aria-hidden="true"
        />
      )}

      <aside className={`dashboard-sidebar ${mobileOpen ? "sidebar-mobile-open" : ""}`}>
        {/* Top Brand Logo */}
        <div className="sidebar-brand-wrapper">
          <a
            href="#dashboard"
            className="sidebar-brand-link"
            onClick={(e) => {
              e.preventDefault();
              if (onSelectTab) onSelectTab("dashboard");
            }}
            aria-label="MediSense AI Home"
          >
            <div className="brand-logo-icon">
              <BrainLogoIcon />
            </div>
            <div className="brand-logo-text">
              <span className="brand-name-medisense">MediSense</span>
              <span className="brand-name-ai">AI</span>
            </div>
          </a>

          {/* Mobile close button */}
          <button
            type="button"
            className="sidebar-mobile-close"
            onClick={onCloseMobile}
            aria-label="Close sidebar navigation"
          >
            ✕
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="sidebar-nav" aria-label="Main Navigation">
          <ul className="sidebar-nav-list">
            {NAV_ITEMS.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <li key={item.id} className="sidebar-nav-item">
                  <button
                    type="button"
                    className={`sidebar-nav-btn ${isActive ? "active" : ""}`}
                    onClick={() => {
                      if (onSelectTab) onSelectTab(item.id);
                      if (onCloseMobile) onCloseMobile();
                    }}
                    aria-current={isActive ? "page" : undefined}
                  >
                    <span className="nav-btn-icon" aria-hidden="true">
                      <NavIcon name={item.id} />
                    </span>
                    <span className="nav-btn-label">{item.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Bottom Promotional Card with Crown Icon */}
        <div className="sidebar-footer-promo">
          <div className="promo-card">
            <div className="promo-card-content">
              <div className="promo-crown-icon" aria-hidden="true">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="#a16207">
                  <path d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5zm14 3c0 .6-.4 1-1 1H6c-.6 0-1-.4-1-1v-1h14v1z" />
                </svg>
              </div>
              <div className="promo-text-group">
                <h4 className="promo-card-title">Premium access</h4>
                <p className="promo-card-desc">
                  Protocols, trends, and check-ins
                </p>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
