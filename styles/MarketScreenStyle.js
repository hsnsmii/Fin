import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  marketContainer: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f0f0f0',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#162e99',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  searchInput: {
    flex: 1,
    padding: 10,
    fontSize: 16,
  },
  searchIcon: {
    marginRight: 10,
    color: '#162e99',
  },
  stockCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  stockName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  stockPrice: {
    fontSize: 16,
    color: '#555',
    marginHorizontal: 15
  },
  stockChange: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  favoriteIcon: {
    padding: 5,
  },
  favoritesContainer: {
    marginTop: 20,
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  favoritesTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#162e99',
  },
  favoriteStockName: {
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
  },
  noFavoritesText: {
    fontSize: 16,
    color: '#888',
  },
});

export default styles;
