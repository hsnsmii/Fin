import { FMP_API_KEY } from '@env';

export const getSelectedStocks = async () => {
  const symbols = ['AAPL', 'GOOGL', 'AMZN', 'MSFT', 'TSLA', 'NFLX'];
  const requests = symbols.map(symbol =>
    fetch(`https://financialmodelingprep.com/api/v3/profile/${symbol}?apikey=${FMP_API_KEY}`)
  );

  const responses = await Promise.all(requests);
  const jsonArrays = await Promise.all(responses.map(res => res.json()));
  return jsonArrays.map(arr => arr[0]); // Her biri array, içindeki objeyi al
};

export const getStockDetails = async (symbol) => {
  const res = await fetch(`https://financialmodelingprep.com/api/v3/profile/${symbol}?apikey=${FMP_API_KEY}`);
  const data = await res.json();
  return data[0];
};

export const getStockHistory = async (symbol) => {
    try {
      const res = await fetch(`https://financialmodelingprep.com/api/v3/historical-price-full/${symbol}?timeseries=7&apikey=${FMP_API_KEY}`);
      const data = await res.json();
      return data.historical || [];
    } catch (error) {
      console.error('Stock history fetch error:', error);
      return [];
    }
  };
  