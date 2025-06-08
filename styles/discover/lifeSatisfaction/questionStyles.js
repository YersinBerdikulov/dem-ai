// styles/discover/lifeSatisfaction/questionStyles.js
import { StyleSheet, Platform } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#051445', // Richer blue that matches screenshot
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    paddingTop: Platform.OS === 'ios' ? 8 : 0,
  },
  headerIcon: {
    marginRight: 8,
    padding: 8,
    borderRadius: 20,
  },
  title: {
    color: 'white',
    fontSize: 20,
    fontFamily: 'Poppins-SemiBold',
    flex: 1,
    letterSpacing: 0.3,
  },
  menuIcon: {
    padding: 8,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 30,
  },
  questionCard: {
    backgroundColor: '#8678FF', // Slightly adjusted purple that matches screenshot
    borderRadius: 18,
    padding: 20,
    marginBottom: 32,
    flexDirection: 'row',
    alignItems: 'flex-start',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 5,
  },
  questionIcon: {
    marginRight: 12,
    marginTop: 2,
  },
  questionText: {
    color: 'white',
    fontSize: 17,
    fontFamily: 'Poppins-Medium',
    flex: 1,
    lineHeight: 26,
    letterSpacing: 0.2,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 16,
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
    marginRight: 12,
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
    marginTop: 'auto',
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