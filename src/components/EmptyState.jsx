export default function EmptyState({ title, message, icon: Icon }) {
  return (
    <div className="grid min-h-[240px] place-items-center rounded-2xl border border-dashed border-slate-300 bg-slate-50/50 p-8 text-center">
      <div className="flex flex-col items-center">
        {Icon ? (
          <span className="mb-4 flex size-12 items-center justify-center rounded-xl bg-slate-100 text-slate-400">
            <Icon className="size-6" strokeWidth={1.75} />
          </span>
        ) : null}
        <h3 className="mb-2 text-base font-semibold text-slate-700">{title}</h3>
        <p className="max-w-sm text-sm text-slate-500">{message}</p>
      </div>
    </div>
  );
}