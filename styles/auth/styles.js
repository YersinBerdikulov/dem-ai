// app/styles/auth/styles.js
import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export const authStyles = StyleSheet.create({
  // Container and Layout
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
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
  },
  
  // Layout Sections
  headerSection: {
    flex: 0.25,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: height * 0.08,
  },
  formSection: {
    flex: 0.6,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  footerSection: {
    flex: 0.15,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 40,
  },

  // Headers and Text
  welcomeText: {
    fontFamily: 'Poppins-Bold',
    fontSize: 32,
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 20,
  },
  pageTitle: {
    fontFamily: 'Poppins-Bold',
    fontSize: 32,
    color: '#FFFFFF',
    marginBottom: 32,
    textAlign: 'center',
  },

  // Divider
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
    width: '100%',
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
    letterSpacing: 1,
  },

  // Input Container and Fields
  inputContainer: {
    width: '100%',
    marginBottom: 20,
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 25,
    paddingHorizontal: 24,
    paddingVertical: 18,
    marginBottom: 16,
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    color: '#FFFFFF',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    width: '100%',
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

  // Buttons
  primaryButton: {
    backgroundColor: '#007AFF',
    borderRadius: 25,
    paddingVertical: 18,
    alignItems: 'center',
    width: '100%',
    marginTop: 20,
    shadowColor: '#007AFF',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    letterSpacing: 1,
  },
  linkButton: {
    alignItems: 'center',
    marginTop: 24,
  },
  linkText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
  },

  // Social Buttons
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 25,
    paddingVertical: 16,
    marginBottom: 16,
    width: '100%',
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

  // Footer
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    letterSpacing: 0.5,
  },
  footerLink: {
    color: '#007AFF',
    fontFamily: 'Poppins-SemiBold',
    fontSize: 14,
    letterSpacing: 0.5,
  },

  // Privacy Policy
  privacyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    width: '100%',
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
    flex: 1,
  },
  privacyLink: {
    color: '#007AFF',
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
});