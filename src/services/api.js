const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

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
  return request(`/api/predictions/chart?coin=${coin}`);
}

export function getDailyHistory({ coin, page, limit } = {}) {
  const params = new URLSearchParams();
  if (coin) params.set("coin", coin);
  if (page) params.set("page", String(page));
  if (limit) params.set("limit", String(limit));
  const query = params.toString();
  return request(`/api/predictions/daily${query ? `?${query}` : ""}`);
}

export function getSchedulerStatus() {
  return request("/api/scheduler/status");
}

