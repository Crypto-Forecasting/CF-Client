const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

const _cache = new Map();
const _CACHE_TTL = Number(import.meta.env.VITE_CACHE_TTL) || 5 * 60 * 1000;

function cacheKey(fn, ...args) {
  return fn.name + "::" + JSON.stringify(args);
}

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  });

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(payload.error || "Request failed");
  }

  return payload;
}

function cachedRequest(key) {
  return request(key).then((data) => {
    _cache.set(key, { data, ts: Date.now() });
    return data;
  });
}

function getCached(key) {
  const hit = _cache.get(key);
  if (hit && Date.now() - hit.ts < _CACHE_TTL) {
    return Promise.resolve(hit.data);
  }
  return cachedRequest(key);
}

export function getPredictionHistory({ coin, start, end, page, limit } = {}) {
  const params = new URLSearchParams();
  if (coin) params.set("coin", coin);
  if (start) params.set("start", start);
  if (end) params.set("end", end);
  if (page) params.set("page", String(page));
  if (limit) params.set("limit", String(limit));

  const query = params.toString();
  return request(`/api/predictions/history${query ? `?${query}` : ""}`);
}

export function getStats() {
  return request("/api/stats");
}

export function getChartData(coin) {
  const key = `/api/predictions/chart?coin=${coin}`;
  return getCached(key);
}

export function getDailyHistory({ coin, page, limit, month } = {}) {
  const params = new URLSearchParams();
  if (coin) params.set("coin", coin);
  if (page) params.set("page", String(page));
  if (limit) params.set("limit", String(limit));
  if (month) params.set("month", month);
  const query = params.toString();
  const key = `/api/predictions/daily${query ? `?${query}` : ""}`;
  return getCached(key);
}

export function getSchedulerStatus() {
  return request("/api/scheduler/status");
}
