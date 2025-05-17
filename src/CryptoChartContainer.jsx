/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { CRYPTO_CURRENCY_ALIAS, RANGE } from "./utils";
import { fetchCryptoData } from "./services/coingeckoserv";
import "./css/CryptoChartContainer.css";

export const CryptoChartContainer = () => {
  const [currency, setCurrency] = useState("bitcoin");
  const [data, setData] = useState({ week: [], month: [], year: [] });

const loadData = async () => {
  try {
    const [week, month, year] = await Promise.all([
      fetchCryptoData(currency, RANGE.week),
      fetchCryptoData(currency, RANGE.month),
      fetchCryptoData(currency, RANGE.year),
    ]);

    setData({ week, month, year });
  } catch (err) {
    setData({ week: [], month: [], year: [] });
  }
};

  const handleCryptoChange = (e) => {
    setCurrency(e.target.value);
  };

  useEffect(() => {
    loadData();
  }, [currency]);

  return (
    <div className="container">
      <div className="select-container">
        {/* <label>Select Symbol: </label> */}
        <select id="currency-select" value={currency} onChange={handleCryptoChange}>
          {CRYPTO_CURRENCY_ALIAS.map((sym) => (
            <option className="select-option" key={sym} value={sym}>
              {sym}
            </option>
          ))}
        </select>
      </div>
      {Object.entries(data).map(([range, data]) => (
        <div key={range}>
          <h2 style={{ fontSize: "1.2rem", marginBottom: "1rem" }}>
            {range.charAt(0).toUpperCase() + range.slice(1) + "ly"} Performance
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
              <XAxis
                dataKey="date"
                stroke="#888"
                axisLine={{ stroke: "#888" }}
              />
              <YAxis stroke="#888" axisLine={{ stroke: "#888" }} />
              <Tooltip />
              <Legend />
              <Line type="natural" dataKey="price" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      ))}
    </div>
  );
};
