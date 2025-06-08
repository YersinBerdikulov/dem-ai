// styles/discover/resultStyles.js
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#03174C',
    padding: 16,
  },
  title: {
    color: 'white',
    fontSize: 20,
    fontFamily: 'Poppins-SemiBold',
    marginBottom: 32,
  },
  scoreCircle: {
    width: 200,
    height: 200,
    alignSelf: 'center',
    marginBottom: 24,
  },
  scoreCircleInner: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scoreText: {
    color: 'white',
    fontSize: 32,
    fontFamily: 'Poppins-Bold',
  },
  scoreLabel: {
    color: 'white',
    fontSize: 14,
    fontFamily: 'Poppins',
    opacity: 0.8,
  },
  feedbackCard: {
    backgroundColor: '#8B7FFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  feedbackText: {
    color: 'white',
    fontSize: 18,
    fontFamily: 'Poppins-Medium',
    textAlign: 'center',
    lineHeight: 26,
  },
  insightsCard: {
    backgroundColor: '#8B7FFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    minHeight: 150,
  },
  insightsTitle: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
    marginBottom: 12,
  },
  insightText: {
    color: 'white',
    fontSize: 14,
    fontFamily: 'Poppins',
    lineHeight: 22,
    textAlign: 'left',
  },
  loadingText: {
    color: 'white',
    fontSize: 14,
    fontFamily: 'Poppins',
    marginTop: 12,
    textAlign: 'center',
  },
  disclaimer: {
    color: 'white',
    fontSize: 12,
    fontFamily: 'Poppins',
    textAlign: 'center',
    opacity: 0.7,
    lineHeight: 18,
    marginBottom: 24,
  },
  doneButton: {
    backgroundColor: '#8B7FFF',
    borderRadius: 30,
    padding: 16,
    alignItems: 'center',
  },
  doneButtonText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
  }
});