import { StyleSheet } from 'react-native';

export const verificationStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#03174C',
  },
  backgroundDesign: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    resizeMode: 'cover',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 120,
    alignItems: 'center',
  },
  title: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 24,
    color: 'white',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: '#8B9CB9',
    marginBottom: 40,
    textAlign: 'center',
  },
  messageContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 20,
    width: '100%',
    marginBottom: 32,
  },
  messageText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: 'white',
    textAlign: 'center',
    lineHeight: 22,
  },
  emailHighlight: {
    fontFamily: 'Poppins-Medium',
    color: '#0F91F3',
  },
  resendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 32,
  },
  resendText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: '#8B9CB9',
  },
  resendLink: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 12,
    color: '#0F91F3',
    marginLeft: 4,
  },
  button: {
    width: '100%',
    height: 50,
    backgroundColor: '#0F91F3',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },
  buttonText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 14,
    color: 'white',
    textTransform: 'uppercase',
  },
  footer: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  footerText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: '#8B9CB9',
  },
  footerLink: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 12,
    color: '#0F91F3',
    marginLeft: 4,
    textTransform: 'uppercase',
  },
});