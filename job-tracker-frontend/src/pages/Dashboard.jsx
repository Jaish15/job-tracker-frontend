import { useEffect, useState, useRef } from 'react';
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

  /* ── Profile Picture Uploader ── */
  const [profilePic, setProfilePic] = useState(() => localStorage.getItem('userProfilePic') || null);
  const fileInputRef = useRef(null);

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        localStorage.setItem('userProfilePic', base64String);
        setProfilePic(base64String);
        window.dispatchEvent(new Event('profilePicUpdated'));
      };
      reader.readAsDataURL(file);
    }
  };

  /* ── Smart To-Do Checklist State ── */
  const [todos, setTodos] = useState(() => {
    const saved = localStorage.getItem('jobtracker_todos');
    return saved ? JSON.parse(saved) : [
      { id: 1, text: "Tailor resume keywords for recently tracked applications", completed: false },
      { id: 2, text: "Connect with 2 recruiters at target companies on LinkedIn", completed: false },
      { id: 3, text: "Review technical prep question tags for scheduled interviews", completed: false }
    ];
  });
  const [newTodoText, setNewTodoText] = useState('');

  const saveTodos = (newTodos) => {
    setTodos(newTodos);
    localStorage.setItem('jobtracker_todos', JSON.stringify(newTodos));
  };

  const handleAddTodo = (e) => {
    e.preventDefault();
    if (!newTodoText.trim()) return;
    const newTodo = {
      id: Date.now(),
      text: newTodoText.trim(),
      completed: false
    };
    saveTodos([...todos, newTodo]);
    setNewTodoText('');
  };

  const handleToggleTodo = (id) => {
    const updated = todos.map(t => t.id === id ? { ...t, completed: !t.completed } : t);
    saveTodos(updated);
  };

  const handleDeleteTodo = (id) => {
    const updated = todos.filter(t => t.id !== id);
    saveTodos(updated);
  };

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

  // Derived stats - calculated directly from jobs for absolute accuracy & backend independence
  const activeCount = jobs.filter(job => !['rejected', 'withdrawn'].includes(job.status)).length;
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

  const normalizeToYYYYMMDD = (dateVal) => {
    if (!dateVal) return null;
    try {
      const d = new Date(dateVal);
      if (isNaN(d.getTime())) {
        const match = dateVal.match(/(\d{4})[-/](\d{1,2})[-/](\d{1,2})/);
        if (match) {
          return `${match[1]}-${match[2].padStart(2, '0')}-${match[3].padStart(2, '0')}`;
        }
        const usMatch = dateVal.match(/(\d{1,2})[-/](\d{1,2})[-/](\d{4})/);
        if (usMatch) {
          return `${usMatch[3]}-${usMatch[1].padStart(2, '0')}-${usMatch[2].padStart(2, '0')}`;
        }
        return null;
      }
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      return `${y}-${m}-${day}`;
    } catch (e) {
      return null;
    }
  };

  // Get job events for a particular day
  const getEventsForDay = (y, m, d) => {
    const dateStr = formatDateKey(y, m, d);
    const dayEvents = [];

    jobs.forEach(job => {
      const matchesDate = (fieldDate) => {
        if (!fieldDate) return false;
        const normalized = normalizeToYYYYMMDD(fieldDate);
        return normalized === dateStr;
      };

      if (matchesDate(job.appliedDate)) {
        dayEvents.push({ type: 'applied', label: `Applied to ${job.company}`, job });
      }
      if (matchesDate(job.interviewDate)) {
        dayEvents.push({ type: 'interview', label: `Interview with ${job.company}`, job });
      }
      if (matchesDate(job.offerDate)) {
        dayEvents.push({ type: 'offer', label: `Received Offer from ${job.company}!`, job });
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

  const selectedDayJobs = jobs.filter(job => {
    return (
      normalizeToYYYYMMDD(job.appliedDate) === selectedDateKey ||
      normalizeToYYYYMMDD(job.interviewDate) === selectedDateKey ||
      normalizeToYYYYMMDD(job.offerDate) === selectedDateKey
    );
  });

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

              {/* Purple Hoodie Illustration replacing the coffee girl */}
              <div className="db-hero-right">
                <img 
                  src="/purple-hoodie.jpg" 
                  alt="Developer working on laptop illustration" 
                  className="hero-vector-svg"
                  style={{
                    maxWidth: '180px',
                    borderRadius: '16px',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                    objectFit: 'contain'
                  }}
                />
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

          {/* ---- Smart Daily Goals Checklist ---- */}
          <div className="db-card" style={{ marginTop: '0rem' }}>
            <div className="db-card-header" style={{ marginBottom: '1rem' }}>
              <div>
                <h2 className="db-card-title">Daily Goals Checklist</h2>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-3)', fontWeight: 600, marginTop: '0.15rem' }}>
                  Keep your job-hunting tasks fully organized
                </div>
              </div>
              <span style={{ 
                fontSize: '0.75rem', 
                fontWeight: 700, 
                color: '#5c5fc0', 
                background: '#eef2ff', 
                padding: '0.2rem 0.6rem', 
                borderRadius: '6px' 
              }}>
                {todos.filter(t => t.completed).length} / {todos.length} Done
              </span>
            </div>

            {/* Todo Input Form */}
            <form onSubmit={handleAddTodo} style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
              <input 
                type="text" 
                placeholder="Add a new task (e.g. Follow up with recruiting team)..."
                value={newTodoText}
                onChange={(e) => setNewTodoText(e.target.value)}
                style={{ 
                  flex: 1,
                  padding: '0.5rem 1rem',
                  border: '1.5px solid var(--border)',
                  borderRadius: '12px',
                  fontSize: '0.85rem',
                  outline: 'none',
                  background: 'var(--surface-2)',
                  color: 'var(--text)',
                  transition: 'border-color 0.2s ease'
                }}
                onFocus={(e) => e.target.style.borderColor = '#5c5fc0'}
                onBlur={(e) => e.target.style.borderColor = 'var(--border)'}
              />
              <button 
                type="submit" 
                style={{ 
                  background: '#5c5fc0',
                  color: '#ffffff',
                  padding: '0.5rem 1.25rem',
                  borderRadius: '12px',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  transition: 'background-color 0.2s ease'
                }}
                onMouseEnter={(e) => e.target.style.background = '#4a4d9e'}
                onMouseLeave={(e) => e.target.style.background = '#5c5fc0'}
              >
                Add
              </button>
            </form>

            {/* Todo List */}
            {todos.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '1.5rem', fontSize: '0.8rem', color: 'var(--text-3)', fontStyle: 'italic' }}>
                All clear! Add a task above to plan your day. 🌟
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {todos.map(todo => (
                  <div 
                    key={todo.id} 
                    style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'space-between',
                      padding: '0.75rem 1rem',
                      background: todo.completed ? 'rgba(92, 95, 192, 0.03)' : 'var(--surface-2)',
                      border: '1px solid var(--border)',
                      borderRadius: '12px',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', flex: 1, minWidth: 0 }}>
                      <input 
                        type="checkbox" 
                        checked={todo.completed}
                        onChange={() => handleToggleTodo(todo.id)}
                        style={{ 
                          width: '18px', 
                          height: '18px', 
                          borderRadius: '6px', 
                          border: '1.5px solid var(--border)', 
                          accentColor: '#5c5fc0',
                          cursor: 'pointer' 
                        }}
                      />
                      <span style={{ 
                        fontSize: '0.85rem', 
                        color: todo.completed ? 'var(--text-3)' : 'var(--text-2)',
                        textDecoration: todo.completed ? 'line-through' : 'none',
                        fontWeight: todo.completed ? 500 : 600,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        textAlign: 'left'
                      }}>
                        {todo.text}
                      </span>
                    </label>
                    <button 
                      type="button"
                      onClick={() => handleDeleteTodo(todo.id)}
                      style={{ 
                        color: 'var(--text-3)',
                        fontSize: '1rem',
                        cursor: 'pointer',
                        padding: '0.15rem 0.35rem',
                        borderRadius: '4px',
                        transition: 'color 0.2s ease'
                      }}
                      onMouseEnter={(e) => e.target.style.color = '#dc2626'}
                      onMouseLeave={(e) => e.target.style.color = 'var(--text-3)'}
                      aria-label="Delete Task"
                    >
                      🗑️
                    </button>
                  </div>
                ))}
              </div>
            )}
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
                Applications for {selectedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </h3>
              {selectedDayJobs.length === 0 ? (
                <div className="db-calendar-no-events">No applications/events scheduled for this date.</div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                  {selectedDayJobs.map((job) => {
                    const cfg = STATUS_BADGES[job.status] || STATUS_BADGES.applied;
                    const initial = job.company?.[0] || 'C';
                    
                    // Determine which event is on this day
                    const targetStr = formatDateKey(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate());
                    let eventLabel = 'Applied Date';
                    let eventBadgeColor = '#3b82f6';
                    if (normalizeToYYYYMMDD(job.interviewDate) === targetStr) {
                      eventLabel = 'Interview Date';
                      eventBadgeColor = '#ffb703';
                    } else if (normalizeToYYYYMMDD(job.offerDate) === targetStr) {
                      eventLabel = 'Offer Date';
                      eventBadgeColor = '#10b981';
                    }

                    return (
                      <div 
                        key={job.id} 
                        className="db-calendar-event-item"
                        onClick={() => navigate(`/jobs/${job.id}/edit`)}
                        style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: '0.75rem',
                          padding: '0.75rem',
                          background: 'var(--surface-2)',
                          borderRadius: '12px',
                          border: '1px solid var(--border)',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                          textAlign: 'left'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'translateY(-2px)';
                          e.currentTarget.style.borderColor = '#5c5fc0';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.borderColor = 'var(--border)';
                        }}
                      >
                        <div className="db-user-avatar" style={{ width: '32px', height: '32px', fontSize: '0.75rem', background: '#eef2ff', color: '#5c5fc0' }}>
                          {initial}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {job.position}
                          </div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-3)', fontWeight: 600 }}>
                            🏢 {job.company}
                          </div>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.25rem' }}>
                          <span style={{ 
                            fontSize: '0.65rem', 
                            fontWeight: 800, 
                            color: '#ffffff', 
                            background: eventBadgeColor, 
                            padding: '0.15rem 0.4rem', 
                            borderRadius: '4px',
                            textTransform: 'uppercase'
                          }}>
                            {eventLabel}
                          </span>
                          <span style={{ fontSize: '0.7rem', fontWeight: 700, color: cfg.color }}>
                            {cfg.label}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

          </div>

          {/* ---- User Profile Card ---- */}
          <div className="db-profile-card" style={{ padding: '0 0 2rem 0', overflow: 'hidden' }}>
            
            {/* Tech Indigo Cover Banner (Yellow Image Removed as Requested) */}
            <div style={{ 
              position: 'relative', 
              height: '120px', 
              width: '100%', 
              marginBottom: '2.5rem',
              background: 'linear-gradient(135deg, #5c5fc0 0%, #4f46e5 100%)',
              boxShadow: 'inset 0 -15px 30px rgba(0,0,0,0.1)'
            }}>
              {/* Invisible File Input */}
              <input 
                type="file" 
                ref={fileInputRef} 
                accept="image/*" 
                onChange={handleProfilePicChange} 
                style={{ display: 'none' }} 
              />
              
              {/* Interactive Avatar Circle with Camera Hover Uploader */}
              <div 
                className="db-profile-avatar" 
                onClick={() => fileInputRef.current.click()}
                style={{ 
                  position: 'absolute', 
                  bottom: '-25px', 
                  left: '50%', 
                  transform: 'translateX(-50%)',
                  width: '66px',
                  height: '66px',
                  fontSize: '1.3rem',
                  border: '4px solid #ffffff',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  cursor: 'pointer',
                  overflow: 'hidden',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                title="Click to upload profile picture"
                onMouseEnter={(e) => {
                  const overlay = e.currentTarget.querySelector('.avatar-camera-overlay');
                  if (overlay) overlay.style.opacity = '1';
                }}
                onMouseLeave={(e) => {
                  const overlay = e.currentTarget.querySelector('.avatar-camera-overlay');
                  if (overlay) overlay.style.opacity = '0';
                }}
              >
                {profilePic ? (
                  <img src={profilePic} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  userInitials
                )}
                {/* Camera Overlay */}
                <div 
                  className="avatar-camera-overlay"
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'rgba(0, 0, 0, 0.4)',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1rem',
                    opacity: 0,
                    transition: 'opacity 0.2s ease',
                    borderRadius: '50%'
                  }}
                >
                  📷
                </div>
              </div>
            </div>

            <div style={{ padding: '0 2rem' }}>
              {/* User Title Information */}
              <h3 className="db-profile-name">{user?.firstName} {user?.lastName || ''}</h3>
              <p className="db-profile-title">
                {user?.role === 'admin' ? 'Sr. System Administrator' : 'Candidate (Job Seeker)'}
              </p>

              {/* call/mail/message circular icons */}
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

              {/* Profile Metadata rows */}
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
    </div>
  );
}