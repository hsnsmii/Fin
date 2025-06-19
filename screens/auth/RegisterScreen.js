import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
  Keyboard,
  TouchableWithoutFeedback,
  Animated,
  Easing,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AnimatedLogoBanner from './AnimatedLogoBanner';
import { useLocalization } from '../../services/LocalizationContext';
import { API_BASE_URL } from '../../services/config';

const LOGO = require('../../assets/Ekran Resmi 2025.png');

export default function RegisterScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const { t } = useLocalization();

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      })
    ]).start();
  }, []);

  const handleRegister = async () => {
    if (!username || !email || !password) {
      Alert.alert(t('Error'), t('Please fill in all fields.'));
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert(t('Error'), t('Please enter a valid email address'));
      return;
    }

    if (password.length < 6) {
      Alert.alert(t('Error'), t('Password should be at least 6 characters'));
      return;
    }

    setIsLoading(true);
    Keyboard.dismiss();

    try {
      const response = await fetch(`${API_BASE_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert(t('Success'), t('Registration successful!'));
        // Animate out before navigating
        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(slideAnim, {
            toValue: -30,
            duration: 300,
            useNativeDriver: true,
          })
        ]).start(() => {
          navigation.navigate('Login', { fromRegister: true });
        });
      } else {
        Alert.alert(t('Error'), data.error || t('Registration failed'));
      }
    } catch (error) {
      Alert.alert(t('Error'), t('Something went wrong'));
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#f6fbfd" />

        {/* Animated Logo Banner */}
        <AnimatedLogoBanner logoSource={LOGO} />

        {/* Back Button */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.navigate('Login')}
        >
          <Ionicons name="arrow-back" size={24} color="#0B0B45" />
        </TouchableOpacity>

        {/* Registration Card */}
        <Animated.View
          style={[
            styles.card,
            { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
          ]}
        >
          <Text style={styles.title}>{t('Create Account')}</Text>
          <Text style={styles.subtitle}>{t('Sign up to get started')}</Text>

          <View style={styles.formContainer}>
            <View style={styles.inputWrapper}>
              <Text style={styles.label}>{t('NAME')}</Text>
              <TextInput
                placeholder={t('Full Name')}
                value={username}
                onChangeText={setUsername}
                style={styles.input}
                autoCapitalize="words"
                placeholderTextColor="#a0aec0"
              />
            </View>

            <View style={styles.inputWrapper}>
              <Text style={styles.label}>{t('Email')}</Text>
              <TextInput
                placeholder={t('Email Address')}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                style={styles.input}
                autoCapitalize="none"
                placeholderTextColor="#a0aec0"
              />
            </View>

            <View style={styles.inputWrapper}>
              <Text style={styles.label}>{t('PASSWORD')}</Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  placeholder={t('Password')}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!isPasswordVisible}
                  style={styles.passwordInput}
                  placeholderTextColor="#a0aec0"
                />
                <TouchableOpacity
                  onPress={togglePasswordVisibility}
                  style={styles.eyeButton}
                >
                  <Ionicons
  name={isPasswordVisible ? 'eye' : 'eye-off'}
  size={22}
  color="#0B0B45"
/>

                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity
              style={styles.registerButton}
              onPress={handleRegister}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.registerButtonText}>{t('Register')}</Text>
              )}
            </TouchableOpacity>

            <View style={styles.loginContainer}>
              <Text style={styles.loginText}>{t('Already have an account? ')}</Text>
              <TouchableOpacity
                onPress={() => {
                  Animated.parallel([
                    Animated.timing(fadeAnim, {
                      toValue: 0,
                      duration: 300,
                      useNativeDriver: true,
                    }),
                    Animated.timing(slideAnim, {
                      toValue: -30,
                      duration: 300,
                      useNativeDriver: true,
                    }),
                  ]).start(() => {
                    navigation.navigate('Login');
                  });
                }}
              >
                <Text style={styles.loginLink}>{t('Login')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  card: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    marginTop: -16,
    borderTopRightRadius: 56,
    borderTopLeftRadius: 56,
    paddingHorizontal: 30,
    paddingTop: 40,
    paddingBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: -2 },
    shadowRadius: 8,
    elevation: 10,
  },
  backButton: {
    position: 'absolute',
    top: 55,
    left: 20,
    zIndex: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1A237E',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    color: '#6B7280',
    fontSize: 16,
    marginBottom: 28,
    textAlign: 'center',
  },
  formContainer: {
    flex: 1,
    width: '100%',
  },
  inputWrapper: {
    marginBottom: 20,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4B5563',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  input: {
    height: 48,
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#1F2937',
    shadowColor: '#6B7280',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 1,
    elevation: 1,
  },
  passwordContainer: {
    flexDirection: 'row',
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    height: 48,
    alignItems: 'center',
  },
  passwordInput: {
    flex: 1,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#1F2937',
    height: '100%',
  },
  eyeButton: {
    paddingHorizontal: 16,
    height: '100%',
    justifyContent: 'center',
  },
  registerButton: {
    backgroundColor: '#1A237E',
    borderRadius: 8,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#1A237E',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.13,
    shadowRadius: 2,
    elevation: 2,
    marginTop: 10,
    marginBottom: 20,
  },
  registerButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 'auto',
    paddingBottom: 18,
  },
  loginText: {
    color: '#6B7280',
    fontSize: 14,
  },
  loginLink: {
    color: '#1A237E',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 3,
  },
});
