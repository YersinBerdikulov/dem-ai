// styles/discover/selfEsteem/questionStyles.js
import { StyleSheet, Platform } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#051445', // Richer blue that matches screenshot
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    marginBottom: 24,
  },
  headerIcon: {
    width: 40,
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    flex: 1,
    color: 'white',
    fontSize: 20,
    fontFamily: 'Poppins-SemiBold',
    textAlign: 'center',
    letterSpacing: 0.3,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 30,
  },
  questionCard: {
    backgroundColor: '#8678FF', // Slightly adjusted purple that matches screenshot
    borderRadius: 18,
    padding: 20,
    marginBottom: 24,
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 5,
  },
  questionIcon: {
    marginRight: 14,
    marginTop: 4,
  },
  questionText: {
    flex: 1,
    color: 'white',
    fontSize: 17,
    fontFamily: 'Poppins-Medium',
    lineHeight: 26,
    letterSpacing: 0.2,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 12,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  optionCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 2,
    borderColor: 'white',
    marginRight: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionCircleSelected: {
    backgroundColor: 'white',
  },
  optionDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#051445',
  },
  optionText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    letterSpacing: 0.2,
  },
  nextButton: {
    backgroundColor: '#007AFF',
    borderRadius: 30,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
    marginBottom: Platform.OS === 'ios' ? 20 : 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  nextButtonDisabled: {
    opacity: 0.5,
  },
  nextButtonText: {
    color: 'white',
    fontSize: 17,
    fontFamily: 'Poppins-Medium',
    marginRight: 10,
    letterSpacing: 0.3,
  },
  // Progress indicator
  progressIndicator: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
    paddingHorizontal: 16,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    marginHorizontal: 3,
  },
  progressDotActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    width: 20,
  }
});