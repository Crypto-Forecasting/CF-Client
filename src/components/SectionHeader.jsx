export default function SectionHeader({ eyebrow, title, action }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        {eyebrow ? <p className="mb-2 text-xs font-bold uppercase tracking-widest text-slate-500">{eyebrow}</p> : null}
        <h2 className="text-xl font-bold tracking-tight">{title}</h2>
      </div>
      {action ? <div>{action}</div> : null}
    </div>
  );
}
