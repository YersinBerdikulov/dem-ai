// styles/discover/lifeSatisfaction/resultStyles.js
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#03174C',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    marginBottom: 24,
  },
  headerIcon: {
    width: 32,
    height: 32,
    justifyContent: 'center',
  },
  title: {
    color: 'white',
    fontSize: 20,
    fontFamily: 'Poppins-SemiBold',
    flex: 1,
    textAlign: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  scoreSection: {
    alignItems: 'center',
    marginBottom: 24,
    position: 'relative',
  },
  scoreTextContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
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
    paddingHorizontal: 16,
  },
  doneButton: {
    backgroundColor: '#8B7FFF',
    borderRadius: 30,
    padding: 16,
    alignItems: 'center',
    marginBottom: 24,
  },
  doneButtonText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 24, // Add some padding at the bottom
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
});