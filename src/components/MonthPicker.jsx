import { useEffect, useRef, useState } from "react";
import { CalendarDays, ChevronLeft, ChevronRight, X } from "lucide-react";

const MONTH_NAMES = [
  "Jan", "Feb", "Mar", "Apr", "Mei", "Jun",
  "Jul", "Agu", "Sep", "Okt", "Nov", "Des",
];

const MONTH_LONG = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember",
];

const MIN_YEAR = 2024;

function getMaxYear() {
  return new Date().getFullYear();
}

function generateYears() {
  const max = getMaxYear();
  const years = [];
  for (let y = MIN_YEAR; y <= max; y++) years.push(y);
  if (years.length === 0) years.push(max);
  return years;
}

export default function MonthPicker({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const [viewYear, setViewYear] = useState(() => {
    if (value) {
      const y = Number(value.split("-")[0]);
      if (Number.isFinite(y)) return y;
    }
    return getMaxYear();
  });

  const wrapRef = useRef(null);
  const triggerRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;

    function handleClickOutside(e) {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) {
        setOpen(false);
      }
    }

    function handleKey(e) {
      if (e.key === "Escape") setOpen(false);
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKey);
    };
  }, [open]);

  useEffect(() => {
    if (open && value) {
      const y = Number(value.split("-")[0]);
      if (Number.isFinite(y)) setViewYear(y);
    }
  }, [open, value]);
  function toggle() {
    setOpen((prev) => !prev);
  }

  function prevYear() {
    if (viewYear > MIN_YEAR) setViewYear((y) => y - 1);
  }

  function nextYear() {
    if (viewYear < getMaxYear()) setViewYear((y) => y + 1);
  }

  function pickMonth(monthNumber) {
    const mm = String(monthNumber + 1).padStart(2, "0");
    const newValue = `${viewYear}-${mm}`;
    onChange(newValue);
    setOpen(false);
  }

  function clear() {
    onChange(null);
    setOpen(false);
  }

  const label = value
    ? (() => {
        const [y, m] = value.split("-").map(Number);
        return `${MONTH_LONG[m - 1]} ${y}`;
      })()
    : "Semua Bulan";

  const activeMonth = value ? Number(value.split("-")[1]) - 1 : -1;
  const minYear = MIN_YEAR;
  const maxYear = getMaxYear();

  return (
    <div className="relative" ref={wrapRef}>
      <button
        type="button"
        ref={triggerRef}
        onClick={toggle}
        aria-haspopup="dialog"
        aria-expanded={open}
        className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white py-1.5 pl-3 pr-2 text-xs font-semibold text-slate-600 outline-none transition hover:border-brand-300 focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
      >
        <CalendarDays className="size-3.5 text-slate-400" strokeWidth={2} />
        <span>{label}</span>
        <ChevronRight
          className={`size-3.5 text-slate-400 transition ${open ? "rotate-90" : ""}`}
          strokeWidth={2}
        />
      </button>

      {open && (
        <div
          role="dialog"
          aria-label="Pilih bulan"
          className="absolute right-0 z-30 mt-2 w-64 rounded-xl border border-slate-200 bg-white p-3 shadow-xl"
        >
          <div className="mb-3 flex items-center justify-between">
            <button
              type="button"
              onClick={prevYear}
              disabled={viewYear <= minYear}
              title="Tahun sebelumnya"
              className="flex size-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:border-brand-300 hover:text-brand-700 disabled:cursor-not-allowed disabled:opacity-30"
            >
              <ChevronLeft className="size-4" strokeWidth={2.25} />
            </button>
            <span className="text-sm font-bold text-slate-800">{viewYear}</span>
            <button
              type="button"
              onClick={nextYear}
              disabled={viewYear >= maxYear}
              title="Tahun berikutnya"
              className="flex size-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:border-brand-300 hover:text-brand-700 disabled:cursor-not-allowed disabled:opacity-30"
            >
              <ChevronRight className="size-4" strokeWidth={2.25} />
            </button>
          </div>

          <div className="grid grid-cols-4 gap-1.5">
            {MONTH_NAMES.map((m, i) => {
              const isActive = i === activeMonth;
              return (
                <button
                  key={m}
                  type="button"
                  onClick={() => pickMonth(i)}
                  className={`rounded-lg py-1.5 text-xs font-semibold transition ${
                    isActive
                      ? "bg-brand-600 text-white shadow-soft"
                      : "text-slate-600 hover:bg-brand-50 hover:text-brand-700"
                  }`}
                >
                  {m}
                </button>
              );
            })}
          </div>

          <div className="mt-3 flex justify-end border-t border-slate-100 pt-2">
            <button
              type="button"
              onClick={clear}
              className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-semibold text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
            >
              <X className="size-3" strokeWidth={2.25} />
              Semua Bulan
            </button>
          </div>
        </div>
      )}
    </div>
  );
}