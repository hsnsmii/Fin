from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import pandas as pd
import os
from portfolio_analysis import analyze_portfolio

app = Flask(__name__)
CORS(app)

MODEL_DIR = "data/models"
CSV_DIR = "data/csv"

@app.route("/predict-risk", methods=["POST"])
def predict_risk():
    try:
        data = request.get_json(force=True)
        symbol = data.get("symbol")
        print("Gelen veri:", data, symbol)

        if not symbol:
            return jsonify({"error": "Hisse sembolü (symbol) eksik"}), 400

        features = {key: data[key] for key in ['rsi', 'sma_20', 'volatility', 'beta'] if key in data}
        df = pd.DataFrame([features])
        print("Tahmin verisi:", df)

        model_path = os.path.join(MODEL_DIR, f"{symbol}_risk_model.pkl")
        if not os.path.exists(model_path):
            return jsonify({"error": f"Model bulunamadı: {symbol}"}), 404

        model = joblib.load(model_path)
        score = model.predict(df)[0]
        risk_percentage = round(score * 100)

        print("Tahmin skoru (%):", risk_percentage)

        return jsonify({
            "risk_percentage": risk_percentage,
            "breakdown": {
                "rsi": data['rsi'],
                "sma_20": data['sma_20'],
                "volatility": data['volatility'],
                "beta": data['beta']
            }
        })

    except Exception as e:
        print("HATA:", str(e))
        return jsonify({"error": str(e)}), 500

@app.route("/recommend-low-risk", methods=["GET"])
def recommend_low_risk():
    try:
        recommendations = []
        for filename in os.listdir(MODEL_DIR):
            if filename.endswith("_risk_model.pkl"):
                symbol = filename.replace("_risk_model.pkl", "")
                model_path = os.path.join(MODEL_DIR, filename)
                data_path = os.path.join(CSV_DIR, f"{symbol}_history.csv")

                if not os.path.exists(data_path):
                    continue

                df = pd.read_csv(data_path).dropna().sort_values("date")
                if df.shape[0] < 20:
                    continue

                df['rsi'] = df['close'].pct_change().rolling(14).apply(
                    lambda x: 100 - (100 / (1 + (x[x > 0].mean() / abs(x[x < 0].mean()))) if abs(x[x < 0].mean()) != 0 else 0)
                )
                df['sma_20'] = df['close'].rolling(20).mean()
                df['volatility'] = df['close'].rolling(20).std()
                df.dropna(inplace=True)

                if df.empty:
                    continue

                last = df.iloc[-1]
                features = {
                    "rsi": last['rsi'],
                    "sma_20": last['sma_20'],
                    "volatility": last['volatility'],
                    "beta": 1.0  # sabit beta (veya hesapla)
                }

                df_model = pd.DataFrame([features])
                model = joblib.load(model_path)
                score = model.predict(df_model)[0]
                risk = round(score * 100)

                if risk < 30:
                    recommendations.append({"symbol": symbol, "risk": risk})

        return jsonify(recommendations)

    except Exception as e:
        print("Öneri hatası:", str(e))
        return jsonify({"error": str(e)}), 500

@app.route("/portfolio-analysis", methods=["POST"])
def portfolio_analysis_endpoint():
    """Return advanced portfolio risk analysis."""
    try:
        data = request.get_json(force=True)
        positions = data.get("positions", [])
        threshold = data.get("high_risk_threshold", 0.6)
        result = analyze_portfolio(positions, high_risk_threshold=threshold)
        return jsonify(result)
    except Exception as e:
        print("ANALYSIS ERROR:", str(e))
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5050)
