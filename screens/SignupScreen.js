import React, { useState } from 'react';
import {
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  Text,
  View,
} from 'react-native';
import styles from "../styles/signupstyle";// Import the styles


class SignupScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      confirmPassword: '',
      isPasswordVisible: false,
      isConfirmPasswordVisible: false,
    };
  }

  togglePasswordVisibility = () => {
    this.setState((prevState) => ({
      isPasswordVisible: !prevState.isPasswordVisible,
    }));
  };

  toggleConfirmPasswordVisibility = () => {
    this.setState((prevState) => ({
      isConfirmPasswordVisible: !prevState.isConfirmPasswordVisible,
    }));
  };

  handleSignup = () => {
    const { email, password, confirmPassword } = this.state;
    // Kayıt işlemleri burada yapılacak
    console.log('Kaydolunuyor:', email, password, confirmPassword);
    // Kayıt başarılıysa ana ekrana yönlendirilebilir
    // this.props.navigation.navigate('Home');
  };

  render() {
    const {
      email,
      password,
      confirmPassword,
      isPasswordVisible,
      isConfirmPasswordVisible,
    } = this.state;

    return (
      <SafeAreaView style={styles.signupContainer}>
        <Text style={styles.title}>Sign Up for Tradebase</Text>
        <Text style={styles.subtitle}>
          Create an account to start trading.
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
          <View style={styles.passwordInputContainer}>
            <TextInput
              style={styles.passwordInput}
              placeholder="Confirm Password"
              value={confirmPassword}
              onChangeText={(text) => this.setState({ confirmPassword: text })}
              secureTextEntry={!isConfirmPasswordVisible}
            />
            <TouchableOpacity
              style={styles.visibilityButton}
              onPress={this.toggleConfirmPasswordVisibility}
            >
              <Text style={styles.visibilityText}>
                {isConfirmPasswordVisible ? 'Hide' : 'Show'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity
          style={styles.signupButton}
          onPress={this.handleSignup}
        >
          <Text style={styles.signupButtonText}>Sign Up</Text>
        </TouchableOpacity>

        <View style={styles.loginContainer}>
          <Text style={styles.loginText}>Already have an account? </Text>
          <TouchableOpacity>
            <Text style={styles.loginButtonText}>Login</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }
}



export default SignupScreen;
