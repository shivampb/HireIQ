'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const FOUNDER = {
  name: 'Shivam Bhardwaj',
  role: 'Founder & CEO',
  initials: 'SB',
  color: '#4f46e5',
  linkedin: 'https://www.linkedin.com/in/shivambhardwaj03/',
  bio: 'Building the future of hiring. Former software engineer who saw firsthand how broken the hiring process was — and decided to fix it with AI.',
  vision: 'I started HireIQ because I\'ve been on both sides of the interview table. I\'ve seen brilliant engineers get rejected because they don\'t interview well, and I\'ve seen people with great resumes who can\'t actually code. The resume is broken. Let\'s fix it.',
};

const ACHIEVEMENTS = [
  { number: '2,400+', label: 'Candidates Assessed', color: '#4f46e5' },
  { number: '150+', label: 'Companies Trust Us', color: '#7c3aed' },
  { number: '98%', label: 'Recruiter Satisfaction', color: '#059669' },
  { number: '40min', label: 'Avg. Time to Decision', color: '#0ea5e9' },
];

export default function FounderPage() {
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
      const tl = gsap.timeline({ delay: 0.1 });
      tl.fromTo('.founder-eyebrow', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' })
        .fromTo('.founder-name', { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, '-=0.3')
        .fromTo('.founder-role', { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.65, ease: 'power3.out' }, '-=0.45')
        .fromTo('.founder-bio', { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.65, ease: 'power3.out' }, '-=0.45')
        .fromTo('.founder-cta', { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.55, ease: 'back.out(1.7)' }, '-=0.35')
        .fromTo('.founder-card', { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, duration: 1, ease: 'power2.out' }, 0.2);

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

      gsap.fromTo('.achievement-item', { opacity: 0, y: 40 }, { opacity: 1, y: 0, stagger: 0.1, duration: 0.75, ease: 'power3.out', scrollTrigger: { trigger: '.achievements-grid', start: 'top 88%' } });
      gsap.fromTo('.vision-section', { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', scrollTrigger: { trigger: '.vision-section', start: 'top 85%' } });
    }, pageRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={pageRef} style={{ fontFamily: "'Inter', sans-serif", background: '#fafafa', minHeight: '100vh', overflowX: 'hidden' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        @keyframes float-slow { 0%,100%{transform:translateY(0) rotate(0deg)} 50%{transform:translateY(-20px) rotate(3deg)} }
        .hover-link { transition: color 0.2s; } .hover-link:hover { color: #6366f1 !important; }
        .cta-primary { transition: all 0.25s; } .cta-primary:hover { transform: translateY(-2px); box-shadow: 0 10px 32px rgba(79,70,229,0.45) !important; }
        .linkedin-btn { transition: all 0.25s; } .linkedin-btn:hover { background: #0077b5 !important; transform: translateY(-2px); }
        * { box-sizing: border-box; margin: 0; padding: 0; }
      `}</style>

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
            {[['Features', '/#features'], ['How It Works', '/how-it-works'], ['Founder', '/founder'], ['About', '/about'], ['Pricing', '/#pricing']].map(([label, href]) => (
              <Link key={label} href={href} style={{
                padding: '8px 14px', borderRadius: 8, fontSize: 14, fontWeight: label === 'Founder' ? 700 : 500,
                color: label === 'Founder' ? '#4f46e5' : '#6b7280', textDecoration: 'none',
                background: label === 'Founder' ? 'rgba(79,70,229,0.07)' : 'transparent',
              }}>{label}</Link>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <Link href="/login" style={{ fontSize: 14, fontWeight: 600, color: '#374151', textDecoration: 'none', padding: '8px 16px' }}>Sign In</Link>
            <Link href="/register" className="cta-primary" style={{ background: 'linear-gradient(135deg,#4f46e5,#6366f1)', color: 'white', padding: '10px 20px', borderRadius: 10, fontSize: 14, fontWeight: 700, textDecoration: 'none', boxShadow: '0 4px 14px rgba(79,70,229,0.35)' }}>Get Started Free</Link>
          </div>
        </div>
      </nav>

      <section style={{ paddingTop: 150, paddingBottom: 100, textAlign: 'center', position: 'relative', overflow: 'hidden', background: 'linear-gradient(180deg, #f0f0ff 0%, #fafafa 100%)' }}>
        <div style={{ position: 'absolute', top: -80, left: '5%', width: 500, height: 500, background: 'radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)', borderRadius: '50%', animation: 'float-slow 8s ease-in-out infinite', pointerEvents: 'none' }}/>
        <div style={{ position: 'absolute', top: 60, right: '3%', width: 380, height: 380, background: 'radial-gradient(circle, rgba(124,58,237,0.09) 0%, transparent 70%)', borderRadius: '50%', animation: 'float-slow 10s ease-in-out infinite reverse', pointerEvents: 'none' }}/>

        <div style={{ position: 'relative', zIndex: 1, maxWidth: 800, margin: '0 auto', padding: '0 24px' }}>
          <div className="founder-eyebrow" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'white', border: '1px solid #e5e7eb', borderRadius: 99, padding: '6px 18px 6px 8px', marginBottom: 28, boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
            <span style={{ background: 'linear-gradient(135deg,#4f46e5,#7c3aed)', color: 'white', borderRadius: 99, padding: '4px 12px', fontSize: 11, fontWeight: 700 }}>FOUNDER</span>
            <span style={{ fontSize: 14, color: '#6b7280', fontWeight: 500 }}>The person behind HireIQ</span>
          </div>

          <div className="founder-card" style={{ width: 140, height: 140, borderRadius: '50%', background: `linear-gradient(135deg, ${FOUNDER.color}, #7c3aed)`, margin: '0 auto 32px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 42, fontWeight: 900, color: 'white', boxShadow: `0 16px 48px ${FOUNDER.color}40` }}>
            {FOUNDER.initials}
          </div>

          <h1 className="founder-name" style={{ fontSize: 'clamp(2.5rem, 5vw, 3.8rem)', fontWeight: 800, color: '#0f172a', lineHeight: 1.12, marginBottom: 16, letterSpacing: '-0.03em' }}>
            {FOUNDER.name}
          </h1>
          
          <div className="founder-role" style={{ fontSize: 20, fontWeight: 700, color: FOUNDER.color, marginBottom: 28, letterSpacing: '0.02em' }}>
            {FOUNDER.role}
          </div>

          <p className="founder-bio" style={{ fontSize: 18, color: '#64748b', lineHeight: 1.7, fontWeight: 400, marginBottom: 36, maxWidth: 560, margin: '0 auto 36px' }}>
            {FOUNDER.bio}
          </p>

          <div className="founder-cta" style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href={FOUNDER.linkedin} target="_blank" rel="noopener noreferrer" className="linkedin-btn" style={{ background: '#0077b5', color: 'white', padding: '12px 24px', borderRadius: 12, fontSize: 15, fontWeight: 700, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.675H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
              Connect on LinkedIn
            </a>
            <Link href="/about" className="cta-primary" style={{ background: 'white', color: '#374151', padding: '12px 24px', borderRadius: 12, fontSize: 15, fontWeight: 600, textDecoration: 'none', border: '1px solid #e5e7eb', display: 'inline-flex', alignItems: 'center' }}>
              Learn About HireIQ
            </Link>
          </div>
        </div>
      </section>

      <section style={{ background: 'white', padding: '80px 24px', borderTop: '1px solid #f3f4f6', borderBottom: '1px solid #f3f4f6' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#4f46e5', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 12 }}>Impact So Far</div>
            <h2 style={{ fontSize: 'clamp(1.8rem,3vw,2.6rem)', fontWeight: 700, color: '#0f172a', letterSpacing: '-0.02em' }}>What we've built together</h2>
          </div>
          <div className="achievements-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 2 }}>
            {ACHIEVEMENTS.map((s, i) => (
              <div key={i} className="achievement-item" style={{ textAlign: 'center', padding: '32px 20px', borderRight: i < 3 ? '1px solid #f3f4f6' : 'none' }}>
                <div style={{ fontSize: 'clamp(2.4rem,4vw,3.5rem)', fontWeight: 900, color: s.color, lineHeight: 1, marginBottom: 10, fontVariantNumeric: 'tabular-nums' }}>
                  <span data-count={s.number.replace(/[^0-9]/g, '')} data-suffix={s.number.replace(/[0-9]/g, '')}>0</span>
                </div>
                <div style={{ fontSize: 14, color: '#64748b', fontWeight: 500, lineHeight: 1.4 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="vision-section" style={{ padding: '100px 24px', background: '#fafafa' }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#4f46e5', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 14 }}>My Vision</div>
            <h2 style={{ fontSize: 'clamp(1.8rem,3vw,2.5rem)', fontWeight: 700, color: '#0f172a', lineHeight: 1.22, letterSpacing: '-0.02em' }}>
              Why I built HireIQ
            </h2>
          </div>
          <div style={{ background: 'white', borderRadius: 24, padding: 40, boxShadow: '0 8px 48px rgba(0,0,0,0.08)', border: '1px solid #f3f4f6' }}>
            <div style={{ position: 'absolute', top: -24, right: -24, width: 120, height: 120, background: 'radial-gradient(circle, rgba(79,70,229,0.12) 0%, transparent 70%)', borderRadius: '50%' }}/>
            <p style={{ fontSize: 18, color: '#374151', lineHeight: 1.8, fontStyle: 'italic', position: 'relative', zIndex: 1 }}>
              "{FOUNDER.vision}"
            </p>
          </div>
        </div>
      </section>

      <section style={{ padding: '100px 24px', background: 'linear-gradient(135deg, #4f46e5, #6d28d9)', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -60, left: '15%', width: 300, height: 300, background: 'rgba(255,255,255,0.05)', borderRadius: '50%' }}/>
        <div style={{ position: 'absolute', bottom: -80, right: '10%', width: 400, height: 400, background: 'rgba(255,255,255,0.04)', borderRadius: '50%' }}/>
        <div style={{ position: 'relative', zIndex: 1, maxWidth: 600, margin: '0 auto' }}>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 18 }}>Let's Connect</div>
          <h2 style={{ fontSize: 'clamp(2rem,3.5vw,2.8rem)', fontWeight: 700, color: 'white', marginBottom: 16, letterSpacing: '-0.02em' }}>Have questions about HireIQ?</h2>
          <p style={{ fontSize: 17, color: 'rgba(255,255,255,0.75)', marginBottom: 36, lineHeight: 1.65 }}>
            I'd love to hear from you. Reach out on LinkedIn or get started with HireIQ today.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href={FOUNDER.linkedin} target="_blank" rel="noopener noreferrer" style={{ background: 'white', color: '#4f46e5', padding: '16px 32px', borderRadius: 14, fontSize: 16, fontWeight: 800, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 8, boxShadow: '0 4px 24px rgba(0,0,0,0.2)' }}>
              Connect on LinkedIn →
            </a>
            <Link href="/register" style={{ background: 'rgba(255,255,255,0.12)', color: 'white', padding: '16px 28px', borderRadius: 14, fontSize: 16, fontWeight: 600, textDecoration: 'none', border: '1px solid rgba(255,255,255,0.2)', display: 'inline-flex', alignItems: 'center' }}>
              Start Free Assessment
            </Link>
          </div>
        </div>
      </section>

      <footer style={{ background: '#0f172a', padding: '64px 24px 32px', color: 'white' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 48, marginBottom: 56, paddingBottom: 48, borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                <div style={{ width: 36, height: 36, background: 'linear-gradient(135deg,#4f46e5,#7c3aed)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M12 2L2 7l10 5 10-5-10-5z" stroke="white" strokeWidth="2" strokeLinejoin="round"/><path d="M2 17l10 5 10-5" stroke="white" strokeWidth="2" strokeLinejoin="round"/><path d="M2 12l10 5 10-5" stroke="white" strokeWidth="2" strokeLinejoin="round"/></svg>
                </div>
                <span style={{ fontWeight: 800, fontSize: 18 }}>HireIQ</span>
              </div>
              <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', lineHeight: 1.7, maxWidth: 280, marginBottom: 24 }}>AI-powered technical assessment platform. Identify genuine developer talent at scale with fraud detection built in.</p>
            </div>
            <div>
              <h4 style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 18 }}>Product</h4>
              {[['Features', '/#features'], ['How It Works', '/how-it-works'], ['Founder', '/founder'], ['About', '/about'], ['Pricing', '/#pricing']].map(([label, href]) => (
                <Link key={label} href={href} className="hover-link" style={{ display: 'block', fontSize: 14, color: 'rgba(255,255,255,0.55)', marginBottom: 11, textDecoration: 'none' }}>{label}</Link>
              ))}
            </div>
            <div>
              <h4 style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 18 }}>Company</h4>
              {[['About', '/about'], ['Blog', '#'], ['Careers', '#'], ['Contact', '#']].map(([label, href]) => (
                <Link key={label} href={href} className="hover-link" style={{ display: 'block', fontSize: 14, color: 'rgba(255,255,255,0.55)', marginBottom: 11, textDecoration: 'none' }}>{label}</Link>
              ))}
            </div>
            <div>
              <h4 style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 18 }}>Legal</h4>
              {['Privacy Policy', 'Terms of Service', 'Security', 'Cookie Policy'].map(item => (
                <a key={item} href="#" className="hover-link" style={{ display: 'block', fontSize: 14, color: 'rgba(255,255,255,0.55)', marginBottom: 11, textDecoration: 'none' }}>{item}</a>
              ))}
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
            <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.3)' }}>
              © {new Date().getFullYear()} HireIQ. All rights reserved.
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}