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
  Easing,
  ImageBackground,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

export default function LoginScreen({ navigation, route }) {
  //const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);

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
      const response = await fetch('http://192.168.1.27:3000/login', {
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
          styles.topSection,
          { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
        ]}
      >
        <ImageBackground
          source={require('../../assets/homescreenbackground.png')}
          style={styles.topBackground}
          imageStyle={styles.imageStyle}
        >
          <Text style={styles.logoText}></Text>
        </ImageBackground>
      </Animated.View>

      <Animated.View
        style={[
          styles.card,
          { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
        ]}
      >
        <Text style={styles.title}>Login</Text>
        <Text style={styles.subtitle}>Welcome back! Please login.</Text>

        <View style={styles.inputWrapper}>
          <Text style={styles.label}>EMAIL</Text>
          <TextInput
            style={styles.input}
            placeholder="Email Address"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            placeholderTextColor="#a0aec0"
          />
        </View>

        <View style={styles.inputWrapper}>
          <Text style={styles.label}>PASSWORD</Text>
          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordInput}
              placeholder="Password"
              secureTextEntry={!isPasswordVisible}
              value={password}
              onChangeText={setPassword}
              placeholderTextColor="#a0aec0"
            />
            <TouchableOpacity onPress={togglePasswordVisibility} style={styles.eyeButton}>
              <Text style={styles.eyeButtonText}>
                {isPasswordVisible ? 'Hide' : 'Show'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {errorMessage ? (
          <Text style={styles.errorMessage}>{errorMessage}</Text>
        ) : null}

        <TouchableOpacity style={styles.forgotPassword}>
          <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
        </TouchableOpacity>

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

        <View style={styles.registerContainer}>
          <Text style={styles.footerText}>Don't have an account? </Text>
          <TouchableOpacity
            onPress={() => {
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
            <Text style={styles.registerLink}>Signup!</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </SafeAreaView>
  </TouchableWithoutFeedback>
);

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  topSection: {
    height: '35%',
    overflow: 'hidden',
   // borderBottomRightRadius: 80,
   // borderBottomLeftRadius: 80,
  },
  topBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
   card: {
    flex: 1,
    backgroundColor: '#fff',
    marginTop: -50, 
    borderTopRightRadius: 80,
    borderTopLeftRadius: 80,
    padding: 30,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: -2 },
    shadowRadius: 10,
    elevation: 10,
  },
  imageStyle: {
    resizeMode: 'cover',
    paddingTop: 0,
    width: '120%',
    height: '100%',
    
  },
  logoText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#0B0B45',
    letterSpacing: 2,

  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#0B0B45',
    marginBottom: 5,
    textAlign: 'center',
  },
  subtitle: {
    color: 'gray',
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    fontSize: 12,
    color: 'gray',
    marginTop: 10,
    marginBottom: 5,
  },
  input: {
    height: 45,
    backgroundColor: '#F0F0F0',
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 16,
  },
  passwordContainer: {
    position: 'relative',
  },
  eyeIcon: {
    position: 'absolute',
    right: 10,
    top: 12,
  },
  button: {
    backgroundColor: '#0B0B45',
    borderRadius: 10,
    paddingVertical: 12,
    marginTop: 25,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  footerText: {
    textAlign: 'center',
    color: '#0B0B45',
    marginTop: 20,
  },
  headerContainer: {
    marginTop: '15%',
    marginBottom: '8%',
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
