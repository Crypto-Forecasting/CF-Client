export default function Button({ children, className = "", isLoading = false, ...props }) {
  return (
    <button className={`button ${className}`} disabled={isLoading || props.disabled} {...props}>
      {isLoading ? "Memproses..." : children}
    </button>
  );
}
