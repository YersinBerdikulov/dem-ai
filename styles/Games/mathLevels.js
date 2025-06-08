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
  levelTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 28,
    color: '#FFFFFF',
    textAlign: 'center',
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    padding: 8,
    marginLeft: 4,
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 120, // Extra space for the button
  },
  boardContainer: {
    marginTop: 20,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 10,
  },
  boardRow: {
    flexDirection: 'row',
  },
  cell: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 2,
    borderRadius: 4,
    backgroundColor: '#F0F0F0',
  },
  selectedCell: {
    borderWidth: 2,
    borderColor: '#2196F3',
    backgroundColor: '#E3F2FD',
  },
  initialCell: {
    backgroundColor: '#FFF9C4', // Light yellow for initial cells
  },
  operatorCell: {
    backgroundColor: '#FFD54F', // Amber for operators
  },
  questionCell: {
    backgroundColor: '#E1BEE7', // Light purple for question marks
  },
  cellText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 18,
    color: '#333333',
  },
  operatorText: {
    fontFamily: 'Poppins-Bold',
    fontSize: 20,
    color: '#FF6F00',
  },
  questionText: {
    fontFamily: 'Poppins-Bold',
    fontSize: 20,
    color: '#7B1FA2',
  },
  hintText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: '#FFFFFF',
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 8,
    paddingHorizontal: 24,
    backgroundColor: 'rgba(76, 175, 80, 0.2)',
    borderRadius: 10,
    padding: 8,
  },
  numberPad: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: 24,
    width: '100%',
    maxWidth: 320,
  },
  numberButton: {
    width: 60,
    height: 60,
    margin: 8,
    borderRadius: 30,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
  },
  disabledNumberButton: {
    backgroundColor: '#BDBDBD',
    opacity: 0.5,
  },
  numberButtonText: {
    fontFamily: 'Poppins-Bold',
    fontSize: 22,
    color: '#FFFFFF',
  },
  instructionText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: '#FFFFFF',
    textAlign: 'center',
    marginTop: 24,
    marginBottom: 16,
    paddingHorizontal: 20,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 24,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  nextButton: {
    flexDirection: 'row',
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    width: width * 0.7,
  },
  nextButtonEnabled: {
    backgroundColor: '#4CAF50',
  },
  nextButtonDisabled: {
    backgroundColor: '#757575',
  },
  nextButtonText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 18,
    color: '#FFFFFF',
    letterSpacing: 1,
  },
  nextButtonIcon: {
    marginLeft: 12,
  },
});

export default styles;