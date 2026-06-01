import { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { jobsApi } from '../api/jobs';

const JOB_STATUSES = [
  { value: 'wishlist', label: 'Wishlist' },
  { value: 'applied', label: 'Applied' },
  { value: 'phone_screen', label: 'Phone Screen' },
  { value: 'interview', label: 'Interview' },
  { value: 'offer', label: 'Offer' },
  { value: 'rejected', label: 'Rejected' },
  { value: 'accepted', label: 'Accepted' },
  { value: 'withdrawn', label: 'Withdrawn' },
];

const getTodayString = () => {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const getDefaultInterviewDateString = () => {
  const d = new Date();
  d.setDate(d.getDate() + 7);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const EMPTY_FORM = {
  company: '',
  position: '',
  location: '',
  jobUrl: '',
  salary: '$90k - $120k',
  status: 'wishlist',
  notes: '',
  appliedDate: getTodayString(),
  interviewDate: getDefaultInterviewDateString(),
  offerDate: '',
};


export function JobForm() {
  const { id }       = useParams();
  const navigate     = useNavigate();
  const location     = useLocation();
  const isEditing    = Boolean(id);

  // Pre-fill from "Track This Job" navigation state
  const prefill = location.state?.prefill || {};

  const [form, setForm] = useState(() => {
    const initial = { ...EMPTY_FORM, ...prefill };
    if (!initial.salary) initial.salary = '$90k - $120k';
    if (!initial.interviewDate) initial.interviewDate = getDefaultInterviewDateString();
    return initial;
  });
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(isEditing);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isEditing) {
      jobsApi
        .getOne(id)
        .then(({ data }) => {
          setForm({
            company: data.company || '',
            position: data.position || '',
            location: data.location || '',
            jobUrl: data.jobUrl || '',
            salary: data.salary || '',
            status: data.status || 'wishlist',
            notes: data.notes || '',
            appliedDate: data.appliedDate
              ? data.appliedDate.split('T')[0]
              : '',
            interviewDate: data.interviewDate
              ? data.interviewDate.split('T')[0]
              : '',
            offerDate: data.offerDate ? data.offerDate.split('T')[0] : '',
          });
        })
        .catch(() => setError('Failed to load job'))
        .finally(() => setFetchLoading(false));
    }
  }, [id, isEditing]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.company || !form.position) {
      setError('Company and position are required');
      return;
    }

    setLoading(true);
    try {
      // Clean up empty date strings
      const payload = { ...form };
      if (!payload.appliedDate) delete payload.appliedDate;
      if (!payload.interviewDate) delete payload.interviewDate;
      if (!payload.offerDate) delete payload.offerDate;

      if (isEditing) {
        await jobsApi.update(id, payload);
      } else {
        await jobsApi.create(payload);
      }
      navigate('/jobs');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save job');
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <div className="page-loading">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="page-header">
        <h1>{isEditing ? 'Edit Job Application' : 'Add Job Application'}</h1>
      </div>

      <div className="form-card">
        <form onSubmit={handleSubmit} noValidate>
          {error && <div className="alert alert-error">{error}</div>}

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="company">Company *</label>
              <input
                id="company"
                name="company"
                type="text"
                required
                value={form.company}
                onChange={handleChange}
                placeholder="Acme Corp"
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label htmlFor="position">Position *</label>
              <input
                id="position"
                name="position"
                type="text"
                required
                value={form.position}
                onChange={handleChange}
                placeholder="Senior Software Engineer"
                className="form-input"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="location">Location</label>
              <input
                id="location"
                name="location"
                type="text"
                value={form.location}
                onChange={handleChange}
                placeholder="New York, NY / Remote"
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label htmlFor="salary">Salary Range</label>
              <input
                id="salary"
                name="salary"
                type="text"
                value={form.salary}
                onChange={handleChange}
                placeholder="$100k - $130k"
                className="form-input"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="status">Status</label>
              <select
                id="status"
                name="status"
                value={form.status}
                onChange={handleChange}
                className="form-select"
              >
                {JOB_STATUSES.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="jobUrl">Job Posting URL</label>
              <input
                id="jobUrl"
                name="jobUrl"
                type="url"
                value={form.jobUrl}
                onChange={handleChange}
                placeholder="https://..."
                className="form-input"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="appliedDate">Applied Date</label>
              <input
                id="appliedDate"
                name="appliedDate"
                type="date"
                value={form.appliedDate}
                onChange={handleChange}
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label htmlFor="interviewDate">Interview Date</label>
              <input
                id="interviewDate"
                name="interviewDate"
                type="date"
                value={form.interviewDate}
                onChange={handleChange}
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label htmlFor="offerDate">Offer Date</label>
              <input
                id="offerDate"
                name="offerDate"
                type="date"
                value={form.offerDate}
                onChange={handleChange}
                className="form-input"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="notes">Notes</label>
            <textarea
              id="notes"
              name="notes"
              value={form.notes}
              onChange={handleChange}
              placeholder="Any notes about this application..."
              className="form-textarea"
              rows={4}
            />
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => navigate('/jobs')}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading
                ? 'Saving...'
                : isEditing
                ? 'Update Job'
                : 'Add Job'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
