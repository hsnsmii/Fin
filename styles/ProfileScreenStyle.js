import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f6f8',
    padding: 20,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1976d2',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  datePickerText: {
    fontSize: 14,
    color: '#333',
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  calculateButton: {
    backgroundColor: '#28a745',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  calculateButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  assetItem: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 2,
  },
  assetName: {
    fontWeight: '600',
    fontSize: 16,
    color: '#333',
  },
  assetDetail: {
    fontSize: 13,
    color: '#666',
  },
  resultBox: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    elevation: 3,
    marginBottom: 20,
  },
  resultText: {
    fontSize: 15,
    color: '#333',
    marginBottom: 6,
  },
  chartContainer: {
    marginBottom: 20,
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    elevation: 3,
  },
  chartText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
});

export default styles;
