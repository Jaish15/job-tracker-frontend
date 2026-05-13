import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function ForgotPassword() {
  const { resetPassword, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [previewUrl, setPreviewUrl] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your email address');
      return;
    }

    const result = await resetPassword(email);
    if (result.success) {
      setSent(true);
      setPreviewUrl(result.previewUrl || '');
      setError('');
    } else {
      setError(result.message || 'Failed to send reset link. Please try again.');
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

          {!sent ? (
            <>
              <h1 className="si-title" style={{ marginTop: '1.5rem' }}>Forgot Password?</h1>
              <p className="si-subtitle">
                No worries! Enter your email address and we'll send you instructions to reset your password.
              </p>

              {error && <div className="si-alert">{error}</div>}

              <form onSubmit={handleSubmit} noValidate className="si-form" style={{ marginTop: '2rem' }}>
                <div className="si-field">
                  <input
                    id="fp-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setError(''); }}
                    placeholder="Enter your email address"
                    className="si-input"
                  />
                </div>

                <button type="submit" className="si-btn-signin" disabled={loading} style={{ marginTop: '1rem' }}>
                  {loading ? <span className="si-spinner" /> : 'Send Reset Link'}
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
                ✉️
              </div>

              <h1 className="si-title">Check your inbox!</h1>
              <p className="si-subtitle">
                We sent a password reset link to <strong>{email}</strong>.
              </p>

              {previewUrl && (
                <div style={{
                  marginTop: '2rem', padding: '1.25rem', background: '#fffbeb',
                  border: '1px solid #fde68a', borderRadius: '16px'
                }}>
                  <p style={{ fontSize: '0.85rem', color: '#92400e', fontWeight: 600, marginBottom: '0.75rem' }}>
                    📬 Development Mode: Your email is available to preview here:
                  </p>
                  <a
                    href={previewUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                      background: '#f59e0b', color: '#fff', padding: '0.6rem 1.25rem',
                      borderRadius: '10px', fontWeight: 600, fontSize: '0.875rem',
                      textDecoration: 'none', transition: '0.2s'
                    }}
                  >
                    <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
                    </svg>
                    Open Email Preview
                  </a>
                  <p style={{ fontSize: '0.75rem', color: '#a16207', marginTop: '0.75rem', margin: '0.75rem 0 0' }}>
                    This preview link is only available in development. In production, the email will arrive in your real inbox.
                  </p>
                </div>
              )}

              <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <button
                  onClick={() => { setSent(false); setEmail(''); setPreviewUrl(''); }}
                  style={{
                    background: 'none', border: '1px solid #e5e5e5', color: '#555',
                    padding: '0.6rem 1.25rem', borderRadius: '10px', fontWeight: 600,
                    fontSize: '0.875rem', cursor: 'pointer'
                  }}
                >
                  Try another email
                </button>
                <Link to="/login" className="si-btn-signin" style={{ padding: '0.6rem 1.5rem', textDecoration: 'none', display: 'inline-block', textAlign: 'center' }}>
                  Back to Login
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* ── Right: Illustration Panel ── */}
        <div className="si-right">
          <div className="si-illustration" style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <img
              src="/login_art.png"
              alt="Password Reset Illustration"
              style={{ width: '100%', maxWidth: '400px', borderRadius: '24px', boxShadow: '0 20px 40px rgba(0,0,0,0.08)' }}
            />
          </div>
          <h2 className="si-promo-text">
            Secure your account and get back<br/>
            to tracking your success
          </h2>
        </div>

      </div>

      {/* Quick CSS: add back-link style if missing */}
      <style>{`
        .si-back-link {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          color: #555;
          text-decoration: none;
          font-size: 0.875rem;
          font-weight: 600;
          transition: color 0.2s;
        }
        .si-back-link:hover { color: #000; }
      `}</style>
    </div>
  );
}
