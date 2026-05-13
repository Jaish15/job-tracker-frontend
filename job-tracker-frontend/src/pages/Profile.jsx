import { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { usersApi } from '../api/users';

export function Profile() {
  const { user } = useAuth();
  
  // Standard profile state
  const [form, setForm] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    headline: 'Senior Software Engineer at JobTracker',
    location: 'San Francisco, CA',
    phone: '+1 (555) 123-4567',
    portfolio: 'https://johndoe.dev'
  });
  
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  
  const fileInputRef = useRef(null);
  const [avatar, setAvatar] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
    setMessage('');
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Simulate reading a file for immediate preview
      const reader = new FileReader();
      reader.onload = (evt) => {
        setAvatar(evt.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Simulate real update - keeping the original API call if backend supports it
      await usersApi.update(user.id, {
        firstName: form.firstName,
        lastName: form.lastName,
      });
      setMessage('Profile details updated successfully.');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const initials = `${user?.firstName?.[0] || 'U'}${user?.lastName?.[0] || ''}`;

  return (
    <div className="page" style={{ maxWidth: '1000px', margin: '0 auto', paddingBottom: '3rem' }}>
      
      {/* ── Header / Banner ── */}
      <div style={{ position: 'relative', marginBottom: '4rem' }}>
        <div style={{ height: '220px', background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)', borderRadius: '24px', position: 'relative', overflow: 'hidden' }}>
          {/* Decorative shapes in banner */}
          <div style={{ position: 'absolute', top: '-50px', right: '10%', width: '200px', height: '200px', background: 'rgba(255,255,255,0.1)', borderRadius: '50%' }}></div>
          <div style={{ position: 'absolute', bottom: '-80px', left: '20%', width: '150px', height: '150px', background: 'rgba(255,255,255,0.05)', borderRadius: '50%' }}></div>
          
          <button style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(4px)', border: '1px solid rgba(255,255,255,0.3)', color: '#fff', padding: '0.5rem 1rem', borderRadius: '999px', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span>📷</span> Edit Cover
          </button>
        </div>

        {/* Avatar Container */}
        <div style={{ position: 'absolute', bottom: '-40px', left: '3rem', display: 'flex', alignItems: 'flex-end', gap: '1.5rem' }}>
          <div style={{ position: 'relative', cursor: 'pointer' }} onClick={handleAvatarClick}>
            <div style={{ 
              width: '120px', height: '120px', borderRadius: '50%', background: '#fff', border: '4px solid #f8fafc',
              boxShadow: '0 8px 24px rgba(0,0,0,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '2.5rem', fontWeight: 800, color: '#6366f1', overflow: 'hidden', position: 'relative'
            }}>
              {avatar ? <img src={avatar} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : initials}
              
              {/* Hover overlay for avatar */}
              <div className="avatar-overlay" style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0, transition: '0.2s' }}>
                <span style={{ color: '#fff', fontSize: '1.5rem' }}>📷</span>
              </div>
            </div>
            {/* Status dot */}
            <div style={{ position: 'absolute', bottom: '8px', right: '8px', width: '20px', height: '20px', background: '#10b981', borderRadius: '50%', border: '3px solid #fff' }}></div>
            
            <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" style={{ display: 'none' }} />
          </div>
          
          <div style={{ paddingBottom: '0.5rem' }}>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#111', margin: 0 }}>{user?.firstName} {user?.lastName}</h1>
            <p style={{ color: '#666', fontSize: '0.95rem', margin: '0.2rem 0 0' }}>{form.headline}</p>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '2rem' }}>
        
        {/* ── Left Column: Edit Form ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          <div className="prof-card">
            <h2 className="prof-card-title">Personal Information</h2>
            
            {message && <div style={{ background: '#ecfdf5', color: '#065f46', padding: '1rem', borderRadius: '12px', marginBottom: '1.5rem', fontWeight: 500, fontSize: '0.9rem' }}>{message}</div>}
            {error && <div style={{ background: '#fef2f2', color: '#991b1b', padding: '1rem', borderRadius: '12px', marginBottom: '1.5rem', fontWeight: 500, fontSize: '0.9rem' }}>{error}</div>}

            <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <InputGroup label="First Name" name="firstName" value={form.firstName} onChange={handleChange} />
                <InputGroup label="Last Name" name="lastName" value={form.lastName} onChange={handleChange} />
              </div>
              
              <InputGroup label="Professional Headline" name="headline" value={form.headline} onChange={handleChange} placeholder="e.g. Senior Frontend Developer" />
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <InputGroup label="Location" name="location" value={form.location} onChange={handleChange} />
                <InputGroup label="Phone Number" name="phone" value={form.phone} onChange={handleChange} type="tel" />
              </div>

              <InputGroup label="Portfolio / Website URL" name="portfolio" value={form.portfolio} onChange={handleChange} type="url" />

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
                <button type="submit" disabled={loading} style={{
                  background: '#111', color: '#fff', border: 'none', padding: '0.75rem 2.5rem', borderRadius: '999px',
                  fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1, transition: '0.2s',
                  boxShadow: '0 4px 14px rgba(0,0,0,0.15)'
                }}>
                  {loading ? 'Saving...' : 'Save Profile'}
                </button>
              </div>
            </form>
          </div>

        </div>

        {/* ── Right Column: Sidebar Info ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Account Status Card */}
          <div className="prof-card">
            <h2 className="prof-card-title">Account Details</h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <InfoRow label="Email Address" value={user?.email || 'N/A'} icon="✉️" />
              <InfoRow label="Account Role" value={<span style={{ textTransform: 'capitalize', background: '#eef2ff', color: '#4f46e5', padding: '0.2rem 0.6rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 700 }}>{user?.role}</span>} icon="🛡️" />
              <InfoRow label="Member Since" value="May 2026" icon="📅" />
            </div>

            <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid #eaeaea' }}>
              <p style={{ fontSize: '0.8rem', color: '#666', lineHeight: 1.5, margin: '0 0 1rem' }}>
                Looking to change your password or update your notification preferences?
              </p>
              <a href="/settings" style={{ display: 'inline-block', color: '#6366f1', textDecoration: 'none', fontSize: '0.85rem', fontWeight: 600 }}>
                Go to Settings →
              </a>
            </div>
          </div>

          {/* Quick Stats Card */}
          <div className="prof-card" style={{ background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)', border: 'none' }}>
            <h2 className="prof-card-title">Profile Strength</h2>
            
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#111' }}>Intermediate</span>
              <span style={{ fontSize: '0.9rem', fontWeight: 800, color: '#10b981' }}>75%</span>
            </div>
            
            <div style={{ height: '8px', background: '#e2e8f0', borderRadius: '999px', overflow: 'hidden', marginBottom: '1rem' }}>
              <div style={{ height: '100%', width: '75%', background: '#10b981', borderRadius: '999px' }}></div>
            </div>
            
            <p style={{ fontSize: '0.8rem', color: '#64748b', margin: 0 }}>
              Add a resume and your employment history to reach 100%.
            </p>
          </div>

        </div>

      </div>

      {/* Global CSS overrides for the avatar hover */}
      <style>{`
        .prof-card {
          background: #fff;
          border-radius: 20px;
          padding: 2rem;
          border: 1px solid #eaeaea;
          box-shadow: 0 4px 24px rgba(0,0,0,0.02);
        }
        .prof-card-title {
          font-size: 1.15rem;
          font-weight: 700;
          color: #111;
          margin: 0 0 1.5rem 0;
          border-bottom: 1px solid #eaeaea;
          padding-bottom: 0.75rem;
        }
        .avatar-overlay:hover { opacity: 1 !important; }
      `}</style>

    </div>
  );
}

// ── UI Helpers ── //

function InputGroup({ label, name, value, onChange, type = "text", placeholder }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#333' }}>{label}</label>
      <input 
        name={name} 
        type={type} 
        value={value} 
        onChange={onChange}
        placeholder={placeholder}
        style={{ 
          padding: '0.75rem 1rem', borderRadius: '12px', border: '1px solid #e2e8f0', 
          outline: 'none', background: '#fff', fontSize: '0.95rem', color: '#111',
          transition: 'all 0.2s', boxShadow: '0 1px 2px rgba(0,0,0,0.02)'
        }} 
        onFocus={(e) => { e.target.style.borderColor = '#6366f1'; e.target.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.1)'; }}
        onBlur={(e) => { e.target.style.borderColor = '#e2e8f0'; e.target.style.boxShadow = '0 1px 2px rgba(0,0,0,0.02)'; }}
      />
    </div>
  );
}

function InfoRow({ label, value, icon }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
      <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', flexShrink: 0 }}>
        {icon}
      </div>
      <div>
        <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{label}</div>
        <div style={{ fontSize: '0.9rem', fontWeight: 500, color: '#1e293b', marginTop: '0.1rem' }}>{value}</div>
      </div>
    </div>
  );
}
