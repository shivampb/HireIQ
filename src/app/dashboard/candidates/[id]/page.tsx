"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const RECOMMENDATION_LABELS: Record<
  string,
  { label: string; color: string; emoji: string }
> = {
  hire: { label: "Hire", color: "badge-green", emoji: "🟢" },
  maybe: { label: "Maybe", color: "badge-yellow", emoji: "🟡" },
  fail: { label: "Fail", color: "badge-red", emoji: "🔴" },
  // Legacy mappings
  strong_hire: { label: "Strong Hire", color: "badge-green", emoji: "🟢" },
  no_hire: { label: "No Hire", color: "badge-gray", emoji: "⚪" },
  suspicious: { label: "Suspicious", color: "badge-red", emoji: "🔴" },
};

export default function CandidateDetailPage() {
  const params = useParams();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  const fetchData = () => {
    fetch(`/api/candidates/${params.id}`)
      .then((res) => res.json())
      .then((d) => {
        setData(d);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, [params.id]);

  const generateReport = async () => {
    if (!data?.candidate) return;

    try {
      // Find the assessment link - we need it for the API
      const assessmentRes = await fetch(
        `/api/assessments/${data.candidate.assessmentId}`,
      );
      const assessmentData = await assessmentRes.json();

      const res = await fetch(
        `/api/assess/${assessmentData.assessment.uniqueLink}/report`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ candidateId: params.id, force: true }),
        },
      );

      if (res.ok) {
        fetchData();
      }
    } catch (err) {
      console.error("Generate report error:", err);
    } finally {
      setGenerating(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-page">
        <div className="spinner"></div>
        <p className="loading-text">Loading candidate details...</p>
      </div>
    );
  }

  const { candidate, report, questions } = data || {};

  if (!candidate) {
    return (
      <div className="empty-state">
        <div className="empty-icon">❌</div>
        <h4 className="empty-title">Candidate not found</h4>
        <Link href="/dashboard/candidates" className="btn btn-primary">
          ← Back to Candidates
        </Link>
      </div>
    );
  }

  const rec = report ? RECOMMENDATION_LABELS[report.recommendation] : null;

  const getScoreClass = (score: number) => {
    if (score >= 80) return "excellent";
    if (score >= 60) return "good";
    if (score >= 40) return "average";
    return "poor";
  };

  return (
    <div>
      <div className="page-header">
        <Link
          href="/dashboard/candidates"
          className="text-sm text-gray-500"
          style={{ display: "block", marginBottom: "var(--space-2)" }}
        >
          ← Back to Candidates
        </Link>
      </div>

      {/* Report Header */}
      {report ? (
        <>
          <div className="report-header">
            <div className="report-header-content">
              <div className="report-title">{candidate.name}</div>
              <div className="report-meta">
                {candidate.email} · {candidate.experienceLevel} level ·
                Completed{" "}
                {candidate.completedAt
                  ? new Date(candidate.completedAt).toLocaleDateString()
                  : "—"}
              </div>

              <div className="report-score-section">
                <div className="report-score-big">
                  <div className="report-score-value">
                    {report.overallScore}
                  </div>
                  <div className="report-score-label">Overall Score</div>
                </div>

                <div>
                  <div
                    className="report-recommendation"
                    style={{ marginBottom: "var(--space-3)" }}
                  >
                    {rec?.emoji} {rec?.label}
                  </div>
                  <div
                    style={{ fontSize: "var(--font-size-sm)", opacity: 0.8 }}
                  >
                    Suspicion Score: {report.suspicionScore}/100
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Force Regenerate Button & View Resume */}
          <div
            style={{
              marginBottom: "var(--space-6)",
              display: "flex",
              gap: "var(--space-3)",
              justifyContent: "flex-end",
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            <a
              href={`/api/candidates/${params.id}/resume`}
              download
              className="btn btn-secondary btn-sm"
              title="Download candidate resume"
              style={{ textDecoration: "none" }}
            >
              📥 View Resume
            </a>
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => {
                if (!data?.candidate) return;
                setGenerating(true);
                setTimeout(() => {
                  void generateReport();
                }, 0);
              }}
              disabled={generating}
              title="Force regenerate AI report (will replace existing report)"
            >
              {generating ? (
                <>
                  <span
                    className="spinner spinner-sm"
                    style={{
                      borderTopColor: "currentColor",
                      marginRight: "4px",
                    }}
                  ></span>
                  Regenerating...
                </>
              ) : (
                "🔄 Force Regenerate Report"
              )}
            </button>
          </div>

          {/* Report Content */}
          <div className="report-grid">
            {/* Summary */}
            <div className="report-section report-full-width">
              <h3 className="report-section-title">📋 Summary</h3>
              <p
                style={{
                  fontSize: "var(--font-size-sm)",
                  color: "var(--gray-700)",
                  lineHeight: 1.7,
                }}
              >
                {report.summary}
              </p>
            </div>

            {/* Skill Scores */}
            <div className="report-section">
              <h3 className="report-section-title">🎯 Skill Analysis</h3>
              {report.skillScores?.map((skill: any) => (
                <div
                  key={skill.skill}
                  style={{ marginBottom: "var(--space-4)" }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: "var(--space-1)",
                    }}
                  >
                    <span className="text-sm font-semibold">{skill.skill}</span>
                    <span className="text-sm text-gray-500">
                      {skill.score}/100
                    </span>
                  </div>
                  <div className="progress-bar">
                    <div
                      className={`progress-fill ${skill.score >= 70 ? "green" : skill.score >= 40 ? "" : "red"}`}
                      style={{ width: `${skill.score}%` }}
                    ></div>
                  </div>
                  <div
                    className="text-xs text-gray-500 mt-4"
                    style={{ marginTop: "2px" }}
                  >
                    {skill.correctAnswers}/{skill.questionsAsked} questions
                    answered well
                  </div>
                </div>
              ))}
            </div>

            {/* Behavioral Analysis */}
            <div className="report-section">
              <h3 className="report-section-title">🧠 Behavioral Analysis</h3>
              {report.behavioralAnalysis &&
                Object.entries(report.behavioralAnalysis).map(
                  ([key, value]: [string, any]) => (
                    <div key={key} style={{ marginBottom: "var(--space-4)" }}>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          marginBottom: "var(--space-1)",
                        }}
                      >
                        <span
                          className="text-sm font-semibold"
                          style={{ textTransform: "capitalize" }}
                        >
                          {key.replace(/([A-Z])/g, " $1").trim()}
                        </span>
                        <span className="text-sm text-gray-500">
                          {value}/100
                        </span>
                      </div>
                      <div className="progress-bar">
                        <div
                          className={`progress-fill ${value >= 70 ? "green" : value >= 40 ? "" : "red"}`}
                          style={{ width: `${value}%` }}
                        ></div>
                      </div>
                    </div>
                  ),
                )}
            </div>

            {/* Suspicion Flags */}
            {report.suspicionFlags?.length > 0 && (
              <div className="report-section report-full-width">
                <h3 className="report-section-title">⚠️ Suspicion Flags</h3>
                {report.suspicionFlags.map((flag: any, i: number) => (
                  <div key={i} className={`suspicion-flag ${flag.severity}`}>
                    <div>
                      <div
                        className="font-semibold text-sm"
                        style={{ marginBottom: "2px" }}
                      >
                        {flag.type}
                        <span
                          className={`badge badge-${flag.severity === "high" ? "red" : flag.severity === "medium" ? "yellow" : "blue"}`}
                          style={{ marginLeft: "var(--space-2)" }}
                        >
                          {flag.severity}
                        </span>
                      </div>
                      <div className="text-sm text-gray-700">
                        {flag.description}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Detailed Feedback */}
            <div className="report-section report-full-width">
              <h3 className="report-section-title">💬 Detailed Feedback</h3>
              <p
                style={{
                  fontSize: "var(--font-size-sm)",
                  color: "var(--gray-700)",
                  lineHeight: 1.7,
                }}
              >
                {report.detailedFeedback}
              </p>
            </div>

            {/* Q&A Review */}
            <div className="report-section report-full-width">
              <h3 className="report-section-title">
                📝 Question & Answer Review
              </h3>
              {questions?.map((q: any, i: number) => (
                <div
                  key={q._id}
                  style={{
                    padding: "var(--space-4)",
                    borderRadius: "var(--radius-lg)",
                    background: "var(--gray-50)",
                    marginBottom: "var(--space-4)",
                    border: "1px solid var(--gray-200)",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: "var(--space-2)",
                    }}
                  >
                    <span className="text-xs font-semibold text-gray-500">
                      Q{i + 1} · {q.category}
                    </span>
                    <div style={{ display: "flex", gap: "var(--space-2)" }}>
                      <span
                        className={`badge ${q.evaluation?.score >= 70 ? "badge-green" : q.evaluation?.score >= 40 ? "badge-yellow" : "badge-red"}`}
                      >
                        {q.evaluation?.score || 0}/100
                      </span>
                      {q.evaluation && !q.evaluation.matchesResume && (
                        <span className="badge badge-red">⚠ Mismatch</span>
                      )}
                    </div>
                  </div>
                  <div
                    className="font-semibold text-sm question-markdown"
                    style={{
                      marginBottom: "var(--space-2)",
                      color: "var(--gray-900)",
                    }}
                  >
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {q.question}
                    </ReactMarkdown>
                  </div>
                  <p
                    className="text-sm"
                    style={{
                      color: "var(--gray-700)",
                      marginBottom: "var(--space-2)",
                      padding: "var(--space-3)",
                      background: "white",
                      borderRadius: "var(--radius-md)",
                      border: "1px solid var(--gray-200)",
                    }}
                  >
                    {q.answer || "No answer provided"}
                  </p>
                  {q.evaluation?.feedback && (
                    <p
                      className="text-xs"
                      style={{ color: "var(--gray-500)", fontStyle: "italic" }}
                    >
                      AI Feedback: {q.evaluation.feedback}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </>
      ) : (
        /* No report yet */
        <div className="card">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "var(--space-6)",
            }}
          >
            <div>
              <h2 className="card-title">{candidate.name}</h2>
              <p className="text-sm text-gray-500">{candidate.email}</p>
            </div>
            <span
              className={`badge ${
                candidate.status === "completed"
                  ? "badge-blue"
                  : candidate.status === "in_progress"
                    ? "badge-yellow"
                    : "badge-gray"
              }`}
            >
              {candidate.status.replace("_", " ")}
            </span>
          </div>

          {/* Skills */}
          {candidate.resumeSkills?.length > 0 && (
            <div style={{ marginBottom: "var(--space-6)" }}>
              <h4
                className="text-sm font-semibold mb-4"
                style={{ marginBottom: "var(--space-2)" }}
              >
                Skills from Resume
              </h4>
              <div className="assessment-skills">
                {candidate.resumeSkills.map((s: string) => (
                  <span key={s} className="skill-tag">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}

          {candidate.status === "completed" ? (
            <div style={{ textAlign: "center", padding: "var(--space-8)" }}>
              <div style={{ fontSize: "3rem", marginBottom: "var(--space-4)" }}>
                📊
              </div>
              <h3 className="empty-title">Assessment Completed</h3>
              <p className="empty-description">
                This candidate has completed the assessment. Generate the AI
                evaluation report to see detailed results.
              </p>
              <button
                className="btn btn-primary btn-lg"
                onClick={() => {
                  if (!data?.candidate) return;
                  setGenerating(true);
                  // Defer heavy work to next tick so the browser can paint the button state
                  setTimeout(() => {
                    void generateReport();
                  }, 0);
                }}
                disabled={generating}
              >
                {generating ? (
                  <>
                    <span
                      className="spinner spinner-sm"
                      style={{ borderTopColor: "white" }}
                    ></span>
                    Generating Report...
                  </>
                ) : (
                  "🤖 Generate AI Report"
                )}
              </button>
            </div>
          ) : candidate.status === "in_progress" ? (
            <div style={{ textAlign: "center", padding: "var(--space-8)" }}>
              <div style={{ fontSize: "3rem", marginBottom: "var(--space-4)" }}>
                ⏳
              </div>
              <h3 className="empty-title">Assessment In Progress</h3>
              <p className="empty-description">
                This candidate is currently taking the assessment. The report
                will be available once they complete it.
              </p>
              <div
                className="progress-bar"
                style={{
                  maxWidth: "300px",
                  margin: "0 auto",
                  marginTop: "var(--space-4)",
                }}
              >
                <div
                  className="progress-fill"
                  style={{
                    width: `${questions ? (candidate.currentQuestionIndex / questions.length) * 100 : 0}%`,
                  }}
                ></div>
              </div>
              <p
                className="text-xs text-gray-500 mt-4"
                style={{ marginTop: "var(--space-2)" }}
              >
                Progress: {candidate.currentQuestionIndex}/
                {questions?.length || "?"} questions
              </p>
            </div>
          ) : (
            <div style={{ textAlign: "center", padding: "var(--space-8)" }}>
              <div style={{ fontSize: "3rem", marginBottom: "var(--space-4)" }}>
                📄
              </div>
              <h3 className="empty-title">Pending</h3>
              <p className="empty-description">
                This candidate has not started the assessment yet.
              </p>
            </div>
          )}

          {/* Q&A Review for completed but not evaluated */}
          {questions &&
            questions.length > 0 &&
            questions.some((q: any) => q.answer) && (
              <div style={{ marginTop: "var(--space-8)" }}>
                <h3 className="card-title mb-4">
                  Answers ({questions.filter((q: any) => q.answer).length}/
                  {questions.length})
                </h3>
                {questions
                  .filter((q: any) => q.answer)
                  .map((q: any, i: number) => (
                    <div
                      key={q._id}
                      style={{
                        padding: "var(--space-4)",
                        borderRadius: "var(--radius-lg)",
                        background: "var(--gray-50)",
                        marginBottom: "var(--space-3)",
                        border: "1px solid var(--gray-200)",
                      }}
                    >
                      <div
                        className="font-semibold text-sm"
                        style={{
                          marginBottom: "var(--space-2)",
                          color: "var(--gray-900)",
                        }}
                      >
                        <div style={{ marginBottom: "0.25rem" }}>
                          Q{q.order + 1}:
                        </div>
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {q.question}
                        </ReactMarkdown>
                      </div>
                      <p
                        className="text-sm"
                        style={{ color: "var(--gray-700)" }}
                      >
                        {q.answer}
                      </p>
                    </div>
                  ))}
              </div>
            )}
        </div>
      )}
    </div>
  );
}
