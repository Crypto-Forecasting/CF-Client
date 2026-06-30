import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import ForecastChart from "../components/ForecastChart";
import HistoryTable from "../components/HistoryTable";
import Badge from "../components/Badge";
import { getDailyHistory, getChartData } from "../services/api";

const coinMeta = {
  bitcoin: { asset: "BTC", label: "Bitcoin", color: "#F7931A" },
  ethereum: { asset: "ETH", label: "Ethereum", color: "#627EEA" },
};

export default function CoinDetail() {
  const { coin } = useParams();
  const meta = coinMeta[coin];

  const [history, setHistory] = useState([]);
  const [historyStats, setHistoryStats] = useState(null);
  const [chartData, setChartData] = useState(null);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const limit = 10;

  useEffect(() => {
    if (!meta) return;
    loadChartData();
    loadDailyHistory(1, selectedMonth);
  }, [meta?.asset]);

  useEffect(() => {
    if (!meta) return;
    loadDailyHistory(1, selectedMonth);
  }, [selectedMonth]);

  async function loadChartData() {
    try {
      const payload = await getChartData(meta.asset);
      setChartData(payload);
    } catch (err) {
      setError(err.message);
    }
  }

  async function loadDailyHistory(p, month) {
    setIsLoadingHistory(true);
    try {
      const payload = await getDailyHistory({ coin: meta.asset, page: p, limit, month });
      setHistory(payload.data || []);
      setHistoryStats(payload.stats || null);
      setTotal(payload.total || 0);
      setPage(payload.page || p);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoadingHistory(false);
    }
  }

  function handlePageChange(p) {
    loadDailyHistory(p, selectedMonth);
  }

  function handleMonthChange(month) {
    setSelectedMonth(month);
    setPage(1);
  }

  if (!meta) {
    return (
      <div className="grid min-h-[220px] place-items-center rounded-2xl border border-dashed border-slate-300 p-8 text-center">
        <h3 className="mb-2 text-lg font-semibold text-slate-700">Koin tidak ditemukan</h3>
        <p>
          <Link to="/" className="text-brand-600 hover:underline">Kembali ke dashboard</Link>
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <header className="py-2">
        <Link to="/" className="mb-3 inline-flex items-center gap-1.5 text-sm font-bold text-brand-600 transition hover:opacity-70">
          &larr; Dashboard
        </Link>
        <div className="flex items-center gap-3">
          <div className="size-4 shrink-0 rounded-full" style={{ background: meta.color }} />
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 lg:text-4xl">{meta.label}</h1>
          <Badge tone="warning">{meta.asset}</Badge>
        </div>
        <p className="mt-1.5 text-sm text-slate-500">Prediksi harga {meta.label} dengan model CNN-LSTM</p>
      </header>

      {error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">{error}</div>
      ) : null}

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-1 flex items-center justify-between gap-4">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400">Grafik</p>
            <h2 className="text-lg font-bold tracking-tight text-slate-900">Prediksi vs Aktual</h2>
          </div>
        </div>
        <ForecastChart
          historical={chartData?.historical}
          forecasts={chartData?.forecasts}
          srLevels={chartData?.srLevels}
          lastClose={chartData?.lastClose}
        />
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between gap-4">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400">Riwayat</p>
            <h2 className="text-lg font-bold tracking-tight text-slate-900">Histori Prediksi</h2>
          </div>
        </div>
        {isLoadingHistory ? (
          <div className="grid min-h-[220px] place-items-center rounded-xl border border-dashed border-slate-300 p-8 text-center">
            <h3 className="mb-2 text-base font-semibold text-slate-600">Memuat data...</h3>
            <p className="max-w-sm text-sm text-slate-400">Mengambil histori prediksi dari server.</p>
          </div>
        ) : (
          <HistoryTable
            rows={history}
            total={total}
            page={page}
            limit={limit}
            onPageChange={handlePageChange}
            stats={historyStats}
            selectedMonth={selectedMonth}
            onMonthChange={handleMonthChange}
          />
        )}
      </section>
    </div>
  );
}
