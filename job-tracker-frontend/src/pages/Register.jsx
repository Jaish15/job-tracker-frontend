/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { API_BASE_URL } from '../api/axios';

export function Register() {
  const { register, loading } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => { 
    setForm({ ...form, [e.target.name]: e.target.value }); 
    setError(''); 
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.firstName || !form.lastName || !form.email || !form.password) {
      setError('Please fill in all required fields');
      return;
    }
    if (form.password !== form.confirmPassword) { setError('Passwords do not match'); return; }
    if (form.password.length < 6) { setError('Password must be at least 6 characters'); return; }

    setError('');
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

        </form>

        <p className="lv-reg-switch">
          Already have an account?{' '}
          <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
