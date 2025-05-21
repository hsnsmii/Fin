import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, TouchableOpacity, Modal, Dimensions, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { LineChart, PieChart } from 'react-native-chart-kit';
import { getStockHistory } from '../services/fmpApi';

// SPY verisine göre beta hesaplayan fonksiyon
const calculateBeta = (stockHistory, marketHistory) => {
  const stockCloses = stockHistory.map(h => h.close).reverse();
  const marketCloses = marketHistory.map(h => h.close).reverse();

  if (stockCloses.length < 21 || marketCloses.length < 21) return null;

  const stockReturns = [];
  const marketReturns = [];

  for (let i = 1; i < 21; i++) {
    const stockReturn = (stockCloses[i] - stockCloses[i - 1]) / stockCloses[i - 1];
    const marketReturn = (marketCloses[i] - marketCloses[i - 1]) / marketCloses[i - 1];
    stockReturns.push(stockReturn);
    marketReturns.push(marketReturn);
  }

  const meanStock = stockReturns.reduce((a, b) => a + b, 0) / stockReturns.length;
  const meanMarket = marketReturns.reduce((a, b) => a + b, 0) / marketReturns.length;

  let covariance = 0;
  let marketVariance = 0;

  for (let i = 0; i < stockReturns.length; i++) {
    covariance += (stockReturns[i] - meanStock) * (marketReturns[i] - meanMarket);
    marketVariance += Math.pow(marketReturns[i] - meanMarket, 2);
  }

  covariance /= stockReturns.length;
  marketVariance /= stockReturns.length;

  return marketVariance === 0 ? 0 : covariance / marketVariance;
};

// Teknik göstergeler
const calculateIndicators = (history) => {
  const closes = history.map(h => h.close).reverse();
  if (closes.length < 20) return null;

  let gains = 0, losses = 0;
  for (let i = 1; i < 15; i++) {
    const change = closes[i] - closes[i - 1];
    if (change > 0) gains += change;
    else losses -= change;
  }

  const avgGain = gains / 14;
  const avgLoss = losses / 14;
  const rs = avgGain / avgLoss;
  const rsi = 100 - (100 / (1 + rs));

  const sma_20 = closes.slice(0, 20).reduce((sum, val) => sum + val, 0) / 20;
  const mean = sma_20;
  const variance = closes.slice(0, 20).reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / 20;
  const volatility = Math.sqrt(variance);

  return { rsi, sma_20, volatility };
};

const PortfolioRiskScreen = () => {
  const [watchlists, setWatchlists] = useState([]);
  const [selectedList, setSelectedList] = useState(null);
  const [portfolio, setPortfolio] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const fetchWatchlists = async () => {
      try {
        const userId = await AsyncStorage.getItem('userId');
        const res = await fetch(`http://192.168.1.37:3000/api/watchlists/${userId}`);
        const data = await res.json();
        setWatchlists(data);
      } catch (err) {
        console.error("Watchlist alma hatası:", err);
      }
    };
    fetchWatchlists();
  }, []);

  const fetchPortfolioRisk = async (stocks) => {
    setLoading(true);
    try {
      const symbols = [...new Set(stocks.map(s => s.symbol))];
      const riskData = [];

      // SPY verisini bir kez al
      const marketHistory = await getStockHistory('SPY');

      for (const symbol of symbols) {
        const history = await getStockHistory(symbol);
        const indicators = calculateIndicators(history);
        const beta = calculateBeta(history, marketHistory);

        if (!indicators || beta === null) {
          console.warn(`Yetersiz veri: ${symbol}`);
          continue;
        }

        const payload = { ...indicators, beta, symbol };

        const res = await fetch("http://192.168.1.37:5050/predict-risk", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        const json = await res.json();
        riskData.push({ symbol, risk: json.risk_level });
      }

      setPortfolio(riskData);
    } catch (err) {
      console.error("Portföy risk analizi hatası:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleListSelect = (list) => {
    setSelectedList(list);
    setModalVisible(false);
    fetchPortfolioRisk(list.stocks);
  };

  const getColor = (risk) => {
    if (risk === 'Low') return '#2ecc71';
    if (risk === 'Medium') return '#f1c40f';
    if (risk === 'High') return '#e74c3c';
    return '#95a5a6';
  };

  const getPortfolioRiskScore = () => {
    if (portfolio.length === 0) return null;

    const scoreMap = { Low: 1, Medium: 2, High: 3 };
    const scores = portfolio.map(p => scoreMap[p.risk]);
    const total = scores.reduce((a, b) => a + b, 0);
    const avg = total / scores.length;

    let avgLevel = 'Low';
    if (avg >= 2.5) avgLevel = 'High';
    else if (avg >= 1.5) avgLevel = 'Medium';

    return { total, avg: avg.toFixed(2), level: avgLevel };
  };

  const getPieChartData = () => {
    const counts = { Low: 0, Medium: 0, High: 0 };
    portfolio.forEach(p => counts[p.risk] = (counts[p.risk] || 0) + 1);
    const total = portfolio.length;

    return [
      {
        name: 'Low',
        population: counts.Low,
        color: '#2ecc71',
        legendFontColor: '#333',
        legendFontSize: 14,
      },
      {
        name: 'Medium',
        population: counts.Medium,
        color: '#f1c40f',
        legendFontColor: '#333',
        legendFontSize: 14,
      },
      {
        name: 'High',
        population: counts.High,
        color: '#e74c3c',
        legendFontColor: '#333',
        legendFontSize: 14,
      },
    ].map(item => ({
      ...item,
      name: `${item.population} ${item.name}`,
      percentage: total > 0 ? ((item.population / total) * 100).toFixed(0) + '%' : '0%',
    }));
  };

  const sampleTrend = [
    { date: '05-01', level: 2 },
    { date: '05-02', level: 3 },
    { date: '05-03', level: 2 },
    { date: '05-04', level: 1 },
    { date: '05-05', level: 2 },
  ];

  const getLineChartData = () => ({
    labels: sampleTrend.map(d => d.date),
    datasets: [{ data: sampleTrend.map(d => d.level), strokeWidth: 2 }]
  });

  return (
    <View style={{ flex: 1 }}>
      {selectedList && (
        <View style={styles.selectedInfo}>
          <Text style={styles.selectedInfoText}>Seçili Liste: {selectedList.name}</Text>
        </View>
      )}

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.container}>
          {getPortfolioRiskScore() && (
            <View style={styles.scoreBox}>
              <Text style={styles.scoreText}>Genel Risk Skoru: {getPortfolioRiskScore().total}</Text>
              <Text style={styles.scoreText}>
                Ortalama Risk: {getPortfolioRiskScore().level} ({getPortfolioRiskScore().avg})
              </Text>
            </View>
          )}

          {portfolio.length > 0 && (
            <>
              <Text style={styles.chartTitle}>Risk Dağılımı (Pie)</Text>
              <PieChart
                data={getPieChartData()}
                width={Dimensions.get('window').width - 32}
                height={200}
                chartConfig={{ color: () => '#000' }}
                accessor="population"
                backgroundColor="transparent"
                paddingLeft="15"
                absolute
                style={styles.chart}
              />
            </>
          )}

          {portfolio.length > 0 && (
            <>
              <Text style={styles.chartTitle}>Risk Trend Grafiği (örnek)</Text>
              <LineChart
                data={getLineChartData()}
                width={Dimensions.get('window').width - 32}
                height={200}
                yLabelsOffset={20}
                chartConfig={{
                  backgroundColor: '#fff',
                  backgroundGradientFrom: '#fff',
                  backgroundGradientTo: '#fff',
                  decimalPlaces: 0,
                  color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
                  labelColor: () => '#000',
                }}
                style={styles.chart}
              />
            </>
          )}

          {portfolio.map((item) => (
            <View key={item.symbol} style={[styles.card, { borderColor: getColor(item.risk) }]}>
              <Text style={styles.symbol}>{item.symbol}</Text>
              <Text style={[styles.risk, { color: getColor(item.risk) }]}>Risk: {item.risk}</Text>
            </View>
          ))}
        </ScrollView>
      )}

      <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.floatingButton}>
        <Ionicons name="add" size={30} color="white" />
      </TouchableOpacity>

      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Watchlist Seçin</Text>
            {watchlists.map((list) => (
              <TouchableOpacity key={list.id} style={styles.modalItem} onPress={() => handleListSelect(list)}>
                <Text style={styles.modalItemText}>{list.name}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.closeButtonText}>Kapat</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 16, paddingBottom: 100 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  chart: { marginVertical: 12, borderRadius: 8 },
  chartTitle: { fontSize: 16, fontWeight: 'bold', marginTop: 10 },
  card: {
    borderWidth: 2,
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  symbol: { fontSize: 18, fontWeight: 'bold' },
  risk: { marginTop: 8, fontSize: 16 },
  floatingButton: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  selectedInfo: { position: 'absolute', top: 40, left: 16, zIndex: 10 },
  selectedInfoText: { fontSize: 16, fontWeight: 'bold', color: '#007AFF' },
  scoreBox: {
    backgroundColor: '#eef6ff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  scoreText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  modalContainer: { flex: 1, justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.3)' },
  modalContent: { margin: 20, padding: 20, backgroundColor: '#fff', borderRadius: 10 },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  modalItem: { paddingVertical: 10 },
  modalItemText: { fontSize: 16 },
  closeButton: { marginTop: 20, alignSelf: 'flex-end' },
  closeButtonText: { color: '#007AFF', fontWeight: 'bold' },
});

export default PortfolioRiskScreen;
