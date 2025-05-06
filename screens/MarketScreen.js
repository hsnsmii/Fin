// MarketScreen.js (Güncellenmiş renderItem için)
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, TextInput, Image } from 'react-native';
import { getSelectedStocks } from '../services/fmpApi';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import styles from '../styles/MarketScreenStyle';
import mockData from '../assets/mockStockData.json';

const MarketScreen = () => {
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);
//mock data kullanmadan
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

  // useEffect(() => {
  //   const fetchStocks = async () => {
  //     try {
  //       const data = await getSelectedStocks();
  
  //       // mockData diziyse doğrudan birleştirebilirsin
  //       const combinedData = [...data, ...mockData]; // tek objeyi diziye çevir
  //       console.log("Yüklenen tüm stock verileri:", stocks);

  
  //       setStocks(combinedData);
  //     } catch (error) {
  //       console.error('Stock fetch error:', error);
  
  //       // sadece mock veriyi göster (API başarısızsa)
  //       setStocks(mockData);
  //       console.log("Yüklenen tüm stock verileri:", stocks);

  //     } finally {
  //       setLoading(false);
  //     }
  //   };
  //   fetchStocks();
  // }, []);
  

  const renderItem = ({ item }) => {
    const price = Number(item.price).toFixed(2);
    const priceColor = item.change > 0 ? styles.priceUp : item.change < 0 ? styles.priceDown : styles.priceNeutral;
    const changeText = item.change > 0 ? `+${item.change}%` : `${item.change}%`;

    return (
      <TouchableOpacity
        style={styles.item}
        onPress={() => navigation.navigate('StockDetail', { symbol: item.symbol })}
        activeOpacity={0.7}
      >
        <Image
          source={{ uri: `https://financialmodelingprep.com/image-stock/${item.symbol}.png` }}
          style={{ width: 40, height: 40, marginRight: 10, borderRadius: 4 }}
          resizeMode="contain"
        />
        <View style={styles.stockInfo}>
          <Text style={styles.symbol}>{item.symbol}</Text>
          <Text style={styles.name} numberOfLines={1} ellipsizeMode="tail">{item.companyName}</Text>
        </View>
        <View style={styles.priceContainer}>
          <Text style={[styles.price, priceColor]}>${price}</Text>
          <Text style={[styles.change, priceColor]}>{changeText}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4F46E5" />
      </View>
    );
  }

  const filteredStocks = stocks.filter(
    (stock) =>
      stock.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      stock.companyName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#6B7280" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Hisse senedi ara..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#9CA3AF"
        />
      </View>
      <FlatList
        data={filteredStocks}
        keyExtractor={(item) => item.symbol}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </View>
  );
};

export default MarketScreen;
