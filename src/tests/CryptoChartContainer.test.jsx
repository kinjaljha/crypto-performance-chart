/* eslint-disable testing-library/no-wait-for-multiple-assertions */
import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { CryptoChartContainer } from "../CryptoChartContainer";
import { fetchCryptoData } from "../services/coingeckoserv";
import { SYMBOLS } from "../utils";

// Mock the fetchCryptoData service
jest.mock("../services/coingeckoserv", () => ({
  fetchCryptoData: jest.fn(),
}));

describe("CryptoChartContainer", () => {
  const mockData = [
    { date: "2024-01-01", price: 100 },
    { date: "2024-01-02", price: 110 },
  ];

  beforeEach(() => {
    fetchCryptoData.mockResolvedValue(mockData);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("renders crypto symbol dropdown", async () => {
    render(<CryptoChartContainer />);
    expect(screen.getByRole("combobox")).toBeInTheDocument();

    // Wait for charts to load
    await waitFor(() => {
      expect(fetchCryptoData).toHaveBeenCalledTimes(3);
    });
  });

  test("fetches and displays chart data", async () => {
    render(<CryptoChartContainer />);

    await waitFor(() => {
      expect(screen.getByText(/Weekly Performance/i)).toBeInTheDocument();
      expect(screen.getByText(/Monthly Performance/i)).toBeInTheDocument();
      expect(screen.getByText(/Yearly Performance/i)).toBeInTheDocument();
    });
  });

  test("changes crypto symbol and refetches data", async () => {
    render(<CryptoChartContainer />);
    const select = screen.getByRole("combobox");

    fireEvent.change(select, { target: { value: SYMBOLS[1] } });

    await waitFor(() => {
      expect(fetchCryptoData).toHaveBeenCalledWith(SYMBOLS[1], "week");
    });
  });

  test("handles API error gracefully", async () => {
    fetchCryptoData.mockRejectedValueOnce(new Error("API error"));

    render(<CryptoChartContainer />);
    await waitFor(() => {
      expect(fetchCryptoData).toHaveBeenCalledTimes(3);
    });

    // Should not throw or crash UI
    expect(screen.getByRole("combobox")).toBeInTheDocument();
  });
});
