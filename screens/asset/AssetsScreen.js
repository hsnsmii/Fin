// screens/AssetsScreen.js
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import PortfolioDetailScreen from './PortfolioDetailScreen';

const AssetsScreen = () => {
  const [portfolios, setPortfolios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [newPortfolioName, setNewPortfolioName] = useState('');
  const navigation = useNavigation();

  const fetchPortfolios = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      const res = await axios.get(`http://192.168.1.27:3000/api/watchlists/${userId}?type=portfolio`);
      setPortfolios(res.data);
    } catch (err) {
      console.error('Portföyler çekilemedi:', err);
    } finally {
      setLoading(false);
    }
  };

  const createPortfolio = async () => {
    try {
      if (!newPortfolioName.trim()) return;
      const userId = await AsyncStorage.getItem('userId');
      await axios.post('http://192.168.1.27:3000/api/watchlists', {
        name: newPortfolioName,
        user_id: userId,
        type: 'portfolio'
      });
      setNewPortfolioName('');
      setModalVisible(false);
      fetchPortfolios();
    } catch (err) {
      console.error('Yeni portföy oluşturulamadı:', err);
    }
  };

  useEffect(() => {
    fetchPortfolios();
  }, []);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.portfolioItem}
      onPress={() => navigation.navigate('PortfolioDetail', { listId: item.id, listName: item.name })}
    >
      <Text style={styles.portfolioName}>{item.name}</Text>
    </TouchableOpacity>
  );

  if (loading) return <ActivityIndicator style={{ flex: 1 }} size="large" color="#000" />;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Varlıklarım</Text>
      <FlatList
        data={portfolios}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        ListFooterComponent={
          <TouchableOpacity style={styles.createButton} onPress={() => setModalVisible(true)}>
            <Text style={styles.createButtonText}>+ Yeni Portföy Oluştur</Text>
          </TouchableOpacity>
        }
      />

      {/* Yeni Liste Modalı */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Yeni Liste Oluştur</Text>
            <TextInput
              placeholder="Yeni Listem"
              style={styles.input}
              value={newPortfolioName}
              onChangeText={setNewPortfolioName}
            />
            <TouchableOpacity style={styles.addButton} onPress={createPortfolio}>
              <Text style={styles.addButtonText}>Oluştur</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Text style={styles.cancelText}>İptal</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
  portfolioItem: {
    padding: 16,
    backgroundColor: '#f2f2f2',
    borderRadius: 8,
    marginBottom: 10,
  },
  portfolioName: { fontSize: 18 },
  createButton: {
    backgroundColor: '#ddd',
    padding: 16,
    alignItems: 'center',
    borderRadius: 6,
    marginTop: 16,
  },
  createButtonText: { fontSize: 16 },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)'
  },
  modalContent: {
    margin: 32,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: { fontSize: 20, marginBottom: 12 },
  input: {
    width: '100%',
    padding: 10,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 6,
    marginBottom: 12,
  },
  addButton: {
    backgroundColor: '#ffa500',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 6,
    marginBottom: 8,
  },
  addButtonText: { color: 'white', fontWeight: 'bold' },
  cancelText: { color: 'red' },
});

export default AssetsScreen;
