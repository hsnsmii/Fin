import React, { useEffect, useState } from 'react';
import { SafeAreaView, Text, StyleSheet, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AccountInfoScreen = () => {
  const [userId, setUserId] = useState('');

  useEffect(() => {
    const loadUserId = async () => {
      const id = await AsyncStorage.getItem('userId');
      setUserId(id || '');
    };
    loadUserId();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Hesap Bilgileri</Text>
      <View style={styles.infoRow}>
        <Text style={styles.label}>Kullanıcı ID:</Text>
        <Text style={styles.value}>{userId}</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  infoRow: { flexDirection: 'row', marginBottom: 10 },
  label: { fontWeight: '600', marginRight: 10 },
  value: { color: '#374151' },
});

export default AccountInfoScreen;
