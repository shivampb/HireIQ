'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

const steps = [
  {
    id: '01',
    title: 'Create Your Assessment',
    subtitle: 'Setup in 30 seconds',
    desc: 'Define the role, set target skills, choose difficulty (Junior → Lead), and set the number of questions. Our system generates a unique shareable link instantly.',
    color: '#4f46e5',
    bg: '#eef2ff',
    icon: (
      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 4v16m8-8H4"/>
      </svg>
    ),
    visual: <CreateVisual />,
  },
  {
    id: '02',
    title: 'Candidate Uploads Resume',
    subtitle: 'PDF, DOC, or DOCX',
    desc: 'The candidate receives your link, fills in their name and email, and uploads their resume. No account needed — zero friction for applicants.',
    color: '#0ea5e9',
    bg: '#e0f2fe',
    icon: (
      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14,2 14,8 20,8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
      </svg>
    ),
    visual: <UploadVisual />,
  },
  {
    id: '03',
    title: 'AI Parses & Profiles',
    subtitle: 'Powered by Gemini AI',
    desc: 'Google Gemini AI reads the resume and builds a rich candidate profile — extracting verified skills, experience level, tech stack, and years of expertise in each domain.',
    color: '#7c3aed',
    bg: '#f5f3ff',
    icon: (
      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3m.08 4h.01"/>
      </svg>
    ),
    visual: <ParseVisual />,
  },
  {
    id: '04',
    title: 'AI Generates Questions',
    subtitle: 'Unique per candidate',
    desc: 'Based on the profile, AI generates tailored technical questions — mixing theory, practical scenarios, and edge cases. Every assessment is unique to that candidate\'s claims.',
    color: '#059669',
    bg: '#ecfdf5',
    icon: (
      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414A1 1 0 0119 9.414V19a2 2 0 01-2 2z"/>
      </svg>
    ),
    visual: <QuestionsVisual />,
  },
  {
    id: '05',
    title: 'Candidate Answers',
    subtitle: 'At their own pace',
    desc: 'The candidate answers each question in a clean, distraction-free interface. Answers are timestamped and saved — candidates can take their time without losing progress.',
    color: '#d97706',
    bg: '#fffbeb',
    icon: (
      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
      </svg>
    ),
    visual: <AnswerVisual />,
  },
  {
    id: '06',
    title: 'AI Evaluates & Detects Fraud',
    subtitle: 'Deep score + suspicion check',
    desc: 'Every answer is scored for accuracy, depth, and consistency with resume claims. Cross-referencing catches vague answers, inconsistencies, and signs of fabricated experience.',
    color: '#dc2626',
    bg: '#fef2f2',
    icon: (
      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      </svg>
    ),
    visual: <EvalVisual />,
  },
  {
    id: '07',
    title: 'Report Ready Instantly',
    subtitle: 'One click, full picture',
    desc: 'A comprehensive report lands in your dashboard — overall score, per-skill breakdown, fraud suspicion flags, behavioral analysis, and a clear Hire / Maybe / No-Hire recommendation.',
    color: '#4f46e5',
    bg: '#eef2ff',
    icon: (
      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293L18 8.586A1 1 0 0118.293 9H19a2 2 0 012 2v9a2 2 0 01-2 2z"/>
      </svg>
    ),
    visual: <ReportVisual />,
  },
];

/* ── Inline mini-graphic components ── */
function CreateVisual() {
  return (
    <div style={{ background: 'white', borderRadius: 16, padding: 24, boxShadow: '0 4px 24px rgba(0,0,0,0.08)', border: '1px solid #e5e7eb' }}>
      <div style={{ fontSize: 12, fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 16 }}>New Assessment</div>
      {[{ label: 'Role', val: 'Senior Frontend Engineer' }, { label: 'Skills', val: 'React, TypeScript, CSS' }, { label: 'Difficulty', val: 'Senior' }, { label: 'Questions', val: '10' }].map(r => (
        <div key={r.label} style={{ display: 'flex', gap: 12, marginBottom: 10, alignItems: 'center' }}>
          <span style={{ fontSize: 12, color: '#9ca3af', width: 70, flexShrink: 0 }}>{r.label}</span>
          <div style={{ flex: 1, background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: 8, padding: '6px 12px', fontSize: 13, color: '#111827', fontWeight: 500 }}>{r.val}</div>
        </div>
      ))}
      <div style={{ marginTop: 16, background: 'linear-gradient(135deg,#4f46e5,#6366f1)', color: 'white', borderRadius: 10, padding: '10px 0', textAlign: 'center', fontSize: 13, fontWeight: 700 }}>Generate Link →</div>
    </div>
  );
}

function UploadVisual() {
  return (
    <div style={{ background: 'white', borderRadius: 16, padding: 24, boxShadow: '0 4px 24px rgba(0,0,0,0.08)', border: '1px solid #e5e7eb' }}>
      <div style={{ border: '2px dashed #bfdbfe', borderRadius: 12, padding: '28px 20px', textAlign: 'center', background: '#eff6ff' }}>
        <div style={{ fontSize: 36, marginBottom: 8 }}>📄</div>
        <div style={{ fontSize: 14, fontWeight: 600, color: '#1e40af', marginBottom: 4 }}>Drop your resume here</div>
        <div style={{ fontSize: 12, color: '#6b7280' }}>PDF, DOC, DOCX — up to 10MB</div>
        <div style={{ marginTop: 14, display: 'inline-block', background: '#2563eb', color: 'white', borderRadius: 8, padding: '8px 20px', fontSize: 12, fontWeight: 600 }}>Browse Files</div>
      </div>
      <div style={{ marginTop: 14, display: 'flex', alignItems: 'center', gap: 10, background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 10, padding: '10px 14px' }}>
        <span style={{ fontSize: 18 }}>✅</span>
        <div>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#15803d' }}>resume_john_doe.pdf</div>
          <div style={{ fontSize: 11, color: '#6b7280' }}>Uploaded · 1.2 MB</div>
        </div>
      </div>
    </div>
  );
}

function ParseVisual() {
  const skills = ['React', 'TypeScript', 'Node.js', 'MongoDB', 'GraphQL', 'Docker'];
  return (
    <div style={{ background: 'white', borderRadius: 16, padding: 24, boxShadow: '0 4px 24px rgba(0,0,0,0.08)', border: '1px solid #e5e7eb' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
        <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg,#7c3aed,#4f46e5)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 14, fontWeight: 800 }}>G</div>
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#111827' }}>Gemini AI Analysis</div>
          <div style={{ fontSize: 11, color: '#6b7280' }}>Completed in 1.8s</div>
        </div>
        <div style={{ marginLeft: 'auto', background: '#f0fdf4', color: '#15803d', fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 99 }}>94% confidence</div>
      </div>
      <div style={{ fontSize: 12, fontWeight: 600, color: '#6b7280', marginBottom: 8 }}>DETECTED SKILLS</div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 14 }}>
        {skills.map(s => <span key={s} style={{ background: '#eef2ff', color: '#4f46e5', borderRadius: 6, padding: '4px 10px', fontSize: 12, fontWeight: 600 }}>{s}</span>)}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        {[{ label: 'Experience', val: '5+ years' }, { label: 'Level', val: 'Senior' }].map(i => (
          <div key={i.label} style={{ background: '#f9fafb', borderRadius: 8, padding: '8px 12px' }}>
            <div style={{ fontSize: 11, color: '#9ca3af' }}>{i.label}</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#111827' }}>{i.val}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function QuestionsVisual() {
  return (
    <div style={{ background: 'white', borderRadius: 16, padding: 24, boxShadow: '0 4px 24px rgba(0,0,0,0.08)', border: '1px solid #e5e7eb' }}>
      <div style={{ fontSize: 12, fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 14 }}>Generated Questions</div>
      {[
        { n: 'Q1', text: 'Explain the React reconciliation algorithm and how it optimizes re-renders.', tag: 'Theory' },
        { n: 'Q2', text: 'You have a TypeScript interface that needs to handle nullable fields. How do you approach this?', tag: 'Practical' },
        { n: 'Q3', text: 'Describe a production incident you resolved. What was the root cause?', tag: 'Experience' },
      ].map(q => (
        <div key={q.n} style={{ borderLeft: '3px solid #4f46e5', paddingLeft: 12, marginBottom: 14 }}>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 4 }}>
            <span style={{ fontSize: 11, fontWeight: 800, color: '#4f46e5' }}>{q.n}</span>
            <span style={{ background: '#eef2ff', color: '#4f46e5', fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 99 }}>{q.tag}</span>
          </div>
          <div style={{ fontSize: 12, color: '#374151', lineHeight: 1.5 }}>{q.text}</div>
        </div>
      ))}
    </div>
  );
}

function AnswerVisual() {
  return (
    <div style={{ background: 'white', borderRadius: 16, padding: 24, boxShadow: '0 4px 24px rgba(0,0,0,0.08)', border: '1px solid #e5e7eb' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <span style={{ fontSize: 12, fontWeight: 600, color: '#6b7280' }}>Question 3 of 10</span>
        <div style={{ background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: 8, padding: '4px 12px', fontSize: 12, fontWeight: 700, color: '#374151' }}>⏱ 12:34</div>
      </div>
      <div style={{ height: 4, background: '#e5e7eb', borderRadius: 99, marginBottom: 16 }}>
        <div style={{ width: '30%', height: '100%', background: 'linear-gradient(90deg,#4f46e5,#6366f1)', borderRadius: 99 }}/>
      </div>
      <div style={{ fontSize: 13, fontWeight: 600, color: '#111827', marginBottom: 12, lineHeight: 1.5 }}>Explain how you would optimize a slow-loading React dashboard that re-renders too frequently.</div>
      <div style={{ background: '#f9fafb', border: '2px solid #4f46e5', borderRadius: 10, padding: '10px 14px', fontSize: 12, color: '#374151', lineHeight: 1.6, minHeight: 80 }}>
        I would start by profiling with React DevTools to identify unnecessary re-renders. Then apply React.memo on pure components, use useCallback for event handlers passed as props...
        <span style={{ display: 'inline-block', width: 2, height: 14, background: '#4f46e5', marginLeft: 2, animation: 'blink 1s step-end infinite', verticalAlign: 'text-bottom' }}/>
      </div>
    </div>
  );
}

function EvalVisual() {
  return (
    <div style={{ background: 'white', borderRadius: 16, padding: 24, boxShadow: '0 4px 24px rgba(0,0,0,0.08)', border: '1px solid #e5e7eb' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
        <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg,#7c3aed,#4f46e5)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 14, fontWeight: 800 }}>G</div>
        <div style={{ fontSize: 13, fontWeight: 700, color: '#111827' }}>AI Evaluation Running...</div>
      </div>
      {[{ label: 'Technical Depth', val: 88, color: '#059669' }, { label: 'Communication', val: 92, color: '#2563eb' }, { label: 'Consistency', val: 73, color: '#d97706' }, { label: 'Fraud Suspicion', val: 12, color: '#dc2626' }].map(i => (
        <div key={i.label} style={{ marginBottom: 10 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, fontWeight: 500, color: '#374151', marginBottom: 4 }}>
            <span>{i.label}</span><span style={{ fontWeight: 700 }}>{i.val}%</span>
          </div>
          <div style={{ height: 6, background: '#f3f4f6', borderRadius: 99 }}>
            <div style={{ width: `${i.val}%`, height: '100%', background: i.color, borderRadius: 99, transition: 'width 1.5s ease' }}/>
          </div>
        </div>
      ))}
      <div style={{ marginTop: 14, background: '#fef2f2', border: '1px solid #fee2e2', borderRadius: 10, padding: '8px 14px', fontSize: 12 }}>
        <span style={{ fontWeight: 700, color: '#dc2626' }}>⚠ Flag: </span>
        <span style={{ color: '#7f1d1d' }}>Answer to Q4 inconsistent with 5yr NodeJS claim</span>
      </div>
    </div>
  );
}

function ReportVisual() {
  return (
    <div style={{ background: 'white', borderRadius: 16, padding: 24, boxShadow: '0 4px 24px rgba(0,0,0,0.08)', border: '1px solid #e5e7eb' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16, paddingBottom: 16, borderBottom: '1px solid #f3f4f6' }}>
        <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'linear-gradient(135deg,#059669,#10b981)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 20, fontWeight: 800 }}>82</div>
        <div>
          <div style={{ fontSize: 14, fontWeight: 700, color: '#111827' }}>John Doe</div>
          <div style={{ fontSize: 12, color: '#6b7280' }}>Senior Frontend Engineer</div>
          <div style={{ marginTop: 4, background: '#f0fdf4', color: '#15803d', fontSize: 11, fontWeight: 700, padding: '2px 10px', borderRadius: 99, display: 'inline-block' }}>✓ HIRE</div>
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        {[{ label: 'Technical', val: '88%', ok: true }, { label: 'Communication', val: '92%', ok: true }, { label: 'Consistency', val: '73%', ok: true }, { label: 'Fraud Risk', val: 'Low', ok: true }].map(i => (
          <div key={i.label} style={{ background: '#f9fafb', borderRadius: 8, padding: '8px 12px' }}>
            <div style={{ fontSize: 11, color: '#9ca3af' }}>{i.label}</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: i.ok ? '#059669' : '#dc2626' }}>{i.val}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Main Page Component ── */
export default function HowItWorksPage() {
  const [activeStep, setActiveStep] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    setMounted(true);
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', onScroll, { passive: true });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const idx = stepRefs.current.indexOf(entry.target as HTMLDivElement);
            if (idx !== -1) setActiveStep(idx);
          }
        });
      },
      { threshold: 0.5, rootMargin: '-20% 0px -20% 0px' }
    );
    stepRefs.current.forEach(ref => ref && observer.observe(ref));
    return () => { window.removeEventListener('scroll', onScroll); observer.disconnect(); };
  }, []);

  // Derive active values safely (fallback 0 before mount)
  const currentStep = mounted ? activeStep : 0;

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", background: '#fafafa', minHeight: '100vh' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        @keyframes blink { 50% { opacity: 0; } }
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-12px)} }
        @keyframes pulse-ring { 0%{transform:scale(0.95);box-shadow:0 0 0 0 rgba(79,70,229,0.4)} 70%{transform:scale(1);box-shadow:0 0 0 14px rgba(79,70,229,0)} 100%{transform:scale(0.95);box-shadow:0 0 0 0 rgba(79,70,229,0)} }
        @keyframes fadeSlideUp { from{opacity:0;transform:translateY(30px)} to{opacity:1;transform:translateY(0)} }
        @keyframes spin-slow { to { transform: rotate(360deg); } }
        @keyframes dash { to { stroke-dashoffset: 0; } }
        .hiw-step-card { transition: all 0.4s cubic-bezier(0.34,1.56,0.64,1); }
        .hiw-step-card.active-card { transform: scale(1.01); }
        .step-dot { transition: all 0.35s; }
        .step-dot.active { background: var(--dot-color) !important; transform: scale(1.3); box-shadow: 0 0 0 6px var(--dot-glow); }
        .visual-appear { animation: fadeSlideUp 0.6s ease forwards; }
        .cta-btn { transition: all 0.25s; }
        .cta-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 28px rgba(79,70,229,0.4) !important; }
        .orb { animation: float 6s ease-in-out infinite; }
      `}</style>

      {/* ── Navbar ── */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        background: mounted && scrolled ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.6)',
        backdropFilter: 'blur(16px) saturate(180%)',
        borderBottom: mounted && scrolled ? '1px solid rgba(0,0,0,0.07)' : 'none',
        boxShadow: mounted && scrolled ? '0 2px 16px rgba(0,0,0,0.06)' : 'none',
        transition: 'all 0.35s ease',
        padding: mounted && scrolled ? '10px 0' : '16px 0',
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
            <div style={{ width: 36, height: 36, background: 'linear-gradient(135deg,#4f46e5,#7c3aed)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M12 2L2 7l10 5 10-5-10-5z" stroke="white" strokeWidth="2" strokeLinejoin="round"/><path d="M2 17l10 5 10-5" stroke="white" strokeWidth="2" strokeLinejoin="round"/><path d="M2 12l10 5 10-5" stroke="white" strokeWidth="2" strokeLinejoin="round"/></svg>
            </div>
            <span style={{ fontWeight: 800, fontSize: 18, color: '#111827' }}>HireIQ</span>
          </Link>
          <div style={{ display: 'flex', gap: 8 }}>
            {['Features', 'Pricing', 'FAQ'].map(item => (
              <Link key={item} href={`/#${item.toLowerCase()}`} style={{ padding: '8px 14px', borderRadius: 8, fontSize: 14, fontWeight: 500, color: '#6b7280', textDecoration: 'none', transition: 'all 0.2s' }}>{item}</Link>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <Link href="/login" style={{ fontSize: 14, fontWeight: 600, color: '#374151', textDecoration: 'none', padding: '8px 16px', borderRadius: 8 }}>Sign In</Link>
            <Link href="/register" className="cta-btn" style={{ background: 'linear-gradient(135deg,#4f46e5,#6366f1)', color: 'white', padding: '10px 20px', borderRadius: 10, fontSize: 14, fontWeight: 700, textDecoration: 'none', boxShadow: '0 4px 14px rgba(79,70,229,0.35)' }}>Get Started Free</Link>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section style={{ paddingTop: 140, paddingBottom: 80, textAlign: 'center', position: 'relative', overflow: 'hidden', background: 'linear-gradient(180deg, #fafbff 0%, white 100%)' }}>
        <div className="orb" style={{ position: 'absolute', top: -60, left: '10%', width: 400, height: 400, background: 'radial-gradient(circle, rgba(99,102,241,0.1) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }}/>
        <div className="orb" style={{ position: 'absolute', top: 40, right: '5%', width: 300, height: 300, background: 'radial-gradient(circle, rgba(139,92,246,0.08) 0%, transparent 70%)', borderRadius: '50%', animationDelay: '-3s', pointerEvents: 'none' }}/>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'white', border: '1px solid #e5e7eb', borderRadius: 99, padding: '6px 16px 6px 6px', marginBottom: 28, boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
            <span style={{ background: 'linear-gradient(135deg,#4f46e5,#7c3aed)', color: 'white', borderRadius: 99, padding: '4px 12px', fontSize: 11, fontWeight: 700, letterSpacing: '0.05em' }}>WALKTHROUGH</span>
            <span style={{ fontSize: 14, color: '#6b7280', fontWeight: 500 }}>AI-Powered Hiring System</span>
          </div>
          <h1 style={{ fontSize: 'clamp(2.4rem,5vw,4rem)', fontWeight: 800, color: '#0f172a', lineHeight: 1.1, marginBottom: 20, letterSpacing: '-0.03em' }}>
            How HireIQ Works
          </h1>
          <p style={{ fontSize: 18, color: '#64748b', maxWidth: 600, margin: '0 auto 36px', lineHeight: 1.65, fontWeight: 400 }}>
            From resume upload to hire decision — 7 intelligent steps powered by Gemini AI. The whole process takes under 40 minutes.
          </p>
          {/* Timeline pill */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0, flexWrap: 'wrap', marginBottom: 8 }}>
            {steps.map((s, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center' }}>
                <button
                  onClick={() => { stepRefs.current[i]?.scrollIntoView({ behavior: 'smooth', block: 'center' }); }}
                  style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', borderRadius: '50%' }}
                >
                  <span style={{ width: 28, height: 28, borderRadius: '50%', background: mounted && currentStep === i ? s.color : '#e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 800, color: mounted && currentStep === i ? 'white' : '#9ca3af', transition: 'all 0.35s', boxShadow: mounted && currentStep === i ? `0 0 0 6px ${s.bg}` : 'none' }}>
                    {i + 1}
                  </span>
                </button>
                {i < steps.length - 1 && <span style={{ display: 'inline-block', width: 28, height: 2, background: mounted && i < currentStep ? '#c7d2fe' : '#e5e7eb', transition: 'background 0.4s' }}/>}
              </div>
            ))}
          </div>
          <div style={{ fontSize: 13, color: '#9ca3af', fontWeight: 500 }} suppressHydrationWarning>
            Step {currentStep + 1} of {steps.length} · <span style={{ color: steps[currentStep].color, fontWeight: 700 }}>{steps[currentStep].title}</span>
          </div>
        </div>
      </section>

      {/* ── Steps ── */}
      <section style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px 120px' }}>
        {steps.map((step, i) => {
          const isEven = i % 2 === 0;
          const isActive = mounted && currentStep === i;
          return (
            <div
              key={step.id}
              ref={el => { stepRefs.current[i] = el; }}
              className={`hiw-step-card ${isActive ? 'active-card' : ''}`}
              style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60, alignItems: 'center', marginBottom: 100, direction: isEven ? 'ltr' : 'rtl' }}
            >
              {/* Text side */}
              <div style={{ direction: 'ltr' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20 }}>
                  <div style={{ width: 52, height: 52, borderRadius: 16, background: step.bg, color: step.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all 0.4s', boxShadow: isActive ? `0 8px 24px ${step.bg}` : 'none' }} suppressHydrationWarning>
                    {step.icon}
                  </div>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: step.color, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 2 }}>Step {step.id}</div>
                    <div style={{ fontSize: 11, color: '#9ca3af', fontWeight: 500 }}>{step.subtitle}</div>
                  </div>
                </div>
                <h2 style={{ fontSize: 'clamp(1.6rem,2.8vw,2.2rem)', fontWeight: 800, color: '#0f172a', lineHeight: 1.2, marginBottom: 16, letterSpacing: '-0.02em' }}>
                  {step.title}
                </h2>
                <p style={{ fontSize: 16, color: '#64748b', lineHeight: 1.7, marginBottom: 24 }}>{step.desc}</p>

                {/* Progress */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ height: 4, flex: 1, background: '#f1f5f9', borderRadius: 99, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${((i + 1) / steps.length) * 100}%`, background: `linear-gradient(90deg, ${step.color}, ${step.color}aa)`, borderRadius: 99, transition: 'width 0.8s ease' }}/>
                  </div>
                  <span style={{ fontSize: 12, fontWeight: 700, color: step.color }}>{Math.round(((i + 1) / steps.length) * 100)}%</span>
                </div>

                {i === steps.length - 1 && (
                  <div style={{ marginTop: 28, display: 'flex', gap: 12 }}>
                    <Link href="/register" className="cta-btn" style={{ background: 'linear-gradient(135deg,#4f46e5,#6366f1)', color: 'white', padding: '14px 28px', borderRadius: 12, fontSize: 15, fontWeight: 700, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 8, boxShadow: '0 4px 16px rgba(79,70,229,0.35)' }}>
                      Start Free Assessment →
                    </Link>
                    <Link href="/" style={{ background: 'white', color: '#374151', padding: '14px 24px', borderRadius: 12, fontSize: 15, fontWeight: 600, textDecoration: 'none', border: '1px solid #e5e7eb', display: 'inline-flex', alignItems: 'center' }}>
                      View Demo
                    </Link>
                  </div>
                )}
              </div>

              {/* Visual side */}
              <div style={{ direction: 'ltr', position: 'relative' }}>
                <div style={{ position: 'absolute', inset: -20, background: `radial-gradient(ellipse at center, ${step.bg} 0%, transparent 70%)`, borderRadius: 32, pointerEvents: 'none' }}/>
                <div style={{ position: 'relative', opacity: isActive ? 1 : 0.6, transform: isActive ? 'scale(1.02)' : 'scale(0.98)', transition: 'all 0.5s cubic-bezier(0.34,1.56,0.64,1)' }}>
                  {step.visual}
                </div>
                {isActive && (
                  <div style={{ position: 'absolute', top: -10, right: -10, width: 20, height: 20, borderRadius: '50%', background: step.color, animation: 'pulse-ring 2s infinite', boxShadow: `0 0 0 0 ${step.color}` }}/>
                )}
              </div>
            </div>
          );
        })}
      </section>

      {/* ── Stats Banner ── */}
      <section style={{ background: 'linear-gradient(135deg,#4f46e5,#6d28d9)', padding: '72px 24px', textAlign: 'center' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: 'rgba(255,255,255,0.6)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 16 }}>By The Numbers</div>
          <h2 style={{ fontSize: 'clamp(1.8rem,3vw,2.5rem)', fontWeight: 800, color: 'white', marginBottom: 48, letterSpacing: '-0.02em' }}>
            A faster, fairer way to hire
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 32 }}>
            {[{ val: '< 40min', label: 'Full assessment\ncycle time' }, { val: '8x', label: 'Faster than\ntraditional screening' }, { val: '98%', label: 'AI evaluation\naccuracy' }, { val: '0', label: 'Resume padders\nthat slip through' }].map(s => (
              <div key={s.val}>
                <div style={{ fontSize: 'clamp(2rem,3.5vw,3rem)', fontWeight: 800, color: 'white', lineHeight: 1, marginBottom: 8 }}>{s.val}</div>
                <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', lineHeight: 1.5, whiteSpace: 'pre-line' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section style={{ padding: '100px 24px', textAlign: 'center', background: 'white' }}>
        <div style={{ maxWidth: 580, margin: '0 auto' }}>
          <h2 style={{ fontSize: 'clamp(2rem,3.5vw,2.8rem)', fontWeight: 800, color: '#0f172a', marginBottom: 16, letterSpacing: '-0.02em' }}>
            Ready to hire smarter?
          </h2>
          <p style={{ fontSize: 17, color: '#64748b', marginBottom: 36, lineHeight: 1.65 }}>
            Create your first assessment in 30 seconds, no credit card required.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/register" className="cta-btn" style={{ background: 'linear-gradient(135deg,#4f46e5,#6366f1)', color: 'white', padding: '16px 32px', borderRadius: 14, fontSize: 16, fontWeight: 700, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 8, boxShadow: '0 4px 20px rgba(79,70,229,0.4)' }}>
              Start Free →
            </Link>
            <Link href="/" style={{ background: 'white', color: '#374151', padding: '16px 28px', borderRadius: 14, fontSize: 16, fontWeight: 600, textDecoration: 'none', border: '1px solid #e5e7eb', display: 'inline-flex', alignItems: 'center' }}>
              ← Back to Home
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer style={{ background: '#0f172a', padding: '64px 24px 32px', color: 'white' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          {/* Top row */}
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 48, marginBottom: 56, paddingBottom: 48, borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
            {/* Brand */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                <div style={{ width: 36, height: 36, background: 'linear-gradient(135deg,#4f46e5,#7c3aed)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M12 2L2 7l10 5 10-5-10-5z" stroke="white" strokeWidth="2" strokeLinejoin="round"/><path d="M2 17l10 5 10-5" stroke="white" strokeWidth="2" strokeLinejoin="round"/><path d="M2 12l10 5 10-5" stroke="white" strokeWidth="2" strokeLinejoin="round"/></svg>
                </div>
                <span style={{ fontWeight: 800, fontSize: 18 }}>HireIQ</span>
              </div>
              <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', lineHeight: 1.7, maxWidth: 280, marginBottom: 24 }}>
                AI-powered technical assessment platform. Identify genuine developer talent at scale with fraud detection built in.
              </p>
              <div style={{ display: 'flex', gap: 12 }}>
                {['𝕏', 'in', 'GH'].map(s => (
                  <a key={s} href="#" style={{ width: 34, height: 34, borderRadius: 8, background: 'rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.6)', fontSize: 13, fontWeight: 700, textDecoration: 'none', transition: 'all 0.2s' }}>{s}</a>
                ))}
              </div>
            </div>

            {/* Product */}
            <div>
              <h4 style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 16 }}>Product</h4>
              {['Features', 'How It Works', 'Pricing', 'Changelog'].map(item => (
                <a key={item} href={item === 'How It Works' ? '/how-it-works' : `/#${item.toLowerCase().replace(/ /g, '-')}`}
                  style={{ display: 'block', fontSize: 14, color: 'rgba(255,255,255,0.55)', marginBottom: 10, textDecoration: 'none', transition: 'color 0.2s' }}>
                  {item}
                </a>
              ))}
            </div>

            {/* Company */}
            <div>
              <h4 style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 16 }}>Company</h4>
              {['About', 'Blog', 'Careers', 'Contact'].map(item => (
                <a key={item} href="#" style={{ display: 'block', fontSize: 14, color: 'rgba(255,255,255,0.55)', marginBottom: 10, textDecoration: 'none' }}>{item}</a>
              ))}
            </div>

            {/* Legal */}
            <div>
              <h4 style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 16 }}>Legal</h4>
              {['Privacy Policy', 'Terms of Service', 'Security', 'Cookie Policy'].map(item => (
                <a key={item} href="#" style={{ display: 'block', fontSize: 14, color: 'rgba(255,255,255,0.55)', marginBottom: 10, textDecoration: 'none' }}>{item}</a>
              ))}
            </div>
          </div>

          {/* Bottom row */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
            <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.3)' }} suppressHydrationWarning>
              © {new Date().getFullYear()} HireIQ. All rights reserved.
            </span>
            <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981', animation: 'pulse-ring 2s infinite' }}/>
              <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.3)' }}>All systems operational</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
