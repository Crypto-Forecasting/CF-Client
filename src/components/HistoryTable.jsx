import { ChevronLeft, ChevronRight, History } from "lucide-react";
import { formatCurrency, formatDate, formatPercent, accuracyTone } from "../utils/formatters";
import EmptyState from "./EmptyState";
import MonthPicker from "./MonthPicker";

const HORIZONS = ["h1", "h3", "h7"];

const toneErrorClass = {
  success: "text-emerald-600",
  warning: "text-amber-600",
  danger: "text-red-600",
  default: "text-slate-400",
};

function ErrorTooltip({ h, alignRight }) {
  const mape = h?.errorPercent ?? h?.error ?? null;
  const mae = h?.absoluteError ?? null;
  const sq = h?.squaredError ?? null;

  return (
    <div className={`pointer-events-none absolute top-full z-20 mt-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs shadow-xl opacity-0 transition-opacity group-hover:opacity-100 whitespace-nowrap ${alignRight ? "right-0" : "left-1/2 -translate-x-1/2"}`}>
      <div className="text-slate-500">MAPE: <span className="font-semibold text-slate-800">{mape != null ? formatPercent(mape) : "—"}</span></div>
      <div className="text-slate-500">MAE: <span className="font-semibold text-slate-800">{mae != null ? formatCurrency(mae) : "—"}</span></div>
      <div className="text-slate-500">MSE: <span className="font-semibold text-slate-800">{sq != null ? formatCurrency(sq) : "—"}</span></div>
      <div className={`absolute -top-1 rotate-45 border-4 border-transparent border-b-white ${alignRight ? "right-2" : "left-1/2 -translate-x-1/2"}`} />
    </div>
  );
}

export default function HistoryTable({ rows, total, page, limit, onPageChange, selectedMonth, onMonthChange }) {
  const totalPages = limit ? Math.ceil((total || rows.length) / limit) : 1;

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center justify-end gap-3">
        <MonthPicker value={selectedMonth} onChange={onMonthChange} />
      </div>

      {!rows.length ? (
        <EmptyState
          icon={History}
          title="Belum ada histori prediksi"
          message="Jalankan prediksi pertama untuk mengisi tabel evaluasi model."
        />
      ) : (
        <>
          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full min-w-[800px] border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-slate-400">Target</th>
                  <th className="px-4 py-3 text-right text-[11px] font-bold uppercase tracking-wider text-slate-400">H+1 Pred</th>
                  <th className="px-4 py-3 text-right text-[11px] font-bold uppercase tracking-wider text-slate-400">H+3 Pred</th>
                  <th className="px-4 py-3 text-right text-[11px] font-bold uppercase tracking-wider text-slate-400">H+7 Pred</th>
                  <th className="px-4 py-3 text-right text-[11px] font-bold uppercase tracking-wider text-slate-400">Aktual</th>
                  <th className="px-4 py-3 text-right text-[11px] font-bold uppercase tracking-wider text-slate-400">H+1 Err</th>
                  <th className="px-4 py-3 text-right text-[11px] font-bold uppercase tracking-wider text-slate-400">H+3 Err</th>
                  <th className="px-4 py-3 text-right text-[11px] font-bold uppercase tracking-wider text-slate-400">H+7 Err</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {rows.map((row) => (
                  <tr key={row.targetDate} className="transition-colors hover:bg-slate-50">
                    <td className="px-4 py-3 text-sm font-medium text-slate-700 whitespace-nowrap">
                      {formatDate(row.targetDate)}
                    </td>
                    {HORIZONS.map((k) => (
                      <td key={k} className="px-4 py-3 text-right text-sm font-mono text-slate-500 whitespace-nowrap">
                        {row[k]?.predicted != null ? formatCurrency(row[k].predicted) : <span className="text-slate-300">—</span>}
                      </td>
                    ))}
                    <td className="px-4 py-3 text-right text-sm font-semibold font-mono text-slate-800 whitespace-nowrap">
                      {row.actual != null ? formatCurrency(row.actual) : <span className="text-slate-300">—</span>}
                    </td>
                    {HORIZONS.map((k) => {
                      const h = row[k];
                      const err = h?.error ?? null;
                      const tone = accuracyTone(err);
                      const errClass = toneErrorClass[tone] || toneErrorClass.default;
                      const isLastColumn = k === "h7";

                      return (
                        <td key={`e-${k}`} className="px-4 py-3 text-right text-sm whitespace-nowrap">
                          <div className="group relative inline-block">
                            <span className={`font-mono font-semibold ${err != null ? errClass : "text-slate-300"}`}>
                              {err != null ? formatPercent(err) : "—"}
                            </span>
                            {err != null && <ErrorTooltip h={h} alignRight={isLastColumn} />}
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && onPageChange ? (
            <div className="mt-4 flex items-center justify-between gap-4 text-sm">
              <span className="text-xs font-medium text-slate-400">
                {total != null ? `${total} total` : ""}
              </span>
              <div className="flex items-center gap-1">
                <button
                  className="flex min-h-[32px] items-center gap-0.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-500 transition hover:border-slate-300 hover:text-slate-700 disabled:opacity-30"
                  disabled={page <= 1}
                  onClick={() => onPageChange(page - 1)}
                >
                  <ChevronLeft className="size-3.5" strokeWidth={2.25} />
                  Prev
                </button>
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                  let p;
                  if (totalPages <= 5) p = i + 1;
                  else if (page <= 3) p = i + 1;
                  else if (page >= totalPages - 2) p = totalPages - 4 + i;
                  else p = page - 2 + i;
                  return (
                    <button
                      key={p}
                      className={`min-h-[32px] min-w-[32px] rounded-lg border text-xs font-semibold transition ${
                        p === page
                          ? "border-brand-600 bg-brand-600 text-white shadow-soft"
                          : "border-slate-200 bg-white text-slate-500 hover:border-slate-300 hover:text-slate-700"
                      }`}
                      onClick={() => onPageChange(p)}
                    >
                      {p}
                    </button>
                  );
                })}
                <button
                  className="flex min-h-[32px] items-center gap-0.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-500 transition hover:border-slate-300 hover:text-slate-700 disabled:opacity-30"
                  disabled={page >= totalPages}
                  onClick={() => onPageChange(page + 1)}
                >
                  Next
                  <ChevronRight className="size-3.5" strokeWidth={2.25} />
                </button>
              </div>
            </div>
          ) : null}
        </>
      )}
    </div>
  );
}