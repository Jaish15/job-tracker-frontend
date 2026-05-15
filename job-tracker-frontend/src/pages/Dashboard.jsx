import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { jobsApi } from '../api/jobs';
import '../styles/dashboard.css';

const STATUS_CONFIG = {
  wishlist:     { label: 'Wishlist',      icon: '⭐', color: '#7c3aed', bg: '#ede9fe' },
  applied:      { label: 'Applied',       icon: '📤', color: '#1d4ed8', bg: '#dbeafe' },
  phone_screen: { label: 'Phone Screen',  icon: '📞', color: '#d97706', bg: '#fef3c7' },
  interview:    { label: 'Interview',     icon: '🎯', color: '#0891b2', bg: '#e0f2fe' },
  offer:        { label: 'Offer',         icon: '🎉', color: '#059669', bg: '#d1fae5' },
  accepted:     { label: 'Accepted',      icon: '✅', color: '#059669', bg: '#bbf7d0' },
  rejected:     { label: 'Rejected',      icon: '❌', color: '#dc2626', bg: '#fee2e2' },
  withdrawn:    { label: 'Withdrawn',     icon: '⏹️', color: '#4b5563', bg: '#f3f4f6' },
};

function useCountUp(end, duration = 1500) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = null;
    const step = (ts) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      const ease = 1 - Math.pow(1 - p, 4);
      setCount(Math.floor(ease * end));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [end, duration]);
  return count;
}

function ProgressRing({ value, max, size = 120, stroke = 8, color = '#6366f1' }) {
  const r = (size - stroke) / 2;
  const circ = r * 2 * Math.PI;
  const pct = max === 0 ? 0 : value / max;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: 'rotate(-90deg)' }}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth={stroke} />
      <circle
        cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={stroke}
        strokeDasharray={circ} strokeDashoffset={circ - pct * circ} strokeLinecap="round"
        style={{ transition: 'stroke-dashoffset 1.5s cubic-bezier(0.22,1,0.36,1)' }}
      />
    </svg>
  );
}

function StatCard({ icon, value, label, color, bg }) {
  const count = useCountUp(value);
  return (
    <div className="dash2-stat-card" style={{ '--sc': color, '--sc-bg': bg }}>
      <div className="dash2-stat-icon" style={{ color }}>{icon}</div>
      <div className="dash2-stat-body">
        <div className="dash2-stat-value">{count}</div>
        <div className="dash2-stat-label">{label}</div>
      </div>
      <div className="dash2-stat-ring">
        <ProgressRing value={value} max={value * 1.5 || 10} size={40} stroke={4} color={color} />
      </div>
    </div>
  );
}

export function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [recentJobs, setRecentJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const heroRef = useRef(null);

  // Mouse parallax blobs
  useEffect(() => {
    const move = (e) => {
      if (!heroRef.current) return;
      const { left, top, width, height } = heroRef.current.getBoundingClientRect();
      heroRef.current.style.setProperty('--px', `${((e.clientX - left) / width - 0.5) * 40}px`);
      heroRef.current.style.setProperty('--py', `${((e.clientY - top) / height - 0.5) * 40}px`);
    };
    window.addEventListener('mousemove', move);
    return () => window.removeEventListener('mousemove', move);
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const [sRes, jRes] = await Promise.all([jobsApi.getStats(), jobsApi.getAll()]);
        setStats(sRes.data);
        setRecentJobs(jRes.data.slice(0, 5));
      } catch (err) {
        console.error('Dashboard error:', err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return <div className="page-loading"><div className="spinner" /></div>;
  }

  const total    = stats?.total || 0;
  const byStatus = stats?.byStatus || {};
  const active   = (byStatus.applied || 0) + (byStatus.phone_screen || 0) + (byStatus.interview || 0);
  const offers   = (byStatus.offer || 0) + (byStatus.accepted || 0);
  const rejected = byStatus.rejected || 0;
  const successRate = total > 0 ? Math.round((offers / total) * 100) : 0;

  const todayStr = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  const funnelStages = [
    { key: 'wishlist',     label: 'Wishlist',     count: byStatus.wishlist || 0 },
    { key: 'applied',      label: 'Applied',      count: byStatus.applied || 0 },
    { key: 'phone_screen', label: 'Phone Screen', count: byStatus.phone_screen || 0 },
    { key: 'interview',    label: 'Interview',    count: byStatus.interview || 0 },
    { key: 'offer',        label: 'Offer',        count: byStatus.offer || 0 },
  ];
  const maxFunnel = Math.max(...funnelStages.map(s => s.count), 1);

  return (
    <div className="dash2-page">

      {/* ══ HERO ══ */}
      <div className="dash2-hero" ref={heroRef}>
        <div className="dash2-hero-blob dash2-blob1" />
        <div className="dash2-hero-blob dash2-blob2" />
        <div className="dash2-hero-blob dash2-blob3" />
        <div className="dash2-hero-content">
          <div className="dash2-hero-left">
            <div className="dash2-eyebrow">
              <span className="dash2-eyebrow-dot" /> {todayStr}
            </div>
            <h1 className="dash2-hero-title">
              {greeting},<br />
              <span className="dash2-name-gradient">{user?.firstName || 'User'}</span> 👋
            </h1>
            <p className="dash2-hero-sub">
              You have <strong>{active}</strong> active applications in progress.
            </p>
            <div className="dash2-hero-actions">
              <Link to="/jobs/new" className="dash2-cta-primary">+ Add Application</Link>
              <Link to="/jobs" className="dash2-cta-secondary">Browse Live Jobs →</Link>
            </div>
          </div>
          <div className="dash2-hero-right">
            <div className="dash2-success-ring-wrap">
              <div className="dash2-success-ring-inner">
                <ProgressRing value={successRate} max={100} color="#10b981" size={140} stroke={10} />
                <div className="dash2-success-ring-label">
                  <span className="dash2-ring-pct">{successRate}%</span>
                  <span className="dash2-ring-sub">Success Rate</span>
                </div>
              </div>
              <p className="dash2-ring-caption">Offers ÷ Total Applications</p>
            </div>
          </div>
        </div>
      </div>

      {/* ══ QUICK ACTIONS ══ */}
      <div className="dash2-card" style={{ padding: '1.25rem 1.75rem' }}>
        <h2 className="dash2-card-title" style={{ fontSize: '0.92rem', marginBottom: '1rem' }}>⚡ Quick Actions</h2>
        <div className="dash2-quick-actions">
          <Link to="/jobs/new" className="dash2-quick-action-btn"><span className="qa-icon">➕</span> Add Job</Link>
          <Link to="/jobs"     className="dash2-quick-action-btn"><span className="qa-icon">📋</span> All Jobs</Link>
          <Link to="/resume"   className="dash2-quick-action-btn"><span className="qa-icon">📄</span> Resume</Link>
          <Link to="/profile"  className="dash2-quick-action-btn"><span className="qa-icon">👤</span> Profile</Link>
          <Link to="/settings" className="dash2-quick-action-btn"><span className="qa-icon">⚙️</span> Settings</Link>
        </div>
      </div>

      {/* ══ STAT CARDS ══ */}
      <div className="dash2-stats-grid">
        <StatCard icon="📋" value={total}    label="Total"    color="#6366f1" bg="#f5f3ff" />
        <StatCard icon="⚡" value={active}   label="Active"   color="#f59e0b" bg="#fffbeb" />
        <StatCard icon="🎉" value={offers}   label="Offers"   color="#10b981" bg="#ecfdf5" />
        <StatCard icon="❌" value={rejected} label="Rejected" color="#ef4444" bg="#fef2f2" />
      </div>

      {/* ══ MIDDLE ROW ══ */}
      <div className="dash2-mid-row">

        {/* Funnel */}
        <div className="dash2-card">
          <div className="dash2-card-header">
            <div>
              <h2 className="dash2-card-title">Application Funnel</h2>
              <div className="dash2-card-sub">How your pipeline is distributed</div>
            </div>
            <div className="dash2-funnel-total"><span>{total}</span> total</div>
          </div>
          <div className="dash2-funnel-list">
            {funnelStages.map(stage => {
              const w = total === 0 ? '0%' : `${(stage.count / maxFunnel) * 100}%`;
              const cfg = STATUS_CONFIG[stage.key];
              return (
                <div key={stage.key} className="dash2-funnel-row">
                  <div className="dash2-funnel-label">{stage.label}</div>
                  <div className="dash2-funnel-track">
                    <div className="dash2-funnel-fill" style={{ width: w, background: cfg.color }} />
                  </div>
                  <div className="dash2-funnel-count">{stage.count}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* All Statuses */}
        <div className="dash2-card">
          <div className="dash2-card-header">
            <div>
              <h2 className="dash2-card-title">All Statuses</h2>
              <div className="dash2-card-sub">Every stage at a glance</div>
            </div>
          </div>
          <div className="dash2-status-grid">
            {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
              <div key={key} className="dash2-status-pill-card" style={{ '--sp-color': cfg.color, '--sp-bg': cfg.bg }}>
                <div className="dash2-sp-icon">{cfg.icon}</div>
                <div className="dash2-sp-count">{byStatus[key] || 0}</div>
                <div className="dash2-sp-label">{cfg.label}</div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* ══ BOTTOM ROW ══ */}
      <div className="dash2-bottom-row">

        {/* Recent Activity */}
        <div className="dash2-card">
          <div className="dash2-card-header">
            <div>
              <h2 className="dash2-card-title">Recent Activity</h2>
              <div className="dash2-card-sub">Your latest job applications</div>
            </div>
            <Link to="/jobs" className="dash2-view-all">View All</Link>
          </div>
          {recentJobs.length === 0 ? (
            <div className="dash2-empty">
              <div className="dash2-empty-icon">📂</div>
              <div>No applications tracked yet.</div>
              <Link to="/jobs/new" className="dash2-cta-primary" style={{ marginTop: '0.5rem', padding: '0.5rem 1rem' }}>
                Add First Job
              </Link>
            </div>
          ) : (
            <div className="dash2-recent-list">
              {recentJobs.map((job, idx) => {
                const cfg = STATUS_CONFIG[job.status] || STATUS_CONFIG.applied;
                return (
                  <div key={job.id} className="dash2-recent-item" style={{ animationDelay: `${idx * 0.05}s` }}>
                    <div className="dash2-recent-num">{idx + 1}</div>
                    <div className="dash2-recent-info">
                      <div className="dash2-recent-pos">{job.position}</div>
                      <div className="dash2-recent-co">🏢 {job.company}{job.location && ` • 📍 ${job.location}`}</div>
                    </div>
                    <div className="dash2-recent-badge" style={{ background: cfg.bg, color: cfg.color }}>{cfg.label}</div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Side column */}
        <div className="dash2-side-col">

          {/* Weekly Goal */}
          <div className="dash2-card dash2-goal-card">
            <div className="dash2-goal-header">
              <div className="dash2-goal-emoji">🎯</div>
              <div>
                <h3 className="dash2-goal-title">Weekly Goal</h3>
                <div className="dash2-goal-sub">Track 5 new applications</div>
              </div>
            </div>
            <div className="dash2-goal-bar-track">
              <div className="dash2-goal-bar-fill" style={{ width: `${Math.min((total / 5) * 100, 100)}%` }} />
            </div>
            <div className="dash2-goal-note">
              {total >= 5 ? '🌟 Goal reached! Amazing job!' : `${5 - total} more to reach your goal`}
            </div>
          </div>

          {/* Motivational Quote */}
          <div className="dash2-card" style={{ background: 'linear-gradient(135deg, #0f0c29 0%, #1a1040 100%)', border: 'none' }}>
            <div style={{ fontSize: '1.5rem', marginBottom: '0.75rem' }}>💬</div>
            <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '0.9rem', lineHeight: 1.6, fontStyle: 'italic', fontWeight: 500 }}>
              &ldquo;The secret of getting ahead is getting started.&rdquo;
            </p>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem', marginTop: '0.75rem', fontWeight: 600 }}>— Mark Twain</p>
          </div>

          {/* Pro Tips */}
          <div className="dash2-card">
            <div className="dash2-card-header" style={{ marginBottom: '1rem' }}>
              <h2 className="dash2-card-title">Pro Tips</h2>
            </div>
            <div className="dash2-tips-list">
              {[
                { bg: '#e0f2fe', color: '#0284c7', icon: '💡', text: 'Tailor your resume for each role using keywords from the job description.' },
                { bg: '#fce7f3', color: '#db2777', icon: '💬', text: 'Follow up 1 week after applying to show genuine interest.' },
                { bg: '#d1fae5', color: '#059669', icon: '🤝', text: 'Network on LinkedIn — 70% of jobs are filled through connections.' },
              ].map((tip, i) => (
                <div key={i} className="dash2-tip-item">
                  <div className="dash2-tip-icon" style={{ background: tip.bg, color: tip.color }}>{tip.icon}</div>
                  <div className="dash2-tip-text">{tip.text}</div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}