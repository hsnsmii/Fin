import React, { useEffect, useState, useLayoutEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Modal,
  Alert,
  Dimensions,
  SafeAreaView
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LineChart } from 'react-native-chart-kit';
import { Feather } from '@expo/vector-icons';

import { getStockDetails, getStockHistory } from '../../services/fmpApi';
import { API_BASE_URL, ML_BASE_URL } from '../../services/config';
import { styles, theme } from "../../styles/StockDetailStyle"; 

const screenWidth = Dimensions.get('window').width;


const calculateBeta = (stockHistory, marketHistory) => {
  if (!stockHistory || !marketHistory || stockHistory.length < 21 || marketHistory.length < 21) return null;
  const stockCloses = stockHistory.map(h => h.close).reverse();
  const marketCloses = marketHistory.map(h => h.close).reverse();

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
  if (!history || history.length < 20) return null;
  const closes = history.map(h => h.close).reverse();

  let gains = 0, losses = 0;
  for (let i = 1; i < 15; i++) {
    const change = closes[i] - closes[i - 1];
    change > 0 ? gains += change : losses -= change;
  }
  const avgGain = gains / 14, avgLoss = losses / 14;
  const rs = avgLoss === 0 ? Infinity : avgGain / avgLoss;
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
  const [isBookmarked, setIsBookmarked] = useState(false); 
  const [riskPercentage, setRiskPercentage] = useState(null);
  const [timeRange, setTimeRange] = useState('1A'); 

  useEffect(() => {
    const fetchStockData = async () => {
      setLoading(true);
      setRiskPercentage(null); 
      try {

        const [detail, historical, marketHistorical, userId] = await Promise.all([
          getStockDetails(symbol),
          getStockHistory(symbol, timeRange),
          getStockHistory('SPY', timeRange), 
          AsyncStorage.getItem('userId'),
        ]);

        setStock(detail);
        setHistory(historical);

        const indicators = calculateIndicators(historical);
        const beta = calculateBeta(historical, marketHistorical);

        if (indicators && beta !== null) {
          const payload = { ...indicators, beta, symbol };
          console.log("ML Modeline Gönderilen Veriler:", payload);
          const response = await fetch(`${ML_BASE_URL}/predict-risk`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });
          const data = await response.json();
          console.log("Yapay Zeka Tahmin Sonucu:", data);
          setRiskPercentage(data.risk_percentage ?? null);
        }

        if (userId) {
          const response = await fetch(`${API_BASE_URL}/api/watchlists/${userId}`);
          const userWatchlists = await response.json();
          setWatchlists(userWatchlists);

          const isStockInAnyWatchlist = userWatchlists.some(list => 
            list.stocks && list.stocks.some(s => s.symbol === symbol)
          );
          setIsBookmarked(isStockInAnyWatchlist);
        }

      } catch (err) {
        console.error("Detay sayfası veri çekme hatası:", err);
        Alert.alert("Hata", "Hisse senedi verileri yüklenirken bir sorun oluştu.");
      } finally {
        setLoading(false);
      }
    };

    fetchStockData();
  }, [symbol, timeRange]); 

  useLayoutEffect(() => {
    navigation.setOptions({
      title: '',
      headerBackTitleVisible: false,
      headerShadowVisible: false,
      headerStyle: { backgroundColor: theme.colors.background },
      headerTintColor: theme.colors.primary,
      headerRight: () => (
        <TouchableOpacity onPress={handleAddWithFallback} style={{ marginRight: 15 }}>
          <Feather
            name="star"
            size={24}
            color={isBookmarked ? theme.colors.accent : theme.colors.textSecondary}

            fill={isBookmarked ? theme.colors.accent : 'transparent'}
          />
        </TouchableOpacity>
      ),
    });
  }, [navigation, isBookmarked, handleAddWithFallback]); 

  const handleAddToWatchlist = async (listId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/watchlists/${listId}/stocks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ symbol }),
      });
      if (response.ok) {
        Alert.alert('Başarılı', `Hisse "${watchlists.find(l => l.id === listId).name}" listesine eklendi.`);
        setIsBookmarked(true);
        setModalVisible(false);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Ekleme başarısız');
      }
    } catch (err) {
      console.error(err);
      Alert.alert('Hata', `Ekleme sırasında sorun oluştu: ${err.message}`);
    }
  };

  const handleAddWithFallback = async () => {
    if (isBookmarked) {

        Alert.alert('Bilgi', `${symbol} zaten bir takip listenizde bulunuyor. Takipten çıkarmak için listelerinizi düzenleyebilirsiniz.`);

        return;
    }

    const userId = await AsyncStorage.getItem('userId');
    if (!userId) {
        Alert.alert("Giriş Gerekli", "Hisse eklemek için lütfen giriş yapın.");
        return;
    }

    if (watchlists.length === 0) {
      try {
        const response = await fetch(`${API_BASE_URL}/api/watchlists`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: 'Favorilerim', user_id: userId }),
        });
        const newList = await response.json();
        setWatchlists([newList]); 
        await handleAddToWatchlist(newList.id);
      } catch (error) {
         Alert.alert('Hata', 'Varsayılan liste oluşturulurken bir hata oluştu.');
      }
    } else {
      setModalVisible(true);
    }
  };

  const getChartData = () => {
    if (!history || history.length === 0) return { labels: [], datasets: [{ data: [0] }] };

    const maxLabels = 7;
    const step = history.length <= maxLabels ? 1 : Math.ceil(history.length / maxLabels);

    const chartLabels = history
        .map((h, i) => (i % step === 0) ? (h.label || h.date) : '') 
        .reverse();

    const chartPrices = history.map(h => h.close).reverse();

    return {
      labels: chartLabels,
      datasets: [{ data: chartPrices, strokeWidth: 2 }],
    };
  };

  const renderPriceChange = () => {
    if (!stock || typeof stock.changes === 'undefined') return null;
    const isPositive = (stock.changes || 0) >= 0;
    const change = stock.changes || 0;
    const changePercent = stock.changesPercentage || 0;

    return (
      <View style={[styles.priceChangeContainer, isPositive ? styles.positiveBg : styles.negativeBg]}>
        <Feather name={isPositive ? 'arrow-up' : 'arrow-down'} size={14} color={theme.colors.text} />
        <Text style={styles.priceChangeText}>
          {change.toFixed(2)} ({changePercent.toFixed(2)}%)
        </Text>
      </View>
    );
  };

  const renderKeyStats = () => (
    <View style={styles.statsContainer}>
        <View style={styles.statBox}>
            <Text style={styles.statLabel}>Piyasa Değeri</Text>
            <Text style={styles.statValue}>${(stock.marketCap / 1e9).toFixed(2)}B</Text>
        </View>
        <View style={styles.statBox}>
            <Text style={styles.statLabel}>F/K Oranı</Text>
            <Text style={styles.statValue}>{stock.pe ? stock.pe.toFixed(2) : 'N/A'}</Text>
        </View>
        <View style={styles.statBox}>
            <Text style={styles.statLabel}>Beta</Text>
            <Text style={styles.statValue}>{stock.beta ? stock.beta.toFixed(2) : 'N/A'}</Text>
        </View>
         <View style={styles.statBox}>
            <Text style={styles.statLabel}>Sektör</Text>
            <Text style={styles.statValue}>{stock.sector || 'N/A'}</Text>
        </View>
    </View>
  );

  if (loading || !stock) {
    return <View style={styles.loadingContainer}><ActivityIndicator size="large" color={theme.colors.primary} /></View>;
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}>
        <View style={styles.headerContainer}>
          <Text style={styles.symbol}>{symbol}</Text>
          <Text style={styles.companyName}>{stock.companyName}</Text>
        </View>

        <View style={styles.priceContainer}>
          <Text style={styles.currentPrice}>${Number(stock.price).toFixed(2)}</Text>
          {renderPriceChange()}
        </View>

        <View style={styles.card}>
            <LineChart
                data={getChartData()}
                width={screenWidth - 32}
                height={220}
                withInnerLines={false}
                withOuterLines={false}
                yAxisLabel="$"
                chartConfig={theme.chartConfig}
                bezier
                style={styles.chart}
            />
            <View style={styles.timeRangeSelector}>
                {['1G', '1H', '1A', '1Y', '5Y'].map(range => (
                    <TouchableOpacity key={range} style={[styles.rangeButton, timeRange === range && styles.activeRange]} onPress={() => setTimeRange(range)}>
                        <Text style={[styles.rangeText, timeRange === range && styles.activeRangeText]}>{range}</Text>
                    </TouchableOpacity>
                ))}
            </View>
        </View>

        <View style={styles.card}>
            <Text style={styles.cardTitle}>Anahtar İstatistikler</Text>
            {renderKeyStats()}
        </View>

        <View style={styles.card}>
            <Text style={styles.cardTitle}>Yapay Zeka Risk Değerlendirmesi</Text>
            {riskPercentage !== null ? (
              <View style={styles.riskContent}>
                  <Text style={styles.riskScore}>%{riskPercentage.toFixed(0)}</Text>
                  <View style={{ flex: 1, marginLeft: 15 }}>
                      <Text style={styles.riskLabel}>
                          {riskPercentage < 40 ? 'Düşük Risk' : riskPercentage < 70 ? 'Orta Risk' : 'Yüksek Risk'}
                      </Text>
                      <View style={styles.riskBarContainer}>
                          <View style={[styles.riskBar, { width: `${riskPercentage}%`, backgroundColor: riskPercentage < 40 ? theme.colors.positive : riskPercentage < 70 ? theme.colors.warning : theme.colors.negative }]} />
                      </View>
                  </View>
              </View>
            ) : (
              <Text style={styles.descriptionText}>Risk skoru hesaplanıyor veya veri yetersiz...</Text>
            )}
        </View>

        <View style={styles.card}>
            <Text style={styles.cardTitle}>Şirket Hakkında</Text>
            <Text style={styles.descriptionText}>{stock.description || 'Açıklama bulunamadı.'}</Text>
        </View>

        <Modal visible={modalVisible} transparent animationType="slide" onRequestClose={() => setModalVisible(false)}>
            <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPressOut={() => setModalVisible(false)} />
            <View style={styles.modalContent}>
                <View style={styles.modalHandle} />
                <Text style={styles.modalTitle}>Listeye Ekle</Text>
                {watchlists.map(list => (
                    <TouchableOpacity key={list.id} style={styles.modalItem} onPress={() => handleAddToWatchlist(list.id)}>
                        <Feather name="list" size={20} color={theme.colors.primary} />
                        <Text style={styles.modalItemText}>{list.name}</Text>
                    </TouchableOpacity>
                ))}
            </View>
        </Modal>

      </ScrollView>
    </SafeAreaView>
  );
};

export default StockDetailScreen;
