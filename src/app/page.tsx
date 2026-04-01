'use client';

import Link from 'next/link';
import { useEffect, useState, useRef } from 'react';

/* ─── Animated Counter Hook ─── */
function useCountUp(target: number, duration = 2000, startOnView = true) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useEffect(() => {
    if (!startOnView) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          let start = 0;
          const step = target / (duration / 16);
          const timer = setInterval(() => {
            start += step;
            if (start >= target) {
              setCount(target);
              clearInterval(timer);
            } else {
              setCount(Math.floor(start));
            }
          }, 16);
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, duration, startOnView]);

  return { count, ref };
}

/* ─── Scroll-reveal wrapper ─── */
function Reveal({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.15 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(32px)',
        transition: `opacity 0.7s cubic-bezier(.22,1,.36,1) ${delay}ms, transform 0.7s cubic-bezier(.22,1,.36,1) ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

/* ─── Type-writer text ─── */
function TypeWriter({ words }: { words: string[] }) {
  const [idx, setIdx] = useState(0);
  const [text, setText] = useState('');
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const word = words[idx];
    const timeout = setTimeout(
      () => {
        if (!deleting) {
          setText(word.substring(0, text.length + 1));
          if (text.length + 1 === word.length) setTimeout(() => setDeleting(true), 1800);
        } else {
          setText(word.substring(0, text.length - 1));
          if (text.length === 0) {
            setDeleting(false);
            setIdx((idx + 1) % words.length);
          }
        }
      },
      deleting ? 40 : 80
    );
    return () => clearTimeout(timeout);
  }, [text, deleting, idx, words]);

  return (
    <span className="gradient-text">
      {text}
      <span className="typewriter-cursor">|</span>
    </span>
  );
}

export default function HomePage() {
  const stat1 = useCountUp(2400);
  const stat2 = useCountUp(98);
  const stat3 = useCountUp(150);
  const stat4 = useCountUp(35);

  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const FAQS = [
    {
      q: 'How does the AI generate questions?',
      a: 'Our AI (powered by Google Gemini) analyzes the candidate\'s resume to extract skills, experience level, and technical background. It then generates tailored questions that specifically test the claimed competencies — mixing theoretical, practical, and scenario-based questions.',
    },
    {
      q: 'What file formats are supported for resumes?',
      a: 'We support PDF, DOC, and DOCX formats. Our parser extracts text from the document and sends it through AI analysis for skill detection.',
    },
    {
      q: 'How does fraud detection work?',
      a: 'The system cross-references answers against resume claims, checks for vague or generic responses, detects inconsistencies between answers, and evaluates confidence levels. A suspicion score (0-100) is generated with specific flags explaining concerns.',
    },
    {
      q: 'Is candidate data secure and isolated?',
      a: 'Absolutely. We use a multi-tenant architecture where every database query is scoped by company ID. Your candidates, assessments, and reports are completely isolated — no other company can access your data.',
    },
    {
      q: 'Can I customize the number and difficulty of questions?',
      a: 'Yes! When creating an assessment, you can set the number of questions (5-30), difficulty level (Junior to Lead), and even specify target skills to focus the questions on.',
    },
  ];

  return (
    <div className="landing-page">
      {/* ═══════════ NAVBAR ═══════════ */}
      <nav className={`landing-nav ${scrolled ? 'landing-nav-scrolled' : ''}`}>
        <div className="landing-nav-inner">
          <Link href="/" className="landing-nav-brand">
            <div className="landing-nav-logo">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L2 7l10 5 10-5-10-5z" stroke="white" strokeWidth="2" strokeLinejoin="round"/>
                <path d="M2 17l10 5 10-5" stroke="white" strokeWidth="2" strokeLinejoin="round"/>
                <path d="M2 12l10 5 10-5" stroke="white" strokeWidth="2" strokeLinejoin="round"/>
              </svg>
            </div>
            <span>HireIQ</span>
          </Link>

          <div className="landing-nav-links">
            <a href="#features">Features</a>
            <a href="#how-it-works">How It Works</a>
            <a href="#pricing">Pricing</a>
            <a href="#faq">FAQ</a>
          </div>

          <div className="landing-nav-actions">
            <Link href="/login" className="landing-nav-signin">Sign In</Link>
            <Link href="/register" className="btn btn-primary">
              Get Started Free
            </Link>
          </div>
        </div>
      </nav>

      {/* ═══════════ HERO ═══════════ */}
      <section className="hero">
        {/* Floating background orbs */}
        <div className="hero-orb hero-orb-1"></div>
        <div className="hero-orb hero-orb-2"></div>
        <div className="hero-orb hero-orb-3"></div>
        <div className="hero-grid-bg"></div>

        <div className="container hero-content">
          <Reveal>
            <div className="hero-badge-wrapper">
              <span className="hero-badge-new">
                <span className="hero-badge-dot"></span>
                New
              </span>
              <span className="hero-badge-text">AI-Powered Technical Assessments</span>
              <span className="hero-badge-arrow">→</span>
            </div>
          </Reveal>

          <Reveal delay={100}>
            <h1 className="hero-title hero-title-oneline">
              Hire smarter with
            </h1>
            <div className="hero-typewriter-line">
              <TypeWriter words={['AI Precision', 'Fraud Detection', 'Smart Questions', 'Deep Insights']} />
            </div>
            <p className="hero-title-sub-line">Identify genuine developer talent at scale</p>
          </Reveal>

          <Reveal delay={200}>
            <p className="hero-subtitle">
              Upload a resume. Get AI-generated questions tailored to the candidate&apos;s skills.
              Receive a comprehensive evaluation with fraud detection — in minutes, not hours.
            </p>
          </Reveal>

          <Reveal delay={300}>
            <div className="hero-cta-row">
              <Link href="/register" className="btn btn-primary btn-hero">
                Start Assessing for Free
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M4 10h12m0 0l-4-4m4 4l-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </Link>
              <Link href="#how-it-works" className="btn btn-hero-secondary">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="9" stroke="currentColor" strokeWidth="1.5"/><path d="M8 7l5 3-5 3V7z" fill="currentColor"/></svg>
                See How It Works
              </Link>
            </div>
          </Reveal>

          <Reveal delay={350}>
            <div className="hero-trust-row">
              <div className="hero-trust-avatars">
                {['#6366f1','#3b82f6','#10b981','#f59e0b','#ef4444'].map((c, i) => (
                  <div key={i} className="hero-trust-avatar" style={{ background: c, zIndex: 5 - i }}>
                    {String.fromCharCode(65 + i)}
                  </div>
                ))}
              </div>
              <div className="hero-trust-text">
                <div className="hero-trust-stars">★★★★★</div>
                <span>Trusted by <strong>150+ companies</strong> worldwide</span>
              </div>
            </div>
          </Reveal>

          {/* Dashboard Preview Mockup */}
          <Reveal delay={450}>
            <div className="hero-mockup-wrapper">
              <div className="hero-mockup-glow"></div>
              <div className="hero-mockup">
                {/* Mock Dashboard Header */}
                <div className="mockup-topbar">
                  <div className="mockup-dots">
                    <span style={{background:'#ff5f57'}}></span>
                    <span style={{background:'#ffbd2e'}}></span>
                    <span style={{background:'#28c840'}}></span>
                  </div>
                  <div className="mockup-url">hireiq.app/dashboard</div>
                  <div></div>
                </div>
                <div className="mockup-body">
                  {/* Sidebar */}
                  <div className="mockup-sidebar">
                    <div className="mockup-sidebar-brand">
                      <div className="mockup-sidebar-icon">H</div>
                      <span>HireIQ</span>
                    </div>
                    <div className="mockup-sidebar-item active">📊 Overview</div>
                    <div className="mockup-sidebar-item">📝 Assessments</div>
                    <div className="mockup-sidebar-item">👥 Candidates</div>
                    <div className="mockup-sidebar-item">⚙️ Settings</div>
                  </div>
                  {/* Content */}
                  <div className="mockup-content">
                    <div className="mockup-content-header">
                      <span className="mockup-greeting">Good morning, Alex 👋</span>
                    </div>
                    <div className="mockup-stats-row">
                      <div className="mockup-stat-card">
                        <div className="mockup-stat-num" style={{color:'var(--primary-600)'}}>24</div>
                        <div className="mockup-stat-label">Active Assessments</div>
                      </div>
                      <div className="mockup-stat-card">
                        <div className="mockup-stat-num" style={{color:'var(--success-600)'}}>189</div>
                        <div className="mockup-stat-label">Candidates Evaluated</div>
                      </div>
                      <div className="mockup-stat-card">
                        <div className="mockup-stat-num" style={{color:'var(--violet-600)'}}>87%</div>
                        <div className="mockup-stat-label">Avg. Score</div>
                      </div>
                    </div>
                    {/* Mini candidate rows */}
                    <div className="mockup-table-header">
                      <span>Candidate</span><span>Score</span><span>Status</span>
                    </div>
                    {[
                      { name: 'Priya Sharma', score: 92, status: 'Strong Hire', color: '#059669' },
                      { name: 'James Wilson', score: 78, status: 'Hire', color: '#2563eb' },
                      { name: 'Anonymous_dev', score: 34, status: 'Suspicious', color: '#dc2626' },
                    ].map((c, i) => (
                      <div key={i} className="mockup-table-row" style={{ animationDelay: `${1 + i * 0.3}s` }}>
                        <span className="mockup-candidate-name">{c.name}</span>
                        <span className="mockup-score-bar">
                          <span className="mockup-score-fill" style={{ width: `${c.score}%`, background: c.color }}></span>
                          <span className="mockup-score-text">{c.score}%</span>
                        </span>
                        <span className="mockup-status" style={{ color: c.color, background: `${c.color}15` }}>{c.status}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══════════ LOGOS / SOCIAL PROOF ═══════════ */}
      <section className="logos-section">
        <div className="container">
          <p className="logos-label">Trusted by engineering teams at innovative companies</p>
          <div className="logos-track">
            {['TechCorp', 'InnovateLabs', 'DataPrime', 'CloudNova', 'CodeForge', 'PixelStack', 'NeuralEdge', 'ByteWorks'].map((name) => (
              <div key={name} className="logo-item">{name}</div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ STATS BAR ═══════════ */}
      <section className="stats-bar">
        <div className="container">
          <div className="stats-bar-grid">
            <div className="stats-bar-item" ref={stat1.ref}>
              <div className="stats-bar-value">{stat1.count.toLocaleString()}+</div>
              <div className="stats-bar-label">Candidates Assessed</div>
            </div>
            <div className="stats-bar-divider"></div>
            <div className="stats-bar-item" ref={stat2.ref}>
              <div className="stats-bar-value">{stat2.count}%</div>
              <div className="stats-bar-label">Accuracy Rate</div>
            </div>
            <div className="stats-bar-divider"></div>
            <div className="stats-bar-item" ref={stat3.ref}>
              <div className="stats-bar-value">{stat3.count}+</div>
              <div className="stats-bar-label">Companies Trust Us</div>
            </div>
            <div className="stats-bar-divider"></div>
            <div className="stats-bar-item" ref={stat4.ref}>
              <div className="stats-bar-value">{stat4.count}min</div>
              <div className="stats-bar-label">Avg. Assessment Time</div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ FEATURES ═══════════ */}
      <section className="features-section" id="features">
        <div className="container">
          <Reveal>
            <div className="section-eyebrow">Powerful Features</div>
            <h2 className="section-heading">Everything you need to hire <span className="gradient-text">smarter</span></h2>
            <p className="section-desc">From resume analysis to fraud detection, HireIQ handles the entire assessment pipeline.</p>
          </Reveal>

          <div className="feature-bento-grid">
            <Reveal delay={100} className="feature-bento-card feature-bento-large">
              <div className="feature-bento-icon" style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>
              <h3 className="feature-bento-title">AI Resume Parsing</h3>
              <p className="feature-bento-desc">
                Upload any resume — PDF, DOC, or DOCX — and our Gemini AI instantly extracts skills,
                experience level, key competencies, and creates a comprehensive candidate profile.
              </p>
              <div className="feature-bento-visual">
                <div className="feature-code-block">
                  <div className="feature-code-line"><span className="code-key">skills:</span> [&quot;React&quot;, &quot;TypeScript&quot;, &quot;Node.js&quot;, &quot;MongoDB&quot;]</div>
                  <div className="feature-code-line"><span className="code-key">level:</span> &quot;Senior&quot;</div>
                  <div className="feature-code-line"><span className="code-key">experience:</span> &quot;5+ years full-stack development&quot;</div>
                  <div className="feature-code-line"><span className="code-key">confidence:</span> <span className="code-val">0.94</span></div>
                </div>
              </div>
            </Reveal>

            <Reveal delay={200} className="feature-bento-card">
              <div className="feature-bento-icon" style={{ background: 'linear-gradient(135deg, #3b82f6, #2563eb)' }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><path d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>
              <h3 className="feature-bento-title">Dynamic Questions</h3>
              <p className="feature-bento-desc">
                Every assessment is uniquely tailored — from theoretical concepts to real-world scenarios.
              </p>
            </Reveal>

            <Reveal delay={300} className="feature-bento-card">
              <div className="feature-bento-icon" style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>
              <h3 className="feature-bento-title">Smart Evaluation</h3>
              <p className="feature-bento-desc">
                Each answer is scored for accuracy, depth, and consistency with resume claims.
              </p>
            </Reveal>

            <Reveal delay={200} className="feature-bento-card">
              <div className="feature-bento-icon" style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>
              <h3 className="feature-bento-title">Fraud Detection</h3>
              <p className="feature-bento-desc">
                Detects inconsistencies, vague answers, and mismatches to flag suspicious candidates.
              </p>
            </Reveal>

            <Reveal delay={300} className="feature-bento-card feature-bento-large">
              <div className="feature-bento-icon" style={{ background: 'linear-gradient(135deg, #ec4899, #be185d)' }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>
              <h3 className="feature-bento-title">Comprehensive Reports</h3>
              <p className="feature-bento-desc">
                Detailed reports with overall scores, skill breakdowns, behavioral analysis, and clear
                hire/no-hire recommendations — everything a recruiter needs in one view.
              </p>
              <div className="feature-bento-visual">
                <div className="feature-report-preview">
                  {[
                    { label: 'Technical Depth', value: 88, color: '#10b981' },
                    { label: 'Communication', value: 92, color: '#3b82f6' },
                    { label: 'Problem Solving', value: 76, color: '#8b5cf6' },
                    { label: 'Consistency', value: 95, color: '#059669' },
                  ].map((item) => (
                    <div key={item.label} className="feature-report-row">
                      <span className="feature-report-label">{item.label}</span>
                      <div className="feature-report-bar">
                        <div className="feature-report-fill" style={{ width: `${item.value}%`, background: item.color }}></div>
                      </div>
                      <span className="feature-report-val">{item.value}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>

            <Reveal delay={400} className="feature-bento-card">
              <div className="feature-bento-icon" style={{ background: 'linear-gradient(135deg, #0ea5e9, #0284c7)' }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>
              <h3 className="feature-bento-title">Enterprise Security</h3>
              <p className="feature-bento-desc">
                Multi-tenant isolation. Your data, candidates, and reports — completely separate.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ═══════════ HOW IT WORKS ═══════════ */}
      <section className="how-section" id="how-it-works">
        <div className="container">
          <Reveal>
            <div className="section-eyebrow">How It Works</div>
            <h2 className="section-heading">Get started in <span className="gradient-text">three steps</span></h2>
            <p className="section-desc">From setup to insights in minutes, not days.</p>
          </Reveal>

          <div className="how-steps">
            <Reveal delay={100} className="how-step">
              <div className="how-step-num">01</div>
              <div className="how-step-line"></div>
              <div className="how-step-content">
                <div className="how-step-icon" style={{ background: 'var(--primary-50)', color: 'var(--primary-600)' }}>
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none"><path d="M12 4v16m8-8H4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
                </div>
                <h3>Create an Assessment</h3>
                <p>Define the role, set target skills, choose difficulty level, and get a unique shareable link — ready in 30 seconds.</p>
              </div>
            </Reveal>

            <Reveal delay={250} className="how-step">
              <div className="how-step-num">02</div>
              <div className="how-step-line"></div>
              <div className="how-step-content">
                <div className="how-step-icon" style={{ background: 'var(--violet-50)', color: 'var(--violet-600)' }}>
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none"><path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zm-4 7a7 7 0 00-7 7h14a7 7 0 00-7-7z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
                <h3>Candidates Take the Test</h3>
                <p>They upload their resume, our AI parses it and generates personalized technical questions. Candidates answer at their own pace.</p>
              </div>
            </Reveal>

            <Reveal delay={400} className="how-step">
              <div className="how-step-num">03</div>
              <div className="how-step-line last"></div>
              <div className="how-step-content">
                <div className="how-step-icon" style={{ background: 'var(--success-50)', color: 'var(--success-600)' }}>
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none"><path d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
                <h3>Review AI Reports</h3>
                <p>Get comprehensive evaluation reports with scores, skill breakdowns, behavioral analysis, and fraud detection flags — one click away.</p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ═══════════ TESTIMONIALS ═══════════ */}
      <section className="testimonials-section">
        <div className="container">
          <Reveal>
            <div className="section-eyebrow">What People Say</div>
            <h2 className="section-heading">Loved by <span className="gradient-text">hiring teams</span></h2>
          </Reveal>

          <div className="testimonials-grid">
            {[
              {
                quote: 'HireIQ saved us 40+ hours per week on technical screening. The fraud detection alone has been invaluable — we caught 3 candidates with fabricated resumes last month.',
                name: 'Sarah Chen',
                role: 'VP of Engineering, TechCorp',
                avatar: '#6366f1',
              },
              {
                quote: 'The AI-generated questions are surprisingly good — better than what most of our interviewers come up with. Candidates have told us the experience feels professional and fair.',
                name: 'Michael Rodriguez',
                role: 'Head of Talent, InnovateLabs',
                avatar: '#3b82f6',
              },
              {
                quote: 'We went from spending 2 weeks to screen candidates to getting results in under an hour. The detailed skill breakdowns help us match people to the right teams.',
                name: 'Ananya Patel',
                role: 'CTO, DataPrime',
                avatar: '#10b981',
              },
            ].map((t, i) => (
              <Reveal key={i} delay={i * 150} className="testimonial-card">
                <div className="testimonial-stars">★★★★★</div>
                <p className="testimonial-quote">&ldquo;{t.quote}&rdquo;</p>
                <div className="testimonial-author">
                  <div className="testimonial-avatar" style={{ background: t.avatar }}>
                    {t.name[0]}
                  </div>
                  <div>
                    <div className="testimonial-name">{t.name}</div>
                    <div className="testimonial-role">{t.role}</div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ PRICING ═══════════ */}
      <section className="pricing-section" id="pricing">
        <div className="container">
          <Reveal>
            <div className="section-eyebrow">Simple Pricing</div>
            <h2 className="section-heading">Plans that <span className="gradient-text">scale with you</span></h2>
            <p className="section-desc">Start free, upgrade when you need more power.</p>
          </Reveal>

          <div className="pricing-grid">
            <Reveal delay={100} className="pricing-card">
              <div className="pricing-card-header">
                <h3 className="pricing-plan-name">Starter</h3>
                <p className="pricing-plan-desc">Perfect for small teams getting started</p>
              </div>
              <div className="pricing-price">
                <span className="pricing-amount">$0</span>
                <span className="pricing-period">/month</span>
              </div>
              <ul className="pricing-features">
                <li><span className="pricing-check">✓</span> 3 active assessments</li>
                <li><span className="pricing-check">✓</span> 10 candidates / month</li>
                <li><span className="pricing-check">✓</span> AI question generation</li>
                <li><span className="pricing-check">✓</span> Basic reports</li>
                <li><span className="pricing-check">✓</span> Email support</li>
              </ul>
              <Link href="/register" className="btn btn-secondary btn-lg w-full" style={{ justifyContent: 'center' }}>
                Get Started Free
              </Link>
            </Reveal>

            <Reveal delay={200} className="pricing-card pricing-card-popular">
              <div className="pricing-popular-badge">Most Popular</div>
              <div className="pricing-card-header">
                <h3 className="pricing-plan-name">Professional</h3>
                <p className="pricing-plan-desc">For growing companies hiring at scale</p>
              </div>
              <div className="pricing-price">
                <span className="pricing-amount">$49</span>
                <span className="pricing-period">/month</span>
              </div>
              <ul className="pricing-features">
                <li><span className="pricing-check">✓</span> Unlimited assessments</li>
                <li><span className="pricing-check">✓</span> 100 candidates / month</li>
                <li><span className="pricing-check">✓</span> Advanced AI evaluation</li>
                <li><span className="pricing-check">✓</span> Fraud detection</li>
                <li><span className="pricing-check">✓</span> Detailed reports</li>
                <li><span className="pricing-check">✓</span> Priority support</li>
                <li><span className="pricing-check">✓</span> Custom branding</li>
              </ul>
              <Link href="/register" className="btn btn-primary btn-lg w-full" style={{ justifyContent: 'center' }}>
                Start Free Trial
              </Link>
            </Reveal>

            <Reveal delay={300} className="pricing-card">
              <div className="pricing-card-header">
                <h3 className="pricing-plan-name">Enterprise</h3>
                <p className="pricing-plan-desc">For large organizations with custom needs</p>
              </div>
              <div className="pricing-price">
                <span className="pricing-amount">Custom</span>
              </div>
              <ul className="pricing-features">
                <li><span className="pricing-check">✓</span> Everything in Professional</li>
                <li><span className="pricing-check">✓</span> Unlimited candidates</li>
                <li><span className="pricing-check">✓</span> SSO & SAML</li>
                <li><span className="pricing-check">✓</span> SLA guarantee</li>
                <li><span className="pricing-check">✓</span> Dedicated success manager</li>
                <li><span className="pricing-check">✓</span> API access</li>
              </ul>
              <Link href="/register" className="btn btn-secondary btn-lg w-full" style={{ justifyContent: 'center' }}>
                Contact Sales
              </Link>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ═══════════ FAQ ═══════════ */}
      <section className="faq-section" id="faq">
        <div className="container">
          <Reveal>
            <div className="section-eyebrow">FAQ</div>
            <h2 className="section-heading">Frequently asked <span className="gradient-text">questions</span></h2>
          </Reveal>

          <div className="faq-list">
            {FAQS.map((faq, i) => (
              <Reveal key={i} delay={i * 80}>
                <div
                  className={`faq-item ${activeFaq === i ? 'faq-open' : ''}`}
                  onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                >
                  <div className="faq-question">
                    <span>{faq.q}</span>
                    <span className="faq-toggle">{activeFaq === i ? '−' : '+'}</span>
                  </div>
                  <div className="faq-answer">
                    <p>{faq.a}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ FINAL CTA ═══════════ */}
      <section className="final-cta">
        <div className="final-cta-bg"></div>
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <Reveal>
            <h2 className="final-cta-title">
              Ready to hire with <span className="gradient-text">AI confidence</span>?
            </h2>
            <p className="final-cta-subtitle">
              Join 150+ companies that trust HireIQ to identify genuine developer talent.
              Start for free — no credit card required.
            </p>
            <div className="final-cta-actions">
              <Link href="/register" className="btn btn-primary btn-hero">
                Get Started Free
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M4 10h12m0 0l-4-4m4 4l-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </Link>
              <Link href="/login" className="btn btn-hero-secondary">Sign In →</Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══════════ FOOTER ═══════════ */}
      <footer className="site-footer">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-brand-col">
              <div className="footer-brand">
                <div className="landing-nav-logo" style={{ width: 32, height: 32 }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M12 2L2 7l10 5 10-5-10-5z" stroke="white" strokeWidth="2" strokeLinejoin="round"/><path d="M2 17l10 5 10-5" stroke="white" strokeWidth="2" strokeLinejoin="round"/><path d="M2 12l10 5 10-5" stroke="white" strokeWidth="2" strokeLinejoin="round"/></svg>
                </div>
                <span>HireIQ</span>
              </div>
              <p className="footer-tagline">AI-Powered Developer Assessment Platform. Identify genuine talent at scale.</p>
            </div>
            <div className="footer-col">
              <h4>Product</h4>
              <a href="#features">Features</a>
              <a href="#pricing">Pricing</a>
              <a href="#how-it-works">How It Works</a>
              <a href="#faq">FAQ</a>
            </div>
            <div className="footer-col">
              <h4>Company</h4>
              <a href="#">About</a>
              <a href="#">Blog</a>
              <a href="#">Careers</a>
              <a href="#">Contact</a>
            </div>
            <div className="footer-col">
              <h4>Legal</h4>
              <a href="#">Privacy Policy</a>
              <a href="#">Terms of Service</a>
              <a href="#">Security</a>
            </div>
          </div>
          <div className="footer-bottom">
            <span>© 2026 HireIQ. All rights reserved.</span>
            <div className="footer-socials">
              <a href="#" aria-label="Twitter">𝕏</a>
              <a href="#" aria-label="LinkedIn">in</a>
              <a href="#" aria-label="GitHub">GH</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
