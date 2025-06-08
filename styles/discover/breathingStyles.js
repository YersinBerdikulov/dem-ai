import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');
const ICON_SIZE = width * 0.5;

export const breathingStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#03174C',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 40,
    paddingTop: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    color: '#FFFFFF',
    fontSize: 24,
    fontFamily: 'Poppins-SemiBold',
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 10,
  },
  headerSpacer: {
    width: 40, // Same width as back button to center the title
  },
  scrollContent: {
    paddingBottom: 20,
  },
  iconContainer: {
    width: ICON_SIZE,
    height: ICON_SIZE,
    alignSelf: 'center',
    marginVertical: 40,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  breathingIcon: {
    width: ICON_SIZE * 0.4,
    height: ICON_SIZE * 0.4,
    tintColor: '#FFFFFF',
    position: 'absolute',
  },
  breathingIcon1: {
    width: ICON_SIZE * 0.4,
    height: ICON_SIZE * 0.4,
    tintColor: '#FFFFFF',
    position: 'relative',
    marginTop: '-5',
    paddingLeft: '4'
  },
  circle: {
    position: 'absolute',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: ICON_SIZE / 2,
  },
  outerCircle: {
    width: ICON_SIZE,
    height: ICON_SIZE,
  },
  middleCircle: {
    width: ICON_SIZE * 0.8,
    height: ICON_SIZE * 0.8,
    left: ICON_SIZE * 0.1,
    top: ICON_SIZE * 0.1,
  },
  innerCircle: {
    width: ICON_SIZE * 0.6,
    height: ICON_SIZE * 0.6,
    left: ICON_SIZE * 0.2,
    top: ICON_SIZE * 0.2,
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
    marginBottom: 12,
    opacity: 0.7,
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    color: '#FFFFFF',
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
  },
  timeOptionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
    gap: 8,
  },
  timeOption: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  selectedTimeOption: {
    backgroundColor: '#1877F2',
  },
  timeOptionText: {
    color: '#FFFFFF',
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    opacity: 0.7,
  },
  selectedTimeOptionText: {
    opacity: 1,
    fontFamily: 'Poppins-Medium',
  },
  startButton: {
    backgroundColor: '#1877F2',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 40,
    width: '100%',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
  },
  // Styles for Breathing Exercise screen
  timer: {
    fontSize: 48,
    color: '#FFFFFF',
    fontFamily: 'Poppins-Bold',
    textAlign: 'center',
    marginTop: 40,
  },
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    marginTop: 'auto',
    marginBottom: 16,
  },
  controlButton: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  controlButtonPrimary: {
    backgroundColor: '#1877F2',
  },
  doneButton: {
    backgroundColor: '#1877F2',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 20,
  },
  phaseText: {
    color: '#FFFFFF',
    fontFamily: 'Poppins-Medium',
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 16,
    textTransform: 'capitalize',
  }
});