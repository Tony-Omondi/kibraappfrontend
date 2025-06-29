import React, { useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  Image,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { forgotPassword, resetPassword } from '../api/api';

const ForgotPasswordScreen = () => {
  const navigation = useNavigation();
  const [step, setStep] = useState(1); // 1: Enter Email, 2: Enter Code and New Password
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [errors, setErrors] = useState({
    email: false,
    verificationCode: false,
    newPassword: false,
  });

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validatePassword = (password) => {
    return password.length >= 8;
  };

  const handleSendCode = async () => {
    if (!email || !validateEmail(email)) {
      setErrors({ ...errors, email: true });
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    try {
      await forgotPassword({ email });
      Alert.alert('Success', 'Reset code sent to your email!');
      setStep(2);
    } catch (err) {
      console.error(err.response?.data || err.message);
      let errorMessage = 'Failed to send reset code.';
      if (err.response?.data?.error) {
        errorMessage = err.response.data.error;
      }
      Alert.alert('Error', errorMessage);
    }
  };

  const handleResetPassword = async () => {
    let isValid = true;
    const newErrors = { verificationCode: false, newPassword: false };

    if (!verificationCode) {
      newErrors.verificationCode = true;
      Alert.alert('Error', 'Verification code is required');
      isValid = false;
    }

    if (!newPassword || !validatePassword(newPassword)) {
      newErrors.newPassword = true;
      Alert.alert('Error', 'Password must be at least 8 characters');
      isValid = false;
    }

    if (!isValid) {
      setErrors(newErrors);
      return;
    }

    try {
      await resetPassword({ email, verification_code: verificationCode, new_password: newPassword });
      Alert.alert('Success', 'Password reset successfully!');
      navigation.navigate('Login');
    } catch (err) {
      console.error(err.response?.data || err.message);
      let errorMessage = 'Failed to reset password.';
      if (err.response?.data?.error) {
        errorMessage = err.response.data.error;
      }
      Alert.alert('Error', errorMessage);
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/logo.png')}
        style={styles.logo}
        resizeMode="contain"
      />

      {step === 1 ? (
        <>
          <TextInput
            placeholder="Email"
            style={[styles.input, errors.email && styles.inputError]}
            placeholderTextColor="#9bbfaa"
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              setErrors({ ...errors, email: false });
            }}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <TouchableOpacity style={styles.button} onPress={handleSendCode}>
            <Text style={styles.buttonText}>Send Reset Code</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <TextInput
            placeholder="Verification Code"
            style={[styles.input, errors.verificationCode && styles.inputError]}
            placeholderTextColor="#9bbfaa"
            value={verificationCode}
            onChangeText={(text) => {
              setVerificationCode(text);
              setErrors({ ...errors, verificationCode: false });
            }}
          />
          <TextInput
            placeholder="New Password"
            style={[styles.input, errors.newPassword && styles.inputError]}
            placeholderTextColor="#9bbfaa"
            secureTextEntry
            value={newPassword}
            onChangeText={(text) => {
              setNewPassword(text);
              setErrors({ ...errors, newPassword: false });
            }}
          />
          <TouchableOpacity style={styles.button} onPress={handleResetPassword}>
            <Text style={styles.buttonText}>Reset Password</Text>
          </TouchableOpacity>
        </>
      )}

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Login')}
      >
        <Text style={styles.buttonText}>Back to Login</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#141f18',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  logo: {
    width: 160,
    height: 160,
    marginBottom: 24,
  },
  input: {
    width: '100%',
    maxWidth: 480,
    height: 56,
    backgroundColor: '#2a4133',
    color: '#fff',
    borderRadius: 10,
    paddingHorizontal: 16,
    marginBottom: 12,
    fontFamily: 'NotoSans-Regular',
  },
  inputError: {
    borderWidth: 1,
    borderColor: '#ff4d4f',
  },
  button: {
    backgroundColor: '#94e0b2',
    width: '100%',
    maxWidth: 480,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 24,
    marginBottom: 12,
  },
  buttonText: {
    color: '#141f18',
    fontWeight: 'bold',
    fontSize: 16,
    letterSpacing: 0.15,
  },
});

export default ForgotPasswordScreen;