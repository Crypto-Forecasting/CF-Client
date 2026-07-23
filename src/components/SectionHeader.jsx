export default function SectionHeader({ eyebrow, title, description, action, icon: Icon }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div className="flex items-start gap-3">
        {Icon ? (
          <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600 ring-1 ring-inset ring-brand-100">
            <Icon className="size-5" strokeWidth={2} />
          </span>
        ) : null}
        <div>
          {eyebrow ? (
            <p className="mb-1 text-[11px] font-bold uppercase tracking-widest text-brand-600">{eyebrow}</p>
          ) : null}
          <h2 className="text-xl font-bold tracking-tight text-slate-900">{title}</h2>
          {description ? <p className="mt-1 text-sm text-slate-500">{description}</p> : null}
        </div>
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}