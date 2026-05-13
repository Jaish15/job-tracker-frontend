import { Link } from 'react-router-dom';

const STATUS_COLORS = {
  wishlist: '#6366f1',
  applied: '#3b82f6',
  phone_screen: '#f59e0b',
  interview: '#8b5cf6',
  offer: '#10b981',
  rejected: '#ef4444',
  accepted: '#059669',
  withdrawn: '#6b7280',
};

const STATUS_LABELS = {
  wishlist: 'Wishlist',
  applied: 'Applied',
  phone_screen: 'Phone Screen',
  interview: 'Interview',
  offer: 'Offer',
  rejected: 'Rejected',
  accepted: 'Accepted',
  withdrawn: 'Withdrawn',
};

export function JobCard({ job, onDelete }) {
  const statusColor = STATUS_COLORS[job.status] || '#6b7280';

  return (
    <div className="job-card">
      <div className="job-card-header">
        <div>
          <h3 className="job-position">{job.position}</h3>
          <p className="job-company">{job.company}</p>
        </div>
        <span
          className="status-badge"
          style={{ backgroundColor: statusColor }}
        >
          {STATUS_LABELS[job.status] || job.status}
        </span>
      </div>

      <div className="job-card-body">
        {job.location && (
          <p className="job-detail">
            <span className="detail-icon">📍</span> {job.location}
          </p>
        )}
        {job.salary && (
          <p className="job-detail">
            <span className="detail-icon">💰</span> {job.salary}
          </p>
        )}
        {job.appliedDate && (
          <p className="job-detail">
            <span className="detail-icon">📅</span> Applied:{' '}
            {new Date(job.appliedDate).toLocaleDateString()}
          </p>
        )}
        {job.notes && (
          <p className="job-notes">{job.notes}</p>
        )}
      </div>

      <div className="job-card-actions">
        {job.jobUrl && (
          <a
            href={job.jobUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-outline btn-sm"
          >
            View Posting
          </a>
        )}
        <Link to={`/jobs/${job.id}/edit`} className="btn btn-secondary btn-sm">
          Edit
        </Link>
        <button
          className="btn btn-danger btn-sm"
          onClick={() => onDelete(job.id)}
        >
          Delete
        </button>
      </div>
    </div>
  );
}
