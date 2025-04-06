import React from 'react';
import {
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  Text,
  View,
  ScrollView,
  StatusBar,
  Image,
  Animated,
} from 'react-native';
import { Ionicons, FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

class MarketScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchQuery: '',
      favorites: {},
      favoriteStocks: [],
      activeTab: 'all',
      stockData: [
        { name: 'Apple Inc.', symbol: 'AAPL', price: 120, prevPrice: 115, volume: '75.2M', marketCap: '2.3T' },
        { name: 'Tesla Inc.', symbol: 'TSLA', price: 150, prevPrice: 145, volume: '32.5M', marketCap: '551.8B' },
        { name: 'Amazon.com Inc.', symbol: 'AMZN', price: 90, prevPrice: 95, volume: '28.7M', marketCap: '1.2T' },
        { name: 'Microsoft Corporation', symbol: 'MSFT', price: 200, prevPrice: 210, volume: '25.1M', marketCap: '2.1T' },
        { name: 'NVIDIA Corporation', symbol: 'NVDA', price: 50, prevPrice: 55, volume: '43.6M', marketCap: '780.5B' },
        { name: 'Netflix Inc.', symbol: 'NFLX', price: 75, prevPrice: 72, volume: '18.9M', marketCap: '325.7B' },
        { name: 'Alphabet Inc.', symbol: 'GOOGL', price: 180, prevPrice: 175, volume: '22.3M', marketCap: '1.9T' },
        { name: 'Meta Platforms Inc.', symbol: 'META', price: 320, prevPrice: 310, volume: '19.5M', marketCap: '821.4B' },
        { name: 'Berkshire Hathaway Inc.', symbol: 'BRK.B', price: 3200, prevPrice: 3100, volume: '5.2M', marketCap: '782.9B' },
        { name: 'Johnson & Johnson', symbol: 'JNJ', price: 160, prevPrice: 155, volume: '8.7M', marketCap: '421.5B' },
        { name: 'Procter & Gamble Co.', symbol: 'PG', price: 135, prevPrice: 130, volume: '7.1M', marketCap: '318.9B' },
        { name: 'Coca-Cola Company', symbol: 'KO', price: 55, prevPrice: 52, volume: '12.8M', marketCap: '237.6B' },
        { name: 'Walmart Inc.', symbol: 'WMT', price: 135, prevPrice: 130, volume: '9.3M', marketCap: '384.2B' },
        { name: 'Visa Inc.', symbol: 'V', price: 240, prevPrice: 245, volume: '6.9M', marketCap: '495.3B' },
        { name: 'Pfizer Inc.', symbol: 'PFE', price: 40, prevPrice: 42, volume: '17.5M', marketCap: '225.1B' },
        { name: 'The Walt Disney Company', symbol: 'DIS', price: 115, prevPrice: 110, volume: '14.2M', marketCap: '210.8B' },
        { name: 'Intel Corporation', symbol: 'INTC', price: 45, prevPrice: 47, volume: '23.6M', marketCap: '189.4B' },
        { name: 'Exxon Mobil Corporation', symbol: 'XOM', price: 80, prevPrice: 85, volume: '16.4M', marketCap: '345.7B' },
        { name: 'Chevron Corporation', symbol: 'CVX', price: 160, prevPrice: 165, volume: '11.3M', marketCap: '312.9B' },
        { name: 'General Electric Company', symbol: 'GE', price: 90, prevPrice: 92, volume: '8.9M', marketCap: '97.8B' },
        { name: 'IBM Corporation', symbol: 'IBM', price: 145, prevPrice: 140, volume: '5.6M', marketCap: '134.2B' },
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
      }
    );
  };

  calculatePercentageChange = (price, prevPrice) => {
    return (((price - prevPrice) / prevPrice) * 100).toFixed(2);
  };

  setActiveTab = (tab) => {
    this.setState({ activeTab: tab });
  };

  render() {
    const { searchQuery, stockData, favorites, favoriteStocks, activeTab } = this.state;
    
    let displayStockData = stockData;
    
    if (activeTab === 'favorites') {
      displayStockData = stockData.filter((stock) => favorites[stock.name]);
    } else if (searchQuery) {
      displayStockData = stockData.filter((stock) =>
        stock.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        stock.symbol.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" />
        
        {/* Header with gradient */}
        <LinearGradient
          colors={["#2c3e50", "#3498db"]}
          style={styles.header}
        >
          <View style={styles.headerContent}>
            <TouchableOpacity style={styles.backButton}>
              <Ionicons name="chevron-back" size={24} color="white" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Piyasalar</Text>
            <TouchableOpacity style={styles.filterButton}>
              <Ionicons name="options-outline" size={22} color="white" />
            </TouchableOpacity>
          </View>
          
          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <Ionicons name="search" size={20} color="#8e8e93" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Hisse senedi ara..."
              placeholderTextColor="#8e8e93"
              value={searchQuery}
              onChangeText={(text) => this.setState({ searchQuery: text })}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity 
                onPress={() => this.setState({ searchQuery: '' })}
                style={styles.clearButton}
              >
                <Ionicons name="close-circle" size={18} color="#8e8e93" />
              </TouchableOpacity>
            )}
          </View>
        </LinearGradient>
        
        {/* Tab Selector */}
        <View style={styles.tabContainer}>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'all' && styles.activeTab]}
            onPress={() => this.setActiveTab('all')}
          >
            <Text style={[styles.tabText, activeTab === 'all' && styles.activeTabText]}>
              Tüm Hisseler
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'favorites' && styles.activeTab]}
            onPress={() => this.setActiveTab('favorites')}
          >
            <Text style={[styles.tabText, activeTab === 'favorites' && styles.activeTabText]}>
              Favorilerim
            </Text>
            {favoriteStocks.length > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{favoriteStocks.length}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
        
        {/* Column Headers */}
        <View style={styles.columnHeaders}>
          <Text style={[styles.columnHeader, { flex: 2.5 }]}>Hisse Senedi</Text>
          <Text style={[styles.columnHeader, { flex: 1.2, textAlign: 'right' }]}>Fiyat</Text>
          <Text style={[styles.columnHeader, { flex: 1, textAlign: 'right' }]}>Değişim</Text>
          <Text style={[styles.columnHeader, { flex: 0.6 }]}></Text>
        </View>
        
        {/* Stock List */}
        <ScrollView style={styles.stockList}>
          {displayStockData.length > 0 ? (
            displayStockData.map((stock, index) => {
              const percentChange = this.calculatePercentageChange(stock.price, stock.prevPrice);
              const isPositive = stock.price > stock.prevPrice;
              
              return (
                <TouchableOpacity 
                  key={index} 
                  style={[
                    styles.stockCard,
                    index === displayStockData.length - 1 && { marginBottom: 20 }
                  ]}
                  activeOpacity={0.7}
                >
                  <View style={styles.stockInfo}>
                    <Text style={styles.stockSymbol}>{stock.symbol}</Text>
                    <Text style={styles.stockName} numberOfLines={1}>
                      {stock.name}
                    </Text>
                    <View style={styles.stockDetails}>
                      <Text style={styles.stockDetail}>
                        <Text style={styles.detailLabel}>Hacim: </Text>
                        {stock.volume}
                      </Text>
                    </View>
                  </View>
                  
                  <View style={styles.priceContainer}>
                    <Text style={styles.stockPrice}>${stock.price.toFixed(2)}</Text>
                    <Text style={styles.marketCap}>{stock.marketCap}</Text>
                  </View>
                  
                  <View style={styles.changeContainer}>
                    <View style={[
                      styles.changeBox,
                      isPositive ? styles.positiveChange : styles.negativeChange
                    ]}>
                      <Ionicons 
                        name={isPositive ? 'caret-up' : 'caret-down'} 
                        size={12} 
                        color="white" 
                        style={styles.changeIcon}
                      />
                      <Text style={styles.changeText}>
                        {Math.abs(percentChange)}%
                      </Text>
                    </View>
                  </View>
                  
                  <TouchableOpacity 
                    style={styles.favoriteButton}
                    onPress={() => this.handleFavoriteToggle(stock.name)}
                  >
                    <Ionicons
                      name={favorites[stock.name] ? 'heart' : 'heart-outline'}
                      size={22}
                      color={favorites[stock.name] ? '#ff3b30' : '#8e8e93'}
                    />
                  </TouchableOpacity>
                </TouchableOpacity>
              );
            })
          ) : (
            <View style={styles.emptyState}>
              {activeTab === 'favorites' ? (
                <>
                  <Ionicons name="heart" size={60} color="#e0e0e0" />
                  <Text style={styles.emptyStateTitle}>Favori Hisseniz Yok</Text>
                  <Text style={styles.emptyStateText}>
                    Takip etmek istediğiniz hisseleri favorilerinize ekleyin
                  </Text>
                </>
              ) : (
                <>
                  <Ionicons name="search" size={60} color="#e0e0e0" />
                  <Text style={styles.emptyStateTitle}>Sonuç Bulunamadı</Text>
                  <Text style={styles.emptyStateText}>
                    Arama kriterlerinize uygun hisse senedi bulunamadı
                  </Text>
                </>
              )}
            </View>
          )}
        </ScrollView>
        
        {/* Footer */}
        <View style={styles.footer}>
          <TouchableOpacity style={styles.footerTab}>
            <Ionicons name="home-outline" size={22} color="#95a5a6" />
            <Text style={styles.footerText}>Ana Sayfa</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.footerTab}>
            <Ionicons name="wallet-outline" size={22} color="#95a5a6" />
            <Text style={styles.footerText}>Portföyüm</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.footerMainButton}>
            <Ionicons name="trending-up" size={26} color="white" />
          </TouchableOpacity>
          
          <TouchableOpacity style={[styles.footerTab, styles.activeFooterTab]}>
            <Ionicons name="bar-chart" size={22} color="#3498db" />
            <Text style={[styles.footerText, styles.activeFooterText]}>Piyasalar</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.footerTab}>
            <Ionicons name="settings-outline" size={22} color="#95a5a6" />
            <Text style={styles.footerText}>Ayarlar</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }
}

const styles = {
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  
  // Header Styles
  header: {
    paddingTop: 10,
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: 'white',
  },
  filterButton: {
    padding: 5,
  },
  
  // Search Container Styles
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 5,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    color: 'white',
    fontSize: 16,
    padding: 0,
    height: 36,
  },
  clearButton: {
    padding: 4,
  },
  
  // Tab Container Styles
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginTop: 16,
    marginBottom: 12,
  },
  tab: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginRight: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: '#e6f2ff',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#95a5a6',
  },
  activeTabText: {
    color: '#3498db',
    fontWeight: '600',
  },
  badge: {
    backgroundColor: '#ff3b30',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 6,
  },
  badgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '700',
    paddingHorizontal: 4,
  },
  
  // Column Headers
  columnHeaders: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    backgroundColor: 'white',
  },
  columnHeader: {
    fontSize: 13,
    fontWeight: '600',
    color: '#95a5a6',
  },
  
  // Stock List Styles
  stockList: {
    flex: 1,
  },
  stockCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  stockInfo: {
    flex: 2.5,
  },
  stockSymbol: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2c3e50',
  },
  stockName: {
    fontSize: 13,
    color: '#7f8c8d',
    marginTop: 2,
  },
  stockDetails: {
    flexDirection: 'row',
    marginTop: 4,
  },
  stockDetail: {
    fontSize: 12,
    color: '#95a5a6',
  },
  detailLabel: {
    fontWeight: '500',
  },
  priceContainer: {
    flex: 1.2,
    alignItems: 'flex-end',
  },
  stockPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2c3e50',
  },
  marketCap: {
    fontSize: 12,
    color: '#95a5a6',
    marginTop: 2,
  },
  changeContainer: {
    flex: 1,
    alignItems: 'flex-end',
    marginRight: 8,
  },
  changeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    minWidth: 60,
    justifyContent: 'center',
  },
  positiveChange: {
    backgroundColor: '#34c759',
  },
  negativeChange: {
    backgroundColor: '#ff3b30',
  },
  changeIcon: {
    marginRight: 2,
  },
  changeText: {
    color: 'white',
    fontSize: 13,
    fontWeight: '600',
  },
  favoriteButton: {
    flex: 0.6,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
  },
  
  // Empty State Styles
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 32,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2c3e50',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: '#95a5a6',
    textAlign: 'center',
  },
  
  // Footer Styles
  footer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#ecf0f1',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  footerTab: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  activeFooterTab: {
    color: '#3498db',
  },
  footerMainButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#3498db',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -20,
    shadowColor: '#3498db',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  footerText: {
    fontSize: 12,
    marginTop: 3,
    color: '#95a5a6',
  },
  activeFooterText: {
    color: '#3498db',
    fontWeight: '600',
  },
};

export default MarketScreen;