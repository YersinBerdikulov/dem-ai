import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#03174C', // Dark blue background
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  backButton: {
    padding: 8,
    borderRadius: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#03174C',
    fontFamily: 'Poppins-Bold',
  },
  scrollContainer: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    alignItems: 'center',
    paddingBottom: 40,
  },
  // Results header styles
  resultsHeader: {
    alignItems: 'center',
    marginBottom: 24,
    width: '100%',
  },
  resultsTitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 16,
    letterSpacing: 2,
    textAlign: 'center',
    fontFamily: 'Poppins-Medium',
  },
  personalityIconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  personalityIcon: {
    width: 60,
    height: 60,
  },
  personalityType: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
    fontFamily: 'Poppins-Bold',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 3,
  },
  // Description card styles
  descriptionCard: {
    borderRadius: 20,
    padding: 24,
    marginBottom: 24,
    width: '100%',
    shadowColor: '#4E66E3',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  descriptionText: {
    fontSize: 16,
    color: '#fff',
    lineHeight: 24,
    textAlign: 'center',
    fontFamily: 'Poppins-Regular',
  },
  // Strengths and weaknesses section
  traitsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
    width: '100%',
  },
  strengthsCard: {
    borderRadius: 16,
    padding: 16,
    width: '48%',
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  weaknessesCard: {
    borderRadius: 16,
    padding: 16,
    width: '48%',
    shadowColor: '#F44336',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  traitsTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  traitIcon: {
    marginRight: 6,
  },
  traitsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    fontFamily: 'Poppins-Bold',
  },
  traitItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  traitBullet: {
    fontSize: 14,
    color: '#fff',
    marginRight: 4,
    fontFamily: 'Poppins-Medium',
  },
  traitText: {
    fontSize: 14,
    color: '#fff',
    flex: 1,
    fontFamily: 'Poppins-Regular',
  },
  // Tips card styles
  tipsCard: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
    width: '100%',
    shadowColor: '#009688',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  tipsTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  tipsIcon: {
    marginRight: 8,
  },
  tipsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    fontFamily: 'Poppins-Bold',
  },
  tipsText: {
    fontSize: 16,
    color: '#fff',
    lineHeight: 24,
    fontFamily: 'Poppins-Regular',
  },
  // Personality distribution styles
  distributionCard: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  distributionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  distributionIcon: {
    marginRight: 8,
  },
  distributionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    fontFamily: 'Poppins-Bold',
  },
  distributionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  distributionLabelContainer: {
    width: 80,
  },
  distributionLabel: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    fontFamily: 'Poppins-Medium',
  },
  distributionBarContainer: {
    flex: 1,
    height: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 6,
    marginHorizontal: 12,
    overflow: 'hidden',
  },
  distributionBar: {
    height: '100%',
    borderRadius: 6,
  },
  introvertBar: {
    backgroundColor: '#A8D8C6', // Mint green for introvert
  },
  extrovertBar: {
    backgroundColor: '#B3E5FC', // Light blue for extrovert
  },
  ambivertBar: {
    backgroundColor: '#E1BEE7', // Light purple for ambivert
  },
  distributionPercentage: {
    width: 40,
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'right',
    fontFamily: 'Poppins-Bold',
  },
  // Action buttons styles
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 10,
  },
  actionButton: {
    borderRadius: 30,
    width: '48%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  actionButtonTouchable: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 8,
    fontFamily: 'Poppins-Bold',
    fontSize: 15,
  },
});