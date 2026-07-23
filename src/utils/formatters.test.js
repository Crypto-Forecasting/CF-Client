import { describe, it, expect } from "vitest";
import {
  formatCurrency,
  formatPercent,
  formatDate,
  calculateErrorPercent,
  accuracyTone,
} from "../utils/formatters";

describe("formatCurrency", () => {
  it("formats a positive number", () => {
    expect(formatCurrency(1234.56)).toBe("$1,234.56");
  });

  it("formats a large number", () => {
    expect(formatCurrency(67890)).toBe("$67,890.00");
  });

  it("formats zero", () => {
    expect(formatCurrency(0)).toBe("$0.00");
  });

  it("converts null to zero", () => {
    expect(formatCurrency(null)).toBe("$0.00");
  });

  it("returns dash for undefined", () => {
    expect(formatCurrency(undefined)).toBe("-");
  });

  it("returns dash for NaN", () => {
    expect(formatCurrency(NaN)).toBe("-");
  });

  it("returns dash for Infinity", () => {
    expect(formatCurrency(Infinity)).toBe("-");
  });

  it("returns dash for string", () => {
    expect(formatCurrency("abc")).toBe("-");
  });
});

describe("formatPercent", () => {
  it("formats a number", () => {
    expect(formatPercent(2.345)).toBe("2.35%");
  });

  it("formats zero", () => {
    expect(formatPercent(0)).toBe("0.00%");
  });

  it("converts null to zero", () => {
    expect(formatPercent(null)).toBe("0.00%");
  });

  it("returns dash for undefined", () => {
    expect(formatPercent(undefined)).toBe("-");
  });

  it("returns dash for NaN", () => {
    expect(formatPercent(NaN)).toBe("-");
  });

  it("returns dash for Infinity", () => {
    expect(formatPercent(Infinity)).toBe("-");
  });
});

describe("formatDate", () => {
  it("formats an ISO date string", () => {
    const result = formatDate("2026-06-30");
    expect(result).toContain("Jun");
    expect(result).toContain("2026");
  });

  it("returns dash for empty value", () => {
    expect(formatDate("")).toBe("-");
  });

  it("returns dash for null", () => {
    expect(formatDate(null)).toBe("-");
  });

  it("returns dash for undefined", () => {
    expect(formatDate(undefined)).toBe("-");
  });
});

describe("calculateErrorPercent", () => {
  it("calculates 10% error", () => {
    expect(calculateErrorPercent(110, 100)).toBe(10);
  });

  it("calculates error when prediction is lower", () => {
    expect(calculateErrorPercent(90, 100)).toBe(10);
  });

  it("returns zero when predicted equals actual", () => {
    expect(calculateErrorPercent(100, 100)).toBe(0);
  });

  it("handles string inputs", () => {
    expect(calculateErrorPercent("110", "100")).toBe(10);
  });

  it("returns null when actual is zero", () => {
    expect(calculateErrorPercent(100, 0)).toBeNull();
  });

  it("returns null for non-finite inputs", () => {
    expect(calculateErrorPercent(NaN, 100)).toBeNull();
    expect(calculateErrorPercent(100, NaN)).toBeNull();
  });

  it("converts null predicted to zero (so error = 100%)", () => {
    expect(calculateErrorPercent(null, 100)).toBe(100);
  });
});

describe("accuracyTone", () => {
  it('returns "success" for MAPE < 3', () => {
    expect(accuracyTone(2)).toBe("success");
    expect(accuracyTone(0.5)).toBe("success");
    expect(accuracyTone(2.99)).toBe("success");
  });

  it('returns "warning" for 3 <= MAPE < 10', () => {
    expect(accuracyTone(3)).toBe("warning");
    expect(accuracyTone(5)).toBe("warning");
    expect(accuracyTone(9.99)).toBe("warning");
  });

  it('returns "danger" for MAPE >= 10', () => {
    expect(accuracyTone(10)).toBe("danger");
    expect(accuracyTone(25)).toBe("danger");
    expect(accuracyTone(100)).toBe("danger");
  });

  it('returns "default" for null or non-finite', () => {
    expect(accuracyTone(null)).toBe("default");
    expect(accuracyTone(undefined)).toBe("default");
    expect(accuracyTone(NaN)).toBe("default");
  });
});
