import { Link } from "react-router-dom";
import { Bitcoin, ArrowRight, TrendingUp, TrendingDown } from "lucide-react";
import EthereumIcon from "./icons/EthereumIcon";
import { formatCurrency } from "../utils/formatters";

const coinInfo = {
  BTC: { label: "Bitcoin", color: "#F7931A", path: "/bitcoin", Icon: Bitcoin },
  ETH: { label: "Ethereum", color: "#627EEA", path: "/ethereum", Icon: EthereumIcon },
};

export default function PredictionCard({ coin, prediction, lastClose }) {
  const info = coinInfo[coin];
  const CoinIcon = info.Icon;
  const predicted = prediction?.h7 ?? null;
  const close = lastClose;
  const hasData = predicted != null && close != null && close !== 0;
  const pct = hasData ? ((predicted - close) / close) * 100 : null;
  const isUp = pct !== null && pct >= 0;
  const directionText = hasData ? (isUp ? "Prediksi naik" : "Prediksi turun") : null;
  const TrendIcon = isUp ? TrendingUp : TrendingDown;

  return (
    <Link
      to={info.path}
      className="group relative flex flex-col gap-3 overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-5 shadow-card transition-all hover:-translate-y-0.5 hover:shadow-lift"
    >
      <span
        className="absolute inset-x-0 top-0 h-1 transition group-hover:h-1.5"
        style={{ background: `linear-gradient(to right, ${info.color}, ${info.color}66)` }}
      />

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span
            className="flex size-10 items-center justify-center rounded-xl text-white shadow-soft"
            style={{ background: `linear-gradient(135deg, ${info.color}, ${info.color}cc)` }}
          >
            <CoinIcon className="size-5" strokeWidth={2.25} />
          </span>
          <div>
            <h3 className="text-sm font-semibold leading-tight text-slate-900">{info.label}</h3>
            <span className="text-[11px] font-medium uppercase tracking-wider text-slate-400">
              {coin} &middot; H7
            </span>
          </div>
        </div>

        {hasData && (
          <div
            className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold ring-1 ring-inset ${
              isUp
                ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
                : "bg-red-50 text-red-700 ring-red-200"
            }`}
          >
            <TrendIcon className="size-3" strokeWidth={2.5} />
            <span>{Math.abs(pct).toFixed(2)}%</span>
          </div>
        )}
      </div>

      <div className="flex items-baseline gap-1">
        <span className="font-mono text-2xl font-extrabold tracking-tight text-slate-900">
          {predicted != null ? formatCurrency(predicted) : <span className="text-slate-300">—</span>}
        </span>
      </div>

      <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-400">
        {directionText ? (
          <>
            <span className={`size-1.5 rounded-full ${isUp ? "bg-emerald-500" : "bg-red-500"}`} />
            {directionText}
          </>
        ) : (
          <span className="text-slate-300">Data belum tersedia</span>
        )}
      </div>

      <div className="absolute right-5 top-1/2 flex size-9 -translate-y-1/2 items-center justify-center rounded-full bg-slate-100 text-slate-400 ring-1 ring-inset ring-slate-200/60 transition group-hover:bg-brand-600 group-hover:text-white group-hover:ring-brand-600">
        <ArrowRight className="size-4" strokeWidth={2.5} />
      </div>
    </Link>
  );
}