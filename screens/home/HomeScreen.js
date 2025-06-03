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
} from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { Ionicons, FontAwesome5, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import styles from "../../styles/hstyles";
import { useNavigation } from '@react-navigation/native';

const HomeScreen = () => {
  const navigation = useNavigation();
  const [watchlists, setWatchlists] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [newListName, setNewListName] = useState('');
  const [loading, setLoading] = useState(true);
  const [marketData, setMarketData] = useState([]); 
  const [popularStocks, setPopularStocks] = useState([]); 
  const [news, setNews] = useState([]); 

  const handleSettingsPress1 = () => navigation.navigate('Market');

  const fetchWatchlists = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      if (!userId) {
        console.warn('User ID bulunamadı. Kullanıcı giriş yapmamış olabilir.');
        return;
      }
      const res = await axios.get(`http://192.168.1.27:3000/api/watchlists/${userId}`);
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
      const res = await axios.post('http://192.168.1.27:3000/api/watchlists', {
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
      const res = await axios.get('https://financialmodelingprep.com/api/v3/quote/BIST100,NASDAQ100?apikey=obHajA78aHmRpFpviomn8XALGDAoonj3');
      if (res.data && Array.isArray(res.data)) {
        setMarketData(res.data);
      } else {
        console.error("Unexpected market data format", res.data);
      }
    } catch (err) {
      console.error("Market data fetch error", err);
    }
  };

  const fetchPopularStocks = async () => {
    try {
      const res = await axios.get('https://financialmodelingprep.com/api/v3/stock_market/gainers_losers?apikey=obHajA78aHmRpFpviomn8XALGDAoonj3');
      setPopularStocks(res.data.gainers); // Yükselen hisseler
    } catch (err) {
      console.error("Popular stocks fetch error", err);
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

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <StatusBar barStyle="light-content" />
      <ScrollView showsVerticalScrollIndicator={false}>
        <LinearGradient colors={["#2c3e50", "#3498db"]} style={styles.header}>
          <View style={styles.headerTop}>
            <TouchableOpacity style={styles.menuButton}>
              <Ionicons name="menu" size={24} color="white" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>FINOVER</Text>
            <TouchableOpacity style={styles.profileCircle}>
              <Ionicons name="person" size={20} color="#2c3e50" />
            </TouchableOpacity>
          </View>

          {/* Market Overview */}
          <View style={styles.marketOverview}>
            {marketData && marketData.length > 0 ? (
              marketData.map((item, index) => (
                <View key={index} style={styles.marketCard}>
                  <View style={styles.marketCardHeader}>
                    <Text style={styles.marketCardTitle}>{item.symbol}</Text>
                    <MaterialCommunityIcons name="chart-line" size={18} color={item.change > 0 ? "#4CAF50" : "#E53935"} />
                  </View>
                  <Text style={styles.marketCardValue}>{item.price}</Text>
                  <View style={styles.marketCardTrend}>
                    <Ionicons name={item.change > 0 ? "arrow-up" : "arrow-down"} size={14} color={item.change > 0 ? "#4CAF50" : "#E53935"} />
                    <Text style={item.change > 0 ? styles.trendUp : styles.trendDown}>{item.change.toFixed(2)}%</Text>
                  </View>
                </View>
              ))
            ) : (
              <ActivityIndicator size="small" />
            )}
          </View>
        </LinearGradient>

        {/* Yükselen ve Düşen Hisseler */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Yükselen Hisseler</Text>
            <TouchableOpacity><Text style={styles.seeAllText}>Tümünü Gör</Text></TouchableOpacity>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.preferredStocksScroll}>
            {popularStocks && popularStocks.length > 0 ? (
              popularStocks.map((stock, index) => (
                <TouchableOpacity key={index} style={styles.stockCard}>
                  <Text style={styles.stockSymbol}>{stock.symbol}</Text>
                  <Text style={styles.stockName}>{stock.name}</Text>
                  <Text style={styles.stockPrice}>{stock.price} ₺</Text>
                </TouchableOpacity>
              ))
            ) : (
              <ActivityIndicator size="small" />
            )}
          </ScrollView>
        </View>

        {/* Takip Listeleri */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Takip Listeleri</Text>
            <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
              <Ionicons name="add" size={18} color="white" />
              <Text style={styles.addText}>Yeni Liste</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.watchlistGrid}>
            {loading ? <ActivityIndicator size="small" /> : (
              watchlists && watchlists.length > 0 ? watchlists.map((list, index) => (
                <TouchableOpacity key={index} style={styles.watchlistCard} onPress={() => openWatchlist(list.id)}>
                  <FontAwesome5 name="list" size={20} color="#3498db" />
                  <Text style={styles.watchlistName}>{list.name}</Text>
                </TouchableOpacity>
              )) : <Text>No watchlists available</Text>
            )}
          </View>
        </View>

        {/* Haberler */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Pazar Haberleri</Text>
          </View>
          {news && news.length > 0 ? (
            news.map((newsItem, index) => (
              <View key={index} style={styles.newsCard}>
                <Text style={styles.newsTitle}>{newsItem.title}</Text>
                <Text style={styles.newsSource}>{newsItem.source}</Text>
                <Text style={styles.newsDescription}>{newsItem.description}</Text>
              </View>
            ))
          ) : (
            <ActivityIndicator size="small" />
          )}
        </View>
      </ScrollView>

      {/* Modal */}
      <Modal transparent visible={modalVisible} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={{ fontWeight: 'bold', fontSize: 16, marginBottom: 10 }}>Yeni Liste Oluştur</Text>
            <TextInput
              value={newListName}
              onChangeText={setNewListName}
              placeholder="Liste adı girin"
              style={styles.modalInput}
            />
            <View style={styles.modalActions}>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Text style={{ color: '#e74c3c' }}>İptal</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={createWatchlist}>
                <Text style={{ color: '#3498db', fontWeight: 'bold' }}>Oluştur</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default HomeScreen;
