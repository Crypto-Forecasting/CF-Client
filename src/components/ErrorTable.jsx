import { formatPercent, formatCurrency, accuracyTone } from "../utils/formatters";

const toneColors = {
  success: "text-emerald-700 bg-emerald-50",
  warning: "text-amber-700 bg-amber-50",
  danger: "text-red-700 bg-red-50",
  default: "text-slate-500 bg-slate-100",
};

const dotColors = {
  success: "bg-emerald-500",
  warning: "bg-amber-500",
  danger: "bg-red-500",
  default: "bg-slate-400",
};

const HORIZONS = [
  { key: "h1", label: "H1" },
  { key: "h3", label: "H3" },
  { key: "h7", label: "H7" },
];

export default function ErrorTable({ coin, horizonErrors }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h3 className="text-sm font-semibold tracking-tight text-slate-900">{coin}</h3>

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
                      <span className={`inline-flex items-center rounded-full px-2 py-0.5 font-bold ${badgeClass}`}>
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
