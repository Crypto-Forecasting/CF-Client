import { Routes, Route, Link, NavLink } from "react-router-dom";
import { Activity, Bitcoin } from "lucide-react";
import EthereumIcon from "./components/icons/EthereumIcon";
import Landing from "./pages/Landing";
import CoinDetail from "./pages/CoinDetail";

const navItems = [
  { to: "/bitcoin", label: "BTC", Icon: Bitcoin, color: "#F7931A" },
  { to: "/ethereum", label: "ETH", Icon: EthereumIcon, color: "#627EEA" },
];

export default function App() {
  return (
    <div className="flex min-h-screen flex-col">
      <nav className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3.5 lg:px-10">
          <Link to="/" className="group flex items-center gap-2.5">
            <span className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 text-white shadow-soft transition group-hover:shadow-glow">
              <Activity className="size-5" strokeWidth={2.5} />
            </span>
            <div className="flex flex-col leading-none">
              <span className="text-base font-extrabold tracking-tight text-slate-900">
                Crypto Forecast
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-brand-600">
                CNN-LSTM
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-1 rounded-full bg-slate-100/80 p-1 ring-1 ring-inset ring-slate-200">
            {navItems.map(({ to, label, Icon, color }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-semibold transition ${
                    isActive
                      ? "bg-white text-slate-900 shadow-soft"
                      : "text-slate-500 hover:text-slate-800"
                  }`
                }
              >
                <Icon className="size-4" strokeWidth={2.25} style={{ color }} />
                {label}
              </NavLink>
            ))}
          </div>
        </div>
      </nav>

      <main className="mx-auto w-full max-w-7xl flex-1 px-6 py-10 lg:px-10">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/:coin" element={<CoinDetail />} />
        </Routes>
      </main>

      <footer className="border-t border-slate-200/70 bg-white/60 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-center px-6 py-5 text-center text-xs font-medium text-slate-400 lg:px-10">
          <p>© 2026 Crypto Forecasting</p>
        </div>
      </footer>
    </div>
  );
}