import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  Bitcoin,
  History,
  LineChart,
  AlertCircle,
} from "lucide-react";
import EthereumIcon from "../components/icons/EthereumIcon";
import ForecastChart from "../components/ForecastChart";
import HistoryTable from "../components/HistoryTable";
import Badge from "../components/Badge";
import SectionHeader from "../components/SectionHeader";
import { getDailyHistory, getChartData } from "../services/api";

const coinMeta = {
  bitcoin: { asset: "BTC", label: "Bitcoin", color: "#F7931A", Icon: Bitcoin },
  ethereum: {
    asset: "ETH",
    label: "Ethereum",
    color: "#627EEA",
    Icon: EthereumIcon,
  },
};

export default function CoinDetail() {
  const { coin } = useParams();
  const meta = coinMeta[coin];

  const [history, setHistory] = useState([]);
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
      const payload = await getDailyHistory({
        coin: meta.asset,
        page: p,
        limit,
        month,
      });
      setHistory(payload.data || []);
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
      <div className="grid min-h-[280px] place-items-center rounded-2xl border border-dashed border-slate-300 bg-slate-50/50 p-8 text-center">
        <div className="flex flex-col items-center">
          <span className="mb-4 flex size-12 items-center justify-center rounded-xl bg-slate-100 text-slate-400">
            <AlertCircle className="size-6" strokeWidth={1.75} />
          </span>
          <h3 className="mb-2 text-lg font-semibold text-slate-700">
            Koin tidak ditemukan
          </h3>
          <p>
            <Link
              to="/"
              className="font-semibold text-brand-600 hover:underline"
            >
              Kembali ke dashboard
            </Link>
          </p>
        </div>
      </div>
    );
  }

  const CoinIcon = meta.Icon;

  return (
    <div className="flex flex-col gap-8">
      <header className="py-1">
        <Link
          to="/"
          className="mb-4 inline-flex items-center gap-1.5 text-sm font-bold text-brand-600 transition hover:gap-2 hover:text-brand-700"
        >
          <ArrowLeft className="size-4" strokeWidth={2.5} />
          Dashboard
        </Link>

        <div className="flex flex-wrap items-center gap-4">
          <div
            className="flex size-14 shrink-0 items-center justify-center rounded-2xl text-white shadow-soft"
            style={{
              background: `linear-gradient(135deg, ${meta.color}, ${meta.color}cc)`,
            }}
          >
            <CoinIcon className="size-7" strokeWidth={2.25} />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 lg:text-4xl">
              {meta.label}
            </h1>
            <p className="mt-1 flex items-center gap-2 text-sm text-slate-500">
              <Badge tone="warning">{meta.asset}</Badge>
            </p>
          </div>
        </div>
      </header>

      {error ? (
        <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">
          <AlertCircle className="mt-0.5 size-4 shrink-0" strokeWidth={2.5} />
          {error}
        </div>
      ) : null}

      <section className="card p-5 lg:p-6">
        <SectionHeader
          eyebrow="Grafik"
          title="Prediksi vs Aktual"
          description="Perbandingan harga aktual dengan prediksi tiap horizon + Support/Resistance."
          icon={LineChart}
        />
        <div className="mt-5">
          <ForecastChart
            historical={chartData?.historical}
            forecasts={chartData?.forecasts}
            srLevels={chartData?.srLevels}
            lastClose={chartData?.lastClose}
          />
        </div>
      </section>

      <section className="card p-5 lg:p-6">
        <SectionHeader
          eyebrow="Riwayat"
          title="Histori Prediksi"
          description="Catatan prediksi harian beserta metrik error aktual."
          icon={History}
        />
        <div className="mt-5">
          {isLoadingHistory ? (
            <div className="grid min-h-[240px] place-items-center rounded-2xl border border-dashed border-slate-300 bg-slate-50/50 p-8 text-center">
              <div className="flex flex-col items-center">
                <span className="mb-4 flex size-12 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                  <LineChart
                    className="size-6 animate-pulse"
                    strokeWidth={1.75}
                  />
                </span>
                <h3 className="mb-2 text-base font-semibold text-slate-700">
                  Memuat data...
                </h3>
                <p className="max-w-sm text-sm text-slate-400">
                  Mengambil histori prediksi dari server.
                </p>
              </div>
            </div>
          ) : (
            <HistoryTable
              rows={history}
              total={total}
              page={page}
              limit={limit}
              onPageChange={handlePageChange}
              selectedMonth={selectedMonth}
              onMonthChange={handleMonthChange}
            />
          )}
        </div>
      </section>
    </div>
  );
}
