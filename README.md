# Finov

This project uses environment variables to configure API endpoints. Create a `.env` file in the project root and define the URLs for the Node and machine learning backends.

```bash
API_BASE_URL=http://192.168.1.27:3000
ML_BASE_URL=http://192.168.1.27:5050
```

These variables are loaded through `react-native-dotenv` and used in `services/config.js`.

## Portfolio Risk API

The ML service exposes `/portfolio-risk` which accepts a list of positions and
returns an overall risk score computed with volatility, beta and correlations.

Example payload:

```json
{
  "positions": [
    {"symbol": "AAPL", "quantity": 3, "price": 100, "volatility": 0.2, "beta": 1.1},
    {"symbol": "MSFT", "quantity": 2, "price": 250, "volatility": 0.15, "beta": 0.9}
  ]
}
```
