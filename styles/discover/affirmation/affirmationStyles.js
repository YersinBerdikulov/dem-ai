import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export const affirmationStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#03174C',
    paddingTop: 40,
    alignItems: 'center',
    justifyContent: 'space-between', // This will push content to the top and bottom
  },
  headerTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 24,
    color: '#FFFFFF',
    marginTop: 10,
    marginBottom: 30,
    textAlign: 'center',
  },
  affirmationContainer: {
    width: width * 0.85,
    height: width * 0.85,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gradientBox: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
    padding: 25,
    justifyContent: 'space-between',
    shadowColor: '#52E5E7',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  affirmationLabel: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    marginBottom: 10,
  },
  affirmationTextContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  navButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
    zIndex: 10,
  },
  affirmationTextWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  affirmationText: {
    fontFamily: 'Poppins-Bold',
    fontSize: 22,
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 30,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  shareButton: {
    width: width * 0.85,
    height: 56,
    backgroundColor: '#0095FF',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#0095FF',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
    marginBottom: 80, // Add space at the bottom for the navigation bar
  },
  shareButtonText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: '#FFFFFF',
  },
});