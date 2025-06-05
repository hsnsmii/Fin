import React, { useState } from 'react';
import { SafeAreaView, Text, TextInput, StyleSheet, TouchableOpacity, View, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useLocalization } from '../../services/LocalizationContext';
import { API_BASE_URL } from '../../services/config';

const ChangePasswordScreen = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const { t } = useLocalization();

  const handleChange = async () => {
    if (!currentPassword || !newPassword) {
      Alert.alert(t('Error'), t('Please fill in all fields.'));
      return;
    }

    try {
      const token = await AsyncStorage.getItem('token');
      const res = await axios.post(
        `${API_BASE_URL}/change-password`,
        { currentPassword, newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.status === 200) {
        Alert.alert(t('Success'), t('Password updated.'));
        setCurrentPassword('');
        setNewPassword('');
      }
    } catch (err) {
      const msg = err?.response?.data?.error || t('Could not update password.');
      Alert.alert(t('Error'), msg);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>{t('Change Password')}</Text>
      <TextInput
        placeholder={t('Current Password')}
        secureTextEntry
        style={styles.input}
        value={currentPassword}
        onChangeText={setCurrentPassword}
      />
      <TextInput
        placeholder={t('New Password')}
        secureTextEntry
        style={styles.input}
        value={newPassword}
        onChangeText={setNewPassword}
      />
      <TouchableOpacity style={styles.button} onPress={handleChange}>
        <Text style={styles.buttonText}>{t('Update')}</Text>
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
