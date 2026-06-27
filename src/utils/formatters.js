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

export function accuracyTone(mape) {
  if (mape == null || !Number.isFinite(mape)) return "default";
  if (mape < 3) return "success";
  if (mape < 10) return "warning";
  return "danger";
}

export function lttb(data, threshold) {
  if (data.length <= threshold || threshold < 2) return data.slice();

  const output = [];
  const bucketSize = (data.length - 2) / (threshold - 2);

  output.push(data[0]);

  for (let i = 0; i < threshold - 2; i++) {
    const bucketStart = Math.floor((i + 0) * bucketSize) + 1;
    const bucketEnd = Math.min(Math.floor((i + 1) * bucketSize) + 1, data.length - 1);

    const nextBucketStart = Math.min(Math.floor((i + 1) * bucketSize) + 1, data.length - 1);
    const nextBucketEnd = Math.min(Math.floor((i + 2) * bucketSize) + 1, data.length - 1);

    const avgX = (nextBucketStart + nextBucketEnd) / 2;
    let avgY = 0;
    let count = 0;
    for (let j = nextBucketStart; j < nextBucketEnd; j++) {
      avgY += Number(data[j].actual) || Number(data[j].dateIso ? 0 : 0);
      count++;
    }
    avgY /= count || 1;

    let maxArea = -1;
    let maxIndex = bucketStart;

    const aX = i;
    const aY = Number(data[i > 0 ? output[output.length - 1]?.actual || 0 : data[0]?.actual || 0]);

    for (let j = bucketStart; j < bucketEnd; j++) {
      const area = Math.abs((aX - avgX) * (Number(data[j].actual) || 0 - aY) -
        (aX - j) * (avgY - aY));
      if (area > maxArea) {
        maxArea = area;
        maxIndex = j;
      }
    }

    output.push(data[maxIndex]);
  }

  output.push(data[data.length - 1]);
  return output;
}
