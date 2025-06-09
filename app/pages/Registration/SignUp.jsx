import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
  ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFonts } from 'expo-font';
import { Ionicons } from '@expo/vector-icons';
import { authStyles } from '../../../styles/auth/style';
import { signUpWithEmail } from '../../../services/auth';

import { useGoogleAuth } from '../../hooks/useGoogleAuth';

const SignUp = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState({
    facebook: false,
    google: false
  });
  



  const [signInWithGoogle, googleRequest] = useGoogleAuth();

  const [fontsLoaded] = useFonts({
    'Poppins-Regular': require('../../../assets/fonts/Poppins-Regular.ttf'),
    'Poppins-Medium': require('../../../assets/fonts/Poppins-Medium.ttf'),
    'Poppins-SemiBold': require('../../../assets/fonts/Poppins-SemiBold.ttf'),
    'Poppins-Bold': require('../../../assets/fonts/Poppins-Bold.ttf'),
  });

  // Monitor Facebook user state



  const handleGoogleSignUp = async () => {
    try {
      setSocialLoading({ ...socialLoading, google: true });
      const user = await signInWithGoogle();
      if (user) {
        navigation.navigate('MainApp');
      }
    } catch (error) {
      console.error('Google signup error:', error);
      Alert.alert(
        'Authentication Error',
        'Failed to sign in with Google. Please try again.'
      );
    } finally {
      setSocialLoading({ ...socialLoading, google: false });
    }
  };

  const handleEmailSignUp = async () => {
    if (!privacyAccepted) {
      Alert.alert('Error', 'Please accept the privacy policy');
      return;
    }

    if (!name.trim() || !email.trim() || !password.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    try {
      setLoading(true);
      const { user, verificationCode } = await signUpWithEmail(email, password, name);
      
      // Navigate to verification screen
      navigation.navigate('Verification', { 
        email: email,
        userId: user.uid,
        displayCode: verificationCode // This is just for UI display
      });
      
    } catch (error) {
      console.error('Email signup error:', error);
      Alert.alert(
        'Sign Up Error',
        error.message || 'Failed to create account. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaView style={authStyles.container}>
      <Image
        source={require('../../../assets/images/design.png')}
        style={authStyles.backgroundDesign}
        resizeMode="stretch"
      />

      <TouchableOpacity 
        style={authStyles.backButton}
        onPress={() => navigation.goBack()}
        disabled={loading}
      >
        <Ionicons name="arrow-back" size={24} color="white" />
      </TouchableOpacity>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={authStyles.content}>
          <Text style={authStyles.pageTitle}>Create your account</Text>

         

          

          <View style={authStyles.dividerContainer}>
            <View style={authStyles.dividerLine} />
            <Text style={authStyles.dividerText}>OR SIGN UP WITH EMAIL</Text>
            <View style={authStyles.dividerLine} />
          </View>

          <View style={authStyles.inputContainer}>
            <View style={{ marginBottom: 16 }}>
              <TextInput
                placeholder="Full Name"
                value={name}
                onChangeText={setName}
                style={[
                  authStyles.input, 
                  name.length > 0 && authStyles.inputSuccess,
                  loading && { opacity: 0.7 }
                ]}
                placeholderTextColor="#9CA3AF"
                editable={!loading}
              />
              {name.length > 0 && (
                <Ionicons
                  name="checkmark-circle"
                  size={24}
                  color="#34D399"
                  style={authStyles.validationIcon}
                />
              )}
            </View>

            <View style={{ marginBottom: 16 }}>
              <TextInput
                placeholder="Email address"
                value={email}
                onChangeText={setEmail}
                style={[
                  authStyles.input, 
                  email.includes('@') && authStyles.inputSuccess,
                  loading && { opacity: 0.7 }
                ]}
                placeholderTextColor="#9CA3AF"
                keyboardType="email-address"
                autoCapitalize="none"
                editable={!loading}
              />
              {email.includes('@') && (
                <Ionicons
                  name="checkmark-circle"
                  size={24}
                  color="#34D399"
                  style={authStyles.validationIcon}
                />
              )}
            </View>

            <TextInput
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              style={[
                authStyles.input,
                loading && { opacity: 0.7 }
              ]}
              placeholderTextColor="#9CA3AF"
              editable={!loading}
            />
          </View>

          <TouchableOpacity 
            style={authStyles.privacyContainer}
            onPress={() => !loading && setPrivacyAccepted(!privacyAccepted)}
            disabled={loading}
          >
            <View style={[
              authStyles.checkbox,
              privacyAccepted && { backgroundColor: '#1877F2', borderColor: '#1877F2' },
              loading && { opacity: 0.7 }
            ]}>
              {privacyAccepted && (
                <Ionicons name="checkmark" size={16} color="white" />
              )}
            </View>
            <Text style={[
              authStyles.privacyText,
              loading && { opacity: 0.7 }
            ]}>
              I have read the{' '}
              <Text style={authStyles.privacyLink}>Privacy Policy</Text>
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[
              authStyles.primaryButton,
              { opacity: (privacyAccepted && !loading) ? 1 : 0.5 }
            ]}
            onPress={handleEmailSignUp}
            disabled={!privacyAccepted || loading}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={authStyles.primaryButtonText}>GET STARTED</Text>
            )}
          </TouchableOpacity>

          <View style={authStyles.footerContainer}>
            <Text style={authStyles.footerText}>Already have an account?</Text>
            <TouchableOpacity 
              onPress={() => navigation.navigate('Login')}
              disabled={loading}
            >
              <Text style={[
                authStyles.footerLink,
                loading && { opacity: 0.7 }
              ]}>Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignUp;