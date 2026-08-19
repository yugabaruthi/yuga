/**
 * StatCard.jsx — Dashboard stat display card
 * Props: icon, value, label, colorClass
 */
export default function StatCard({ icon, value, label, colorClass = 'purple' }) {
  return (
    <div className="stat-card">
      <div className={`stat-icon ${colorClass}`}>{icon}</div>
      <div>
        <div className="stat-value">{value}</div>
        <div className="stat-label">{label}</div>
      </div>
    </div>
  );
}
