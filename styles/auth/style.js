// app/styles/auth/styles.js
import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export const authStyles = StyleSheet.create({
  // Common styles
  container: {
    flex: 1,
    backgroundColor: '#03174C',
  },
  backgroundDesign: {
    position: 'absolute',
    width: width,
    height: height * 0.4,
    top: 0,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: height * 0.08,
  },
  // Social Buttons
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 30,
    paddingVertical: 16,
    marginBottom: 16,
  },
  facebookButton: {
    backgroundColor: '#1877F2',
  },
  googleButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  socialIcon: {
    width: 24,
    height: 24,
    marginRight: 12,
  },
  buttonText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 14,
  },
  facebookButtonText: {
    color: '#FFFFFF',
  },
  googleButtonText: {
    color: '#303030',
  },
  // Input fields
  inputContainer: {
    marginTop: 24,
    marginBottom: 16,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 24,
    paddingVertical: 16,
    marginBottom: 16,
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
  },
  inputSuccess: {
    borderWidth: 1,
    borderColor: '#34D399',
  },
  validationIcon: {
    position: 'absolute',
    right: 16,
    top: '50%',
    transform: [{ translateY: -12 }],
  },
  // Headers and Text
  pageTitle: {
    fontFamily: 'Poppins-Bold',
    fontSize: 32,
    color: '#FFFFFF',
    marginBottom: 32,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  dividerText: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    marginHorizontal: 16,
  },
  // Buttons
  primaryButton: {
    backgroundColor: '#1877F2',
    borderRadius: 30,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 24,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontFamily: 'Poppins-SemiBold',
    fontSize: 14,
  },
  // Footer
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 16,
  },
  footerText: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
  },
  footerLink: {
    color: '#1877F2',
    fontFamily: 'Poppins-Bold',
    fontSize: 12,
    marginLeft: 4,
  },
  // Privacy Policy
  privacyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    marginRight: 12,
  },
  privacyText: {
    color: '#6B7280',
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
  },
  privacyLink: {
    color: '#1877F2',
    fontFamily: 'Poppins-Medium',
    fontSize: 12,
  },
  // Back button
  backButton: {
    position: 'absolute',
    top: 48,
    left: 24,
    zIndex: 1,
  },
  linkText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: '#FFFFFF', // Changed to white
    marginTop:16
  },
  welcomeText:{
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: '#FFFFFF', // Changed to white
    marginBottom:16
  }
});