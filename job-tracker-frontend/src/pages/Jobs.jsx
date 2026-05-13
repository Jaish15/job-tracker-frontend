import { useEffect, useState, useCallback, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { jobsApi } from '../api/jobs';
import { JobCard } from '../components/JobCard';
import { fetchAllLiveJobs, MUSE_CATEGORIES } from '../api/liveJobs';

/* ── Constants ─────────────────────────────────────────────── */

const JOB_STATUSES = [
  { value: '', label: 'All Statuses' },
  { value: 'wishlist', label: 'Wishlist' },
  { value: 'applied', label: 'Applied' },
  { value: 'phone_screen', label: 'Phone Screen' },
  { value: 'interview', label: 'Interview' },
  { value: 'offer', label: 'Offer' },
  { value: 'rejected', label: 'Rejected' },
  { value: 'accepted', label: 'Accepted' },
  { value: 'withdrawn', label: 'Withdrawn' },
];

const JOB_BOARDS = [
  { name: 'LinkedIn',          logo: '🔵', color: '#0077b5', bg: '#e8f4fd', desc: 'Professional network & jobs',          url: 'https://www.linkedin.com/jobs',                   tag: 'Most Popular'   },
  { name: 'Indeed',            logo: '🔍', color: '#2164f3', bg: '#eef2ff', desc: 'Millions of jobs worldwide',            url: 'https://www.indeed.com',                          tag: 'High Volume'    },
  { name: 'Glassdoor',         logo: '🟢', color: '#0caa41', bg: '#e6f9ee', desc: 'Jobs + company reviews & salaries',     url: 'https://www.glassdoor.com/Job/index.htm',         tag: 'Salary Insights'},
  { name: 'Google Jobs',       logo: '🔴', color: '#ea4335', bg: '#fef2f2', desc: 'Search jobs across the web',            url: 'https://www.google.com/search?q=jobs+near+me',    tag: 'Aggregator'     },
  { name: 'Wellfound',         logo: '🚀', color: '#f97316', bg: '#fff7ed', desc: 'Startup & tech jobs',                   url: 'https://wellfound.com/jobs',                      tag: 'Startups'       },
  { name: 'Levels.fyi',        logo: '📊', color: '#7c3aed', bg: '#f5f3ff', desc: 'Tech salaries & job listings',          url: 'https://www.levels.fyi/jobs',                     tag: 'Tech / Comp'    },
  { name: 'Dice',              logo: '🎲', color: '#e11d48', bg: '#fff1f2', desc: 'Tech & IT specialist jobs',             url: 'https://www.dice.com',                            tag: 'Tech'           },
  { name: 'Remote.co',         logo: '🌍', color: '#0891b2', bg: '#ecfeff', desc: 'Curated remote-only jobs',              url: 'https://remote.co/remote-jobs',                   tag: 'Remote'         },
  { name: 'We Work Remotely',  logo: '💻', color: '#059669', bg: '#ecfdf5', desc: 'Largest remote work community',         url: 'https://weworkremotely.com',                      tag: 'Remote'         },
  { name: 'GitHub Jobs',       logo: '🐙', color: '#24292e', bg: '#f6f8fa', desc: 'Developer & open-source jobs',          url: 'https://github.com/about/careers',                tag: 'Dev'            },
  { name: 'Stack Overflow',    logo: '📚', color: '#f48024', bg: '#fff8f0', desc: 'Developer community jobs',              url: 'https://stackoverflow.com/jobs',                  tag: 'Dev'            },
  { name: 'Otta',              logo: '⚡', color: '#6366f1', bg: '#eef2ff', desc: 'Personalised tech job matches',          url: 'https://app.otta.com',                            tag: 'Curated'        },
];

const SOURCE_COLORS = {
  'The Muse': { color: '#6c2bd9', bg: '#f3e8ff' },
  'Remotive':  { color: '#0891b2', bg: '#ecfeff' },
};

/* ── LiveJobCard ────────────────────────────────────────────── */

function LiveJobCard({ job, onTrack }) {
  const src = SOURCE_COLORS[job.source] || { color: '#555', bg: '#f5f5f5' };
  const date = job.postedAt ? new Date(job.postedAt).toLocaleDateString() : null;

  return (
    <div className="live-job-card">
      {/* header */}
      <div className="live-job-card-header">
        <div className="live-job-source-badge" style={{ color: src.color, background: src.bg }}>
          {job.source}
          {job.remote && <span className="live-job-remote-dot" />}
        </div>
        <span className="live-job-date">{date}</span>
      </div>

      {/* body */}
      <div className="live-job-body">
        <h3 className="live-job-title">{job.title}</h3>
        <p className="live-job-company">{job.company}</p>
        <div className="live-job-meta">
          {job.location && (
            <span className="live-job-meta-item">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
              {job.location}
            </span>
          )}
          {job.type && (
            <span className="live-job-meta-item">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"/></svg>
              {job.type}
            </span>
          )}
          {job.salary && (
            <span className="live-job-meta-item">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>
              {job.salary}
            </span>
          )}
        </div>
        {job.category && <p className="live-job-category">{job.category}</p>}
        {job.description && (
          <p className="live-job-desc">{job.description.slice(0, 200)}{job.description.length > 200 ? '…' : ''}</p>
        )}
        {job.tags?.length > 0 && (
          <div className="live-job-tags">
            {job.tags.slice(0, 5).map((t) => (
              <span key={t} className="live-job-tag">{t}</span>
            ))}
          </div>
        )}
      </div>

      {/* actions */}
      <div className="live-job-actions">
        <button
          className="btn btn-primary btn-sm live-track-btn"
          onClick={() => onTrack(job)}
          id={`track-${job.id}`}
        >
          ＋ Track This Job
        </button>
        {job.url && (
          <a
            href={job.url}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-outline btn-sm"
          >
            View Posting ↗
          </a>
        )}
      </div>
    </div>
  );
}

/* ── Main Jobs Component ────────────────────────────────────── */

export function Jobs() {
  const navigate = useNavigate();

  // My applications state
  const [jobs,          setJobs]          = useState([]);
  const [myLoading,     setMyLoading]     = useState(true);
  const [filters,       setFilters]       = useState({ status: '', company: '' });
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  // Live jobs state
  const [liveJobs,      setLiveJobs]      = useState([]);
  const [liveLoading,   setLiveLoading]   = useState(false);
  const [liveError,     setLiveError]     = useState('');
  const [liveSearch,    setLiveSearch]    = useState('');
  const [liveCategory,  setLiveCategory]  = useState('');
  const [livePage,      setLivePage]      = useState(1);
  const [livePageCount, setLivePageCount] = useState(1);
  const [trackedIds,    setTrackedIds]    = useState(new Set());

  const [activeTab, setActiveTab] = useState('my-jobs'); // 'my-jobs' | 'live' | 'browse'

  const searchTimer = useRef(null);

  /* ── My Applications ───── */
  const fetchJobs = useCallback(async () => {
    setMyLoading(true);
    try {
      const params = {};
      if (filters.status)  params.status  = filters.status;
      if (filters.company) params.company = filters.company;
      const { data } = await jobsApi.getAll(params);
      setJobs(data);
    } catch (err) {
      console.error('Failed to fetch jobs', err);
    } finally {
      setMyLoading(false);
    }
  }, [filters]);

  useEffect(() => { fetchJobs(); }, [fetchJobs]);

  const handleDelete = async (id) => {
    if (deleteConfirm !== id) { setDeleteConfirm(id); return; }
    try {
      await jobsApi.delete(id);
      setJobs(jobs.filter((j) => j.id !== id));
      setDeleteConfirm(null);
    } catch (err) {
      console.error('Failed to delete job', err);
    }
  };

  /* ── Live Jobs ─────────── */
  const loadLiveJobs = useCallback(async () => {
    setLiveLoading(true);
    setLiveError('');
    try {
      const { jobs: fetched, musePageCount } = await fetchAllLiveJobs({
        search:   liveSearch,
        category: liveCategory,
        page:     livePage,
      });
      setLiveJobs(fetched);
      setLivePageCount(musePageCount || 1);
    } catch (err) {
      setLiveError('Could not load live jobs. Please try again.');
      console.error(err);
    } finally {
      setLiveLoading(false);
    }
  }, [liveSearch, liveCategory, livePage]);

  useEffect(() => {
    if (activeTab === 'live') loadLiveJobs();
  }, [activeTab, loadLiveJobs]);

  // Debounce search
  const handleLiveSearch = (val) => {
    setLiveSearch(val);
    setLivePage(1);
    clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => {
      if (activeTab === 'live') loadLiveJobs();
    }, 500);
  };

  // One-click "Track This Job" → pre-fill the new job form via state
  const handleTrack = (job) => {
    setTrackedIds((prev) => new Set([...prev, job.id]));
    navigate('/jobs/new', {
      state: {
        prefill: {
          company:  job.company,
          position: job.title,
          location: job.location,
          jobUrl:   job.url,
          salary:   job.salary,
          status:   'wishlist',
          notes:    `Category: ${job.category}\nSource: ${job.source}`,
        },
      },
    });
  };

  /* ── Render ────────────── */
  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Jobs</h1>
          <p className="page-subtitle">Track your applications, browse live listings, or discover job boards</p>
        </div>
        <Link to="/jobs/new" className="btn btn-primary" id="add-job-btn">+ Add Job</Link>
      </div>

      {/* ── Tab switcher ── */}
      <div className="jobs-tabs">
        <button
          id="tab-my-jobs"
          className={`jobs-tab ${activeTab === 'my-jobs' ? 'active' : ''}`}
          onClick={() => setActiveTab('my-jobs')}
        >
          My Applications
          <span className="jobs-tab-count">{jobs.length}</span>
        </button>
        <button
          id="tab-live-jobs"
          className={`jobs-tab ${activeTab === 'live' ? 'active' : ''}`}
          onClick={() => setActiveTab('live')}
        >
          🔴 Live Jobs
          <span className="jobs-tab-count live-pulse">{liveJobs.length || '…'}</span>
        </button>
        <button
          id="tab-browse"
          className={`jobs-tab ${activeTab === 'browse' ? 'active' : ''}`}
          onClick={() => setActiveTab('browse')}
        >
          Browse Job Boards
          <span className="jobs-tab-count">{JOB_BOARDS.length}</span>
        </button>
      </div>

      {/* ══ MY APPLICATIONS TAB ══ */}
      {activeTab === 'my-jobs' && (
        <>
          <div className="filters-bar">
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="form-select"
              aria-label="Filter by status"
            >
              {JOB_STATUSES.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
            <input
              type="text"
              placeholder="Search by company…"
              value={filters.company}
              onChange={(e) => setFilters({ ...filters, company: e.target.value })}
              className="form-input filter-input"
              aria-label="Filter by company"
            />
          </div>

          {myLoading ? (
            <div className="page-loading"><div className="spinner" /></div>
          ) : jobs.length === 0 ? (
            <div className="empty-state">
              <span className="empty-icon">📭</span>
              <p>No job applications yet.</p>
              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                <Link to="/jobs/new" className="btn btn-primary">Add manually</Link>
                <button className="btn btn-outline" onClick={() => setActiveTab('live')}>
                  Browse live jobs
                </button>
              </div>
            </div>
          ) : (
            <div className="jobs-grid">
              {jobs.map((job) => (
                <div key={job.id}>
                  {deleteConfirm === job.id && (
                    <div className="delete-confirm">
                      <p>Delete this application?</p>
                      <div className="delete-confirm-actions">
                        <button className="btn btn-danger btn-sm" onClick={() => handleDelete(job.id)}>Yes, delete</button>
                        <button className="btn btn-outline btn-sm" onClick={() => setDeleteConfirm(null)}>Cancel</button>
                      </div>
                    </div>
                  )}
                  <JobCard job={job} onDelete={handleDelete} />
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* ══ LIVE JOBS TAB ══ */}
      {activeTab === 'live' && (
        <div className="live-jobs-section">
          {/* Live jobs header banner */}
          <div className="live-jobs-banner">
            <div className="live-jobs-banner-text">
              <span className="live-dot-pulse" />
              <span>
                Real-time listings from <strong>The Muse</strong> &amp; <strong>Remotive</strong> — updated daily.
                Click <strong>Track This Job</strong> to add any role to your applications instantly.
              </span>
            </div>
            <div className="live-jobs-source-pills">
              <span className="live-source-pill" style={{ color: '#6c2bd9', background: '#f3e8ff' }}>The Muse — All Categories</span>
              <span className="live-source-pill" style={{ color: '#0891b2', background: '#ecfeff' }}>Remotive — Remote Jobs</span>
            </div>
          </div>

          {/* Filters */}
          <div className="live-jobs-filters">
            <div className="live-search-wrap">
              <svg className="live-search-icon" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              <input
                id="live-jobs-search"
                type="text"
                className="form-input live-search-input"
                placeholder="Search by title, company, skill…"
                value={liveSearch}
                onChange={(e) => handleLiveSearch(e.target.value)}
              />
            </div>
            <select
              id="live-jobs-category"
              className="form-select"
              value={liveCategory}
              onChange={(e) => { setLiveCategory(e.target.value); setLivePage(1); }}
            >
              <option value="">All Categories</option>
              {MUSE_CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <button className="btn btn-outline btn-sm" onClick={() => { setLiveSearch(''); setLiveCategory(''); setLivePage(1); }}>
              Clear
            </button>
          </div>

          {/* Content */}
          {liveLoading ? (
            <div className="page-loading"><div className="spinner" /></div>
          ) : liveError ? (
            <div className="live-jobs-error">
              <span>⚠️ {liveError}</span>
              <button className="btn btn-outline btn-sm" onClick={loadLiveJobs}>Retry</button>
            </div>
          ) : liveJobs.length === 0 ? (
            <div className="empty-state">
              <span className="empty-icon">🔍</span>
              <p>No live jobs matched your search.</p>
              <button className="btn btn-outline" onClick={() => { setLiveSearch(''); setLiveCategory(''); }}>Clear filters</button>
            </div>
          ) : (
            <>
              <p className="live-jobs-count">{liveJobs.length} jobs found</p>
              <div className="live-jobs-grid">
                {liveJobs.map((job) => (
                  <div key={job.id} className={trackedIds.has(job.id) ? 'live-job-tracked' : ''}>
                    {trackedIds.has(job.id) && (
                      <div className="live-tracked-badge">✅ Added to My Applications</div>
                    )}
                    <LiveJobCard job={job} onTrack={handleTrack} />
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {livePageCount > 1 && (
                <div className="live-jobs-pagination">
                  <button
                    className="btn btn-outline btn-sm"
                    disabled={livePage === 1}
                    onClick={() => setLivePage((p) => Math.max(1, p - 1))}
                  >← Prev</button>
                  <span className="live-page-info">Page {livePage} / {livePageCount}</span>
                  <button
                    className="btn btn-outline btn-sm"
                    disabled={livePage >= livePageCount}
                    onClick={() => setLivePage((p) => p + 1)}
                  >Next →</button>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* ══ BROWSE JOB BOARDS TAB ══ */}
      {activeTab === 'browse' && (
        <div className="job-boards-section">
          <div className="job-boards-intro">
            <p>
              Find your next opportunity on these platforms. When you spot a role you like,
              come back and <Link to="/jobs/new" className="inline-link">add it here</Link> to track your application.
            </p>
          </div>

          <div className="job-boards-grid">
            {JOB_BOARDS.map((board) => (
              <a
                key={board.name}
                href={board.url}
                target="_blank"
                rel="noopener noreferrer"
                className="job-board-card"
                style={{ '--board-color': board.color, '--board-bg': board.bg }}
              >
                <div className="job-board-card-top">
                  <div className="job-board-logo" style={{ background: board.bg }}>
                    <span>{board.logo}</span>
                  </div>
                  <span className="job-board-tag" style={{ color: board.color, background: board.bg }}>
                    {board.tag}
                  </span>
                </div>
                <div className="job-board-name">{board.name}</div>
                <div className="job-board-desc">{board.desc}</div>
                <div className="job-board-cta">
                  Visit site
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/>
                  </svg>
                </div>
                <div className="job-board-glow" />
              </a>
            ))}
          </div>

          <div className="job-boards-tip">
            <span>💡</span>
            <span>
              Found a job you like? Copy the URL and{' '}
              <Link to="/jobs/new" className="inline-link">add it as an application</Link>{' '}
              to track your progress.
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
