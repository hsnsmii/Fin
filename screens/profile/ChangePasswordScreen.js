import React, { useState } from 'react';
import { SafeAreaView, Text, TextInput, StyleSheet, TouchableOpacity, View, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const ChangePasswordScreen = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const handleChange = async () => {
    if (!currentPassword || !newPassword) {
      Alert.alert('Hata', 'Lütfen tüm alanları doldurun.');
      return;
    }

    try {
      const token = await AsyncStorage.getItem('token');
      const res = await axios.post(
        'http://192.168.1.27:3000/change-password',
        { currentPassword, newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.status === 200) {
        Alert.alert('Başarılı', 'Şifreniz güncellendi.');
        setCurrentPassword('');
        setNewPassword('');
      }
    } catch (err) {
      const msg = err?.response?.data?.error || 'Şifre güncellenemedi.';
      Alert.alert('Hata', msg);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Şifre Değiştir</Text>
      <TextInput
        placeholder="Mevcut Şifre"
        secureTextEntry
        style={styles.input}
        value={currentPassword}
        onChangeText={setCurrentPassword}
      />
      <TextInput
        placeholder="Yeni Şifre"
        secureTextEntry
        style={styles.input}
        value={newPassword}
        onChangeText={setNewPassword}
      />
      <TouchableOpacity style={styles.button} onPress={handleChange}>
        <Text style={styles.buttonText}>Güncelle</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
  },
  button: {
    backgroundColor: '#1e3a8a',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: { color: '#fff', fontWeight: 'bold' },
});

export default ChangePasswordScreen;
