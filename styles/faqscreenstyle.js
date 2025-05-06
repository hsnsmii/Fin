import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  titleContainer: {
    marginBottom: 24,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#7f8c8d',
    textAlign: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 28,
    paddingHorizontal: 15,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 3,
    height: 56,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  searchInput: {
    flex: 1,
    padding: 12,
    fontSize: 16,
    color: '#2c3e50',
  },
  searchIcon: {
    color: '#3498db',
    marginRight: 5,
  },
  categoryChip: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    marginRight: 10,
    backgroundColor: '#f5f7fa',
    minWidth: 100,
    alignItems: 'center',
  },
  categoryChipActive: {
    backgroundColor: '#3498db',
  },
  categoryText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#7f8c8d',
  },
  categoryTextActive: {
    color: '#ffffff',
    fontWeight: '600',
  },
  questionsContainer: {
    flex: 1,
  },
  questionContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  questionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 18,
  },
  questionText: {
    fontSize: 17,
    fontWeight: '600',
    color: '#2c3e50',
    flex: 1,
    marginRight: 12,
    lineHeight: 24,
  },
  questionIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#f1f8fe',
    justifyContent: 'center',
    alignItems: 'center',
  },
  answerContainer: {
    padding: 18,
    paddingTop: 0,
    backgroundColor: '#f9fafb',
    borderTopWidth: 1,
    borderTopColor: '#ecf0f1',
  },
  answerText: {
    fontSize: 16,
    color: '#34495e',
    lineHeight: 24,
  },
  // "Tüm Soruları Göster" butonuna ait stiller kaldırıldı
  noResultsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  noResultsText: {
    fontSize: 18,
    color: '#7f8c8d',
    textAlign: 'center',
  },
  noResultsIcon: {
    marginBottom: 16,
    color: '#bdc3c7',
  }
});

export default styles;