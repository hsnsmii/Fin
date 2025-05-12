// PortfolioRiskScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getStockHistory } from '../services/fmpApi';

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
        console.log("Gelen Watchlists:", data); // fetchWatchlists içinde

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

      for (const symbol of symbols) {
        const history = await getStockHistory(symbol);
        const indicators = calculateIndicators(history);
        if (!indicators) continue;

        const res = await fetch("http://192.168.1.37:5050/predict-risk", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(indicators),
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

  return (
    <View style={{ flex: 1 }}>
      <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.selector}>
        <Text style={styles.selectorText}>{selectedList ? selectedList.name : 'Liste Seçin'}</Text>
      </TouchableOpacity>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
        </View>
      ) : (
        <FlatList
          data={portfolio}
          keyExtractor={(item) => item.symbol}
          contentContainerStyle={styles.container}
          renderItem={({ item }) => (
            <View style={[styles.card, { borderColor: getColor(item.risk) }]}> 
              <Text style={styles.symbol}>{item.symbol}</Text>
              <Text style={[styles.risk, { color: getColor(item.risk) }]}>Risk: {item.risk}</Text>
            </View>
          )}
        />
      )}

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
  container: { padding: 16 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
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
  selector: { padding: 16, backgroundColor: '#007AFF' },
  selectorText: { color: '#fff', textAlign: 'center', fontWeight: '600' },
  modalContainer: { flex: 1, justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.3)' },
  modalContent: { margin: 20, padding: 20, backgroundColor: '#fff', borderRadius: 10 },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  modalItem: { paddingVertical: 10 },
  modalItemText: { fontSize: 16 },
  closeButton: { marginTop: 20, alignSelf: 'flex-end' },
  closeButtonText: { color: '#007AFF', fontWeight: 'bold' },
});

export default PortfolioRiskScreen;
