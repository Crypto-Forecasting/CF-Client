export default function EthereumIcon({ className = "", strokeWidth: _sw, ...props }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={0}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <path d="M12 2.5 L5.5 12.2 L12 16.1 L18.5 12.2 Z" fill="currentColor" opacity="0.6" />
      <path d="M12 17.4 L5.5 13.6 L12 21.5 Z" fill="currentColor" />
      <path d="M12 17.4 L18.5 13.6 L12 21.5 Z" fill="currentColor" opacity="0.6" />
    </svg>
  );
}