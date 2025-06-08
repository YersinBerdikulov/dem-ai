import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export const achievementStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#03174C',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    fontFamily: 'Poppins-Bold',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 30,
    marginHorizontal: 20,
    marginBottom: 16,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: 'white',
  },
  tabText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
  },
  activeTabText: {
    color: '#03174C',
    fontWeight: 'bold',
    fontFamily: 'Poppins-Bold',
  },
  infoText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
    marginVertical: 16,
    fontFamily: 'Poppins-Regular',
  },
  achievementsContainer: {
    paddingHorizontal: 20,
  },
  achievementsContentContainer: {
    paddingBottom: 20,
  },
  achievementCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  achievementIcon: {
    width: 40,
    height: 40,
    marginRight: 16,
  },
  achievementContent: {
    flex: 1,
    marginRight: 10,
  },
  achievementTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 10,
    fontFamily: 'Poppins-SemiBold',
  },
  progressBarContainer: {
    height: 8,
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#1904E5',
    borderRadius: 4,
  },
  incompleteProgressBar: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  // Loading state styles
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  // Empty state styles
  emptyStateContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    marginTop: 40,
  },
  emptyStateText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
    fontFamily: 'Poppins-Regular',
  },
  // For challenges redirect
  challengesRedirect: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  redirectText: {
    fontSize: 16,
    color: 'white',
    textAlign: 'center',
    marginBottom: 20,
    fontFamily: 'Poppins-Regular',
  },
  redirectButton: {
    backgroundColor: '#1904E5',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 30,
  },
  redirectButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
  },
  // Section headers for completed and available achievements
  sectionHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginVertical: 16,
    fontFamily: 'Poppins-Bold',
    paddingLeft: 8,
  },
  // Styles for achievement status and icons
  completedIcon: {
    color: '#4CAF50',
  },
  // Styles for Settings component achievement display
  achievementCircleIncomplete: {
    borderColor: 'rgba(255, 255, 255, 0.3)',
    opacity: 0.7,
  },
  achievementCountIncomplete: {
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
});
