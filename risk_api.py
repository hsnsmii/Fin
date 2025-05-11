from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import pandas as pd

app = Flask(__name__)
CORS(app)  # CORS: Mobil veya başka domain'den erişim için

# Modeli yükle
model = joblib.load("AAPL_risk_model.pkl")

@app.route("/predict-risk", methods=["POST"])
def predict_risk():
    try:
        data = request.get_json(force=True)
        print("Gelen veri:", data)

        df = pd.DataFrame([data])
        print("DataFrame:", df)

        prediction = model.predict(df)[0]
        print("Tahmin:", prediction)

        return jsonify({"risk_level": prediction})

    except Exception as e:
        print("HATA:", str(e))
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5050)

