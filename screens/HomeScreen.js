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
import styles from "../styles/hstyles";
import { useNavigation } from '@react-navigation/native';

const HomeScreen = () => {
  const navigation = useNavigation();
  const [watchlists, setWatchlists] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [newListName, setNewListName] = useState('');
  const [loading, setLoading] = useState(true);
  const handleSettingsPress1 = () => navigation.navigate('Market');

  const fetchWatchlists = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      if (!userId) {
        console.warn('User ID bulunamadı. Kullanıcı giriş yapmamış olabilir.');
        return;
      }
      const res = await axios.get(`http://192.168.1.26:3000/api/watchlists/${userId}`);
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
      const res = await axios.post('http://192.168.1.26:3000/api/watchlists', {
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

  useEffect(() => {
    fetchWatchlists();
  }, []);

  const handleSettingsPress = () => navigation.navigate('FAQ');
  //const handleSettingsPress1 = () => navigation.navigate('Market');
  const handleSettingsPress2 = () => navigation.navigate('Profile');

  const openWatchlist = (listId) => {
    navigation.navigate('WatchlistDetail', { listId });
  };

  return (
    <SafeAreaView style={styles.container}>
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

          <View style={styles.marketOverview}>
            <View style={styles.marketCard}>
              <View style={styles.marketCardHeader}>
                <Text style={styles.marketCardTitle}>BIST100</Text>
                <MaterialCommunityIcons name="chart-line" size={18} color="#4CAF50" />
              </View>
              <Text style={styles.marketCardValue}>9,300</Text>
              <View style={styles.marketCardTrend}>
                <Ionicons name="arrow-up" size={14} color="#4CAF50" />
                <Text style={styles.trendUp}>2.4%</Text>
              </View>
            </View>

            <View style={styles.marketCard}>
              <View style={styles.marketCardHeader}>
                <Text style={styles.marketCardTitle}>NASDAQ 100</Text>
                <MaterialCommunityIcons name="chart-line" size={18} color="#E53935" />
              </View>
              <Text style={styles.marketCardValue}>504</Text>
              <View style={styles.marketCardTrend}>
                <Ionicons name="arrow-down" size={14} color="#E53935" />
                <Text style={styles.trendDown}>0.8%</Text>
              </View>
            </View>
          </View>
        </LinearGradient>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>En Çok Tercih Edilen</Text>
            <TouchableOpacity><Text style={styles.seeAllText}>Tümünü Gör</Text></TouchableOpacity>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.preferredStocksScroll}>
            {["THYAO", "GARAN", "ASELS", "TUPRS"].map((stock, index) => (
              <TouchableOpacity key={index} style={styles.stockCard}>
                <View style={styles.stockCardTop}>
                  <Text style={styles.stockSymbol}>{stock}</Text>
                  <Ionicons name="star" size={16} color="#FFD700" />
                </View>
                <Text style={styles.stockName}>
                  {stock === "THYAO" ? "Türk Hava Yolları" :
                   stock === "GARAN" ? "Garanti Bankası" :
                   stock === "ASELS" ? "Aselsan" : "Tüpraş"}
                </Text>
                <View style={styles.stockPriceContainer}>
                  <Text style={styles.stockPrice}>{(Math.random() * 1000).toFixed(2)} ₺</Text>
                  <View style={[styles.percentChange, index % 2 === 0 ? styles.percentUp : styles.percentDown]}>
                    <Ionicons name={index % 2 === 0 ? "arrow-up" : "arrow-down"} size={12} color="white" />
                    <Text style={styles.percentText}>{(Math.random() * 5).toFixed(2)}%</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <TouchableOpacity style={styles.refreshButton}>
            <Ionicons name="refresh" size={14} color="white" style={styles.refreshIcon} />
            <Text style={styles.refreshText}>Yenile</Text>
          </TouchableOpacity>
        </View>

        {/* Watchlists */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Takip Listeleri</Text>
            <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
              <Ionicons name="add" size={18} color="white" />
              <Text style={styles.addText}>Yeni Liste</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.watchlistGrid}>
            {loading ? <ActivityIndicator size="small" /> : watchlists.map((list, index) => (
              <TouchableOpacity key={index} style={styles.watchlistCard} onPress={() => openWatchlist(list.id)}>
                <View style={styles.watchlistIconContainer}>
                  <FontAwesome5 name="list" size={20} color="#3498db" />
                </View>
                <View style={styles.watchlistInfo}>
                  <Text style={styles.watchlistName}>{list.name}</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#95a5a6" />
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Modal */}
      <Modal transparent visible={modalVisible} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text>Liste Adı:</Text>
            <TextInput
              value={newListName}
              onChangeText={setNewListName}
              style={styles.modalInput}
            />
            <View style={styles.modalActions}>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Text>İptal</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={createWatchlist}>
                <Text>Oluştur</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Footer */}
      {/* <View style={styles.footer}>
        <TouchableOpacity style={styles.footerTab}>
          <Ionicons name="home" size={22} color="#3498db" />
          <Text style={[styles.footerText, styles.activeTab]}>Ana Sayfa</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.footerTab} onPress={handleSettingsPress2}>
          <Ionicons name="wallet-outline" size={22} color="#95a5a6" />
          <Text style={styles.footerText}>Enflasyon</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.footerMainButton}>
          <Ionicons name="trending-up" size={26} color="white" />
          <Text style={styles.footerText}>Risk</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.footerTab} onPress={handleSettingsPress1}>
          <Ionicons name="bar-chart-outline" size={22} color="#95a5a6" />
          <Text style={styles.footerText}>market</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.footerTab} onPress={handleSettingsPress}>
          <Ionicons name="settings-outline" size={22} color="#95a5a6" />
          <Text style={styles.footerText}>Ayarlar</Text>
        </TouchableOpacity>
      </View> */}
    </SafeAreaView>
  );
};

export default HomeScreen;