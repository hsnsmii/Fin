import os
import requests
import pandas as pd
import pandas_ta as ta
from dotenv import load_dotenv
load_dotenv()

import numpy as np
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
import joblib

API_KEY = os.getenv("FMP_API_KEY")

# S&P 500 verisi çek
def get_market_data():
    url = f"https://financialmodelingprep.com/api/v3/historical-price-full/SPY?apikey={API_KEY}&serietype=line"
    response = requests.get(url)
    if response.status_code != 200:
        print("[HATA] SPY verisi çekilemedi.")
        return None
    data = response.json()
    prices = data.get('historical')
    df = pd.DataFrame(prices)
    df = df[['date', 'close']].rename(columns={'close': 'spy_close'})
    return df

# Hisse verisi çek
def get_historical_data(symbol):
    url = f"https://financialmodelingprep.com/api/v3/historical-price-full/{symbol}?apikey={API_KEY}&serietype=line"
    response = requests.get(url)
    if response.status_code != 200:
        print(f"[HATA] Veri çekilemedi: {symbol}")
        return None
    data = response.json()
    prices = data.get('historical')
    if not prices:
        print(f"[Uyarı] Veri bulunamadı: {symbol}")
        return None
    df = pd.DataFrame(prices)
    df = df[['date', 'close']].sort_values('date')
    df.to_csv(f"data/csv/{symbol}_history.csv", index=False)
    print(f"[✓] {symbol} verisi kaydedildi → data/csv/{symbol}_history.csv")
    return df

# Beta hesapla
def calculate_beta(stock_df, market_df):
    merged = pd.merge(stock_df, market_df, on='date', how='inner')
    merged['stock_return'] = merged['close'].pct_change()
    merged['market_return'] = merged['spy_close'].pct_change()
    merged.dropna(inplace=True)

    if len(merged) < 20:
        print(f"[Uyarı] Yetersiz veri ile beta hesaplanamaz. {len(merged)} gün")
        return None

    covariance = np.cov(merged['stock_return'], merged['market_return'])[0][1]
    variance = np.var(merged['market_return'], ddof=1)

    if variance == 0 or np.isnan(variance):
        print(f"[Uyarı] Market varyansı sıfır veya geçersiz.")
        return None

    beta = covariance / variance
    return beta

# Teknik göstergeler ekle
def add_indicators(df, beta_value):
    df['rsi'] = ta.rsi(df['close'])
    df['sma_20'] = ta.sma(df['close'], length=20)
    df['volatility'] = df['close'].rolling(20).std()
    df['beta'] = beta_value
    return df

# Model eğitimi (yüzdesel skor tahmini için regresyon modeli)
def train_model(df, symbol):
    df = df.dropna(subset=['rsi', 'sma_20', 'volatility', 'beta'])

    # Risk skoru hesapla (örnek formül, geliştirilebilir)
    df['risk_score'] = (
        0.4 * (df['volatility'] / df['volatility'].max()) +
        0.3 * (df['beta'] / df['beta'].max()) +
        0.2 * (1 - df['rsi'] / 100) +
        0.1 * np.random.rand(len(df))
    ).clip(0, 1)

    features = df[['rsi', 'sma_20', 'volatility', 'beta']]
    targets = df['risk_score']

    X_train, X_test, y_train, y_test = train_test_split(features, targets, test_size=0.2)
    model = RandomForestRegressor()
    model.fit(X_train, y_train)

    joblib.dump(model, f"data/models/{symbol}_risk_model.pkl")
    print(f"[✓] Model kaydedildi: data/models/{symbol}_risk_model.pkl")

# Her sembol için süreci işlet
def run_pipeline(symbol, market_df):
    df = get_historical_data(symbol)
    if df is not None:
        beta = calculate_beta(df, market_df)
        if beta is None:
            print(f"[Uyarı] Beta hesaplanamadı: {symbol}")
            return
        df = add_indicators(df, beta)
        train_model(df, symbol)

# Ana süreç
if __name__ == "__main__":
    os.makedirs("data/csv", exist_ok=True)
    os.makedirs("data/models", exist_ok=True)

    symbols = [
        'AAPL', 'AMZN', 'META', 'MSFT', 'NVDA', 'TSLA',
        'FLNC', 'RC', 'APP', 'GOOGL', 'TBBK', 'SOUN'
    ]

    market_df = get_market_data()
    if market_df is None:
        print("[HATA] SPY verisi olmadan işlem yapılamaz.")
    else:
        for symbol in symbols:
            print(f"\n🚀 İşleniyor: {symbol}")
            run_pipeline(symbol, market_df)
