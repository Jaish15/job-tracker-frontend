export function StatsCard({ label, value, color, icon }) {
  return (
    <div className="stats-card" style={{ borderTopColor: color }}>
      <div className="stats-icon">{icon}</div>
      <div className="stats-content">
        <span className="stats-value">{value}</span>
        <span className="stats-label">{label}</span>
      </div>
    </div>
  );
}
