import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

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
              <button type="button" className="si-social-btn" aria-label="Google">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"/></svg>
              </button>
              <button type="button" className="si-social-btn" aria-label="Apple">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M15.42 1.34c-1.12.06-2.6.74-3.4 1.54-.7.7-1.3 1.94-1.16 3.08 1.25.1 2.64-.62 3.42-1.4.75-.76 1.35-1.97 1.14-3.22zM17.06 6.8c-1.3-.08-2.6.76-3.36.76-.74 0-1.84-.7-2.94-.68-1.42.02-2.76.82-3.48 2.08-1.5 2.58-.38 6.38 1.08 8.48.72 1.04 1.56 2.18 2.72 2.14 1.1-.04 1.54-.72 2.88-.72 1.34 0 1.74.72 2.9.7 1.2-.02 1.92-1.04 2.62-2.08.82-1.18 1.16-2.32 1.18-2.38-.02-.02-2.22-.86-2.26-3.4-.04-2.12 1.74-3.14 1.8-3.18-1-1.46-2.56-1.64-3.14-1.72z"/></svg>
              </button>
              <button type="button" className="si-social-btn" aria-label="Facebook">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.04c-5.5 0-10 4.48-10 10.02 0 5 3.66 9.15 8.44 9.9v-7H7.9v-2.9h2.54V9.85c0-2.5 1.48-3.89 3.77-3.89 1.1 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56v1.88h2.78l-.45 2.9h-2.33v7a10 10 0 0 0 8.44-9.9c0-5.54-4.5-10.02-10-10.02z"/></svg>
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
