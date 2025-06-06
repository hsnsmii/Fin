# Finov

This project uses environment variables to configure API endpoints. Create a `.env` file in the project root and define the URLs for the Node and machine learning backends.

```bash
# API_BASE_URL=http://192.168.1.27:3000
# ML_BASE_URL=http://192.168.1.27:5050
```
API_BASE_URL=http://172.20.10.2:8081
ML_BASE_URL=http://172.20.10.2:5050

These variables are loaded through `react-native-dotenv` and used in `services/config.js`.
