// PortfolioRiskScreen.js
import React, { useEffect, useState } from 'react';
import {
  View, Text, ActivityIndicator, StyleSheet, TouchableOpacity,
  Modal, Dimensions, ScrollView, SafeAreaView, Alert
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { PieChart } from 'react-native-chart-kit';
import { getStockHistory } from '../services/fmpApi'; 

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

const calculateBeta = (stockHistory, marketHistory) => {
  if (!stockHistory || !marketHistory || stockHistory.length < 21 || marketHistory.length < 21) return null;
  const stockCloses = stockHistory.map(h => h.close).reverse();
  const marketCloses = marketHistory.map(h => h.close).reverse();
  if (stockCloses.some(c => c === null || c === undefined) || marketCloses.some(c => c === null || c === undefined)) return null;
  const stockReturns = [], marketReturns = [];
  for (let i = 1; i < 21; i++) {
    if (stockCloses[i-1] === 0 || marketCloses[i-1] === 0) return null; 
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
  return marketVariance === 0 ? 0 : covariance / marketVariance;
};

const calculateIndicators = (history) => {
  if (!history || history.length < 20) return null;
  const closes = history.map(h => h.close).reverse();
  if (closes.some(c => c === null || c === undefined)) return null;

  const rsiCloses = closes.length >= 15 ? closes.slice(closes.length - 15) : closes;
  let gains = 0, losses = 0;
  if (rsiCloses.length < 2) return { rsi: 50, sma_20: 0, volatility: 0}; 

  for (let i = 1; i < rsiCloses.length; i++) {
    const change = rsiCloses[i] - rsiCloses[i - 1];
    change > 0 ? gains += change : losses -= Math.abs(change); 
  }

  const period = rsiCloses.length -1;
  if (period === 0) return { rsi: 50, sma_20: 0, volatility: 0};

  const avgGain = gains / period;
  const avgLoss = losses / period;
  let rsi = 50;
  if (avgLoss === 0) { rsi = 100; }
  else if (avgGain === 0) { rsi = 0; }
  else { const rs = avgGain / avgLoss; rsi = 100 - (100 / (1 + rs)); }

  const sma_20_closes = closes.length >= 20 ? closes.slice(closes.length - 20) : closes;
  const sma_20 = sma_20_closes.reduce((sum, val) => sum + val, 0) / sma_20_closes.length;

  const volatilityCloses = closes.length >= 20 ? closes.slice(closes.length - 20) : closes;
  const returns = [];
  for (let i = 1; i < volatilityCloses.length; i++) {
      if(volatilityCloses[i-1] === 0) return null; 
      returns.push((volatilityCloses[i] - volatilityCloses[i-1]) / volatilityCloses[i-1]);
  }
  if(returns.length < 1) return { rsi, sma_20, volatility: 0 };

  const meanReturn = returns.reduce((sum, val) => sum + val, 0) / returns.length;
  const variance = returns.reduce((sum, val) => sum + Math.pow(val - meanReturn, 2), 0) / returns.length;
  const volatility = Math.sqrt(variance);

  return { rsi, sma_20, volatility };
};

const PortfolioRiskScreen = () => {
  const [watchlists, setWatchlists] = useState([]);
  const [selectedList, setSelectedList] = useState(null);
  const [portfolioRiskData, setPortfolioRiskData] = useState([]); 
  const [loading, setLoading] = useState(true); 
  const [modalVisible, setModalVisible] = useState(false);
  const [recommendations, setRecommendations] = useState([]); 

  useEffect(() => {
    const initialFetch = async () => {
      setLoading(true);
      try {
        const userId = await AsyncStorage.getItem('userId');
        if (!userId) {
          Alert.alert("Hata", "Kullanıcı ID bulunamadı. Lütfen tekrar giriş yapın.");
          setLoading(false);
          return;
        }

        const watchlistRes = await fetch(`http:
        if (!watchlistRes.ok) throw new Error(`Watchlist alınamadı: ${watchlistRes.status}`);
        const watchlistData = await watchlistRes.json();
        setWatchlists(watchlistData);

        const recRes = await fetch("http://192.168.1.27:5050/recommend-low-risk");
        if (!recRes.ok) throw new Error(`Öneriler alınamadı: ${recRes.status}`);
        const recData = await recRes.json();
        setRecommendations(recData);

        if (watchlistData.length > 0) {

           await handleListSelect(watchlistData[0], true); 
        } else {
          setLoading(false); 
        }
      } catch (err) {
        console.error("Başlangıç verileri alma hatası:", err);
        Alert.alert("Veri Yükleme Hatası", err.message || "Veriler yüklenirken bir sorun oluştu.");
        setLoading(false);
      }
    };
    initialFetch();
  }, []); 

  const fetchPortfolioRisk = async (stocks) => {
    if (!stocks || stocks.length === 0) {
      setPortfolioRiskData([]);
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
        if (!history || history.length === 0) {
            console.warn(`Geçmiş veri yok: ${symbol}`);
            continue;
        }
        const indicators = calculateIndicators(history);
        const beta = calculateBeta(history, marketHistory);

        if (!indicators || beta === null) {
          console.warn(`İndikatörler veya beta hesaplanamadı: ${symbol}`);
          continue; 
        }

        const payload = { 
          rsi: indicators.rsi, 
          sma_20: indicators.sma_20, 
          volatility: indicators.volatility, 
          beta, 
          symbol 
        };

        riskDataPromises.push(
            fetch("http://192.168.1.27:5050/predict-risk", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            })
            .then(res => {
                if (!res.ok) throw new Error(`Risk tahmini hatası (${symbol}): ${res.status}`);
                return res.json();
            })
            .then(json => ({ 
                symbol, 
                risk: parseFloat(json.risk_percentage) || 0, 
                breakdown: json.breakdown || { rsi:0, sma_20:0, volatility:0, beta:0 } 
            }))
            .catch(err => {
                console.error(`Risk API çağrısı hatası (${symbol}):`, err);
                return null; 
            })
        );
      }

      const results = (await Promise.all(riskDataPromises)).filter(r => r !== null);
      setPortfolioRiskData(results.sort((a, b) => b.risk - a.risk));
    } catch (err) {
      console.error("Portföy risk analizi hatası:", err);
      Alert.alert("Analiz Hatası", "Portföy risk analizi sırasında bir sorun oluştu.");
      setPortfolioRiskData([]);
    } finally {
      setLoading(false);
    }
  };

  const handleListSelect = async (list, isInitialLoad = false) => {
    setSelectedList(list);
    setModalVisible(false);
    if (list && list.stocks) {
      await fetchPortfolioRisk(list.stocks);
    } else {
      setPortfolioRiskData([]);
      if (!isInitialLoad) setLoading(false); 
    }
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

  const overallPortfolioRisk = () => {
    if (portfolioRiskData.length === 0) return null;
    const totalRisk = portfolioRiskData.reduce((acc, p) => acc + (p.risk || 0), 0);
    const avgRisk = totalRisk / portfolioRiskData.length;
    return {
      score: avgRisk.toFixed(1),
      category: getRiskCategoryText(avgRisk),
      color: getColorByRisk(avgRisk),
    };
  };

  const pieChartDistributionData = () => {
    const total = portfolioRiskData.length;
    if (total === 0) return [];

    const lowRiskCount = portfolioRiskData.filter(p => getRiskCategoryText(p.risk) === 'Düşük').length;
    const mediumRiskCount = portfolioRiskData.filter(p => getRiskCategoryText(p.risk) === 'Orta').length;
    const highRiskCount = portfolioRiskData.filter(p => getRiskCategoryText(p.risk) === 'Yüksek').length;

    const data = [
      { name: 'Düşük', population: lowRiskCount, color: AppColors.riskLow, legendFontColor: AppColors.secondaryText, legendFontSize: 13 },
      { name: 'Orta', population: mediumRiskCount, color: AppColors.riskMedium, legendFontColor: AppColors.secondaryText, legendFontSize: 13 },
      { name: 'Yüksek', population: highRiskCount, color: AppColors.riskHigh, legendFontColor: AppColors.secondaryText, legendFontSize: 13 },
    ];

    return data
        .filter(item => item.population > 0)
        .map(item => ({
            ...item,
            name: `${item.name} (${((item.population / total) * 100).toFixed(0)}%)`,
        }));
  };

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
        <TouchableOpacity style={styles.listSelectorButton} onPress={() => setModalVisible(true)}>
          <Ionicons name="list-circle-outline" size={22} color={AppColors.primaryAction} />
          <Text style={styles.listSelectorText}>
            {selectedList ? selectedList.name : "Liste Seçin"}
          </Text>
          <Ionicons name="chevron-down" size={18} color={AppColors.primaryAction} />
        </TouchableOpacity>
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
                width={Dimensions.get('window').width - (16 * 2) - (16*2)} 
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

          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Hisse Senedi Bazlı Riskler</Text>
            {portfolioRiskData.map((item, index) => (
              <TouchableOpacity
                key={item.symbol}
                style={[styles.stockItemCard, index === portfolioRiskData.length -1 && styles.stockItemCardLast]}
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
                  <View key={`${rec.symbol}-${index}`} style={[styles.recommendationItem, index === recommendations.length -1 && styles.recommendationItemLast]}>
                    <Ionicons
                        name={"bulb-outline"} 
                        size={24}
                        color={AppColors.riskLow} 
                        style={styles.recommendationIcon}
                    />
                    <View style={styles.recommendationContent}>
                        <Text style={styles.recommendationSymbol}>{rec.symbol} </Text>
                        {}
                        <Text style={styles.recommendationText}>
                            Risk Puanı: {rec.risk_percentage ? `${rec.risk_percentage.toFixed(1)}%` : 'Belirtilmemiş'}
                        </Text>
                         {}
                    </View>
                  </View>
                ))}
             </View>
          )}
        </ScrollView>
      )}

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
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
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
  contentLoader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
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
  noWatchlistInModalText: {
    textAlign: 'center',
    padding: 20,
    fontSize: 15,
    color: AppColors.secondaryText,
  },
});

export default PortfolioRiskScreen;
