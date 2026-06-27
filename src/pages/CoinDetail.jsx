import { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import MetricCard from "../components/MetricCard";
import ForecastChart from "../components/ForecastChart";
import HistoryTable from "../components/HistoryTable";
import Badge from "../components/Badge";
import { getDailyHistory, getChartData, getSchedulerStatus } from "../services/api";
import {
  calculateErrorPercent,
  formatCurrency,
  formatDate,
  formatPercent,
  accuracyTone,
} from "../utils/formatters";

const coinMeta = {
  bitcoin: { asset: "BTC", label: "Bitcoin", color: "#F7931A" },
  ethereum: { asset: "ETH", label: "Ethereum", color: "#627EEA" },
};

export default function CoinDetail() {
  const { coin } = useParams();
  const meta = coinMeta[coin];

  const [history, setHistory] = useState([]);
  const [chartData, setChartData] = useState(null);
  const [scheduler, setScheduler] = useState(null);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 15;

  useEffect(() => {
    if (!meta) return;
    loadChartData();
    loadDailyHistory(1);
    loadSchedulerStatus();
  }, [meta?.asset]);

  async function loadSchedulerStatus() {
    try {
      const status = await getSchedulerStatus();
      setScheduler(status);
    } catch {
      // Silently ignore scheduler status errors
    }
  }

  async function loadChartData() {
    try {
      const payload = await getChartData(meta.asset);
      setChartData(payload);
    } catch (err) {
      setError(err.message);
    }
  }

  async function loadDailyHistory(p) {
    setIsLoadingHistory(true);
    try {
      const payload = await getDailyHistory({ coin: meta.asset, page: p, limit });
      setHistory(payload.data || []);
      setTotal(payload.total || 0);
      setPage(payload.page || p);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoadingHistory(false);
    }
  }

  const latest = history[0] || null;

  const averageError = useMemo(() => {
    const historical = chartData?.historical || [];
    const errors = historical.flatMap((d) =>
      ["h1", "h3", "h7"]
        .map((k) => calculateErrorPercent(d[k], d.actual))
        .filter(Number.isFinite),
    );
    if (!errors.length) return null;
    return errors.reduce((t, v) => t + v, 0) / errors.length;
  }, [chartData]);

  const averageMae = useMemo(() => {
    const historical = chartData?.historical || [];
    const values = historical.flatMap((d) =>
      ["h1", "h3", "h7"]
        .map((k) => {
          if (d[k] == null || d.actual == null) return null;
          return Math.abs(d[k] - d.actual);
        })
        .filter(Number.isFinite),
    );
    if (!values.length) return null;
    return values.reduce((t, v) => t + v, 0) / values.length;
  }, [chartData]);

  const averageRmse = useMemo(() => {
    const historical = chartData?.historical || [];
    const sqErrors = historical.flatMap((d) =>
      ["h1", "h3", "h7"]
        .map((k) => {
          if (d[k] == null || d.actual == null) return null;
          return Math.pow(d[k] - d.actual, 2);
        })
        .filter(Number.isFinite),
    );
    if (!sqErrors.length) return null;
    return Math.sqrt(sqErrors.reduce((t, v) => t + v, 0) / sqErrors.length);
  }, [chartData]);

  const totalPredictions = useMemo(() => {
    if (chartData?.historical?.length) return chartData.historical.length;
    return total || 0;
  }, [chartData, total]);

  const latestError = calculateErrorPercent(latest?.predicted_price, latest?.actual_price);

  if (!meta) {
    return (
      <div className="grid min-h-[220px] place-items-center rounded-2xl border border-dashed border-slate-300 p-8 text-center">
        <h3 className="mb-2 text-lg font-semibold">Koin tidak ditemukan</h3>
        <p>
          <Link to="/" className="text-brand-600 hover:underline">Kembali ke dashboard</Link>
        </p>
      </div>
    );
  }

  return (
    <>
      <header className="py-4">
        <Link to="/" className="mb-4 inline-flex items-center gap-1.5 text-sm font-bold text-brand-600 transition hover:opacity-70">
          &larr; Dashboard
        </Link>
        <div className="flex items-center gap-3">
          <div className="size-4 shrink-0 rounded-full" style={{ background: meta.color }} />
          <h1 className="text-3xl font-extrabold tracking-tight lg:text-5xl">{meta.label}</h1>
          <Badge tone="warning">{meta.asset}</Badge>
        </div>
        <p className="mt-2 text-slate-500">Prediksi harga {meta.label} dengan model CNN-LSTM</p>
      </header>

      {error ? <div className="rounded-xl border border-red-200 bg-red-50 p-4 font-medium text-red-800">{error}</div> : null}

      <section className="grid grid-cols-2 gap-4 lg:grid-cols-3" aria-label="Prediction metrics">
        <MetricCard label="Prediksi terbaru" value={formatCurrency(latest?.predicted_price)} meta={latest ? `${latest.horizon} hari ke depan` : "Belum ada data"} tone="primary" />
        <MetricCard label="Harga aktual" value={latest?.actual_price ? formatCurrency(latest.actual_price) : "—"} meta={latest?.actual_price ? formatDate(latest.prediction_date) : latest ? "Belum tersedia" : "Menunggu prediksi"} />
        <MetricCard label="MAPE" value={formatPercent(latestError)} meta="Error terbaru" tone={accuracyTone(latestError)} />
        <MetricCard label="MAPE Rata-rata" value={formatPercent(averageError)} meta={`${totalPredictions} target`} tone={accuracyTone(averageError)} />
        <MetricCard label="MAE Rata-rata" value={formatCurrency(averageMae)} meta={`${totalPredictions} target`} tone={accuracyTone(averageError)} />
        <MetricCard label="RMSE Rata-rata" value={formatCurrency(averageRmse)} meta={`${totalPredictions} target`} tone={accuracyTone(averageError)} />
      </section>

      <section className="grid grid-cols-1 gap-7 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="mb-2 text-xs font-bold uppercase tracking-widest text-slate-500">Inference</p>
              <h2 className="text-xl font-bold tracking-tight">Prediksi Otomatis</h2>
            </div>
            {scheduler ? (
              <Badge tone={scheduler.running ? "success" : "danger"}>
                {scheduler.running ? "Aktif" : "Tidak Aktif"}
              </Badge>
            ) : null}
          </div>
          <p className="mt-5 text-sm leading-relaxed text-slate-600">
            Prediksi dijalankan secara otomatis <strong>setiap jam</strong> oleh scheduler.
            Sistem mengambil harga close terbaru dari Binance, menghitung error prediksi sebelumnya, lalu
            menjalankan model CNN-LSTM untuk seluruh kombinasi aset (BTC, ETH) dan horizon (1, 3, 7 hari).
          </p>
          {scheduler ? (
            <div className="mt-4 rounded-xl bg-slate-50 p-4 text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <dt className="text-xs font-bold uppercase tracking-widest text-slate-500">Run Terakhir</dt>
                  <dd className="mt-1 font-semibold text-slate-900">
                    {scheduler.lastRun ? new Date(scheduler.lastRun).toLocaleString("id-ID") : "Belum pernah"}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-bold uppercase tracking-widest text-slate-500">Status Terakhir</dt>
                  <dd className="mt-1">
                    <Badge tone={
                      scheduler.lastStatus === "success" ? "success" :
                      scheduler.lastStatus === "partial" ? "warning" : "danger"
                    }>
                      {scheduler.lastStatus === "success" ? "Sukses" :
                       scheduler.lastStatus === "partial" ? "Sebagian Gagal" :
                       scheduler.lastStatus ?? "Menunggu"}
                    </Badge>
                  </dd>
                </div>
              </div>
              {scheduler.results?.length > 0 ? (
                <div className="mt-3 border-t border-slate-200 pt-3">
                  <dt className="text-xs font-bold uppercase tracking-widest text-slate-500">Detail Prediksi</dt>
                  <dd className="mt-2 grid grid-cols-3 gap-1.5">
                    {scheduler.results.map((r) => (
                      <div
                        key={r.key}
                        className={`rounded-lg px-2 py-1 text-xs font-medium ${
                          r.status === "success"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {r.key}
                      </div>
                    ))}
                  </dd>
                </div>
              ) : null}
            </div>
          ) : (
            <div className="mt-4 rounded-xl bg-slate-50 p-4 text-center text-sm text-slate-500">
              Memeriksa status scheduler...
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="mb-2 text-xs font-bold uppercase tracking-widest text-slate-500">Model</p>
              <h2 className="text-xl font-bold tracking-tight">Konfigurasi</h2>
            </div>
          </div>
          <dl className="mt-5 grid grid-cols-2 gap-4">
            <div className="rounded-xl bg-slate-50 p-4">
              <dt className="text-xs font-bold uppercase tracking-widest text-slate-500">Arsitektur</dt>
              <dd className="mt-2 text-base font-bold text-slate-900">CNN-LSTM</dd>
            </div>
            <div className="rounded-xl bg-slate-50 p-4">
              <dt className="text-xs font-bold uppercase tracking-widest text-slate-500">Aset</dt>
              <dd className="mt-2 text-base font-bold text-slate-900">{meta.label}</dd>
            </div>
            <div className="rounded-xl bg-slate-50 p-4">
              <dt className="text-xs font-bold uppercase tracking-widest text-slate-500">Horizon</dt>
              <dd className="mt-2 text-base font-bold text-slate-900">1, 3, 7 hari</dd>
            </div>
            <div className="rounded-xl bg-slate-50 p-4">
              <dt className="text-xs font-bold uppercase tracking-widest text-slate-500">Fitur</dt>
              <dd className="mt-2 text-base font-bold text-slate-900">OHLCV + RSI + MACD + FGI</dd>
            </div>
          </dl>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-widest text-slate-500">Trend</p>
            <h2 className="text-xl font-bold tracking-tight">Prediksi vs aktual</h2>
          </div>
        </div>
        <ForecastChart
          historical={chartData?.historical}
          forecasts={chartData?.forecasts}
          srLevels={chartData?.srLevels}
          lastClose={chartData?.lastClose}
        />
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-widest text-slate-500">Riwayat</p>
            <h2 className="text-xl font-bold tracking-tight">Histori prediksi</h2>
          </div>
        </div>
        {isLoadingHistory ? (
          <div className="grid min-h-[220px] place-items-center rounded-2xl border border-dashed border-slate-300 p-8 text-center">
            <h3 className="mb-2 text-lg font-semibold">Memuat data...</h3>
            <p className="max-w-sm text-slate-500">Mengambil histori prediksi dari server.</p>
          </div>
        ) : (
          <HistoryTable
            rows={history}
            total={total}
            page={page}
            limit={limit}
            onPageChange={(p) => loadDailyHistory(p)}
          />
        )}
      </section>
    </>
  );
}
