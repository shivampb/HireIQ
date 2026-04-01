'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AssessmentWarningPage() {
  const params = useParams();
  const router = useRouter();
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [candidate, setCandidate] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`/api/assess/${params.link}`);
        if (res.ok) {
          const data = await res.json();
          setCandidate(data.candidate);
        }
      } catch (err) {
        console.error('Error fetching candidate:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [params.link]);

  const handleProceed = () => {
    if (agreed) {
      router.push(`/assess/${params.link}`);
    }
  };

  if (loading) {
    return (
      <div className="loading-page">
        <div className="spinner"></div>
        <p className="loading-text">Loading assessment...</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: 'var(--space-6)' }}>
      <div className="page-header">
        <Link href="/" className="text-sm text-gray-500" style={{ display: 'block', marginBottom: 'var(--space-4)' }}>
          ← Back Home
        </Link>
      </div>

      <div className="card" style={{ padding: 'var(--space-8)' }}>
        <div style={{ textAlign: 'center', marginBottom: 'var(--space-8)' }}>
          <div style={{ fontSize: '3rem', marginBottom: 'var(--space-4)' }}>⚠️</div>
          <h1 className="card-title">Assessment Integrity & Conduct Policy</h1>
          <p className="text-sm text-gray-600" style={{ marginTop: 'var(--space-2)' }}>
            Please read and agree to the terms before proceeding with the assessment.
          </p>
        </div>

        {/* Warning Content */}
        <div style={{ marginBottom: 'var(--space-6)', lineHeight: 1.8, color: 'var(--gray-700)' }}>
          <h3 className="font-semibold text-gray-900" style={{ marginBottom: 'var(--space-3)' }}>
            🚫 Prohibited Cheating Methods:
          </h3>
          <ul style={{ marginLeft: 'var(--space-4)', marginBottom: 'var(--space-6)' }}>
            <li style={{ marginBottom: 'var(--space-2)' }}>
              <strong>Unauthorized External Assistance:</strong> Using another person to answer questions, receiving help via chat/messaging apps, or having someone guide you through answers.
            </li>
            <li style={{ marginBottom: 'var(--space-2)' }}>
              <strong>Internet/Resource Misuse:</strong> Copying answers from Google, Stack Overflow, ChatGPT, or other AI tools. Searching for identical questions online.
            </li>
            <li style={{ marginBottom: 'var(--space-2)' }}>
              <strong>Impersonation:</strong> Having someone else take the assessment in your place or using multiple accounts.
            </li>
            <li style={{ marginBottom: 'var(--space-2)' }}>
              <strong>Technical Manipulation:</strong> Screen sharing, recording and replaying answers, browser extensions to modify content, or API interception.
            </li>
            <li style={{ marginBottom: 'var(--space-2)' }}>
              <strong>Resume Misrepresentation:</strong> Claiming skills you do not have or experience you never gained.
            </li>
            <li style={{ marginBottom: 'var(--space-2)' }}>
              <strong>Answer Template Reuse:</strong> Using pre-written responses inconsistent with your actual knowledge level.
            </li>
          </ul>

          <h3 className="font-semibold text-gray-900" style={{ marginBottom: 'var(--space-3)' }}>
            🔍 Our Detection Methods:
          </h3>
          <ul style={{ marginLeft: 'var(--space-4)', marginBottom: 'var(--space-6)' }}>
            <li style={{ marginBottom: 'var(--space-2)' }}>
              <strong>Consistency Analysis:</strong> AI detects inconsistencies between your answers, resume skills, and experience level.
            </li>
            <li style={{ marginBottom: 'var(--space-2)' }}>
              <strong>Generic Response Detection:</strong> Identifies textbook or AI-generated answers that don't match your unique voice or knowledge.
            </li>
            <li style={{ marginBottom: 'var(--space-2)' }}>
              <strong>Confidence Scoring:</strong> Analyzes whether you truly understand concepts or are just reciting memorized text.
            </li>
            <li style={{ marginBottom: 'var(--space-2)' }}>
              <strong>Plagiarism Checks:</strong> Compares answers with common online resources and AI-generated content patterns.
            </li>
            <li style={{ marginBottom: 'var(--space-2)' }}>
              <strong>Behavioral Analysis:</strong> Detects unusual patterns like sudden skill jumps, unnatural response times, or contradictory answers.
            </li>
          </ul>

          <h3 className="font-semibold text-gray-900" style={{ marginBottom: 'var(--space-3)' }}>
            ⛔ Consequences of Cheating:
          </h3>
          <ul style={{ marginLeft: 'var(--space-4)', marginBottom: 'var(--space-6)' }}>
            <li style={{ marginBottom: 'var(--space-2)' }}>
              <strong>Immediate Disqualification:</strong> Your application will be rejected immediately upon detection of cheating.
            </li>
            <li style={{ marginBottom: 'var(--space-2)' }}>
              <strong>Permanent Ban:</strong> You will be blacklisted from all assessments and job opportunities at our company.
            </li>
            <li style={{ marginBottom: 'var(--space-2)' }}>
              <strong>Industry Reporting:</strong> Serious violations may be reported to other companies and industry networks.
            </li>
            <li style={{ marginBottom: 'var(--space-2)' }}>
              <strong>Legal Action:</strong> In cases of identity fraud or IP theft, we reserve the right to pursue legal remedies.
            </li>
            <li style={{ marginBottom: 'var(--space-2)' }}>
              <strong>Reference Damage:</strong> We may inform previous employers about the integrity violation.
            </li>
          </ul>

          <div style={{
            padding: 'var(--space-4)',
            backgroundColor: 'var(--blue-50)',
            border: '1px solid var(--blue-200)',
            borderRadius: 'var(--radius-md)',
            marginBottom: 'var(--space-6)'
          }}>
            <p className="text-sm" style={{ color: 'var(--blue-900)', margin: 0 }}>
              <strong>✅ What You CAN Do:</strong> Use your own knowledge, think critically about problems, take reasonable time to formulate answers, and ask clarifying questions if needed.
            </p>
          </div>
        </div>

        {/* Agreement Checkbox */}
        <div style={{
          padding: 'var(--space-4)',
          backgroundColor: 'var(--gray-50)',
          borderRadius: 'var(--radius-md)',
          marginBottom: 'var(--space-6)',
          border: '1px solid var(--gray-200)'
        }}>
          <label style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-3)', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              style={{
                marginTop: '4px',
                width: '18px',
                height: '18px',
                cursor: 'pointer',
                flexShrink: 0
              }}
            />
            <span className="text-sm" style={{ color: 'var(--gray-700)', lineHeight: 1.6 }}>
              I have read and understood the assessment integrity policy. I commit to taking this assessment honestly and to the best of my ability. I understand that any form of cheating will result in immediate disqualification and potential legal consequences. I accept full responsibility for my actions.
            </span>
          </label>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: 'var(--space-4)', justifyContent: 'center' }}>
          <Link href="/" className="btn btn-secondary">
            ← Decline & Exit
          </Link>
          <button
            className="btn btn-primary"
            onClick={handleProceed}
            disabled={!agreed}
            style={{ opacity: agreed ? 1 : 0.5, cursor: agreed ? 'pointer' : 'not-allowed' }}
          >
            I Agree & Start Assessment →
          </button>
        </div>

        {/* Footer */}
        <p className="text-xs text-gray-500" style={{ textAlign: 'center', marginTop: 'var(--space-6)' }}>
          By proceeding, you agree to all terms outlined above. This assessment is monitored for integrity violations.
        </p>
      </div>
    </div>
  );
}
