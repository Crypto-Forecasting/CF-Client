import { useEffect, useState } from "react";
import { getStats } from "../services/api";
import PredictionCard from "../components/PredictionCard";
import ErrorTable from "../components/ErrorTable";
import Badge from "../components/Badge";

export default function Landing() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    getStats()
      .then(setStats)
      .catch((err) => setError(err.message));
  }, []);

  return (
    <div className="flex flex-col gap-8">
      <section className="hero-bg relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-600 via-slate-700 to-slate-800 px-8 py-12 lg:px-14 lg:py-16">
        <div className="relative z-10">
          <Badge tone="success">CNN-LSTM Hybrid Model</Badge>
          <h1 className="mt-4 mb-3 text-3xl font-extrabold leading-tight tracking-tight text-white lg:text-5xl">
            Crypto Forecasting
          </h1>
          <p className="max-w-xl text-base leading-relaxed text-slate-300 lg:text-lg">
            Prediksi harga Bitcoin &amp; Ethereum menggunakan arsitektur deep learning
            CNN-LSTM. Data real-time dari Binance, analisis teknikal RSI &amp; MACD,
            serta sentimen pasar Fear &amp; Greed Index.
          </p>
        </div>
        <div className="absolute -right-6 -top-6 size-64 rounded-full bg-white/[0.04] blur-3xl" />
        <div className="absolute -bottom-10 left-1/3 size-48 rounded-full bg-brand-500/[0.06] blur-2xl" />
      </section>

      {error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">
          {error}
        </div>
      ) : null}

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <PredictionCard
          coin="BTC"
          prediction={stats?.btcPrediction}
          lastClose={stats?.btcLastClose}
        />
        <PredictionCard
          coin="ETH"
          prediction={stats?.ethPrediction}
          lastClose={stats?.ethLastClose}
        />
      </section>

      <section>
        <div className="mb-4 flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-widest text-slate-500">
            Performa Model
          </span>
          <span className="h-px flex-1 bg-slate-200" />
        </div>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <ErrorTable coin="BTC" horizonErrors={stats?.btcHorizonErrors} />
          <ErrorTable coin="ETH" horizonErrors={stats?.ethHorizonErrors} />
        </div>
      </section>
    </div>
  );
}
