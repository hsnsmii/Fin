// calculateStyle.js
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container1: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f0f0f0',
  },
  header1: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  menuButton1: {
    padding: 10,
  },
  title1: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  notificationButton1: {
    padding: 10,
  },
  buttonContainer1: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  button1: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
  },
  buttonText1: {
    color: 'white',
  },
  stockList1: {
    marginBottom: 20,
  },
  stockItem1: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  stockItemText1: {
    fontSize: 16,
  },
  calculateButton1: {
    backgroundColor: '#28a745',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 20,
  },
  calculateButtonText1: {
    color: 'white',
    fontSize: 18,
  },
  profitInfo1: {
    marginBottom: 20,
  },
  profitInfoText1: {
    fontSize: 16,
    marginBottom: 5,
  },
  infoButton1: {
    padding: 10,
    alignSelf: 'flex-end',
  },
});

export default styles;