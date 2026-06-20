import EmptyState from "./EmptyState";

function getPoint(value, index, rows, min, max) {
  const width = 720;
  const height = 260;
  const padding = 24;
  const range = max - min || 1;
  const x = padding + (index / Math.max(rows.length - 1, 1)) * (width - padding * 2);
  const y = height - padding - ((value - min) / range) * (height - padding * 2);

  return `${x},${y}`;
}

export default function PredictionChart({ rows }) {
  const chartRows = rows
    .filter((row) => Number.isFinite(Number(row.predicted_price)))
    .slice()
    .reverse()
    .slice(-12);

  if (chartRows.length < 2) {
    return (
      <EmptyState
        title="Data chart belum cukup"
        message="Minimal dua prediksi diperlukan untuk menampilkan tren."
      />
    );
  }

  const values = chartRows.flatMap((row) => [
    Number(row.predicted_price),
    Number(row.actual_price),
  ]).filter(Number.isFinite);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const predictedPoints = chartRows
    .map((row, index) => getPoint(Number(row.predicted_price), index, chartRows, min, max))
    .join(" ");
  const actualPoints = chartRows
    .map((row, index) => getPoint(Number(row.actual_price), index, chartRows, min, max))
    .join(" ");

  return (
    <div className="chart">
      <svg viewBox="0 0 720 260" role="img" aria-label="Prediction trend chart">
        <line x1="24" x2="696" y1="236" y2="236" />
        <line x1="24" x2="24" y1="24" y2="236" />
        <polyline className="chart__actual" points={actualPoints} />
        <polyline className="chart__predicted" points={predictedPoints} />
      </svg>
      <div className="chart__legend">
        <span><i className="legend-dot legend-dot--actual" /> Aktual</span>
        <span><i className="legend-dot legend-dot--predicted" /> Prediksi</span>
      </div>
    </div>
  );
}
