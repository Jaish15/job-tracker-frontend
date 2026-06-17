import { useState } from 'react';
import '../styles/resume.css';

/* ── Template definitions ──────────────────────────────────── */
const TEMPLATES = [
  {
    id: 'modern',
    name: 'Modern Pro',
    tag: 'Most Popular',
    tagColor: '#6366f1',
    tagBg: '#ede9fe',
    accent: '#6366f1',
    headerBg: '#1e1b4b',
    desc: 'Clean left-side accent with bold header. Great for tech & creative roles.',
    preview: (
      <div className="rt-modern">
        <div className="rt-modern-header">
          <div className="rt-name-block">
            <div className="rt-ph-name" />
            <div className="rt-ph-title" />
          </div>
        </div>
        <div className="rt-modern-body">
          <div className="rt-modern-sidebar">
            <div className="rt-ph-section-label" />
            <div className="rt-ph-line" /><div className="rt-ph-line sm" />
            <div className="rt-ph-section-label mt" />
            <div className="rt-ph-dot-line" /><div className="rt-ph-dot-line" /><div className="rt-ph-dot-line" />
          </div>
          <div className="rt-modern-main">
            <div className="rt-ph-section-label" />
            <div className="rt-ph-line" /><div className="rt-ph-line" /><div className="rt-ph-line sm" />
            <div className="rt-ph-section-label mt" />
            <div className="rt-ph-line" /><div className="rt-ph-line sm" />
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 'classic',
    name: 'Classic Elegance',
    tag: 'ATS Friendly',
    tagColor: '#059669',
    tagBg: '#d1fae5',
    accent: '#059669',
    headerBg: '#f9fafb',
    desc: 'Traditional single-column format. Perfect for finance, law & corporate roles.',
    preview: (
      <div className="rt-classic">
        <div className="rt-classic-header">
          <div className="rt-ph-name center" /><div className="rt-ph-title center" />
          <div className="rt-classic-divider" />
        </div>
        <div className="rt-classic-body">
          <div className="rt-ph-section-label center" />
          <div className="rt-ph-line" /><div className="rt-ph-line" /><div className="rt-ph-line sm" />
          <div className="rt-ph-section-label center mt" />
          <div className="rt-ph-line" /><div className="rt-ph-line sm" />
        </div>
      </div>
    ),
  },
  {
    id: 'creative',
    name: 'Creative Bold',
    tag: 'Stand Out',
    tagColor: '#d97706',
    tagBg: '#fef3c7',
    accent: '#f59e0b',
    headerBg: '#1c1917',
    desc: 'Dark header with a splash of color. Ideal for design, marketing & startups.',
    preview: (
      <div className="rt-creative">
        <div className="rt-creative-header">
          <div className="rt-creative-circle" />
          <div className="rt-creative-info">
            <div className="rt-ph-name light" /><div className="rt-ph-title light" />
          </div>
        </div>
        <div className="rt-creative-body">
          <div className="rt-ph-section-label accent" />
          <div className="rt-ph-line" /><div className="rt-ph-line" /><div className="rt-ph-line sm" />
          <div className="rt-ph-section-label accent mt" />
          <div className="rt-ph-tag" /><div className="rt-ph-tag" /><div className="rt-ph-tag" />
        </div>
      </div>
    ),
  },
  {
    id: 'minimal',
    name: 'Minimal Clean',
    tag: 'Simple',
    tagColor: '#374151',
    tagBg: '#f3f4f6',
    accent: '#374151',
    headerBg: '#ffffff',
    desc: 'Ultra minimal with fine typography. Best for academia and senior positions.',
    preview: (
      <div className="rt-minimal">
        <div className="rt-minimal-header">
          <div className="rt-ph-name dark" /><div className="rt-ph-title" />
          <div className="rt-minimal-line" />
        </div>
        <div className="rt-minimal-body">
          <div className="rt-ph-section-label" />
          <div className="rt-ph-line" /><div className="rt-ph-line" /><div className="rt-ph-line sm" />
          <div className="rt-ph-section-label mt" />
          <div className="rt-ph-line" /><div className="rt-ph-line sm" />
        </div>
      </div>
    ),
  },
  {
    id: 'executive',
    name: 'Executive Suite',
    tag: 'Premium',
    tagColor: '#7c3aed',
    tagBg: '#ede9fe',
    accent: '#7c3aed',
    headerBg: '#2e1065',
    desc: 'Two-column executive layout with rich purple accents. For leadership roles.',
    preview: (
      <div className="rt-executive">
        <div className="rt-executive-header">
          <div className="rt-ph-name light" />
          <div className="rt-ph-title light sm" />
        </div>
        <div className="rt-executive-body">
          <div className="rt-executive-col1">
            <div className="rt-ph-section-label" />
            <div className="rt-ph-line" /><div className="rt-ph-line sm" />
            <div className="rt-ph-dot-line" /><div className="rt-ph-dot-line" />
          </div>
          <div className="rt-executive-col2">
            <div className="rt-ph-section-label" />
            <div className="rt-ph-line" /><div className="rt-ph-line" /><div className="rt-ph-line sm" />
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 'tech',
    name: 'Tech Stack',
    tag: 'Dev Focused',
    tagColor: '#0891b2',
    tagBg: '#e0f2fe',
    accent: '#0891b2',
    headerBg: '#0c4a6e',
    desc: 'Skills-first layout with GitHub/portfolio links. Built for software engineers.',
    preview: (
      <div className="rt-tech">
        <div className="rt-tech-header">
          <div className="rt-ph-name light" />
          <div className="rt-tech-links">
            <div className="rt-tech-link-chip" /><div className="rt-tech-link-chip" />
          </div>
        </div>
        <div className="rt-tech-body">
          <div className="rt-ph-section-label" />
          <div className="rt-tech-skills">
            {[1,2,3,4,5,6].map(i => <div key={i} className="rt-ph-tag blue" />)}
          </div>
          <div className="rt-ph-section-label mt" />
          <div className="rt-ph-line" /><div className="rt-ph-line" /><div className="rt-ph-line sm" />
        </div>
      </div>
    ),
  },
];

const EMPTY_DATA = {
  firstName: '', lastName: '', title: '', email: '', phone: '', location: '', website: '',
  summary: '',
  experience: [
    { id: 1, company: '', role: '', start: '', end: '', current: false, bullets: '' },
  ],
  education: [
    { id: 1, school: '', degree: '', year: '' },
  ],
  skills: '',
};

/* ── Resume Live Preview ───────────────────────────────────── */
function ResumePreview({ data, template }) {
  const t = TEMPLATES.find((t) => t.id === template) || TEMPLATES[0];

  return (
    <div className={`resume-preview-doc rp-${template}`}>
      {/* Header */}
      <div className="rp-header" style={{ background: t.headerBg }}>
        <div className="rp-header-name" style={{ color: t.headerBg === '#ffffff' || t.headerBg === '#f9fafb' ? '#111' : '#fff' }}>
          {data.firstName || 'Your'} {data.lastName || 'Name'}
        </div>
        <div className="rp-header-title" style={{ color: t.headerBg === '#ffffff' || t.headerBg === '#f9fafb' ? '#555' : 'rgba(255,255,255,0.75)' }}>
          {data.title || 'Your Job Title'}
        </div>
        <div className="rp-header-contact" style={{ color: t.headerBg === '#ffffff' || t.headerBg === '#f9fafb' ? '#777' : 'rgba(255,255,255,0.6)' }}>
          {[data.email, data.phone, data.location, data.website].filter(Boolean).join('  ·  ')}
        </div>
      </div>

      <div className="rp-body">
        {/* Summary */}
        {data.summary && (
          <div className="rp-section">
            <div className="rp-section-title" style={{ color: t.accent, borderColor: t.accent }}>Summary</div>
            <p className="rp-text">{data.summary}</p>
          </div>
        )}

        {/* Experience */}
        {data.experience.some(e => e.company || e.role) && (
          <div className="rp-section">
            <div className="rp-section-title" style={{ color: t.accent, borderColor: t.accent }}>Experience</div>
            {data.experience.map((exp) => (
              <div key={exp.id} className="rp-exp-item">
                <div className="rp-exp-header">
                  <span className="rp-exp-role">{exp.role || 'Role'}</span>
                  <span className="rp-exp-dates">{exp.start}{exp.start && (exp.current ? ' – Present' : exp.end ? ` – ${exp.end}` : '')}</span>
                </div>
                <div className="rp-exp-company">{exp.company}</div>
                {exp.bullets && (
                  <ul className="rp-bullets">
                    {exp.bullets.split('\n').filter(Boolean).map((b, i) => (
                      <li key={i}>{b.replace(/^[-•]\s*/, '')}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Education */}
        {data.education.some(e => e.school) && (
          <div className="rp-section">
            <div className="rp-section-title" style={{ color: t.accent, borderColor: t.accent }}>Education</div>
            {data.education.map((edu) => (
              <div key={edu.id} className="rp-edu-item">
                <div className="rp-exp-header">
                  <span className="rp-exp-role">{edu.degree || 'Degree'}</span>
                  <span className="rp-exp-dates">{edu.year}</span>
                </div>
                <div className="rp-exp-company">{edu.school}</div>
              </div>
            ))}
          </div>
        )}

        {/* Skills */}
        {data.skills && (
          <div className="rp-section">
            <div className="rp-section-title" style={{ color: t.accent, borderColor: t.accent }}>Skills</div>
            <div className="rp-skills">
              {data.skills.split(',').map(s => s.trim()).filter(Boolean).map((sk, i) => (
                <span key={i} className="rp-skill-chip" style={{ borderColor: t.accent, color: t.accent }}>{sk}</span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Main Page ─────────────────────────────────────────────── */
export function ResumePage() {
  const [step, setStep]           = useState('choose');   // 'choose' | 'edit'
  const [template, setTemplate]   = useState('modern');
  const [data, setData]           = useState(EMPTY_DATA);
  const [activeSection, setActiveSection] = useState('basics');

  const set = (field, value) => setData(d => ({ ...d, [field]: value }));

  const updateExp = (id, field, value) =>
    setData(d => ({ ...d, experience: d.experience.map(e => e.id === id ? { ...e, [field]: value } : e) }));

  const updateEdu = (id, field, value) =>
    setData(d => ({ ...d, education: d.education.map(e => e.id === id ? { ...e, [field]: value } : e) }));

  const addExp = () => setData(d => ({
    ...d,
    experience: [...d.experience, { id: Date.now(), company: '', role: '', start: '', end: '', current: false, bullets: '' }]
  }));

  const addEdu = () => setData(d => ({
    ...d,
    education: [...d.education, { id: Date.now(), school: '', degree: '', year: '' }]
  }));

  const handlePrint = () => window.print();

  /* ── Template Choose Step ── */
  if (step === 'choose') {
    return (
      <div className="page resume-choose-page">
        <div className="page-header">
          <div>
            <h1>Resume Builder</h1>
            <p className="page-subtitle">Choose a template to get started — then customise every detail</p>
          </div>
        </div>

        <div className="resume-template-grid">
          {TEMPLATES.map((t) => (
            <div
              key={t.id}
              className={`resume-template-card ${template === t.id ? 'selected' : ''}`}
              onClick={() => setTemplate(t.id)}
              id={`template-${t.id}`}
            >
              <div className="rtc-preview-wrap">
                {t.preview}
              </div>
              <div className="rtc-info">
                <div className="rtc-top">
                  <span className="rtc-name">{t.name}</span>
                  <span className="rtc-tag" style={{ color: t.tagColor, background: t.tagBg }}>{t.tag}</span>
                </div>
                <p className="rtc-desc">{t.desc}</p>
              </div>
              {template === t.id && (
                <div className="rtc-check">✓</div>
              )}
            </div>
          ))}
        </div>

        <div className="resume-choose-footer">
          <p className="resume-choose-tip">💡 You can switch templates at any time while editing</p>
          <button
            className="btn btn-primary resume-start-btn"
            id="resume-start-btn"
            onClick={() => setStep('edit')}
          >
            Use {TEMPLATES.find(t => t.id === template)?.name} →
          </button>
        </div>
      </div>
    );
  }

  /* ── Editor Step ── */
  const SECTIONS = [
    { id: 'basics',     label: '👤 Basics'     },
    { id: 'summary',    label: '📝 Summary'    },
    { id: 'experience', label: '💼 Experience' },
    { id: 'education',  label: '🎓 Education'  },
    { id: 'skills',     label: '⚡ Skills'     },
  ];

  return (
    <div className="resume-editor-page">
      {/* Top bar */}
      <div className="resume-editor-topbar">
        <div className="resume-editor-topbar-left">
          <button className="btn btn-outline btn-sm" onClick={() => setStep('choose')}>← Templates</button>
          <span className="resume-editor-title">
            Editing: <strong>{TEMPLATES.find(t => t.id === template)?.name}</strong>
          </span>
        </div>
        <div className="resume-editor-topbar-right">
          {/* Template switcher */}
          <select
            className="form-select"
            style={{ fontSize: '0.82rem', padding: '0.4rem 0.75rem' }}
            value={template}
            onChange={e => setTemplate(e.target.value)}
          >
            {TEMPLATES.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
          </select>
          <button className="btn btn-primary btn-sm" onClick={handlePrint} id="resume-download-btn">
            ⬇ Download PDF
          </button>
        </div>
      </div>

      <div className="resume-editor-layout">
        {/* Left — form panel */}
        <div className="resume-form-panel">
          {/* Section nav */}
          <div className="resume-section-nav">
            {SECTIONS.map(s => (
              <button
                key={s.id}
                className={`resume-section-btn ${activeSection === s.id ? 'active' : ''}`}
                onClick={() => setActiveSection(s.id)}
              >
                {s.label}
              </button>
            ))}
          </div>

          {/* ── Basics ── */}
          {activeSection === 'basics' && (
            <div className="resume-form-section">
              <h3 className="resume-form-title">Personal Information</h3>
              <div className="rf-row">
                <div className="form-group">
                  <label>First Name</label>
                  <input className="form-input" value={data.firstName} onChange={e => set('firstName', e.target.value)} placeholder="Jane" />
                </div>
                <div className="form-group">
                  <label>Last Name</label>
                  <input className="form-input" value={data.lastName} onChange={e => set('lastName', e.target.value)} placeholder="Smith" />
                </div>
              </div>
              <div className="form-group">
                <label>Job Title / Tagline</label>
                <input className="form-input" value={data.title} onChange={e => set('title', e.target.value)} placeholder="Senior Software Engineer" />
              </div>
              <div className="rf-row">
                <div className="form-group">
                  <label>Email</label>
                  <input className="form-input" type="email" value={data.email} onChange={e => set('email', e.target.value)} placeholder="jane@email.com" />
                </div>
                <div className="form-group">
                  <label>Phone</label>
                  <input className="form-input" value={data.phone} onChange={e => set('phone', e.target.value)} placeholder="+1 555-0100" />
                </div>
              </div>
              <div className="rf-row">
                <div className="form-group">
                  <label>Location</label>
                  <input className="form-input" value={data.location} onChange={e => set('location', e.target.value)} placeholder="New York, NY" />
                </div>
                <div className="form-group">
                  <label>Website / LinkedIn</label>
                  <input className="form-input" value={data.website} onChange={e => set('website', e.target.value)} placeholder="linkedin.com/in/jane" />
                </div>
              </div>
            </div>
          )}

          {/* ── Summary ── */}
          {activeSection === 'summary' && (
            <div className="resume-form-section">
              <h3 className="resume-form-title">Professional Summary</h3>
              <p className="resume-form-hint">Write 2–4 sentences that highlight your experience, key skills, and what you bring to the table.</p>
              <textarea
                className="form-textarea"
                rows={6}
                value={data.summary}
                onChange={e => set('summary', e.target.value)}
                placeholder="Results-driven software engineer with 5+ years building scalable web applications. Passionate about clean code, performance, and great user experiences..."
              />
              <div className="resume-char-count">{data.summary.length} characters</div>
            </div>
          )}

          {/* ── Experience ── */}
          {activeSection === 'experience' && (
            <div className="resume-form-section">
              <h3 className="resume-form-title">Work Experience</h3>
              {data.experience.map((exp, idx) => (
                <div key={exp.id} className="resume-exp-block">
                  <div className="resume-exp-num">#{idx + 1}</div>
                  <div className="rf-row">
                    <div className="form-group">
                      <label>Job Title</label>
                      <input className="form-input" value={exp.role} onChange={e => updateExp(exp.id, 'role', e.target.value)} placeholder="Software Engineer" />
                    </div>
                    <div className="form-group">
                      <label>Company</label>
                      <input className="form-input" value={exp.company} onChange={e => updateExp(exp.id, 'company', e.target.value)} placeholder="Acme Corp" />
                    </div>
                  </div>
                  <div className="rf-row">
                    <div className="form-group">
                      <label>Start</label>
                      <input className="form-input" value={exp.start} onChange={e => updateExp(exp.id, 'start', e.target.value)} placeholder="Jan 2022" />
                    </div>
                    <div className="form-group">
                      <label>End</label>
                      <input className="form-input" value={exp.end} onChange={e => updateExp(exp.id, 'end', e.target.value)} placeholder="Dec 2024" disabled={exp.current} />
                    </div>
                  </div>
                  <label className="resume-checkbox-label">
                    <input type="checkbox" checked={exp.current} onChange={e => updateExp(exp.id, 'current', e.target.checked)} />
                    Currently working here
                  </label>
                  <div className="form-group" style={{ marginTop: '0.75rem' }}>
                    <label>Key Achievements (one per line)</label>
                    <textarea
                      className="form-textarea"
                      rows={4}
                      value={exp.bullets}
                      onChange={e => updateExp(exp.id, 'bullets', e.target.value)}
                      placeholder="• Built REST API serving 2M+ requests/day&#10;• Reduced page load time by 40%&#10;• Led team of 4 engineers"
                    />
                  </div>
                </div>
              ))}
              <button className="btn btn-outline btn-sm" onClick={addExp} style={{ width: '100%', marginTop: '0.5rem' }}>
                + Add Another Role
              </button>
            </div>
          )}

          {/* ── Education ── */}
          {activeSection === 'education' && (
            <div className="resume-form-section">
              <h3 className="resume-form-title">Education</h3>
              {data.education.map((edu, idx) => (
                <div key={edu.id} className="resume-exp-block">
                  <div className="resume-exp-num">#{idx + 1}</div>
                  <div className="form-group">
                    <label>School / University</label>
                    <input className="form-input" value={edu.school} onChange={e => updateEdu(edu.id, 'school', e.target.value)} placeholder="MIT" />
                  </div>
                  <div className="rf-row">
                    <div className="form-group">
                      <label>Degree</label>
                      <input className="form-input" value={edu.degree} onChange={e => updateEdu(edu.id, 'degree', e.target.value)} placeholder="B.S. Computer Science" />
                    </div>
                    <div className="form-group">
                      <label>Graduation Year</label>
                      <input className="form-input" value={edu.year} onChange={e => updateEdu(edu.id, 'year', e.target.value)} placeholder="2022" />
                    </div>
                  </div>
                </div>
              ))}
              <button className="btn btn-outline btn-sm" onClick={addEdu} style={{ width: '100%', marginTop: '0.5rem' }}>
                + Add Another School
              </button>
            </div>
          )}

          {/* ── Skills ── */}
          {activeSection === 'skills' && (
            <div className="resume-form-section">
              <h3 className="resume-form-title">Skills</h3>
              <p className="resume-form-hint">Enter skills separated by commas. They'll appear as chips on your resume.</p>
              <textarea
                className="form-textarea"
                rows={4}
                value={data.skills}
                onChange={e => set('skills', e.target.value)}
                placeholder="React, Node.js, TypeScript, PostgreSQL, AWS, Docker, Git, Agile"
              />
              {data.skills && (
                <div className="resume-skills-preview">
                  {data.skills.split(',').map(s => s.trim()).filter(Boolean).map((sk, i) => (
                    <span key={i} className="rp-skill-chip">{sk}</span>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right — live preview */}
        <div className="resume-preview-panel">
          <div className="resume-preview-label">
            <span className="resume-preview-live-dot" /> Live Preview
          </div>
          <div className="resume-preview-scroll">
            <ResumePreview data={data} template={template} />
          </div>
        </div>
      </div>
    </div>
  );
}
