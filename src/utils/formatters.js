export function formatCurrency(value) {
  const number = Number(value);

  if (!Number.isFinite(number)) {
    return "-";
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(number);
}

export function formatPercent(value) {
  const number = Number(value);

  if (!Number.isFinite(number)) {
    return "-";
  }

  return `${number.toFixed(2)}%`;
}

export function formatDate(value) {
  if (!value) {
    return "-";
  }

  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

export function calculateErrorPercent(predicted, actual) {
  const predictedValue = Number(predicted);
  const actualValue = Number(actual);

  if (!Number.isFinite(predictedValue) || !Number.isFinite(actualValue) || actualValue === 0) {
    return null;
  }

  return Math.abs((predictedValue - actualValue) / actualValue) * 100;
}
