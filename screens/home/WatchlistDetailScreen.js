import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, Image, TouchableOpacity, Alert } from 'react-native';
import axios from 'axios';
import { Swipeable } from 'react-native-gesture-handler';

const WatchlistDetailScreen = ({ route }) => {
  const { listId } = route.params;
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch stocks for the given listId
  const fetchStocks = async () => {
    try {
      const res = await axios.get(`http://192.168.1.27:3000/api/watchlists/${listId}/stocks`);
      setStocks(res.data);
    } catch (err) {
      console.error('Liste içeriği çekilemedi', err);
    } finally {
      setLoading(false);
    }
  };

  // Delete stock from the list
  const deleteStock = (symbol) => {
    Alert.alert(
      "Hisseyi Sil",
      `Are you sure you want to remove ${symbol} from your watchlist?`,
      [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", onPress: async () => handleDelete(symbol) }
      ]
    );
  };

  // Handle stock deletion
  const handleDelete = async (symbol) => {
    try {
      await axios.delete(`http://192.168.1.27:3000/api/watchlists/${listId}/stocks/${symbol}`);
      setStocks(stocks.filter(stock => stock.symbol !== symbol));  // Remove stock from local state
    } catch (err) {
      console.error("Hisse silinemedi", err);
    }
  };

  useEffect(() => {
    fetchStocks();
  }, []);

  if (loading) return <ActivityIndicator style={{ flex: 1 }} size="large" />;

  // Render each stock with swipe-to-delete
  const renderStockItem = ({ item }) => {
    const rightSwipe = (
      <View style={styles.deleteWrapper}>
        <TouchableOpacity style={styles.deleteButton} onPress={() => deleteStock(item.symbol)}>
          <Text style={styles.deleteButtonText}>Sil</Text>
        </TouchableOpacity>
      </View>
    );

    return (
      <Swipeable renderRightActions={() => rightSwipe}>
        <View style={styles.card}>
          <View style={styles.cardContent}>
            <Image source={{ uri: item.imageUrl }} style={styles.stockImage} />
            <View style={styles.stockInfo}>
              <Text style={styles.stockSymbol}>{item.symbol}</Text>
              <Text style={styles.stockName}>{item.name}</Text>
            </View>
          </View>
        </View>
      </Swipeable>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Listede Yer Alan Hisseler</Text>
      <FlatList
        data={stocks}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderStockItem}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F7F7F7',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  stockImage: {
    width: 60,
    height: 60,
    borderRadius: 10,
    marginRight: 16,
  },
  stockInfo: {
    flex: 1,
  },
  stockSymbol: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  stockName: {
    fontSize: 14,
    color: '#888',
    marginTop: 4,
  },
  deleteWrapper: {
    justifyContent: 'center',
    alignItems: 'flex-start',
    backgroundColor: '#FF5C5C',
    borderRadius: 12,
    marginVertical: 8,
    padding: 12,
    width: 100,
  },
  deleteButton: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FF3B30',
    padding: 8,
    borderRadius: 10,
  },
  deleteButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default WatchlistDetailScreen;
