import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { useAuth } from '../context/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';

// Import navigation types
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../App';

type SignInScreenProps = NativeStackScreenProps<AuthStackParamList, 'SignIn'>;

const LOGIN_TIMESTAMP_KEY = 'loginTimestamp';

const SignInScreen = ({ navigation }: SignInScreenProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [keepLoggedIn, setKeepLoggedIn] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { login, isUserLoggedIn, logout } = useAuth();

  useEffect(() => {
    // Check if user is logged in and login is still valid (within 30 mins)
    const checkLoginValidity = async () => {
      if (isUserLoggedIn) {
        const storedTimestamp = await AsyncStorage.getItem(LOGIN_TIMESTAMP_KEY);
        if (storedTimestamp) {
          const loginTime = parseInt(storedTimestamp, 10);
          const thirtyMinutes = 30 * 60 * 1000;
          const isValid = Date.now() - loginTime < thirtyMinutes;
          if (!isValid) {
            await AsyncStorage.removeItem(LOGIN_TIMESTAMP_KEY);
            logout();
          }
        } else {
          logout();
        }
      }
    };
    checkLoginValidity();
  }, []);

  const handleSignIn = async () => {
    if (email.trim() === '' || password.trim() === '') {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Please enter both email and password',
      });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('http://192.168.10.142:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        const errMsg = errorData.message || 'Login failed. Please try again.';
        Toast.show({
          type: 'error',
          text1: 'Login Failed',
          text2: errMsg,
        });
        setLoading(false);
        return;
      }

      const data = await response.json();

      // Use backend user object if present, fallback to top-level fields
      const userData = data.user
        ? {
            ...data.user,
            token: data.token,
          }
        : {
            name: data.name || '',
            email: data.email || email,
            role: data.role || '',
            token: data.token,
          };

      // Store login timestamp if keepLoggedIn checked
      if (keepLoggedIn) {
        await AsyncStorage.setItem(LOGIN_TIMESTAMP_KEY, Date.now().toString());
      } else {
        await AsyncStorage.removeItem(LOGIN_TIMESTAMP_KEY);
      }

      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Login successful!',
      });

      login(userData, keepLoggedIn);
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Network Error',
        text2: 'Unable to connect to server. Please try again later.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#f0f5ff" />
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Text style={styles.backArrow}>←</Text>
          </TouchableOpacity>
          <Text style={styles.loginTitle}>Login Account</Text>
        </View>

        <Text style={styles.welcomeBack}>Welcome Back!</Text>

        <Text style={styles.label}>Email Address</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Enter your email address"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <Text style={styles.label}>Password</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Enter your password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeButton}>
            <Icon name={showPassword ? 'eye' : 'eye-off'} size={22} color="#0D2C54" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.forgotPasswordButton}>
          <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
        </TouchableOpacity>

        <View style={styles.checkboxContainer}>
          <TouchableOpacity style={styles.checkbox} onPress={() => setKeepLoggedIn(!keepLoggedIn)}>
            {keepLoggedIn && <View style={styles.checkboxChecked} />}
          </TouchableOpacity>
          <Text style={styles.checkboxLabel}>Keep me logged in</Text>
        </View>

        <TouchableOpacity style={styles.loginButton} onPress={handleSignIn} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.loginButtonText}>Login</Text>}
        </TouchableOpacity>

        <View style={styles.signUpLinkContainer}>
          <Text style={styles.signUpText}>Don't have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
            <Text style={styles.signUpLink}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      {/* Toast component must be rendered once in your app (likely at root level, but safe here too) */}
      <Toast />
    </>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f5ff', alignItems: 'center', paddingHorizontal: 24 },
  header: { width: '100%', flexDirection: 'row', alignItems: 'center', marginBottom: 20, marginTop: 20 },
  backButton: { paddingRight: 15 },
  backArrow: { fontSize: 24, color: '#0D2C54', fontWeight: 'bold' },
  loginTitle: { fontSize: 22, fontWeight: 'bold', color: '#0D2C54' },
  welcomeBack: { width: '100%', fontSize: 16, color: '#555', marginBottom: 30, paddingLeft: 5 },
  label: { width: '100%', textAlign: 'left', fontSize: 16, fontWeight: '600', color: '#0D2C54', marginBottom: 8, paddingLeft: 5 },
  inputContainer: { width: '100%', flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', borderRadius: 10, marginBottom: 20, paddingHorizontal: 15, height: 55, elevation: 3 },
  input: { flex: 1, fontSize: 16, color: '#333', height: '100%' },
  eyeButton: { padding: 8 },
  forgotPasswordButton: { width: '100%', alignItems: 'flex-end', marginBottom: 20 },
  forgotPasswordText: { fontSize: 14, color: '#0D2C54', fontWeight: 'bold' },
  checkboxContainer: { width: '100%', flexDirection: 'row', alignItems: 'center', marginBottom: 30 },
  checkbox: { width: 20, height: 20, borderRadius: 4, borderWidth: 2, borderColor: '#0D2C54', justifyContent: 'center', alignItems: 'center', marginRight: 10 },
  checkboxChecked: { width: 12, height: 12, borderRadius: 2, backgroundColor: '#0D2C54' },
  checkboxLabel: { fontSize: 14, color: '#555' },
  loginButton: { backgroundColor: '#0D2C54', paddingVertical: 16, borderRadius: 10, width: '100%', alignItems: 'center', marginBottom: 30, elevation: 5 },
  loginButtonText: { color: '#FFFFFF', fontSize: 18, fontWeight: '600' },
  signUpLinkContainer: { flexDirection: 'row', marginTop: 'auto', marginBottom: 20 },
  signUpText: { fontSize: 14, color: '#555' },
  signUpLink: { fontSize: 14, color: '#0D2C54', fontWeight: 'bold' },
});

export default SignInScreen;
