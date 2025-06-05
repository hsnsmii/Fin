import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const translations = {
  en: {
    'Account Information': 'Account Information',
    'User ID:': 'User ID:',
    'Change Password': 'Change Password',
    'Current Password': 'Current Password',
    'New Password': 'New Password',
    Update: 'Update',
    Error: 'Error',
    'Please fill in all fields.': 'Please fill in all fields.',
    Success: 'Success',
    'Password updated.': 'Password updated.',
    'Could not update password.': 'Could not update password.',
    'Login failed': 'Login failed',
    'Something went wrong': 'Something went wrong',
    Login: 'Login',
    'Welcome back! Please login.': 'Welcome back! Please login.',
    PASSWORD: 'PASSWORD',
    Password: 'Password',
    'Forgot Password?': 'Forgot Password?',
    "Don't have an account? ": "Don't have an account? ",
    Signup: 'Signup!',
    Email: 'EMAIL',
    'Email Address': 'Email Address',
    NAME: 'NAME',
    'Full Name': 'Full Name',
    'Create Account': 'Create Account',
    'Sign up to get started': 'Sign up to get started',
    Register: 'Register',
    'Already have an account? ': 'Already have an account? ',
    'Please enter a valid email address': 'Please enter a valid email address',
    'Password should be at least 6 characters': 'Password should be at least 6 characters',
    'Registration successful!': 'Registration successful!',
    'Registration failed': 'Registration failed',
    Home: 'Home',
    Market: 'Market',
    Risk: 'Risk',
    Assets: 'Assets',
    FAQ: 'FAQ',
    'Change Language': 'Change Language',
    Language: 'Language',
    Turkish: 'Turkish',
    English: 'English',
    'Logout': 'Logout',
    'Top Gainers': 'Top Gainers',
    'My Watchlists': 'My Watchlists',
    'New List': 'New List',
    'No watchlists yet': 'No watchlists yet',
    'Market News': 'Market News',
    'Create New List': 'Create New List',
    'Enter list name': 'Enter list name',
    Cancel: 'Cancel',
    Create: 'Create',
    'My Assets': 'My Assets',
    "You don't have any portfolios yet.": "You don't have any portfolios yet.",
    'You can create a new portfolio using the button below.':
      'You can create a new portfolio using the button below.',
    'Create New Portfolio': 'Create New Portfolio',
    'Portfolio Name (e.g., My Stocks)': 'Portfolio Name (e.g., My Stocks)',
  },
  tr: {
    'Account Information': 'Hesap Bilgileri',
    'User ID:': 'Kullan\u0131c\u0131 ID:',
    'Change Password': '\u015eifre De\u011fi\u015ftir',
    'Current Password': 'Mevcut \u015eifre',
    'New Password': 'Yeni \u015eifre',
    Update: 'G\u00fcncelle',
    Error: 'Hata',
    'Please fill in all fields.': 'L\u00fctfen t\u00fcm alanlar\u0131 doldurun.',
    Success: 'Ba\u015far\u0131l\u0131',
    'Password updated.': '\u015eifreniz g\u00fcncellendi.',
    'Could not update password.': '\u015eifre g\u00fcncellenemedi.',
    'Login failed': 'Giri\u015f ba\u015far\u0131s\u0131z',
    'Something went wrong': 'Bir hata olu\u015ftu',
    Login: 'Giri\u015f',
    'Welcome back! Please login.': 'Tekrar ho\u015f geldiniz! L\u00fctfen giri\u015f yap\u0131n.',
    PASSWORD: 'PAROLA',
    Password: 'Parola',
    'Forgot Password?': '\u015eifremi Unuttum?',
    "Don't have an account? ": 'Hesab\u0131n\u0131z yok mu? ',
    Signup: 'Kaydol!',
    Email: 'E-POSTA',
    'Email Address': 'E-posta Adresi',
    NAME: '\u0130S\u0130M',
    'Full Name': 'Ad Soyad',
    'Create Account': 'Hesap Olu\u015ftur',
    'Sign up to get started': 'Ba\u015flamak i\u00e7in kaydolun',
    Register: 'Kaydol',
    'Already have an account? ': 'Zaten bir hesab\u0131n\u0131z var m\u0131? ',
    'Please enter a valid email address': 'Ge\u00e7erli bir e-posta girin',
    'Password should be at least 6 characters': 'Parola en az 6 karakter olmal\u0131',
    'Registration successful!': 'Kay\u0131t ba\u015far\u0131l\u0131!',
    'Registration failed': 'Kay\u0131t ba\u015far\u0131s\u0131z',
    Home: 'Ana Sayfa',
    Market: 'Piyasa',
    Risk: 'Risk',
    Assets: 'Varl\u0131klar',
    FAQ: 'SSS',
    'Change Language': 'Dili De\u011fi\u015ftir',
    Language: 'Dil',
    Turkish: 'T\u00fcrk\u00e7e',
    English: '\u0130ngilizce',
    'Logout': '\u00c7\u0131k\u0131\u015f Yap',
    'Top Gainers': 'Y\u00fckselen Hisseler',
    'My Watchlists': 'Takip Listelerim',
    'New List': 'Yeni Liste',
    'No watchlists yet': 'Hen\u00fcz takip listesi yok',
    'Market News': 'Pazar Haberleri',
    'Create New List': 'Yeni Liste Olu\u015ftur',
    'Enter list name': 'Liste ad\u0131 girin',
    Cancel: '\u0130ptal',
    Create: 'Olu\u015ftur',
    'My Assets': 'Varl\u0131klar\u0131m',
    "You don't have any portfolios yet.": 'Hen\u00fcz bir portf\u00f6y\u00fcn\u00fcz yok.',
    'You can create a new portfolio using the button below.':
      'A\u015fa\u011fadaki butondan yeni bir portf\u00f6y olu\u015fturabilirsiniz.',
    'Create New Portfolio': 'Yeni Portf\u00f6y Olu\u015ftur',
    'Portfolio Name (e.g., My Stocks)':
      'Portf\u00f6y Ad\u0131 (\u00f6rn: Hisse Senetlerim)',
  },
};

const LocalizationContext = createContext({
  language: 'en',
  setLanguage: () => {},
  t: (key) => key,
});

export const LocalizationProvider = ({ children }) => {
  const [language, setLanguageState] = useState('en');

  useEffect(() => {
    const loadLang = async () => {
      const stored = await AsyncStorage.getItem('language');
      if (stored) setLanguageState(stored);
    };
    loadLang();
  }, []);

  const setLanguage = async (lang) => {
    setLanguageState(lang);
    await AsyncStorage.setItem('language', lang);
  };

  const t = (key) => translations[language][key] || key;

  return (
    <LocalizationContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LocalizationContext.Provider>
  );
};

export const useLocalization = () => useContext(LocalizationContext);
