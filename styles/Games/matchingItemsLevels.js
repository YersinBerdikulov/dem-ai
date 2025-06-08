import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#03174C',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    padding: 8,
  },
  helpButton: {
    padding: 8,
  },
  levelTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 28,
    color: '#FFFFFF',
    textAlign: 'center',
  },
  timeInfoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    paddingHorizontal: 16,
    marginTop: 8,
  },
  timeItem: {
    alignItems: 'center',
    backgroundColor: 'rgba(33, 150, 243, 0.15)',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
    minWidth: 150,
  },
  timeLabel: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: '#BBDEFB',
    marginBottom: 4,
  },
  timeValue: {
    fontFamily: 'Poppins-Bold',
    fontSize: 22,
    color: '#FFFFFF',
  },
  timeWarning: {
    color: '#FF5252', // Red color for warning
  },
  timeSuccess: {
    color: '#4CAF50', // Green color for success
  },
  timerContainer: {
    marginVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timerText: {
    fontFamily: 'Poppins-Bold',
    fontSize: 32,
    color: '#FFFFFF',
  },
  timerTextCompleted: {
    fontFamily: 'Poppins-Bold',
    fontSize: 32,
    color: '#4CAF50', // Green color for completed timer
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 120, // Extra space for the buttons
  },
  cardGrid: {
    marginVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  card: {
    margin: 4,
    borderRadius: 12,
    backgroundColor: '#B3E5FC', // Light blue for card backs
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
    overflow: 'hidden',
  },
  cardFlipped: {
    backgroundColor: '#FFFFFF',
  },
  cardBack: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#B3E5FC',
  },
  cardBackText: {
    fontFamily: 'Poppins-Bold',
    fontSize: 24,
    color: '#0277BD',
  },
  cardImage: {
    width: '80%',
    height: '80%',
  },
  scoreContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 8,
    marginBottom: 16,
  },
  scoreItem: {
    alignItems: 'center',
    backgroundColor: 'rgba(33, 150, 243, 0.15)',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 10,
    minWidth: 100,
  },
  scoreLabel: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: '#BBDEFB',
  },
  scoreValue: {
    fontFamily: 'Poppins-Bold',
    fontSize: 18,
    color: '#FFFFFF',
  },
  controlsContainer: {
    position: 'absolute',
    bottom: 24,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  controlButton: {
    flexDirection: 'column',
    backgroundColor: '#3F51B5', // Indigo
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 100,
  },
  controlButtonText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: '#FFFFFF',
    marginTop: 4,
  },
  nextButton: {
    flexDirection: 'row',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 180,
  },
  nextButtonEnabled: {
    backgroundColor: '#4CAF50', // Green
  },
  nextButtonDisabled: {
    backgroundColor: '#757575', // Gray
  },
  nextButtonText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    color: '#FFFFFF',
    letterSpacing: 1,
  },
  nextButtonIcon: {
    marginLeft: 8,
  },
});

export default styles;