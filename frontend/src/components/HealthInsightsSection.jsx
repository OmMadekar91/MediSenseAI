import React, { useState } from "react";

const SUGGESTED_QUESTIONS = [
  "What is the difference between lab ranges and diagnoses?",
  "What does low ferritin typically indicate for energy levels?",
  "What are common dietary sources of Vitamin D?",
  "What practical questions should I prepare for my doctor?",
];

export default function HealthInsightsSection({
  apiBaseUrl = "http://127.0.0.1:8000",
  initialQuestion = "",
}) {
  const [question, setQuestion] = useState(initialQuestion);
  const [answer, setAnswer] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleAsk(queryText) {
    const q = (queryText || question).trim();
    if (q.length < 3) return;

    setLoading(true);
    setError("");
    setAnswer(null);

    try {
      const response = await fetch(`${apiBaseUrl}/api/chat/ask`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: q,
          top_k: 3,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.detail || "Unable to retrieve clinical references.");
      }

      setAnswer(data);
    } catch (err) {
      setError(
        `${err.message}. If using local RAG, please verify the backend service is running.`
      );
    } finally {
      setLoading(false);
    }
  }

  function handleChipClick(chipText) {
    setQuestion(chipText);
    handleAsk(chipText);
  }

  return (
    <div className="insights-view-shell">
      <div className="insights-view-header">
        <span className="eyebrow-label">CLINICAL REFERENCE SEARCH</span>
        <h2 className="view-title">Health Insights Q&A</h2>
        <p className="view-desc">
          Ask questions about your laboratory values, physiological markers, or preparation tips grounded in verified medical references.
        </p>
      </div>

      {error && (
        <div className="alert-banner alert-banner-error" role="alert">
          <span className="alert-icon" aria-hidden="true">⚠️</span>
          <div className="alert-text">
            <strong>Notice</strong>
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

      <div className="insights-card">
        {/* Chips */}
        <div className="suggested-chips-group">
          <span className="chips-title">Suggested questions:</span>
          <div className="chips-flex">
            {SUGGESTED_QUESTIONS.map((chip, idx) => (
              <button
                key={idx}
                type="button"
                className="question-chip"
                onClick={() => handleChipClick(chip)}
              >
                {chip}
              </button>
            ))}
          </div>
        </div>

        {/* Input Form */}
        <form
          className="question-form"
          onSubmit={(e) => {
            e.preventDefault();
            handleAsk(question);
          }}
        >
          <textarea
            className="question-textarea"
            rows={3}
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Type your medical reference question here (e.g. 'What does a low ferritin result suggest?')..."
            maxLength={1000}
          />

          <div className="question-form-bar">
            <span className="char-indicator">{question.length}/1000 characters</span>
            <button
              type="submit"
              className="btn-primary-action"
              disabled={question.trim().length < 3 || loading}
            >
              {loading ? (
                <>
                  <span className="action-spinner" aria-hidden="true" />
                  <span>Searching References...</span>
                </>
              ) : (
                "Ask MediSense"
              )}
            </button>
          </div>
        </form>

        {/* Answer Box */}
        {answer && (
          <div className="answer-card" aria-live="polite">
            <div className="answer-top-bar">
              <span className="answer-heading">Evidence Summary</span>
              <span className={`answer-badge ${answer.status === "answered" ? "badge-verified" : "badge-general"}`}>
                {answer.status === "answered" ? "Verified Reference" : "General Information"}
              </span>
            </div>

            <p className="answer-body-text">{answer.answer}</p>

            {answer.sources && answer.sources.length > 0 && (
              <div className="sources-container">
                <span className="sources-title">Cited Medical References ({answer.sources.length}):</span>
                <div className="sources-list">
                  {answer.sources.map((s, idx) => (
                    <div key={s.source_id || idx} className="source-chip">
                      <strong className="source-title">{s.title || "Clinical Guide"}</strong>
                      <span className="source-meta">{s.organization || "Medical Reference"}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {answer.requires_review && (
              <div className="review-advisory">
                <span>⚠️ This result requires clinical verification with your physician.</span>
              </div>
            )}

            <div className="answer-disclaimer-box">
              <p>
                MediSense AI provides educational explanations only and does not diagnose conditions.
                Consult a licensed medical provider for clinical decisions.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
