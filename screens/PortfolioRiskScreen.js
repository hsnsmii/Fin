import React, { useEffect, useState, useCallback } from 'react';
import {
  View, Text, ActivityIndicator, StyleSheet, TouchableOpacity, Modal,
  Dimensions, ScrollView, SafeAreaView, Alert, TextInput
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { PieChart } from 'react-native-chart-kit';
import { getStockHistory } from '../services/fmpApi';
import { API_BASE_URL, ML_BASE_URL } from '../services/config';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

const AppColors = {
  background: '#F4F6F8',
  cardBackground: '#FFFFFF',
  primaryText: '#2C3E50',
  secondaryText: '#7F8C8D',
  tertiaryText: '#B0BEC5',
  primaryAction: '#3498DB',
  separator: '#E0E6ED',
  riskLow: '#5DADE2',
  riskMedium: '#F39C12',
  riskHigh: '#E74C3C',
  white: '#FFFFFF',
};

// ==========================
// YARDIMCI FONKSİYONLAR
// ==========================
const calculateBeta = (stockHistory, marketHistory) => {
  if (!stockHistory || !marketHistory || stockHistory.length < 21 || marketHistory.length < 21) return null;
  const stockCloses = stockHistory.map(h => h.close).reverse();
  const marketCloses = marketHistory.map(h => h.close).reverse();
  if (stockCloses.some(c => c == null) || marketCloses.some(c => c == null)) return null;

  const stockReturns = [], marketReturns = [];
  for (let i = 1; i < 21; i++) {
    if (stockCloses[i - 1] === 0 || marketCloses[i - 1] === 0) return null;
    stockReturns.push((stockCloses[i] - stockCloses[i - 1]) / stockCloses[i - 1]);
    marketReturns.push((marketCloses[i] - marketCloses[i - 1]) / marketCloses[i - 1]);
  }
  if (stockReturns.length === 0 || marketReturns.length === 0) return null;
  const meanStock = stockReturns.reduce((a, b) => a + b, 0) / stockReturns.length;
  const meanMarket = marketReturns.reduce((a, b) => a + b, 0) / marketReturns.length;
  let covariance = 0, marketVariance = 0;
  for (let i = 0; i < stockReturns.length; i++) {
    covariance += (stockReturns[i] - meanStock) * (marketReturns[i] - meanMarket);
    marketVariance += Math.pow(marketReturns[i] - meanMarket, 2);
  }
  covariance /= stockReturns.length;
  marketVariance /= marketReturns.length;
  if (marketVariance === 0) return null;
  return covariance / marketVariance;
};

const calculateIndicators = (history) => {
  if (!history || history.length < 20) return null;
  const closes = history.map(h => h.close).reverse();
  if (closes.length < 20 || closes.some(c => c == null)) return null;

  // RSI
  const rsiCloses = closes.length >= 15 ? closes.slice(closes.length - 15) : closes;
  let gains = 0, losses = 0;
  for (let i = 1; i < rsiCloses.length; i++) {
    const change = rsiCloses[i] - rsiCloses[i - 1];
    change > 0 ? gains += change : losses -= Math.abs(change);
  }
  const period = rsiCloses.length - 1;
  const avgGain = gains / period;
  const avgLoss = losses / period;
  let rsi = 50;
  if (avgLoss === 0) rsi = 100;
  else if (avgGain === 0) rsi = 0;
  else rsi = 100 - (100 / (1 + avgGain / avgLoss));

  // SMA 20
  const sma_20_closes = closes.slice(-20);
  const sma_20 = sma_20_closes.reduce((sum, val) => sum + val, 0) / sma_20_closes.length;

  // Volatility
  const returns = [];
  for (let i = 1; i < sma_20_closes.length; i++) {
    if (sma_20_closes[i - 1] === 0) return null;
    returns.push((sma_20_closes[i] - sma_20_closes[i - 1]) / sma_20_closes[i - 1]);
  }
  const meanReturn = returns.reduce((sum, val) => sum + val, 0) / returns.length;
  const variance = returns.reduce((sum, val) => sum + Math.pow(val - meanReturn, 2), 0) / returns.length;
  const volatility = Math.sqrt(variance);

  return { rsi, sma_20, volatility };
};

const getColorByRisk = (risk) => {
  if (risk < 33) return AppColors.riskLow;
  if (risk < 66) return AppColors.riskMedium;
  return AppColors.riskHigh;
};

const getRiskCategoryText = (risk) => {
  if (risk < 33) return 'Düşük';
  if (risk < 66) return 'Orta';
  return 'Yüksek';
};

// ==========================
// ANA COMPONENT
// ==========================
const PortfolioRiskScreen = () => {
  const [watchlists, setWatchlists] = useState([]);
  const [selectedList, setSelectedList] = useState(null);
  const [portfolioRiskData, setPortfolioRiskData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [newPortfolioName, setNewPortfolioName] = useState('');
  const [recommendations, setRecommendations] = useState([]);
  const [analysisSummary, setAnalysisSummary] = useState(null);
  const [weightedRisk, setWeightedRisk] = useState(null);
  const navigation = useNavigation();

  const fetchWatchlists = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      if (!userId) {
        Alert.alert('Hata', 'Kullanıcı ID bulunamadı. Lütfen tekrar giriş yapın.');
        return [];
      }
      const res = await fetch(`${API_BASE_URL}/api/watchlists/${userId}?type=risk`);
      const data = await res.json();
      setWatchlists(data);
      return data;
    } catch (err) {
      Alert.alert('Veri Yükleme Hatası', err.message || 'Veriler yüklenirken bir sorun oluştu.');
      return [];
    }
  };

  const initialFetch = async () => {
    setLoading(true);
    const lists = await fetchWatchlists();
    try {
      const recRes = await fetch(`${ML_BASE_URL}/recommend-low-risk`);
      const recData = await recRes.json();
      setRecommendations(recData);
    } catch (e) {
      setRecommendations([]);
    }

    if (lists.length > 0) {
      await handleListSelect(lists[0], true);
    } else {
      setLoading(false);
    }
  };

  useEffect(() => {
    initialFetch();
  }, []);

  useFocusEffect(
    useCallback(() => {
      initialFetch();
    }, [])
  );

  // Portföy risk verisi
  const fetchPortfolioRisk = async (stocks) => {
    if (!stocks || stocks.length === 0) {
      setPortfolioRiskData([]);
      setWeightedRisk(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const symbols = [...new Set(stocks.map(s => s.symbol))];
      const riskDataPromises = [];
      const marketHistory = await getStockHistory('SPY');
      for (const symbol of symbols) {
        const history = await getStockHistory(symbol);
        if (!history || history.length === 0) continue;
        const indicators = calculateIndicators(history);
        const beta = calculateBeta(history, marketHistory);
        if (!indicators || beta === null) continue;
        const payload = { ...indicators, beta, symbol };
        riskDataPromises.push(
          fetch(`${ML_BASE_URL}/predict-risk`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          })
            .then(res => res.json())
            .then(json => ({
              symbol,
              risk: parseFloat(json.risk_percentage) || 0,
              breakdown: json.breakdown || { rsi: 0, sma_20: 0, volatility: 0, beta: 0 }
            }))
            .catch(() => null)
        );
      }
      const results = (await Promise.all(riskDataPromises)).filter(r => r !== null);
      setPortfolioRiskData(results.sort((a, b) => b.risk - a.risk));

      // Advanced analysis via backend
      const riskMap = {};
      results.forEach((r) => { riskMap[r.symbol] = r.risk; });
      const positions = stocks.map((s) => ({
        symbol: s.symbol,
        quantity: s.quantity || 1,
        price: s.price || 1,
        risk_score: (riskMap[s.symbol] || 0) / 100,
      }));

      const values = positions.map(p => (p.quantity || 0) * (p.price || 0));
      const totalValue = values.reduce((acc, v) => acc + v, 0);
      if (totalValue > 0) {
        let wRisk = 0;
        positions.forEach((p, idx) => {
          const weight = values[idx] / totalValue;
          wRisk += (p.risk_score || 0) * weight;
        });
        setWeightedRisk(wRisk * 100);
      } else {
        setWeightedRisk(null);
      }

      try {
        const analysisRes = await fetch(`${ML_BASE_URL}/portfolio-analysis`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ positions }),
        });
        const analysisJson = await analysisRes.json();
        setAnalysisSummary(analysisJson);
      } catch (e) {
        setAnalysisSummary(null);
      }
    } catch (err) {
      Alert.alert("Analiz Hatası", "Portföy risk analizi sırasında bir sorun oluştu.");
      setPortfolioRiskData([]);
    } finally {
      setLoading(false);
    }
  };

  const createRiskPortfolio = async () => {
    if (!newPortfolioName.trim()) return;
    try {
      const userId = await AsyncStorage.getItem('userId');
      const res = await fetch(`${API_BASE_URL}/api/watchlists`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newPortfolioName.trim(), user_id: userId, type: 'risk' }),
      });
      const json = await res.json();
      setNewPortfolioName('');
      setCreateModalVisible(false);
      setModalVisible(false);
      await initialFetch();
      navigation.navigate('AddPosition', { listId: json.id });
    } catch (err) {
      Alert.alert('Hata', 'Portföy oluşturulamadı.');
    }
  };

  // Watchlist seçimi
const handleListSelect = async (list, isInitialLoad = false) => {
  setSelectedList(list);
  setModalVisible(false);
  setAnalysisSummary(null);
  setWeightedRisk(null);
  if (list && list.stocks) {
    await fetchPortfolioRisk(list.stocks);
  } else {
      setPortfolioRiskData([]);
      if (!isInitialLoad) setLoading(false);
    }
  };

  // Genel risk
  const overallPortfolioRisk = () => {
    if (weightedRisk === null) return null;
    return {
      score: weightedRisk.toFixed(1),
      category: getRiskCategoryText(weightedRisk),
      color: getColorByRisk(weightedRisk),
    };
  };

  // Pie chart datası
  const pieChartDistributionData = () => {
    const total = portfolioRiskData.length;
    if (total === 0) return [];
    const low = portfolioRiskData.filter(p => getRiskCategoryText(p.risk) === 'Düşük').length;
    const med = portfolioRiskData.filter(p => getRiskCategoryText(p.risk) === 'Orta').length;
    const high = portfolioRiskData.filter(p => getRiskCategoryText(p.risk) === 'Yüksek').length;
    return [
      { name: `Düşük (${((low / total) * 100).toFixed(0)}%)`, population: low, color: AppColors.riskLow, legendFontColor: AppColors.secondaryText, legendFontSize: 13 },
      { name: `Orta (${((med / total) * 100).toFixed(0)}%)`, population: med, color: AppColors.riskMedium, legendFontColor: AppColors.secondaryText, legendFontSize: 13 },
      { name: `Yüksek (${((high / total) * 100).toFixed(0)}%)`, population: high, color: AppColors.riskHigh, legendFontColor: AppColors.secondaryText, legendFontSize: 13 },
    ].filter(item => item.population > 0);
  };

  // Loading veya boş durum
  const currentOverallRisk = overallPortfolioRisk();
  const currentPieData = pieChartDistributionData();

  if (loading && (!selectedList || portfolioRiskData.length === 0)) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.fullScreenLoader}>
          <ActivityIndicator size="large" color={AppColors.primaryAction} />
          <Text style={styles.loadingText}>Risk verileri yükleniyor...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>Portföy Risk Değerlendirmesi</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.listSelectorButton} onPress={() => setModalVisible(true)}>
            <Ionicons name="list-circle-outline" size={22} color={AppColors.primaryAction} />
            <Text style={styles.listSelectorText}>
              {selectedList ? selectedList.name : "Liste Seçin"}
            </Text>
            <Ionicons name="chevron-down" size={18} color={AppColors.primaryAction} />
          </TouchableOpacity>
          {selectedList && (
            <TouchableOpacity
              style={styles.addStockButton}
              onPress={() => navigation.navigate('AddPosition', { listId: selectedList.id })}
            >
              <Ionicons name="add-circle-outline" size={26} color={AppColors.primaryAction} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {loading && selectedList ? (
        <View style={styles.contentLoader}>
          <ActivityIndicator size="large" color={AppColors.primaryAction} />
          <Text style={styles.loadingText}>Analiz ediliyor: {selectedList.name}</Text>
        </View>
      ) : !selectedList || portfolioRiskData.length === 0 ? (
        <View style={styles.emptyStateContainer}>
          <Ionicons name="information-circle-outline" size={64} color={AppColors.tertiaryText} />
          <Text style={styles.emptyStateTitle}>Veri Bulunamadı</Text>
          <Text style={styles.emptyStateMessage}>
            {watchlists.length === 0 ? "Henüz bir izleme listeniz bulunmuyor. " : ""}
            Risk analizi için lütfen bir izleme listesi seçin veya seçili listede analiz edilecek hisse senedi bulunmuyor.
          </Text>
          {watchlists.length > 0 && (
            <TouchableOpacity style={styles.emptyStateButton} onPress={() => setModalVisible(true)}>
              <Text style={styles.emptyStateButtonText}>İzleme Listesi Seç</Text>
            </TouchableOpacity>
          )}
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {currentOverallRisk && (
            <View style={[styles.summaryCard, { borderColor: currentOverallRisk.color }]}>
              <Text style={styles.summaryCardTitle}>Genel Portföy Riski</Text>
              <View style={styles.summaryRiskContainer}>
                <Text style={[styles.summaryRiskScore, { color: currentOverallRisk.color }]}>
                  {currentOverallRisk.score}%
                </Text>
                <View style={[styles.summaryRiskBadge, { backgroundColor: currentOverallRisk.color }]}>
                  <Text style={styles.summaryRiskBadgeText}>{currentOverallRisk.category}</Text>
                </View>
              </View>
              <Text style={styles.summaryCardSubtitle}>
                Portföyünüzdeki varlıkların ortalama risk seviyesini gösterir.
              </Text>
            </View>
          )}

          {currentPieData.length > 0 && (
            <View style={styles.sectionCard}>
              <Text style={styles.sectionTitle}>Risk Dağılımı</Text>
              <PieChart
                data={currentPieData}
                width={Dimensions.get('window').width - 32}
                height={220}
                chartConfig={{
                  backgroundColor: AppColors.cardBackground,
                  backgroundGradientFrom: AppColors.cardBackground,
                  backgroundGradientTo: AppColors.cardBackground,
                  decimalPlaces: 0,
                  color: (opacity = 1) => `rgba(44, 62, 80, ${opacity})`,
                  labelColor: (opacity = 1) => `rgba(44, 62, 80, ${opacity})`,
                }}
                accessor={"population"}
                backgroundColor={"transparent"}
                paddingLeft={"15"}
                hasLegend={true}
              style={styles.pieChartStyle}
              />
            </View>
          )}

          {analysisSummary && (
            <View style={styles.sectionCard}>
              <Text style={styles.sectionTitle}>Portföy Analizi</Text>
              <Text style={styles.analysisText}>
                Yüksek Risk Oranı: {analysisSummary.high_risk_percentage?.toFixed(1) || '0'}%
              </Text>
              <Text style={styles.analysisText}>
                Çeşitlilik Skoru: {analysisSummary.diversification_score?.toFixed(2) || '0'}
              </Text>
              {analysisSummary.suggestions && analysisSummary.suggestions.length > 0 && (
                <View style={{ marginTop: 8 }}>
                  {analysisSummary.suggestions.map((s, idx) => (
                    <Text key={idx} style={styles.analysisSuggestion}>• {s}</Text>
                  ))}
                </View>
              )}
            </View>
          )}

          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Hisse Senedi Bazlı Riskler</Text>
            {portfolioRiskData.map((item, index) => (
              <TouchableOpacity
                key={item.symbol}
                style={[styles.stockItemCard, index === portfolioRiskData.length - 1 && styles.stockItemCardLast]}
                onPress={() => {
                  const breakdown = item.breakdown || {};
                  Alert.alert(
                    `${item.symbol} Risk Detayları`,
                    `Risk Puanı: ${item.risk}% (${getRiskCategoryText(item.risk)})\n\n` +
                    `RSI (14): ${breakdown.rsi?.toFixed(1) || 'N/A'}\n` +
                    `SMA (20): ${breakdown.sma_20?.toFixed(1) || 'N/A'}\n` +
                    `Volatilite (20 Gün): ${breakdown.volatility ? (breakdown.volatility * 100).toFixed(2) + '%' : 'N/A'}\n` +
                    `Beta: ${breakdown.beta?.toFixed(3) || 'N/A'}`
                  )
                }}
              >
                <View style={[styles.stockItemRiskBar, { backgroundColor: getColorByRisk(item.risk) }]} />
                <View style={styles.stockItemInfo}>
                  <Text style={styles.stockItemSymbol}>{item.symbol}</Text>
                  <Text style={styles.stockItemDetailText}>
                    Vol: {item.breakdown?.volatility ? (item.breakdown.volatility * 100).toFixed(1) + '%' : 'N/A'}, Beta: {item.breakdown?.beta?.toFixed(1) || 'N/A'}, RSI: {item.breakdown?.rsi?.toFixed(0) || 'N/A'}
                  </Text>
                </View>
                <View style={styles.stockItemRiskValue}>
                  <Text style={[styles.stockItemRiskPercent, { color: getColorByRisk(item.risk) }]}>
                    {item.risk}%
                  </Text>
                  <Text style={[styles.stockItemRiskCategory, { color: getColorByRisk(item.risk) }]}>
                    {getRiskCategoryText(item.risk)}
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={22} color={AppColors.tertiaryText} />
              </TouchableOpacity>
            ))}
          </View>

          {recommendations.length > 0 && (
            <View style={styles.sectionCard}>
              <Text style={styles.sectionTitle}>📉 Düşük Riskli Hisse Önerileri</Text>
              {recommendations.map((rec, index) => (
                <View key={`${rec.symbol}-${index}`} style={[styles.recommendationItem, index === recommendations.length - 1 && styles.recommendationItemLast]}>
                  <Ionicons
                    name={"bulb-outline"}
                    size={24}
                    color={AppColors.riskLow}
                    style={styles.recommendationIcon}
                  />
                  <View style={styles.recommendationContent}>
                    <Text style={styles.recommendationSymbol}>{rec.symbol} </Text>
                    <Text style={styles.recommendationText}>
                      Risk Puanı: {rec.risk_percentage ? `${rec.risk_percentage.toFixed(1)}%` : 'Belirtilmemiş'}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          )}

        </ScrollView>
      )}

      {/* Liste seçme modalı */}
      <Modal
        visible={modalVisible}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPressOut={() => setModalVisible(false)}>
          <View style={styles.modalContainer} onStartShouldSetResponder={() => true}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>İzleme Listesi Seç</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.modalCloseIcon}>
                <Ionicons name="close-circle" size={30} color={AppColors.tertiaryText} />
              </TouchableOpacity>
            </View>
            <ScrollView contentContainerStyle={styles.modalScrollView}>
              {watchlists.map((list) => (
                <TouchableOpacity
                  key={list._id || list.id}
                  onPress={() => handleListSelect(list)}
                  style={[
                    styles.modalListItem,
                    selectedList?._id === list._id && styles.modalListItemSelected
                  ]}
                >
                  <Ionicons
                    name={selectedList?._id === list._id ? "radio-button-on" : "radio-button-off"}
                    size={22}
                    color={selectedList?._id === list._id ? AppColors.primaryAction : AppColors.secondaryText}
                    style={styles.modalListItemIcon}
                  />
                  <Text style={[
                    styles.modalListItemText,
                    selectedList?._id === list._id && styles.modalListItemTextSelected
                  ]}>{list.name} ({list.stocks.length} hisse)</Text>
                </TouchableOpacity>
              ))}
              {watchlists.length === 0 && (
                <Text style={styles.noWatchlistInModalText}>Gösterilecek izleme listesi bulunmuyor.</Text>
              )}
            </ScrollView>
            <TouchableOpacity style={styles.newListButton} onPress={() => setCreateModalVisible(true)}>
              <Ionicons name="add" size={20} color={AppColors.white} style={{marginRight:8}} />
              <Text style={styles.newListButtonText}>Yeni Portföy Oluştur</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
      <Modal
        visible={createModalVisible}
        animationType="fade"
        transparent
        onRequestClose={() => setCreateModalVisible(false)}
      >
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPressOut={() => setCreateModalVisible(false)}>
          <View style={styles.modalContainer} onStartShouldSetResponder={() => true}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Yeni Portföy</Text>
              <TouchableOpacity onPress={() => setCreateModalVisible(false)} style={styles.modalCloseIcon}>
                <Ionicons name="close-circle" size={30} color={AppColors.tertiaryText} />
              </TouchableOpacity>
            </View>
            <View style={{padding:20}}>
              <TextInput
                placeholder="Portföy adı"
                value={newPortfolioName}
                onChangeText={setNewPortfolioName}
                style={styles.input}
              />
              <TouchableOpacity style={styles.createButton} onPress={createRiskPortfolio}>
                <Text style={styles.createButtonText}>Oluştur</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
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
  safeArea: {
    flex: 1,
    backgroundColor: AppColors.background,
  },
  fullScreenLoader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: AppColors.background,
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
  },
  contentLoader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    padding: 20,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: AppColors.secondaryText,
  },
  headerContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: AppColors.cardBackground,
    borderBottomWidth: 1,
    borderBottomColor: AppColors.separator,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: AppColors.primaryText,
    marginBottom: 8,
    textAlign: 'center',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  listSelectorButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: AppColors.background,
    borderRadius: 20,
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: AppColors.separator,
  },
  addStockButton: {
    marginLeft: 12,
  },
  listSelectorText: {
    fontSize: 15,
    color: AppColors.primaryAction,
    fontWeight: '500',
    marginHorizontal: 8,
  },
  scrollContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  summaryCard: {
    backgroundColor: AppColors.cardBackground,
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1.5,
    elevation: 3,
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
  summaryCardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: AppColors.primaryText,
    textAlign: 'center',
    marginBottom: 4,
  },
  summaryCardSubtitle: {
    fontSize: 13,
    color: AppColors.secondaryText,
    textAlign: 'center',
    marginTop: 8,
  },
  summaryRiskContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
  summaryRiskScore: {
    fontSize: 36,
    fontWeight: 'bold',
    marginRight: 10,
  },
  summaryRiskBadge: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 15,
  },
  summaryRiskBadgeText: {
    color: AppColors.white,
    fontSize: 14,
    fontWeight: 'bold',
  },
  sectionCard: {
    backgroundColor: AppColors.cardBackground,
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: AppColors.primaryText,
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: AppColors.separator,
  },
  pieChartStyle: {
    alignSelf: 'center',
    marginTop: 10,
    marginBottom: 10,
  },
  stockItemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: AppColors.separator,
  },
  stockItemCardLast: {
    borderBottomWidth: 0,
  },
  stockItemRiskBar: {
    width: 5,
    height: 40,
    borderRadius: 2.5,
    marginRight: 12,
  },
  stockItemInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  stockItemSymbol: {
    fontSize: 16,
    fontWeight: '500',
    color: AppColors.primaryText,
  },
  stockItemDetailText: {
    fontSize: 12,
    color: AppColors.secondaryText,
    marginTop: 2,
  },
  stockItemRiskValue: {
    alignItems: 'flex-end',
    marginLeft: 8,
    minWidth: 70,
  },
  stockItemRiskPercent: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  stockItemRiskCategory: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 2,
  },
  recommendationItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: AppColors.separator,
  },
  recommendationItemLast: {
    borderBottomWidth: 0,
  },
  recommendationIcon: {
    marginRight: 12,
    marginTop: 2,
  },
  recommendationContent: {
    flex: 1,
  },
  recommendationSymbol: {
    fontSize: 15,
    fontWeight: '500',
    color: AppColors.primaryText,
    marginBottom: 2,
  },
  recommendationText: {
    fontSize: 13,
    color: AppColors.secondaryText,
    lineHeight: 18,
  },
  analysisText: {
    fontSize: 14,
    color: AppColors.primaryText,
    marginBottom: 4,
  },
  analysisSuggestion: {
    fontSize: 13,
    color: AppColors.secondaryText,
    marginBottom: 2,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '85%',
    maxWidth: 380,
    maxHeight: '65%',
    backgroundColor: AppColors.cardBackground,
    borderRadius: 16,
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: AppColors.separator,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: AppColors.primaryText,
  },
  modalCloseIcon: {
    padding: 4,
  },
  modalScrollView: {
    paddingBottom: 8,
  },
  modalListItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderColor: AppColors.separator,
  },
  modalListItemSelected: {
    backgroundColor: AppColors.background,
  },
  modalListItemIcon: {
    marginRight: 15,
  },
  modalListItemText: {
    fontSize: 16,
    color: AppColors.primaryText,
    flex: 1,
  },
  modalListItemTextSelected: {
    fontWeight: '600',
    color: AppColors.primaryAction,
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
    backgroundColor: AppColors.background,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: AppColors.primaryText,
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyStateMessage: {
    fontSize: 15,
    color: AppColors.secondaryText,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  emptyStateButton: {
    backgroundColor: AppColors.primaryAction,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
  },
  emptyStateButtonText: {
    color: AppColors.white,
    fontSize: 16,
    fontWeight: '500',
  },
  newListButton: {
    backgroundColor: AppColors.primaryAction,
    margin: 20,
    paddingVertical: 12,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  newListButtonText: {
    color: AppColors.white,
    fontSize: 16,
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderColor: AppColors.separator,
    backgroundColor: AppColors.cardBackground,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 12,
  },
  createButton: {
    backgroundColor: AppColors.primaryAction,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  createButtonText: {
    color: AppColors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  noWatchlistInModalText: {
    textAlign: 'center',
    padding: 20,
    fontSize: 15,
    color: AppColors.secondaryText,
  },
});

export default PortfolioRiskScreen;