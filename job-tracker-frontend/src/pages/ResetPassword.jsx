import { useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { RENDER_API_URL } from '../api/axios';

const renderApi = axios.create({
  baseURL: RENDER_API_URL,
  headers: { 'Content-Type': 'application/json' },
});

export function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  if (!token) {
    return (
      <div className="si-page">
        <div className="si-card" style={{ maxWidth: '480px', margin: '0 auto' }}>
          <div className="si-left" style={{ textAlign: 'center', padding: '3rem 2rem' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚠️</div>
            <h1 className="si-title">Invalid Link</h1>
            <p className="si-subtitle">
              This reset link is invalid or has already been used.
            </p>
            <Link to="/forgot-password" className="si-btn-signin" style={{ display: 'inline-block', marginTop: '1.5rem', textDecoration: 'none', padding: '0.75rem 2rem' }}>
              Request New Link
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await renderApi.post('/auth/confirm-reset', { token, newPassword });
      setSuccess(true);
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password. The link may have expired.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="si-page">
      <div className="si-card">

        {/* ── Left: Form ── */}
        <div className="si-left">
          <Link to="/login" className="si-back-link">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
            </svg>
            Back to login
          </Link>

          {!success ? (
            <>
              <h1 className="si-title" style={{ marginTop: '1.5rem' }}>Set New Password</h1>
              <p className="si-subtitle">
                Create a strong new password for your JobTracker account.
              </p>

              {error && <div className="si-alert">{error}</div>}

              <form onSubmit={handleSubmit} noValidate className="si-form" style={{ marginTop: '2rem' }}>
                <div className="si-field">
                  <div className="si-pw-wrap">
                    <input
                      id="rp-new-password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="new-password"
                      required
                      value={newPassword}
                      onChange={(e) => { setNewPassword(e.target.value); setError(''); }}
                      placeholder="New password (min. 6 characters)"
                      className="si-input"
                    />
                    <button type="button" className="si-eye" onClick={() => setShowPassword(!showPassword)} aria-label="Toggle password">
                      {showPassword ? (
                        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                          <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                          <line x1="1" y1="1" x2="23" y2="23"/>
                        </svg>
                      ) : (
                        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                <div className="si-field" style={{ marginTop: '1rem' }}>
                  <input
                    id="rp-confirm-password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    required
                    value={confirmPassword}
                    onChange={(e) => { setConfirmPassword(e.target.value); setError(''); }}
                    placeholder="Confirm new password"
                    className="si-input"
                  />
                </div>

                {/* Password strength indicator */}
                {newPassword.length > 0 && (
                  <div style={{ marginTop: '0.75rem' }}>
                    <div style={{ display: 'flex', gap: '4px', marginBottom: '4px' }}>
                      {[1,2,3,4].map(i => (
                        <div key={i} style={{
                          height: '3px', flex: 1, borderRadius: '2px',
                          background: newPassword.length >= i * 3 ?
                            (newPassword.length >= 12 ? '#22c55e' : newPassword.length >= 8 ? '#f59e0b' : '#ef4444') :
                            '#e5e5e5',
                          transition: 'background 0.2s'
                        }}/>
                      ))}
                    </div>
                    <p style={{ fontSize: '0.75rem', color: '#888', margin: 0 }}>
                      {newPassword.length < 6 ? 'Too short' : newPassword.length < 8 ? 'Weak' : newPassword.length < 12 ? 'Good' : 'Strong'}
                    </p>
                  </div>
                )}

                <button type="submit" className="si-btn-signin" disabled={loading} style={{ marginTop: '1.5rem' }}>
                  {loading ? <span className="si-spinner" /> : 'Reset Password'}
                </button>
              </form>
            </>
          ) : (
            /* ── Success State ── */
            <div style={{ marginTop: '2rem' }}>
              <div style={{
                width: '64px', height: '64px', borderRadius: '50%',
                background: '#d1fae5', display: 'flex', alignItems: 'center',
                justifyContent: 'center', fontSize: '1.75rem', marginBottom: '1.5rem'
              }}>
                ✅
              </div>
              <h1 className="si-title">Password Reset!</h1>
              <p className="si-subtitle">
                Your password has been reset successfully. Redirecting you to login in 3 seconds…
              </p>
              <Link to="/login" className="si-btn-signin" style={{ display: 'inline-block', marginTop: '1.5rem', textDecoration: 'none', padding: '0.75rem 2rem' }}>
                Go to Login Now
              </Link>
            </div>
          )}
        </div>

        {/* ── Right: Illustration ── */}
        <div className="si-right">
          <div className="si-illustration" style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <img
              src="/login_art.png"
              alt="Reset Password"
              style={{ width: '100%', maxWidth: '400px', borderRadius: '24px', boxShadow: '0 20px 40px rgba(0,0,0,0.08)' }}
            />
          </div>
          <h2 className="si-promo-text">
            Secure your account and get back<br/>
            to tracking your success
          </h2>
        </div>
      </div>

      <style>{`
        .si-back-link {
          display: inline-flex; align-items: center; gap: 0.4rem;
          color: #555; text-decoration: none; font-size: 0.875rem;
          font-weight: 600; transition: color 0.2s;
        }
        .si-back-link:hover { color: #000; }
      `}</style>
    </div>
  );
}
