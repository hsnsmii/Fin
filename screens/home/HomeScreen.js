import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  Text,
  View,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  TextInput,
  Modal,
  Alert,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { Ionicons, FontAwesome5, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from '@react-navigation/native';
import { useLocalization } from '../../services/LocalizationContext';
import { API_BASE_URL } from '../../services/config';

const { width } = Dimensions.get('window');
const indexInfo = {
  'XU100.IS': { name: 'BIST 100', currency: '₺' },
  '^NDX': { name: 'NASDAQ 100', currency: '$' },
};

const HomeScreen = () => {
  const navigation = useNavigation();
  const { t } = useLocalization();
  const [watchlists, setWatchlists] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [newListName, setNewListName] = useState('');
  const [loading, setLoading] = useState(true);
  const [marketData, setMarketData] = useState([]);
  const [popularStocks, setPopularStocks] = useState([]);
  const [news, setNews] = useState([]);
  const [profileMenuVisible, setProfileMenuVisible] = useState(false);

  const handleSettingsPress1 = () => navigation.navigate('Market');

  const fetchWatchlists = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      if (!userId) {
        console.warn('User ID bulunamadı. Kullanıcı giriş yapmamış olabilir.');
        return;
      }
      const res = await axios.get(`${API_BASE_URL}/api/watchlists/${userId}`);
      setWatchlists(res.data);
    } catch (err) {
      console.error('Liste çekme hatası', err);
    } finally {
      setLoading(false);
    }
  };

  const createWatchlist = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      const res = await axios.post(`${API_BASE_URL}/api/watchlists`, {
        name: newListName,
        user_id: userId,
      });
      setWatchlists(prev => [...prev, res.data]);
      setNewListName('');
      setModalVisible(false);
    } catch (err) {
      Alert.alert('Hata', 'Liste oluşturulamadı.');
      console.error(err);
    }
  };

  const fetchMarketData = async () => {
    try {
      const res = await axios.get('https://financialmodelingprep.com/api/v3/quote/XU100.IS,^NDX?apikey=obHajA78aHmRpFpviomn8XALGDAoonj3');
      console.log("Market Data Response:", res.data);
      setMarketData(res.data || []);
    } catch (err) {
      console.error("Market data fetch error", err);
      setMarketData([]);
    }
  };

  const fetchPopularStocks = async () => {
    try {
      const res = await axios.get('https://financialmodelingprep.com/api/v3/quotes/ist?apikey=obHajA78aHmRpFpviomn8XALGDAoonj3');
      const sorted = res.data.sort((a, b) => b.changesPercentage - a.changesPercentage).slice(0, 10);
      setPopularStocks(sorted);
    } catch (err) {
      console.error("Popular stocks fetch error", err);
      setPopularStocks([]);
    }
  };

  const fetchNews = async () => {
    try {
      const res = await axios.get('https://financialmodelingprep.com/api/v3/stock_news?limit=5&apikey=obHajA78aHmRpFpviomn8XALGDAoonj3');
      setNews(res.data);
    } catch (err) {
      console.error("News fetch error", err);
    }
  };

  useEffect(() => {
    fetchWatchlists();
    fetchMarketData();
    fetchPopularStocks();
    fetchNews();
  }, []);

  const openWatchlist = (listId) => {
    navigation.navigate('WatchlistDetail', { listId });
  };

  const styles = {
    container: {
      flex: 1,
      backgroundColor: '#fefefe',
    },
    
    // Header Styles
    header: {
      paddingTop: 20,
      paddingBottom: 30,
      paddingHorizontal: 20,
      borderBottomLeftRadius: 30,
      borderBottomRightRadius: 30,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 8,
    },
    headerTop: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 25,
    },
    headerTitle: {
      fontSize: 28,
      fontWeight: '900',
      color: 'white',
      letterSpacing: 3,
      textShadowColor: 'rgba(0,0,0,0.3)',
      textShadowOffset: { width: 2, height: 2 },
      textShadowRadius: 4,
    },
    menuButton: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: 'rgba(255,255,255,0.2)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    profileCircle: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: 'white',
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },

    // Market Overview Styles
    marketOverview: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    marketCard: {
      flex: 1,
      backgroundColor: 'rgba(255,255,255,0.15)',
      borderRadius: 16,
      padding: 16,
      marginHorizontal: 4,
      backdropFilter: 'blur(10px)',
      borderWidth: 1,
      borderColor: 'rgba(255,255,255,0.2)',
    },
    marketCardHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 8,
    },
    marketCardTitle: {
      color: 'white',
      fontSize: 14,
      fontWeight: '600',
      opacity: 0.9,
    },
    marketCardValue: {
      color: 'white',
      fontSize: 20,
      fontWeight: '700',
      marginBottom: 4,
    },
    marketCardTrend: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    trendUp: {
      color: '#4CAF50',
      fontSize: 12,
      fontWeight: '600',
      marginLeft: 4,
    },
    trendDown: {
      color: '#E53935',
      fontSize: 12,
      fontWeight: '600',
      marginLeft: 4,
    },

    // Section Styles
    section: {
      paddingHorizontal: 20,
      marginTop: 30,
    },
    sectionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 20,
      paddingBottom: 8,
      borderBottomWidth: 2,
      borderBottomColor: '#f1f5f9',
    },
    sectionTitle: {
      fontSize: 22,
      fontWeight: '800',
      color: '#1a202c',
      letterSpacing: 0.5,
    },
    sectionTitleIcon: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    sectionTitleText: {
      marginLeft: 8,
    },
    seeAllText: {
      color: '#1e3a8a',
      fontSize: 14,
      fontWeight: '600',
    },

    // Stock Card Styles
    preferredStocksScroll: {
      marginBottom: 10,
    },
    stockCard: {
      backgroundColor: 'white',
      borderRadius: 24,
      padding: 20,
      marginRight: 16,
      width: 160,
      shadowColor: '#1e3a8a',          
      shadowOffset: { width: 0, height: 4 }, 
      shadowOpacity: 0.08,                
      shadowRadius: 10,                   
      elevation: 4,                     
      borderWidth: 1,
      borderColor: '#e2e8f0',
      position: 'relative',
      overflow: 'hidden',
    },
    stockCardGradient: {
      position: 'absolute',
      top: 0,
      right: 0,
      width: 60,
      height: 60,
      borderTopRightRadius: 24,
      opacity: 0.1,
    },
    stockSymbol: {
      fontSize: 20,
      fontWeight: '900',
      color: '#1e3a8a',
      marginBottom: 6,
      letterSpacing: 0.5,
    },
    stockName: {
      fontSize: 13,
      color: '#64748b',
      marginBottom: 16,
      numberOfLines: 2,
      lineHeight: 18,
    },
    stockPriceContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-end',
    },
    stockPrice: {
      fontSize: 18,
      fontWeight: '800',
      color: '#059669',
    },
    stockChange: {
      fontSize: 12,
      fontWeight: '700',
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 12,
      overflow: 'hidden',
    },
    stockChangePositive: {
      color: 'white',
      backgroundColor: '#059669',
    },
    stockChangeNegative: {
      color: 'white',
      backgroundColor: '#dc2626',
    },
    trendingBadge: {
      position: 'absolute',
      top: 12,
      right: 12,
      backgroundColor: '#fbbf24',
      paddingHorizontal: 6,
      paddingVertical: 2,
      borderRadius: 8,
    },
    trendingText: {
      fontSize: 8,
      fontWeight: '700',
      color: 'white',
    },

    // Watchlist Styles
    addButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#1e3a8a',
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 20,
      shadowColor: '#1e3a8a',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 4,
      elevation: 4,
    },
    addText: {
      color: 'white',
      fontSize: 12,
      fontWeight: '600',
      marginLeft: 6,
    },
    watchlistGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
    },
    watchlistCard: {
      backgroundColor: 'white',
      borderRadius: 16,
      padding: 20,
      width: (width - 52) / 2,
      marginBottom: 12,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 4,
      borderWidth: 1,
      borderColor: '#f1f5f9',
    },
    watchlistName: {
      fontSize: 14,
      fontWeight: '600',
      color: '#1a202c',
      marginTop: 12,
      textAlign: 'center',
    },

    // News Styles
    newsCard: {
      backgroundColor: 'white',
      borderRadius: 16,
      padding: 16,
      marginBottom: 12,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 4,
      borderWidth: 1,
      borderColor: '#f1f5f9',
    },
    newsTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: '#1a202c',
      marginBottom: 8,
      lineHeight: 22,
    },
    newsSource: {
      fontSize: 12,
      color: '#1e3a8a',
      fontWeight: '600',
      marginBottom: 8,
    },
    newsDescription: {
      fontSize: 14,
      color: '#64748b',
      lineHeight: 20,
    },

    // Modal Styles
    modalContainer: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.5)',
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 20,
    },
    modalContent: {
      backgroundColor: 'white',
      borderRadius: 20,
      padding: 24,
      width: '100%',
      maxWidth: 400,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.3,
      shadowRadius: 20,
      elevation: 10,
    },
    modalTitle: {
      fontSize: 18,
      fontWeight: '700',
      color: '#1a202c',
      marginBottom: 16,
      textAlign: 'center',
    },
    modalInput: {
      borderWidth: 1,
      borderColor: '#e2e8f0',
      borderRadius: 12,
      padding: 16,
      fontSize: 16,
      marginBottom: 20,
      backgroundColor: '#f8fafc',
    },
    modalActions: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    modalButton: {
      paddingHorizontal: 24,
      paddingVertical: 12,
      borderRadius: 12,
      minWidth: 80,
      alignItems: 'center',
    },
    cancelButton: {
      backgroundColor: '#f1f5f9',
    },
    createButton: {
      backgroundColor: '#1e3a8a',
    },
    cancelButtonText: {
      color: '#64748b',
      fontWeight: '600',
    },
    createButtonText: {
      color: 'white',
      fontWeight: '600',
    },

    // Loading Styles
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: 40,
    },
    emptyState: {
      textAlign: 'center',
      color: '#64748b',
      fontSize: 16,
      paddingVertical: 40,
    },
    profileMenuContent: {
      backgroundColor: 'white',
      borderRadius: 12,
      paddingVertical: 20,
      width: '80%',
      maxWidth: 300,
      alignItems: 'stretch',
    },
    profileMenuItem: {
      paddingVertical: 12,
      paddingHorizontal: 20,
    },
    profileMenuText: {
      fontSize: 16,
      color: '#1a202c',
    },
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1e3a8a" />
      <ScrollView showsVerticalScrollIndicator={false}>
        <LinearGradient colors={["#1e3a8a", "#1e40af", "#3730a3"]} style={styles.header}>
          <View style={styles.headerTop}>
            <View style={{ width: 44 }} />
            <Text style={styles.headerTitle}>FINOVER</Text>
          </View>

          {/* Market Overview */}
          <View style={styles.marketOverview}>
            {marketData && marketData.length > 0 ? (
              marketData.map((item, index) => (
                <View key={index} style={styles.marketCard}>
                  <View style={styles.marketCardHeader}>
                    <Text style={styles.marketCardTitle}>{indexInfo[item.symbol]?.name || item.symbol}</Text>
                    <MaterialCommunityIcons
                      name="chart-line"
                      size={18}
                      color={item.changesPercentage > 0 ? "#4CAF50" : "#E53935"}
                    />
                  </View>
                  <Text style={styles.marketCardValue}>{indexInfo[item.symbol]?.currency || ''}{item.price?.toFixed(2)}</Text>
                  <View style={styles.marketCardTrend}>
                    <Ionicons
                      name={item.changesPercentage > 0 ? "arrow-up" : "arrow-down"}
                      size={14} 
                      color={item.changesPercentage > 0 ? "#4CAF50" : "#E53935"} 
                    />
                    <Text style={item.changesPercentage > 0 ? styles.trendUp : styles.trendDown}>
                      {item.changesPercentage > 0 ? '+' : ''}{item.changesPercentage?.toFixed(2)}%
                    </Text>
                  </View>
                </View>
              ))
            ) : (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="small" color="white" />
              </View>
            )}
          </View>
        </LinearGradient>

        {/* Yükselen Hisseler */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleIcon}>
              <MaterialCommunityIcons name="trending-up" size={24} color="#1e3a8a" />
              <Text style={[styles.sectionTitle, styles.sectionTitleText]}>{t('Top Gainers')}</Text>
            </View>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.preferredStocksScroll}>
            {popularStocks && popularStocks.length > 0 ? (
              popularStocks.map((stock, index) => (
                <TouchableOpacity key={index} style={styles.stockCard}>
                  <Text style={styles.stockSymbol}>{stock.symbol}</Text>
                  <Text style={styles.stockName} numberOfLines={2}>{stock.name}</Text>
                  <View style={styles.stockPriceContainer}>
                    <Text style={styles.stockPrice}>{stock.price} ₺</Text>
                    <Text style={[
                      styles.stockChange,
                      stock.changesPercentage > 0 ? styles.stockChangePositive : styles.stockChangeNegative
                    ]}>
                      {stock.changesPercentage > 0 ? '+' : ''}{stock.changesPercentage?.toFixed(1)}%
                    </Text>
                  </View>
                </TouchableOpacity>
              ))
            ) : (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="small" color="#1e3a8a" />
              </View>
            )}
          </ScrollView>
        </View>

        {/* Takip Listeleri */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleIcon}>
              <FontAwesome5 name="bookmark" size={20} color="#1e3a8a" />
              <Text style={[styles.sectionTitle, styles.sectionTitleText]}>{t('My Watchlists')}</Text>
            </View>
            <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
              <Ionicons name="add" size={18} color="white" />
              <Text style={styles.addText}>{t('New List')}</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.watchlistGrid}>
            {loading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="small" color="#1e3a8a" />
              </View>
            ) : (
              watchlists && watchlists.length > 0 ? watchlists.map((list, index) => (
                <TouchableOpacity key={index} style={styles.watchlistCard} onPress={() => openWatchlist(list.id)}>
                  <FontAwesome5 name="list" size={24} color="#1e3a8a" />
                  <Text style={styles.watchlistName}>{list.name}</Text>
                </TouchableOpacity>
              )) : (
                <Text style={styles.emptyState}>{t('No watchlists yet')}</Text>
              )
            )}
          </View>
        </View>

        {/* Haberler */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleIcon}>
              <MaterialCommunityIcons name="newspaper-variant-outline" size={22} color="#1e3a8a" />
              <Text style={[styles.sectionTitle, styles.sectionTitleText]}>{t('Market News')}</Text>
            </View>
          </View>
          {news && news.length > 0 ? (
            news.map((newsItem, index) => (
              <TouchableOpacity key={index} style={styles.newsCard}>
                <Text style={styles.newsTitle}>{newsItem.title}</Text>
                <Text style={styles.newsSource}>{newsItem.source}</Text>
                <Text style={styles.newsDescription} numberOfLines={3}>
                  {newsItem.description}
                </Text>
              </TouchableOpacity>
            ))
          ) : (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color="#1e3a8a" />
            </View>
          )}
        </View>

        <View style={{ height: 30 }} />
      </ScrollView>

      {/* Modal */}
      <Modal transparent visible={modalVisible} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{t('Create New List')}</Text>
            <TextInput
              value={newListName}
              onChangeText={setNewListName}
              placeholder={t('Enter list name')}
              style={styles.modalInput}
              placeholderTextColor="#9ca3af"
            />
            <View style={styles.modalActions}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]} 
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>{t('Cancel')}</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalButton, styles.createButton]} 
                onPress={createWatchlist}
              >
                <Text style={styles.createButtonText}>{t('Create')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
};

export default HomeScreen;
