'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Suspense } from 'react';

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!token) {
      setError('No reset token found in the URL. Please use the link from your email.');
    }
    console.log('DEBUG: Token from URL:', token);
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      return setError('Missing token. Please request a new reset link.');
    }
    if (password !== confirmPassword) {
      return setError('Passwords do not match.');
    }
    if (password.length < 8) {
      return setError('Password must be at least 8 characters long.');
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });

      const data = await res.json();
      if (res.ok) {
        setSuccess(true);
        setTimeout(() => router.push('/login'), 3000);
      } else {
        setError(data.error || 'Something went wrong. Please try again.');
      }
    } catch (err) {
      setError('Failed to reset password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-logo">
            <div className="auth-logo-icon">H</div>
            <span className="auth-logo-text">HireIQ</span>
          </div>
          <h1 className="auth-title">Password Reset!</h1>
          <p className="auth-subtitle">Your password has been successfully reset. Redirecting you to login...</p>
        </div>
        <Link href="/login" className="btn btn-primary w-full btn-lg" style={{ textAlign: 'center' }}>
          Go to Login
        </Link>
      </div>
    );
  }

  return (
    <div className="auth-card">
      <div className="auth-header">
        <div className="auth-logo">
          <div className="auth-logo-icon">H</div>
          <span className="auth-logo-text">HireIQ</span>
        </div>
        <h1 className="auth-title">Reset password</h1>
        <p className="auth-subtitle">Enter your new password below.</p>
      </div>

      {error && (
        <div className="alert alert-error">
          ⚠️ {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label" htmlFor="password">New Password</label>
          <input
            id="password"
            type="password"
            className="form-input"
            placeholder="At least 8 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={!token}
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="confirmPassword">Confirm New Password</label>
          <input
            id="confirmPassword"
            type="password"
            className="form-input"
            placeholder="Repeat new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            disabled={!token}
          />
        </div>

        <button
          type="submit"
          className="btn btn-primary w-full btn-lg"
          disabled={loading || !token}
        >
          {loading ? (
            <>
              <span className="spinner spinner-sm" style={{ borderTopColor: 'white' }}></span>
              Resetting...
            </>
          ) : (
            'Reset Password'
          )}
        </button>
      </form>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="auth-container">
      <Suspense fallback={<div>Loading...</div>}>
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
}
