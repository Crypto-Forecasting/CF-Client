export default function Badge({ children, tone = "neutral" }) {
  const colors = {
    neutral: "text-slate-700 bg-slate-100",
    success: "text-green-800 bg-green-100",
    warning: "text-amber-800 bg-amber-100",
    info: "text-blue-800 bg-blue-100",
    danger: "text-red-800 bg-red-100",
  };

  return (
    <span className={`inline-flex w-fit items-center rounded-full px-3 py-1 text-xs font-bold tracking-wide ${colors[tone] || colors.neutral}`}>
      {children}
    </span>
  );
}
