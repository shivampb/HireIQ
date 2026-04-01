'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface DashboardData {
  stats: {
    totalAssessments: number;
    activeAssessments: number;
    totalCandidates: number;
    completedCandidates: number;
    evaluatedCandidates: number;
    avgScore: number;
    recommendationCounts: {
      hire: number;
      maybe: number;
      fail: number;
    };
  };
  recentCandidates: any[];
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/dashboard')
      .then((res) => res.json())
      .then((d) => {
        setData(d);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="loading-page">
        <div className="spinner"></div>
        <p className="loading-text">Loading dashboard...</p>
      </div>
    );
  }

  const stats = data?.stats;

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Dashboard Overview</h1>
        <p className="page-subtitle">
          Track your assessments and candidate performance at a glance.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="stat-grid">
        <div className="stat-card blue">
          <div className="stat-icon blue">📝</div>
          <div className="stat-value">{stats?.totalAssessments || 0}</div>
          <div className="stat-label">Total Assessments</div>
        </div>

        <div className="stat-card green">
          <div className="stat-icon green">✅</div>
          <div className="stat-value">{stats?.activeAssessments || 0}</div>
          <div className="stat-label">Active Assessments</div>
        </div>

        <div className="stat-card violet">
          <div className="stat-icon violet">👥</div>
          <div className="stat-value">{stats?.totalCandidates || 0}</div>
          <div className="stat-label">Total Candidates</div>
        </div>

        <div className="stat-card warning">
          <div className="stat-icon warning">⭐</div>
          <div className="stat-value">{stats?.avgScore || 0}%</div>
          <div className="stat-label">Average Score</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div style={{ display: 'flex', gap: 'var(--space-4)', marginBottom: 'var(--space-8)' }}>
        <Link href="/dashboard/assessments" className="btn btn-primary">
          📝 Create Assessment
        </Link>
        <Link href="/dashboard/candidates" className="btn btn-secondary">
          👥 View Candidates
        </Link>
      </div>

      {/* Recommendation Summary */}
      {stats && (stats.recommendationCounts.hire > 0 || stats.recommendationCounts.maybe > 0 || stats.recommendationCounts.fail > 0) && (
        <div className="card mb-6">
          <div className="card-header">
            <h3 className="card-title">Recommendation Summary</h3>
          </div>
          <div style={{ display: 'flex', gap: 'var(--space-4)', flexWrap: 'wrap' }}>
            <div className="badge badge-green">🟢 Hire: {stats.recommendationCounts.hire}</div>
            <div className="badge badge-yellow">🟡 Maybe: {stats.recommendationCounts.maybe}</div>
            <div className="badge badge-red">🔴 Fail: {stats.recommendationCounts.fail}</div>
          </div>
        </div>
      )}

      {/* Recent Candidates */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Recent Candidates</h3>
          <Link href="/dashboard/candidates" className="btn btn-ghost btn-sm">
            View all →
          </Link>
        </div>

        {!data?.recentCandidates || data.recentCandidates.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">👥</div>
            <h4 className="empty-title">No candidates yet</h4>
            <p className="empty-description">
              Create an assessment and share the link to start receiving candidate submissions.
            </p>
            <Link href="/dashboard/assessments" className="btn btn-primary">
              Create Assessment
            </Link>
          </div>
        ) : (
          <div className="table-wrapper" style={{ border: 'none' }}>
            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Assessment</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {data.recentCandidates.map((candidate: any) => (
                  <tr key={candidate._id}>
                    <td>
                      <div style={{ fontWeight: 600, color: 'var(--gray-900)' }}>
                        {candidate.name}
                      </div>
                      <div className="text-xs text-gray-500">{candidate.email}</div>
                    </td>
                    <td>{candidate.assessmentId?.title || '—'}</td>
                    <td>
                      <span
                        className={`badge ${
                          candidate.status === 'evaluated'
                            ? 'badge-green'
                            : candidate.status === 'completed'
                            ? 'badge-blue'
                            : candidate.status === 'in_progress'
                            ? 'badge-yellow'
                            : 'badge-gray'
                        }`}
                      >
                        {candidate.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="text-sm text-gray-500">
                      {new Date(candidate.createdAt).toLocaleDateString()}
                    </td>
                    <td>
                      <Link
                        href={`/dashboard/candidates/${candidate._id}`}
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
    </div>
  );
}
