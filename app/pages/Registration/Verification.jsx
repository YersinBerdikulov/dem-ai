import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  SafeAreaView,
  Alert,
  ActivityIndicator,
  Linking,
  Dimensions
} from 'react-native';
import { useFonts } from 'expo-font';
import { verificationStyles } from '../../../styles/auth/veritification';
import { resendVerificationEmail, checkEmailVerificationStatus } from '../../../services/auth';
import { auth } from '../../../config/firebase';

const Verification = ({ navigation, route }) => {
  const { email, userId } = route.params;
  const [loading, setLoading] = useState(false);
  const [verificationChecking, setVerificationChecking] = useState(false);
  const { width, height } = Dimensions.get('window');

  const [fontsLoaded] = useFonts({
    'Poppins-Regular': require('../../../assets/fonts/Poppins-Regular.ttf'),
    'Poppins-Medium': require('../../../assets/fonts/Poppins-Medium.ttf'),
    'Poppins-SemiBold': require('../../../assets/fonts/Poppins-SemiBold.ttf'),
    'Poppins-Bold': require('../../../assets/fonts/Poppins-Bold.ttf'),
  });

  // Check verification status periodically
  useEffect(() => {
    const checkVerification = async () => {
      try {
        setVerificationChecking(true);
        const isVerified = await checkEmailVerificationStatus(userId);
        
        if (isVerified) {
          Alert.alert(
            'Success',
            'Your email has been verified successfully!',
            [
              {
                text: 'Continue',
                onPress: () => navigation.navigate('MainApp')
              }
            ]
          );
        }
      } catch (error) {
        console.error('Verification check error:', error);
      } finally {
        setVerificationChecking(false);
      }
    };
    
    // Check when the component mounts
    checkVerification();
    
    // Set up a listener for incoming links
    const handleDeepLink = async (event) => {
      const url = event.url;
      
      if (url.includes('mode=verifyEmail')) {
        // Extract the oobCode from the URL
        const oobCode = url.match(/oobCode=([^&]+)/)?.[1];
        
        if (oobCode) {
          try {
            setLoading(true);
            // You can use verifyEmailWithLink here, but we'll just trigger a refresh instead
            await checkEmailVerificationStatus(userId);
            
            Alert.alert(
              'Success',
              'Your email has been verified successfully!',
              [
                {
                  text: 'Continue',
                  onPress: () => navigation.navigate('MainApp')
                }
              ]
            );
          } catch (error) {
            console.error('Link verification error:', error);
            Alert.alert('Error', 'There was a problem verifying your email. Please try again.');
          } finally {
            setLoading(false);
          }
        }
      }
    };
    
    // Add event listener for deep linking
    Linking.addEventListener('url', handleDeepLink);
    
    // Set up periodic checks
    const intervalId = setInterval(checkVerification, 10000); // Every 10 seconds
    
    return () => {
      // Clean up interval on unmount
      clearInterval(intervalId);
      
      // Remove event listener
      Linking.removeEventListener('url', handleDeepLink);
    };
  }, [userId, navigation]);
  
  const handleResend = async () => {
    try {
      setLoading(true);
      await resendVerificationEmail();
      
      Alert.alert(
        'Email Sent',
        'A new verification email has been sent. Please check your inbox and click the verification link.'
      );
    } catch (error) {
      console.error('Resend error:', error);
      Alert.alert('Error', error.message || 'Failed to resend verification email');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenEmailApp = () => {
    Linking.openURL('mailto:');
  };
  
  const handleCheckStatus = async () => {
    try {
      setLoading(true);
      const isVerified = await checkEmailVerificationStatus(userId);
      
      if (isVerified) {
        Alert.alert(
          'Success',
          'Your email has been verified successfully!',
          [
            {
              text: 'Continue',
              onPress: () => navigation.navigate('MainApp')
            }
          ]
        );
      } else {
        Alert.alert(
          'Not Verified', 
          'Your email has not been verified yet. Please check your inbox and click the verification link.',
          [
            {
              text: 'Open Email App',
              onPress: handleOpenEmailApp
            },
            {
              text: 'OK',
              style: 'cancel'
            }
          ]
        );
      }
    } catch (error) {
      console.error('Verification check error:', error);
      Alert.alert('Error', error.message || 'Failed to check verification status');
    } finally {
      setLoading(false);
    }
  };

  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaView style={verificationStyles.container}>
      <Image
        source={require('../../../assets/images/design.png')}
        style={[verificationStyles.backgroundDesign, { height: height * 0.4 }]}
      />
      
      <View style={verificationStyles.content}>
        <Text style={verificationStyles.title}>Verification</Text>
        <Text style={verificationStyles.subtitle}>Email Verification Required</Text>
        
        <View style={verificationStyles.messageContainer}>
          <Text style={verificationStyles.messageText}>
            We've sent a verification link to {'\n'}
            <Text style={verificationStyles.emailHighlight}>{email}</Text>{'\n\n'}
            Please check your inbox and click the verification link to activate your account.
          </Text>
        </View>
        
        <View style={verificationStyles.resendContainer}>
          <Text style={verificationStyles.resendText}>
            If you didn't receive the email,
          </Text>
          <TouchableOpacity 
            onPress={handleResend}
            disabled={loading || verificationChecking}
          >
            <Text style={[
              verificationStyles.resendLink,
              (loading || verificationChecking) && { opacity: 0.7 }
            ]}>
              Resend
            </Text>
          </TouchableOpacity>
        </View>
        
        <TouchableOpacity 
          style={[
            verificationStyles.button,
            (loading || verificationChecking) && { opacity: 0.7 }
          ]}
          onPress={handleOpenEmailApp}
          disabled={loading || verificationChecking}
        >
          {loading || verificationChecking ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={verificationStyles.buttonText}>Open Email App</Text>
          )}
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[
            verificationStyles.button,
            { backgroundColor: 'rgba(255, 255, 255, 0.2)' },
            (loading || verificationChecking) && { opacity: 0.7 }
          ]}
          onPress={handleCheckStatus}
          disabled={loading || verificationChecking}
        >
          <Text style={verificationStyles.buttonText}>Check Verification Status</Text>
        </TouchableOpacity>
        
        <View style={verificationStyles.footer}>
          <Text style={verificationStyles.footerText}>
            Already have an account?
          </Text>
          <TouchableOpacity 
            onPress={() => navigation.navigate('Login')}
            disabled={loading}
          >
            <Text style={[
              verificationStyles.footerLink,
              loading && { opacity: 0.7 }
            ]}>
              Sign up
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Verification;