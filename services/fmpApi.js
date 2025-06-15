import { FMP_API_KEY } from '@env';

export const getSelectedStocks = async () => {
  const symbols = [
    'AAPL', 'AMZN', 'BRK-B', 'BRK-A', 'META', 'MSFT', 'NVDA', 'TSLA',
    'GM', 'FLNC', 'RC', 'APP', 'VTRS', 'GOOG', 'GOOGL', 'GTLL', 'USO',
    'BNO', 'OIH', 'DBO', 'OIL', 'PXJ', 'IEO', 'UCO', 'XOP', 'GUSH',
    'TBBK', 'SOUN', 'NPWR', 'BBAI','TKKYY', 'TKGBY'
  ];

  try {
    const url = `https://financialmodelingprep.com/api/v3/quote/${symbols.join(',')}?apikey=${FMP_API_KEY}`;
    const res = await fetch(url);
    const data = await res.json();
    console.log('Quote data from API:', data);

    return data
      .filter(stock => stock && stock.symbol && stock.name)
      .map(stock => ({
        symbol: stock.symbol,
        companyName: stock.name,
        price: stock.price,
        changes: stock.change,
        changesPercentage: parseFloat(stock.changesPercentage),
      }));
  } catch (error) {
    console.error('Error fetching selected stocks:', error);
    return [];
  }
};

export const getStockDetails = async (symbol) => {
  const res = await fetch(`https://financialmodelingprep.com/api/v3/profile/${symbol}?apikey=${FMP_API_KEY}`);
  const data = await res.json();
  if (data && data.length > 0) {
    return data[0];
  }
  return null; // Veri bulunamazsa null dön
};

export const getStockHistory = async (symbol, timeRange = '1A') => {
  let url = '';

  // Seçilen zaman aralığına göre doğru API URL'ini oluştur
  switch (timeRange) {
    case '1G':
      // 1 Günlük veri için 15 dakikalık aralıklarla veri çekiyoruz
      url = `https://financialmodelingprep.com/api/v3/historical-chart/15min/${symbol}?apikey=${FMP_API_KEY}`;
      break;
    case '1H':
      // 1 Haftalık veri için son 5 işlem gününü çekiyoruz
      url = `https://financialmodelingprep.com/api/v3/historical-price-full/${symbol}?timeseries=5&apikey=${FMP_API_KEY}`;
      break;
    case '1A':
      // 1 Aylık veri için son 30 günü çekiyoruz
      url = `https://financialmodelingprep.com/api/v3/historical-price-full/${symbol}?timeseries=30&apikey=${FMP_API_KEY}`;
      break;
    case '1Y':
      // 1 Yıllık veri (yaklaşık 252 işlem günü)
      url = `https://financialmodelingprep.com/api/v3/historical-price-full/${symbol}?timeseries=252&apikey=${FMP_API_KEY}`;
      break;
    case '5Y':
      // 5 Yıllık veri (yaklaşık 1260 işlem günü)
      url = `https://financialmodelingprep.com/api/v3/historical-price-full/${symbol}?timeseries=1260&apikey=${FMP_API_KEY}`;
      break;
    default:
      // Varsayılan olarak 1 aylık veri
      url = `https://financialmodelingprep.com/api/v3/historical-price-full/${symbol}?timeseries=30&apikey=${FMP_API_KEY}`;
  }

  try {
    const res = await fetch(url);
    const data = await res.json();
  
    return data.historical || data || [];
  } catch (error) {
    console.error(`Stock history fetch error for ${symbol} with range ${timeRange}:`, error);
    return [];
  }
};

export const getIncomeStatement = async (symbol) => {
  try {
    // Sadece en son yıllık veriyi çekmek için 'limit=1' ve 'period=annual' kullanıyoruz
    const url = `https://financialmodelingprep.com/api/v3/income-statement/${symbol}?period=annual&limit=1&apikey=${FMP_API_KEY}`;
    const res = await fetch(url);
    const data = await res.json();
    
    if (data && data.length > 0) {
      return data; // Genellikle tek elemanlı bir dizi döner
    }
    return null; // Veri bulunamazsa null dön
  } catch (error) {
    console.error(`Gelir Tablosu çekme hatası (${symbol}):`, error);
    throw error; // Hata oluştuğunda Promise'i reject et
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
