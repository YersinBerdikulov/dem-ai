import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  SafeAreaView,
  Alert,
  ActivityIndicator
} from 'react-native';
import { forgotPasswordStyles as styles } from '../../../styles/auth/forgotPassword';
import { auth } from '../../../config/firebase';
import { confirmPasswordReset } from 'firebase/auth';

const NewPassword = ({ navigation, route }) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Get the oobCode (action code) from route params if available
  const { oobCode } = route.params || {};

  const validatePassword = (password) => {
    // Add your password validation rules here
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (password.length < minLength) {
      return 'Password must be at least 8 characters long';
    }
    if (!hasUpperCase) {
      return 'Password must contain at least one uppercase letter';
    }
    if (!hasLowerCase) {
      return 'Password must contain at least one lowercase letter';
    }
    if (!hasNumbers) {
      return 'Password must contain at least one number';
    }
    if (!hasSpecialChar) {
      return 'Password must contain at least one special character';
    }
    return null;
  };

  const handleReset = async () => {
    // Validate inputs
    if (!password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    const passwordError = validatePassword(password);
    if (passwordError) {
      Alert.alert('Error', passwordError);
      return;
    }

    try {
      setLoading(true);

      if (!oobCode) {
        throw new Error('Reset code not found. Please try the reset process again.');
      }

      // Confirm the password reset
      await confirmPasswordReset(auth, oobCode, password);

      Alert.alert(
        'Success',
        'Your password has been reset successfully',
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('Login')
          }
        ]
      );
    } catch (error) {
      console.error('Password reset error:', error);
      let errorMessage = 'Failed to reset password. Please try again.';
      
      switch (error.code) {
        case 'auth/expired-action-code':
          errorMessage = 'The reset link has expired. Please request a new one.';
          break;
        case 'auth/invalid-action-code':
          errorMessage = 'Invalid reset link. Please request a new one.';
          break;
        case 'auth/user-disabled':
          errorMessage = 'This account has been disabled. Please contact support.';
          break;
        case 'auth/user-not-found':
          errorMessage = 'No account found with this email.';
          break;
        case 'auth/weak-password':
          errorMessage = 'Please choose a stronger password.';
          break;
        default:
          errorMessage = error.message;
      }
      
      Alert.alert('Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Image
        source={require('../../../assets/images/design.png')}
        style={styles.vectorImage}
      />
      <View style={styles.content}>
        <Text style={styles.title}>New Password</Text>
        <Text style={styles.subtitle}>Create your new password</Text>

        <TextInput
          style={[styles.input, loading && { opacity: 0.7 }]}
          placeholder="Enter New Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          editable={!loading}
          placeholderTextColor="#9CA3AF"
        />

        <TextInput
          style={[styles.input, loading && { opacity: 0.7 }]}
          placeholder="Confirm Password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          editable={!loading}
          placeholderTextColor="#9CA3AF"
        />

        <TouchableOpacity 
          style={[styles.button, loading && { opacity: 0.7 }]}
          onPress={handleReset}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.buttonText}>RESET PASSWORD</Text>
          )}
        </TouchableOpacity>

        <View style={styles.signUpContainer}>
          <Text style={styles.signUpText}>REMEMBER YOUR PASSWORD?</Text>
          <TouchableOpacity 
            onPress={() => navigation.navigate('Login')}
            disabled={loading}
          >
            <Text style={[styles.signUpLink, loading && { opacity: 0.7 }]}>
              LOG IN
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default NewPassword;