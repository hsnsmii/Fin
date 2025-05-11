import os
import requests
import pandas as pd
import pandas_ta as ta
from dotenv import load_dotenv
load_dotenv()  # .env dosyasını yükle
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
import joblib

# --- 1. API key yükle ---
# Eğer .env dosyası yerine direkt burada tanımlamak istersen:
API_KEY = os.getenv("FMP_API_KEY")

# --- 2. FMP API'den veri çek ---
def get_historical_data(symbol, output_file):
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
    df.to_csv(output_file, index=False)
    print(f"[✓] {symbol} verisi kaydedildi → {output_file}")
    return df

# --- 3. Teknik göstergeleri hesapla ve risk etiketi oluştur ---
def add_indicators_and_labels(df):
    df['rsi'] = ta.rsi(df['close'])
    df['sma_20'] = ta.sma(df['close'], length=20)
    df['volatility'] = df['close'].rolling(20).std()

    def classify_risk(row):
        if row['volatility'] > 5:
            return 'High'
        elif row['volatility'] > 2:
            return 'Medium'
        else:
            return 'Low'

    df['risk_level'] = df.apply(classify_risk, axis=1)
    return df

# --- 4. Model eğitimi ---
def train_model(df, symbol):
    features = df[['rsi', 'sma_20', 'volatility']].dropna()
    labels = df['risk_level'].loc[features.index]

    X_train, X_test, y_train, y_test = train_test_split(features, labels, test_size=0.2)

    model = RandomForestClassifier()
    model.fit(X_train, y_train)

    joblib.dump(model, f"{symbol}_risk_model.pkl")
    print(f"[✓] Model kaydedildi: {symbol}_risk_model.pkl")

# --- 5. Tüm akışı çalıştır ---
def run_pipeline(symbol):
    csv_name = f"{symbol}_history.csv"
    df = get_historical_data(symbol, csv_name)
    if df is not None:
        df = add_indicators_and_labels(df)
        train_model(df, symbol)

# --- 6. Örnek kullanım ---
if __name__ == "__main__":
    run_pipeline("AAPL")  # Apple için başlat
