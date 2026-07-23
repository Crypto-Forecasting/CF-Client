import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import HistoryTable from "../components/HistoryTable";

const sampleRows = [
  {
    targetDate: "2026-06-30",
    actual: 63400,
    h1: { predicted: 64000, error: 0.94, errorPercent: 0.94, absoluteError: 600, squaredError: 360000 },
    h3: { predicted: 64500, error: 1.73, errorPercent: 1.73, absoluteError: 1100, squaredError: 1210000 },
    h7: { predicted: 65000, error: 2.52, errorPercent: 2.52, absoluteError: 1600, squaredError: 2560000 },
  },
  {
    targetDate: "2026-06-29",
    actual: 62800,
    h1: { predicted: 63000, error: 0.32, errorPercent: 0.32, absoluteError: 200, squaredError: 40000 },
    h3: null,
    h7: { predicted: 64000, error: 1.91, errorPercent: 1.91, absoluteError: 1200, squaredError: 1440000 },
  },
];

const sampleStats = {
  h1: { mape: 0.63, mae: 400, rmse: 500 },
  h3: { mape: 1.73, mae: 1100, rmse: 1210 },
  h7: { mape: 2.22, mae: 1400, rmse: 2000 },
};

describe("HistoryTable", () => {
  it("renders without crashing", () => {
    render(<HistoryTable rows={sampleRows} total={2} page={1} limit={10} stats={sampleStats} />);
    const els = screen.getAllByText("$64,000.00");
    expect(els.length).toBeGreaterThanOrEqual(1);
  });

  it("renders actual price", () => {
    render(<HistoryTable rows={sampleRows} total={2} page={1} limit={10} stats={sampleStats} />);
    expect(screen.getByText("$63,400.00")).toBeTruthy();
  });

  it("renders error percentage with tone color", () => {
    render(<HistoryTable rows={sampleRows} total={2} page={1} limit={10} stats={sampleStats} />);
    const pct94 = screen.getAllByText("0.94%");
    const pct252 = screen.getAllByText("2.52%");
    expect(pct94.length).toBeGreaterThanOrEqual(1);
    expect(pct252.length).toBeGreaterThanOrEqual(1);
  });

  it("shows dash for missing prediction rows", () => {
    render(<HistoryTable rows={sampleRows} total={2} page={1} limit={10} stats={sampleStats} />);
    const dashes = screen.getAllByText("—");
    expect(dashes.length).toBeGreaterThanOrEqual(2);
  });

  it("renders month picker trigger with Semua Bulan", () => {
    render(<HistoryTable rows={sampleRows} total={2} page={1} limit={10} />);
    expect(screen.getByText("Semua Bulan")).toBeTruthy();
  });

  it("shows total count when paginated", () => {
    render(<HistoryTable rows={sampleRows} total={25} page={1} limit={10} stats={sampleStats} onPageChange={() => {}} />);
    expect(screen.getByText("25 total")).toBeTruthy();
  });

  it("shows empty state when no rows", () => {
    render(<HistoryTable rows={[]} total={0} page={1} limit={10} />);
    expect(screen.getByText("Belum ada histori prediksi")).toBeTruthy();
  });

  it("calls onMonthChange when selecting a month from popup", async () => {
    const onMonthChange = vi.fn();
    render(<HistoryTable rows={sampleRows} total={2} page={1} limit={10} onMonthChange={onMonthChange} />);
    const user = userEvent.setup();
    const trigger = screen.getByRole("button", { name: /Semua Bulan/ });
    await user.click(trigger);
    const june = screen.getByRole("button", { name: "Jun" });
    await user.click(june);
    const currentYear = new Date().getFullYear();
    expect(onMonthChange).toHaveBeenCalledWith(`${currentYear}-06`);
  });
});
