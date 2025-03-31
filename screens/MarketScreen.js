import React, { useState } from 'react';
import {
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  Text,
  View,
  ScrollView,

} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import styles from "../styles/MarketScreenStyle";

class MarketScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchQuery: '',
      favorites: {},
      favoriteStocks: [],
      stockData: [
        { name: 'Apple Inc.', price: 120, prevPrice: 115 },
        { name: 'Tesla Inc.', price: 150, prevPrice: 145 },
        { name: 'Amazon.com Inc.', price: 90, prevPrice: 95 },
        { name: 'Microsoft Corporation', price: 200, prevPrice: 210 },
        { name: 'NVIDIA Corporation', price: 50, prevPrice: 55 },
        { name: 'Netflix Inc.', price: 75, prevPrice: 72 },
        { name: 'Alphabet Inc. (Google)', price: 180, prevPrice: 175 },
        { name: 'Meta Platforms Inc. (Facebook)', price: 320, prevPrice: 310 },
        { name: 'Berkshire Hathaway Inc.', price: 3200, prevPrice: 3100 },
        { name: 'Johnson & Johnson', price: 160, prevPrice: 155 },
        { name: 'Procter & Gamble Co.', price: 135, prevPrice: 130 },
        { name: 'Coca-Cola Company', price: 55, prevPrice: 52 },
        { name: 'Walmart Inc.', price: 135, prevPrice: 130 },
        { name: 'Visa Inc.', price: 240, prevPrice: 245 },
        { name: 'Pfizer Inc.', price: 40, prevPrice: 42 },
        { name: 'The Walt Disney Company', price: 115, prevPrice: 110 },
        { name: 'Intel Corporation', price: 45, prevPrice: 47 },
        { name: 'Exxon Mobil Corporation', price: 80, prevPrice: 85 },
        { name: 'Chevron Corporation', price: 160, prevPrice: 165 },
        { name: 'General Electric Company', price: 90, prevPrice: 92 },
        { name: 'IBM Corporation', price: 145, prevPrice: 140 },
      ],
    };
  }



  handleFavoriteToggle = (stockName) => {
    this.setState(
      (prevState) => {
        const updatedFavorites = {
          ...prevState.favorites,
          [stockName]: !prevState.favorites[stockName],
        };

        const updatedFavoriteStocks = updatedFavorites[stockName]
          ? [...prevState.favoriteStocks, stockName]
          : prevState.favoriteStocks.filter((name) => name !== stockName);

        return {
          favorites: updatedFavorites,
          favoriteStocks: updatedFavoriteStocks,
        };
      },
      () => {
        // You can add a callback here if you need to do something after the state is updated
        // For example:
        // console.log("Updated favorites:", this.state.favoriteStocks);
      }
    );
  };

  calculatePercentageChange = (price, prevPrice) => {
    return (((price - prevPrice) / prevPrice) * 100).toFixed(2);
  };

  render() {
    const { searchQuery, stockData, favorites, favoriteStocks } = this.state;
    const filteredStockData = stockData.filter((stock) =>
      stock.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
      <ScrollView style={styles.marketContainer}>
        <Text style={styles.header}>Stock List</Text>

        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search stocks"
            value={searchQuery}
            onChangeText={(text) => this.setState({ searchQuery: text })}
          />
          <FontAwesome
            name="search"
            size={20}
            color="#162e99"
            style={styles.searchIcon}
          />
        </View>

        {filteredStockData.map((stock, index) => (
          <View key={index} style={styles.stockCard}>
            <Text style={styles.stockName}>{stock.name}</Text>
            <Text style={styles.stockPrice}>Price: ${stock.price}</Text>
            <Text
              style={[
                styles.stockChange,
                {
                  color:
                    stock.price > stock.prevPrice ? '#34c759' : '#ff3b30',
                },
              ]}
            >
              Change: {this.calculatePercentageChange(stock.price, stock.prevPrice)}%
            </Text>
            <TouchableOpacity
              style={styles.favoriteIcon}
              onPress={() => this.handleFavoriteToggle(stock.name)}
            >
              <FontAwesome
                name={favorites[stock.name] ? 'heart' : 'heart-o'}
                size={20}
                color={favorites[stock.name] ? '#ff3b30' : '#8e8e93'}
              />
            </TouchableOpacity>
          </View>
        ))}
        <View style={styles.favoritesContainer}>
          <Text style={styles.favoritesTitle}>My Favorites</Text>
          {favoriteStocks.length > 0 ? (
            favoriteStocks.map((stockName) => (
              <Text key={stockName} style={styles.favoriteStockName}>
                {stockName}
              </Text>
            ))
          ) : (
            <Text style={styles.noFavoritesText}>
              No favorites selected.
            </Text>
          )}
        </View>
      </ScrollView>
    );
  }
}



export default MarketScreen;
