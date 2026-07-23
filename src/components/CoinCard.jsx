import { Link } from "react-router-dom";
import { Bitcoin, ArrowRight } from "lucide-react";
import EthereumIcon from "./icons/EthereumIcon";
import Badge from "./Badge";
import { formatCurrency } from "../utils/formatters";

const coinInfo = {
  BTC: { label: "Bitcoin", color: "#F7931A", path: "/bitcoin", Icon: Bitcoin },
  ETH: { label: "Ethereum", color: "#627EEA", path: "/ethereum", Icon: EthereumIcon },
};

export default function CoinCard({ coin, predictionCount, lastPrice }) {
  const info = coinInfo[coin];
  const CoinIcon = info.Icon;

  return (
    <Link
      to={info.path}
      className="group relative flex items-center gap-5 overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-7 shadow-card transition-all hover:-translate-y-0.5 hover:shadow-lift"
    >
      <span
        className="absolute inset-y-0 left-0 w-1.5"
        style={{ background: `linear-gradient(to bottom, ${info.color}, ${info.color}66)` }}
      />
      <div
        className="flex size-16 shrink-0 items-center justify-center rounded-2xl text-white shadow-soft"
        style={{ background: `linear-gradient(135deg, ${info.color}, ${info.color}cc)` }}
      >
        <CoinIcon className="size-8" strokeWidth={2.25} />
      </div>
      <div className="min-w-0 flex-1">
        <h3 className="text-xl font-bold tracking-tight text-slate-900">{info.label}</h3>
        <span className="text-sm font-semibold text-slate-500">{coin}</span>
        <div className="mt-1.5 flex flex-wrap items-center gap-2">
          {lastPrice ? (
            <span className="font-mono text-lg font-bold text-slate-900">
              {formatCurrency(lastPrice)}
            </span>
          ) : null}
          {predictionCount != null ? (
            <Badge tone="neutral">{predictionCount} prediksi</Badge>
          ) : null}
        </div>
      </div>
      <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-slate-50 text-slate-400 ring-1 ring-inset ring-slate-100 transition group-hover:bg-brand-600 group-hover:text-white group-hover:ring-brand-600">
        <ArrowRight className="size-5" strokeWidth={2.5} />
      </div>
    </Link>
  );
}