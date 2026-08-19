/** LoadingSpinner — show while data is loading */
export default function LoadingSpinner({ message = 'Loading...' }) {
  return (
    <div className="spinner-wrapper">
      <div style={{ textAlign: 'center' }}>
        <div className="spinner" />
        <p style={{ marginTop: 12, color: 'var(--text-secondary)', fontSize: 14 }}>{message}</p>
      </div>
    </div>
  );
}
