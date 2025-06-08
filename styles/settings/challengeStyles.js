import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export const challengeStyles = StyleSheet.create({
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
    marginBottom: 12,
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
    fontWeight: '500',
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
  },
  activeTabText: {
    color: '#03174C',
    fontWeight: 'bold',
    fontFamily: 'Poppins-Bold',
  },
  infoText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginTop: 5,
    fontFamily: 'Poppins-Bold',
  },
  subInfoText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
    marginBottom: 20,
    fontFamily: 'Poppins-Regular',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  categorySection: {
    marginBottom: 30,
  },
  categoryTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 16,
    fontFamily: 'Poppins-Bold',
  },
  challengesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  challengeCard: {
    width: (width - 60) / 2, // Account for margins and padding
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
  },
  challengeHeader: {
    position: 'relative',
    marginBottom: 12,
  },
  challengeIcon: {
    width: 70,
    height: 70,
    borderRadius: 35,
  },
  daysBadge: {
    position: 'absolute',
    bottom: -5,
    backgroundColor: '#1904E5',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  daysText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
    fontFamily: 'Poppins-Bold',
  },
  challengeTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 4,
    fontFamily: 'Poppins-SemiBold',
  },
  challengeSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
    marginBottom: 16,
    fontFamily: 'Poppins-Regular',
  },
  progressCirclesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 12,
    maxWidth: (width - 100) / 2, // Ensure circles wrap properly
  },
  progressCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    backgroundColor: 'transparent',
    margin: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressCircleFilled: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  joinButton: {
    backgroundColor: '#1904E5',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 15,
    marginTop: 8,
  },
  joinButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
    fontFamily: 'Poppins-Bold',
  },
  completedBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
  },
});