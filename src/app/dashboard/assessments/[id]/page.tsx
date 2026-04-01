'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const RECOMMENDATION_LABELS: Record<string, { label: string; color: string; emoji: string }> = {
  hire: { label: 'Hire', color: 'badge-green', emoji: '🟢' },
  maybe: { label: 'Maybe', color: 'badge-yellow', emoji: '🟡' },
  fail: { label: 'Fail', color: 'badge-red', emoji: '🔴' },
  // Legacy mappings
  strong_hire: { label: 'Strong Hire', color: 'badge-green', emoji: '🟢' },
  no_hire: { label: 'No Hire', color: 'badge-gray', emoji: '⚪' },
  suspicious: { label: 'Suspicious', color: 'badge-red', emoji: '🔴' },
};

export default function AssessmentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [candidateToDelete, setCandidateToDelete] = useState<any>(null);

  const executeDeleteCandidate = async () => {
    if (!candidateToDelete) return;
    const candidateId = candidateToDelete._id;
    
    setDeletingId(candidateId);
    try {
      const res = await fetch(`/api/candidates/${candidateId}`, {
        method: 'DELETE',
      });
      
      if (res.ok) {
        setData((prevData: any) => ({
          ...prevData,
          candidates: prevData.candidates.filter((c: any) => c._id !== candidateId)
        }));
        setCandidateToDelete(null);
      } else {
        const errorText = await res.text();
        alert(`Failed to delete candidate. Status: ${res.status}. Error: ${errorText}`);
      }
    } catch (error: any) {
      alert(`Network Error deleting candidate: ${error.message}`);
    } finally {
      setDeletingId(null);
    }
  };

  useEffect(() => {
    fetch(`/api/assessments/${params.id}`)
      .then((res) => res.json())
      .then((d) => {
        setData(d);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [params.id]);

  if (loading) {
    return (
      <div className="loading-page">
        <div className="spinner"></div>
        <p className="loading-text">Loading assessment...</p>
      </div>
    );
  }

  if (!data?.assessment) {
    return (
      <div className="empty-state">
        <div className="empty-icon">❌</div>
        <h4 className="empty-title">Assessment not found</h4>
        <Link href="/dashboard/assessments" className="btn btn-primary">
          ← Back to Assessments
        </Link>
      </div>
    );
  }

  const { assessment, candidates } = data;

  return (
    <div>
      <div className="page-header">
        <Link href="/dashboard/assessments" className="text-sm text-gray-500" style={{ display: 'block', marginBottom: 'var(--space-2)' }}>
          ← Back to Assessments
        </Link>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h1 className="page-title">{assessment.title}</h1>
            <div className="page-subtitle" style={{ marginTop: 'var(--space-2)' }}>
              {assessment.description ? (
                 <div className="markdown-body text-gray-500" style={{ fontSize: 'var(--font-size-sm)', lineHeight: '1.6' }}>
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{assessment.description}</ReactMarkdown>
                 </div>
              ) : (
                'No description'
              )}
            </div>
          </div>
          <span className={`badge ${assessment.status === 'active' ? 'badge-green' : 'badge-yellow'}`}>
            {assessment.status}
          </span>
        </div>
      </div>

      {/* Assessment Info */}
      <div className="stat-grid" style={{ marginBottom: 'var(--space-8)' }}>
        <div className="stat-card blue">
          <div className="stat-icon blue">📋</div>
          <div className="stat-value">{assessment.questionCount}</div>
          <div className="stat-label">Questions</div>
        </div>
        <div className="stat-card green">
          <div className="stat-icon green">👥</div>
          <div className="stat-value">{candidates?.length || 0}</div>
          <div className="stat-label">Candidates</div>
        </div>
        <div className="stat-card violet">
          <div className="stat-icon violet">🎯</div>
          <div className="stat-value" style={{ fontSize: 'var(--font-size-xl)', textTransform: 'capitalize' }}>
            {assessment.difficulty}
          </div>
          <div className="stat-label">Difficulty</div>
        </div>
      </div>

      {/* Skills */}
      {assessment.skills?.length > 0 && (
        <div className="card mb-6">
          <h3 className="card-title mb-4">Target Skills</h3>
          <div className="assessment-skills">
            {assessment.skills.map((s: string) => (
              <span key={s} className="skill-tag">{s}</span>
            ))}
          </div>
        </div>
      )}

      {/* Assessment Link */}
      <div className="card mb-6">
        <h3 className="card-title mb-4">Assessment Link</h3>
        <div className="assessment-link-box" style={{ fontSize: 'var(--font-size-sm)' }}>
          <span className="assessment-link-text" style={{ fontSize: 'var(--font-size-sm)' }}>
            {typeof window !== 'undefined' ? window.location.origin : ''}/assess/{assessment.uniqueLink}
          </span>
          <button
            className="btn btn-primary btn-sm"
            onClick={() => {
              navigator.clipboard.writeText(
                `${window.location.origin}/assess/${assessment.uniqueLink}`
              );
            }}
          >
            Copy Link
          </button>
        </div>
      </div>

      {/* Candidates Table */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Candidates</h3>
        </div>

        {!candidates || candidates.length === 0 ? (
          <div className="empty-state" style={{ padding: 'var(--space-10) var(--space-4)' }}>
            <div className="empty-icon">👥</div>
            <h4 className="empty-title">No candidates yet</h4>
            <p className="empty-description">
              Share the assessment link with candidates to get started.
            </p>
          </div>
        ) : (
          <div className="table-wrapper" style={{ border: 'none' }}>
            <table className="table">
              <thead>
                <tr>
                  <th>Candidate</th>
                  <th>Skills Detected</th>
                  <th>Status / Result</th>
                  <th>Started</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {candidates.map((c: any) => (
                  <tr key={c._id}>
                    <td>
                      <div style={{ fontWeight: 600, color: 'var(--gray-900)' }}>{c.name}</div>
                      <div className="text-xs text-gray-500">{c.email}</div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: 'var(--space-1)', flexWrap: 'wrap' }}>
                        {c.resumeSkills?.slice(0, 3).map((s: string) => (
                          <span key={s} className="badge badge-blue">{s}</span>
                        ))}
                        {c.resumeSkills?.length > 3 && (
                          <span className="badge badge-gray">+{c.resumeSkills.length - 3}</span>
                        )}
                      </div>
                    </td>
                    <td>
                      {c.status === 'evaluated' && c.report?.recommendation ? (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '4px' }}>
                          <span className={`badge ${RECOMMENDATION_LABELS[c.report.recommendation]?.color || 'badge-gray'}`}>
                            {RECOMMENDATION_LABELS[c.report.recommendation]?.label}
                          </span>
                          <span className="text-xs text-gray-500 font-medium">
                            Score: {c.report.overallScore}/100
                          </span>
                        </div>
                      ) : (
                        <span
                          className={`badge ${
                            c.status === 'evaluated'
                              ? 'badge-green'
                              : c.status === 'completed'
                              ? 'badge-blue'
                              : c.status === 'in_progress'
                              ? 'badge-yellow'
                              : 'badge-gray'
                          }`}
                        >
                          {c.status.replace('_', ' ')}
                        </span>
                      )}
                    </td>
                    <td className="text-sm text-gray-500">
                      {c.startedAt
                        ? new Date(c.startedAt).toLocaleDateString()
                        : '—'}
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: 'var(--space-2)', alignItems: 'center' }}>
                        <Link
                          href={`/dashboard/candidates/${c._id}`}
                          className="btn btn-ghost btn-sm"
                        >
                          View Report →
                        </Link>
                        <button
                          onClick={() => setCandidateToDelete(c)}
                          className="btn btn-ghost btn-sm"
                          style={{ color: '#dc2626', padding: 'var(--space-1) var(--space-2)' }}
                          disabled={deletingId === c._id}
                          title="Delete Candidate"
                        >
                          {deletingId === c._id ? '...' : '🗑️'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Custom Delete Confirmation Modal */}
      {candidateToDelete && (
        <div className="modal-overlay" onClick={() => setCandidateToDelete(null)}>
          <div className="modal" style={{ maxWidth: '400px' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title" style={{ color: '#dc2626' }}>Delete Candidate</h2>
              <p className="modal-subtitle">
                Are you sure you want to completely remove <strong>{candidateToDelete.name}</strong>? 
                This will also permanently delete their AI assessment report. This cannot be undone.
              </p>
            </div>
            
            <div className="modal-footer" style={{ marginTop: 'var(--space-6)' }}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setCandidateToDelete(null)}
                disabled={deletingId !== null}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-primary"
                style={{ background: '#dc2626', borderColor: '#dc2626' }}
                onClick={executeDeleteCandidate}
                disabled={deletingId !== null}
              >
                {deletingId !== null ? 'Deleting...' : 'Yes, Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
