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

export function getPredictionHistory() {
  return request("/api/predictions/history");
}

export function createPrediction({ asset, horizon }) {
  return request("/api/predictions", {
    method: "POST",
    body: JSON.stringify({ asset, horizon }),
  });
}
