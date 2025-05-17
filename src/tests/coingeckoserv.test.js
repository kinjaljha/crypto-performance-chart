import { fetchCryptoData } from "../services/coingeckoserv";

beforeEach(() => {
  localStorage.clear();
  global.fetch = jest.fn();
});

afterEach(() => {
  jest.resetAllMocks();
});

describe("fetchCryptoData", () => {
  const mockResponse = {
    prices: [
      [1622505600000, 35000],
      [1622592000000, 36000],
    ],
  };

  it("returns cached data if available", async () => {
    const cacheKey = "bitcoin-week";
    const cachedData = [{ date: "6/1/2021", price: 35000 }];
    localStorage.setItem(cacheKey, JSON.stringify(cachedData));

    const data = await fetchCryptoData("bitcoin", "week");
    expect(data).toEqual(cachedData);
    expect(fetch).not.toHaveBeenCalled();
  });

  it("fetches fresh data when cache is empty", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    const data = await fetchCryptoData("bitcoin", "week");
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(data).toEqual([
      { date: new Date(1622505600000).toLocaleDateString(), price: 35000 },
      { date: new Date(1622592000000).toLocaleDateString(), price: 36000 },
    ]);
    // Cached data should be stored
    const cached = JSON.parse(localStorage.getItem("bitcoin-week"));
    expect(cached).toEqual(data);
  });

  it("returns empty array and logs error if fetch fails", async () => {
    fetch.mockRejectedValueOnce(new Error("Network Error"));
    const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});

    const data = await fetchCryptoData("bitcoin", "week");
    expect(data).toEqual([]);
    expect(consoleSpy).toHaveBeenCalled();

    consoleSpy.mockRestore();
  });

  it("throws error if response not ok", async () => {
    fetch.mockResolvedValueOnce({ ok: false, status: 500 });
    const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});

    const data = await fetchCryptoData("bitcoin", "week");
    expect(data).toEqual([]);
    expect(consoleSpy).toHaveBeenCalled();

    consoleSpy.mockRestore();
  });
});
