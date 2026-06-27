import { Link } from "react-router-dom";
import Badge from "./Badge";
import { formatCurrency } from "../utils/formatters";

const coinInfo = {
  BTC: { label: "Bitcoin", color: "#F7931A", path: "/bitcoin" },
  ETH: { label: "Ethereum", color: "#627EEA", path: "/ethereum" },
};

export default function CoinCard({ coin, predictionCount, lastPrice }) {
  const info = coinInfo[coin];

  return (
    <Link
      to={info.path}
      className="group flex items-center gap-5 rounded-2xl border border-slate-200 border-t-4 bg-white p-8 shadow-sm transition-all hover:scale-[1.02] hover:shadow-lg cursor-pointer"
      style={{ borderTopColor: info.color }}
    >
      <div
        className="flex size-16 shrink-0 items-center justify-center rounded-2xl text-3xl font-extrabold text-white"
        style={{ background: `linear-gradient(135deg, ${info.color}, ${info.color}dd)` }}
      >
        {coin === "BTC" ? "₿" : "Ξ"}
      </div>
      <div className="min-w-0 flex-1">
        <h3 className="text-xl font-bold tracking-tight">{info.label}</h3>
        <span className="text-sm font-semibold text-slate-500">{coin}</span>
        <div className="mt-1.5 flex flex-wrap items-center gap-2">
          {lastPrice ? (
            <span className="text-lg font-bold text-slate-900">
              {formatCurrency(lastPrice)}
            </span>
          ) : null}
          {predictionCount != null ? (
            <Badge tone="neutral">{predictionCount} prediksi</Badge>
          ) : null}
        </div>
      </div>
      <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-slate-50 text-xl text-slate-400 transition group-hover:bg-brand-600 group-hover:text-white">
        &rarr;
      </div>
    </Link>
  );
}
