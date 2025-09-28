import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import RoleDropdown from '../components/RoleDropdown';
import Toast from 'react-native-toast-message';

// Env import - ensure your babel config supports this plugin properly.
import { API_BASE_URL } from '@env';

// Navigation types
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../App';

type SignUpScreenProps = NativeStackScreenProps<AuthStackParamList, 'SignUp'>;

const SignUpScreen = ({ navigation }: SignUpScreenProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('Choose either Engineer or Manager');
  const [agreeToPrivacy, setAgreeToPrivacy] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSignUp = async () => {
    // Validation
    if (!email.trim()) {
      Toast.show({ type: 'error', text1: 'Email is required' });
      return;
    }
    if (!password) {
      Toast.show({ type: 'error', text1: 'Password is required' });
      return;
    }
    if (password !== confirmPassword) {
      Toast.show({ type: 'error', text1: 'Passwords do not match' });
      return;
    }
    if (role === 'Choose either Engineer or Manager') {
      Toast.show({ type: 'error', text1: 'Please select a role' });
      return;
    }
    if (!agreeToPrivacy) {
      Toast.show({
        type: 'error',
        text1: 'You must agree with privacy policy',
      });
      return;
    }

    setLoading(true);

    try {
      // Request signup without Authorization token since it's generated after signup
      const response = await fetch(`http://192.168.10.142:5000/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: email.split('@')[0],
          email,
          password,
          confirmPassword,
          role,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle errors meaningfully
        if (data.message?.toLowerCase().includes('email already exists')) {
          Toast.show({
            type: 'error',
            text1: 'Email already exists',
            text2: 'Please use another email',
          });
        } else {
          Toast.show({
            type: 'error',
            text1: 'Sign Up Failed',
            text2: data.message || 'Please try again',
          });
        }
        setLoading(false);
        return;
      }

      // Success toast
      Toast.show({
        type: 'success',
        text1: 'Registration Successful',
        text2: 'You have registered successfully!',
      });
      setLoading(false);
      navigation.navigate('SignIn');

    } catch (error) {
      console.error('Sign Up error:', error);
      Toast.show({
        type: 'error',
        text1: 'Network error',
        text2: 'Please check your connection',
      });
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f0f5ff" />

      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <Text style={styles.loginTitle}>Create Account</Text>
      </View>

      <Text style={styles.welcomeBack}>Sign up to continue</Text>
      <Text style={styles.label}>Email Address</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter email address"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
          textContentType="emailAddress"
        />
      </View>

      <Text style={styles.label}>Password</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Create Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword}
          textContentType="password"
        />
        <TouchableOpacity
          onPress={() => setShowPassword(!showPassword)}
          style={styles.eyeButton}
        >
          <Icon
            name={showPassword ? 'eye' : 'eye-off'}
            size={22}
            color="#0D2C54"
          />
        </TouchableOpacity>
      </View>

      <Text style={styles.label}>Confirm Password</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Re-enter Password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry={!showConfirmPassword}
          textContentType="password"
        />
        <TouchableOpacity
          onPress={() => setShowConfirmPassword(!showConfirmPassword)}
          style={styles.eyeButton}
        >
          <Icon
            name={showConfirmPassword ? 'eye' : 'eye-off'}
            size={22}
            color="#0D2C54"
          />
        </TouchableOpacity>
      </View>

      <Text style={styles.label}>Role Selection</Text>
      <RoleDropdown selectedRole={role} onRoleSelect={setRole} />

      <View style={styles.checkboxContainer}>
        <TouchableOpacity
          style={styles.checkbox}
          onPress={() => setAgreeToPrivacy(!agreeToPrivacy)}
        >
          {agreeToPrivacy && <View style={styles.checkboxChecked} />}
        </TouchableOpacity>
        <Text style={styles.checkboxLabel}>I agree with privacy policy</Text>
      </View>

      <TouchableOpacity
        style={[styles.loginButton, loading && { opacity: 0.6 }]}
        disabled={loading}
        onPress={handleSignUp}
      >
        <Text style={styles.loginButtonText}>
          {loading ? 'Signing Up...' : 'Sign Up'}
        </Text>
      </TouchableOpacity>

      <View style={styles.signUpLinkContainer}>
        <Text style={styles.signUpText}>Already have an account? </Text>
        <TouchableOpacity onPress={() => navigation.navigate('SignIn')}>
          <Text style={styles.signUpLink}>Login</Text>
        </TouchableOpacity>
      </View>

      <Toast />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f5ff',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  header: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 20,
  },
  backButton: { paddingRight: 15 },
  backArrow: { fontSize: 24, color: '#0D2C54', fontWeight: 'bold' },
  loginTitle: { fontSize: 22, fontWeight: 'bold', color: '#0D2C54' },
  welcomeBack: {
    width: '100%',
    fontSize: 16,
    color: '#555',
    marginBottom: 30,
    paddingLeft: 5,
  },
  label: {
    width: '100%',
    textAlign: 'left',
    fontSize: 16,
    fontWeight: '600',
    color: '#0D2C54',
    marginBottom: 8,
    paddingLeft: 5,
  },
  inputContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    marginBottom: 20,
    paddingHorizontal: 15,
    height: 55,
    elevation: 3,
  },
  input: { flex: 1, fontSize: 16, color: '#333', height: '100%' },
  checkboxContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
    paddingLeft: 5,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#0D2C54',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  checkboxChecked: { width: 12, height: 12, borderRadius: 2, backgroundColor: '#0D2C54' },
  checkboxLabel: { fontSize: 14, color: '#555' },
  loginButton: {
    backgroundColor: '#0D2C54',
    paddingVertical: 16,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
    marginBottom: 30,
    elevation: 5,
  },
  loginButtonText: { color: '#FFFFFF', fontSize: 18, fontWeight: '600' },
  signUpLinkContainer: { flexDirection: 'row', marginTop: 'auto', marginBottom: 20 },
  signUpText: { fontSize: 14, color: '#555' },
  signUpLink: { fontSize: 14, color: '#0D2C54', fontWeight: 'bold' },
  eyeButton: {
    position: 'absolute',
    right: 15,
    top: 10,
    padding: 5,
  },
});

export default SignUpScreen;
