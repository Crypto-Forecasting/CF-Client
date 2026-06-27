import { Routes, Route, Link } from "react-router-dom";
import Landing from "./pages/Landing";
import CoinDetail from "./pages/CoinDetail";

export default function App() {
  return (
    <div>
      <nav className="sticky top-0 z-50 flex items-center justify-between gap-5 border-b border-slate-200 bg-white/90 px-8 py-4 backdrop-blur-md">
        <Link to="/" className="text-xl font-extrabold tracking-tight text-brand-600">
          Crypto Forecast
        </Link>
        <div className="flex gap-1.5">
          <Link to="/bitcoin" className="rounded-lg px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100">
            BTC
          </Link>
          <Link to="/ethereum" className="rounded-lg px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100">
            ETH
          </Link>
        </div>
      </nav>

      <main className="mx-auto grid max-w-6xl gap-8 px-8 py-10">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/:coin" element={<CoinDetail />} />
        </Routes>
      </main>
    </div>
  );
}
