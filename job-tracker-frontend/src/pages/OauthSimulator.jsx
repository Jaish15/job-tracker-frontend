import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

export function OauthSimulator() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const provider = searchParams.get('provider') || 'google';
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState('');
  
  // Custom LeetCode username state
  const [lcUsername, setLcUsername] = useState('');

  const initiateSessionRedirect = (email, firstName, lastName, usernameVal = null) => {
    setLoading(true);
    const steps = [
      `Connecting to ${provider === 'leetcode' ? 'LeetCode' : provider === 'github' ? 'GitHub' : 'Google'} OAuth gateway...`,
      'Exchanging secure verification signatures...',
      'Generating application authorization grants...',
      'Finalizing dashboard session reload...'
    ];

    let stepIdx = 0;
    setLoadingStep(steps[0]);

    const interval = setInterval(() => {
      stepIdx++;
      if (stepIdx < steps.length) {
        setLoadingStep(steps[stepIdx]);
      } else {
        clearInterval(interval);
        
        // Construct simulated JWT payload parsed by getOAuthUserAndToken in AuthContext.jsx
        const payload = {
          sub: provider === 'leetcode' ? 99988 : provider === 'github' ? 88877 : 77766,
          email,
          firstName,
          lastName,
          role: 'user'
        };

        const headerB64 = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" })).replace(/=/g, '');
        const payloadB64 = btoa(JSON.stringify(payload)).replace(/=/g, '');
        const signatureB64 = "mocksignature"; // triggers isMockUser client-side fallback in jobs.js / users.js
        const mockToken = `${headerB64}.${payloadB64}.${signatureB64}`;

        // Cache LeetCode username if applicable
        if (provider === 'leetcode') {
          localStorage.setItem('leetcode_username', usernameVal || '');
        }

        // Wipe previous jobs from local storage if logging in as a different user to prevent cross-profile contamination
        const currentCachedUser = localStorage.getItem('last_logged_in_email');
        if (currentCachedUser && currentCachedUser !== email) {
          localStorage.removeItem('mock_jobs');
        }
        localStorage.setItem('last_logged_in_email', email);

        // Perform full page reload to force AuthProvider to mount and extract token from the query parameters
        window.location.href = `/dashboard?token=${mockToken}`;
      }
    }, 450);
  };

  // Provider colors
  const getColors = () => {
    switch (provider) {
      case 'github':
        return { accent: '#ffffff', bg: '#24292e', glow: 'rgba(255, 255, 255, 0.08)' };
      case 'leetcode':
        return { accent: '#ffa116', bg: '#1e293b', glow: 'rgba(250, 161, 22, 0.15)' };
      default:
        return { accent: '#4285F4', bg: '#4285F4', glow: 'rgba(99, 102, 241, 0.15)' };
    }
  };

  const colors = getColors();

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      background: 'radial-gradient(circle at top left, #1e293b, #0f172a)',
      fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
      color: '#ffffff',
      padding: '1.5rem'
    }}>
      <div style={{
        background: 'rgba(30, 41, 59, 0.75)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '24px',
        padding: '2.5rem',
        width: '100%',
        maxWidth: '440px',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          top: '-50px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '200px',
          height: '200px',
          background: colors.glow,
          borderRadius: '50%',
          filter: 'blur(60px)',
          zIndex: 0
        }} />

        {loading ? (
          <div style={{ position: 'relative', zIndex: 1, padding: '2rem 0' }}>
            <div style={{
              width: '50px',
              height: '50px',
              border: '3px solid rgba(255, 255, 255, 0.1)',
              borderTopColor: colors.accent,
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 1.5rem'
            }} />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '0.5rem' }}>Exchanging Credentials...</h3>
            <p style={{ fontSize: '0.85rem', color: '#94a3b8' }}>{loadingStep}</p>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        ) : (
          <div style={{ position: 'relative', zIndex: 1 }}>
            
            {/* GOOGLE LOGINS PANEL */}
            {provider === 'google' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '2px', marginBottom: '1.5rem' }}>
                  <span style={{ fontSize: '2.2rem', fontWeight: 900, color: '#4285F4' }}>G</span>
                  <span style={{ fontSize: '2.2rem', fontWeight: 900, color: '#EA4335' }}>o</span>
                  <span style={{ fontSize: '2.2rem', fontWeight: 900, color: '#FBBC05' }}>o</span>
                  <span style={{ fontSize: '2.2rem', fontWeight: 900, color: '#4285F4' }}>g</span>
                  <span style={{ fontSize: '2.2rem', fontWeight: 900, color: '#34A853' }}>l</span>
                  <span style={{ fontSize: '2.2rem', fontWeight: 900, color: '#EA4335' }}>e</span>
                </div>
                
                <h2 style={{ fontSize: '1.35rem', fontWeight: 900, marginBottom: '0.4rem', color: '#f8fafc' }}>Sign in with Google</h2>
                <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '2rem' }}>Choose an email account to authorize <strong style={{ color: '#ffffff' }}>JobTracker</strong></p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', textAlign: 'left' }}>
                  <button
                    onClick={() => initiateSessionRedirect('jaya.sri@gmail.com', 'Jaya', 'Sri')}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.85rem',
                      width: '100%',
                      padding: '0.95rem 1.1rem',
                      background: 'rgba(255, 255, 255, 0.03)',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      borderRadius: '16px',
                      color: '#ffffff',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.06)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
                  >
                    <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: '#4285F4', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', fontWeight: 800 }}>JS</div>
                    <div>
                      <div style={{ fontSize: '0.88rem', fontWeight: 800 }}>jaya sri</div>
                      <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>jaya.sri@gmail.com</div>
                    </div>
                  </button>

                  <button
                    onClick={() => initiateSessionRedirect('demo.user@gmail.com', 'Demo', 'User')}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.85rem',
                      width: '100%',
                      padding: '0.95rem 1.1rem',
                      background: 'rgba(255, 255, 255, 0.03)',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      borderRadius: '16px',
                      color: '#ffffff',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.06)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
                  >
                    <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: '#34A853', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', fontWeight: 800 }}>DU</div>
                    <div>
                      <div style={{ fontSize: '0.88rem', fontWeight: 800 }}>Demo User</div>
                      <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>demo.user@gmail.com</div>
                    </div>
                  </button>
                </div>
              </div>
            )}

            {/* GITHUB LOGINS PANEL */}
            {provider === 'github' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.25rem' }}>
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
                    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.577.688.479C19.138 20.164 22 16.418 22 12c0-5.523-4.477-10-10-10z"/>
                  </svg>
                </div>
                
                <h2 style={{ fontSize: '1.35rem', fontWeight: 900, marginBottom: '0.4rem', color: '#f8fafc' }}>Authorize JobTracker</h2>
                <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '2rem', lineHeight: 1.5 }}>
                  Select a profile identity to authorize access to your GitHub public scopes.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', textAlign: 'left' }}>
                  <button
                    onClick={() => initiateSessionRedirect('jaish15@github.com', 'Jaya', 'Sri')}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.85rem',
                      width: '100%',
                      padding: '0.95rem 1.1rem',
                      background: '#24292e',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '16px',
                      color: '#ffffff',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = '#2c3238'}
                    onMouseLeave={(e) => e.currentTarget.style.background = '#24292e'}
                  >
                    <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: '#ffc01e', color: '#1e293b', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', fontWeight: 800 }}>JS</div>
                    <div>
                      <div style={{ fontSize: '0.88rem', fontWeight: 800 }}>Jaya Sri (jaish15)</div>
                      <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>jaish15@github.com</div>
                    </div>
                  </button>

                  <button
                    onClick={() => initiateSessionRedirect('guest.dev@github.com', 'Guest', 'Developer')}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.85rem',
                      width: '100%',
                      padding: '0.95rem 1.1rem',
                      background: 'rgba(255, 255, 255, 0.03)',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      borderRadius: '16px',
                      color: '#ffffff',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.06)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
                  >
                    <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: '#475569', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', fontWeight: 800 }}>GD</div>
                    <div>
                      <div style={{ fontSize: '0.88rem', fontWeight: 800 }}>Guest Developer</div>
                      <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>guest.dev@github.com</div>
                    </div>
                  </button>
                </div>
              </div>
            )}

            {/* LEETCODE LOGINS PANEL */}
            {provider === 'leetcode' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.25rem' }}>
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="#ffa116">
                    <path d="M16.102 17.93l-2.69 2.6c-.75.68-1.93.68-2.68 0L3.593 13.56a3.81 3.81 0 010-5.38l6.892-6.68c.75-.68 1.93-.68 2.68 0l2.69 2.6a1.23 1.23 0 010 1.75 1.18 1.18 0 01-1.72 0l-2.22-2.15L5.753 9.92c-.25.24-.25.63 0 .87l5.08 4.93L13.1 13.52a1.23 1.23 0 011.72 0l1.28 1.24 1.28-1.24a1.23 1.23 0 011.72 0c.48.46.48 1.22 0 1.68l-2.69 2.6c-.1.1-.1.25 0 .35zM20 7.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"/>
                  </svg>
                </div>
                
                <h2 style={{ fontSize: '1.35rem', fontWeight: 900, marginBottom: '0.4rem', color: '#f8fafc' }}>Connect LeetCode Profile</h2>
                <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '2rem', lineHeight: 1.5 }}>
                  Sync and authenticate using a profile username to retrieve metrics.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', textAlign: 'left', marginBottom: '1.25rem' }}>
                  <button
                    onClick={() => initiateSessionRedirect('jaish15@leetcode.com', 'Jaya', 'Sri', 'jaish15')}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.85rem',
                      width: '100%',
                      padding: '0.95rem 1.1rem',
                      background: 'rgba(250, 161, 22, 0.08)',
                      border: '1px solid rgba(250, 161, 22, 0.2)',
                      borderRadius: '16px',
                      color: '#ffa116',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      fontWeight: 800
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(250, 161, 22, 0.12)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(250, 161, 22, 0.08)'}
                  >
                    <span style={{ fontSize: '1.2rem' }}>⚡</span>
                    <div>
                      <div style={{ fontSize: '0.88rem', fontWeight: 800 }}>Quick Demo Sync (jaish15)</div>
                      <div style={{ fontSize: '0.72rem', color: 'rgba(250, 161, 22, 0.8)' }}>Logs in as jaish15 with default solved count</div>
                    </div>
                  </button>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: '1rem 0', color: '#94a3b8' }}>
                  <hr style={{ flex: 1, border: 'none', borderTop: '1px solid rgba(255,255,255,0.08)' }} />
                  <span style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase' }}>or use custom username</span>
                  <hr style={{ flex: 1, border: 'none', borderTop: '1px solid rgba(255,255,255,0.08)' }} />
                </div>

                <form onSubmit={(e) => {
                  e.preventDefault();
                  if (lcUsername.trim()) {
                    initiateSessionRedirect(`${lcUsername.trim()}@leetcode.com`, lcUsername.trim(), 'LeetCoder', lcUsername.trim());
                  }
                }} style={{ display: 'flex', gap: '0.5rem' }}>
                  <input
                    type="text"
                    required
                    value={lcUsername}
                    onChange={(e) => setLcUsername(e.target.value)}
                    placeholder="Custom username"
                    style={{
                      flex: 1,
                      padding: '0.75rem 1rem',
                      background: 'rgba(0, 0, 0, 0.2)',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      borderRadius: '12px',
                      color: '#ffffff',
                      fontSize: '0.85rem',
                      outline: 'none'
                    }}
                  />
                  <button
                    type="submit"
                    style={{
                      padding: '0.75rem 1.25rem',
                      background: '#ffa116',
                      border: 'none',
                      borderRadius: '12px',
                      color: '#1e293b',
                      fontWeight: 800,
                      fontSize: '0.85rem',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = '#ffb84d'}
                    onMouseLeave={(e) => e.currentTarget.style.background = '#ffa116'}
                  >
                    Sync
                  </button>
                </form>
              </div>
            )}

            <button
              onClick={() => navigate('/login')}
              style={{
                marginTop: '2rem',
                background: 'transparent',
                border: 'none',
                color: '#94a3b8',
                fontSize: '0.78rem',
                cursor: 'pointer',
                textDecoration: 'underline'
              }}
            >
              Cancel and return to login
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
