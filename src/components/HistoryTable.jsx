import { formatCurrency, formatDate, formatPercent, accuracyTone } from "../utils/formatters";
import EmptyState from "./EmptyState";

export default function HistoryTable({ rows, total, page, limit, onPageChange }) {
  if (!rows.length) {
    return (
      <EmptyState
        title="Belum ada histori prediksi"
        message="Jalankan prediksi pertama untuk mengisi tabel evaluasi model."
      />
    );
  }

  const totalPages = limit ? Math.ceil((total || rows.length) / limit) : 1;

  return (
    <div>
      <div className="mt-5 overflow-x-auto">
        <table className="w-full min-w-[900px] border-collapse">
          <thead>
            <tr>
              <th className="border-b border-slate-200 p-3 text-left text-xs font-bold uppercase tracking-widest text-slate-500">Target Date</th>
              <th className="border-b border-slate-200 p-3 text-right text-xs font-bold uppercase tracking-widest text-slate-500">H+1 Pred</th>
              <th className="border-b border-slate-200 p-3 text-right text-xs font-bold uppercase tracking-widest text-slate-500">H+3 Pred</th>
              <th className="border-b border-slate-200 p-3 text-right text-xs font-bold uppercase tracking-widest text-slate-500">H+7 Pred</th>
              <th className="border-b border-slate-200 p-3 text-right text-xs font-bold uppercase tracking-widest text-slate-500">Actual</th>
              <th className="border-b border-slate-200 p-3 text-right text-xs font-bold uppercase tracking-widest text-slate-500">H+1 Err</th>
              <th className="border-b border-slate-200 p-3 text-right text-xs font-bold uppercase tracking-widest text-slate-500">H+3 Err</th>
              <th className="border-b border-slate-200 p-3 text-right text-xs font-bold uppercase tracking-widest text-slate-500">H+7 Err</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, idx) => (
              <tr key={row.targetDate || idx}>
                <td className="border-b border-slate-200 p-3 text-sm font-medium whitespace-nowrap">{formatDate(row.targetDate)}</td>
                {["h1", "h3", "h7"].map((k) => (
                  <td key={k} className="border-b border-slate-200 p-3 text-sm font-medium whitespace-nowrap text-right">
                    {row[k] ? formatCurrency(row[k].predicted) : "—"}
                  </td>
                ))}
                <td className="border-b border-slate-200 p-3 text-sm font-semibold whitespace-nowrap text-right text-slate-800">
                  {row.actual != null ? formatCurrency(row.actual) : "—"}
                </td>
                {["h1", "h3", "h7"].map((k) => {
                  const err = row[k]?.error;
                  const tone = accuracyTone(err);
                  const color = tone === "success" ? "text-green-600" : tone === "warning" ? "text-amber-600" : "text-red-600";
                  return (
                    <td key={`e-${k}`} className={`border-b border-slate-200 p-3 text-sm font-medium whitespace-nowrap text-right ${err != null ? color : ""}`}>
                      {err != null ? formatPercent(err) : "—"}
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
          <span className="text-slate-500 font-medium">{total != null ? `${total} total` : ""}</span>
          <div className="flex items-center gap-1">
            <button className="min-h-[34px] rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-semibold text-slate-700 transition hover:border-teal-500 disabled:opacity-40"
              disabled={page <= 1} onClick={() => onPageChange(page - 1)}>&larr; Previous</button>
            {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
              let p;
              if (totalPages <= 7) p = i + 1;
              else if (page <= 4) p = i + 1;
              else if (page >= totalPages - 3) p = totalPages - 6 + i;
              else p = page - 3 + i;
              return (
                <button key={p} className={`min-h-[34px] min-w-[34px] rounded-lg border text-sm font-semibold transition ${p === page ? "border-brand-600 bg-brand-600 text-white" : "border-slate-300 bg-white text-slate-700 hover:border-teal-500"}`}
                  onClick={() => onPageChange(p)}>{p}</button>
              );
            })}
            <button className="min-h-[34px] rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-semibold text-slate-700 transition hover:border-teal-500 disabled:opacity-40"
              disabled={page >= totalPages} onClick={() => onPageChange(page + 1)}>Next &rarr;</button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
