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
  resetButton: {
    padding: 8,
  },
  gameContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    paddingVertical: 20,
  },
  gameBoard: {
    backgroundColor: '#000000',
    borderRadius: 16,
    borderWidth: 4,
    borderColor: '#FFEB3B', // Yellow border
    overflow: 'hidden',
    position: 'relative',
  },
  gridLine: {
    position: 'absolute',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    zIndex: 1,
  },
  dot: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 30, // Make dots appear above connections
  },
  pathSegment: {
    position: 'absolute',
    height: 10,
    borderRadius: 5,
    zIndex: 10,
  },
  buttonContainer: {
    width: '100%',
    paddingHorizontal: 40,
    paddingVertical: 30,
    alignItems: 'center',
  },
  nextButton: {
    flexDirection: 'row',
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    width: '80%',
  },
  nextButtonEnabled: {
    backgroundColor: '#4CAF50',
  },
  nextButtonDisabled: {
    backgroundColor: '#617685',
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