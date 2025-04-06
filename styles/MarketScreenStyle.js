import { StyleSheet } from 'react-native';

const MarketScreenStyle = StyleSheet.create({
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
});

export default MarketScreenStyle;