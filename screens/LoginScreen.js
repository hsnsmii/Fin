import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  StyleSheet, 
  TouchableOpacity, 
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
  Keyboard,
  TouchableWithoutFeedback,
  Animated,
  Easing
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LoginScreen({ navigation, route }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  
  // Start animations when component mounts
  useEffect(() => {
    // Check if coming from register screen
    const fromRegister = route?.params?.fromRegister;
    
    // Customize animation based on navigation source
    if (fromRegister) {
      // Coming from register, animate from left
      slideAnim.setValue(-30);
    } else {
      // Normal mount, animate from bottom
      slideAnim.setValue(30);
    }
    
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

  const handleLogin = async () => {
    // Reset error message
    setErrorMessage('');
    
    if (!email || !password) {
      setErrorMessage('Please fill in all fields');
      return;
    }
    
    setIsLoading(true);
    Keyboard.dismiss();
    
    try {
      const response = await fetch('http://192.168.1.37:3000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        console.log('Gelen UserID:', data.userId);
        await AsyncStorage.setItem('token', data.token);
        await AsyncStorage.setItem('userId', data.userId.toString());
        const stored = await AsyncStorage.getItem('userId');
        console.log('Kaydedilen UserID:', stored);
        
        // Başarılı giriş durumunda Alert göstermiyoruz, doğrudan yönlendirme yapıyoruz
        navigation.reset({
          index: 0,
          routes: [{ name: 'Main' }],
        });
      } else {
        // Hata mesajını Alert yerine state'e kaydediyoruz
        setErrorMessage(data.error || 'Login failed');
      }
    } catch (error) {
      console.error(error);
      setErrorMessage('Something went wrong');
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
        <StatusBar barStyle="dark-content" backgroundColor="#f5f7fa" />
        
        <Animated.View 
          style={[
            styles.headerContainer, 
            { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
          ]}
        >
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>Sign in to continue</Text>
        </Animated.View>
        
        <Animated.View 
          style={[
            styles.formContainer, 
            { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
          ]}
        >
          <View style={styles.inputWrapper}>
            <TextInput
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              style={styles.input}
              autoCapitalize="none"
              placeholderTextColor="#a0aec0"
            />
          </View>
          
          <View style={styles.passwordContainer}>
            <TextInput
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!isPasswordVisible}
              style={styles.passwordInput}
              placeholderTextColor="#a0aec0"
            />
            <TouchableOpacity onPress={togglePasswordVisibility} style={styles.eyeButton}>
              <Text style={styles.eyeButtonText}>
                {isPasswordVisible ? 'Hide' : 'Show'}
              </Text>
            </TouchableOpacity>
          </View>
          
          {/* Hata mesajı gösterme alanı */}
          {errorMessage ? (
            <Text style={styles.errorMessage}>{errorMessage}</Text>
          ) : null}
          
          <TouchableOpacity style={styles.forgotPassword}>
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
          </TouchableOpacity>
        </Animated.View>
        
        <Animated.View 
          style={[
            { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
          ]}
        >
          <TouchableOpacity 
            style={styles.loginButton} 
            onPress={handleLogin}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.loginButtonText}>Login</Text>
            )}
          </TouchableOpacity>
        </Animated.View>
        
        <Animated.View 
          style={[
            styles.registerContainer, 
            { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
          ]}
        >
          <Text style={styles.registerText}>Don't have an account? </Text>
          <TouchableOpacity 
            onPress={() => {
              // Animate out before navigating
              Animated.parallel([
                Animated.timing(fadeAnim, {
                  toValue: 0,
                  duration: 300,
                  useNativeDriver: true,
                }),
                Animated.timing(slideAnim, {
                  toValue: 30,
                  duration: 300,
                  useNativeDriver: true,
                })
              ]).start(() => {
                navigation.navigate('Register');
              });
            }}
          >
            <Text style={styles.registerLink}>Register</Text>
          </TouchableOpacity>
        </Animated.View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fa',
    paddingHorizontal: 20,
  },
  
  headerContainer: {
    marginTop: '15%',
    marginBottom: '8%',
  },
  
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2d3748',
    marginBottom: 8,
  },
  
  subtitle: {
    fontSize: 16,
    color: '#718096',
  },
  
  formContainer: {
    width: '100%',
    marginBottom: 20,
  },
  
  inputWrapper: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    height: 48,
    marginBottom: 16,
    shadowColor: '#718096',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  
  input: {
    flex: 1,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#2d3748',
    height: '100%',
  },
  
  passwordContainer: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    height: 48,
    alignItems: 'center',
    marginBottom: 5,
    shadowColor: '#718096',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  
  passwordInput: {
    flex: 1,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#2d3748',
    height: '100%',
  },
  
  eyeButton: {
    paddingHorizontal: 12,
    height: '100%',
    justifyContent: 'center',
  },
  
  eyeButtonText: {
    color: '#4299e1',
    fontSize: 14,
  },
  
  // Hata mesajı stili
  errorMessage: {
    color: '#e53e3e',
    fontSize: 14,
    marginTop: 6,
    marginBottom: 6,
  },
  
  forgotPassword: {
    alignSelf: 'flex-end',
    marginTop: 8,
    marginBottom: 24,
  },
  
  forgotPasswordText: {
    color: '#4299e1',
    fontSize: 14,
  },
  
  loginButton: {
    backgroundColor: '#3182ce',
    borderRadius: 8,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#2b6cb0',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 2,
  },
  
  loginButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  
  registerText: {
    color: '#718096',
    fontSize: 14,
  },
  
  registerLink: {
    color: '#3182ce',
    fontSize: 14,
    fontWeight: '600',
  },
});