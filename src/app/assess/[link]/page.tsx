'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

type Step = 'loading' | 'welcome' | 'upload' | 'analyzing' | 'questions' | 'submitting' | 'completed' | 'error';

interface AssessmentInfo {
  _id: string;
  title: string;
  description: string;
  company: { name: string };
  questionCount: number;
  difficulty: string;
  skills: string[];
  faqs?: { question: string; answer: string }[];
}

interface QuestionData {
  _id: string;
  question: string;
  category: string;
  order: number;
}

export default function AssessmentPage() {
  const params = useParams();
  const link = params.link as string;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [step, setStep] = useState<Step>('loading');
  const [assessment, setAssessment] = useState<AssessmentInfo | null>(null);
  const [error, setError] = useState('');

  // Candidate form
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [resumeFile, setResumeFile] = useState<File | null>(null);

  // Q&A session
  const [candidateId, setCandidateId] = useState('');
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState<QuestionData | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answer, setAnswer] = useState('');
  const [submittingAnswer, setSubmittingAnswer] = useState(false);
  const [detectedSkills, setDetectedSkills] = useState<string[]>([]);

  // Load assessment details
  useEffect(() => {
    fetch(`/api/assess/${link}`)
      .then((res) => {
        if (!res.ok) throw new Error('Assessment not found');
        return res.json();
      })
      .then((data) => {
        setAssessment(data.assessment);
        setStep('welcome');
      })
      .catch((err) => {
        setError(err.message || 'Assessment not found or no longer active.');
        setStep('error');
      });
  }, [link]);

  // Handle resume upload and start assessment
  const handleStartAssessment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !email || !resumeFile) {
      setError('Please fill all fields and upload your resume.');
      return;
    }

    setStep('analyzing');
    setError('');

    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('email', email);
      formData.append('resume', resumeFile);

      const res = await fetch(`/api/assess/${link}/start`, {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Failed to start assessment');
        setStep('upload');
        return;
      }

      setCandidateId(data.candidateId);
      setTotalQuestions(data.totalQuestions);
      setCurrentQuestion(data.firstQuestion);
      setCurrentIndex(0);
      setDetectedSkills(data.resumeAnalysis?.skills || []);
      setStep('questions');
    } catch (err) {
      setError('Something went wrong. Please try again.');
      setStep('upload');
    }
  };

  // Submit answer
  const handleSubmitAnswer = async () => {
    if (!answer.trim()) return;

    setSubmittingAnswer(true);

    try {
      const res = await fetch(`/api/assess/${link}/answer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          candidateId,
          questionId: currentQuestion?._id,
          answer,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Failed to submit answer');
        setSubmittingAnswer(false);
        return;
      }

      if (data.completed) {
        setStep('submitting');
        // Auto-generate report in background without blocking candidate UI
        fetch(`/api/assess/${link}/report`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ candidateId }),
        }).catch(err => console.error('Background report auto-generation failed:', err));
        
        setStep('completed');
      } else {
        setCurrentQuestion(data.nextQuestion);
        setCurrentIndex(data.currentIndex);
        setAnswer('');
      }
    } catch (err) {
      setError('Failed to submit answer');
    } finally {
      setSubmittingAnswer(false);
    }
  };

  // ===== RENDER STEPS =====

  if (step === 'loading') {
    return (
      <div className="assess-container">
        <div className="loading-page">
          <div className="spinner"></div>
          <p className="loading-text">Loading assessment...</p>
        </div>
      </div>
    );
  }

  if (step === 'error') {
    return (
      <div className="assess-container">
        <div className="assess-body">
          <div className="question-card" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '4rem', marginBottom: 'var(--space-4)' }}>😔</div>
            <h2 style={{ marginBottom: 'var(--space-3)', color: 'var(--gray-900)' }}>
              Assessment Not Available
            </h2>
            <p className="text-sm text-gray-500">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'completed') {
    return (
      <div className="completion-container">
        <div className="completion-card">
          <div className="completion-icon">🎉</div>
          <h1 className="completion-title">Assessment Complete!</h1>
          <p className="completion-text">
            Thank you, <strong>{name}</strong>! Your responses have been submitted and are being
            evaluated by our AI system. The hiring team will review your results and get back to you.
          </p>
          <div style={{ marginTop: 'var(--space-6)' }}>
            <div className="badge badge-green" style={{ fontSize: 'var(--font-size-sm)', padding: 'var(--space-2) var(--space-4)' }}>
              ✅ {totalQuestions} questions answered
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="assess-container">
      {/* Header */}
      <div className="assess-header">
        <div className="assess-header-inner">
          <div className="assess-company">
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: 'var(--radius-md)',
              background: 'linear-gradient(135deg, var(--primary-500), var(--violet-600))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: 'var(--font-size-xs)',
              fontWeight: 700,
            }}>
              {assessment?.company?.name?.substring(0, 2).toUpperCase() || 'CO'}
            </div>
            {assessment?.company?.name || 'Company'}
          </div>
          {step === 'questions' && (
            <div className="assess-progress">
              <span>{currentIndex + 1} of {totalQuestions}</span>
              <div className="progress-bar" style={{ width: '120px' }}>
                <div
                  className="progress-fill"
                  style={{ width: `${((currentIndex + 1) / totalQuestions) * 100}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="assess-body">
        {/* Step Indicators */}
        <div className="step-indicator">
          <div className={`step ${step === 'welcome' ? 'active' : 'completed'}`}>
            <div className="step-number">{step === 'welcome' ? '1' : '✓'}</div>
            <span className="step-label">Welcome</span>
          </div>
          <div className={`step-line ${step !== 'welcome' ? 'completed' : ''}`}></div>
          <div className={`step ${(step === 'upload' || step === 'analyzing') ? 'active' : (step === 'questions' || step === 'submitting') ? 'completed' : ''}`}>
            <div className="step-number">{(step === 'questions' || step === 'submitting') ? '✓' : '2'}</div>
            <span className="step-label">Upload Resume</span>
          </div>
          <div className={`step-line ${(step === 'questions' || step === 'submitting') ? 'completed' : ''}`}></div>
          <div className={`step ${step === 'questions' ? 'active' : step === 'submitting' ? 'completed' : ''}`}>
            <div className="step-number">3</div>
            <span className="step-label">Assessment</span>
          </div>
        </div>

        {/* Welcome Step */}
        {step === 'welcome' && (
          <div className="question-card" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: 'var(--space-4)' }}>👋</div>
            <h2 style={{
              fontSize: 'var(--font-size-2xl)',
              fontWeight: 700,
              color: 'var(--gray-900)',
              marginBottom: 'var(--space-3)',
            }}>
              {assessment?.title}
            </h2>
            <div style={{ maxWidth: '650px', margin: '0 auto var(--space-6)', textAlign: 'left', color: 'var(--gray-600)', fontSize: '15px', lineHeight: '1.6' }}>
              {assessment?.description ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {assessment.description}
                  </ReactMarkdown>
                </div>
              ) : (
                <p style={{ textAlign: 'center' }}>
                  This assessment consists of {assessment?.questionCount} AI-generated questions tailored to your resume and experience.
                </p>
              )}
            </div>

            <div style={{
              display: 'flex',
              gap: 'var(--space-4)',
              justifyContent: 'center',
              marginBottom: 'var(--space-8)',
              flexWrap: 'wrap',
            }}>
              <div className="badge badge-blue" style={{ padding: 'var(--space-2) var(--space-4)' }}>
                📋 {assessment?.questionCount} Questions
              </div>
              <div className="badge badge-violet" style={{ padding: 'var(--space-2) var(--space-4)', textTransform: 'capitalize' }}>
                🎯 {assessment?.difficulty} Level
              </div>
              <div className="badge badge-green" style={{ padding: 'var(--space-2) var(--space-4)' }}>
                🤖 AI-Personalized
              </div>
            </div>

            {assessment?.skills && assessment.skills.length > 0 && (
              <div style={{ marginBottom: 'var(--space-6)' }}>
                <p className="text-xs text-gray-500" style={{ marginBottom: 'var(--space-2)' }}>
                  Focus areas:
                </p>
                <div style={{ display: 'flex', gap: 'var(--space-2)', justifyContent: 'center', flexWrap: 'wrap' }}>
                  {assessment.skills.map((s) => (
                    <span key={s} className="skill-tag">{s}</span>
                  ))}
                </div>
              </div>
            )}

            {assessment?.faqs && assessment.faqs.length > 0 && (
              <div style={{ marginBottom: 'var(--space-8)', textAlign: 'left', background: 'var(--gray-50)', padding: 'var(--space-5)', borderRadius: 'var(--radius-xl)' }}>
                <h3 style={{ fontSize: 'var(--font-size-base)', fontWeight: 700, marginBottom: 'var(--space-4)', color: 'var(--gray-900)' }}>Frequently Asked Questions</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                  {assessment.faqs.map((faq, i) => (
                    <div key={i}>
                      <p style={{ fontWeight: 600, color: 'var(--gray-900)', fontSize: 'var(--font-size-sm)', marginBottom: '8px' }}>Q: {faq.question}</p>
                      <p style={{ color: 'var(--gray-600)', fontSize: 'var(--font-size-sm)', lineHeight: 1.6 }}>A: {faq.answer}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Anti-cheating warning */}
            <div style={{ marginBottom: 'var(--space-8)', textAlign: 'left', background: 'var(--error-50)', padding: 'var(--space-5)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--error-100)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', margin: '0 0 var(--space-3) 0' }}>
                <span style={{ fontSize: '1.25rem' }}>🛑</span>
                <h3 style={{ fontSize: 'var(--font-size-base)', fontWeight: 700, color: 'var(--error-600)', margin: 0 }}>Strict Anti-Cheating & AI Proctoring</h3>
              </div>
              <ul style={{ color: 'var(--error-600)', fontSize: 'var(--font-size-sm)', lineHeight: 1.6, paddingLeft: 'var(--space-4)', display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', margin: 0 }}>
                <li>Your responses are actively evaluated for authenticity by our AI.</li>
                <li>Do <strong>not</strong> copy-paste answers from external sources or ChatGPT.</li>
                <li><strong>Even the slightest detection of cheating will flag your application and can result in a permanent ban from this company.</strong></li>
              </ul>
            </div>

            <button
              className="btn btn-primary btn-lg"
              onClick={() => setStep('upload')}
            >
              Begin Assessment →
            </button>
          </div>
        )}

        {/* Upload Step */}
        {step === 'upload' && (
          <div className="question-card">
            <h2 style={{
              fontSize: 'var(--font-size-xl)',
              fontWeight: 700,
              color: 'var(--gray-900)',
              marginBottom: 'var(--space-2)',
            }}>
              Your Information
            </h2>
            <p className="text-sm text-gray-500" style={{ marginBottom: 'var(--space-6)' }}>
              Upload your resume and our AI will generate personalized questions based on your skills and experience.
            </p>

            {error && (
              <div className="alert alert-error">⚠️ {error}</div>
            )}

            <form onSubmit={handleStartAssessment}>
              <div className="form-group">
                <label className="form-label" htmlFor="candidate-name">Full Name *</label>
                <input
                  id="candidate-name"
                  type="text"
                  className="form-input"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="candidate-email">Email Address *</label>
                <input
                  id="candidate-email"
                  type="email"
                  className="form-input"
                  placeholder="john@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Resume *</label>
                <div
                  className={`file-upload ${resumeFile ? 'active' : ''}`}
                  onClick={() => fileInputRef.current?.click()}
                >
                  {resumeFile ? (
                    <>
                      <div className="file-upload-icon">📄</div>
                      <div className="file-upload-text">{resumeFile.name}</div>
                      <div className="file-upload-hint">Click to change file</div>
                    </>
                  ) : (
                    <>
                      <div className="file-upload-icon">📁</div>
                      <div className="file-upload-text">
                        Drop your resume here or click to browse
                      </div>
                      <div className="file-upload-hint">
                        Supports PDF, DOC, DOCX · Max 10MB
                      </div>
                    </>
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.doc,.docx"
                  style={{ display: 'none' }}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) setResumeFile(file);
                  }}
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary btn-lg w-full"
              >
                Upload & Start Assessment →
              </button>
            </form>
          </div>
        )}

        {/* Analyzing Step */}
        {step === 'analyzing' && (
          <div className="question-card" style={{ textAlign: 'center' }}>
            <div className="spinner" style={{ margin: '0 auto var(--space-6)' }}></div>
            <h2 style={{
              fontSize: 'var(--font-size-xl)',
              fontWeight: 700,
              color: 'var(--gray-900)',
              marginBottom: 'var(--space-3)',
            }}>
              Analyzing Your Resume
            </h2>
            <p className="text-sm text-gray-500">
              Our AI is reading your resume, extracting skills, and generating
              personalized questions. This may take a moment...
            </p>
            <div style={{ marginTop: 'var(--space-6)', display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', alignItems: 'center' }}>
              <div className="badge badge-blue" style={{ animation: 'pulse 1.5s infinite' }}>
                📄 Parsing resume...
              </div>
              <div className="badge badge-violet" style={{ animation: 'pulse 1.5s infinite 0.3s' }}>
                🧠 Extracting skills...
              </div>
              <div className="badge badge-green" style={{ animation: 'pulse 1.5s infinite 0.6s' }}>
                📝 Generating questions...
              </div>
            </div>
          </div>
        )}

        {/* Questions Step */}
        {step === 'questions' && currentQuestion && (
          <>
            {/* Skills detected from resume */}
            {currentIndex === 0 && detectedSkills.length > 0 && (
              <div style={{
                background: 'var(--success-50)',
                border: '1px solid var(--success-100)',
                borderRadius: 'var(--radius-xl)',
                padding: 'var(--space-4)',
                marginBottom: 'var(--space-6)',
                textAlign: 'center',
              }}>
                <p className="text-sm font-semibold" style={{ color: 'var(--success-700)', marginBottom: 'var(--space-2)' }}>
                  ✅ Skills detected from your resume
                </p>
                <div style={{ display: 'flex', gap: 'var(--space-2)', justifyContent: 'center', flexWrap: 'wrap' }}>
                  {detectedSkills.slice(0, 8).map((s) => (
                    <span key={s} className="badge badge-green">{s}</span>
                  ))}
                </div>
              </div>
            )}

            <div className="question-card">
              <div className="question-header">
                <span className="question-number">
                  Question {currentIndex + 1} of {totalQuestions}
                </span>
                <span className="question-category">{currentQuestion.category}</span>
              </div>

              <div className="question-text" style={{ lineHeight: '1.6', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {currentQuestion.question}
                </ReactMarkdown>
              </div>

              <textarea
                className="answer-textarea"
                placeholder="Type your answer here... Be specific and provide examples from your experience when possible."
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                autoFocus
              ></textarea>

              <div className="question-actions">
                <span className="text-xs text-gray-500">
                  {answer.length > 0 ? `${answer.split(' ').filter(Boolean).length} words` : 'Start typing your answer'}
                </span>
                <button
                  className="btn btn-primary"
                  onClick={handleSubmitAnswer}
                  disabled={!answer.trim() || submittingAnswer}
                >
                  {submittingAnswer ? (
                    <>
                      <span className="spinner spinner-sm" style={{ borderTopColor: 'white' }}></span>
                      Evaluating...
                    </>
                  ) : currentIndex === totalQuestions - 1 ? (
                    'Submit & Finish'
                  ) : (
                    'Next Question →'
                  )}
                </button>
              </div>
            </div>
          </>
        )}

        {/* Submitting Step */}
        {step === 'submitting' && (
          <div className="question-card" style={{ textAlign: 'center' }}>
            <div className="spinner" style={{ margin: '0 auto var(--space-6)' }}></div>
            <h2 style={{
              fontSize: 'var(--font-size-xl)',
              fontWeight: 700,
              color: 'var(--gray-900)',
              marginBottom: 'var(--space-3)',
            }}>
              Evaluating Your Responses
            </h2>
            <p className="text-sm text-gray-500">
              Our AI is generating your comprehensive evaluation report.
              This may take a moment...
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
