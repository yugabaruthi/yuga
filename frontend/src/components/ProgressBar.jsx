/**
 * ProgressBar.jsx — Animated progress bar
 * Props: percentage (0–100), label, showLabel
 */
export default function ProgressBar({ percentage = 0, label = '', showLabel = true }) {
  const pct = Math.min(100, Math.max(0, percentage));
  return (
    <div>
      {showLabel && (
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
          <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{label}</span>
          <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--primary)' }}>{pct}%</span>
        </div>
      )}
      <div className="progress-track">
        <div className="progress-fill" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
