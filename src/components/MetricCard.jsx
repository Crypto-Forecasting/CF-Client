export default function MetricCard({ label, value, meta, tone = "default" }) {
  const borders = {
    primary: "border-t-teal-500",
    danger: "border-t-red-500",
    warning: "border-t-amber-500",
    success: "border-t-green-500",
  };

  return (
    <article className={`min-h-[150px] rounded-2xl border border-slate-200 border-t-4 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md ${borders[tone] || ""}`}>
      <p className="text-sm font-medium text-slate-500">{label}</p>
      <strong className="mt-4 mb-2 block text-3xl font-extrabold tracking-tight text-slate-900">{value}</strong>
      {meta ? <span className="text-sm font-medium text-slate-500">{meta}</span> : null}
    </article>
  );
}
