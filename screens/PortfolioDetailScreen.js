// screens/PortfolioDetailScreen.js
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import axios from 'axios';
import { useRoute, useNavigation } from '@react-navigation/native';
import { getStockDetails } from '../services/fmpApi';

const PortfolioDetailScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { listId, listName } = route.params;
  const [positions, setPositions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalValue, setTotalValue] = useState(0);
  const [totalProfit, setTotalProfit] = useState(0);

  const fetchPositions = async () => {
    try {
      console.log('⏳ Portföy ID:', listId);
      const res = await axios.get(`http://192.168.1.37:3000/api/watchlists/${listId}/stocks`);
      console.log('📥 Gelen pozisyonlar:', res.data);

      const enrichedPositions = (
        await Promise.all(
          res.data.map(async (item) => {
            if (!item.symbol || !item.quantity || !item.price) {
              console.warn('⚠️ Eksik DB verisi atlandı:', item);
              return null;
            }

            const stockData = await getStockDetails(item.symbol);
            if (!stockData || !stockData.price) {
              console.warn('⚠️ API verisi eksik:', item.symbol);
              return null;
            }

            const marketPrice = parseFloat(stockData.price);
            // const cost = item.quantity * item.price;
            const cost = Number(item.quantity) * Number(item.price);

            const marketValue = item.quantity * marketPrice;
            const profitLoss = marketValue - cost;
            const profitLossPercent = (profitLoss / cost) * 100;

            return {
              ...item,
              companyName: stockData.companyName,
              marketPrice,
              profitLoss,
              profitLossPercent,
              cost,
              marketValue,
            };
          })
        )
      ).filter(Boolean);

      const totalMarketValue = enrichedPositions.reduce((acc, pos) => acc + pos.marketValue, 0);
      const totalProfit = enrichedPositions.reduce((acc, pos) => acc + pos.profitLoss, 0);

      setTotalValue(totalMarketValue);
      setTotalProfit(totalProfit);
      setPositions(enrichedPositions);
    } catch (err) {
      console.error('❌ Pozisyonlar çekilemedi:', err);
      Alert.alert('Hata', 'Pozisyonlar alınamadı.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log('🟡 Açılan Portföy ID:', listId);
    fetchPositions();
  }, []);

  const handleDelete = async (symbol) => {
    try {
      await axios.delete(`http://192.168.1.37:3000/api/watchlists/${listId}/stocks/${symbol}`);
      Alert.alert('Silindi', `${symbol} portföyden silindi.`);
      fetchPositions();
    } catch (err) {
      console.error('Silme hatası:', err);
      Alert.alert('Hata', 'Silinemedi.');
    }
  };

  const handleEdit = (symbol) => {
    navigation.navigate('AddPosition', { listId, symbol, isEdit: true });
  };

  const handleClose = (symbol) => {
    Alert.alert(
      'Pozisyonu Kapat',
      `${symbol} için pozisyonu kapatmak istediğine emin misin?`,
      [
        { text: 'İptal', style: 'cancel' },
        {
          text: 'Evet',
          onPress: () => handleDelete(symbol),
        },
      ]
    );
  };

  const renderItem = ({ item }) => (
    <View style={styles.positionCard}>
      <Text style={styles.symbol}>{item.symbol}</Text>
      <Text style={styles.company}>{item.companyName}</Text>
      {/* <Text>Alım: {item.quantity} @ ₺{item.price.toFixed(2)}</Text> */}
      <Text>Alım: {item.quantity} @ ₺{Number(item.price).toFixed(2)}</Text>

      <Text>Güncel Fiyat: ₺{item.marketPrice.toFixed(2)}</Text>
      <Text style={{ color: item.profitLoss >= 0 ? 'green' : 'red' }}>
        K/Z: ₺{item.profitLoss.toFixed(2)} ({item.profitLossPercent.toFixed(2)}%)
      </Text>
      <View style={styles.actionRow}>
        <TouchableOpacity onPress={() => handleEdit(item.symbol)}>
          <Text style={styles.editText}>Düzenle</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleClose(item.symbol)}>
          <Text style={styles.closeText}>Kapat</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleDelete(item.symbol)}>
          <Text style={styles.deleteText}>Sil</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading) return <ActivityIndicator style={{ flex: 1 }} size="large" />;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{listName} - Portföy</Text>

      <View style={styles.summaryBox}>
        <Text style={styles.summaryText}>Toplam Değer: ₺{totalValue.toFixed(2)}</Text>
        <Text style={[styles.summaryText, { color: totalProfit >= 0 ? 'green' : 'red' }]}>Toplam K/Z: ₺{totalProfit.toFixed(2)}</Text>
      </View>

      {positions.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Bu portföyde pozisyon bulunmamaktadır.</Text>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => navigation.navigate('AddPosition', { listId })}>
            <Text style={styles.addButtonText}>+ Pozisyon Ekle</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={{ flex: 1 }}>
          <FlatList
            data={positions}
            renderItem={renderItem}
            keyExtractor={(item) => item.symbol}
          />
          <TouchableOpacity
            style={[styles.addButton, { marginTop: 12 }]}
            onPress={() => navigation.navigate('AddPosition', { listId })}>
            <Text style={styles.addButtonText}>+ Pozisyon Ekle</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 16 },
  summaryBox: {
    padding: 12,
    backgroundColor: '#eee',
    borderRadius: 8,
    marginBottom: 16,
  },
  summaryText: { fontSize: 16 },
  positionCard: {
    backgroundColor: '#f5f5f5',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  symbol: { fontSize: 18, fontWeight: 'bold' },
  company: { fontSize: 16, marginBottom: 4 },
  emptyContainer: { alignItems: 'center', marginTop: 100 },
  emptyText: { fontSize: 16, marginBottom: 20 },
  addButton: {
    backgroundColor: '#ffa500',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  addButtonText: { color: 'white', fontSize: 16 },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 8,
  },
  editText: { color: 'blue', fontWeight: 'bold' },
  closeText: { color: 'orange', fontWeight: 'bold', marginLeft: 16 },
  deleteText: { color: 'red', fontWeight: 'bold', marginLeft: 16 },
});

export default PortfolioDetailScreen;
