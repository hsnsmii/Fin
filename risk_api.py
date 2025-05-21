from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import pandas as pd
import os

app = Flask(__name__)
CORS(app)

MODEL_DIR = "data/models"  # Model dosyalarının bulunduğu klasör

@app.route("/predict-risk", methods=["POST"])
def predict_risk():
    try:
        data = request.get_json(force=True)
        symbol = data.get("symbol")
        print("Gelen veri:", data, symbol)

        
        if not symbol:
            return jsonify({"error": "Hisse sembolü (symbol) eksik"}), 400

        # Gerekli özellikleri al
        features = {key: data[key] for key in ['rsi', 'sma_20', 'volatility', 'beta'] if key in data}
        df = pd.DataFrame([features])
        print("Tahmin verisi:", df)

        model_path = os.path.join(MODEL_DIR, f"{symbol}_risk_model.pkl")
        if not os.path.exists(model_path):
            return jsonify({"error": f"Model bulunamadı: {symbol}"}), 404

        model = joblib.load(model_path)
        prediction = model.predict(df)[0]
        print("Tahmin:", prediction)

        return jsonify({"risk_level": prediction})

    except Exception as e:
        print("HATA:", str(e))
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5050)
