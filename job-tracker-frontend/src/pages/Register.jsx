/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable no-unused-vars */
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function Register() {
  const { register, loading } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => { setForm({ ...form, [e.target.name]: e.target.value }); setError(''); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) { setError('Passwords do not match'); return; }
    if (form.password.length < 6) { setError('Password must be at least 6 characters'); return; }
    const { confirmPassword, ...data } = form;
    const result = await register(data);
    if (result.success) navigate('/dashboard');
    else setError(result.message);
  };

  return (
    <div className="lv-page">
      <div className="lv-reg-card">
        <h1 className="lv-reg-title">Create account</h1>
        <p className="lv-reg-sub">Start tracking your job search today. It&apos;s free.</p>

        {error && <div className="lv-alert">{error}</div>}

        <form onSubmit={handleSubmit} noValidate className="lv-reg-form">
          <div className="lv-reg-row">
            <div className="lv-field">
              <input id="reg-fn" name="firstName" type="text" required value={form.firstName} onChange={handleChange} placeholder="First name" className="lv-input"/>
            </div>
            <div className="lv-field">
              <input id="reg-ln" name="lastName" type="text" required value={form.lastName} onChange={handleChange} placeholder="Last name" className="lv-input"/>
            </div>
          </div>

          <div className="lv-field">
            <input id="reg-email" name="email" type="email" autoComplete="email" required value={form.email} onChange={handleChange} placeholder="Email address" className="lv-input"/>
          </div>

          <div className="lv-field">
            <div className="lv-pw-wrap">
              <input id="reg-pw" name="password" type={showPassword ? 'text' : 'password'} required value={form.password} onChange={handleChange} placeholder="Password (Min. 6 characters)" className="lv-input"/>
              <button type="button" className="lv-eye-btn" onClick={() => setShowPassword(!showPassword)} aria-label="Toggle">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  {showPassword ? <><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></> : <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></>}
                </svg>
              </button>
            </div>
          </div>

          <div className="lv-field">
            <input id="reg-cpw" name="confirmPassword" type="password" required value={form.confirmPassword} onChange={handleChange} placeholder="Confirm password" className="lv-input"/>
          </div>

          <button type="submit" className="lv-reg-submit" disabled={loading}>
            {loading ? <span className="lv-spinner"/> : 'Create account'}
          </button>
          
          <div className="si-social-divider" style={{ marginTop: '1.5rem', marginBottom: '1.5rem' }}>or register with</div>

          <div className="si-social-row" style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <button type="button" onClick={() => window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`} className="si-social-btn" aria-label="Google" style={{ padding: '0.75rem 2rem', borderRadius: '12px', border: '1px solid #e5e7eb', background: '#fff', cursor: 'pointer' }}>
              <svg width="20" height="20" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
            </button>
            <button type="button" onClick={() => window.location.href = `${import.meta.env.VITE_API_URL}/auth/apple`} className="si-social-btn" aria-label="Apple" style={{ padding: '0.75rem 2rem', borderRadius: '12px', border: '1px solid #e5e7eb', background: '#fff', cursor: 'pointer' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M15.42 1.34c-1.12.06-2.6.74-3.4 1.54-.7.7-1.3 1.94-1.16 3.08 1.25.1 2.64-.62 3.42-1.4.75-.76 1.35-1.97 1.14-3.22zM17.06 6.8c-1.3-.08-2.6.76-3.36.76-.74 0-1.84-.7-2.94-.68-1.42.02-2.76.82-3.48 2.08-1.5 2.58-.38 6.38 1.08 8.48.72 1.04 1.56 2.18 2.72 2.14 1.1-.04 1.54-.72 2.88-.72 1.34 0 1.74.72 2.9.7 1.2-.02 1.92-1.04 2.62-2.08.82-1.18 1.16-2.32 1.18-2.38-.02-.02-2.22-.86-2.26-3.4-.04-2.12 1.74-3.14 1.8-3.18-1-1.46-2.56-1.64-3.14-1.72z"/></svg>
            </button>
            <button type="button" onClick={() => window.location.href = `${import.meta.env.VITE_API_URL}/auth/facebook`} className="si-social-btn" aria-label="Facebook" style={{ padding: '0.75rem 2rem', borderRadius: '12px', border: '1px solid #e5e7eb', background: '#fff', cursor: 'pointer' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.04c-5.5 0-10 4.48-10 10.02 0 5 3.66 9.15 8.44 9.9v-7H7.9v-2.9h2.54V9.85c0-2.5 1.48-3.89 3.77-3.89 1.1 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56v1.88h2.78l-.45 2.9h-2.33v7a10 10 0 0 0 8.44-9.9c0-5.54-4.5-10.02-10-10.02z"/></svg>
            </button>
          </div>
        </form>

        <p className="lv-reg-switch">
          Already have an account?{' '}
          <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
