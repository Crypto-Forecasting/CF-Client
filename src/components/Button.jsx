import { Loader2 } from "lucide-react";

export default function Button({ children, className = "", isLoading = false, icon: Icon, ...props }) {
  return (
    <button
      className={`inline-flex min-h-[46px] items-center justify-center gap-2 rounded-xl bg-brand-600 px-6 py-2.5 font-bold text-white shadow-soft transition hover:bg-brand-700 active:translate-y-px disabled:cursor-not-allowed disabled:opacity-70 ${className}`}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="size-4 animate-spin" />
      ) : Icon ? (
        <Icon className="size-4" strokeWidth={2.5} />
      ) : null}
      {isLoading ? "Memproses..." : children}
    </button>
  );
}