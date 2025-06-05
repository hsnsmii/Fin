import { FMP_API_KEY } from '@env';

export const getSelectedStocks = async () => {
  const symbols = [
    'AAPL', 'AMZN', 'BRK-B', 'BRK-A', 'META', 'MSFT', 'NVDA', 'TSLA',
    'GM', 'FLNC', 'RC', 'APP', 'VTRS', 'GOOG', 'GOOGL', 'GTLL', 'USO',
    'BNO', 'OIH', 'DBO', 'OIL', 'PXJ', 'IEO', 'UCO', 'XOP', 'GUSH',
    'TBBK', 'SOUN', 'NPWR', 'BBAI','TKKYY', 'TKGBY'
  ];

  // const symbols = [
  //   'AAPL', 'AMZN', 
  // ];

  try {
    const requests = symbols.map(symbol =>
      fetch(`https://financialmodelingprep.com/api/v3/profile/${symbol}?apikey=${FMP_API_KEY}`)
    );

    const responses = await Promise.all(requests);
    const jsonArrays = await Promise.all(responses.map(res => res.json()));

    // 🔍 Buraya log ekle:
    console.log("JSON arrays from API:", jsonArrays);

    return jsonArrays
      .map(arr => arr[0])
      .filter(stock => stock && stock.symbol && stock.companyName);
  } catch (error) {
    console.error('Error fetching selected stocks:', error);
    return [];
  }
};


export const getStockDetails = async (symbol) => {
  const res = await fetch(`https://financialmodelingprep.com/api/v3/profile/${symbol}?apikey=${FMP_API_KEY}`);
  const data = await res.json();
  return data[0];
};

export const getStockHistory = async (symbol) => {
    try {
      const res = await fetch(`https://financialmodelingprep.com/api/v3/historical-price-full/${symbol}?timeseries=60&apikey=${FMP_API_KEY}`);
      const data = await res.json();
      return data.historical || [];
    } catch (error) {
      console.error('Stock history fetch error:', error);
      return [];
    }
  };

export const getPriceOnDate = async (symbol, date) => {
  try {
    const formatted = typeof date === 'string' ? date : date.toISOString().split('T')[0];
    const res = await fetch(
      `https://financialmodelingprep.com/api/v3/historical-price-full/${symbol}?from=${formatted}&to=${formatted}&apikey=${FMP_API_KEY}`
    );
    const data = await res.json();
    if (data && data.historical && data.historical.length > 0) {
      return parseFloat(data.historical[0].close);
    }
    return null;
  } catch (error) {
    console.error('Price on date fetch error:', error);
    return null;
  }
};

export const getCurrentPrice = async (symbol) => {
  try {
    const res = await fetch(
      `https://financialmodelingprep.com/api/v3/quote/${symbol}?apikey=${FMP_API_KEY}`
    );
    const data = await res.json();
    if (Array.isArray(data) && data.length > 0) {
      return parseFloat(data[0].price);
    }
    return null;
  } catch (error) {
    console.error('Current price fetch error:', error);
    return null;
  }
};
  