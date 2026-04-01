'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

const RECOMMENDATION_LABELS: Record<string, { label: string; color: string; emoji: string }> = {
  hire: { label: 'Hire', color: 'badge-green', emoji: '🟢' },
  maybe: { label: 'Maybe', color: 'badge-yellow', emoji: '🟡' },
  fail: { label: 'Fail', color: 'badge-red', emoji: '🔴' },
  // Legacy mappings
  strong_hire: { label: 'Strong Hire', color: 'badge-green', emoji: '🟢' },
  no_hire: { label: 'No Hire', color: 'badge-gray', emoji: '⚪' },
  suspicious: { label: 'Suspicious', color: 'badge-red', emoji: '🔴' },
};

export default function CandidatesPage() {
  const [candidates, setCandidates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetch('/api/candidates')
      .then((res) => res.json())
      .then((data) => {
        setCandidates(data.candidates || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="loading-page">
        <div className="spinner"></div>
        <p className="loading-text">Loading candidates...</p>
      </div>
    );
  }

  const filteredCandidates = filter === 'all'
    ? candidates
    : candidates.filter((c) => c.status === filter);

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Candidates</h1>
        <p className="page-subtitle">
          View all candidate submissions and their evaluation status.
        </p>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 'var(--space-2)', marginBottom: 'var(--space-6)' }}>
        {['all', 'in_progress', 'completed', 'evaluated'].map((f) => (
          <button
            key={f}
            className={`btn btn-sm ${filter === f ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setFilter(f)}
          >
            {f === 'all' ? 'All' : f.replace('_', ' ')}
            {f === 'all' && ` (${candidates.length})`}
          </button>
        ))}
      </div>

      {filteredCandidates.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <div className="empty-icon">👥</div>
            <h4 className="empty-title">No candidates found</h4>
            <p className="empty-description">
              {filter === 'all'
                ? 'Share your assessment links to receive candidate submissions.'
                : `No candidates with status "${filter.replace('_', ' ')}".`}
            </p>
          </div>
        </div>
      ) : (
        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>Candidate</th>
                <th>Assessment</th>
                <th>Experience</th>
                <th>Skills</th>
                <th>Status / Result</th>
                <th>Date</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filteredCandidates.map((c: any) => (
                <tr key={c._id}>
                  <td>
                    <div style={{ fontWeight: 600, color: 'var(--gray-900)' }}>
                      {c.name}
                    </div>
                    <div className="text-xs text-gray-500">{c.email}</div>
                  </td>
                  <td className="text-sm">{c.assessmentId?.title || '—'}</td>
                  <td>
                    <span className="badge badge-violet" style={{ textTransform: 'capitalize' }}>
                      {c.experienceLevel || 'unknown'}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', maxWidth: '200px' }}>
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
                    {new Date(c.createdAt).toLocaleDateString()}
                  </td>
                  <td>
                    <Link
                      href={`/dashboard/candidates/${c._id}`}
                      className="btn btn-ghost btn-sm"
                    >
                      View →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
