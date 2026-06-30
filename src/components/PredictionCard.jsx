import { Link } from "react-router-dom";
import { formatCurrency } from "../utils/formatters";

const coinInfo = {
  BTC: { label: "Bitcoin", color: "#F7931A", path: "/bitcoin", icon: "₿" },
  ETH: { label: "Ethereum", color: "#627EEA", path: "/ethereum", icon: "Ξ" },
};

export default function PredictionCard({ coin, prediction, lastClose }) {
  const info = coinInfo[coin];
  const predicted = prediction?.h7 ?? null;
  const close = lastClose;
  const hasData = predicted != null && close != null && close !== 0;
  const pct = hasData ? ((predicted - close) / close) * 100 : null;
  const isUp = pct !== null && pct >= 0;
  const directionText = hasData ? (isUp ? "Prediksi naik" : "Prediksi turun") : null;

  return (
    <Link
      to={info.path}
      className="group relative flex flex-col gap-3 rounded-2xl border border-slate-200 border-t-4 bg-white p-5 shadow-sm transition-all hover:scale-[1.02] hover:shadow-lg"
      style={{ borderTopColor: info.color }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span
            className="flex size-9 items-center justify-center rounded-lg text-lg font-bold text-white"
            style={{ background: `linear-gradient(135deg, ${info.color}, ${info.color}cc)` }}
          >
            {info.icon}
          </span>
          <div>
            <h3 className="text-sm font-semibold leading-tight text-slate-900">{info.label}</h3>
            <span className="text-[11px] font-medium uppercase tracking-wider text-slate-400">{coin} &middot; H7</span>
          </div>
        </div>

        {hasData && (
          <div className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold ${isUp ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"}`}>
            <span className="text-[10px]">{isUp ? "\u25B2" : "\u25BC"}</span>
            <span>{Math.abs(pct).toFixed(2)}%</span>
          </div>
        )}
      </div>

      <div className="flex items-baseline gap-1">
        <span className="text-2xl font-extrabold tracking-tight text-slate-900">
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

      <div className="absolute right-5 top-1/2 flex size-9 -translate-y-1/2 items-center justify-center rounded-full bg-slate-100 text-sm text-slate-400 transition group-hover:bg-brand-600 group-hover:text-white">
        &rarr;
      </div>
    </Link>
  );
}
