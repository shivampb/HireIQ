'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const TEAM = [
  { name: 'Arjun Mehta', role: 'CEO & Co-founder', bio: 'Former engineering lead at Razorpay. Frustrated by hiring inefficiencies, he built HireIQ to fix them.', color: '#4f46e5', initials: 'AM' },
  { name: 'Priya Nair', role: 'CTO & Co-founder', bio: '10 years in AI/ML at Google. Leads the Gemini AI integration and evaluation engine architecture.', color: '#0ea5e9', initials: 'PN' },
  { name: 'Rahul Singh', role: 'Head of Product', bio: 'Ex-Figma product designer turned builder. Obsessed with making complex tools feel effortless.', color: '#7c3aed', initials: 'RS' },
  { name: 'Anjali Verma', role: 'Head of Growth', bio: 'Growth veteran from CRED and Zepto. Helps companies discover smarter hiring at scale.', color: '#059669', initials: 'AV' },
  { name: 'Dev Patel', role: 'Lead Engineer', bio: 'Full-stack engineer who has shipped products used by millions. Loves clean systems and clean code.', color: '#d97706', initials: 'DP' },
  { name: 'Sneha Kulkarni', role: 'AI Research Lead', bio: 'PhD in NLP from IIT Bombay. Designs the prompt architectures that power every HireIQ assessment.', color: '#dc2626', initials: 'SK' },
];

const TIMELINE = [
  { year: '2022', title: 'The Problem', desc: 'Our founders, after reviewing 1,000+ developer applications, noticed a painful pattern: resumes lied. Screened candidates couldn\'t answer basic questions about their own listed skills.' },
  { year: '2023 Q1', title: 'The Prototype', desc: 'First version built in a weekend hackathon — a simple script that parsed a resume and generated questions via GPT. 12 companies piloted it in month one.' },
  { year: '2023 Q3', title: 'Gemini Integration', desc: 'Switched to Google Gemini AI for dramatically better question quality, context understanding, and fraud detection capability. Assessment accuracy jumped to 94%.' },
  { year: '2024 Q1', title: 'Product Launch', desc: 'Full SaaS platform launched: multi-tenant dashboard, PDF parsing, real-time reports, and fraud scoring. 150+ companies onboarded in the first quarter.' },
  { year: '2024 Q4', title: 'Scale & Now', desc: 'Powering assessments for engineering teams across India, UAE, and Europe. Processing 2,400+ candidate evaluations monthly with 98% recruiter satisfaction.' },
];

const VALUES = [
  { icon: '🎯', title: 'Honest > Impressive', desc: 'We optimize for accuracy, not flattering results. A "maybe" that\'s honest is worth more than a "hire" that wastes everyone\'s time.' },
  { icon: '⚡', title: 'Speed without shortcuts', desc: 'Assessments take 30 minutes, not 3 weeks. We compress traditional screening cycles without sacrificing quality.' },
  { icon: '🤝', title: 'Fair to candidates', desc: 'Every candidate gets questions tailored to what they\'ve actually claimed — not a generic quiz. Fairness builds better hiring pipelines.' },
  { icon: '🔍', title: 'Relentlessly transparent', desc: 'Our reports explain their reasoning. Every score has a rationale. No black boxes, no arbitrary pass/fail.' },
];

export default function AboutPage() {
  const pageRef = useRef<HTMLDivElement>(null);
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // — Hero entrance —
      const tl = gsap.timeline({ delay: 0.1 });
      tl.fromTo('.about-eyebrow',   { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' })
        .fromTo('.about-hero-h1',   { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, '-=0.3')
        .fromTo('.about-hero-sub',  { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.65, ease: 'power3.out' }, '-=0.45')
        .fromTo('.about-hero-ctas', { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.55, ease: 'back.out(1.7)' }, '-=0.35')
        .fromTo('.hero-orb-about',  { opacity: 0, scale: 0.7 }, { opacity: 1, scale: 1, duration: 1.2, ease: 'power2.out', stagger: 0.15 }, 0);

      // — Mission numbers count-up —
      const countEls = document.querySelectorAll<HTMLElement>('[data-count]');
      countEls.forEach(el => {
        const target = parseInt(el.dataset.count || '0', 10);
        const suffix = el.dataset.suffix || '';
        ScrollTrigger.create({
          trigger: el,
          start: 'top 85%',
          once: true,
          onEnter: () => {
            const proxy = { val: 0 };
            gsap.to(proxy, {
              val: target, duration: 1.8, ease: 'power2.out',
              onUpdate: () => { el.textContent = Math.round(proxy.val).toLocaleString() + suffix; }
            });
          }
        });
      });

      // — Scroll reveals — 
      const batch = (sel: string, fromX = 0, fromY = 50, stagger = 0.12) => {
        if (!document.querySelector(sel)) return;
        gsap.fromTo(sel,
          { opacity: 0, x: fromX, y: fromY },
          { opacity: 1, x: 0, y: 0, stagger, duration: 0.75, ease: 'power3.out',
            scrollTrigger: { trigger: sel, start: 'top 88%', toggleActions: 'play none none none' } }
        );
      };

      batch('.mission-stat',   0, 40, 0.1);
      batch('.value-card',     0, 50, 0.12);
      batch('.team-card',      0, 60, 0.1);
      batch('.timeline-item',  -40, 0, 0.14);
      batch('.section-label',  0, 24, 0);
      batch('.section-h2',     0, 32, 0);
      batch('.section-p',      0, 24, 0);
      batch('.tech-badge',     0, 30, 0.08);
      batch('.about-cta-inner',0, 40, 0);

      // — Timeline line draw —
      gsap.fromTo('.timeline-line',
        { scaleY: 0, transformOrigin: 'top center' },
        { scaleY: 1, duration: 1.5, ease: 'power2.inOut',
          scrollTrigger: { trigger: '.timeline-line', start: 'top 70%' }
        }
      );

      // — Team cards hover 3D tilt (via CSS vars on hover) —
      document.querySelectorAll<HTMLElement>('.team-card').forEach(card => {
        card.addEventListener('mouseenter', () => gsap.to(card, { y: -6, scale: 1.02, duration: 0.3, ease: 'power2.out' }));
        card.addEventListener('mouseleave', () => gsap.to(card, { y: 0, scale: 1, duration: 0.4, ease: 'power2.out' }));
      });

    }, pageRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={pageRef} style={{ fontFamily: "'Inter', sans-serif", background: '#fafafa', minHeight: '100vh', overflowX: 'hidden' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        @keyframes float-slow { 0%,100%{transform:translateY(0) rotate(0deg)} 50%{transform:translateY(-20px) rotate(3deg)} }
        @keyframes spin-vslow { to { transform: rotate(360deg); } }
        @keyframes pulse-dot { 0%,100%{transform:scale(1);opacity:1} 50%{transform:scale(1.4);opacity:0.6} }
        .hover-link { transition: color 0.2s; } .hover-link:hover { color: #6366f1 !important; }
        .cta-primary { transition: all 0.25s; } .cta-primary:hover { transform: translateY(-2px); box-shadow: 0 10px 32px rgba(79,70,229,0.45) !important; }
        .cta-secondary { transition: all 0.25s; } .cta-secondary:hover { background: #f9fafb !important; }
        .value-card { transition: box-shadow 0.3s, transform 0.3s; } .value-card:hover { box-shadow: 0 8px 32px rgba(79,70,229,0.1) !important; transform: translateY(-4px); }
        * { box-sizing: border-box; margin: 0; padding: 0; }
      `}</style>

      {/* ── NAVBAR ── */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        background: mounted && scrolled ? 'rgba(255,255,255,0.92)' : 'rgba(255,255,255,0.65)',
        backdropFilter: 'blur(18px) saturate(180%)',
        borderBottom: mounted && scrolled ? '1px solid rgba(0,0,0,0.07)' : 'none',
        boxShadow: mounted && scrolled ? '0 2px 18px rgba(0,0,0,0.06)' : 'none',
        transition: 'all 0.35s ease',
        padding: mounted && scrolled ? '10px 0' : '16px 0',
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
            <div style={{ width: 36, height: 36, background: 'linear-gradient(135deg,#4f46e5,#7c3aed)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M12 2L2 7l10 5 10-5-10-5z" stroke="white" strokeWidth="2" strokeLinejoin="round"/><path d="M2 17l10 5 10-5" stroke="white" strokeWidth="2" strokeLinejoin="round"/><path d="M2 12l10 5 10-5" stroke="white" strokeWidth="2" strokeLinejoin="round"/></svg>
            </div>
            <span style={{ fontWeight: 800, fontSize: 18, color: '#111827' }}>HireIQ</span>
          </Link>
          <div style={{ display: 'flex', gap: 4 }}>
            {[['Features', '/#features'], ['How It Works', '/how-it-works'], ['About', '/about'], ['Pricing', '/#pricing']].map(([label, href]) => (
              <Link key={label} href={href} style={{
                padding: '8px 14px', borderRadius: 8, fontSize: 14, fontWeight: label === 'About' ? 700 : 500,
                color: label === 'About' ? '#4f46e5' : '#6b7280', textDecoration: 'none',
                background: label === 'About' ? 'rgba(79,70,229,0.07)' : 'transparent',
              }}>{label}</Link>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <Link href="/login" style={{ fontSize: 14, fontWeight: 600, color: '#374151', textDecoration: 'none', padding: '8px 16px' }}>Sign In</Link>
            <Link href="/register" className="cta-primary" style={{ background: 'linear-gradient(135deg,#4f46e5,#6366f1)', color: 'white', padding: '10px 20px', borderRadius: 10, fontSize: 14, fontWeight: 700, textDecoration: 'none', boxShadow: '0 4px 14px rgba(79,70,229,0.35)' }}>Get Started Free</Link>
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section style={{ paddingTop: 150, paddingBottom: 100, textAlign: 'center', position: 'relative', overflow: 'hidden', background: 'linear-gradient(180deg, #f0f0ff 0%, #fafafa 100%)' }}>
        {/* Orbs */}
        <div className="hero-orb-about" style={{ position: 'absolute', top: -80, left: '5%', width: 500, height: 500, background: 'radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)', borderRadius: '50%', animation: 'float-slow 8s ease-in-out infinite', pointerEvents: 'none' }}/>
        <div className="hero-orb-about" style={{ position: 'absolute', top: 60, right: '3%', width: 380, height: 380, background: 'radial-gradient(circle, rgba(124,58,237,0.09) 0%, transparent 70%)', borderRadius: '50%', animation: 'float-slow 10s ease-in-out infinite reverse', pointerEvents: 'none' }}/>

        <div style={{ position: 'relative', zIndex: 1, maxWidth: 800, margin: '0 auto', padding: '0 24px' }}>
          <div className="about-eyebrow" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'white', border: '1px solid #e5e7eb', borderRadius: 99, padding: '6px 18px 6px 8px', marginBottom: 28, boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
            <span style={{ background: 'linear-gradient(135deg,#4f46e5,#7c3aed)', color: 'white', borderRadius: 99, padding: '4px 12px', fontSize: 11, fontWeight: 700 }}>OUR STORY</span>
            <span style={{ fontSize: 14, color: '#6b7280', fontWeight: 500 }}>Building the future of technical hiring</span>
          </div>
          <h1 className="about-hero-h1" style={{ fontSize: 'clamp(2.8rem, 5.5vw, 4.2rem)', fontWeight: 700, color: '#0f172a', lineHeight: 1.12, marginBottom: 24, letterSpacing: '-0.03em' }}>
            We believe every hire<br/>
            <span style={{ background: 'linear-gradient(135deg,#4f46e5,#7c3aed)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>should be earned</span>
          </h1>
          <p className="about-hero-sub" style={{ fontSize: 19, color: '#64748b', lineHeight: 1.7, fontWeight: 400, marginBottom: 36 }}>
            HireIQ was born from a simple frustration — resumes lied, and interviews were guesswork.
            We built an AI system that actually verifies what candidates claim, so you can hire with confidence.
          </p>
          <div className="about-hero-ctas" style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/register" className="cta-primary" style={{ background: 'linear-gradient(135deg,#4f46e5,#6366f1)', color: 'white', padding: '14px 28px', borderRadius: 12, fontSize: 15, fontWeight: 700, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 8, boxShadow: '0 4px 18px rgba(79,70,229,0.38)' }}>
              Start for Free →
            </Link>
            <Link href="/how-it-works" className="cta-secondary" style={{ background: 'white', color: '#374151', padding: '14px 24px', borderRadius: 12, fontSize: 15, fontWeight: 600, textDecoration: 'none', border: '1px solid #e5e7eb', display: 'inline-flex', alignItems: 'center' }}>
              See How It Works
            </Link>
          </div>
        </div>
      </section>

      {/* ── MISSION STATS ── */}
      <section style={{ background: 'white', padding: '80px 24px', borderTop: '1px solid #f3f4f6', borderBottom: '1px solid #f3f4f6' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <div className="section-label" style={{ fontSize: 12, fontWeight: 700, color: '#4f46e5', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 12 }}>By The Numbers</div>
            <h2 className="section-h2" style={{ fontSize: 'clamp(1.8rem,3vw,2.6rem)', fontWeight: 700, color: '#0f172a', letterSpacing: '-0.02em' }}>Our impact, in plain numbers</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 2 }}>
            {[
              { count: 2400, suffix: '+', label: 'Candidates Assessed', color: '#4f46e5' },
              { count: 98, suffix: '%', label: 'Recruiter Satisfaction', color: '#7c3aed' },
              { count: 150, suffix: '+', label: 'Companies Trust Us', color: '#059669' },
              { count: 40, suffix: 'min', label: 'Avg. Time to Decision', color: '#0ea5e9' },
            ].map((s, i) => (
              <div key={i} className="mission-stat" style={{ textAlign: 'center', padding: '32px 20px', borderRight: i < 3 ? '1px solid #f3f4f6' : 'none' }}>
                <div style={{ fontSize: 'clamp(2.4rem,4vw,3.5rem)', fontWeight: 900, color: s.color, lineHeight: 1, marginBottom: 10, fontVariantNumeric: 'tabular-nums' }}>
                  <span data-count={s.count} data-suffix={s.suffix}>0{s.suffix}</span>
                </div>
                <div style={{ fontSize: 14, color: '#64748b', fontWeight: 500, lineHeight: 1.4 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── MISSION + VISION ── */}
      <section style={{ padding: '100px 24px', background: '#fafafa' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'center' }}>
          <div>
            <div className="section-label" style={{ fontSize: 12, fontWeight: 700, color: '#4f46e5', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 14 }}>Our Mission</div>
            <h2 className="section-h2" style={{ fontSize: 'clamp(1.8rem,3vw,2.5rem)', fontWeight: 700, color: '#0f172a', lineHeight: 1.22, marginBottom: 20, letterSpacing: '-0.02em' }}>
              Make every technical hire a confident one
            </h2>
            <p className="section-p" style={{ fontSize: 16, color: '#64748b', lineHeight: 1.75, marginBottom: 28 }}>
              We started HireIQ because hiring great engineers was broken. Resumes were inflated, coding tests were gamed, and interviews were expensive guesswork. AI changed that.
            </p>
            <p className="section-p" style={{ fontSize: 16, color: '#64748b', lineHeight: 1.75 }}>
              Today, HireIQ gives every recruiter a superpower: the ability to verify what a candidate actually knows — in 40 minutes, not 3 weeks — using AI that reads their resume, tailors every question, and detects inconsistency automatically.
            </p>
          </div>
          <div style={{ position: 'relative' }}>
            {/* Decorative card */}
            <div style={{ background: 'white', borderRadius: 24, padding: 32, boxShadow: '0 8px 48px rgba(0,0,0,0.08)', border: '1px solid #f3f4f6', position: 'relative', zIndex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#4f46e5', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#4f46e5', animation: 'pulse-dot 2s infinite' }}/>
                Live Assessment · Gemini AI
              </div>
              {[
                { q: 'How would you optimize a slow React component?', score: 92, color: '#059669' },
                { q: 'Explain the difference between interface and type in TypeScript.', score: 85, color: '#2563eb' },
                { q: 'Walk me through a production incident you resolved.', score: 71, color: '#d97706' },
              ].map((item, i) => (
                <div key={i} style={{ marginBottom: i < 2 ? 16 : 0, padding: '14px 16px', background: '#f8fafc', borderRadius: 12, border: '1px solid #f1f5f9' }}>
                  <div style={{ fontSize: 13, color: '#374151', fontWeight: 500, marginBottom: 10, lineHeight: 1.45 }}>{item.q}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ flex: 1, height: 4, background: '#e5e7eb', borderRadius: 99 }}>
                      <div style={{ width: `${item.score}%`, height: '100%', background: item.color, borderRadius: 99, transition: 'width 1s ease' }}/>
                    </div>
                    <span style={{ fontSize: 12, fontWeight: 800, color: item.color }}>{item.score}%</span>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ position: 'absolute', top: -24, right: -24, width: 120, height: 120, background: 'radial-gradient(circle, rgba(79,70,229,0.12) 0%, transparent 70%)', borderRadius: '50%', zIndex: 0 }}/>
            <div style={{ position: 'absolute', bottom: -32, left: -32, width: 160, height: 160, background: 'radial-gradient(circle, rgba(124,58,237,0.08) 0%, transparent 70%)', borderRadius: '50%', zIndex: 0 }}/>
          </div>
        </div>
      </section>

      {/* ── TIMELINE ── */}
      <section style={{ padding: '100px 24px', background: 'white' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <div className="section-label" style={{ fontSize: 12, fontWeight: 700, color: '#4f46e5', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 14 }}>Our Journey</div>
            <h2 className="section-h2" style={{ fontSize: 'clamp(1.8rem,3vw,2.6rem)', fontWeight: 700, color: '#0f172a', letterSpacing: '-0.02em' }}>From frustration to platform</h2>
          </div>
          <div style={{ position: 'relative' }}>
            {/* Vertical line */}
            <div className="timeline-line" style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: 2, background: 'linear-gradient(180deg,#4f46e5,#7c3aed,#c4b5fd)', transform: 'translateX(-50%)', borderRadius: 2 }}/>
            {TIMELINE.map((item, i) => {
              const isLeft = i % 2 === 0;
              return (
                <div key={i} className="timeline-item" style={{ display: 'flex', gap: 40, marginBottom: 60, flexDirection: isLeft ? 'row' : 'row-reverse' }}>
                  <div style={{ flex: 1, textAlign: isLeft ? 'right' : 'left', paddingTop: 8 }}>
                    <div style={{ fontSize: 13, fontWeight: 800, color: '#4f46e5', marginBottom: 6, letterSpacing: '0.05em' }}>{item.year}</div>
                    <h3 style={{ fontSize: 18, fontWeight: 700, color: '#0f172a', marginBottom: 8 }}>{item.title}</h3>
                    <p style={{ fontSize: 14, color: '#64748b', lineHeight: 1.65 }}>{item.desc}</p>
                  </div>
                  {/* Dot */}
                  <div style={{ flexShrink: 0, width: 40, display: 'flex', justifyContent: 'center', alignItems: 'flex-start', paddingTop: 12, position: 'relative', zIndex: 1 }}>
                    <div style={{ width: 16, height: 16, borderRadius: '50%', background: '#4f46e5', border: '3px solid white', boxShadow: '0 0 0 3px #c7d2fe' }}/>
                  </div>
                  <div style={{ flex: 1 }}/>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── VALUES ── */}
      <section style={{ padding: '100px 24px', background: 'linear-gradient(180deg, #fafafa 0%, #f0f0ff 100%)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 60 }}>
            <div className="section-label" style={{ fontSize: 12, fontWeight: 700, color: '#4f46e5', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 14 }}>What We Believe</div>
            <h2 className="section-h2" style={{ fontSize: 'clamp(1.8rem,3vw,2.6rem)', fontWeight: 700, color: '#0f172a', letterSpacing: '-0.02em' }}>Our core values</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 20 }}>
            {VALUES.map((v, i) => (
              <div key={i} className="value-card" style={{ background: 'white', borderRadius: 20, padding: 32, border: '1px solid #f3f4f6', boxShadow: '0 2px 12px rgba(0,0,0,0.04)', cursor: 'default' }}>
                <div style={{ fontSize: 36, marginBottom: 16 }}>{v.icon}</div>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: '#0f172a', marginBottom: 10 }}>{v.title}</h3>
                <p style={{ fontSize: 15, color: '#64748b', lineHeight: 1.65 }}>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TEAM ── */}
      <section style={{ padding: '100px 24px', background: 'white' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 60 }}>
            <div className="section-label" style={{ fontSize: 12, fontWeight: 700, color: '#4f46e5', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 14 }}>The Team</div>
            <h2 className="section-h2" style={{ fontSize: 'clamp(1.8rem,3vw,2.6rem)', fontWeight: 700, color: '#0f172a', letterSpacing: '-0.02em', marginBottom: 14 }}>People building HireIQ</h2>
            <p className="section-p" style={{ fontSize: 16, color: '#64748b', maxWidth: 500, margin: '0 auto' }}>Engineers, researchers, and product people who've felt hiring pain firsthand.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
            {TEAM.map((member, i) => (
              <div key={i} className="team-card" style={{ background: 'white', borderRadius: 20, padding: '32px 24px', border: '1px solid #f3f4f6', boxShadow: '0 2px 12px rgba(0,0,0,0.04)', textAlign: 'center', cursor: 'default' }}>
                <div style={{ width: 72, height: 72, borderRadius: '50%', background: `linear-gradient(135deg, ${member.color}, ${member.color}aa)`, margin: '0 auto 20px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, fontWeight: 800, color: 'white', boxShadow: `0 8px 24px ${member.color}30` }}>
                  {member.initials}
                </div>
                <div style={{ fontSize: 16, fontWeight: 700, color: '#0f172a', marginBottom: 4 }}>{member.name}</div>
                <div style={{ fontSize: 13, fontWeight: 600, color: member.color, marginBottom: 12, letterSpacing: '0.02em' }}>{member.role}</div>
                <p style={{ fontSize: 13, color: '#64748b', lineHeight: 1.65 }}>{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TECH STACK ── */}
      <section style={{ padding: '80px 24px', background: '#0f172a' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', textAlign: 'center' }}>
          <div className="section-label" style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.45)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 14 }}>Powered By</div>
          <h2 className="section-h2" style={{ fontSize: 'clamp(1.6rem,2.8vw,2.2rem)', fontWeight: 700, color: 'white', marginBottom: 16, letterSpacing: '-0.02em' }}>Built on world-class technology</h2>
          <p className="section-p" style={{ fontSize: 15, color: 'rgba(255,255,255,0.5)', marginBottom: 44 }}>We use the best tools available so our AI is always ahead of the curve.</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'center' }}>
            {[
              { name: 'Google Gemini AI', desc: 'Question generation & evaluation', color: '#6366f1' },
              { name: 'Next.js 14', desc: 'App Router, Server Actions', color: '#ffffff' },
              { name: 'TypeScript', desc: 'End-to-end type safety', color: '#60a5fa' },
              { name: 'PDF Parse', desc: 'Resume text extraction', color: '#f59e0b' },
              { name: 'MongoDB', desc: 'Multi-tenant data isolation', color: '#10b981' },
              { name: 'NextAuth.js', desc: 'Secure session management', color: '#a78bfa' },
              { name: 'GSAP', desc: 'Premium UI animations', color: '#34d399' },
              { name: 'Vercel', desc: 'Edge deployment', color: '#e2e8f0' },
            ].map((tech) => (
              <div key={tech.name} className="tech-badge" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, padding: '12px 20px', textAlign: 'center', minWidth: 140 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: tech.color, marginBottom: 4 }}>{tech.name}</div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)' }}>{tech.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ padding: '100px 24px', background: 'linear-gradient(135deg, #4f46e5, #6d28d9)', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -60, left: '15%', width: 300, height: 300, background: 'rgba(255,255,255,0.05)', borderRadius: '50%', animation: 'spin-vslow 20s linear infinite' }}/>
        <div style={{ position: 'absolute', bottom: -80, right: '10%', width: 400, height: 400, background: 'rgba(255,255,255,0.04)', borderRadius: '50%' }}/>
        <div className="about-cta-inner" style={{ position: 'relative', zIndex: 1, maxWidth: 600, margin: '0 auto' }}>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 18 }}>Join Us</div>
          <h2 style={{ fontSize: 'clamp(2rem,3.5vw,2.8rem)', fontWeight: 700, color: 'white', marginBottom: 16, letterSpacing: '-0.02em' }}>Ready to hire with confidence?</h2>
          <p style={{ fontSize: 17, color: 'rgba(255,255,255,0.75)', marginBottom: 36, lineHeight: 1.65 }}>
            Join 150+ teams who use HireIQ to eliminate resume padding and find engineers who actually deliver.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/register" style={{ background: 'white', color: '#4f46e5', padding: '16px 32px', borderRadius: 14, fontSize: 16, fontWeight: 800, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 8, boxShadow: '0 4px 24px rgba(0,0,0,0.2)', transition: 'all 0.25s' }}>
              Start Free Assessment →
            </Link>
            <Link href="/how-it-works" style={{ background: 'rgba(255,255,255,0.12)', color: 'white', padding: '16px 28px', borderRadius: 14, fontSize: 16, fontWeight: 600, textDecoration: 'none', border: '1px solid rgba(255,255,255,0.2)', display: 'inline-flex', alignItems: 'center', transition: 'all 0.25s' }}>
              See How It Works
            </Link>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ background: '#0f172a', padding: '64px 24px 32px', color: 'white' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 48, marginBottom: 56, paddingBottom: 48, borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
            {/* Brand */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                <div style={{ width: 36, height: 36, background: 'linear-gradient(135deg,#4f46e5,#7c3aed)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M12 2L2 7l10 5 10-5-10-5z" stroke="white" strokeWidth="2" strokeLinejoin="round"/><path d="M2 17l10 5 10-5" stroke="white" strokeWidth="2" strokeLinejoin="round"/><path d="M2 12l10 5 10-5" stroke="white" strokeWidth="2" strokeLinejoin="round"/></svg>
                </div>
                <span style={{ fontWeight: 800, fontSize: 18 }}>HireIQ</span>
              </div>
              <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', lineHeight: 1.7, maxWidth: 280, marginBottom: 24 }}>AI-powered technical assessment platform. Identify genuine developer talent at scale with fraud detection built in.</p>
              <div style={{ display: 'flex', gap: 10 }}>
                {['𝕏', 'in', 'GH'].map(s => (
                  <a key={s} href="#" style={{ width: 34, height: 34, borderRadius: 8, background: 'rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.55)', fontSize: 13, fontWeight: 700, textDecoration: 'none' }}>{s}</a>
                ))}
              </div>
            </div>

            {/* Product */}
            <div>
              <h4 style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 18 }}>Product</h4>
              {[['Features', '/#features'], ['How It Works', '/how-it-works'], ['About', '/about'], ['Pricing', '/#pricing']].map(([label, href]) => (
                <Link key={label} href={href} className="hover-link" style={{ display: 'block', fontSize: 14, color: 'rgba(255,255,255,0.55)', marginBottom: 11, textDecoration: 'none' }}>{label}</Link>
              ))}
            </div>

            {/* Company */}
            <div>
              <h4 style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 18 }}>Company</h4>
              {[['About', '/about'], ['Blog', '#'], ['Careers', '#'], ['Contact', '#']].map(([label, href]) => (
                <Link key={label} href={href} className="hover-link" style={{ display: 'block', fontSize: 14, color: 'rgba(255,255,255,0.55)', marginBottom: 11, textDecoration: 'none' }}>{label}</Link>
              ))}
            </div>

            {/* Legal */}
            <div>
              <h4 style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 18 }}>Legal</h4>
              {['Privacy Policy', 'Terms of Service', 'Security', 'Cookie Policy'].map(item => (
                <a key={item} href="#" className="hover-link" style={{ display: 'block', fontSize: 14, color: 'rgba(255,255,255,0.55)', marginBottom: 11, textDecoration: 'none' }}>{item}</a>
              ))}
            </div>
          </div>

          {/* Bottom */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
            <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.3)' }} suppressHydrationWarning>
              © {new Date().getFullYear()} HireIQ. All rights reserved.
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981', animation: 'pulse-dot 2s infinite' }}/>
              <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.3)' }}>All systems operational</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
