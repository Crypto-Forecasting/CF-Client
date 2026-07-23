import { ArrowUpRight, ArrowDownRight } from "lucide-react";

const toneAccent = {
  primary: "from-brand-500 to-brand-700",
  danger: "from-rose-500 to-red-600",
  warning: "from-amber-500 to-orange-600",
  success: "from-emerald-500 to-green-600",
  default: "from-slate-400 to-slate-600",
};

export default function MetricCard({ label, value, meta, tone = "default", icon: Icon, trend }) {
  const accent = toneAccent[tone] || toneAccent.default;
  const isUp = trend === "up";
  return (
    <article className="group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-card transition-all hover:-translate-y-0.5 hover:shadow-lift">
      <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${accent}`} />
      <div className="p-5">
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm font-medium text-slate-500">{label}</p>
          {Icon ? (
            <span className="flex size-9 items-center justify-center rounded-lg bg-slate-50 text-slate-500 ring-1 ring-inset ring-slate-100 transition group-hover:text-brand-600">
              <Icon className="size-4" strokeWidth={2} />
            </span>
          ) : null}
        </div>
        <strong className="mt-4 mb-2 block font-mono text-3xl font-extrabold tracking-tight text-slate-900">
          {value}
        </strong>
        <p className="flex items-center gap-1.5 text-sm font-medium text-slate-500">
          {trend ? (
            <span
              className={`inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-xs font-bold ${isUp ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"}`}
            >
              {isUp ? <ArrowUpRight className="size-3" strokeWidth={2.5} /> : <ArrowDownRight className="size-3" strokeWidth={2.5} />}
            </span>
          ) : null}
          {meta}
        </p>
      </div>
    </article>
  );
}