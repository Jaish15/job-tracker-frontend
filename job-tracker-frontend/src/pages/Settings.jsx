import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme, ACCENT_COLORS } from '../context/ThemeContext';

export function Settings() {
  const { user } = useAuth();
  const { darkMode, setDarkMode, accentKey, setAccentKey } = useTheme();
  const [activeTab, setActiveTab] = useState('general');

  // Local-only settings (notifications, language, etc.)
  const [settings, setSettings] = useState({
    emailAlerts: true,
    pushAlerts: false,
    language: 'English (US)',
    timezone: 'UTC -08:00 Pacific Time',
    visibility: 'public',
  });

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const toggleSetting = (key) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setMessage('Settings saved successfully!');
      setTimeout(() => setMessage(''), 3000);
    }, 800);
  };

  return (
    <div className="page" style={{ maxWidth: '960px', margin: '0 auto' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem', color: 'var(--text)' }}>Settings</h1>
        <p style={{ color: 'var(--text-2)', fontSize: '0.95rem' }}>Manage your application preferences and security settings.</p>
      </div>

      <div style={{ display: 'flex', gap: '2rem', minHeight: '600px' }}>
        
        {/* Settings Sidebar */}
        <div style={{ width: '240px', flexShrink: 0 }}>
          <div style={{ background: 'var(--surface)', borderRadius: '20px', padding: '1rem', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}>
            <TabButton active={activeTab === 'general'} onClick={() => setActiveTab('general')} icon="⚙️" label="General" />
            <TabButton active={activeTab === 'appearance'} onClick={() => setActiveTab('appearance')} icon="🎨" label="Appearance" />
            <TabButton active={activeTab === 'notifications'} onClick={() => setActiveTab('notifications')} icon="🔔" label="Notifications" />
            <TabButton active={activeTab === 'privacy'} onClick={() => setActiveTab('privacy')} icon="🔒" label="Privacy & Security" />
          </div>
        </div>

        {/* Settings Content */}
        <div style={{ flex: 1, background: 'var(--surface)', borderRadius: '20px', border: '1px solid var(--border)', padding: '2.5rem', boxShadow: 'var(--shadow)' }}>
          
          {message && (
            <div style={{ background: '#ecfdf5', color: '#065f46', padding: '1rem', borderRadius: '12px', marginBottom: '2rem', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span>✓</span> {message}
            </div>
          )}

          {activeTab === 'general' && (
            <div className="settings-section animate-fade-in">
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.75rem', color: 'var(--text)' }}>General Settings</h2>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <SelectField label="Language" value={settings.language} onChange={(v) => setSettings({...settings, language: v})} options={['English (US)', 'English (UK)', 'Spanish', 'French', 'German']} />
                <SelectField label="Timezone" value={settings.timezone} onChange={(v) => setSettings({...settings, timezone: v})} options={['UTC -08:00 Pacific Time', 'UTC -05:00 Eastern Time', 'UTC +00:00 GMT', 'UTC +01:00 CET', 'UTC +05:30 IST']} />
                
                <div style={{ marginTop: '1rem' }}>
                  <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-2)', marginBottom: '0.5rem' }}>Date Format</label>
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <RadioBtn name="dateFmt" label="MM/DD/YYYY" defaultChecked />
                    <RadioBtn name="dateFmt" label="DD/MM/YYYY" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'appearance' && (
            <div className="settings-section animate-fade-in">
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.75rem', color: 'var(--text)' }}>Appearance</h2>
              
              <ToggleRow 
                icon="🌙"
                title="Dark Mode" 
                desc="Switch the application to a darker color scheme."
                checked={darkMode}
                onChange={() => setDarkMode(prev => !prev)}
              />
              
              <div style={{ marginTop: '2.5rem' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem', color: 'var(--text)' }}>Accent Color</h3>
                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                  {Object.entries(ACCENT_COLORS).map(([key, color]) => (
                    <button
                      key={key}
                      onClick={() => setAccentKey(key)}
                      title={color.label}
                      style={{
                        width: '36px', height: '36px', borderRadius: '50%',
                        background: color.hex, cursor: 'pointer',
                        border: accentKey === key ? '3px solid #111' : '2px solid transparent',
                        outline: accentKey === key ? `2px solid ${color.hex}` : 'none',
                        outlineOffset: '2px',
                        transition: 'all 0.15s',
                        transform: accentKey === key ? 'scale(1.15)' : 'scale(1)',
                      }}
                    />
                  ))}
                </div>
                <p style={{ marginTop: '0.6rem', fontSize: '0.78rem', color: 'var(--text-3)' }}>
                  Selected: <strong style={{ color: 'var(--text-2)' }}>{ACCENT_COLORS[accentKey]?.label}</strong>
                </p>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="settings-section animate-fade-in">
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.75rem', color: 'var(--text)' }}>Notifications</h2>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <ToggleRow 
                  title="Email Alerts" 
                  desc="Receive emails when your job application statuses change."
                  checked={settings.emailAlerts}
                  onChange={() => toggleSetting('emailAlerts')}
                />
                <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '0.5rem 0' }} />
                <ToggleRow 
                  title="Push Notifications" 
                  desc="Get notified instantly in your browser."
                  checked={settings.pushAlerts}
                  onChange={() => toggleSetting('pushAlerts')}
                />
                <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '0.5rem 0' }} />
                <ToggleRow 
                  title="Weekly Digest" 
                  desc="Receive a weekly summary of your application funnel."
                  checked={true}
                  onChange={() => {}}
                />

              </div>
            </div>
          )}

          {activeTab === 'privacy' && (
            <div className="settings-section animate-fade-in">
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.75rem', color: 'var(--text)' }}>Privacy & Security</h2>
              
              <div style={{ marginBottom: '2rem' }}>
                <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-2)', marginBottom: '0.75rem' }}>Profile Visibility</label>
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                  <VisibilityCard active={settings.visibility === 'public'} onClick={() => setSettings({...settings, visibility: 'public'})} icon="🌍" title="Public" desc="Recruiters can find you" />
                  <VisibilityCard active={settings.visibility === 'private'} onClick={() => setSettings({...settings, visibility: 'private'})} icon="🔒" title="Private" desc="Only you can see this" />
                </div>
              </div>

              <div style={{ padding: '1.5rem', background: '#fff1f2', borderRadius: '16px', border: '1px solid #fecdd3' }}>
                <h3 style={{ color: '#be123c', fontSize: '1rem', fontWeight: 700, margin: '0 0 0.5rem' }}>Danger Zone</h3>
                <p style={{ color: '#9f1239', fontSize: '0.85rem', margin: '0 0 1rem' }}>Permanently delete your account and all associated data. This action cannot be undone.</p>
                <button style={{ background: '#e11d48', color: '#fff', border: 'none', padding: '0.6rem 1.25rem', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>
                  Delete Account
                </button>
              </div>
            </div>
          )}

          <div style={{ marginTop: '3rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'flex-end' }}>
            <button 
              onClick={handleSave}
              disabled={saving}
              style={{
                background: 'var(--accent)', color: '#fff', border: 'none', padding: '0.75rem 2rem', 
                borderRadius: '999px', fontSize: '0.9rem', fontWeight: 600, cursor: saving ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s', opacity: saving ? 0.7 : 1, boxShadow: '0 4px 14px var(--accent-glow)'
              }}
            >

              {saving ? 'Saving...' : 'Save Preferences'}
            </button>
          </div>

        </div>
      </div>

      <style>{`
        .animate-fade-in { animation: fadeIn 0.3s ease-out; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        
        .settings-tab {
          width: 100%; display: flex; align-items: center; gap: 0.75rem; padding: 0.875rem 1rem;
          border-radius: 12px; border: none; background: transparent; color: #555;
          font-size: 0.9rem; font-weight: 600; cursor: pointer; transition: all 0.2s; text-align: left;
        }
        .settings-tab { background: transparent; color: var(--text-2); }
        .settings-tab:hover { background: var(--surface-2); color: var(--text); }
        .settings-tab.active { background: var(--accent-soft); color: var(--accent); }
        
        /* Custom Toggle Switch */
        .toggle-switch {
          position: relative; width: 44px; height: 24px; background: var(--border); border-radius: 24px; cursor: pointer; transition: 0.3s;
        }
        .toggle-switch.active { background: var(--accent); }
        .toggle-knob {
          position: absolute; top: 2px; left: 2px; width: 20px; height: 20px; background: #fff; border-radius: 50%; transition: 0.3s;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .toggle-switch.active .toggle-knob { transform: translateX(20px); }
      `}</style>
    </div>
  );
}

// ── UI Helper Components ── //

function TabButton({ active, onClick, icon, label }) {
  return (
    <button className={`settings-tab ${active ? 'active' : ''}`} onClick={onClick}>
      <span style={{ fontSize: '1.1rem' }}>{icon}</span> {label}
    </button>
  );
}

function SelectField({ label, value, onChange, options }) {
  return (
    <div>
      <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-2)', marginBottom: '0.5rem' }}>{label}</label>
      <select 
        value={value} 
        onChange={(e) => onChange(e.target.value)}
        style={{ width: '100%', maxWidth: '400px', padding: '0.75rem 1rem', borderRadius: '12px', border: '1px solid var(--border)', background: 'var(--surface-2)', color: 'var(--text)', fontSize: '0.9rem', outline: 'none', appearance: 'none', cursor: 'pointer' }}
      >
        {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
      </select>
    </div>
  );
}

function RadioBtn({ name, label, defaultChecked }) {
  return (
    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.9rem', color: 'var(--text-2)' }}>
      <input type="radio" name={name} defaultChecked={defaultChecked} style={{ accentColor: 'var(--accent)', width: '16px', height: '16px' }} />
      {label}
    </label>
  );
}

function ToggleRow({ icon, title, desc, checked, onChange }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem 0' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        {icon && <div style={{ fontSize: '1.5rem' }}>{icon}</div>}
        <div>
          <div style={{ fontWeight: 600, color: 'var(--text)', fontSize: '0.95rem' }}>{title}</div>
          <div style={{ color: 'var(--text-3)', fontSize: '0.8rem', marginTop: '0.15rem' }}>{desc}</div>
        </div>
      </div>
      <div className={`toggle-switch ${checked ? 'active' : ''}`} onClick={onChange}>
        <div className="toggle-knob"></div>
      </div>
    </div>
  );
}

function VisibilityCard({ active, onClick, icon, title, desc }) {
  return (
    <div 
      onClick={onClick}
      style={{
        flex: 1, minWidth: '180px', padding: '1.25rem', borderRadius: '16px', cursor: 'pointer', transition: 'all 0.2s',
        border: active ? '2px solid var(--accent)' : '1px solid var(--border)',
        background: active ? 'var(--accent-soft)' : 'var(--surface-2)',
        boxShadow: active ? '0 4px 12px var(--accent-glow)' : 'none'
      }}
    >
      <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{icon}</div>
      <div style={{ fontWeight: 700, color: 'var(--text)', marginBottom: '0.25rem', fontSize: '0.95rem' }}>{title}</div>
      <div style={{ fontSize: '0.8rem', color: 'var(--text-3)' }}>{desc}</div>
    </div>
  );
}
