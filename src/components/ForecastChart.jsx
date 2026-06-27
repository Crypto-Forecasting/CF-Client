import { useState, useMemo } from "react";
import {
  ComposedChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Area,
  Dot,
} from "recharts";
import {
  formatCurrency,
  calculateErrorPercent,
  formatPercent,
  accuracyTone,
  lttb,
} from "../utils/formatters";

const RANGES = [
  { label: "7d", days: 7 },
  { label: "30d", days: 30 },
  { label: "90d", days: 90 },
  { label: "All", days: null },
];

const HORIZON_COLORS = { h1: "#3b82f6", h3: "#14b8a6", h7: "#a855f7" };
const HORIZON_LABELS = { h1: "1d", h3: "3d", h7: "7d" };

function formatCompactCurrency(v) {
  if (!Number.isFinite(v)) return "";
  if (Math.abs(v) >= 1000) {
    return new Intl.NumberFormat("en-US", {
      notation: "compact",
      compactDisplay: "short",
      style: "currency",
      currency: "USD",
    }).format(v);
  }
  return formatCurrency(v);
}

function HistoricalTooltip({ active, payload }) {
  if (!active || !payload || !payload.length) return null;
  const data = payload[0]?.payload;
  const date = data?.dateFull || data?.date;
  const actual = data?.actual;

  return (
    <div className="min-w-[180px] rounded-xl border border-slate-200 bg-white p-4 text-sm shadow-xl">
      <div className="mb-1 font-semibold text-slate-500">{date}</div>
      <div className="my-2 h-px bg-slate-200" />
      {actual != null && (
        <div className="flex items-center gap-1.5 py-0.5 font-medium text-slate-900">
          <span className="size-2.5 shrink-0 rounded-full bg-slate-800" />
          Aktual: {formatCurrency(actual)}
        </div>
      )}
      {["h1", "h3", "h7"].map((h) => {
        const pv = data[`hist_${h}`];
        if (pv == null || !Number.isFinite(pv)) return null;
        const hError = calculateErrorPercent(pv, actual);
        const tone = accuracyTone(hError);
        const toneColor =
          tone === "success"
            ? "#22c55e"
            : tone === "warning"
              ? "#f59e0b"
              : "#ef4444";
        return (
          <div
            key={h}
            className="flex items-center gap-1.5 py-0.5 font-medium text-slate-900"
          >
            <span
              className="size-2.5 shrink-0 rounded-full"
              style={{ background: HORIZON_COLORS[h] }}
            />
            {HORIZON_LABELS[h]}: {formatCurrency(pv)}
            {hError != null && (
              <span className="ml-2 font-semibold" style={{ color: toneColor }}>
                {formatPercent(hError)}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}

function PredictionTooltip({ active, payload }) {
  if (!active || !payload || !payload.length) return null;
  const data = payload[0]?.payload;
  if (data?.isAnchor) return null;

  return (
    <div className="min-w-[180px] rounded-xl border border-slate-200 bg-white p-4 text-sm shadow-xl">
      <div className="mb-1 font-semibold text-slate-500">
        Horizon {data.horizonDays} Hari
      </div>
      <div className="my-2 h-px bg-slate-200" />
      <div className="flex items-center gap-1.5 py-0.5 font-medium text-slate-900">
        <span
          className="size-2.5 shrink-0 rounded-full"
          style={{ background: "#8b5cf6" }}
        />
        Prediksi: {formatCurrency(data.price)}
      </div>
      {data.lo != null && data.hi != null && (
        <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-500">
          Range: {formatCompactCurrency(data.lo)} –{" "}
          {formatCompactCurrency(data.hi)}
        </div>
      )}
    </div>
  );
}

export default function ForecastChart({
  historical,
  forecasts,
  srLevels,
  lastClose,
}) {
  const [activeRange, setActiveRange] = useState(null);

  const historicalChartData = useMemo(() => {
    let data = (historical || []).map((d) => ({
      ...d,
      dateIso: d.date,
      dateFull: d.date,
      actual: d.actual,
      hist_h1: d.h1,
      hist_h3: d.h3,
      hist_h7: d.h7,
    }));

    if (activeRange) {
      const todayIso = new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Jakarta" });
      const cutoff = new Date(todayIso);
      cutoff.setUTCDate(cutoff.getUTCDate() - activeRange);
      data = data.filter((d) => d.date && new Date(d.date) >= cutoff);
    }

    if (data.length > 120) {
      data = lttb(data, 120);
    }

    return data;
  }, [historical, activeRange]);

  const predictionChartData = useMemo(() => {
    if (!forecasts || forecasts.length === 0) return [];
    const points = forecasts.map((f) => {
      const price = Number(f.price);
      const mape = f.mape || 5;
      const bandPct = (mape / 100) * 2;
      return {
        horizon: `H+${f.horizon}`,
        horizonDays: f.horizon,
        price,
        lo: price * (1 - bandPct),
        hi: price * (1 + bandPct),
      };
    });
    if (lastClose != null && Number.isFinite(Number(lastClose))) {
      points.unshift({
        horizon: "",
        horizonDays: 0,
        price: Number(lastClose),
        lo: null,
        hi: null,
        isAnchor: true,
      });
    }
    return points;
  }, [forecasts, lastClose]);

  const yDomain = useMemo(() => {
    const allValues = [];
    historicalChartData.forEach((d) => {
      if (d.actual != null) allValues.push(Number(d.actual));
    });
    predictionChartData.forEach((d) => {
      if (d.price != null) allValues.push(d.price);
      if (d.lo != null) allValues.push(d.lo);
      if (d.hi != null) allValues.push(d.hi);
    });
    if (allValues.length === 0) return ["auto", "auto"];
    const min = Math.min(...allValues);
    const max = Math.max(...allValues);
    const padding = (max - min) * 0.05 || 1;
    return [Math.floor(min - padding), Math.ceil(max + padding)];
  }, [historicalChartData, predictionChartData]);

  if (!historicalChartData.length || historicalChartData.length < 2) {
    return (
      <div className="grid min-h-[220px] place-items-center rounded-2xl border border-dashed border-slate-300 p-8 text-center">
        <h3 className="mb-2 text-lg font-semibold">Data chart belum cukup</h3>
        <p className="max-w-sm text-slate-500">
          Minimal dua prediksi dengan harga aktual diperlukan.
        </p>
      </div>
    );
  }

  const hasPredictions = predictionChartData.some((d) => !d.isAnchor);
  const todayIso = new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Jakarta" });

  const histPct = activeRange === 7 ? 50 : activeRange === 30 ? 65 : 75;
  const predPct = 100 - histPct;

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-1">
          {RANGES.map((range) => (
            <button
              type="button"
              key={range.label}
              className={`min-h-[36px] rounded-lg border border-slate-300 px-4 py-1.5 text-sm font-semibold text-slate-700 transition ${
                activeRange === range.days
                  ? "border-brand-600 bg-brand-600 text-white"
                  : "bg-white hover:border-teal-500"
              }`}
              onClick={() => setActiveRange(range.days)}
            >
              {range.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex">
        <div style={{ width: `${histPct}%` }}>
          <ResponsiveContainer width="100%" height={420}>
            <ComposedChart
              data={historicalChartData}
              margin={{ top: 24, right: 20, bottom: 12, left: 12 }}
            >
              <defs>
                <linearGradient id="fillActual" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#0f172a" stopOpacity={0.16} />
                  <stop offset="100%" stopColor="#0f172a" stopOpacity={0} />
                </linearGradient>
              </defs>

              <CartesianGrid
                strokeDasharray="4 4"
                stroke="#e2e8f0"
                vertical={false}
              />
              <XAxis
                dataKey="dateIso"
                tick={{ fontSize: 11, fill: "#64748b", fontWeight: 500 }}
                tickFormatter={(v) =>
                  `${new Date(v).getDate()} ${new Date(v).toLocaleString("en", { month: "short" })}`
                }
                tickLine={false}
                axisLine={false}
                minTickGap={20}
              />
              <YAxis
                tick={{ fontSize: 11, fill: "#64748b", fontWeight: 500 }}
                tickFormatter={formatCompactCurrency}
                tickLine={false}
                axisLine={false}
                width={72}
                domain={yDomain}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                hide
                domain={yDomain}
              />

              <Tooltip content={<HistoricalTooltip />} />

              <Area
                dataKey="actual"
                fill="url(#fillActual)"
                stroke="none"
                connectNulls
              />
              <Line
                dataKey="actual"
                stroke="#0f172a"
                strokeWidth={3}
                dot={false}
                activeDot={{ r: 5, fill: "#0f172a" }}
                connectNulls={false}
                animationDuration={800}
              />

              {["h1", "h3", "h7"].map((h) => (
                <Line
                  key={`hist-${h}`}
                  dataKey={`hist_${h}`}
                  stroke={HORIZON_COLORS[h]}
                  strokeWidth={1.5}
                  dot={false}
                  activeDot={{ r: 5, strokeWidth: 2, stroke: "#fff" }}
                  connectNulls={false}
                  animationDuration={800}
                />
              ))}

              {hasPredictions && (
                <ReferenceLine
                  x={todayIso}
                  stroke="#94a3b8"
                  strokeWidth={1.5}
                  strokeDasharray="4 4"
                  label={{
                    value: "Today",
                    position: "top",
                    fill: "#64748b",
                    fontSize: 11,
                    fontWeight: 700,
                  }}
                />
              )}

              {srLevels?.support != null && (
                <ReferenceLine
                  y={srLevels.support}
                  yAxisId="right"
                  stroke="#22c55e"
                  strokeWidth={1}
                  strokeDasharray="4 2"
                  label={{
                    value: `S ${formatCompactCurrency(srLevels.support)}`,
                    position: "right",
                    fill: "#22c55e",
                    fontSize: 10,
                    fontWeight: 600,
                  }}
                />
              )}
              {srLevels?.resistance != null && (
                <ReferenceLine
                  y={srLevels.resistance}
                  yAxisId="right"
                  stroke="#ef4444"
                  strokeWidth={1}
                  strokeDasharray="4 2"
                  label={{
                    value: `R ${formatCompactCurrency(srLevels.resistance)}`,
                    position: "right",
                    fill: "#ef4444",
                    fontSize: 10,
                    fontWeight: 600,
                  }}
                />
              )}
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {hasPredictions && (
          <>
            <div className="w-px shrink-0 bg-slate-200" />
            <div className="shrink-0" style={{ width: `${predPct}%` }}>
              <ResponsiveContainer width="100%" height={420}>
                <ComposedChart
                  data={predictionChartData}
                  margin={{ top: 24, right: 28, bottom: 12, left: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray="4 4"
                    stroke="#e2e8f0"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="horizon"
                    type="category"
                    tick={{
                      fontSize: 11,
                      fill: "#8b5cf6",
                      fontWeight: 700,
                    }}
                    tickLine={false}
                    axisLine={false}
                    minTickGap={0}
                  />
                  <YAxis hide domain={yDomain} />

                  <Tooltip content={<PredictionTooltip />} />

                  <Line
                    dataKey="price"
                    stroke="#8b5cf6"
                    strokeWidth={2.5}
                    strokeDasharray="6 4"
                    dot={({ cx, cy, index }) => {
                      if (predictionChartData[index]?.isAnchor) return false;
                      return (
                        <Dot
                          cx={cx}
                          cy={cy}
                          r={7}
                          fill="#8b5cf6"
                          stroke="#fff"
                          strokeWidth={2}
                        />
                      );
                    }}
                    activeDot={{
                      r: 9,
                      fill: "#8b5cf6",
                      strokeWidth: 3,
                      stroke: "#fff",
                    }}
                    connectNulls={false}
                    animationDuration={800}
                    label={({ x, y, index }) => {
                      const item = predictionChartData[index];
                      if (!item || item.isAnchor) return null;
                      return (
                        <g>
                          <text
                            x={x}
                            y={y - 20}
                            textAnchor="middle"
                            fill="#8b5cf6"
                            fontSize={12}
                            fontWeight={700}
                          >
                            {item.horizonDays}d
                          </text>
                        </g>
                      );
                    }}
                  />

                  <Line
                    dataKey="hi"
                    stroke="#c4b5fd"
                    strokeWidth={1}
                    strokeDasharray="3 3"
                    dot={false}
                    activeDot={false}
                    connectNulls={false}
                    animationDuration={800}
                  />
                  <Line
                    dataKey="lo"
                    stroke="#c4b5fd"
                    strokeWidth={1}
                    strokeDasharray="3 3"
                    dot={false}
                    activeDot={false}
                    connectNulls={false}
                    animationDuration={800}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </>
        )}
      </div>

      <div className="mt-4 flex flex-wrap justify-center gap-6 border-t border-slate-100 pt-4 text-xs font-medium">
        <div className="flex items-center gap-1.5">
          <span className="inline-block size-3 rounded-full bg-slate-800" />
          Aktual
        </div>
        {["h1", "h3", "h7"].map((h) => (
          <div key={h} className="flex items-center gap-1.5">
            <span
              className="inline-block size-3 rounded-full"
              style={{ background: HORIZON_COLORS[h] }}
            />
            {HORIZON_LABELS[h]} Prediksi
          </div>
        ))}
        {hasPredictions && (
          <div className="flex items-center gap-1.5">
            <span
              className="inline-block size-3 rounded-full"
              style={{ background: "#8b5cf6" }}
            />
            Forecast
          </div>
        )}
      </div>
    </div>
  );
}
