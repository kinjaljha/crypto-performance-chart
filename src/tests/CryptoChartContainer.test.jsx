import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { CryptoChartContainer } from '../CryptoChartContainer'; // Adjust the import path if needed
import { SYMBOLS } from '../utils'; // Ensure this import is correct
// import { fetchCryptoData } from '../services/coingeckoserv'; // The service to fetch data

// Mocking the fetchCryptoData function
jest.mock('../services/coingeckoserv', () => ({
  fetchCryptoData: jest.fn(() => Promise.resolve([])), // Always resolve with empty data for testing
}));


describe('CryptoChartContainer', () => {
  it('should render the symbol dropdown with options', () => {
    render(<CryptoChartContainer />);

    // Check if the dropdown is rendered
    const select = screen.getByRole('combobox');
    expect(select).toBeInTheDocument();

    // Check if all symbols are rendered as options
    SYMBOLS.forEach((symbol) => {
      const option = screen.getByRole('option', { name: symbol });
      expect(option).toBeInTheDocument();
    });
  });

});