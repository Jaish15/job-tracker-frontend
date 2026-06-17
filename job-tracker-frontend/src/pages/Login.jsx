import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { API_BASE_URL } from '../api/axios';

export function Login() {
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await login(form.email, form.password);
    if (result.success) navigate('/dashboard');
    else setError(result.message);
  };

  return (
    <div className="si-page">
      <div className="si-card">

        {/* ── Left: Form ── */}
        <div className="si-left">
          <h1 className="si-title">Welcome back!</h1>
          <p className="si-subtitle">
            Simplify your workflow and boost your productivity<br/>
            with JobTracker. Get started for free.
          </p>

          {error && <div className="si-alert">{error}</div>}

          <form onSubmit={handleSubmit} noValidate className="si-form">
            <div className="si-field">
              <input
                id="si-email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={form.email}
                onChange={handleChange}
                placeholder="Username or Email"
                className="si-input"
              />
            </div>

            <div className="si-field">
              <div className="si-pw-wrap">
                <input
                  id="si-password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Password"
                  className="si-input"
                />
                <button
                  type="button"
                  className="si-eye"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label="Toggle password"
                >
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

            <Link to="/forgot-password" className="si-forgot-pw">Forgot Password?</Link>

            <button type="submit" className="si-btn-signin" disabled={loading}>
              {loading ? <span className="si-spinner" /> : 'Login'}
            </button>

            <div className="si-social-divider">or continue with</div>

            <div className="si-social-row">
              <button type="button" onClick={() => window.location.href = `${API_BASE_URL}/auth/google`} className="si-social-btn" aria-label="Google" style={{ transition: 'transform 0.2s' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12.24 10.285V13.4h6.887c-.275 1.565-1.88 4.604-6.887 4.604-4.33 0-7.859-3.578-7.859-8s3.53-8 7.86-8c2.46 0 4.105 1.025 5.047 1.926l2.427-2.334C17.955 2.192 15.34 1 12.24 1 6.033 1 1 6.033 1 12.24s5.033 11.24 11.24 11.24c6.478 0 10.793-4.537 10.793-10.978 0-.74-.08-1.3-.176-1.852H12.24z"/>
                </svg>
              </button>
              <button type="button" onClick={() => window.location.href = `${API_BASE_URL}/auth/github`} className="si-social-btn" aria-label="GitHub" style={{ transition: 'transform 0.2s' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.577.688.479C19.138 20.164 22 16.418 22 12c0-5.523-4.477-10-10-10z"/>
                </svg>
              </button>
            </div>

            <p className="si-reg-switch">
              Not a member? <Link to="/register">Register now</Link>
            </p>
          </form>
        </div>

        {/* ── Right: Illustration Panel ── */}
        <div className="si-right">
          <div className="si-illustration" style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <img 
              src="/login_art.png" 
              alt="Professional Abstract UI" 
              style={{ width: '100%', maxWidth: '400px', borderRadius: '24px', boxShadow: '0 20px 40px rgba(0,0,0,0.08)' }} 
            />
          </div>

          <h2 className="si-promo-text">
            Make your work easier and organized<br/>
            with JobTracker
          </h2>
        </div>
        
      </div>
    </div>
  );
}
