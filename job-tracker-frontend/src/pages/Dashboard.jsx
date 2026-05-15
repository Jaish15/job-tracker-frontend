import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { jobsApi } from '../api/jobs';
import '../styles/dashboard.css';

/* ── Status config ─────────────────────────────────────────── */
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

/* ── Hooks ─────────────────────────────────────────────────── */
function useCountUp(end, duration = 1500) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      // easeOutQuart
      const ease = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(ease * end));
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }, [end, duration]);

  return count;
}

/* ── Components ────────────────────────────────────────────── */
function ProgressRing({ value, max, size = 120, stroke = 8, color = '#6366f1' }) {
  const radius = (size - stroke) / 2;
  const circumference = radius * 2 * Math.PI;
  const pct = max === 0 ? 0 : value / max;
  const strokeDashoffset = circumference - pct * circumference;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: 'rotate(-90deg)' }}>
      <circle
        cx={size/2} cy={size/2} r={radius}
        fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth={stroke}
      />
      <circle
        cx={size/2} cy={size/2} r={radius}
        fill="none" stroke={color} strokeWidth={stroke}
        strokeDasharray={circumference}
        strokeDashoffset={strokeDashoffset}
        strokeLinecap="round"
        style={{ transition: 'stroke-dashoffset 1.5s cubic-bezier(0.22, 1, 0.36, 1)' }}
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

  // Mouse parallax for hero blobs
  const heroRef = useRef(null);
  useEffect(() => {
    const handleMove = (e) => {
      if (!heroRef.current) return;
      const { left, top, width, height } = heroRef.current.getBoundingClientRect();
      const x = (e.clientX - left) / width - 0.5;
      const y = (e.clientY - top) / height - 0.5;
      heroRef.current.style.setProperty('--px', `${x * 40}px`);
      heroRef.current.style.setProperty('--py', `${y * 40}px`);
    };
    window.addEventListener('mousemove', handleMove);
    return () => window.removeEventListener('mousemove', handleMove);
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const [statsRes, jobsRes] = await Promise.all([
          jobsApi.getStats(),
          jobsApi.getAll()
        ]);
        setStats(statsRes.data);
        setRecentJobs(jobsRes.data.slice(0, 5));
      } catch (err) {
        console.error('Dashboard error:', err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <div className="page-loading">
        <div className="spinner"></div>
      </div>
    );
  }

  const total    = stats?.total || 0;
  const byStatus = stats?.byStatus || {};
  const active   = (byStatus.applied || 0) + (byStatus.phone_screen || 0) + (byStatus.interview || 0);
  const offers   = (byStatus.offer || 0) + (byStatus.accepted || 0);
  const rejected = byStatus.rejected || 0;

  const successRate = total > 0 ? Math.round((offers / total) * 100) : 0;

  // Generate today's date formatted
  const todayStr = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  // Funnel logic
  const funnelStages = [
    { key: 'wishlist',     label: 'Wishlist',     count: byStatus.wishlist || 0 },
    { key: 'applied',      label: 'Applied',      count: byStatus.applied || 0 },
    { key: 'phone_screen', label: 'Phone Screen', count: byStatus.phone_screen || 0 },
    { key: 'interview',    label: 'Interview',    count: byStatus.interview || 0 },
    { key: 'offer',        label: 'Offer',        count: byStatus.offer || 0 },
  ];
  const maxFunnel = Math.max(...funnelStages.map(s => s.count), 1);

  // Time based greeting
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="dash2-page">
      
      {/* ════════════ HERO ROW ════════════ */}
      <div className="dash2-hero" ref={heroRef}>
        <div className="dash2-hero-blob dash2-blob1"></div>
        <div className="dash2-hero-blob dash2-blob2"></div>
        <div className="dash2-hero-blob dash2-blob3"></div>

        <div className="dash2-hero-content">
          
          {/* left text area */}
          <div className="dash2-hero-left">
            <div className="dash2-eyebrow">
              <span className="dash2-eyebrow-dot"></span> {todayStr}
            </div>
            <h1 className="dash2-hero-title">
              {greeting},<br />
              <span className="dash2-name-gradient">{user?.firstName || 'User'}</span> 👋
            </h1>
            <p className="dash2-hero-sub">
              You have <strong>{active}</strong> active applications in progress.
            </p>
            
            <div className="dash2-hero-actions">
              <Link to="/jobs/new" className="dash2-cta-primary">
                + Add Application
              </Link>
              <Link to="/jobs" className="dash2-cta-secondary">
                Browse Live Jobs →
              </Link>
            </div>
          </div>

          {/* success rate ring */}
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

      {/* ════════════ STAT CARDS ════════════ */}
      <div className="dash2-stats-grid">
        <StatCard icon="📋" value={total} label="Total" color="#6366f1" bg="#f5f3ff" />
        <StatCard icon="⚡" value={active} label="Active" color="#f59e0b" bg="#fffbeb" />
        <StatCard icon="🎉" value={offers} label="Offers" color="#10b981" bg="#ecfdf5" />
        <StatCard icon="❌" value={rejected} label="Rejected" color="#ef4444" bg="#fef2f2" />
      </div>

      {/* ════════════ MIDDLE ROW ════════════ */}
      <div className="dash2-mid-row">
        
        {/* Funnel Chart */}
        <div className="dash2-card">
          <div className="dash2-card-header">
            <div>
              <h2 className="dash2-card-title">Application Funnel</h2>
              <div className="dash2-card-sub">How your pipeline is distributed</div>
            </div>
            <div className="dash2-funnel-total">
              <span>{total}</span> total
            </div>
          </div>
          
          <div className="dash2-funnel-list">
            {funnelStages.map(stage => {
              const width = total === 0 ? '0%' : `${(stage.count / maxFunnel) * 100}%`;
              const cfg = STATUS_CONFIG[stage.key];
              return (
                <div key={stage.key} className="dash2-funnel-row">
                  <div className="dash2-funnel-label">{stage.label}</div>
                  <div className="dash2-funnel-track">
                    <div className="dash2-funnel-fill" style={{ width, background: cfg.color }}></div>
                  </div>
                  <div className="dash2-funnel-count">{stage.count}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* All Statuses Grid */}
        <div className="dash2-card">
          <div className="dash2-card-header">
            <div>
              <h2 className="dash2-card-title">All Statuses</h2>
              <div className="dash2-card-sub">Every stage at a glance</div>
            </div>
          </div>
          <div className="dash2-status-grid">
            {Object.entries(STATUS_CONFIG).map(([key, cfg]) => {
              const count = byStatus[key] || 0;
              return (
                <div key={key} className="dash2-status-pill-card" style={{ '--sp-color': cfg.color, '--sp-bg': cfg.bg }}>
                  <div className="dash2-sp-icon">{cfg.icon}</div>
                  <div className="dash2-sp-count">{count}</div>
                  <div className="dash2-sp-label">{cfg.label}</div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* ════════════ BOTTOM ROW ════════════ */}
      <div className="dash2-bottom-row">
        
        {/* Recent Applications */}
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
                      <div className="dash2-recent-co">
                        🏢 {job.company}
                        {job.location && ` • 📍 ${job.location}`}
                      </div>
                    </div>
                    <div className="dash2-recent-badge" style={{ background: cfg.bg, color: cfg.color }}>
                      {cfg.label}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Side Column (Goals & Tips) */}
        <div className="dash2-side-col">
          
          <div className="dash2-card dash2-goal-card">
            <div className="dash2-goal-header">
              <div className="dash2-goal-emoji">🎯</div>
              <div>
                <h3 className="dash2-goal-title">Weekly Goal</h3>
                <div className="dash2-goal-sub">Track 5 new applications</div>
              </div>
            </div>
            <div className="dash2-goal-bar-track">
              <div className="dash2-goal-bar-fill" style={{ width: `${Math.min((total / 5) * 100, 100)}%` }}></div>
            </div>
            <div className="dash2-goal-note">
              {total >= 5 ? 'Goal reached! Amazing job 🌟' : `${5 - total} more to go this week!`}
            </div>
          </div>

          <div className="dash2-card">
            <div className="dash2-card-header" style={{ marginBottom: '1rem' }}>
              <h2 className="dash2-card-title">Pro Tips</h2>
            </div>
            <div className="dash2-tips-list">
              <div className="dash2-tip-item">
                <div className="dash2-tip-icon" style={{ background: '#e0f2fe', color: '#0284c7' }}>💡</div>
                <div className="dash2-tip-text">Always tailor your resume for each specific role using keywords from the job description.</div>
              </div>
              <div className="dash2-tip-item">
                <div className="dash2-tip-icon" style={{ background: '#fce7f3', color: '#db2777' }}>💬</div>
                <div className="dash2-tip-text">Follow up 1 week after applying to show genuine interest and initiative.</div>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}