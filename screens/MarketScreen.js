// screens/MarketScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { getSelectedStocks } from '../services/fmpApi';
import { useNavigation } from '@react-navigation/native';

const MarketScreen = () => {
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchStocks = async () => {
      try {
        const data = await getSelectedStocks();
        setStocks(data);
      } catch (error) {
        console.error('Stock fetch error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStocks();
  }, []);

  const renderItem = ({ item }) => {
    const price = Number(item.price).toFixed(2);
    return (
      <TouchableOpacity
        style={styles.item}
        onPress={() => navigation.navigate('StockDetail', { symbol: item.symbol })}
      >
        <View>
          <Text style={styles.symbol}>{item.symbol}</Text>
          <Text style={styles.name}>{item.companyName}</Text>
        </View>
        <Text style={styles.price}>${price}</Text>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return <ActivityIndicator size="large" style={{ flex: 1 }} />;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={stocks}
        keyExtractor={(item) => item.symbol}
        renderItem={renderItem}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  symbol: { fontWeight: 'bold', fontSize: 16 },
  name: { color: '#555', maxWidth: 200 },
  price: { fontSize: 16, color: '#0a0' },
});

export default MarketScreen;