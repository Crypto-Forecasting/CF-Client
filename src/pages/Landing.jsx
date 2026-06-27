import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getStats } from "../services/api";
import CoinCard from "../components/CoinCard";
import MetricCard from "../components/MetricCard";
import Badge from "../components/Badge";
import { formatPercent, accuracyTone, formatCurrency } from "../utils/formatters";

export default function Landing() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    getStats()
      .then(setStats)
      .catch((err) => setError(err.message));
  }, []);

  const avgMapeTone = accuracyTone(stats?.averageMape);

  return (
    <>
      <section className="hero-bg relative overflow-hidden rounded-2xl bg-gradient-to-br from-brand-600 via-brand-700 to-slate-900 p-16 text-white">
        <div>
          <Badge tone="success">CNN-LSTM Hybrid Model</Badge>
          <h1 className="mt-4 mb-3.5 text-4xl font-extrabold leading-tight tracking-tight lg:text-6xl">
            Crypto Forecasting
          </h1>
          <p className="max-w-xl text-lg leading-relaxed text-white/80">
            Prediksi harga Bitcoin &amp; Ethereum menggunakan arsitektur deep
            learning CNN-LSTM. Data real-time dari Binance, analisis teknikal
            RSI &amp; MACD, serta sentimen pasar Fear &amp; Greed Index.
          </p>
          <div className="mt-7 flex gap-3 max-sm:flex-col">
            <Link
              to="/bitcoin"
              className="inline-flex items-center gap-1.5 rounded-xl bg-white px-7 py-3.5 font-bold text-brand-600 shadow-lg transition hover:-translate-y-0.5"
            >
              Bitcoin &rarr;
            </Link>
            <Link
              to="/ethereum"
              className="inline-flex items-center gap-1.5 rounded-xl bg-white/10 px-7 py-3.5 font-bold text-white backdrop-blur transition hover:bg-white/20"
            >
              Ethereum &rarr;
            </Link>
          </div>
        </div>
      </section>

      {error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 font-medium text-red-800">
          {error}
        </div>
      ) : null}

      <section className="grid grid-cols-1 gap-5 lg:grid-cols-2" aria-label="Pilih cryptocurrency">
        <CoinCard coin="BTC" predictionCount={stats?.btcCount} lastPrice={stats?.btcLastPrice} />
        <CoinCard coin="ETH" predictionCount={stats?.ethCount} lastPrice={stats?.ethLastPrice} />
      </section>

      <section className="grid grid-cols-2 gap-4 lg:grid-cols-3" aria-label="Global stats">
        <MetricCard label="Total Prediksi" value={stats?.totalPredictions ?? "—"} meta="Seluruh koin" tone="primary" />
        <MetricCard label="MAPE" value={stats?.averageMape ? formatPercent(stats.averageMape) : "—"} meta="Rata-rata error %" tone={avgMapeTone} />
        <MetricCard label="MAE" value={stats?.averageMae ? formatCurrency(stats.averageMae) : "—"} meta="Rata-rata absolute error" tone={avgMapeTone} />
        <MetricCard label="RMSE" value={stats?.averageRmse ? formatCurrency(stats.averageRmse) : "—"} meta="Root mean squared error" tone={avgMapeTone} />
        <MetricCard label="Model Aktif" value={stats?.activeModels ?? 6} meta="BTC & ETH × 3 horizon" />
        <MetricCard label="BTC / ETH" value={`${stats?.btcCount ?? 0} / ${stats?.ethCount ?? 0}`} meta="Prediksi per koin" tone="danger" />
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <dl className="mt-5 grid grid-cols-2 gap-4">
          <div className="rounded-xl bg-slate-50 p-4">
            <dt className="text-xs font-bold uppercase tracking-widest text-slate-500">Arsitektur</dt>
            <dd className="mt-2 text-base font-bold text-slate-900">CNN-LSTM</dd>
          </div>
          <div className="rounded-xl bg-slate-50 p-4">
            <dt className="text-xs font-bold uppercase tracking-widest text-slate-500">Aset</dt>
            <dd className="mt-2 text-base font-bold text-slate-900">BTC dan ETH</dd>
          </div>
          <div className="rounded-xl bg-slate-50 p-4">
            <dt className="text-xs font-bold uppercase tracking-widest text-slate-500">Horizon</dt>
            <dd className="mt-2 text-base font-bold text-slate-900">Fitur Lengkap</dd>
          </div>
          <div className="rounded-xl bg-slate-50 p-4">
            <dt className="text-xs font-bold uppercase tracking-widest text-slate-500">Batch Size</dt>
            <dd className="mt-2 text-base font-bold text-slate-900">16</dd>
          </div>
        </dl>
      </section>
    </>
  );
}
