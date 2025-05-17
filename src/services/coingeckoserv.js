export const fetchCryptoData = async (symbol, range) => {
  try {
    const cacheKey = `${symbol}-${range}`;
    const cachedData = localStorage.getItem(cacheKey);

    if (cachedData) return JSON.parse(cachedData);

    const end = Math.floor(Date.now() / 1000);
    let days = 7;
    if (range === "month") days = 30;
    if (range === "year") days = 365;

    const start = end - days * 86400;

    const URL = `https://api.coingecko.com/api/v3/coins/${symbol.toLowerCase()}/market_chart/range?vs_currency=usd&from=${start}&to=${end}`;
    const response = await fetch(URL);

    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.status}`);
    }

    const cryptoData = await response.json();

    const filteredCryptoData = cryptoData.prices.map(([timestamp, price]) => ({
      date: new Date(timestamp).toLocaleDateString(),
      price,
    }));

    localStorage.setItem(cacheKey, JSON.stringify(filteredCryptoData));
    return filteredCryptoData;
  } catch (error) {
    console.error("Error fetching crypto data:", error);
    return []; // Return empty array so app doesn't crash
  }
};
