import React, { useState, useRef } from 'react';
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
  Image,
  ImageBackground,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

export default function RegisterScreen({ navigation, route }) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const navigation = useNavigation();
  const [passwordVisible, setPasswordVisible] = useState(false);
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  
  // Start animations when component mounts
  React.useEffect(() => {
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
    // Form validation
    if (!username || !email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }
    
    // Password strength check
    if (password.length < 6) {
      Alert.alert('Error', 'Password should be at least 6 characters');
      return;
    }
    
    setIsLoading(true);
    Keyboard.dismiss();
    
    try {
      const response = await fetch('http://192.168.1.27:3000/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        Alert.alert('Success', 'Registration successful!');
        
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
        Alert.alert('Error', data.error || 'Registration failed');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Something went wrong');
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

        <View style={styles.topSection}>
          <ImageBackground
            source={require('../../assets/homescreenbackground.png')}
            style={styles.topBackground}
            imageStyle={styles.imageStyle}
          >
            <Text style={styles.logoText}></Text>
          </ImageBackground>
        </View>

        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.navigate('LoginScreen')}
        >
          <Ionicons name="arrow-back" size={24} />
        </TouchableOpacity>

        <Animated.View
          style={[
            styles.headerContainer,
            { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
          ]}
        >
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Sign up to get started</Text>
        </Animated.View>

        <Animated.View
          style={[
            styles.formContainer,
            { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
          ]}
        >
          <View style={styles.inputWrapper}>
            <Text style={styles.label}>NAME</Text>
            <TextInput
              placeholder="Full Name"
              value={username}
              onChangeText={setUsername}
              style={styles.input}
              autoCapitalize="words"
              placeholderTextColor="#a0aec0"
            />
          </View>

          <View style={styles.inputWrapper}>
            <Text style={styles.label}>EMAIL</Text>
            <TextInput
              placeholder="Email Address"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              style={styles.input}
              autoCapitalize="none"
              placeholderTextColor="#a0aec0"
            />
          </View>

          <View style={styles.passwordContainer}>
            <Text style={styles.label}>PASSWORD</Text>
            <TextInput
              placeholder="Password"
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
                color="gray"
              />
            </TouchableOpacity>
          </View>
        </Animated.View>

        <Animated.View
          style={[
            { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
          ]}
        >
          <TouchableOpacity
            style={styles.registerButton}
            onPress={handleRegister}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.registerButtonText}>Register</Text>
            )}
          </TouchableOpacity>
        </Animated.View>

        <Animated.View
          style={[
            styles.loginContainer,
            { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
          ]}
        >
          <Text style={styles.loginText}>Already have an account? </Text>
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
                navigation.navigate('LoginScreen');
              });
            }}
          >
            <Text style={styles.loginLink}>Login</Text>
          </TouchableOpacity>
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
    height: '30%',
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
    marginTop: -60, 
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
  backButton: {
  position: 'absolute',
  top: 55, 
  left: 20,
  zIndex: 1,
  color: '#0B0B45',
  fontWeight: 'bold',
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
  
  registerButton: {
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
    marginTop: 10,
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
    marginTop: 20,
  },
  
  loginText: {
    color: '#718096',
    fontSize: 14,
  },
  
  loginLink: {
    color: '#3182ce',
    fontSize: 14,
    fontWeight: '600',
  },

});
