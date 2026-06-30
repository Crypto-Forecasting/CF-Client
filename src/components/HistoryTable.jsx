import { useMemo } from "react";
import { formatCurrency, formatDate, formatPercent, accuracyTone } from "../utils/formatters";
import EmptyState from "./EmptyState";

const HORIZONS = ["h1", "h3", "h7"];

function generateMonthOptions() {
  const months = [];
  const now = new Date();
  for (let i = 0; i < 24; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const value = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    const label = d.toLocaleDateString("id-ID", { month: "long", year: "numeric" });
    months.push({ value, label });
  }
  return months;
}

const MONTH_OPTIONS = generateMonthOptions();

const toneErrorClass = {
  success: "text-emerald-600",
  warning: "text-amber-600",
  danger: "text-red-600",
  default: "text-slate-400",
};

function ErrorTooltip({ h }) {
  const mape = h?.errorPercent ?? h?.error ?? null;
  const mae = h?.absoluteError ?? null;
  const sq = h?.squaredError ?? null;

  return (
    <div className="pointer-events-none absolute bottom-full left-1/2 z-20 mb-2 -translate-x-1/2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs shadow-xl opacity-0 transition-opacity group-hover:opacity-100 whitespace-nowrap">
      <div className="text-slate-500">MAPE: <span className="font-semibold text-slate-800">{mape != null ? formatPercent(mape) : "—"}</span></div>
      <div className="text-slate-500">MAE: <span className="font-semibold text-slate-800">{mae != null ? formatCurrency(mae) : "—"}</span></div>
      <div className="text-slate-500">MSE: <span className="font-semibold text-slate-800">{sq != null ? formatCurrency(sq) : "—"}</span></div>
      <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 rotate-45 border-4 border-transparent border-t-white" />
    </div>
  );
}

function StatPill({ label, value, tone }) {
  return (
    <div className="flex items-center gap-1.5 rounded-lg bg-slate-100 px-3 py-1.5">
      <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">{label}</span>
      <span className={`text-xs font-bold ${toneErrorClass[tone] || toneErrorClass.default}`}>{value ?? "—"}</span>
    </div>
  );
}

export default function HistoryTable({ rows, total, page, limit, onPageChange, stats, selectedMonth, onMonthChange }) {
  const totalPages = limit ? Math.ceil((total || rows.length) / limit) : 1;

  const monthIndex = useMemo(() => {
    if (!selectedMonth) return -1;
    return MONTH_OPTIONS.findIndex((m) => m.value === selectedMonth);
  }, [selectedMonth]);

  function prevMonth() {
    if (monthIndex < MONTH_OPTIONS.length - 1) {
      onMonthChange(MONTH_OPTIONS[monthIndex + 1].value);
    }
  }

  function nextMonth() {
    if (monthIndex > 0) {
      onMonthChange(MONTH_OPTIONS[monthIndex - 1].value);
    }
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-4">
          {["h1", "h3", "h7"].map((k) => {
            const s = stats?.[k];
            const mape = s?.mape ?? null;
            const tone = accuracyTone(mape);
            return (
              <div key={k} className="flex items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">{k.replace("h", "H+")}</span>
                <div className="flex items-center gap-1.5">
                  <StatPill label="MAPE" value={mape != null ? formatPercent(mape) : null} tone={tone} />
                  <StatPill label="MAE" value={s?.mae != null ? formatCurrency(s.mae) : null} tone={tone} />
                  <StatPill label="RMSE" value={s?.rmse != null ? formatCurrency(s.rmse) : null} tone={tone} />
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex items-center gap-1">
          <button
            className="flex size-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-xs text-slate-400 transition hover:border-slate-300 hover:text-slate-600 disabled:opacity-30"
            disabled={monthIndex >= MONTH_OPTIONS.length - 1}
            onClick={prevMonth}
          >
            &larr;
          </button>
          <select
            className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 outline-none transition focus:border-brand-400"
            value={selectedMonth || ""}
            onChange={(e) => onMonthChange(e.target.value || null)}
          >
            <option value="">Semua Bulan</option>
            {MONTH_OPTIONS.map((m) => (
              <option key={m.value} value={m.value}>{m.label}</option>
            ))}
          </select>
          <button
            className="flex size-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-xs text-slate-400 transition hover:border-slate-300 hover:text-slate-600 disabled:opacity-30"
            disabled={monthIndex <= 0}
            onClick={nextMonth}
          >
            &rarr;
          </button>
        </div>
      </div>

      {!rows.length ? (
        <EmptyState
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

                      return (
                        <td key={`e-${k}`} className="px-4 py-3 text-right text-sm whitespace-nowrap">
                          <div className="group relative inline-block">
                            <span className={`font-semibold font-mono ${err != null ? errClass : "text-slate-300"}`}>
                              {err != null ? formatPercent(err) : "—"}
                            </span>
                            {err != null && <ErrorTooltip h={h} />}
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
                  className="min-h-[32px] rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-500 transition hover:border-slate-300 hover:text-slate-700 disabled:opacity-30"
                  disabled={page <= 1}
                  onClick={() => onPageChange(page - 1)}
                >
                  &larr;
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
                          ? "border-brand-500 bg-brand-500 text-white"
                          : "border-slate-200 bg-white text-slate-500 hover:border-slate-300 hover:text-slate-700"
                      }`}
                      onClick={() => onPageChange(p)}
                    >
                      {p}
                    </button>
                  );
                })}
                <button
                  className="min-h-[32px] rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-500 transition hover:border-slate-300 hover:text-slate-700 disabled:opacity-30"
                  disabled={page >= totalPages}
                  onClick={() => onPageChange(page + 1)}
                >
                  &rarr;
                </button>
              </div>
            </div>
          ) : null}
        </>
      )}
    </div>
  );
}
