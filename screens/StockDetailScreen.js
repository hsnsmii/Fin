// StockDetailScreen.js 
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity, Modal, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getStockDetails, getStockHistory } from '../services/fmpApi';
import { LineChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';

const screenWidth = Dimensions.get('window').width;

const StockDetailScreen = ({ route }) => {
  const { symbol } = route.params;
  const [stock, setStock] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [watchlists, setWatchlists] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const detail = await getStockDetails(symbol);
        const historical = await getStockHistory(symbol);
        setStock(detail);
        setHistory(historical);
      } catch (error) {
        console.error('Stock detail error:', error);
      } finally {
        setLoading(false);
      }
    };

    const fetchWatchlists = async () => {
      const userId = await AsyncStorage.getItem('userId');
      try {
        const response = await fetch(`http://192.168.1.26:3000/api/watchlists/${userId}`);
        const data = await response.json();
        setWatchlists(data);
      } catch (err) {
        console.error('Liste alma hatasi:', err);
      }
    };

    fetchDetail();
    fetchWatchlists();
  }, [symbol]);

  const handleAddToWatchlist = async (listId) => {
    try {
      const response = await fetch(`http://192.168.1.26:3000/api/watchlists/${listId}/stocks`, {
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
      // Favoriler listesini otomatik oluştur
      const response = await fetch(`http://192.168.1.26:3000/api/watchlists`, {
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

  if (loading || !stock) return <ActivityIndicator size="large" style={{ flex: 1 }} />;

  const chartLabels = history.map(h => h.date).slice().reverse().map(date => date.slice(5));
  const chartPrices = history.map(h => h.close).slice().reverse();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.symbol}>{stock.symbol} - {stock.companyName}</Text>
      <Text style={styles.price}>${Number(stock.price).toFixed(2)}</Text>
      <Text style={styles.change}>Sektör: {stock.sector}</Text>
      <Text style={styles.desc}>{stock.description}</Text>

      <TouchableOpacity style={styles.addButton} onPress={handleAddWithFallback}>
        <Text style={styles.addText}>+ Takip Listesine Ekle</Text>
      </TouchableOpacity>

      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text>Liste seç:</Text>
            {watchlists.map(list => (
              <TouchableOpacity key={list.id} onPress={() => handleAddToWatchlist(list.id)}>
                <Text style={styles.modalItem}>{list.name}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Text style={{ color: 'red', marginTop: 10 }}>Kapat</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Text style={styles.chartTitle}>Son 7 Gün Fiyat Grafiği</Text>
      <LineChart
        data={{ labels: chartLabels, datasets: [{ data: chartPrices }] }}
        width={screenWidth - 32}
        height={240}
        yAxisLabel="$"
        fromZero
        chartConfig={{
          backgroundColor: '#fff',
          backgroundGradientFrom: '#f5f5f5',
          backgroundGradientTo: '#fff',
          decimalPlaces: 2,
          color: (opacity = 1) => `rgba(0, 0, 200, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          propsForLabels: { fontSize: 10 },
          propsForDots: { r: '3', strokeWidth: '2', stroke: '#1e90ff' },
        }}
        bezier
        style={{ marginVertical: 20, borderRadius: 12 }}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 16 },
  symbol: { fontSize: 20, fontWeight: 'bold' },
  price: { fontSize: 28, fontWeight: 'bold', color: '#2ecc71' },
  change: { fontSize: 16, marginBottom: 8 },
  desc: { fontSize: 14, color: '#444', marginVertical: 10 },
  chartTitle: { fontSize: 18, fontWeight: 'bold', marginTop: 16 },
  addButton: { backgroundColor: '#2980b9', padding: 10, borderRadius: 8, alignItems: 'center', marginTop: 10 },
  addText: { color: 'white', fontWeight: 'bold' },
  modalContainer: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { backgroundColor: 'white', padding: 20, borderRadius: 10 },
  modalItem: { fontSize: 16, paddingVertical: 8 }
});

export default StockDetailScreen;