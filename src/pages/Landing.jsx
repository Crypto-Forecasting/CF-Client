import { useEffect, useState } from "react";
import { Sparkles, GaugeCircle, BarChart3 } from "lucide-react";
import { getStats } from "../services/api";
import PredictionCard from "../components/PredictionCard";
import ErrorTable from "../components/ErrorTable";
import Badge from "../components/Badge";
import SectionHeader from "../components/SectionHeader";

export default function Landing() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    getStats()
      .then(setStats)
      .catch((err) => setError(err.message));
  }, []);

  return (
    <div className="flex flex-col gap-10">
      <section className="hero-bg hero-grid relative overflow-hidden rounded-3xl px-8 py-12 lg:px-14 lg:py-16">
        <div className="relative z-10 max-w-2xl">
          <Badge tone="brand" icon={Sparkles}>
            CNN-LSTM Hybrid Model
          </Badge>
          <h1 className="mt-5 mb-4 text-4xl font-extrabold leading-[1.05] tracking-tight text-white lg:text-6xl">
            Crypto Forecasting
          </h1>
          <p className="max-w-xl text-base leading-relaxed text-slate-200/90 lg:text-lg">
            Prediksi harga Bitcoin &amp; Ethereum menggunakan arsitektur
            CNN-LSTM. Data real-time dari Binance, analisis teknikal RSI &amp;
            MACD.
          </p>
        </div>
        <div className="absolute -right-12 -top-12 size-72 rounded-full bg-brand-400/20 blur-3xl" />
        <div className="absolute -bottom-16 right-1/3 size-56 rounded-full bg-indigo-400/10 blur-2xl" />
      </section>

      {error ? (
        <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">
          <span className="mt-0.5 size-1.5 shrink-0 rounded-full bg-red-500" />
          {error}
        </div>
      ) : null}

      <section>
        <SectionHeader
          eyebrow="Prediksi Terkini"
          title="Ringkasan Prediksi 7 Hari"
          icon={GaugeCircle}
        />
        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
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
        </div>
      </section>

      <section>
        <SectionHeader
          eyebrow="Performa Model"
          title="Evaluasi Akurasi Per Horizon"
          icon={BarChart3}
        />
        <div className="mt-5 grid grid-cols-1 gap-4 lg:grid-cols-2">
          <ErrorTable coin="BTC" horizonErrors={stats?.btcHorizonErrors} />
          <ErrorTable coin="ETH" horizonErrors={stats?.ethHorizonErrors} />
        </div>
      </section>
    </div>
  );
}
