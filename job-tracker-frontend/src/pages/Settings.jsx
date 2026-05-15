import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme, ACCENT_COLORS } from '../context/ThemeContext';

export function Settings() {
  const { user } = useAuth();
  const { darkMode, setDarkMode, accentKey, setAccentKey } = useTheme();
  const [activeTab, setActiveTab] = useState('appearance');

  const [settings, setSettings] = useState({
    emailAlerts: true,
    pushAlerts: false,
    weeklyDigest: true,
    language: 'English (US)',
    timezone: 'UTC +05:30 IST',
    visibility: 'public',
  });

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const toggleSetting = (key) => setSettings(prev => ({ ...prev, [key]: !prev[key] }));

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setMessage('Settings saved!');
      setTimeout(() => setMessage(''), 3000);
    }, 700);
  };

  return (
    <div className="settings-page">
      <div className="settings-header">
        <h1 className="settings-title">Settings</h1>
        <p className="settings-subtitle">Manage your preferences and appearance.</p>
      </div>

      <div className="settings-layout">
        {/* ── Sidebar nav ── */}
        <nav className="settings-nav">
          {[
            { id: 'appearance', icon: '🎨', label: 'Appearance' },
            { id: 'general',    icon: '⚙️', label: 'General' },
            { id: 'notifications', icon: '🔔', label: 'Notifications' },
            { id: 'privacy',    icon: '🔒', label: 'Privacy & Security' },
          ].map(tab => (
            <button
              key={tab.id}
              className={`settings-tab-btn ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span className="stb-icon">{tab.icon}</span>
              <span className="stb-label">{tab.label}</span>
              {activeTab === tab.id && <span className="stb-dot" />}
            </button>
          ))}
        </nav>

        {/* ── Content panel ── */}
        <div className="settings-content">
          {message && (
            <div className="settings-toast">
              <span>✓</span> {message}
            </div>
          )}

          {/* ════ APPEARANCE ════ */}
          {activeTab === 'appearance' && (
            <div className="settings-section fade-in">
              <h2 className="section-title">Appearance</h2>

              {/* Dark Mode */}
              <div className="setting-row">
                <div className="setting-row-info">
                  <div className="setting-row-title">Dark Mode</div>
                  <div className="setting-row-desc">Switch the entire app to a dark color scheme.</div>
                </div>
                <div
                  className={`theme-toggle ${darkMode ? 'on' : ''}`}
                  onClick={() => setDarkMode(prev => !prev)}
                  role="switch"
                  aria-checked={darkMode}
                >
                  <div className="theme-toggle-knob">
                    <span>{darkMode ? '🌙' : '☀️'}</span>
                  </div>
                </div>
              </div>

              {/* Theme preview chips */}
              <div className="setting-row" style={{ alignItems: 'flex-start', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <div className="setting-row-title">Theme Preview</div>
                  <div className="setting-row-desc">See how the theme looks right now.</div>
                </div>
                <div className="theme-preview-chips">
                  <div className="tpc-chip" style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}>
                    <div style={{ width: '100%', height: '8px', background: 'var(--surface)', borderRadius: '4px', marginBottom: '4px' }} />
                    <div style={{ width: '60%', height: '6px', background: 'var(--accent)', borderRadius: '4px', marginBottom: '4px' }} />
                    <div style={{ width: '80%', height: '4px', background: 'var(--border)', borderRadius: '4px' }} />
                    <span className="tpc-label">{darkMode ? 'Dark' : 'Light'}</span>
                  </div>
                </div>
              </div>

              {/* Accent Color */}
              <div className="setting-row" style={{ alignItems: 'flex-start', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <div className="setting-row-title">Accent Color</div>
                  <div className="setting-row-desc">Changes buttons, links, highlights and active states throughout the app.</div>
                </div>
                <div className="accent-grid">
                  {Object.entries(ACCENT_COLORS).map(([key, color]) => (
                    <button
                      key={key}
                      className={`accent-swatch ${accentKey === key ? 'selected' : ''}`}
                      style={{ '--swatch': color.hex, '--swatch-glow': color.glow }}
                      onClick={() => setAccentKey(key)}
                      title={color.label}
                    >
                      <span className="swatch-circle" />
                      <span className="swatch-label">{color.label}</span>
                      {accentKey === key && (
                        <span className="swatch-check">✓</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ════ GENERAL ════ */}
          {activeTab === 'general' && (
            <div className="settings-section fade-in">
              <h2 className="section-title">General</h2>
              <div className="settings-fields">
                <SelectField
                  label="Language"
                  value={settings.language}
                  onChange={v => setSettings({ ...settings, language: v })}
                  options={['English (US)', 'English (UK)', 'Spanish', 'French', 'German']}
                />
                <SelectField
                  label="Timezone"
                  value={settings.timezone}
                  onChange={v => setSettings({ ...settings, timezone: v })}
                  options={['UTC -08:00 Pacific Time', 'UTC -05:00 Eastern Time', 'UTC +00:00 GMT', 'UTC +01:00 CET', 'UTC +05:30 IST']}
                />
                <div className="field-group">
                  <label className="field-label">Date Format</label>
                  <div className="radio-group">
                    <RadioBtn name="dateFmt" label="MM/DD/YYYY" defaultChecked />
                    <RadioBtn name="dateFmt" label="DD/MM/YYYY" />
                    <RadioBtn name="dateFmt" label="YYYY-MM-DD" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ════ NOTIFICATIONS ════ */}
          {activeTab === 'notifications' && (
            <div className="settings-section fade-in">
              <h2 className="section-title">Notifications</h2>
              <div className="toggle-list">
                <ToggleRow title="Email Alerts" desc="Get notified when your job application status changes." checked={settings.emailAlerts} onChange={() => toggleSetting('emailAlerts')} />
                <ToggleRow title="Push Notifications" desc="Receive instant browser notifications." checked={settings.pushAlerts} onChange={() => toggleSetting('pushAlerts')} />
                <ToggleRow title="Weekly Digest" desc="A weekly summary of your application funnel sent every Monday." checked={settings.weeklyDigest} onChange={() => toggleSetting('weeklyDigest')} />
              </div>
            </div>
          )}

          {/* ════ PRIVACY ════ */}
          {activeTab === 'privacy' && (
            <div className="settings-section fade-in">
              <h2 className="section-title">Privacy & Security</h2>

              <div className="field-group" style={{ marginBottom: '2rem' }}>
                <label className="field-label">Profile Visibility</label>
                <div className="vis-cards">
                  <VisibilityCard active={settings.visibility === 'public'} onClick={() => setSettings({ ...settings, visibility: 'public' })} icon="🌍" title="Public" desc="Recruiters can find you" />
                  <VisibilityCard active={settings.visibility === 'private'} onClick={() => setSettings({ ...settings, visibility: 'private' })} icon="🔒" title="Private" desc="Only you can see your profile" />
                </div>
              </div>

              <div className="danger-zone">
                <h3 className="danger-title">⚠️ Danger Zone</h3>
                <p className="danger-desc">Permanently delete your account and all associated data. This cannot be undone.</p>
                <button className="danger-btn">Delete My Account</button>
              </div>
            </div>
          )}

          {/* Save button */}
          <div className="settings-footer">
            <button className="save-btn" onClick={handleSave} disabled={saving}>
              {saving ? <><span className="si-spinner" /> Saving…</> : 'Save Preferences'}
            </button>
          </div>
        </div>
      </div>

      <style>{`
        /* ── Page layout ── */
        .settings-page { max-width: 1000px; margin: 0 auto; }
        .settings-header { margin-bottom: 2rem; }
        .settings-title { font-size: 2rem; font-weight: 800; color: var(--text); }
        .settings-subtitle { color: var(--text-3); margin-top: 0.35rem; font-size: 0.95rem; }

        .settings-layout {
          display: flex;
          gap: 1.75rem;
          align-items: flex-start;
        }

        /* ── Sidebar ── */
        .settings-nav {
          width: 220px;
          flex-shrink: 0;
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 20px;
          padding: 0.75rem;
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }
        .settings-tab-btn {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.8rem 1rem;
          border-radius: 12px;
          border: none;
          background: transparent;
          color: var(--text-2);
          font-size: 0.9rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.18s;
          text-align: left;
          position: relative;
        }
        .settings-tab-btn:hover { background: var(--surface-2); color: var(--text); }
        .settings-tab-btn.active { background: var(--accent-soft); color: var(--accent); }
        .stb-icon { font-size: 1.1rem; }
        .stb-label { flex: 1; }
        .stb-dot {
          width: 6px; height: 6px;
          border-radius: 50%;
          background: var(--accent);
        }

        /* ── Content ── */
        .settings-content {
          flex: 1;
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 20px;
          padding: 2.5rem;
          min-height: 520px;
          display: flex;
          flex-direction: column;
        }

        .settings-toast {
          background: #ecfdf5;
          color: #065f46;
          border: 1px solid #6ee7b7;
          padding: 0.875rem 1.25rem;
          border-radius: 12px;
          margin-bottom: 1.5rem;
          font-weight: 600;
          font-size: 0.9rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          animation: slideDown 0.3s ease;
        }
        @keyframes slideDown { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: translateY(0); } }

        .settings-section { flex: 1; }
        .fade-in { animation: fadeUp 0.25s ease; }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }

        .section-title {
          font-size: 1.2rem;
          font-weight: 800;
          color: var(--text);
          margin-bottom: 1.75rem;
          padding-bottom: 0.875rem;
          border-bottom: 1px solid var(--border);
        }

        /* ── Setting row ── */
        .setting-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1.5rem;
          padding: 1.25rem 0;
          border-bottom: 1px solid var(--border);
        }
        .setting-row:last-of-type { border-bottom: none; }
        .setting-row-title { font-weight: 700; color: var(--text); font-size: 0.95rem; }
        .setting-row-desc  { font-size: 0.82rem; color: var(--text-3); margin-top: 0.2rem; line-height: 1.5; }

        /* ── Theme toggle ── */
        .theme-toggle {
          position: relative;
          width: 60px; height: 32px;
          background: var(--border);
          border-radius: 999px;
          cursor: pointer;
          transition: background 0.3s;
          flex-shrink: 0;
        }
        .theme-toggle.on { background: var(--accent); }
        .theme-toggle-knob {
          position: absolute;
          top: 3px; left: 3px;
          width: 26px; height: 26px;
          background: #fff;
          border-radius: 50%;
          transition: transform 0.3s cubic-bezier(0.34,1.56,0.64,1);
          display: flex; align-items: center; justify-content: center;
          font-size: 0.85rem;
          box-shadow: 0 2px 6px rgba(0,0,0,0.15);
        }
        .theme-toggle.on .theme-toggle-knob { transform: translateX(28px); }

        /* ── Theme preview chips ── */
        .theme-preview-chips { display: flex; gap: 1rem; }
        .tpc-chip {
          width: 100px; padding: 0.75rem;
          border-radius: 12px;
          display: flex; flex-direction: column;
          gap: 2px;
        }
        .tpc-label { font-size: 0.7rem; font-weight: 700; color: var(--text-3); margin-top: 4px; }

        /* ── Accent swatches ── */
        .accent-grid { display: flex; gap: 0.75rem; flex-wrap: wrap; }
        .accent-swatch {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.4rem;
          padding: 0.75rem 1rem;
          border-radius: 14px;
          border: 2px solid transparent;
          background: var(--surface-2);
          cursor: pointer;
          transition: all 0.2s;
          position: relative;
          min-width: 72px;
        }
        .accent-swatch:hover { border-color: var(--swatch); transform: translateY(-2px); }
        .accent-swatch.selected {
          border-color: var(--swatch);
          background: var(--surface);
          box-shadow: 0 4px 16px var(--swatch-glow);
        }
        .swatch-circle {
          width: 28px; height: 28px;
          border-radius: 50%;
          background: var(--swatch);
          display: block;
        }
        .swatch-label { font-size: 0.72rem; font-weight: 700; color: var(--text-2); }
        .swatch-check {
          position: absolute;
          top: 4px; right: 4px;
          background: var(--swatch);
          color: #fff;
          width: 16px; height: 16px;
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-size: 0.6rem; font-weight: 800;
        }

        /* ── Fields ── */
        .settings-fields { display: flex; flex-direction: column; gap: 1.5rem; }
        .field-group { display: flex; flex-direction: column; gap: 0.5rem; }
        .field-label { font-size: 0.88rem; font-weight: 700; color: var(--text-2); }
        .field-select {
          width: 100%; max-width: 380px;
          padding: 0.75rem 1rem;
          border-radius: 12px;
          border: 1.5px solid var(--border);
          background: var(--surface-2);
          color: var(--text);
          font-size: 0.9rem;
          outline: none;
          cursor: pointer;
          transition: border-color 0.18s;
          appearance: none;
        }
        .field-select:focus { border-color: var(--accent); }

        .radio-group { display: flex; gap: 1.25rem; flex-wrap: wrap; }
        .radio-label {
          display: flex; align-items: center; gap: 0.5rem;
          cursor: pointer; font-size: 0.9rem; color: var(--text-2); font-weight: 500;
        }
        .radio-label input { accent-color: var(--accent); width: 16px; height: 16px; }

        /* ── Toggle list ── */
        .toggle-list { display: flex; flex-direction: column; }
        .toggle-row {
          display: flex; align-items: center;
          justify-content: space-between;
          gap: 1.5rem;
          padding: 1.25rem 0;
          border-bottom: 1px solid var(--border);
        }
        .toggle-row:last-child { border-bottom: none; }
        .tr-title { font-weight: 700; color: var(--text); font-size: 0.95rem; }
        .tr-desc  { font-size: 0.82rem; color: var(--text-3); margin-top: 0.2rem; }
        .toggle-switch {
          position: relative; width: 44px; height: 24px;
          background: var(--border); border-radius: 999px;
          cursor: pointer; transition: background 0.3s; flex-shrink: 0;
        }
        .toggle-switch.on { background: var(--accent); }
        .toggle-knob {
          position: absolute; top: 2px; left: 2px;
          width: 20px; height: 20px;
          background: #fff; border-radius: 50%;
          transition: transform 0.25s cubic-bezier(0.34,1.56,0.64,1);
          box-shadow: 0 1px 4px rgba(0,0,0,0.15);
        }
        .toggle-switch.on .toggle-knob { transform: translateX(20px); }

        /* ── Visibility cards ── */
        .vis-cards { display: flex; gap: 1rem; }
        .vis-card {
          flex: 1; min-width: 140px;
          padding: 1.25rem;
          border-radius: 16px;
          border: 2px solid var(--border);
          background: var(--surface-2);
          cursor: pointer; transition: all 0.2s;
        }
        .vis-card.active {
          border-color: var(--accent);
          background: var(--accent-soft);
          box-shadow: 0 4px 16px var(--accent-glow);
        }
        .vis-card-icon { font-size: 1.5rem; margin-bottom: 0.5rem; }
        .vis-card-title { font-weight: 700; color: var(--text); font-size: 0.95rem; }
        .vis-card-desc  { font-size: 0.78rem; color: var(--text-3); margin-top: 0.2rem; }

        /* ── Danger zone ── */
        .danger-zone {
          padding: 1.5rem;
          background: #fff1f2;
          border: 1px solid #fecdd3;
          border-radius: 16px;
        }
        [data-theme="dark"] .danger-zone {
          background: #1a0a0a;
          border-color: #7f1d1d;
        }
        .danger-title { color: #be123c; font-size: 1rem; font-weight: 700; margin-bottom: 0.5rem; }
        .danger-desc  { color: #9f1239; font-size: 0.85rem; margin-bottom: 1rem; line-height: 1.5; }
        [data-theme="dark"] .danger-desc { color: #fca5a5; }
        .danger-btn {
          background: #e11d48; color: #fff;
          border: none; padding: 0.6rem 1.25rem;
          border-radius: 8px; font-weight: 700;
          cursor: pointer; font-size: 0.875rem;
          transition: opacity 0.2s;
        }
        .danger-btn:hover { opacity: 0.85; }

        /* ── Footer ── */
        .settings-footer {
          margin-top: auto;
          padding-top: 1.75rem;
          border-top: 1px solid var(--border);
          display: flex; justify-content: flex-end;
        }
        .save-btn {
          display: inline-flex; align-items: center; gap: 0.5rem;
          background: var(--accent); color: #fff;
          border: none; padding: 0.75rem 2rem;
          border-radius: 999px; font-size: 0.9rem; font-weight: 700;
          cursor: pointer; transition: all 0.2s;
          box-shadow: 0 4px 14px var(--accent-glow);
        }
        .save-btn:hover:not(:disabled) { opacity: 0.88; transform: translateY(-1px); }
        .save-btn:disabled { opacity: 0.6; cursor: not-allowed; }

        @media (max-width: 768px) {
          .settings-layout { flex-direction: column; }
          .settings-nav { width: 100%; flex-direction: row; overflow-x: auto; }
          .settings-tab-btn { white-space: nowrap; flex-shrink: 0; }
        }
      `}</style>
    </div>
  );
}

// ── Sub-components ──

function SelectField({ label, value, onChange, options }) {
  return (
    <div className="field-group">
      <label className="field-label">{label}</label>
      <select className="field-select" value={value} onChange={e => onChange(e.target.value)}>
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}

function RadioBtn({ name, label, defaultChecked }) {
  return (
    <label className="radio-label">
      <input type="radio" name={name} defaultChecked={defaultChecked} />
      {label}
    </label>
  );
}

function ToggleRow({ title, desc, checked, onChange }) {
  return (
    <div className="toggle-row">
      <div>
        <div className="tr-title">{title}</div>
        <div className="tr-desc">{desc}</div>
      </div>
      <div className={`toggle-switch ${checked ? 'on' : ''}`} onClick={onChange}>
        <div className="toggle-knob" />
      </div>
    </div>
  );
}

function VisibilityCard({ active, onClick, icon, title, desc }) {
  return (
    <div className={`vis-card ${active ? 'active' : ''}`} onClick={onClick}>
      <div className="vis-card-icon">{icon}</div>
      <div className="vis-card-title">{title}</div>
      <div className="vis-card-desc">{desc}</div>
    </div>
  );
}
