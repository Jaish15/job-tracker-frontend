import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { jobsApi } from '../api/jobs';
import '../styles/dashboard.css';

/* ── Status badge color config ─────────────────────────────── */
const STATUS_BADGES = {
  wishlist:     { label: 'Wishlist',      color: '#7c3aed', bg: '#ede9fe', dot: '#7c3aed' },
  applied:      { label: 'Applied',       color: '#1d4ed8', bg: '#dbeafe', dot: '#1d4ed8' },
  phone_screen: { label: 'Phone Screen',  color: '#d97706', bg: '#fef3c7', dot: '#d97706' },
  interview:    { label: 'Interview',     color: '#0891b2', bg: '#e0f2fe', dot: '#0891b2' },
  offer:        { label: 'Offer',         color: '#059669', bg: '#d1fae5', dot: '#059669' },
  accepted:     { label: 'Accepted',      color: '#10b981', bg: '#bbf7d0', dot: '#10b981' },
  rejected:     { label: 'Rejected',      color: '#dc2626', bg: '#fee2e2', dot: '#dc2626' },
  withdrawn:    { label: 'Withdrawn',     color: '#4b5563', bg: '#f3f4f6', dot: '#4b5563' },
};

export function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ── Interactive Calendar State ── */
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const [statsRes, jobsRes] = await Promise.all([
          jobsApi.getStats(),
          jobsApi.getAll()
        ]);
        setStats(statsRes.data);
        setJobs(jobsRes.data);
      } catch (err) {
        console.error('Dashboard loading error:', err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <div className="page-loading" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <div className="spinner" style={{ width: '40px', height: '40px', border: '4px solid #e5e7ef', borderTopColor: '#5c5fc0', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  // Derived stats
  const activeCount = stats?.active || 0;
  const offersCount = stats?.byStatus?.offer || 0;
  const recentJobs = jobs.slice(0, 4); // Show top 4 like reference

  /* ── Calendar Helper Logic ── */
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayIndex = new Date(year, month, 1).getDay();

  const prevMonth = () => {
    setCurrentMonth(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(year, month + 1, 1));
  };

  // Helper to format Date objects as key strings (YYYY-MM-DD)
  const formatDateKey = (y, m, d) => {
    const mm = String(m + 1).padStart(2, '0');
    const dd = String(d).padStart(2, '0');
    return `${y}-${mm}-${dd}`;
  };

  // Get job events for a particular day
  const getEventsForDay = (y, m, d) => {
    const dateStr = formatDateKey(y, m, d);
    const dayEvents = [];

    jobs.forEach(job => {
      // Helper check function
      const matchesDate = (fieldDate) => {
        if (!fieldDate) return false;
        return fieldDate.startsWith(dateStr);
      };

      if (matchesDate(job.appliedDate)) {
        dayEvents.push({ type: 'applied', label: `📤 Applied to ${job.company}`, job });
      }
      if (matchesDate(job.interviewDate)) {
        dayEvents.push({ type: 'interview', label: `🎯 Interview with ${job.company}`, job });
      }
      if (matchesDate(job.offerDate)) {
        dayEvents.push({ type: 'offer', label: `🎉 Received Offer from ${job.company}!`, job });
      }
    });

    return dayEvents;
  };

  // Currently selected date key
  const selectedDateKey = formatDateKey(
    selectedDate.getFullYear(),
    selectedDate.getMonth(),
    selectedDate.getDate()
  );

  const selectedDayEvents = getEventsForDay(
    selectedDate.getFullYear(),
    selectedDate.getMonth(),
    selectedDate.getDate()
  );

  // Month Names array
  const MONTH_NAMES = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // User Initials
  const userInitials = `${user?.firstName?.[0] || 'U'}${user?.lastName?.[0] || ''}`;

  return (
    <div className="dash2-page">
      <div className="db-grid">
        
        {/* ════════════ LEFT COLUMN ════════════ */}
        <div className="db-left-col">
          
          {/* ---- Hero Banner Card ---- */}
          <div className="db-hero">
            <div className="db-hero-content">
              <div className="db-hero-left">
                <h1 className="db-hero-title">Hello {user?.firstName || 'User'}!</h1>
                <p className="db-hero-sub">
                  Today you have <strong>{activeCount}</strong> active applications in progress.
                  {offersCount > 0 && ` You also have ${offersCount} job offer pending review!`} 
                  {' '}Keep updating your progress to land your dream role.
                </p>
                <Link to="/jobs/new" className="db-hero-btn">
                  Add Application
                </Link>
              </div>

              {/* TwitHR laptop/workers vector representation */}
              <div className="db-hero-right">
                <svg className="hero-vector-svg" viewBox="0 0 200 200" fill="none">
                  {/* Desk background layer */}
                  <rect x="20" y="145" width="160" height="6" rx="3" fill="#ffffff" fillOpacity="0.25"/>
                  {/* Laptop base */}
                  <rect x="68" y="90" width="64" height="42" rx="4" fill="#ffffff" fillOpacity="0.95"/>
                  <rect x="73" y="95" width="54" height="32" rx="2" fill="#5c5fc0"/>
                  <polygon points="56,132 144,132 134,142 66,142" fill="#ffffff" fillOpacity="0.8"/>
                  
                  {/* Desk Mug */}
                  <rect x="150" y="115" width="14" height="20" rx="3" fill="#ffffff" fillOpacity="0.6"/>
                  <path d="M162 120 C166 120 166 130 162 130" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.6"/>
                  
                  {/* Floating symbols */}
                  <circle cx="150" cy="40" r="5" fill="#ffb703"/>
                  <circle cx="45" cy="50" r="7" fill="#ffffff" fillOpacity="0.25"/>
                  <path d="M100 35 L108 43 L92 43 Z" fill="#ffb703" opacity="0.8"/>

                  {/* Worker Sitting Left (Mary style) */}
                  <circle cx="52" cy="72" r="10" fill="#ffd166"/>
                  <path d="M36 112 C36 88 68 88 68 112 L64 135 L40 135 Z" fill="#ffffff" fillOpacity="0.9"/>
                  <path d="M48 94 L66 108" stroke="#ffffff" strokeWidth="4" strokeLinecap="round"/>
                  
                  {/* Worker Standing Right (Smith style) */}
                  <circle cx="142" cy="65" r="10" fill="#ffd166"/>
                  <path d="M126 105 C126 80 158 80 158 105 L154 140 L130 140 Z" fill="#ffb703"/>
                  <path d="M136 88 L116 102" stroke="#ffb703" strokeWidth="4" strokeLinecap="round"/>
                </svg>
              </div>
            </div>
          </div>

          {/* ---- Recruitment Progress / Job List Card ---- */}
          <div className="db-card">
            <div className="db-card-header">
              <h2 className="db-card-title">Recruitment Progress</h2>
              <Link to="/jobs" className="db-view-all-btn">
                View All
              </Link>
            </div>

            <div className="db-table-wrapper">
              {recentJobs.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '2rem 0', color: 'var(--text-3)' }}>
                  <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>📂</div>
                  <div>No job applications found. Create one to get started!</div>
                </div>
              ) : (
                <table className="db-table">
                  <thead>
                    <tr>
                      <th>Full Name / Company</th>
                      <th>Designation</th>
                      <th>Status</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentJobs.map(job => {
                      const cfg = STATUS_BADGES[job.status] || STATUS_BADGES.applied;
                      const initial = job.company?.[0] || 'C';
                      return (
                        <tr key={job.id}>
                          <td>
                            <div className="db-user-cell">
                              <div className="db-user-avatar">
                                {initial}
                              </div>
                              <div className="db-user-info-text">
                                <div className="db-user-name">{job.position}</div>
                                <div style={{ fontSize: '0.78rem', color: 'var(--text-3)', fontWeight: 600 }}>{job.company}</div>
                              </div>
                            </div>
                          </td>
                          <td>
                            <span className="db-designation-badge">
                              {job.location || 'Remote'}
                            </span>
                          </td>
                          <td>
                            <div className="db-status-cell" style={{ background: cfg.bg, padding: '0.3rem 0.8rem', borderRadius: '999px', display: 'inline-flex', color: cfg.color }}>
                              <span className="db-status-dot" style={{ background: cfg.dot }}></span>
                              <span className="db-status-text">{cfg.label}</span>
                            </div>
                          </td>
                          <td style={{ textAlign: 'right' }}>
                            <span className="db-row-actions" onClick={() => navigate(`/jobs/${job.id}/edit`)}>
                              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/>
                              </svg>
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          </div>

        </div>

        {/* ════════════ RIGHT COLUMN ════════════ */}
        <div className="db-right-col">
          
          {/* ---- Mini Calendar Component ---- */}
          <div className="db-calendar-card">
            
            {/* Header: Title + Slider Arrows */}
            <div className="db-calendar-header">
              <span className="db-calendar-month-title">
                {MONTH_NAMES[month]}, {year}
              </span>
              <div className="db-calendar-arrows">
                <button className="db-calendar-arrow-btn" onClick={prevMonth} aria-label="Previous Month">
                  ◀
                </button>
                <button className="db-calendar-arrow-btn" onClick={nextMonth} aria-label="Next Month">
                  ▶
                </button>
              </div>
            </div>

            {/* Dribbble Calendar from/to dates inputs */}
            <div className="db-calendar-inputs">
              <div className="db-calendar-input-wrap">
                <label>From</label>
                <input 
                  type="date" 
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                />
              </div>
              <div className="db-calendar-input-wrap">
                <label>To</label>
                <input 
                  type="date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                />
              </div>
            </div>

            {/* Weekdays */}
            <div className="db-calendar-weekdays">
              <span className="db-calendar-weekday">Su</span>
              <span className="db-calendar-weekday">Mo</span>
              <span className="db-calendar-weekday">Tu</span>
              <span className="db-calendar-weekday">We</span>
              <span className="db-calendar-weekday">Th</span>
              <span className="db-calendar-weekday">Fr</span>
              <span className="db-calendar-weekday">Sa</span>
            </div>

            {/* Days Grid */}
            <div className="db-calendar-days-grid">
              {/* Padding empty spaces */}
              {Array.from({ length: firstDayIndex }).map((_, idx) => (
                <div key={`empty-${idx}`} className="db-calendar-day-cell empty"></div>
              ))}
              
              {/* Day numbers */}
              {Array.from({ length: daysInMonth }).map((_, idx) => {
                const dayNum = idx + 1;
                const cellDate = new Date(year, month, dayNum);
                const isSelected = 
                  selectedDate.getDate() === dayNum &&
                  selectedDate.getMonth() === month &&
                  selectedDate.getFullYear() === year;
                  
                const isToday = 
                  new Date().getDate() === dayNum &&
                  new Date().getMonth() === month &&
                  new Date().getFullYear() === year;

                // Find events for this specific day cell
                const dayEvents = getEventsForDay(year, month, dayNum);
                const hasApplied = dayEvents.some(e => e.type === 'applied');
                const hasInterview = dayEvents.some(e => e.type === 'interview');
                const hasOffer = dayEvents.some(e => e.type === 'offer');

                return (
                  <div
                    key={`day-${dayNum}`}
                    className={`db-calendar-day-cell ${isSelected ? 'selected' : ''} ${isToday ? 'today' : ''}`}
                    onClick={() => setSelectedDate(cellDate)}
                  >
                    {dayNum}
                    
                    {/* Event markers dots */}
                    {dayEvents.length > 0 && (
                      <div className="db-calendar-dots">
                        {hasApplied && <span className="db-calendar-dot applied"></span>}
                        {hasInterview && <span className="db-calendar-dot interview"></span>}
                        {hasOffer && <span className="db-calendar-dot offer"></span>}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Calendar Events Details Drawer */}
            <div className="db-calendar-events-drawer">
              <h3 className="db-calendar-drawer-title">
                Events for {selectedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </h3>
              {selectedDayEvents.length === 0 ? (
                <div className="db-calendar-no-events">No events scheduled.</div>
              ) : (
                <div>
                  {selectedDayEvents.map((evt, idx) => (
                    <div 
                      key={`evt-${idx}`} 
                      className="db-calendar-event-item"
                      style={{ borderLeft: `4px solid ${evt.type === 'interview' ? '#ffb703' : evt.type === 'offer' ? '#10b981' : '#3b82f6'}`, paddingLeft: '8px' }}
                    >
                      {evt.label}
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

          {/* ---- User Profile Card ---- */}
          <div className="db-profile-card">
            
            {/* Centered Avatar */}
            <div className="db-profile-avatar-wrap">
              <div className="db-profile-avatar">
                {userInitials}
              </div>
            </div>

            {/* User Title Information */}
            <h3 className="db-profile-name">{user?.firstName} {user?.lastName || ''}</h3>
            <p className="db-profile-title">
              {user?.role === 'admin' ? 'Sr. System Administrator' : 'Candidate (Job Seeker)'}
            </p>

            {/* Fuzle call/mail/message circular icons */}
            <div className="db-profile-actions">
              <a href={`tel:+1234567890`} className="db-profile-action-circle" title="Call User">
                📞
              </a>
              <a href={`mailto:${user?.email || ''}`} className="db-profile-action-circle" title="Email User">
                ✉️
              </a>
              <div className="db-profile-action-circle" onClick={() => navigate('/settings')} title="Message User">
                💬
              </div>
            </div>

            {/* TwitHR Profile Metadata rows */}
            <div className="db-profile-metadata">
              <div className="db-profile-meta-row">
                <span className="db-profile-meta-label">Target Field</span>
                <span className="db-profile-meta-value">Software Engineering</span>
              </div>
              <div className="db-profile-meta-row">
                <span className="db-profile-meta-label">Joined Date</span>
                <span className="db-profile-meta-value">
                  {new Date().toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' })}
                </span>
              </div>
              <div className="db-profile-meta-row">
                <span className="db-profile-meta-label">Total Tracker List</span>
                <span className="db-profile-meta-value">{jobs.length} Applications</span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}