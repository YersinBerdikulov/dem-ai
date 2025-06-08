import { StyleSheet, Dimensions, Platform } from 'react-native';

const { width } = Dimensions.get('window');

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#061440', // Slightly richer blue
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 32,
    paddingTop: 12,
  },
  headerIcon: {
    marginRight: 8,
    padding: 8,
    width: 40,
  },
  title: {
    color: 'white',
    fontSize: 22,
    fontFamily: 'Poppins-SemiBold',
    flex: 1,
    letterSpacing: 0.3,
  },
  menuIcon: {
    padding: 8,
  },
  questionCard: {
    backgroundColor: '#806BFF', // Slightly adjusted purple
    borderRadius: 20,
    padding: 24,
    marginBottom: 32,
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  questionIcon: {
    marginRight: 16,
    marginTop: 2,
  },
  questionText: {
    color: 'white',
    fontSize: 18,
    fontFamily: 'Poppins-Medium',
    flex: 1,
    lineHeight: 28,
    letterSpacing: 0.2,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 8,
    marginBottom: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.07)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  optionButtonSelected: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  optionCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: 'white',
    marginRight: 16,
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
    backgroundColor: '#061440',
  },
  optionText: {
    color: 'white',
    fontSize: 17,
    fontFamily: 'Poppins-Regular',
    letterSpacing: 0.2,
  },
  optionTextSelected: {
    fontFamily: 'Poppins-Medium',
  },
  nextButton: {
    backgroundColor: '#0063D3', // Richer blue
    borderRadius: 30,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 'auto',
    marginBottom: Platform.OS === 'ios' ? 16 : 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  nextButtonDisabled: {
    opacity: 0.5,
  },
  nextButtonText: {
    color: 'white',
    fontSize: 18,
    fontFamily: 'Poppins-Medium',
    marginRight: 12,
    letterSpacing: 0.5,
  },
  progressIndicator: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 24,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    marginHorizontal: 4,
  },
  progressDotActive: {
    backgroundColor: 'white',
    width: 24,
  }
});