import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import ErrorTable from "../components/ErrorTable";

describe("ErrorTable", () => {
  const fullErrors = {
    h1: { mape: 2.3, mae: 1200, rmse: 1500 },
    h3: { mape: 3.8, mae: 2100, rmse: 2500 },
    h7: { mape: 5.2, mae: 3200, rmse: 3800 },
  };

  it("renders coin label in heading", () => {
    render(<ErrorTable coin="BTC" horizonErrors={fullErrors} />);
    expect(screen.getByText("BTC")).toBeTruthy();
  });

  it("renders three horizon rows", () => {
    render(<ErrorTable coin="ETH" horizonErrors={fullErrors} />);
    expect(screen.getByText("H1")).toBeTruthy();
    expect(screen.getByText("H3")).toBeTruthy();
    expect(screen.getByText("H7")).toBeTruthy();
  });

  it("shows formatted MAPE values", () => {
    render(<ErrorTable coin="BTC" horizonErrors={fullErrors} />);
    expect(screen.getByText("2.30%")).toBeTruthy();
    expect(screen.getByText("3.80%")).toBeTruthy();
    expect(screen.getByText("5.20%")).toBeTruthy();
  });

  it("shows dash for missing errors", () => {
    render(<ErrorTable coin="BTC" horizonErrors={{ h1: { mape: null, mae: null, rmse: null } }} />);
    const dashes = screen.getAllByText("—");
    expect(dashes.length).toBeGreaterThan(0);
  });

  it("renders table header columns", () => {
    render(<ErrorTable coin="BTC" horizonErrors={fullErrors} />);
    expect(screen.getByText("Hz")).toBeTruthy();
    expect(screen.getByText("MAPE")).toBeTruthy();
    expect(screen.getByText("MAE")).toBeTruthy();
    expect(screen.getByText("RMSE")).toBeTruthy();
  });

  it("handles undefined horizonErrors", () => {
    render(<ErrorTable coin="BTC" horizonErrors={undefined} />);
    expect(screen.getByText("BTC")).toBeTruthy();
    expect(screen.getByText("H1")).toBeTruthy();
  });
});
