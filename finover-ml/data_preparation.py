import os
import requests
import pandas as pd
import pandas_ta as ta
from dotenv import load_dotenv
load_dotenv()

from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
import joblib
import numpy as np

API_KEY = os.getenv("FMP_API_KEY")

# S&P 500 ETF (SPY) verisi ile market karşılaştırması için
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


# Hisse verisini çek
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

# Teknik göstergeler ve risk etiketi ekle
def add_indicators_and_labels(df, beta_value):
    df['rsi'] = ta.rsi(df['close'])
    df['sma_20'] = ta.sma(df['close'], length=20)
    df['volatility'] = df['close'].rolling(20).std()
    df['beta'] = beta_value

    def classify_risk(row):
        if row['volatility'] > 5 or (row['beta'] and row['beta'] > 1.2):
            return 'High'
        elif row['volatility'] > 2 or (row['beta'] and 0.8 < row['beta'] <= 1.2):
            return 'Medium'
        else:
            return 'Low'

    df['risk_level'] = df.apply(classify_risk, axis=1)
    return df

# Model eğitimi
def train_model(df, symbol):
    features = df[['rsi', 'sma_20', 'volatility', 'beta']].dropna()
    labels = df['risk_level'].loc[features.index]

    X_train, X_test, y_train, y_test = train_test_split(features, labels, test_size=0.2)

    model = RandomForestClassifier()
    model.fit(X_train, y_train)

    joblib.dump(model, f"data/models/{symbol}_risk_model.pkl")
    print(f"[✓] Model kaydedildi: data/models/{symbol}_risk_model.pkl")

# Tüm süreci çalıştır
def run_pipeline(symbol, market_df):
    df = get_historical_data(symbol)
    if df is not None:
        beta = calculate_beta(df, market_df)
        if beta is None:
            print(f"[Uyarı] Beta hesaplanamadı: {symbol}")
            return
        df = add_indicators_and_labels(df, beta)
        train_model(df, symbol)

# Main
if __name__ == "__main__":
    # Klasörleri oluştur
    os.makedirs("data/csv", exist_ok=True)
    os.makedirs("data/models", exist_ok=True)

    symbols = [
        'AAPL', 'AMZN', 'BRK-B', 'BRK-A', 'META', 'MSFT', 'NVDA', 'TSLA',
        'GM', 'FLNC', 'RC', 'APP', 'VTRS', 'GOOG', 'GOOGL', 'GTLL', 'USO',
        'BNO', 'OIH', 'DBO', 'OIL', 'PXJ', 'IEO', 'UCO', 'XOP', 'GUSH',
        'TBBK', 'SOUN', 'NPWR', 'BBAI','TKKYY', 'TKGBY'
    ]

    market_df = get_market_data()
    if market_df is None:
        print("[HATA] SPY verisi olmadan işlem yapılamaz.")
    else:
        for symbol in symbols:
            print(f"\n🚀 İşleniyor: {symbol}")
            run_pipeline(symbol, market_df)
