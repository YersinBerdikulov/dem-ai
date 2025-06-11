// app/screens/auth/Login.jsx
import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  Image,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFonts } from 'expo-font';
import { authStyles } from '../../../styles/auth/styles';
import { signInWithEmail } from '../../../services/auth';


const Login = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState({
    facebook: false,
    google: false
  });

  // Use the Facebook auth hook
 

  // Use the updated Google auth hook

  
  // Use a ref to track if we've already navigated
  const hasNavigated = useRef(false);

  // Monitor Facebook user state
 
  // Monitor Google user state

  // Handle loading state from Google auth - separate useEffect to prevent loops

  const [fontsLoaded] = useFonts({
    'Poppins-Regular': require('../../../assets/fonts/Poppins-Regular.ttf'),
    'Poppins-Medium': require('../../../assets/fonts/Poppins-Medium.ttf'),
    'Poppins-SemiBold': require('../../../assets/fonts/Poppins-SemiBold.ttf'),
    'Poppins-Bold': require('../../../assets/fonts/Poppins-Bold.ttf'),
  });

  // Reset navigation flag when component unmounts
  useEffect(() => {
    return () => {
      hasNavigated.current = false;
    };
  }, []);

  // Handle email login
  const handleEmailLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    try {
      setLoading(true);
      const { user } = await signInWithEmail(email, password);
      if (user) {
        navigation.navigate('MainApp'); // Navigate to the main app after successful login
      }
    } catch (error) {
      console.error('Login error:', error);
      let errorMessage = 'Failed to login. Please try again.';
      
      if (error.message === "EMAIL_NOT_VERIFIED") {
        errorMessage = 'Please verify your email before logging in.';
        navigation.navigate('Verification', { email });
        return;
      }
      
      switch (error.code) {
        case 'auth/invalid-email':
          errorMessage = 'Invalid email address.';
          break;
        case 'auth/user-not-found':
          errorMessage = 'No account found with this email.';
          break;
        case 'auth/wrong-password':
          errorMessage = 'Incorrect password.';
          break;
        case 'auth/too-many-requests':
          errorMessage = 'Too many failed attempts. Please try again later.';
          break;
      }
      
      Alert.alert('Login Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Handle Google login


  // Show loading screen if fonts are not loaded
  if (!fontsLoaded) {
    return <View style={authStyles.container} />;
  }

  return (
    <SafeAreaView style={authStyles.container}>
      <Image
        source={require('../../../assets/images/design.png')}
        style={authStyles.backgroundDesign}
        resizeMode="stretch"
      />

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={authStyles.keyboardView}
      >
        <ScrollView 
          contentContainerStyle={authStyles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header Section */}
          <View style={authStyles.headerSection}>
            <Text style={authStyles.welcomeText}>Welcome Back!</Text>
          </View>

          {/* Form Section - Centered */}
          <View style={authStyles.formSection}>
            <View style={authStyles.dividerContainer}>
              <View style={authStyles.dividerLine} />
              <Text style={authStyles.dividerText}>OR LOG IN WITH EMAIL</Text>
              <View style={authStyles.dividerLine} />
            </View>

            <View style={authStyles.inputContainer}>
              <TextInput
                placeholder="Email address"
                value={email}
                onChangeText={setEmail}
                style={[authStyles.input, loading && { opacity: 0.7 }]}
                placeholderTextColor="rgba(255, 255, 255, 0.6)"
                keyboardType="email-address"
                autoCapitalize="none"
                editable={!loading}
              />

              <TextInput
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                style={[authStyles.input, loading && { opacity: 0.7 }]}
                placeholderTextColor="rgba(255, 255, 255, 0.6)"
                editable={!loading}
              />
            </View>

            <TouchableOpacity 
              style={[
                authStyles.primaryButton,
                loading && { opacity: 0.7 }
              ]}
              onPress={handleEmailLogin}
              disabled={loading || socialLoading.facebook || socialLoading.google}
            >
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={authStyles.primaryButtonText}>LOG IN</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity 
              style={authStyles.linkButton}
              onPress={() => navigation.navigate('ForgotPassword')}
              disabled={loading}
            >
              <Text style={[
                authStyles.linkText,
                loading && { opacity: 0.7 }
              ]}>
                Forgot Password?
              </Text>
            </TouchableOpacity>
          </View>

          {/* Footer Section */}
          <View style={authStyles.footerSection}>
            <View style={authStyles.footerContainer}>
              <Text style={authStyles.footerText}>
                DON'T HAVE AN ACCOUNT?{' '}
              </Text>
              <TouchableOpacity 
                onPress={() => navigation.navigate('SignUp')}
                disabled={loading}
              >
                <Text style={[
                  authStyles.footerLink,
                  loading && { opacity: 0.7 }
                ]}>SIGN UP</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Login;