// screens/WatchlistDetailScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import axios from 'axios';

const WatchlistDetailScreen = ({ route }) => {
  const { listId } = route.params;
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchStocks = async () => {
    try {
      const res = await axios.get(`http://192.168.1.26:3000/api/watchlists/${listId}/stocks`);
      setStocks(res.data);
    } catch (err) {
      console.error('Liste içeriği çekilemedi', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStocks();
  }, []);

  if (loading) return <ActivityIndicator style={{ flex: 1 }} size="large" />;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Listede Yer Alan Hisseler</Text>
      <FlatList
        data={stocks}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => <Text style={styles.stockItem}>{item.symbol}</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 12 },
  stockItem: { padding: 8, fontSize: 16, borderBottomWidth: 1, borderBottomColor: '#ddd' },
});

export default WatchlistDetailScreen;
