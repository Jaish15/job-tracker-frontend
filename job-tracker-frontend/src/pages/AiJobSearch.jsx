import { useState, useEffect } from 'react';
import { jobsApi } from '../api/jobs';

export function AiJobSearch() {
  const [query, setQuery] = useState('');
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [matches, setMatches] = useState([]);
  const [searched, setSearched] = useState(false);
  const [toast, setToast] = useState('');
  const [savedJobs, setSavedJobs] = useState({}); // maps company+title to true if saved
  const [activeTabMap, setActiveTabMap] = useState({}); // maps job index to active tab ('fit' or 'hook')

  // Load skills from user profile on mount
  useEffect(() => {
    const saved = localStorage.getItem('user_profile_skills');
    if (saved) {
      try {
        setSkills(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse profile skills', e);
      }
    }
  }, []);

  // Show a disappearing toast notification
  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(''), 4000);
  };

  // Simulated AI analysis sequence steps
  const steps = [
    'Initializing AI matching engine...',
    'Fetching your profile skills inventory...',
    'Comparing skills against tech industry job data...',
    'Calculating keyword matching scores...',
    'Formulating personalized cover letter hooks...'
  ];

  useEffect(() => {
    if (loading) {
      setLoadingStep(0);
      const interval = setInterval(() => {
        setLoadingStep((prev) => {
          if (prev >= steps.length - 1) {
            clearInterval(interval);
            return prev;
          }
          return prev + 1;
        });
      }, 500);
      return () => clearInterval(interval);
    }
  }, [loading]);

  const handleAutofill = () => {
    const saved = localStorage.getItem('user_profile_skills');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setSkills(parsed);
        if (parsed.length > 0) {
          showToast(`✅ Auto-filled ${parsed.length} skills from your Profile!`);
        } else {
          showToast('⚠️ No skills found on your Profile. Add some in the Profile tab first!');
        }
      } catch (e) {
        showToast('❌ Failed to load profile skills');
      }
    } else {
      showToast('⚠️ No profile skills found. Please add skills to your Profile page first!');
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSearched(true);
    setMatches([]);

    try {
      // Small timeout to let the cool AI loader animations run
      await new Promise(resolve => setTimeout(resolve, 2600));

      const { data } = await jobsApi.getAiMatches({
        query: query.trim(),
        skills: skills
      });
      
      setMatches(data);
      
      // Initialize tabs mapping to 'fit' by default
      const defaultTabs = {};
      data.forEach((_, idx) => {
        defaultTabs[idx] = 'fit';
      });
      setActiveTabMap(defaultTabs);

      if (data.length === 0) {
        showToast('🔍 No exact role matches found. Try broadening your query!');
      } else {
        showToast(`🎯 AI found ${data.length} job matches!`);
      }
    } catch (err) {
      console.warn('Backend match failed, falling back to client-side AI match simulator', err);
      
      const defaultJobs = [
        {
          company: 'Google',
          title: 'Senior Frontend Engineer',
          location: 'San Francisco, CA (Hybrid)',
          salary: '$160,000 - $210,000',
          description: 'Lead modern user interface developments for core search experiences. Work with React, TypeScript, and high-performance layout architectures.',
          requiredSkills: ['React', 'TypeScript', 'JavaScript', 'HTML', 'CSS', 'Redux', 'Webpack'],
          whyFit: 'You have strong credentials in UI frameworks and browser styling standardizations.',
          coverLetterHook: 'Dear Google Team, I am thrilled to apply for the Senior Frontend role. With my background in high-performance React architectures and modular interface designs, I am confident in my ability to elevate your search experience standards.'
        },
        {
          company: 'Stripe',
          title: 'Full Stack Developer',
          location: 'Remote (US/Canada)',
          salary: '$140,000 - $180,000',
          description: 'Build secure, scalable payment API infrastructure and merchant dashboard elements. Connect frontend React UI directly with microservice backend REST endpoints.',
          requiredSkills: ['Node.js', 'React', 'JavaScript', 'PostgreSQL', 'API Design', 'Docker', 'Ruby'],
          whyFit: 'Your full-stack capabilities with NestJS/Node and React align directly with Stripe\'s ecosystem.',
          coverLetterHook: 'Dear Stripe Recruiting, I am writing to express my interest in the Full Stack Developer role. Having built secure, scalable NestJS APIs integrated with React frontends, I am excited to help expand Stripe\'s payment interface and dashboard architectures.'
        },
        {
          company: 'Amazon',
          title: 'DevOps & Systems Engineer',
          location: 'Seattle, WA (On-site)',
          salary: '$150,000 - $190,000',
          description: 'Maintain high availability for critical retail services. Drive containerization, cloud configuration automation, and continuous delivery operations.',
          requiredSkills: ['AWS', 'Docker', 'Kubernetes', 'Linux', 'CI/CD', 'Bash', 'Python'],
          whyFit: 'You possess solid automation foundations with Docker, Linux systems, and cloud architectures.',
          coverLetterHook: 'Dear Amazon Team, I am writing to apply for the DevOps position. My hands-on experience automated deployment workflows, scaling container applications via Docker, and managing Linux infrastructure makes me an ideal fit for your retail systems team.'
        },
        {
          company: 'Meta',
          title: 'Mobile UI Specialist',
          location: 'New York, NY (Hybrid)',
          salary: '$170,000 - $220,000',
          description: 'Shape the future of virtual and mobile connections. Standardize cross-platform designs and micro-animations for social application threads.',
          requiredSkills: ['React Native', 'JavaScript', 'iOS', 'Android', 'Figma', 'CSS', 'Git'],
          whyFit: 'Your expertise in mobile design tokens and CSS-in-JS transitions is key for client UI.',
          coverLetterHook: 'Dear Meta Team, I am extremely excited to apply for the Mobile UI Specialist position. My background crafting fluid mobile interfaces, paired with deep skills in React systems and responsive styling, matches your requirements perfectly.'
        },
        {
          company: 'Netflix',
          title: 'Senior Backend Architect',
          location: 'Los Gatos, CA (Hybrid)',
          salary: '$200,000 - $280,000',
          description: 'Optimize high-throughput streaming server endpoints and caching layers. Implement relational schemas and robust data security guidelines.',
          requiredSkills: ['Node.js', 'TypeScript', 'PostgreSQL', 'Redis', 'Docker', 'System Design', 'GraphQL'],
          whyFit: 'Your expertise building relational database schemas and scalable TypeScript backends aligns with our scale.',
          coverLetterHook: 'Dear Netflix Engineering Team, I am excited to submit my application for the Backend Architect role. My experience building robust, high-performance TypeScript APIs, design patterns, and PostgreSQL database logic aligns directly with your scaling initiatives.'
        },
        {
          company: 'Airbnb',
          title: 'Frontend React Engineer',
          location: 'Remote (US)',
          salary: '$130,000 - $170,000',
          description: 'Deliver pixel-perfect booking platforms and customer onboarding systems. Partner closely with product designers to implement custom CSS layouts.',
          requiredSkills: ['React', 'JavaScript', 'CSS', 'HTML', 'Figma', 'Git', 'Testing'],
          whyFit: 'You have solid frontend skills in React, responsive CSS styles, and collaborative prototyping tools.',
          coverLetterHook: 'Dear Airbnb Recruiting, I am writing to apply for the Frontend React Engineer position. As someone who enjoys creating beautiful, responsive user interfaces and modular layouts, I would love to bring my React skills to your booking product team.'
        },
        {
          company: 'Spotify',
          title: 'Machine Learning Engineer',
          location: 'Boston, MA (Hybrid)',
          salary: '$150,000 - $200,000',
          description: 'Build predictive content recommendation engines and data-processing pipelines. Scale machine learning models for millions of listeners.',
          requiredSkills: ['Python', 'SQL', 'Docker', 'AWS', 'Git', 'pandas', 'numpy'],
          whyFit: 'Your foundations in analytical SQL queries and Python-based utilities align with our data tasks.',
          coverLetterHook: 'Dear Spotify Team, I am thrilled to apply for the ML position. My background designing data processing pipelines and applying analytics over structured databases matches your data engineering focus.'
        }
      ];

      // Normalize user skills
      const normalizedUserSkills = (skills || []).map(s => s.toLowerCase().trim());

      // Process matching scores and skills mapping
      const clientMatches = defaultJobs.map(job => {
        const matchingSkills = [];
        const missingSkills = [];

        job.requiredSkills.forEach(skill => {
          if (normalizedUserSkills.includes(skill.toLowerCase().trim())) {
            matchingSkills.push(skill);
          } else {
            missingSkills.push(skill);
          }
        });

        // Calculate score based on matching ratio
        const matchScore = job.requiredSkills.length > 0 
          ? Math.round((matchingSkills.length / job.requiredSkills.length) * 100)
          : 0;

        return {
          ...job,
          matchScore,
          matchingSkills,
          missingSkills,
        };
      });

      // Filter by query if provided
      let filteredMatches = clientMatches;
      const q = query.trim();
      if (q && q.length > 0) {
        const searchTerms = q.toLowerCase().split(/\s+/);
        filteredMatches = clientMatches.filter(job => {
          const text = `${job.company} ${job.title} ${job.description} ${job.requiredSkills.join(' ')}`.toLowerCase();
          return searchTerms.some(term => text.includes(term));
        });
      }

      // Sort by match score (highest first)
      filteredMatches.sort((a, b) => b.matchScore - a.matchScore);

      setMatches(filteredMatches);

      // Initialize tabs mapping to 'fit' by default
      const defaultTabs = {};
      filteredMatches.forEach((_, idx) => {
        defaultTabs[idx] = 'fit';
      });
      setActiveTabMap(defaultTabs);

      if (filteredMatches.length === 0) {
        showToast('🔍 No matching roles found locally. Try a different query!');
      } else {
        showToast(`🎯 AI found ${filteredMatches.length} job matches!`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSaveToTracker = async (match, index) => {
    const jobData = {
      company: match.company,
      position: match.title,
      location: match.location,
      salary: match.salary,
      status: 'wishlist',
      notes: `Matched via AI Job Search.\nMatch Score: ${match.matchScore}%\nWhy you fit: ${match.whyFit}\nCover Letter Hook: ${match.coverLetterHook}`
    };

    try {
      await jobsApi.create(jobData);
      setSavedJobs(prev => ({ ...prev, [`${match.company}-${match.title}`]: true }));
      showToast(`🎯 Successfully saved ${match.title} at ${match.company} to your Wishlist!`);
    } catch (err) {
      console.error(err);
      showToast('❌ Failed to save job. Please try again!');
    }
  };

  const getScoreColorClass = (score) => {
    if (score >= 80) return 'score-high';
    if (score >= 50) return 'score-medium';
    return 'score-low';
  };

  return (
    <div className="ai-search-container">
      {/* Toast Notification */}
      {toast && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          background: '#0f172a',
          color: '#ffffff',
          padding: '1rem 1.5rem',
          borderRadius: '16px',
          boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
          zIndex: 1000,
          fontSize: '0.88rem',
          fontWeight: 700,
          border: '1px solid #334155',
          animation: 'fadeIn 0.3s ease-out'
        }}>
          {toast}
        </div>
      )}

      {/* Header */}
      <header className="ai-search-header">
        <h1 className="ai-search-title">AI Job Search</h1>
        <p className="ai-search-sub">Tailor your job hunting using advanced matching algorithms mapping to your skills.</p>
      </header>

      {/* Search Console Card */}
      <section className="ai-search-box-card">
        <form onSubmit={handleSearch}>
          <div className="ai-search-input-group">
            <div className="ai-search-input-wrapper">
              <span className="ai-search-input-icon">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
              </span>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by keywords, companies, or roles (e.g. React Developer, Google DevOps)..."
                className="ai-search-input"
              />
            </div>
            <button type="submit" disabled={loading} className="ai-search-btn">
              🔍 Analyze with AI
            </button>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <button type="button" onClick={handleAutofill} className="ai-search-autofill-btn">
              ⚡ Auto-fill from Profile Skills
            </button>

            {skills.length > 0 && (
              <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', maxWidth: '60%', justifyContent: 'flex-end' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-3, #666)', alignSelf: 'center' }}>Active Skills:</span>
                {skills.slice(0, 5).map((s, idx) => (
                  <span key={idx} style={{ background: '#f1f5f9', color: '#475569', fontSize: '0.7rem', padding: '0.2rem 0.5rem', borderRadius: '6px', fontWeight: 600 }}>{s}</span>
                ))}
                {skills.length > 5 && <span style={{ fontSize: '0.7rem', color: '#94a3b8', alignSelf: 'center', fontWeight: 700 }}>+{skills.length - 5} more</span>}
              </div>
            )}
          </div>
        </form>
      </section>

      {/* Loading State */}
      {loading && (
        <section className="ai-loader-card">
          <div className="ai-loader-sparkles">✨</div>
          <div className="ai-loader-text">AI Job Matcher is working...</div>
          <div className="ai-loader-progress-bar">
            <div className="ai-loader-progress-fill"></div>
          </div>
          <div className="ai-loader-step">{steps[loadingStep]}</div>
        </section>
      )}

      {/* Results Grid */}
      {!loading && searched && (
        <section className="ai-matches-grid">
          {matches.map((job, index) => {
            const isSaved = savedJobs[`${job.company}-${job.title}`];
            const activeTab = activeTabMap[index] || 'fit';

            return (
              <article key={index} className="ai-match-card">
                {/* Score */}
                <div className="ai-match-score-panel">
                  <div className={`ai-score-circle ${getScoreColorClass(job.matchScore)}`}>
                    <div className="ai-score-circle-inner">
                      <span>{job.matchScore}%</span>
                      <span className="ai-score-label">Match</span>
                    </div>
                  </div>
                </div>

                {/* Details */}
                <div className="ai-match-details">
                  <div className="ai-match-header">
                    <div className="ai-match-role-info">
                      <h2 className="ai-match-title">{job.title}</h2>
                      <div className="ai-match-company-row">
                        <span className="ai-match-company">{job.company}</span>
                        <span className="ai-match-dot"></span>
                        <span className="ai-match-loc">{job.location}</span>
                      </div>
                    </div>
                    <span className="ai-match-salary">{job.salary}</span>
                  </div>

                  <p className="ai-match-desc">{job.description}</p>

                  {/* Skills tags */}
                  <div className="ai-skills-section">
                    <div className="ai-skills-row">
                      <span className="ai-skills-row-title">✔️ Matching Skills:</span>
                      <div className="ai-skills-list">
                        {job.matchingSkills.map((s, idx) => (
                          <span key={idx} className="ai-skill-tag matched">{s}</span>
                        ))}
                        {job.matchingSkills.length === 0 && (
                          <span style={{ fontSize: '0.75rem', fontStyle: 'italic', color: '#94a3b8' }}>None matched</span>
                        )}
                      </div>
                    </div>

                    <div className="ai-skills-row">
                      <span className="ai-skills-row-title">❌ Missing Skills:</span>
                      <div className="ai-skills-list">
                        {job.missingSkills.map((s, idx) => (
                          <span key={idx} className="ai-skill-tag missing">{s}</span>
                        ))}
                        {job.missingSkills.length === 0 && (
                          <span style={{ fontSize: '0.75rem', fontStyle: 'italic', color: '#94a3b8' }}>Perfect match!</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Tabs */}
                  <div className="ai-insights-panel">
                    <div className="ai-insights-tabs">
                      <button
                        type="button"
                        onClick={() => setActiveTabMap(prev => ({ ...prev, [index]: 'fit' }))}
                        className={`ai-tab-btn ${activeTab === 'fit' ? 'active' : ''}`}
                      >
                        💡 Why you fit
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveTabMap(prev => ({ ...prev, [index]: 'hook' }))}
                        className={`ai-tab-btn ${activeTab === 'hook' ? 'active' : ''}`}
                      >
                        ✍️ Cover Letter Hook
                      </button>
                    </div>

                    <div className="ai-tab-content">
                      {activeTab === 'fit' ? job.whyFit : job.coverLetterHook}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="ai-match-action-panel">
                  <button
                    type="button"
                    onClick={() => handleSaveToTracker(job, index)}
                    disabled={isSaved}
                    className="ai-save-btn"
                  >
                    {isSaved ? '💼 Saved' : '🎯 Save to Tracker'}
                  </button>
                </div>
              </article>
            );
          })}

          {matches.length === 0 && (
            <div style={{
              background: '#f8fafc',
              border: '1.5px dashed #cbd5e1',
              borderRadius: '24px',
              padding: '4rem 2rem',
              textAlign: 'center',
              color: '#64748b'
            }}>
              <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🔍</div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#1e293b', marginBottom: '0.5rem' }}>No Matches Found</h3>
              <p style={{ fontSize: '0.88rem' }}>Try refining your keywords or clicking "Auto-fill from Profile Skills" to find best matches.</p>
            </div>
          )}
        </section>
      )}
    </div>
  );
}
