import React, { useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  Image,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { login, googleLogin } from '../api/api';
import { GOOGLE_CLIENT_ID } from '../utils/constants';
import { GoogleSignin, GoogleSigninButton } from '@react-native-google-signin/google-signin';

GoogleSignin.configure({
  webClientId: GOOGLE_CLIENT_ID,
});

const LoginScreen = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const res = await login(username, password);
      await AsyncStorage.setItem('access_token', res.data.access);
      await AsyncStorage.setItem('refresh_token', res.data.refresh);
      await AsyncStorage.setItem('user_id', res.data.user.id.toString());
      Alert.alert('Success', 'You are now logged in!');
    } catch (err) {
      console.error('Login Error:', err.response?.data || err.message);
      Alert.alert('Login Failed', 'Please check your credentials.');
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      const res = await googleLogin(userInfo.idToken);
      await AsyncStorage.setItem('access_token', res.data.access);
      await AsyncStorage.setItem('refresh_token', res.data.refresh);
      await AsyncStorage.setItem('user_id', res.data.user.id.toString());
      Alert.alert('Success', 'Logged in with Google!');
    } catch (err) {
      console.error('Google Login Error:', err.response?.data || err.message);
      Alert.alert('Google Login Failed', 'Please try again.');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.select({ ios: 'padding', android: undefined })}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <Image source={require('../assets/logo.png')} style={styles.logo} resizeMode="contain" />

        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Phone Number or Email"
            placeholderTextColor="#9bbfaa"
            style={styles.input}
            onChangeText={setUsername}
            value={username}
            autoCapitalize="none"
          />
          <TextInput
            placeholder="Password"
            placeholderTextColor="#9bbfaa"
            style={styles.input}
            onChangeText={setPassword}
            value={password}
            secureTextEntry
          />
        </View>

        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.forgotPassword}>
          <Text style={styles.forgotText}>Forgot Password?</Text>
        </TouchableOpacity>

        <GoogleSigninButton
          style={styles.googleButton}
          size={GoogleSigninButton.Size.Wide}
          color={GoogleSigninButton.Color.Dark}
          onPress={handleGoogleLogin}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#141f18',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingVertical: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 180,
    height: 180,
    marginBottom: 30,
  },
  inputContainer: {
    width: '100%',
    maxWidth: 480,
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#2a4133',
    borderRadius: 10,
    height: 56,
    marginBottom: 16,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#fff',
    fontFamily: 'NotoSans-Regular',
  },
  loginButton: {
    width: '100%',
    maxWidth: 480,
    height: 48,
    backgroundColor: '#94e0b2',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  buttonText: {
    color: '#141f18',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 0.3,
  },
  forgotPassword: {
    marginBottom: 20,
  },
  forgotText: {
    color: '#9bbfaa',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
  googleButton: {
    width: 192,
    height: 48,
  },
});

export default LoginScreen;
