import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  Dimensions,
  RefreshControl, 
} from 'react-native';
import axios from 'axios';
import { useRoute, useNavigation } from '@react-navigation/native';
import { getStockDetails } from '../../services/fmpApi'; 
import { Ionicons } from '@expo/vector-icons';
import { PieChart } from 'react-native-chart-kit';

const API_URL = "http://192.168.1.27:3000"; // <<<<<<<< KENDİ BACKENDİNİ YAZ

const AppColors = {
  background: '#F4F6F8',
  cardBackground: '#FFFFFF',
  primaryText: '#2C3E50',
  secondaryText: '#7F8C8D',
  tertiaryText: '#B0BEC5',
  primaryAction: '#FFA500',
  primaryActionText: '#FFFFFF',
  separator: '#E0E6ED',
  profit: '#2ECC71',
  loss: '#E74C3C',
  edit: '#3498DB',
  delete: '#E74C3C',
  neutral: '#B0BEC5',
};

const PIE_CHART_COLORS = [
  '#5DADE2', '#F39C12', '#E74C3C', '#1ABC9C', '#8E44AD',
  '#2ECC71', '#3498DB', '#F1C40F', '#D35400', '#7F8C8D',
  '#C0392B', '#2980B9', '#27AE60', '#D68910', '#A569BD'
];

const getRandomColorForPie = (index) => {
  return PIE_CHART_COLORS[index % PIE_CHART_COLORS.length];
};

const PortfolioDetailScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { listId, listName } = route.params;

  const [positions, setPositions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false); 
  const [totalValue, setTotalValue] = useState(0);
  const [totalProfit, setTotalProfit] = useState(0);
  const [pieChartData, setPieChartData] = useState([]);

  const fetchPositions = useCallback(async (isRefresh = false) => {
    if (!isRefresh) setLoading(true);
    else setRefreshing(true);

    try {
      console.log('⏳ Portföy ID:', listId);
      const res = await axios.get(
        `http://192.168.1.27:3000/api/watchlists/${listId}/stocks`
      );
      console.log('📥 Gelen pozisyonlar:', res.data);

      if (!res.data || !Array.isArray(res.data)) {
        console.warn('⚠ API yanıtı beklenmedik formatta veya boş.');
        setPositions([]);
        setTotalValue(0);
        setTotalProfit(0);
        setPieChartData([]);
        if (!isRefresh) setLoading(false);
        else setRefreshing(false);
        return;
      }

      if (res.data.length === 0) {
        setPositions([]);
        setTotalValue(0);
        setTotalProfit(0);
        setPieChartData([]);
        if (!isRefresh) setLoading(false);
        else setRefreshing(false);
        return;
      }

      const enrichedPositionsPromises = res.data.map(async (item) => {
        if (!item.symbol || typeof item.quantity === 'undefined' || typeof item.price === 'undefined') {
          console.warn('⚠ Eksik DB verisi atlandı:', item);
          return null;
        }

        try {
          const stockData = await getStockDetails(item.symbol);
          if (!stockData || typeof stockData.price !== 'number') {
            console.warn('⚠ API verisi eksik veya fiyat geçersiz:', item.symbol, stockData);

            const cost = Number(item.quantity) * Number(item.price);
            return {
              ...item,
              dbPrice: Number(item.price), 
              companyName: stockData?.companyName || item.symbol,
              marketPrice: null, 
              profitLoss: null,
              profitLossPercent: null,
              cost,
              marketValue: null, 
            };
          }

          const marketPrice = parseFloat(stockData.price);
          const cost = Number(item.quantity) * Number(item.price);
          const marketValue = Number(item.quantity) * marketPrice;
          const profitLoss = marketValue - cost;
          const profitLossPercent = cost !== 0 ? (profitLoss / cost) * 100 : 0;

          return {
            ...item,
            dbPrice: Number(item.price), 
            companyName: stockData.companyName || item.symbol,
            marketPrice,
            profitLoss,
            profitLossPercent,
            cost,
            marketValue,
          };
        } catch (apiError) {
          console.error(`❌ ${item.symbol} için FMP API hatası:`, apiError);
          const cost = Number(item.quantity) * Number(item.price);
          return { 
            ...item,
            dbPrice: Number(item.price),
            companyName: item.symbol, 
            marketPrice: null,
            profitLoss: null,
            profitLossPercent: null,
            cost,
            marketValue: null,
          };
        }
      });

      const enrichedPositionsResult = (await Promise.all(enrichedPositionsPromises)).filter(Boolean);

      const totalMarketValue = enrichedPositionsResult.reduce((acc, pos) => acc + (pos.marketValue || 0), 0);
      const totalCalculatedProfit = enrichedPositionsResult.reduce((acc, pos) => acc + (pos.profitLoss || 0), 0);

      setTotalValue(totalMarketValue);
      setTotalProfit(totalCalculatedProfit);
      setPositions(enrichedPositionsResult);

      if (enrichedPositionsResult.length > 0 && totalMarketValue > 0) {
        const chartData = enrichedPositionsResult
          .filter(pos => pos.marketValue && pos.marketValue > 0) 
          .map((pos, index) => ({
            name: pos.symbol,
            population: pos.marketValue,
            color: getRandomColorForPie(index),
            legendFontColor: AppColors.secondaryText,
            legendFontSize: 13,
          }))
          .sort((a, b) => b.population - a.population); 
        setPieChartData(chartData);
      } else {
        setPieChartData([]);
      }

    } catch (err) {
      console.error('❌ Pozisyonlar çekilemedi:', err);
      Alert.alert('Hata', 'Pozisyonlar alınamadı. Lütfen internet bağlantınızı kontrol edin veya daha sonra tekrar deneyin.');
      setPositions([]);
      setPieChartData([]);
    } finally {
      if (!isRefresh) setLoading(false);
      else setRefreshing(false);
    }
  }, [listId]);

  useEffect(() => {
    const unsubscribeFocus = navigation.addListener('focus', () => {
      console.log('🟡 Portföy Detay Ekranı odakta, ID:', listId);
      fetchPositions();
    });

    return () => {
      unsubscribeFocus();
    };
  }, [navigation, fetchPositions, listId]);

  const handleDelete = async (symbol) => {
    Alert.alert(
      'Pozisyonu Sil',
      `${symbol} sembollü pozisyonu portföyden kalıcı olarak silmek istediğinize emin misiniz?`,
      [
        { text: 'İptal', style: 'cancel' },
        {
          text: 'Evet, Sil',
          style: 'destructive',
          onPress: async () => {
            try {
              await axios.delete(
                `http://192.168.1.27:3000/api/watchlists/${listId}/stocks/${symbol}`
              );
              Alert.alert('Başarılı', `${symbol} portföyden silindi.`);
              fetchPositions(true); 
            } catch (err) {
              console.error('Silme hatası:', err.response?.data || err.message);
              Alert.alert('Hata', `${symbol} silinirken bir sorun oluştu: ${err.response?.data?.message || 'Sunucu hatası'}`);
            }
          },
        },
      ]
    );
  };

  const handleEdit = (position) => {
    navigation.navigate('AddPosition', { 
      listId, 
      symbol: position.symbol, 
      isEdit: true,
      currentQuantity: position.quantity,
      currentPrice: position.dbPrice, 
    });
  };

  const renderItem = ({ item }) => (
    <View style={styles.positionCard}>
      <View style={[
          styles.positionSideBar, 
          { backgroundColor: item.profitLoss === null ? AppColors.neutral : (item.profitLoss >= 0 ? AppColors.profit : AppColors.loss) }
      ]} />
      <View style={styles.positionInfo}>
        <View style={styles.positionHeader}>
            <Text style={styles.symbol}>{item.symbol}</Text>
            <Text style={styles.company} numberOfLines={1} ellipsizeMode="tail">{item.companyName || 'Şirket Adı Yüklenemedi'}</Text>
        </View>
        <Text style={styles.positionDetailText}>
          Alım: {item.quantity} adet @ ₺{item.dbPrice.toFixed(2)}
        </Text>
        <Text style={styles.positionDetailText}>
  Güncel Fiyat: {item.marketPrice !== null ? "₺" + item.marketPrice.toFixed(2) : 'Veri Yok'}
</Text>
<Text style={styles.positionDetailText}>
  Piyasa Değeri: {item.marketValue !== null ? "₺" + item.marketValue.toFixed(2) : 'Hesaplanamadı'}
</Text>
<Text style={styles.positionDetailText}>
  Maliyet: {"₺" + item.cost.toFixed(2)}
</Text>

        {item.profitLoss !== null && item.profitLossPercent !== null ? (
            <Text style={[
                styles.positionProfitLoss, 
                { color: item.profitLoss >= 0 ? AppColors.profit : AppColors.loss }
            ]}>
            K/Z: ₺{item.profitLoss.toFixed(2)} ({item.profitLossPercent.toFixed(2)}%)
            </Text>
        ) : (
            <Text style={[styles.positionProfitLoss, {color: AppColors.neutral}]}>K/Z: Hesaplanamadı</Text>
        )}
      </View>
      <View style={styles.actionContainer}>
        <TouchableOpacity onPress={() => handleEdit(item)} style={styles.actionButton}>
          <Ionicons name="create-outline" size={24} color={AppColors.edit} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleDelete(item.symbol)} style={styles.actionButton}>
          <Ionicons name="trash-outline" size={24} color={AppColors.delete} />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderListHeader = () => (
    <>
      <View style={styles.pageHeaderContainer}>
        <Text style={styles.pageHeaderTitle}>{listName}</Text>
        <Text style={styles.pageHeaderSubtitle}>Portföy Detayları</Text>
      </View>

      <View style={[styles.summaryCard, { borderColor: totalProfit >= 0 ? AppColors.profit : AppColors.loss }]}>
        <Text style={styles.summaryCardTitle}>Portföy Özeti</Text>
        <View style={styles.summaryRow}>
          <Ionicons name="wallet-outline" size={22} color={AppColors.primaryText} style={styles.summaryIcon} />
          <Text style={styles.summaryLabel}>Toplam Değer:</Text>
          <Text style={styles.summaryValue}>₺{totalValue.toFixed(2)}</Text>
        </View>
        <View style={[styles.summaryRow, styles.summaryRowLast]}>
          <Ionicons name={totalProfit >= 0 ? "trending-up-outline" : "trending-down-outline"} size={22} color={totalProfit >= 0 ? AppColors.profit : AppColors.loss} style={styles.summaryIcon} />
          <Text style={styles.summaryLabel}>Toplam Kâr/Zarar:</Text>
          <Text style={[styles.summaryValue, { color: totalProfit >= 0 ? AppColors.profit : AppColors.loss }]}>
            ₺{totalProfit.toFixed(2)}
          </Text>
        </View>
      </View>

      {pieChartData.length > 0 && (
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Varlık Dağılımı (Piyasa Değerine Göre)</Text>
          <PieChart
            data={pieChartData}
            width={Dimensions.get('window').width - 32} 
            height={230}
            chartConfig={{
              backgroundColor: AppColors.cardBackground,
              backgroundGradientFrom: AppColors.cardBackground,
              backgroundGradientTo: AppColors.cardBackground,
              color: (opacity = 1) => AppColors.primaryText, 
              labelColor: (opacity = 1) => AppColors.primaryText,
              style: { borderRadius: 8 },
              propsForLabels: { fontSize: 11 } 
            }}
            accessor={"population"}
            backgroundColor={"transparent"}
            paddingLeft={"10"}
            center={[Dimensions.get('window').width * 0.1, 0]} 
            absolute={false}
            hasLegend={true}
            style={styles.pieChartStyle}
          />
        </View>
      )}
      {positions.length > 0 && <Text style={styles.positionsHeaderTitle}>Pozisyonlar</Text>}
    </>
  );

  if (loading && !refreshing) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.fullScreenLoader}>
          <ActivityIndicator size="large" color={AppColors.primaryAction} />
          <Text style={styles.loadingText}>Portföy yükleniyor...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      {positions.length === 0 && !loading ? (
        <View style={styles.emptyStateParentContainer}>
          {renderListHeader()} 
          <View style={styles.emptyStateContainer}>
            <Ionicons name="file-tray-stacked-outline" size={64} color={AppColors.tertiaryText} style={{marginTop: 30}}/>
            <Text style={styles.emptyStateTitle}>Portföy Boş</Text>
            <Text style={styles.emptyStateMessage}>
              Bu portföyde henüz pozisyon bulunmamaktadır. Eklemeye başlayın!
            </Text>
            <TouchableOpacity
              style={styles.emptyStateButton}
              onPress={() => navigation.navigate('AddPosition', { listId })}>
              <Ionicons name="add-circle-outline" size={22} color={AppColors.primaryActionText} style={{marginRight: 8}}/>
              <Text style={styles.emptyStateButtonText}>Pozisyon Ekle</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <FlatList
          data={positions}
          renderItem={renderItem}
          keyExtractor={(item, index) => item.id ? item.id.toString() : `${item.symbol}-${index}`}
          ListHeaderComponent={renderListHeader}
          contentContainerStyle={styles.listContentContainer}
          showsVerticalScrollIndicator={false}
          refreshControl={ 
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => fetchPositions(true)}
              colors={[AppColors.primaryAction]} 
              tintColor={AppColors.primaryAction} 
            />
          }
        />
      )}
      {}
      {positions.length > 0 && !loading && (
         <TouchableOpacity
            style={styles.addButtonFab}
            onPress={() => navigation.navigate('AddPosition', { listId })}>
            <Ionicons name="add-outline" size={32} color={AppColors.primaryActionText} />
        </TouchableOpacity>
      )}
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
  },
  loadingText: {
    marginTop: 15,
    fontSize: 16,
    color: AppColors.secondaryText,
  },
  pageHeaderContainer: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 10,
  },
  pageHeaderTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: AppColors.primaryText,
    textAlign: 'center',
  },
  pageHeaderSubtitle: {
    fontSize: 16,
    color: AppColors.secondaryText,
    textAlign: 'center',
    marginTop: 4,
  },
  summaryCard: {
    backgroundColor: AppColors.cardBackground,
    borderRadius: 12,
    padding: 20,
    marginHorizontal: 16,
    marginTop: 10,
    marginBottom: 20,
    borderWidth: 1, 
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
    marginBottom: 15,
    textAlign: 'center',
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10, 
    borderBottomWidth: 1,
    borderBottomColor: AppColors.separator,
  },
  summaryRowLast: {
    borderBottomWidth: 0,
  },
  summaryIcon: {
    marginRight: 12,
  },
  summaryLabel: {
    fontSize: 16,
    color: AppColors.secondaryText, 
    flex: 1,
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: AppColors.primaryText,
  },
  sectionCard: {
    backgroundColor: AppColors.cardBackground,
    borderRadius: 12,
    paddingVertical: 16,
    marginHorizontal: 16,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: AppColors.primaryText,
    marginBottom: 5, 
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: AppColors.separator,
    width: '90%',
    textAlign: 'center',
  },
  pieChartStyle: {
    alignSelf: 'center',
    marginTop: 5, 
  },
  listContentContainer: {
    paddingBottom: 80, 
  },
  positionsHeaderTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: AppColors.primaryText,
    marginHorizontal: 16,
    marginBottom: 12,
    marginTop: 5,
  },
  positionCard: {
    backgroundColor: AppColors.cardBackground,
    borderRadius: 10,
    marginHorizontal: 16,
    marginBottom: 12,
    flexDirection: 'row',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    overflow: 'hidden',
  },
  positionSideBar: {
    width: 7, 
  },
  positionInfo: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  positionHeader: {
    flexDirection: 'row',
    alignItems: 'center', 
    justifyContent: 'space-between', 
    marginBottom: 6,
  },
  symbol: {
    fontSize: 19, 
    fontWeight: 'bold',
    color: AppColors.primaryText,
  },
  company: {
    fontSize: 13, 
    color: AppColors.secondaryText,
    marginLeft: 8,
    flexShrink: 1, 
    textAlign: 'left', 
  },
  positionDetailText: {
    fontSize: 13.5, 
    color: AppColors.secondaryText,
    lineHeight: 19, 
  },
  positionProfitLoss: {
    fontSize: 14.5, 
    fontWeight: 'bold',
    marginTop: 6,
  },
  actionContainer: {
    flexDirection: 'column',
    justifyContent: 'space-evenly', 
    alignItems: 'center',
    paddingHorizontal: 10, 
    borderLeftWidth: 1,
    borderLeftColor: AppColors.separator,
    backgroundColor: '#FAFAFA', 
  },
  actionButton: {
    padding: 10, 
  },
  emptyStateParentContainer: {
      flex: 1, 
  },
  emptyStateContainer: {
    flexGrow: 1, 
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
    paddingBottom: 30, 
  },
  emptyStateTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: AppColors.primaryText,
    marginTop: 20,
    marginBottom: 10,
    textAlign: 'center',
  },
  emptyStateMessage: {
    fontSize: 15,
    color: AppColors.secondaryText,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 25,
  },
  emptyStateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: AppColors.primaryAction, 
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25, 
    elevation: 2,
  },
  emptyStateButtonText: {
    color: AppColors.primaryActionText,
    fontSize: 16,
    fontWeight: '500',
  },
  addButtonFab: {
    position: 'absolute',
    bottom: 25,
    right: 25,
    backgroundColor: AppColors.primaryAction,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});

export default PortfolioDetailScreen;