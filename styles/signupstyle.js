import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  signupContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#a7dcd9',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#162e99',
  },
  subtitle: {
    fontSize: 16,
    color: '#333',
    marginBottom: 30,
    textAlign: 'center',
  },
  inputContainer: {
    width: '100%',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    padding: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 10,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  passwordInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    position: 'relative',
  },
  passwordInput: {
    flex: 1,
    padding: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  visibilityButton: {
    position: 'absolute',
    right: 10,
    top: '50%',
    transform: [{ translateY: -12 }],
  },
  visibilityText: {
    color: '#007BFF',
    fontSize: 14,
  },
  signupButton: {
    width: '100%',
    padding: 12,
    backgroundColor: '#162e99',
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 15,
  },
  signupButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loginContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },
  loginText: {
    fontSize: 14,
    color: '#333',
  },
  loginButtonText: {
    color: '#007BFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default styles;
