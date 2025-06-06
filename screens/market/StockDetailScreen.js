// StockDetailScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, ActivityIndicator, TouchableOpacity, Modal, Alert, Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getStockDetails, getStockHistory } from '../../services/fmpApi';
import { API_BASE_URL, ML_BASE_URL } from '../../services/config';
import { LineChart } from 'react-native-chart-kit';
import { Feather } from '@expo/vector-icons';
import { styles } from "../../styles/StockDetailStyle";

const screenWidth = Dimensions.get('window').width;

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

const StockDetailScreen = ({ route, navigation }) => {
  const { symbol } = route.params;
  const [stock, setStock] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [watchlists, setWatchlists] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [riskPercentage, setRiskPercentage] = useState(null);
  const [timeRange, setTimeRange] = useState('month');

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const detail = await getStockDetails(symbol);
        const historical = await getStockHistory(symbol, timeRange);
        const marketHistorical = await getStockHistory('SPY', timeRange);

        setStock(detail);
        setHistory(historical);

        const indicators = calculateIndicators(historical);
        const beta = calculateBeta(historical, marketHistorical);

        if (!indicators || beta === null) {
          setRiskPercentage(null);
          return;
        }

        const payload = { ...indicators, beta, symbol };
        console.log("Gönderilen veriler:", payload);

        const response = await fetch(`${ML_BASE_URL}/predict-risk`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        const data = await response.json();
        console.log("Tahmin sonucu:", data);
        setRiskPercentage(data.risk_percentage ?? null);

      } catch (err) {
        console.error("Veri çekme hatası:", err);
        setRiskPercentage(null);
      } finally {
        setLoading(false);
      }

      try {
        const userId = await AsyncStorage.getItem('userId');
        if (!userId) return;
        const response = await fetch(`${API_BASE_URL}/api/watchlists/${userId}`);
        const data = await response.json();
        setWatchlists(data);
      } catch (err) {
        console.error("Liste alma hatası:", err);
      }
    };

    fetchAll();
  }, [symbol, timeRange]);

  useEffect(() => {
    navigation.setOptions({
      title: symbol,
      headerStyle: { backgroundColor: '#fff', elevation: 0, shadowOpacity: 0 },
      headerTitleStyle: { fontWeight: 'bold' },
    });
  }, [navigation, symbol]);

  const handleAddToWatchlist = async (listId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/watchlists/${listId}/stocks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ symbol }),
      });
      if (response.ok) {
        Alert.alert('Başarılı', 'Hisse listeye eklendi');
        setModalVisible(false);
      } else {
        throw new Error('Ekleme başarısız');
      }
    } catch (err) {
      console.error(err);
      Alert.alert('Hata', 'Ekleme sırasında sorun oluştu');
    }
  };

  const handleAddWithFallback = async () => {
    const userId = await AsyncStorage.getItem('userId');
    if (watchlists.length === 0) {
      const response = await fetch(`${API_BASE_URL}/api/watchlists`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'Favoriler', user_id: userId }),
      });
      const newList = await response.json();
      await handleAddToWatchlist(newList.id);
    } else {
      setModalVisible(true);
    }
  };

  const getChartData = () => {
    if (!history || history.length === 0) return { labels: [], datasets: [{ data: [0] }] };
    const chartLabels = history.map(h => h.date).slice().reverse().map(date => date.slice(5));
    const chartPrices = history.map(h => h.close).slice().reverse();
    return { labels: chartLabels, datasets: [{ data: chartPrices }] };
  };

  const renderPriceChange = () => {
    if (!stock) return null;
    const change = (stock.changes || 0);
    const changePercent = (stock.changesPercentage || 0);
    const isPositive = change >= 0;
    return (
      <View style={styles.changeContainer}>
        <Text style={[styles.change, isPositive ? styles.positive : styles.negative]}>
          {isPositive ? '+' : ''}{change.toFixed(2)} ({isPositive ? '+' : ''}{changePercent.toFixed(2)}%)
        </Text>
        <Feather name={isPositive ? 'arrow-up' : 'arrow-down'} size={18} color={isPositive ? '#2ecc71' : '#e74c3c'} />
      </View>
    );
  };

  if (loading || !stock) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <View style={styles.companyInfo}>
          <Text style={styles.companyName}>{stock.companyName}</Text>
          <Text style={styles.symbol}>{symbol}</Text>
        </View>
        <TouchableOpacity style={styles.addButton} onPress={handleAddWithFallback}>
          <Feather name="plus" size={22} color="#fff" />
          <Text style={styles.addText}>Takip Listesine ekle</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.priceCard}>
        <Text style={styles.price}>${Number(stock.price).toFixed(2)}</Text>
        {renderPriceChange()}
      </View>

      <View style={styles.infoCard}>
        <Text style={styles.sectionTitle}>Yapay Zeka Risk Değerlendirmesi</Text>
        <Text style={{ fontSize: 16, fontWeight: '600', color: '#e67e22', marginBottom: 10 }}>
          Risk Skoru: {riskPercentage !== null ? `%${riskPercentage}` : 'Hesaplanıyor...'}
        </Text>
        <View style={{ height: 12, backgroundColor: '#eee', borderRadius: 6, overflow: 'hidden', marginBottom: 12 }}>
          <View
            style={{
              height: '100%',
              width: `${riskPercentage ?? 0}%`,
              backgroundColor:
                riskPercentage < 40
                  ? '#2ecc71'
                  : riskPercentage < 70
                  ? '#f1c40f'
                  : '#e74c3c',
            }}
          />
        </View>
      </View>

      <View style={styles.chartCard}>
        <View style={styles.chartHeader}>
          <Text style={styles.chartTitle}>Fiyat Grafiği</Text>
          <View style={styles.timeRangeSelector}>
            <TouchableOpacity style={[styles.rangeButton, timeRange === 'week' && styles.activeRange]} onPress={() => setTimeRange('week')}>
              <Text style={[styles.rangeText, timeRange === 'week' && styles.activeRangeText]}>1H</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.rangeButton, timeRange === 'month' && styles.activeRange]} onPress={() => setTimeRange('month')}>
              <Text style={[styles.rangeText, timeRange === 'month' && styles.activeRangeText]}>1A</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.rangeButton, timeRange === 'year' && styles.activeRange]} onPress={() => setTimeRange('year')}>
              <Text style={[styles.rangeText, timeRange === 'year' && styles.activeRangeText]}>1Y</Text>
            </TouchableOpacity>
          </View>
        </View>

        <LineChart
          data={getChartData()}
          width={screenWidth - 40}
          height={220}
          yAxisLabel="$"
          withInnerLines={false}
          withOuterLines={false}
          chartConfig={{
            backgroundColor: '#fff',
            backgroundGradientFrom: '#fff',
            backgroundGradientTo: '#fff',
            decimalPlaces: 2,
            color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(128, 128, 128, ${opacity})`,
            propsForDots: { r: '4', strokeWidth: '2', stroke: '#007AFF' },
            propsForLabels: { fontSize: 10 },
          }}
          bezier
          style={styles.chart}
        />
      </View>

      <View style={styles.infoCard}>
        <Text style={styles.sectionTitle}>Şirket Bilgileri</Text>
        <View style={styles.infoRow}><Text style={styles.infoLabel}>Sektör:</Text><Text style={styles.infoValue}>{stock.sector || 'Bilinmiyor'}</Text></View>
        <View style={styles.infoRow}><Text style={styles.infoLabel}>Piyasa Değeri:</Text><Text style={styles.infoValue}>${(stock.marketCap / 1000000000).toFixed(2)} Milyar</Text></View>
        <View style={styles.infoRow}><Text style={styles.infoLabel}>F/K Oranı:</Text><Text style={styles.infoValue}>{stock.pe ? stock.pe.toFixed(2) : 'N/A'}</Text></View>
        <View style={styles.infoRow}><Text style={styles.infoLabel}>Beta:</Text><Text style={styles.infoValue}>{stock.beta ? stock.beta.toFixed(2) : 'N/A'}</Text></View>
      </View>

      <View style={styles.descriptionCard}>
        <Text style={styles.sectionTitle}>Şirket Açıklaması</Text>
        <Text style={styles.descriptionText}>{stock.description}</Text>
      </View>

      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Liste Seçin</Text>
            {watchlists.map(list => (
              <TouchableOpacity key={list.id} style={styles.modalItem} onPress={() => handleAddToWatchlist(list.id)}>
                <Feather name="list" size={18} color="#007AFF" />
                <Text style={styles.modalItemText}>{list.name}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.closeButtonText}>Kapat</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

export default StockDetailScreen;
