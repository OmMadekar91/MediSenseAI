import React from "react";
import StatusBadge from "./StatusBadge.jsx";

/**
 * LabResultsTable component renders a 4-column table
 * matching the exact reference dashboard:
 * Columns: Marker | Value | Range | Status
 */
export default function LabResultsTable({
  results = [],
  onSelectRow,
  selectedTestName,
}) {
  if (!results || results.length === 0) {
    return (
      <div className="table-empty-state">
        <p>No biomarker results available in this report.</p>
      </div>
    );
  }

  return (
    <div className="table-responsive-wrapper">
      <table className="lab-results-table">
        <thead>
          <tr>
            <th scope="col" className="col-marker">Marker</th>
            <th scope="col" className="col-value">Value</th>
            <th scope="col" className="col-range">Range</th>
            <th scope="col" className="col-status">Status</th>
          </tr>
        </thead>
        <tbody>
          {results.map((row, index) => {
            const isSelected = selectedTestName === row.marker;
            return (
              <tr
                key={row.id || `${row.marker}-${index}`}
                className={`table-row ${isSelected ? "row-selected" : ""} ${onSelectRow ? "row-interactive" : ""}`}
                onClick={() => onSelectRow && onSelectRow(row)}
                tabIndex={onSelectRow ? 0 : undefined}
                onKeyDown={(e) => {
                  if (onSelectRow && (e.key === "Enter" || e.key === " ")) {
                    e.preventDefault();
                    onSelectRow(row);
                  }
                }}
              >
                <td className="cell-marker">
                  <span className="marker-name">{row.marker}</span>
                </td>
                <td className="cell-value">
                  <span className="value-text">{row.value}</span>
                </td>
                <td className="cell-range">
                  <span className="range-text">{row.range}</span>
                </td>
                <td className="cell-status">
                  <StatusBadge status={row.status} />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
