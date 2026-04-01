'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface Assessment {
  _id: string;
  title: string;
  description: string;
  uniqueLink: string;
  skills: string[];
  questionCount: number;
  difficulty: string;
  status: string;
  candidateCount: number;
  createdAt: string;
}

const DIFFICULTY_LABELS: Record<string, string> = {
  junior: '🟢 Junior',
  mid: '🔵 Mid-Level',
  senior: '🟠 Senior',
  lead: '🔴 Lead',
};

export default function AssessmentsPage() {
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [creating, setCreating] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [form, setForm] = useState({
    title: '',
    description: '',
    skills: '',
    questionCount: 10,
    difficulty: 'mid',
    aiPrompt: '',
    faqs: [] as { question: string; answer: string }[],
  });
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to completely delete this assessment? ALL associated candidates and their AI reports will be permanently lost.')) return;
    
    setDeletingId(id);
    try {
      const res = await fetch(`/api/assessments/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setAssessments((prev) => prev.filter((a) => a._id !== id));
      } else {
        alert('Failed to delete assessment');
      }
    } catch (error) {
      console.error(error);
      alert('Error deleting assessment');
    } finally {
      setDeletingId(null);
    }
  };

  const fetchAssessments = async () => {
    const res = await fetch('/api/assessments');
    const data = await res.json();
    setAssessments(data.assessments || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchAssessments();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);

    try {
      const res = await fetch('/api/assessments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          skills: form.skills
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean),
        }),
      });

      if (res.ok) {
        setShowModal(false);
        setForm({ title: '', description: '', skills: '', questionCount: 10, difficulty: 'mid', aiPrompt: '', faqs: [] });
        fetchAssessments();
      }
    } catch (err) {
      console.error('Create error:', err);
    } finally {
      setCreating(false);
    }
  };

  const copyLink = (link: string, id: string) => {
    const fullUrl = `${window.location.origin}/assess/${link}`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const toggleStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'paused' : 'active';
    await fetch(`/api/assessments/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
    });
    fetchAssessments();
  };

  if (loading) {
    return (
      <div className="loading-page">
        <div className="spinner"></div>
        <p className="loading-text">Loading assessments...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 className="page-title">Assessments</h1>
          <p className="page-subtitle">Create and manage assessment links for candidates.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          + New Assessment
        </button>
      </div>

      {assessments.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <div className="empty-icon">📝</div>
            <h4 className="empty-title">No assessments yet</h4>
            <p className="empty-description">
              Create your first assessment to generate a unique link that candidates
              can use to start their evaluation.
            </p>
            <button className="btn btn-primary" onClick={() => setShowModal(true)}>
              + Create Assessment
            </button>
          </div>
        </div>
      ) : (
        <div className="assessment-grid">
          {assessments.map((a) => (
            <div key={a._id} className="assessment-card">
              <div className="assessment-card-header">
                <div style={{ flex: 1, paddingRight: 'var(--space-3)' }}>
                  <h3 className="assessment-title">{a.title}</h3>
                  {a.description && (
                    <div className="description-clamp text-sm text-gray-500">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {a.description}
                      </ReactMarkdown>
                    </div>
                  )}
                </div>
                <span
                  className={`badge ${a.status === 'active' ? 'badge-green' : 'badge-yellow'}`}
                  style={{ flexShrink: 0 }}
                >
                  {a.status}
                </span>
              </div>

              <div className="assessment-meta">
                <span>📋 {a.questionCount} questions</span>
                <span>{DIFFICULTY_LABELS[a.difficulty]}</span>
                <span>👥 {a.candidateCount} candidates</span>
              </div>

              {a.skills.length > 0 && (
                <div className="assessment-skills">
                  {a.skills.slice(0, 5).map((skill) => (
                    <span key={skill} className="skill-tag">{skill}</span>
                  ))}
                  {a.skills.length > 5 && (
                    <span className="skill-tag" style={{ background: 'var(--gray-100)', color: 'var(--gray-600)' }}>
                      +{a.skills.length - 5} more
                    </span>
                  )}
                </div>
              )}

              <div className="assessment-link-box">
                <span className="assessment-link-text">
                  {window.location.origin}/assess/{a.uniqueLink}
                </span>
                <button
                  className="copy-btn"
                  onClick={() => copyLink(a.uniqueLink, a._id)}
                >
                  {copiedId === a._id ? '✓' : '📋'}
                </button>
              </div>

              <div style={{ display: 'flex', gap: 'var(--space-2)', marginTop: 'var(--space-4)' }}>
                <Link
                  href={`/dashboard/assessments/${a._id}`}
                  className="btn btn-ghost btn-sm"
                  style={{ flex: 1 }}
                >
                  View Details
                </Link>
                <button
                  className="btn btn-ghost btn-sm"
                  onClick={() => toggleStatus(a._id, a.status)}
                >
                  {a.status === 'active' ? '⏸ Pause' : '▶ Resume'}
                </button>
                <button
                  className="btn btn-ghost btn-sm"
                  onClick={() => handleDelete(a._id)}
                  style={{ color: '#dc2626', padding: 'var(--space-1) var(--space-2)' }}
                  disabled={deletingId === a._id}
                  title="Delete Assessment"
                >
                  {deletingId === a._id ? '...' : '🗑️'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Assessment Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Create New Assessment</h2>
              <p className="modal-subtitle">
                Set up an assessment and get a unique link to share with candidates.
              </p>
            </div>

            <form onSubmit={handleCreate}>
              <div className="form-group">
                <label className="form-label" htmlFor="title">Assessment Title *</label>
                <input
                  id="title"
                  type="text"
                  className="form-input"
                  placeholder="e.g., Senior React Developer Assessment"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="description">Description</label>
                <textarea
                  id="description"
                  className="form-textarea"
                  placeholder="Brief description of this assessment role..."
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  style={{ minHeight: '80px' }}
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="skills">Target Skills</label>
                <input
                  id="skills"
                  type="text"
                  className="form-input"
                  placeholder="React, Node.js, TypeScript (comma separated)"
                  value={form.skills}
                  onChange={(e) => setForm({ ...form, skills: e.target.value })}
                />
                <p className="form-hint">
                  Leave empty to auto-detect from candidate&apos;s resume
                </p>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="aiPrompt">Assessment Admin Instructions (For AI)</label>
                <textarea
                  id="aiPrompt"
                  className="form-textarea"
                  placeholder="e.g., Make sure to test candidate on React Hooks deeply. Do not ask about CSS. Ensure to cover state management concepts."
                  value={form.aiPrompt}
                  onChange={(e) => setForm({ ...form, aiPrompt: e.target.value })}
                  style={{ minHeight: '80px' }}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Manual Candidate FAQs (Optional)</label>
                {form.faqs.map((faq, index) => (
                  <div key={index} style={{ display: 'flex', gap: 'var(--space-2)', marginBottom: 'var(--space-2)' }}>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g., How much time do I have?"
                      value={faq.question}
                      onChange={(e) => {
                        const newFaqs = [...form.faqs];
                        newFaqs[index].question = e.target.value;
                        setForm({ ...form, faqs: newFaqs });
                      }}
                      style={{ flex: 1 }}
                    />
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g., About 30-45 minutes typically."
                      value={faq.answer}
                      onChange={(e) => {
                        const newFaqs = [...form.faqs];
                        newFaqs[index].answer = e.target.value;
                        setForm({ ...form, faqs: newFaqs });
                      }}
                      style={{ flex: 1 }}
                    />
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => {
                        const newFaqs = form.faqs.filter((_, i) => i !== index);
                        setForm({ ...form, faqs: newFaqs });
                      }}
                      style={{ padding: '0 var(--space-3)' }}
                    >
                      X
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => setForm({ ...form, faqs: [...form.faqs, { question: '', answer: '' }] })}
                  style={{ marginTop: 'var(--space-2)' }}
                >
                  + Add FAQ
                </button>
              </div>

              <div style={{ display: 'flex', gap: 'var(--space-4)' }}>
                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label" htmlFor="questionCount">Questions</label>
                  <select
                    id="questionCount"
                    className="form-select"
                    value={form.questionCount}
                    onChange={(e) =>
                      setForm({ ...form, questionCount: parseInt(e.target.value) })
                    }
                  >
                    {[5, 8, 10, 15, 20, 25, 30].map((n) => (
                      <option key={n} value={n}>{n} questions</option>
                    ))}
                  </select>
                </div>

                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label" htmlFor="difficulty">Difficulty</label>
                  <select
                    id="difficulty"
                    className="form-select"
                    value={form.difficulty}
                    onChange={(e) => setForm({ ...form, difficulty: e.target.value })}
                  >
                    <option value="junior">Junior</option>
                    <option value="mid">Mid-Level</option>
                    <option value="senior">Senior</option>
                    <option value="lead">Lead</option>
                  </select>
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={creating}
                >
                  {creating ? 'Creating...' : 'Create Assessment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
