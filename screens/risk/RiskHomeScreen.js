import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, TouchableOpacity, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { API_BASE_URL } from '../../services/config';

const COLORS = {
  background: '#F4F6F8',
  card: '#FFFFFF',
  primaryText: '#2C3E50',
  secondaryText: '#7F8C8D',
  action: '#3498DB',
  separator: '#E0E6ED',
};

const RiskHomeScreen = () => {
  const [lists, setLists] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchLists = async () => {
      try {
        const userId = await AsyncStorage.getItem('userId');
        if (!userId) return;
        const res = await fetch(`${API_BASE_URL}/api/watchlists/${userId}?type=risk`);
        const data = await res.json();
        setLists(data);
      } catch (err) {
        console.error('Risk listeleri çekilemedi', err);
      } finally {
        setLoading(false);
      }
    };
    fetchLists();
  }, []);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.item}
      onPress={() => navigation.navigate('PortfolioRisk', { listId: item.id || item._id })}
    >
      <Text style={styles.itemText}>{item.name}</Text>
      <Ionicons name="chevron-forward" size={20} color={COLORS.secondaryText} />
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color={COLORS.action} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Risk Portföylerim</Text>
      {lists.length === 0 ? (
        <Text style={styles.emptyText}>Henüz oluşturulmuş risk portföyü bulunmuyor.</Text>
      ) : (
        <FlatList
          data={lists}
          keyExtractor={(item) => (item.id || item._id).toString()}
          renderItem={renderItem}
          contentContainerStyle={{ paddingVertical: 10 }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.primaryText,
    marginBottom: 16,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.separator,
    marginBottom: 12,
  },
  itemText: {
    fontSize: 16,
    color: COLORS.primaryText,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: COLORS.secondaryText,
    textAlign: 'center',
    marginTop: 40,
  },
});

export default RiskHomeScreen;
