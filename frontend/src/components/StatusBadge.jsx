import React from "react";

/**
 * StatusBadge component renders a rounded pill status badge
 * matching the exact styling of the reference screenshot:
 * - Review: Pale yellow/amber background with dark amber text
 * - Low: Pale yellow background with dark amber text
 * - Watch: Pale pink background with dark rose text
 * - In range: Pale mint-green background with dark green text
 * - Needs verification: Pale blue background with dark blue text
 */
export default function StatusBadge({ status, className = "" }) {
  const normalized = String(status || "").trim().toLowerCase();

  let badgeType = "in-range";
  let label = status || "In range";

  if (normalized.includes("review")) {
    badgeType = "review";
    label = "Review";
  } else if (normalized.includes("low") || normalized.includes("below")) {
    badgeType = "low";
    label = "Low";
  } else if (normalized.includes("watch") || normalized.includes("above") || normalized.includes("high")) {
    badgeType = "watch";
    label = "Watch";
  } else if (normalized.includes("range") || normalized.includes("normal") || normalized.includes("optimal")) {
    badgeType = "in-range";
    label = "In range";
  } else if (normalized.includes("verif") || normalized.includes("unavail") || normalized.includes("check")) {
    badgeType = "verify";
    label = "Needs verification";
  }

  return (
    <span
      className={`status-pill-badge badge-${badgeType} ${className}`}
      role="status"
      aria-label={`Status: ${label}`}
    >
      {label}
    </span>
  );
}
