export default function EmptyState({ title, message }) {
  return (
    <div className="grid min-h-[220px] place-items-center rounded-2xl border border-dashed border-slate-300 p-8 text-center">
      <h3 className="mb-2 text-lg font-semibold">{title}</h3>
      <p className="max-w-sm text-slate-500">{message}</p>
    </div>
  );
}
