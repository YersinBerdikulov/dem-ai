import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export const styles = StyleSheet.create({
 container: {
    flex: 1,
    backgroundColor: '#03174C',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  backButton: {
    padding: 8,
    borderRadius: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#03174C',
    fontFamily: 'Poppins-Bold',
  },
  progressBarContainer: {
    width: '100%',
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderTopRightRadius: 2,
    borderBottomRightRadius: 2,
  },
  scrollContainer: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 40,
  },
  
  // Loading styles
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    minHeight: 300,
  },
  loadingText: {
    color: '#FFFFFF',
    fontSize: 16,
    marginTop: 20,
    fontFamily: 'Poppins-Medium',
  },
  
  // Intro screen styles
  introContainer: {
    padding: 20,
    alignItems: 'center',
  },
  introTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 16,
    fontFamily: 'Poppins-Bold',
    lineHeight: 36,
  },
  introText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 30,
    fontFamily: 'Poppins-Regular',
  },
  
  // Personality types cards
  personalityTypesContainer: {
    width: '100%',
    marginBottom: 30,
  },
  personalityCard: {
    width: '100%',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  personalityCardContent: {
    flex: 1,
    paddingRight: 15,
  },
  personalityTypeTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#03174C',
    marginBottom: 8,
    fontFamily: 'Poppins-Bold',
  },
  personalityTypeDescription: {
    fontSize: 16,
    color: '#03174C',
    marginBottom: 4,
    opacity: 0.8,
    fontFamily: 'Poppins-Regular',
    lineHeight: 22,
  },
  personalityIcon: {
    width: 40,
    height: 40,
    opacity: 0.9,
  },
  
  // Start button styles
  startButton: {
    width: '100%',
    borderRadius: 30,
    marginTop: 16,
    shadowColor: '#4E66E3',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  startButtonTouchable: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  startButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 10,
    fontFamily: 'Poppins-Bold',
  },
  
  // Previous result styles
  previousResultContainer: {
    width: '100%',
    borderRadius: 16,
    padding: 25,
    marginTop: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  previousResultHeading: {
    fontSize: 18,
    color: '#FFFFFF',
    fontFamily: 'Poppins-SemiBold',
    marginBottom: 12,
  },
  previousResultText: {
    fontSize: 20,
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 20,
    fontFamily: 'Poppins-Medium',
  },
  previousResultType: {
    fontWeight: 'bold',
    fontSize: 22,
    color: '#FFFFFF',
    fontFamily: 'Poppins-Bold',
  },
  
  // Distribution styles
  distributionContainer: {
    width: '100%',
    marginVertical: 20,
  },
  distributionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  distributionLabelContainer: {
    width: 80,
  },
  distributionLabel: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    fontFamily: 'Poppins-Medium',
  },
  distributionBarContainer: {
    flex: 1,
    height: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 5,
    marginHorizontal: 14,
    overflow: 'hidden',
  },
  distributionBar: {
    height: '100%',
    borderRadius: 5,
  },
  introvertBar: {
    backgroundColor: '#A8D8C6',
  },
  extrovertBar: {
    backgroundColor: '#B3E5FC',
  },
  ambivertBar: {
    backgroundColor: '#E1BEE7',
  },
  distributionValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
    width: 40,
    fontFamily: 'Poppins-Bold',
    textAlign: 'right',
  },
  
  // Buttons for previous results
  retakeButton: {
    width: '100%',
    borderRadius: 30,
    backgroundColor: '#4CAF50',
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 16,
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  retakeButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'Poppins-Bold',
  },
  viewResultsButton: {
    width: '100%',
    borderRadius: 30,
    borderWidth: 1,
    borderColor: '#4E66E3',
    backgroundColor: 'transparent',
    paddingVertical: 12,
    alignItems: 'center',
  },
  viewResultsButtonText: {
    color: '#4E66E3',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'Poppins-SemiBold',
  },
  
  // Question screen styles
  questionContainer: {
    padding: 20,
    paddingTop: 16,
  },
  questionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  questionCount: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    fontFamily: 'Poppins-Medium',
  },
  questionProgress: {
    fontSize: 14,
    color: '#4CAF50',
    fontFamily: 'Poppins-Medium',
  },
  questionText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 30,
    lineHeight: 30,
    fontFamily: 'Poppins-Bold',
  },
  optionsContainer: {
    marginBottom: 30,
  },
  optionButton: {
    marginBottom: 14,
    borderRadius: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  optionGradient: {
    borderRadius: 14,
    overflow: 'hidden',
  },
  selectedOptionGradient: {
    shadowColor: '#4E66E3',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  optionCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  selectedOptionCircle: {
    borderColor: '#FFFFFF',
  },
  selectedInnerCircle: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#FFFFFF',
  },
  optionText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    flex: 1,
    fontFamily: 'Poppins-Regular',
  },
  selectedOptionText: {
    color: '#FFFFFF',
    fontFamily: 'Poppins-Medium',
  },
  
  // Next button styles
  nextButtonGradient: {
    borderRadius: 30,
    marginVertical: 20,
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  nextButtonTouchable: {
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    flexDirection: 'row',
  },
  disabledNextButton: {
    opacity: 0.7,
  },
  nextButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 10,
    fontFamily: 'Poppins-Bold',
  },
  
  // Question pills styles
  questionPillsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  questionPill: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    marginHorizontal: 4,
  },
  activeQuestionPill: {
    backgroundColor: '#4CAF50',
    width: 20,
  },
  completedQuestionPill: {
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
}


);