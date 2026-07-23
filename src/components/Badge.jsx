export default function Badge({ children, tone = "neutral", icon: Icon }) {
  const colors = {
    neutral: "text-slate-700 bg-slate-100 ring-slate-200",
    success: "text-emerald-700 bg-emerald-50 ring-emerald-200",
    warning: "text-amber-700 bg-amber-50 ring-amber-200",
    info: "text-sky-700 bg-sky-50 ring-sky-200",
    danger: "text-red-700 bg-red-50 ring-red-200",
    brand: "text-brand-700 bg-brand-50 ring-brand-200",
  };

  return (
    <span
      className={`inline-flex w-fit items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold tracking-wide ring-1 ring-inset ${colors[tone] || colors.neutral}`}
    >
      {Icon ? <Icon className="size-3.5 shrink-0" strokeWidth={2.5} /> : null}
      {children}
    </span>
  );
}