export default function EmptyState({ title, message }) {
  return (
    <div className="grid min-h-[220px] place-items-center rounded-2xl border border-dashed border-slate-300 p-8 text-center">
      <h3 className="mb-2 text-base font-semibold text-slate-700">{title}</h3>
      <p className="max-w-sm text-sm text-slate-500">{message}</p>
    </div>
  );
}
