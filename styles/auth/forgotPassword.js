import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export const forgotPasswordStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#03174C',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  vectorImage: {
    width: width,
    height: width * 0.4,
    resizeMode: 'cover',
    marginBottom: 40,
  },
  title: {
    fontSize: 24,
    color: '#FFFFFF',
    fontFamily: 'Poppins-SemiBold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.6)',
    fontFamily: 'Poppins-Regular',
    marginBottom: 24,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#1877F2',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
  },
  linkButton: {
    alignItems: 'center',
    marginTop: 16,
  },
  linkText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
  },
  signUpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 'auto',
    marginBottom: 40,
  },
  signUpText: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
  },
  signUpLink: {
    color: '#1877F2',
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    marginLeft: 4,
  },
  // Verification specific styles
  codeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  codeInput: {
    backgroundColor: '#FFFFFF',
    width: width * 0.15,
    height: width * 0.15,
    borderRadius: 12,
    textAlign: 'center',
    fontSize: 24,
    fontFamily: 'Poppins-SemiBold',
  },
  resendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
  },
  resendText: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
  },
  resendLink: {
    color: '#1877F2',
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    marginLeft: 4,
  },
});