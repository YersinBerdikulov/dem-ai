// styles/discover/insomniaRating/introStyles.js
import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');
const cardWidth = width - 32;

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#03174C',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  headerIcon: {
    marginRight: 8,
    padding: 4,
    width: 32,
  },
  title: {
    color: 'white',
    fontSize: 20,
    fontFamily: 'Poppins-SemiBold',
    flex: 1,
  },
  menuIcon: {
    padding: 4,
  },
  contentContainer: {
    paddingHorizontal: 16,
  },
  progressCard: {
    backgroundColor: '#8B7FFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    height: 200,
    overflow: 'hidden',
  },
  progressTitle: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
    marginBottom: 20,
  },
  progressLines: {
    flex: 1,
  },
  noDataText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'Poppins',
    textAlign: 'center',
    opacity: 0.8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  insightsCard: {
    backgroundColor: '#8B7FFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  insightIcon: {
    alignItems: 'center',
    marginBottom: 12,
  },
  insightText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'Poppins',
    textAlign: 'center',
    lineHeight: 24,
  },
  historySection: {
    marginBottom: 16,
  },
  historyTitle: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
    marginBottom: 12,
    marginLeft: 4,
  },
  historyCard: {
    backgroundColor: '#8B7FFF',
    borderRadius: 16,
    height: 70,
    paddingHorizontal: 20,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  historyLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  circleWrapper: {
    width: 50,
    height: 50,
    marginRight: 12,
  },
  historyRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  historyScoreSection: {
    alignItems: 'flex-end',
    marginRight: 16,
  },
  historyScore: {
    color: 'white',
    fontSize: 28,
    fontFamily: 'Poppins-SemiBold',
  },
  historyDate: {
    color: 'white',
    fontSize: 12,
    fontFamily: 'Poppins',
    opacity: 0.8,
  },
  deleteButton: {
    padding: 8,
  },
  startButton: {
    backgroundColor: '#007AFF',
    borderRadius: 30,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 24,
  },
  startButtonText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
    marginRight: 8,
  }
});