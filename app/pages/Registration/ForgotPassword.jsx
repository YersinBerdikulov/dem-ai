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
import { resetPassword } from '../../../services/auth';

const ForgotPassword = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!email.trim()) {
      Alert.alert('Error', 'Please enter your email address');
      return;
    }

    try {
      setLoading(true);
      await resetPassword(email.trim());
      Alert.alert(
        'Success',
        'Password reset link has been sent to your email.',
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('Login')
          }
        ]
      );
    } catch (error) {
      console.error('Password reset error:', error);
      let errorMessage = 'Failed to send reset link. Please try again.';
      
      switch (error.code) {
        case 'auth/invalid-email':
          errorMessage = 'Invalid email address.';
          break;
        case 'auth/user-not-found':
          errorMessage = 'No account found with this email.';
          break;
        case 'auth/too-many-requests':
          errorMessage = 'Too many attempts. Please try again later.';
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
        <Text style={styles.title}>Forgot Password</Text>
        <Text style={styles.subtitle}>Enter Email Address</Text>

        <TextInput
          style={[styles.input, loading && { opacity: 0.7 }]}
          placeholder="Email address"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          editable={!loading}
          placeholderTextColor="#9CA3AF"
        />

        <TouchableOpacity 
          style={[styles.button, loading && { opacity: 0.7 }]}
          onPress={handleSend}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.buttonText}>SEND</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.linkButton}
          onPress={() => navigation.goBack()}
          disabled={loading}
        >
          <Text style={[styles.linkText, loading && { opacity: 0.7 }]}>
            Back to sign in
          </Text>
        </TouchableOpacity>

        <View style={styles.signUpContainer}>
          <Text style={styles.signUpText}>DON'T HAVE AN ACCOUNT?</Text>
          <TouchableOpacity 
            onPress={() => navigation.navigate('SignUp')}
            disabled={loading}
          >
            <Text style={[styles.signUpLink, loading && { opacity: 0.7 }]}>
              SIGN UP
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default ForgotPassword;