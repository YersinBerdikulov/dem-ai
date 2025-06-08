import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#03174C',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 18,
    color: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 16,
  },
  backButton: {
    padding: 8,
  },
  menuButton: {
    padding: 8,
  },
  content: {
    paddingHorizontal: 24,
    paddingBottom: 24,
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 30,
  },
  gameLogo: {
    width: 100,
    height: 100,
    borderRadius: 20,
    marginBottom: 16,
    backgroundColor: '#3498db', // Blue background for matching items game
  },
  gameTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 24,
    color: '#FFFFFF',
    textAlign: 'center',
  },
  levelSection: {
    width: '100%',
    marginBottom: 16,
  },
  levelLabel: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    color: '#8C8C8C', // Muted gray color for the label as shown in image
    marginBottom: 12,
  },
  levelList: {
    paddingBottom: 8,
    paddingHorizontal: 8,
  },
  levelItemContainer: {
    alignItems: 'center',
    marginHorizontal: 8,
    width: 50,
  },
  levelButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  levelButtonText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 18,
    color: '#FFFFFF',
  },
  completedLevelButton: {
    backgroundColor: '#4CAF50', // Green for completed levels
  },
  currentLevelButton: {
    backgroundColor: '#2196F3', // Blue for current level
  },
  unlockedLevelButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)', // Transparent for unlocked levels
  },
  lockedLevelButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)', // More transparent for locked levels
  },
  levelNumber: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: '#FFFFFF',
    marginTop: 8,
  },
  goalContainer: {
    width: '100%',
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 30,
    backgroundColor: '#34D8EB', // Turquoise color as shown in image
  },
  goalText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 18,
    color: '#FFFFFF',
    textAlign: 'center',
  },
  benefitsSection: {
    width: '100%',
    marginBottom: 30,
  },
  benefitsTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 20,
    color: '#FFFFFF',
    marginBottom: 20,
    textAlign: 'center',
  },
  benefitsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  benefitItem: {
    alignItems: 'center',
    width: '30%',
  },
  benefitIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(21, 101, 192, 0.7)', // Slightly transparent blue for icon containers
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  benefitText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: '#FFFFFF',
    textAlign: 'center',
  },
  startButton: {
    flexDirection: 'row',
    backgroundColor: '#4CAF50', // Green for the start button
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    width: '90%',
  },
  startButtonText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 20,
    color: '#FFFFFF',
    marginRight: 8,
  },
  startButtonIcon: {
    marginLeft: 8,
  },
});

export default styles;