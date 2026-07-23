import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import PredictionCard from "../components/PredictionCard";

function renderCard(props = {}) {
  return render(
    <MemoryRouter>
      <PredictionCard
        coin="BTC"
        prediction={null}
        lastClose={null}
        {...props}
      />
    </MemoryRouter>
  );
}

describe("PredictionCard", () => {
  it("renders Bitcoin label", () => {
    renderCard();
    expect(screen.getByText("Bitcoin")).toBeTruthy();
  });

  it("shows coin symbol with H7 label", () => {
    renderCard();
    expect(screen.getByText(/BTC.*H7/)).toBeTruthy();
  });

  it("shows placeholder when no prediction data", () => {
    renderCard();
    expect(screen.getByText("Data belum tersedia")).toBeTruthy();
  });

  it("shows dash for predicted price when null", () => {
    renderCard();
    expect(screen.getByText("—")).toBeTruthy();
  });

  it("shows predicted price when available", () => {
    renderCard({ prediction: { h7: 65000 } });
    expect(screen.getByText("$65,000.00")).toBeTruthy();
  });

  it("shows green up indicator when predicted > close", () => {
    renderCard({ prediction: { h7: 65000 }, lastClose: 60000 });
    expect(screen.getByText("8.33%")).toBeTruthy();
    expect(screen.getByText("Prediksi naik")).toBeTruthy();
  });

  it("shows red down indicator when predicted < close", () => {
    renderCard({ prediction: { h7: 55000 }, lastClose: 60000 });
    expect(screen.getByText("8.33%")).toBeTruthy();
    expect(screen.getByText("Prediksi turun")).toBeTruthy();
  });

  it("renders for Ethereum", () => {
    renderCard({ coin: "ETH" });
    expect(screen.getByText("Ethereum")).toBeTruthy();
    expect(screen.getByText(/ETH.*H7/)).toBeTruthy();
  });

  it("links to correct path", () => {
    renderCard({ coin: "BTC" });
    const link = screen.getByRole("link");
    expect(link.getAttribute("href")).toBe("/bitcoin");
  });

  it("links to ethereum path", () => {
    renderCard({ coin: "ETH" });
    const link = screen.getByRole("link");
    expect(link.getAttribute("href")).toBe("/ethereum");
  });

  it("does not show percentage when lastClose is zero", () => {
    renderCard({ prediction: { h7: 65000 }, lastClose: 0 });
    expect(screen.getByText("Data belum tersedia")).toBeTruthy();
  });
});
