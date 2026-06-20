import { useEffect, useMemo, useState } from "react";
import DashboardShell from "./components/DashboardShell";
import HistoryTable from "./components/HistoryTable";
import MetricCard from "./components/MetricCard";
import PredictionChart from "./components/PredictionChart";
import PredictionForm from "./components/PredictionForm";
import SectionHeader from "./components/SectionHeader";
import Badge from "./components/Badge";
import { createPrediction, getPredictionHistory } from "./services/api";
import {
  calculateErrorPercent,
  formatCurrency,
  formatDate,
  formatPercent,
} from "./utils/formatters";

export default function App() {
  const [history, setHistory] = useState([]);
  const [form, setForm] = useState({ asset: "BTC", horizon: 1 });
  const [latestPrediction, setLatestPrediction] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  async function loadHistory() {
    const payload = await getPredictionHistory();
    setHistory(payload.data || []);
  }

  useEffect(() => {
    loadHistory().catch((err) => setError(err.message));
  }, []);

  const latest = latestPrediction || history[0] || null;
  const averageError = useMemo(() => {
    const errors = history
      .map((row) =>
        calculateErrorPercent(row.predicted_price, row.actual_price),
      )
      .filter(Number.isFinite);

    if (!errors.length) {
      return null;
    }

    return errors.reduce((total, value) => total + value, 0) / errors.length;
  }, [history]);

  async function handleSubmit(event) {
    event.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const result = await createPrediction(form);
      setLatestPrediction(result);
      await loadHistory();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <DashboardShell>
      <header className="topbar" id="overview">
        <div>
          <p className="eyebrow">Dashboard Prediksi</p>
          <h2>Evaluasi harga crypto dengan model CNN-LSTM</h2>
        </div>
        <Badge tone="success">Model aktif</Badge>
      </header>

      {error ? <div className="alert">{error}</div> : null}

      <section className="metrics-grid" aria-label="Prediction metrics">
        <MetricCard
          label="Prediksi terbaru"
          value={formatCurrency(latest?.predicted_price)}
          meta={
            latest
              ? `${latest.asset} untuk ${latest.horizon} hari`
              : "Belum ada data"
          }
          tone="primary"
        />
        <MetricCard
          label="Harga aktual"
          value={formatCurrency(latest?.actual_price)}
          meta={
            latest ? formatDate(latest.prediction_date) : "Menunggu prediksi"
          }
        />
        <MetricCard
          label="Error terbaru"
          value={formatPercent(
            calculateErrorPercent(
              latest?.predicted_price,
              latest?.actual_price,
            ),
          )}
          meta="Absolute percentage error"
          tone="danger"
        />
        <MetricCard
          label="Rata-rata error"
          value={formatPercent(averageError)}
          meta={`${history.length} histori tersimpan`}
          tone="success"
        />
      </section>

      <section className="content-grid">
        <div className="panel" id="prediction">
          <SectionHeader eyebrow="Inference" title="Buat prediksi baru" />
          <PredictionForm
            form={form}
            onChange={setForm}
            onSubmit={handleSubmit}
            isLoading={isLoading}
          />
        </div>

        <div className="panel">
          <SectionHeader eyebrow="Model" title="Konfigurasi run" />
          <dl className="model-specs">
            <div>
              <dt>Arsitektur</dt>
              <dd>CNN-LSTM</dd>
            </div>
            <div>
              <dt>Aset</dt>
              <dd>BTC dan ETH</dd>
            </div>
            <div>
              <dt>Horizon</dt>
              <dd>1, 3, 7 hari</dd>
            </div>
            <div>
              <dt>Batch</dt>
              <dd>16</dd>
            </div>
          </dl>
        </div>
      </section>

      <section className="panel">
        <SectionHeader eyebrow="Trend" title="Prediksi vs aktual" />
        <PredictionChart rows={history} />
      </section>

      <section className="panel" id="history">
        <SectionHeader eyebrow="Riwayat" title="Histori prediksi" />
        <HistoryTable rows={history} />
      </section>
    </DashboardShell>
  );
}
