export default function Button({ children, className = "", isLoading = false, ...props }) {
  return (
    <button
      className={`min-h-[46px] rounded-xl px-6 py-2.5 font-bold text-white transition bg-brand-600 hover:bg-brand-700 disabled:opacity-70 disabled:cursor-not-allowed ${className}`}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? "Memproses..." : children}
    </button>
  );
}
