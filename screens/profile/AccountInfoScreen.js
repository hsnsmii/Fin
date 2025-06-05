import React, { useEffect, useState } from 'react';
import { SafeAreaView, Text, StyleSheet, View, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLocalization } from '../../services/LocalizationContext';

const AccountInfoScreen = () => {
  const [userId, setUserId] = useState('');
  const { language, setLanguage, t } = useLocalization();

  useEffect(() => {
    const loadUserId = async () => {
      const id = await AsyncStorage.getItem('userId');
      setUserId(id || '');
    };
    loadUserId();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>{t('Account Information')}</Text>
      <View style={styles.infoRow}>
        <Text style={styles.label}>{t('User ID:')}</Text>
        <Text style={styles.value}>{userId}</Text>
      </View>
      <View style={styles.languageRow}>
        <Text style={styles.label}>{t('Language')}</Text>
        <View style={styles.langOptions}>
          <TouchableOpacity
            onPress={() => setLanguage('tr')}
            style={[styles.langButton, language === 'tr' && styles.langButtonActive]}
          >
            <Text style={styles.langButtonText}>{t('Turkish')}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setLanguage('en')}
            style={[styles.langButton, language === 'en' && styles.langButtonActive]}
          >
            <Text style={styles.langButtonText}>{t('English')}</Text>
          </TouchableOpacity>
        </View>
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
  languageRow: { marginTop: 20 },
  langOptions: { flexDirection: 'row', marginTop: 10 },
  langButton: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginRight: 10,
  },
  langButtonActive: { backgroundColor: '#1e3a8a' },
  langButtonText: { color: '#000' },
});


export default AccountInfoScreen;
