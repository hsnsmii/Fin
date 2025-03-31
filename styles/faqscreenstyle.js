import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
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
    color: '#888',
  },
  questionsContainer: {
    flex: 1,
  },
  questionContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    padding: 0, // Removed padding from here
    margin: 0
  },
  questionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15, // Added padding here
    borderBottomWidth: 1,  // Added border only to the header
    borderBottomColor: '#eee', // Light border color
    },
  questionText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1, // Added flex to question text to take up available space
    marginRight: 10, // Added some margin to separate question and icon
  },
  answerContainer: {
    padding: 15,
    paddingTop: 0, // Removed top padding, so answer is closer to header
  },
  answerText: {
    fontSize: 16,
    color: '#555',
    lineHeight: 24,
  },
  showAllButton: {
    marginTop: 20,
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#007BFF',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  showAllButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default styles;
