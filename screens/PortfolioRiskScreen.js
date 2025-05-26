// PortfolioRiskScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, TouchableOpacity, Modal, Dimensions, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { LineChart, PieChart } from 'react-native-chart-kit';
import { getStockHistory } from '../services/fmpApi';

const calculateBeta = (stockHistory, marketHistory) => {
  const stockCloses = stockHistory.map(h => h.close).reverse();
  const marketCloses = marketHistory.map(h => h.close).reverse();
  if (stockCloses.length < 21 || marketCloses.length < 21) return null;
  const stockReturns = [], marketReturns = [];
  for (let i = 1; i < 21; i++) {
    stockReturns.push((stockCloses[i] - stockCloses[i - 1]) / stockCloses[i - 1]);
    marketReturns.push((marketCloses[i] - marketCloses[i - 1]) / marketCloses[i - 1]);
  }
  const meanStock = stockReturns.reduce((a, b) => a + b, 0) / stockReturns.length;
  const meanMarket = marketReturns.reduce((a, b) => a + b, 0) / marketReturns.length;
  let covariance = 0, marketVariance = 0;
  for (let i = 0; i < stockReturns.length; i++) {
    covariance += (stockReturns[i] - meanStock) * (marketReturns[i] - meanMarket);
    marketVariance += Math.pow(marketReturns[i] - meanMarket, 2);
  }
  return marketVariance === 0 ? 0 : covariance / marketVariance;
};

const calculateIndicators = (history) => {
  const closes = history.map(h => h.close).reverse();
  if (closes.length < 20) return null;
  let gains = 0, losses = 0;
  for (let i = 1; i < 15; i++) {
    const change = closes[i] - closes[i - 1];
    change > 0 ? gains += change : losses -= change;
  }
  const avgGain = gains / 14, avgLoss = losses / 14;
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
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    const fetchWatchlists = async () => {
      try {
        const userId = await AsyncStorage.getItem('userId');
        const res = await fetch(`http://172.20.10.2:3000/api/watchlists/${userId}`);
        const data = await res.json();
        setWatchlists(data);
      } catch (err) {
        console.error("Watchlist alma hatasi:", err);
      }
    };

    const fetchRecommendations = async () => {
      try {
        const res = await fetch("http://172.20.10.2:5050/recommend-low-risk");
        const data = await res.json();
        setRecommendations(data);
      } catch (err) {
        console.error("Öneri alma hatası:", err);
      }
    };

    fetchWatchlists();
    fetchRecommendations();
  }, []);

  const fetchPortfolioRisk = async (stocks) => {
    setLoading(true);
    try {
      const symbols = [...new Set(stocks.map(s => s.symbol))];
      const riskData = [];
      const marketHistory = await getStockHistory('SPY');

      for (const symbol of symbols) {
        const history = await getStockHistory(symbol);
        const indicators = calculateIndicators(history);
        const beta = calculateBeta(history, marketHistory);
        if (!indicators || beta === null) continue;
        const payload = { ...indicators, beta, symbol };
        const res = await fetch("http://172.20.10.2:5050/predict-risk", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const json = await res.json();
        riskData.push({ symbol, risk: json.risk_percentage, breakdown: json.breakdown });
      }
      setPortfolio(riskData);
    } catch (err) {
      console.error("Portföy risk analizi hatasi:", err);
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
    if (risk < 40) return '#2ecc71';
    if (risk < 70) return '#f1c40f';
    return '#e74c3c';
  };

  const getPortfolioRiskScore = () => {
    if (portfolio.length === 0) return null;
    const avg = portfolio.reduce((acc, p) => acc + (p.risk || 0), 0) / portfolio.length;
    return { avg: avg.toFixed(1) };
  };

  const getPieChartData = () => {
    const total = portfolio.length;
    const low = portfolio.filter(p => p.risk < 40).length;
    const med = portfolio.filter(p => p.risk >= 40 && p.risk < 70).length;
    const high = portfolio.filter(p => p.risk >= 70).length;

    return [
      { name: 'Düşük Risk', population: low, color: '#2ecc71' },
      { name: 'Orta Risk', population: med, color: '#f1c40f' },
      { name: 'Yüksek Risk', population: high, color: '#e74c3c' },
    ].map(item => ({
      ...item,
      name: `${item.name} (${((item.population / total) * 100).toFixed(1)}%)`,
      legendFontColor: '#333',
      legendFontSize: 14,
    }));
  };

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
              <Text style={styles.scoreText}>
                Ortalama Risk Yüzdesi: %{getPortfolioRiskScore().avg}
              </Text>
            </View>
          )}

          {portfolio.length > 0 && (
            <>
              <Text style={styles.chartTitle}>Risk Dağılımı</Text>
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

          {portfolio.map((item) => (
            <View key={item.symbol} style={[styles.card, { borderColor: getColor(item.risk) }]}>
              <Text style={styles.symbol}>{item.symbol}</Text>
              <Text style={[styles.risk, { color: getColor(item.risk) }]}>Risk Skoru: %{item.risk}</Text>
              <View style={{ height: 8, backgroundColor: '#eee', borderRadius: 6, overflow: 'hidden', marginTop: 6 }}>
                <View
                  style={{ height: '100%', width: `${item.risk}%`, backgroundColor: getColor(item.risk) }}
                />
              </View>
              {item.breakdown && (
                <View style={{ marginTop: 8 }}>
                  <Text style={styles.breakdownText}>RSI: {item.breakdown.rsi.toFixed(2)}</Text>
                  <Text style={styles.breakdownText}>SMA20: {item.breakdown.sma_20.toFixed(2)}</Text>
                  <Text style={styles.breakdownText}>Volatilite: {item.breakdown.volatility.toFixed(2)}</Text>
                  <Text style={styles.breakdownText}>Beta: {item.breakdown.beta.toFixed(2)}</Text>
                </View>
              )}
            </View>
          ))}

          {recommendations.length > 0 && (
            <View style={styles.card}>
              <Text style={styles.chartTitle}>📉 Düşük Riskli Hisse Önerileri</Text>
              {recommendations.map(item => (
                <Text key={item.symbol} style={{ fontSize: 14 }}>
                  • {item.symbol} (%{item.risk})
                </Text>
              ))}
            </View>
          )}
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
  breakdownText: { fontSize: 13, color: '#333', marginTop: 2 },
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
  scoreBox: { backgroundColor: '#eef6ff', padding: 12, borderRadius: 8, marginBottom: 16 },
  scoreText: { fontSize: 16, fontWeight: 'bold', color: '#007AFF' },
  modalContainer: { flex: 1, justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.3)' },
  modalContent: { margin: 20, padding: 20, backgroundColor: '#fff', borderRadius: 10 },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  modalItem: { paddingVertical: 10 },
  modalItemText: { fontSize: 16 },
  closeButton: { marginTop: 20, alignSelf: 'flex-end' },
  closeButtonText: { color: '#007AFF', fontWeight: 'bold' },
});

export default PortfolioRiskScreen;
