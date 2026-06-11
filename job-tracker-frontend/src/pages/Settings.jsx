/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme, ACCENT_COLORS } from '../context/ThemeContext';

// ── Expanded Options ── //
const LANGUAGES = [
  'English (US)', 'English (UK)', 'Spanish (Español)', 'French (Français)',
  'German (Deutsch)', 'Portuguese (Português)', 'Japanese (日本語)',
  'Chinese Simplified (中文)', 'Hindi (हिन्दी)', 'Arabic (العربية)',
  'Korean (한국어)',
];

const TIMEZONES = [
  'UTC -12:00 Baker Island',
  'UTC -08:00 Pacific Time (PST)',
  'UTC -07:00 Mountain Time (MST)',
  'UTC -06:00 Central Time (CST)',
  'UTC -05:00 Eastern Time (EST)',
  'UTC -04:00 Atlantic Time (AST)',
  'UTC -03:00 Brazil Time (BRT)',
  'UTC +00:00 GMT / London',
  'UTC +01:00 Central European (CET)',
  'UTC +02:00 Eastern European (EET)',
  'UTC +03:00 Moscow / Riyadh (MSK)',
  'UTC +04:00 Gulf Standard (GST)',
  'UTC +05:00 Pakistan Time (PKT)',
  'UTC +05:30 India Standard (IST)',
  'UTC +05:45 Nepal Time (NPT)',
  'UTC +06:00 Bangladesh (BST)',
  'UTC +07:00 Indochina (ICT)',
  'UTC +08:00 China / Singapore (CST)',
  'UTC +09:00 Japan / Korea (JST)',
  'UTC +10:00 Australia Eastern (AEST)',
  'UTC +12:00 New Zealand (NZST)',
];

const MOCK_SESSIONS = [
  { device: 'Chrome on macOS', location: 'San Francisco, CA', time: 'Active now', current: true },
  { device: 'Safari on iPhone 15', location: 'San Francisco, CA', time: '2 hours ago', current: false },
  { device: 'Firefox on Windows 11', location: 'New York, NY', time: '3 days ago', current: false },
];

export function Settings() {
  const { user } = useAuth();
  const { darkMode, setDarkMode, accentKey, setAccentKey } = useTheme();
  const [activeTab, setActiveTab] = useState('general');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [twoFAEnabled, setTwoFAEnabled] = useState(false);
  const [show2FASetup, setShow2FASetup] = useState(false);
  const [notifTestRunning, setNotifTestRunning] = useState(false);

  // ── Load from localStorage, with full defaults ── //
  const [settings, setSettings] = useState(() => {
    try {
      const saved = localStorage.getItem('app_settings_v2');
      if (saved) return JSON.parse(saved);
    } catch (e) { }
    return {
      language: 'English (US)',
      timezone: 'UTC +05:30 India Standard (IST)',
      dateFormat: 'MM/DD/YYYY',
      emailAlerts: true,
      pushAlerts: false,
      weeklyDigest: true,
      interviewReminders: true,
      applicationUpdates: true,
      visibility: 'public',
    };
  });

  // Persist changes to localStorage on every update
  useEffect(() => {
    localStorage.setItem('app_settings_v2', JSON.stringify(settings));
  }, [settings]);

  const toggle = (key) => setSettings(prev => ({ ...prev, [key]: !prev[key] }));

  // ── Push Notification logic ── //
  const handlePushToggle = async () => {
    if (!settings.pushAlerts) {
      // Requesting permission
      if (!('Notification' in window)) {
        showToast('⚠️ Your browser does not support push notifications.', 'warn');
        return;
      }
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        toggle('pushAlerts');
        new Notification('🔔 JobTracker Notifications Enabled!', {
          body: 'You will now receive real-time alerts for interview updates and application changes.',
          icon: '/favicon.ico',
        });
        showToast('✅ Push notifications enabled! You will now receive real-time alerts.');
      } else {
        showToast('⚠️ Permission denied. Please allow notifications in your browser settings.', 'warn');
      }
    } else {
      toggle('pushAlerts');
      showToast('🔕 Push notifications have been disabled.');
    }
  };

  const handleTestNotification = (type) => {
    if (!('Notification' in window) || Notification.permission !== 'granted') {
      showToast('⚠️ Enable push notifications first to test alerts.', 'warn');
      return;
    }
    setNotifTestRunning(true);
    const messages = {
      interview: { title: '🗓️ Interview Reminder — JobTracker', body: 'You have an interview with Stripe in 30 minutes. Good luck! 🚀' },
      status: { title: '📬 Application Status Update', body: 'Your application at Google changed from "Applied" → "Interview"!' },
      digest: { title: '📊 Weekly Career Digest', body: 'This week: 5 applications sent, 2 interview requests received.' },
    };
    const notif = messages[type] || messages.interview;
    setTimeout(() => {
      new Notification(notif.title, { body: notif.body, icon: '/favicon.ico' });
      setNotifTestRunning(false);
    }, 600);
  };

  // ── 2FA toggle ── //
  const handle2FAToggle = () => {
    if (!twoFAEnabled) {
      setShow2FASetup(true);
    } else {
      setTwoFAEnabled(false);
      setShow2FASetup(false);
      showToast('🔓 Two-factor authentication disabled.');
    }
  };

  const confirm2FA = () => {
    setTwoFAEnabled(true);
    setShow2FASetup(false);
    showToast('🔐 Two-factor authentication successfully activated!');
  };

  const showToast = (msg, type = 'success') => {
    setMessage({ text: msg, type });
    setTimeout(() => setMessage(''), 3500);
  };

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      showToast('✨ All preferences saved successfully.');
    }, 700);
  };

  return (
    <div className="page" style={{ maxWidth: '980px', margin: '0 auto' }}>
      {/* Page Header */}
      <div style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.35rem', color: 'var(--text)', letterSpacing: '-0.02em' }}>Settings</h1>
        <p style={{ color: 'var(--text-2)', fontSize: '0.92rem' }}>Control your workspace, privacy, and notification preferences.</p>
      </div>

      <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start' }}>

        {/* ── Left Sidebar Nav ── */}
        <div style={{ width: '230px', flexShrink: 0, position: 'sticky', top: '1rem' }}>
          <div style={{ background: 'var(--surface)', borderRadius: '20px', padding: '0.85rem', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)', display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
            <TabButton active={activeTab === 'general'} onClick={() => setActiveTab('general')} icon="⚙️" label="General" />
            <TabButton active={activeTab === 'appearance'} onClick={() => setActiveTab('appearance')} icon="🎨" label="Appearance" />
            <TabButton active={activeTab === 'notifications'} onClick={() => setActiveTab('notifications')} icon="🔔" label="Notifications" />
            <TabButton active={activeTab === 'privacy'} onClick={() => setActiveTab('privacy')} icon="🔒" label="Privacy & Security" />
          </div>

          {/* Account Tier Badge */}
          <div style={{
            marginTop: '1.25rem', background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)',
            borderRadius: '18px', padding: '1.1rem 1rem', border: '1px solid #4338ca',
            boxShadow: '0 8px 20px rgba(79, 70, 229, 0.18)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '1.1rem' }}>⚡</span>
              <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#a5b4fc', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Developer Pro</span>
            </div>
            <div style={{ fontSize: '0.72rem', color: '#c7d2fe', lineHeight: 1.5 }}>
              Full access to ATS resume tools, AI assistant, and real-time job insights.
            </div>
            <div style={{ marginTop: '0.65rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#34d399' }} />
              <span style={{ fontSize: '0.68rem', color: '#6ee7b7', fontWeight: 700 }}>Active since May 2026</span>
            </div>
          </div>
        </div>

        {/* ── Main Content Panel ── */}
        <div style={{ flex: 1, background: 'var(--surface)', borderRadius: '24px', border: '1px solid var(--border)', padding: '2.5rem', boxShadow: 'var(--shadow)', minHeight: '560px' }}>

          {/* Toast Message */}
          {message && (
            <div style={{
              background: message.type === 'warn' ? '#fff7ed' : '#ecfdf5',
              color: message.type === 'warn' ? '#92400e' : '#065f46',
              border: `1px solid ${message.type === 'warn' ? '#fed7aa' : '#a7f3d0'}`,
              padding: '0.85rem 1.1rem', borderRadius: '14px', marginBottom: '2rem',
              fontWeight: 600, fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: '0.5rem',
              animation: 'fadeIn 0.3s ease',
            }}>
              {message.text}
            </div>
          )}

          {/* ════ GENERAL TAB ════ */}
          {activeTab === 'general' && (
            <div className="settings-section animate-fade-in">
              <SectionTitle>General Settings</SectionTitle>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

                {/* Language */}
                <SelectField
                  label="🌐 Language"
                  value={settings.language}
                  onChange={v => setSettings({ ...settings, language: v })}
                  options={LANGUAGES}
                />

                {/* Timezone */}
                <SelectField
                  label="🕐 Timezone"
                  value={settings.timezone}
                  onChange={v => setSettings({ ...settings, timezone: v })}
                  options={TIMEZONES}
                />

                {/* Date Format */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-2)', marginBottom: '0.75rem' }}>📅 Date Format</label>
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    {['MM/DD/YYYY', 'DD/MM/YYYY', 'YYYY-MM-DD'].map(fmt => (
                      <label key={fmt} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.88rem', color: 'var(--text-2)', background: settings.dateFormat === fmt ? 'var(--accent-soft)' : 'var(--surface-2)', border: `1.5px solid ${settings.dateFormat === fmt ? 'var(--accent)' : 'var(--border)'}`, borderRadius: '10px', padding: '0.5rem 0.9rem', transition: 'all 0.2s', fontWeight: 600 }}>
                        <input type="radio" name="dateFmt" value={fmt} checked={settings.dateFormat === fmt} onChange={() => setSettings({ ...settings, dateFormat: fmt })} style={{ accentColor: 'var(--accent)', width: '14px', height: '14px' }} />
                        {fmt}
                      </label>
                    ))}
                  </div>
                </div>

                {/* Job Search Status */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-2)', marginBottom: '0.75rem' }}>💼 Job Search Status</label>
                  <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                    {[
                      { val: 'active', label: '🟢 Actively Looking', color: '#d1fae5', border: '#10b981' },
                      { val: 'open', label: '🟡 Open to Offers', color: '#fef3c7', border: '#f59e0b' },
                      { val: 'passive', label: '⚪ Passively Browsing', color: '#f3f4f6', border: '#9ca3af' },
                    ].map(({ val, label, color, border }) => (
                      <button key={val} onClick={() => setSettings({ ...settings, jobStatus: val })}
                        style={{
                          padding: '0.55rem 1rem', borderRadius: '10px', border: `1.5px solid ${settings.jobStatus === val ? border : 'var(--border)'}`,
                          background: settings.jobStatus === val ? color : 'var(--surface-2)', color: 'var(--text)', fontWeight: 700,
                          fontSize: '0.82rem', cursor: 'pointer', transition: 'all 0.2s',
                        }}>
                        {label}
                      </button>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* ════ APPEARANCE TAB ════ */}
          {activeTab === 'appearance' && (
            <div className="settings-section animate-fade-in">
              <SectionTitle>Appearance</SectionTitle>

              <ToggleRow
                icon="🌙"
                title="Dark Mode"
                desc="Switch the application to a darker color scheme."
                checked={darkMode}
                onChange={() => setDarkMode(prev => !prev)}
              />

              <div style={{ marginTop: '2.5rem' }}>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--text)' }}>Accent Color</h3>
                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                  {ACCENT_COLORS && Object.entries(ACCENT_COLORS).map(([key, color]) => (
                    <button
                      key={key}
                      onClick={() => setAccentKey(key)}
                      title={color.label}
                      style={{
                        width: '36px', height: '36px', borderRadius: '50%',
                        background: color.hex, cursor: 'pointer',
                        border: accentKey === key ? '3px solid #111' : '2px solid transparent',
                        outline: accentKey === key ? `2px solid ${color.hex}` : 'none',
                        outlineOffset: '2px', transition: 'all 0.15s',
                        transform: accentKey === key ? 'scale(1.15)' : 'scale(1)',
                      }}
                    />
                  ))}
                </div>
                <p style={{ marginTop: '0.6rem', fontSize: '0.78rem', color: 'var(--text-3)' }}>
                  Selected: <strong style={{ color: 'var(--text-2)' }}>{ACCENT_COLORS && ACCENT_COLORS[accentKey]?.label}</strong>
                </p>
              </div>
            </div>
          )}

          {/* ════ NOTIFICATIONS TAB ════ */}
          {activeTab === 'notifications' && (
            <div className="settings-section animate-fade-in">
              <SectionTitle>Notifications</SectionTitle>

              {/* Main Toggles */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
                <ToggleRow
                  icon="📧"
                  title="Email Alerts"
                  desc="Receive emails when your job application statuses change."
                  checked={settings.emailAlerts}
                  onChange={() => toggle('emailAlerts')}
                />
                <Divider />
                <ToggleRow
                  icon="🔔"
                  title="Push Notifications"
                  desc="Get instant browser alerts for interviews and status changes."
                  checked={settings.pushAlerts}
                  onChange={handlePushToggle}
                  badge={settings.pushAlerts ? 'Active' : null}
                />
                <Divider />
                <ToggleRow
                  icon="📊"
                  title="Weekly Digest"
                  desc="A curated summary of your job funnel delivered every Monday."
                  checked={settings.weeklyDigest}
                  onChange={() => toggle('weeklyDigest')}
                />
                <Divider />
                <ToggleRow
                  icon="🗓️"
                  title="Interview Reminders"
                  desc="Smart reminders 24 hours and 30 minutes before scheduled interviews."
                  checked={settings.interviewReminders}
                  onChange={() => toggle('interviewReminders')}
                />
                <Divider />
                <ToggleRow
                  icon="📬"
                  title="Application Updates"
                  desc="Alerts when employers view or respond to your applications."
                  checked={settings.applicationUpdates}
                  onChange={() => toggle('applicationUpdates')}
                />
              </div>

              {/* Push Notification Simulator */}
              <div style={{
                marginTop: '2rem', background: 'linear-gradient(135deg, #fafafa 0%, #f5f3ff 100%)',
                border: '1.5px solid #ede9fe', borderRadius: '20px', padding: '1.5rem',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '1.2rem' }}>🧪</span>
                  <span style={{ fontSize: '0.92rem', fontWeight: 800, color: '#4f46e5' }}>Notification Simulator</span>
                </div>
                <p style={{ fontSize: '0.78rem', color: '#6b7280', marginBottom: '1.1rem', fontWeight: 600 }}>
                  {settings.pushAlerts
                    ? 'Fire a test notification to preview how alerts appear on your desktop.'
                    : 'Enable push notifications above to use the simulator.'}
                </p>
                <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
                  {[
                    { type: 'interview', label: '🗓️ Interview Reminder' },
                    { type: 'status', label: '📬 Status Update' },
                    { type: 'digest', label: '📊 Weekly Digest' },
                  ].map(({ type, label }) => (
                    <button key={type}
                      disabled={!settings.pushAlerts || notifTestRunning}
                      onClick={() => handleTestNotification(type)}
                      style={{
                        padding: '0.5rem 1rem', borderRadius: '10px', border: '1.5px solid #ede9fe',
                        background: settings.pushAlerts ? '#f5f3ff' : '#f9fafb',
                        color: settings.pushAlerts ? '#6366f1' : '#9ca3af',
                        fontWeight: 700, fontSize: '0.78rem', cursor: settings.pushAlerts ? 'pointer' : 'not-allowed',
                        transition: 'all 0.2s', opacity: settings.pushAlerts ? 1 : 0.5,
                      }}>
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ════ PRIVACY & SECURITY TAB ════ */}
          {activeTab === 'privacy' && (
            <div className="settings-section animate-fade-in">
              <SectionTitle>Privacy & Security</SectionTitle>

              {/* Profile Visibility */}
              <div style={{ marginBottom: '2rem' }}>
                <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-2)', marginBottom: '0.85rem' }}>👁️ Profile Visibility</label>
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                  <VisibilityCard active={settings.visibility === 'public'} onClick={() => setSettings({ ...settings, visibility: 'public' })} icon="🌍" title="Public" desc="Recruiters and employers can discover your profile" />
                  <VisibilityCard active={settings.visibility === 'private'} onClick={() => setSettings({ ...settings, visibility: 'private' })} icon="🔒" title="Private" desc="Only visible to you — hidden from all searches" />
                </div>
              </div>

              <Divider />

              {/* 2FA Toggle */}
              <div style={{ padding: '1.5rem 0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                      <span style={{ fontSize: '1rem' }}>🔐</span>
                      <span style={{ fontWeight: 700, color: 'var(--text)', fontSize: '0.95rem' }}>Two-Factor Authentication</span>
                      {twoFAEnabled && <span style={{ background: '#d1fae5', color: '#065f46', fontSize: '0.65rem', fontWeight: 800, padding: '0.15rem 0.5rem', borderRadius: '999px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Enabled</span>}
                    </div>
                    <div style={{ color: 'var(--text-3)', fontSize: '0.8rem' }}>Add an extra layer of protection to your account via authenticator app.</div>
                  </div>
                  <div className={`toggle-switch ${twoFAEnabled ? 'active' : ''}`} onClick={handle2FAToggle}>
                    <div className="toggle-knob" />
                  </div>
                </div>

                {/* 2FA Setup Panel */}
                {show2FASetup && (
                  <div style={{ marginTop: '1.25rem', background: '#f5f3ff', border: '1.5px solid #ede9fe', borderRadius: '18px', padding: '1.5rem', animation: 'fadeIn 0.3s ease' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                      <div style={{ background: '#4f46e5', borderRadius: '12px', padding: '0.6rem 0.85rem', fontSize: '0.75rem', fontWeight: 800, color: '#fff', letterSpacing: '0.12em', fontFamily: 'monospace' }}>
                        JBTR-2FA-7X9K
                      </div>
                      <div style={{ fontSize: '0.78rem', color: '#6366f1', fontWeight: 600 }}>Scan with Google or Microsoft Authenticator</div>
                    </div>
                    <ol style={{ fontSize: '0.82rem', color: '#374151', lineHeight: 1.6, paddingLeft: '1.2rem', margin: '0 0 1.1rem 0' }}>
                      <li>Open your authenticator app (Google Auth, Authy, etc.)</li>
                      <li>Tap <strong>+</strong> → <strong>Scan a QR code</strong> or enter setup key above</li>
                      <li>Enter the 6-digit code generated by the app</li>
                    </ol>
                    <div style={{ display: 'flex', gap: '0.75rem' }}>
                      <button onClick={confirm2FA} style={{ background: '#4f46e5', color: '#fff', border: 'none', padding: '0.6rem 1.5rem', borderRadius: '10px', fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer' }}>
                        ✅ Confirm & Enable
                      </button>
                      <button onClick={() => setShow2FASetup(false)} style={{ background: 'transparent', color: '#6b7280', border: '1px solid var(--border)', padding: '0.6rem 1.25rem', borderRadius: '10px', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer' }}>
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <Divider />

              {/* Active Sessions */}
              <div style={{ padding: '1.5rem 0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <div>
                    <div style={{ fontWeight: 700, color: 'var(--text)', fontSize: '0.95rem', marginBottom: '0.15rem' }}>🖥️ Active Sessions</div>
                    <div style={{ color: 'var(--text-3)', fontSize: '0.8rem' }}>Devices currently logged into your account.</div>
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                  {MOCK_SESSIONS.map((s, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: s.current ? 'var(--accent-soft)' : 'var(--surface-2)', border: `1.5px solid ${s.current ? 'var(--accent)' : 'var(--border)'}`, borderRadius: '14px', padding: '0.85rem 1rem', transition: 'all 0.2s' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <span style={{ fontSize: '1.25rem' }}>{s.device.includes('iPhone') ? '📱' : s.device.includes('Safari') ? '🌐' : '💻'}</span>
                        <div>
                          <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text)' }}>{s.device}</div>
                          <div style={{ fontSize: '0.72rem', color: 'var(--text-3)', marginTop: '0.1rem' }}>📍 {s.location} · {s.time}</div>
                        </div>
                      </div>
                      {s.current
                        ? <span style={{ fontSize: '0.68rem', fontWeight: 800, color: 'var(--accent)', background: 'var(--accent-soft)', padding: '0.2rem 0.6rem', borderRadius: '999px', textTransform: 'uppercase', letterSpacing: '0.04em', border: '1px solid var(--accent)' }}>This Device</span>
                        : <button onClick={() => showToast(`🔒 Session on ${s.device} has been revoked.`)} style={{ fontSize: '0.72rem', fontWeight: 700, color: '#ef4444', background: '#fff1f2', border: '1px solid #fecdd3', padding: '0.2rem 0.65rem', borderRadius: '8px', cursor: 'pointer' }}>Revoke</button>
                      }
                    </div>
                  ))}
                </div>
              </div>

              <Divider />

              {/* Danger Zone */}
              <div style={{ padding: '1.5rem', background: '#fff1f2', borderRadius: '18px', border: '1.5px solid #fecdd3', marginTop: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                  <span>⚠️</span>
                  <h3 style={{ color: '#be123c', fontSize: '0.92rem', fontWeight: 800, margin: 0 }}>Danger Zone</h3>
                </div>
                <p style={{ color: '#9f1239', fontSize: '0.82rem', margin: '0 0 1rem', lineHeight: 1.5 }}>Permanently delete your account and all associated data. This action is irreversible and cannot be undone.</p>
                <button style={{ background: '#e11d48', color: '#fff', border: 'none', padding: '0.6rem 1.35rem', borderRadius: '10px', fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer', boxShadow: '0 4px 12px rgba(225, 29, 72, 0.25)', transition: 'all 0.2s' }}
                  onMouseEnter={e => e.target.style.transform = 'translateY(-1px)'}
                  onMouseLeave={e => e.target.style.transform = 'translateY(0)'}
                >
                  🗑️ Delete Account
                </button>
              </div>
            </div>
          )}

          {/* Save Button */}
          <div style={{ marginTop: '3rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '1rem' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-3)', fontWeight: 600 }}>Changes are saved to your browser</span>
            <button
              onClick={handleSave}
              disabled={saving}
              style={{
                background: 'var(--accent)', color: '#fff', border: 'none',
                padding: '0.75rem 2.25rem', borderRadius: '999px', fontSize: '0.9rem',
                fontWeight: 700, cursor: saving ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s', opacity: saving ? 0.75 : 1,
                boxShadow: '0 4px 14px var(--accent-glow)',
                letterSpacing: '0.01em',
              }}
              onMouseEnter={e => { if (!saving) e.target.style.transform = 'translateY(-1px)'; }}
              onMouseLeave={e => { e.target.style.transform = 'translateY(0)'; }}
            >
              {saving ? '⏳ Saving...' : '💾 Save Preferences'}
            </button>
          </div>

        </div>
      </div>

      <style>{`
        .animate-fade-in { animation: fadeIn 0.3s ease-out; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        
        .settings-tab {
          width: 100%; display: flex; align-items: center; gap: 0.75rem; padding: 0.8rem 1rem;
          border-radius: 14px; border: none; background: transparent; color: var(--text-2);
          font-size: 0.875rem; font-weight: 600; cursor: pointer; transition: all 0.2s; text-align: left;
        }
        .settings-tab:hover { background: var(--surface-2); color: var(--text); }
        .settings-tab.active { background: var(--accent-soft); color: var(--accent); }

        .toggle-switch {
          position: relative; width: 46px; height: 26px; background: var(--border);
          border-radius: 26px; cursor: pointer; transition: background 0.3s; flex-shrink: 0;
        }
        .toggle-switch.active { background: var(--accent); }
        .toggle-knob {
          position: absolute; top: 3px; left: 3px; width: 20px; height: 20px;
          background: #fff; border-radius: 50%; transition: transform 0.3s;
          box-shadow: 0 2px 4px rgba(0,0,0,0.15);
        }
        .toggle-switch.active .toggle-knob { transform: translateX(20px); }
      `}</style>
    </div>
  );
}

// ── UI Helper Components ── //

function SectionTitle({ children }) {
  return (
    <h2 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '1.75rem', borderBottom: '1.5px solid var(--border)', paddingBottom: '0.85rem', color: 'var(--text)', letterSpacing: '-0.01em' }}>
      {children}
    </h2>
  );
}

function TabButton({ active, onClick, icon, label }) {
  return (
    <button className={`settings-tab ${active ? 'active' : ''}`} onClick={onClick}>
      <span style={{ fontSize: '1.05rem' }}>{icon}</span> {label}
    </button>
  );
}

function Divider() {
  return <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '0.25rem 0' }} />;
}

function SelectField({ label, value, onChange, options }) {
  return (
    <div>
      <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-2)', marginBottom: '0.6rem' }}>{label}</label>
      <div style={{ position: 'relative', maxWidth: '420px' }}>
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={{
            width: '100%', padding: '0.75rem 2.5rem 0.75rem 1rem', borderRadius: '14px',
            border: '1.5px solid var(--border)', background: 'var(--surface-2)', color: 'var(--text)',
            fontSize: '0.9rem', outline: 'none', appearance: 'none', cursor: 'pointer',
            fontWeight: 600, transition: 'border-color 0.2s',
          }}
          onFocus={e => e.target.style.borderColor = 'var(--accent)'}
          onBlur={e => e.target.style.borderColor = 'var(--border)'}
        >
          {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
        </select>
        <span style={{ position: 'absolute', right: '0.85rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--text-3)', fontSize: '0.8rem' }}>▾</span>
      </div>
    </div>
  );
}

function ToggleRow({ icon, title, desc, checked, onChange, badge }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 0', gap: '1rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        {icon && <div style={{ fontSize: '1.4rem', width: '36px', textAlign: 'center' }}>{icon}</div>}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontWeight: 700, color: 'var(--text)', fontSize: '0.92rem' }}>{title}</span>
            {badge && <span style={{ background: '#d1fae5', color: '#065f46', fontSize: '0.62rem', fontWeight: 800, padding: '0.1rem 0.45rem', borderRadius: '999px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{badge}</span>}
          </div>
          <div style={{ color: 'var(--text-3)', fontSize: '0.78rem', marginTop: '0.15rem', lineHeight: 1.4 }}>{desc}</div>
        </div>
      </div>
      <div className={`toggle-switch ${checked ? 'active' : ''}`} onClick={onChange}>
        <div className="toggle-knob" />
      </div>
    </div>
  );
}

function VisibilityCard({ active, onClick, icon, title, desc }) {
  return (
    <div
      onClick={onClick}
      style={{
        flex: 1, minWidth: '180px', padding: '1.35rem', borderRadius: '18px', cursor: 'pointer', transition: 'all 0.2s',
        border: active ? '2px solid var(--accent)' : '1.5px solid var(--border)',
        background: active ? 'var(--accent-soft)' : 'var(--surface-2)',
        boxShadow: active ? '0 4px 16px var(--accent-glow)' : 'none',
        transform: active ? 'translateY(-2px)' : 'none',
      }}
    >
      <div style={{ fontSize: '1.75rem', marginBottom: '0.6rem' }}>{icon}</div>
      <div style={{ fontWeight: 800, color: 'var(--text)', marginBottom: '0.3rem', fontSize: '0.95rem' }}>{title}</div>
      <div style={{ fontSize: '0.78rem', color: 'var(--text-3)', lineHeight: 1.4 }}>{desc}</div>
    </div>
  );
}
