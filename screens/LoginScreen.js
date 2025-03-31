import React, { useState } from 'react';
import {
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  Text,
  View,
  Image,
} from 'react-native';
import styles from "../styles/LoginScreenStyle"; // Import the styles
import { useNavigation } from '@react-navigation/native'; // useNavigation'ı import edin

class LoginScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      isPasswordVisible: false,
    };
  }
  

  togglePasswordVisibility = () => {
    this.setState((prevState) => ({
      isPasswordVisible: !prevState.isPasswordVisible,
    }));
  };

  handleLogin = () => {
    const { email, password } = this.state;
    // Giriş işlemleri burada yapılacak
    console.log('Giriş yapılıyor:', email, password);
    // Giriş başarılıysa ana ekrana yönlendirilebilir
    this.props.navigation.navigate('Home'); // HomeScreen'e yönlendir
  };

  render() {
    const { email, password, isPasswordVisible } = this.state;

    return (
      <SafeAreaView style={styles.loginContainer}>
        
        {/* <Image
          source={require('../assets/logo.png')} // Şirket logosu
          style={styles.logo}
        /> */}
        
        <Text style={styles.welcomeText}>Welcome to Tradebase</Text>
        <Text style={styles.tagline}>
          Login to access your account and start trading.
        </Text>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={(text) => this.setState({ email: text })}
            keyboardType="email-address"
          />
          <View style={styles.passwordInputContainer}>
            <TextInput
              style={styles.passwordInput}
              placeholder="Password"
              value={password}
              onChangeText={(text) => this.setState({ password: text })}
              secureTextEntry={!isPasswordVisible}
            />
            <TouchableOpacity
              style={styles.visibilityButton}
              onPress={this.togglePasswordVisibility}
            >
              <Text style={styles.visibilityText}>
                {isPasswordVisible ? 'Hide' : 'Show'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity
          style={styles.loginButton}
          onPress={this.handleLogin}
        >
          <Text style={styles.loginButtonText}>Login</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.forgotPasswordButton}>
          <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
        </TouchableOpacity>

        <View style={styles.signupContainer}>
          <Text style={styles.signupText}>Don't have an account? </Text>
          <TouchableOpacity>
            <Text style={styles.signupButtonText}>Sign Up</Text>
          </TouchableOpacity>
        </View>
        
      </SafeAreaView>
    );
  }
}



export default function(props) {
  const navigation = useNavigation();
  return <LoginScreen {...props} navigation={navigation} />;
}
