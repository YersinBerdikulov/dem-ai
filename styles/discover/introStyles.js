// styles/discover/introStyles.js
import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');
const cardWidth = width - 32;

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#03174C',
  },
  
  noDataText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'Poppins',
    textAlign: 'center',
    opacity: 0.8,
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
  progressCard: {
    width: cardWidth,
    backgroundColor: '#8B7FFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    marginHorizontal: 16,
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
  insightsCard: {
    width: cardWidth,
    backgroundColor: '#8B7FFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    marginHorizontal: 16,
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
  mainContent: {
    paddingHorizontal: 16,
  },
  historyTitle: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  historyCard: {
    backgroundColor: '#8B7FFF',
    borderRadius: 16,
    height: 80,
    paddingHorizontal: 20,
    marginBottom: 12,
    marginHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
    marginRight: 12,
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
    padding: 4,
  },
  startButton: {
    backgroundColor: '#007AFF',
    borderRadius: 30,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 16,
    marginBottom: 24,
    marginTop: 8,
  },
  startButtonText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
    marginRight: 8,
  },
});