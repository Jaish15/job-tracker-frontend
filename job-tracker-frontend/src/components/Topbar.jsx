import { useAuth } from '../context/AuthContext';
import { useState, useEffect } from 'react';

export function Topbar({ onToggleSidebar }) {
  const { user } = useAuth();
  const [search, setSearch] = useState('');
  const [profilePic, setProfilePic] = useState(() => localStorage.getItem('userProfilePic') || null);

  useEffect(() => {
    const handleUpdate = () => {
      setProfilePic(localStorage.getItem('userProfilePic'));
    };
    window.addEventListener('profilePicUpdated', handleUpdate);
    return () => window.removeEventListener('profilePicUpdated', handleUpdate);
  }, []);

  const today = new Date().toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const userInitials = `${user?.firstName?.[0] || 'U'}${user?.lastName?.[0] || ''}`;

  return (
    <header className="topbar">
      <div className="topbar-left">
        <button
          className="topbar-menu-btn"
          onClick={onToggleSidebar}
          aria-label="Toggle sidebar"
        >
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="6" x2="21" y2="6"/>
            <line x1="3" y1="12" x2="21" y2="12"/>
            <line x1="3" y1="18" x2="21" y2="18"/>
          </svg>
        </button>

        <div className="topbar-search">
          <svg className="topbar-search-icon" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            type="search"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="topbar-search-input"
            aria-label="Search"
          />
        </div>
      </div>

      <div className="topbar-center">
        <span className="topbar-date">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight:'6px'}}>
            <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/>
            <line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
          </svg>
          {today}
        </span>
      </div>

      <div className="topbar-right">
        {/* Notifications and Messages removed in favor of Dashboard Chatbot */}

        <div className="topbar-user">
          <div className="topbar-avatar" style={{ padding: 0, overflow: 'hidden' }}>
            {profilePic ? (
              <img src={profilePic} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              userInitials
            )}
          </div>
          <div className="topbar-user-info">
            <span className="topbar-user-name">{user?.firstName} {user?.lastName}</span>
            <span className="topbar-user-role">{user?.role}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
