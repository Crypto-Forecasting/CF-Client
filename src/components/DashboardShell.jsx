export default function DashboardShell({ children }) {
  return (
    <div className="dashboard-shell">
      <aside className="sidebar">
        <div>
          <p className="eyebrow">CNN-LSTM</p>
          <h1>Crypto Forecast</h1>
        </div>
        <nav className="sidebar__nav" aria-label="Dashboard navigation">
          <a href="#overview">Overview</a>
          <a href="#prediction">Prediction</a>
          <a href="#history">History</a>
        </nav>
        <div className="sidebar__footer">
          <span className="status-dot" />
          Backend API: port 4000
        </div>
      </aside>
      <main className="dashboard-main">{children}</main>
    </div>
  );
}
