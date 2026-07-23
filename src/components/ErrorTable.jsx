import { Bitcoin, Gauge, CheckCircle2, AlertTriangle, ShieldAlert } from "lucide-react";
import EthereumIcon from "./icons/EthereumIcon";
import { formatPercent, formatCurrency, accuracyTone } from "../utils/formatters";

const coinIcons = { BTC: Bitcoin, ETH: EthereumIcon };

const toneColors = {
  success: "text-emerald-700 bg-emerald-50 ring-emerald-200",
  warning: "text-amber-700 bg-amber-50 ring-amber-200",
  danger: "text-red-700 bg-red-50 ring-red-200",
  default: "text-slate-500 bg-slate-100 ring-slate-200",
};

const dotColors = {
  success: "bg-emerald-500",
  warning: "bg-amber-500",
  danger: "bg-red-500",
  default: "bg-slate-400",
};

const toneIcon = {
  success: CheckCircle2,
  warning: AlertTriangle,
  danger: ShieldAlert,
  default: AlertTriangle,
};

const HORIZONS = [
  { key: "h1", label: "H1" },
  { key: "h3", label: "H3" },
  { key: "h7", label: "H7" },
];

export default function ErrorTable({ coin, horizonErrors }) {
  const CoinIcon = coinIcons[coin] || Gauge;

  return (
    <div className="card p-5">
      <div className="flex items-center gap-2.5">
        <span className="flex size-8 items-center justify-center rounded-lg bg-slate-100 text-slate-600 ring-1 ring-inset ring-slate-200">
          <CoinIcon className="size-4" strokeWidth={2.25} />
        </span>
        <h3 className="text-sm font-semibold tracking-tight text-slate-900">{coin}</h3>
      </div>

      <div className="mt-4 overflow-hidden rounded-xl border border-slate-200">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50">
              <th className="px-4 py-2.5 font-semibold uppercase tracking-wider text-slate-500">Hz</th>
              <th className="px-4 py-2.5 font-semibold uppercase tracking-wider text-slate-500">MAPE</th>
              <th className="px-4 py-2.5 font-semibold uppercase tracking-wider text-slate-500">MAE</th>
              <th className="px-4 py-2.5 font-semibold uppercase tracking-wider text-slate-500">RMSE</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {HORIZONS.map((h) => {
              const err = horizonErrors?.[h.key];
              const mape = err?.mape ?? null;
              const tone = accuracyTone(mape);
              const badgeClass = toneColors[tone] || toneColors.default;
              const dotClass = dotColors[tone] || dotColors.default;
              const ToneIcon = toneIcon[tone] || toneIcon.default;

              return (
                <tr key={h.key} className="transition-colors hover:bg-slate-50">
                  <td className="px-4 py-3">
                    <span className="flex items-center gap-2">
                      <span className={`inline-block size-1.5 rounded-full ${dotClass}`} />
                      <span className="font-semibold text-slate-700">{h.label}</span>
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {mape != null ? (
                      <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-bold ring-1 ring-inset ${badgeClass}`}>
                        <ToneIcon className="size-3" strokeWidth={2.5} />
                        {formatPercent(mape)}
                      </span>
                    ) : (
                      <span className="text-slate-300">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 font-mono text-slate-600">
                    {err?.mae != null ? formatCurrency(err.mae) : <span className="text-slate-300">—</span>}
                  </td>
                  <td className="px-4 py-3 font-mono text-slate-600">
                    {err?.rmse != null ? formatCurrency(err.rmse) : <span className="text-slate-300">—</span>}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}