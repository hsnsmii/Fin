import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  ScrollView,
  Switch,
  Image,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';

const COLORS = {
  background: '#F7F8FA',
  card: '#FFFFFF',
  textPrimary: '#1D232E',
  textSecondary: '#8A94A6',
  primary: '#0052FF',
  lightPrimary: '#E6F0FF',
  border: '#EFF1F3',
  danger: '#FF3B30',
  dangerLight: 'rgba(255, 59, 48, 0.1)', 
};

const LanguageSelector = ({ language, onSelectLanguage }) => (
  <View style={styles.langContainer}>
    <TouchableOpacity onPress={() => onSelectLanguage('tr')} style={[styles.langButton, language === 'tr' && styles.langButtonActive]}>
      <Text style={[styles.langText, language === 'tr' && styles.langTextActive]}>TR</Text>
    </TouchableOpacity>
    <TouchableOpacity onPress={() => onSelectLanguage('en')} style={[styles.langButton, language === 'en' && styles.langButtonActive]}>
      <Text style={[styles.langText, language === 'en' && styles.langTextActive]}>EN</Text>
    </TouchableOpacity>
  </View>
);

const SettingsItem = ({ icon, label, rightComponent, isLast = false, onPress }) => (
  <TouchableOpacity onPress={onPress} disabled={!onPress} style={[styles.itemContainer, isLast && styles.lastItem]}>
    <View style={styles.itemLeft}>
      <View style={[styles.iconContainer, { backgroundColor: icon === 'log-out-outline' ? COLORS.dangerLight : COLORS.lightPrimary }]}>
        <Icon name={icon} size={20} color={icon === 'log-out-outline' ? COLORS.danger : COLORS.primary} />
      </View>
      <Text style={[styles.itemLabel, icon === 'log-out-outline' && { color: COLORS.danger, fontWeight: '600' }]}>{label}</Text>
    </View>
    {rightComponent && <View style={styles.itemRight}>{rightComponent}</View>}
  </TouchableOpacity>
);

const MenuScreen = () => {
  const navigation = useNavigation();

  const [userId, setUserId] = useState('');
  const [language, setLanguage] = useState('tr');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [userEmail, setUserEmail] = useState('a@b.com'); 
  const [userName, setUserName] = useState('Aksu'); 

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const id = await AsyncStorage.getItem('userId');
        setUserId(id || 'Kullanıcı-12345');
      } catch (error) {
        console.log("Kullanıcı verisi okunurken hata:", error);
        setUserId('Bulunamadı');
      }
    };
    loadUserData();
  }, []);

  const handleLogout = () => {
    Alert.alert(
      'Çıkış Yap',
      'Hesabınızdan çıkış yapmak istediğinizden emin misiniz?',
      [
        { text: 'İptal', style: 'cancel' },
        {
          text: 'Çıkış Yap',
          onPress: async () => {
            try {

              await AsyncStorage.multiRemove(['token', 'userId']);

              navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
            } catch (e) {
              Alert.alert('Hata', 'Çıkış yapılırken bir sorun oluştu.');
            }
          },
          style: 'destructive',
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.profileHeader}>
          <Image source={{ uri:'https://reactnative.dev/img/tiny_logo.png' }} style={styles.avatar} />
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{userName}</Text>
            <Text style={styles.profileEmail}>{userEmail}</Text>
          </View>
        </View>

        {}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Hesap</Text>
          <View style={styles.card}>
            <SettingsItem icon="person-outline" label="Kullanıcı ID" rightComponent={<Text style={styles.valueText}>{userId}</Text>} />
            <SettingsItem icon="mail-outline" label="E-posta" rightComponent={<Text style={styles.valueText}>{userEmail}</Text>} />
            <SettingsItem 
              icon="lock-closed-outline" 
              label="Şifre Değiştir"
              rightComponent={<Icon name="chevron-forward-outline" size={20} color={COLORS.textSecondary} />}
              onPress={() => navigation.navigate('ChangePassword')}
              isLast={true}
            />
          </View>
        </View>

        {}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ayarlar</Text>
          <View style={styles.card}>
            <SettingsItem 
              icon="notifications-outline" 
              label="Bildirimler"
              rightComponent={<Switch value={notificationsEnabled} onValueChange={setNotificationsEnabled} trackColor={{ false: '#767577', true: COLORS.primary }} thumbColor={COLORS.card} />}
            />
            <SettingsItem 
              icon="globe-outline" 
              label="Dil" 
              rightComponent={<LanguageSelector language={language} onSelectLanguage={setLanguage} />} 
              isLast={true} 
            />
          </View>
        </View>

        {}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Destek</Text>
          <View style={styles.card}>
            <SettingsItem 
              icon="help-circle-outline" 
              label="Yardım Merkezi"
              rightComponent={<Icon name="chevron-forward-outline" size={20} color={COLORS.textSecondary} />}
              onPress={() => navigation.navigate('FAQ')}
            />
            <SettingsItem 
              icon= "book-outline" 
              label="Yatırımcı Sözlüğü"
              rightComponent={<Icon name="chevron-forward-outline" size={20} color={COLORS.textSecondary} />}
              onPress={() => navigation.navigate('Glossary')}
              isLast={true}
            />
            <SettingsItem 
              icon="information-circle-outline" 
              label="Hakkımızda"
              rightComponent={<Icon name="chevron-forward-outline" size={20} color={COLORS.textSecondary} />}
              onPress={() => navigation.navigate('About')}
              isLast={true}
            />

          </View>
        </View>

        {}
        <View style={styles.section}>
          <View style={styles.card}>
            <SettingsItem icon="log-out-outline" label="Çıkış Yap" onPress={handleLogout} isLast={true} />
          </View>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  profileHeader: { flexDirection: 'row', alignItems: 'center', paddingVertical: 20, paddingHorizontal: 24, backgroundColor: COLORS.card },
  avatar: { width: 60, height: 60, borderRadius: 30, marginRight: 16 },
  profileInfo: { flex: 1 },
  profileName: { fontSize: 22, fontWeight: 'bold', color: COLORS.textPrimary },
  profileEmail: { fontSize: 15, color: COLORS.textSecondary, marginTop: 4 },

  section: { marginTop: 24, paddingHorizontal: 16 },
  sectionTitle: { fontSize: 13, fontWeight: '600', color: COLORS.textSecondary, marginBottom: 12, paddingHorizontal: 8, textTransform: 'uppercase' },
  card: { backgroundColor: COLORS.card, borderRadius: 12, overflow: 'hidden', shadowColor: '#959DA5', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3, },

  itemContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 16, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  lastItem: { borderBottomWidth: 0 },
  itemLeft: { flexDirection: 'row', alignItems: 'center' },
  iconContainer: { width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center', marginRight: 16 },
  itemLabel: { fontSize: 16, color: COLORS.textPrimary, fontWeight: '500' },
  itemRight: {},
  valueText: { fontSize: 16, color: COLORS.textSecondary, fontWeight: '500' },

  langContainer: { flexDirection: 'row', backgroundColor: COLORS.background, borderRadius: 8, padding: 2 },
  langButton: { paddingVertical: 6, paddingHorizontal: 12, borderRadius: 6 },
  langButtonActive: { backgroundColor: COLORS.primary },
  langText: { fontSize: 14, fontWeight: 'bold', color: COLORS.textSecondary },
  langTextActive: { color: COLORS.card },
});

export default MenuScreen;
