import { FMP_API_KEY } from '@env';

export const getSelectedStocks = async () => {
  // const symbols = [
  //   'AAPL', 'AMZN', 'BRK-B', 'BRK-A', 'META', 'MSFT', 'NVDA', 'TSLA',
  //   'GM', 'FLNC', 'RC', 'APP', 'VTRS', 'GOOG', 'GOOGL', 'GTLL', 'USO',
  //   'BNO', 'OIH', 'DBO', 'OIL', 'PXJ', 'IEO', 'UCO', 'XOP', 'GUSH',
  //   'TBBK', 'SOUN', 'NPWR', 'BBAI'
  // ];

  const symbols = [
    'AAPL', 'AMZN', 
  ];

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
      const res = await fetch(`https://financialmodelingprep.com/api/v3/historical-price-full/${symbol}?timeseries=7&apikey=${FMP_API_KEY}`);
      const data = await res.json();
      return data.historical || [];
    } catch (error) {
      console.error('Stock history fetch error:', error);
      return [];
    }
  };
  