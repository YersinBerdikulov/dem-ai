// styles/settings/settingsStyles.js
import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export const settingsStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#03174C',
    paddingHorizontal: 20,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 32,
    fontFamily: 'Poppins-SemiBold',
    marginTop: 12,
    marginBottom: 24,
    paddingLeft: 8,
  },
  // Enhanced profile card styles
  profileCard: {
    backgroundColor: '#4A3EE8',
    borderRadius: 20,
    padding: 0, // Remove padding here to control it more precisely
    marginBottom: 32,
    overflow: 'hidden', // Ensure content doesn't overflow rounded corners
    elevation: 8, // For Android shadow
    shadowColor: '#000', // For iOS shadow
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 8,
  },
  profileCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  profileInfo: {
    flex: 1,
    marginLeft: 15,
    marginRight: 10,
  },
  profileName: {
    color: 'white',
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 4,
    fontFamily: 'Poppins-SemiBold',
  },
  profileEmail: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    marginBottom: 4,
  },
  // Admin badge for profile
  adminBadgeContainer: {
    flexDirection: 'row',
  },
  adminBadge: {
    color: '#00E676',
    fontSize: 12,
    fontFamily: 'Poppins-Medium',
    backgroundColor: 'rgba(0, 230, 118, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    overflow: 'hidden',
    alignSelf: 'flex-start',
  },
  avatarContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    position: 'relative',
    backgroundColor: '#3731B4', // Slightly darker than the card for contrast
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  avatar: {
    width: '100%',
    height: '100%',
    borderRadius: 35,
  },
  avatarPlaceholder: {
    width: '100%',
    height: '100%',
    borderRadius: 35,
    backgroundColor: '#3731B4',
    justifyContent: 'center',
    alignItems: 'center',
  },
  editIconContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#1E90FF',
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#4A3EE8', // Match card background
  },
  // Modal styles for logout
  logoutModal: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  logoutModalContent: {
    backgroundColor: '#051445',
    borderRadius: 16,
    padding: 24,
    width: '80%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  logoutModalTitle: {
    color: 'white',
    fontSize: 20,
    fontFamily: 'Poppins-SemiBold',
    marginBottom: 16,
    textAlign: 'center',
  },
  logoutModalMessage: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    marginBottom: 24,
    textAlign: 'center',
    lineHeight: 24,
  },
  logoutButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  cancelButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 30,
    width: '48%',
    alignItems: 'center',
  },
  logoutButton: {
    backgroundColor: '#FF3B30',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 30,
    width: '48%',
    alignItems: 'center',
  },
  cancelButtonText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
  },
  logoutButtonText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#4CD964',
    borderWidth: 2,
    borderColor: '#4A3EE8',
    zIndex: 2,
  },
  // Original styles
  sectionTitle: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    marginBottom: 12,
    paddingLeft: 8,
  },
  themeContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    marginBottom: 32,
    overflow: 'hidden',
  },
  themeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  themeOptionLast: {
    borderBottomWidth: 0,
  },
  themeText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
  },
  radioButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  radioButtonSelected: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#FFFFFF',
  },
  menuItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  menuText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
  },
  helpSection: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 30,
  },
  helpItem: {
    marginBottom: 16,
  },
  helpItemLast: {
    marginBottom: 0,
  },
  helpLabel: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    marginBottom: 4,
  },
  helpValue: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
  },
  chevron: {
    color: '#FFFFFF',
  },
  gradientScroll: {
    marginBottom: 32,
    paddingLeft: 8,
  },
  gradientContent: {
    paddingRight: 28,
  },
  gradientWrapper: {
    marginRight: 16,
    alignItems: 'center',
  },
  gradientOption: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedGradient: {
    borderColor: '#FFFFFF',
    shadowColor: '#FFFFFF',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  // Achievement styles
  achievementSection: {
    marginBottom: 32,
  },
  achievementHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  seeAllText: {
    color: '#1904E5',
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
  },
  achievementScrollContent: {
    paddingLeft: 8,
    paddingRight: 28,
  },
  achievementItem: {
    marginRight: 16,
    alignItems: 'center',
    position: 'relative',
  },
  achievementCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#4CAF50',
  },
  achievementCircleIncomplete: {
    borderColor: 'rgba(255, 255, 255, 0.3)',
    opacity: 0.7,
  },
  medalIcon: {
    width: 36,
    height: 36,
    resizeMode: 'contain',
  },
  achievementCount: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#03174C',
    borderWidth: 2,
    borderColor: '#1904E5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  achievementCountIncomplete: {
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
  achievementCountText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  remainingCircle: {
    borderColor: '#03a9f4',
    backgroundColor: 'rgba(3, 169, 244, 0.2)',
  },
  remainingText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  menuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuIcon: {
    marginRight: 10,
  },
  
  // Sobriety Clocks styles
  sobrietySection: {
    marginBottom: 32,
  },
  sobrietyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sobrietyCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  sobrietyIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  sobrietyIcon: {
    width: 30,
    height: 30,
    resizeMode: 'contain',
  },
  sobrietyInfo: {
    flex: 1,
  },
  sobrietyTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
    marginBottom: 4,
  },
  sobrietySubtitle: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
  },
  
  // Language Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: width * 0.9,
    maxHeight: height * 0.7,
    backgroundColor: '#03174C',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  modalTitle: {
    fontSize: 20,
    color: 'white',
    fontFamily: 'Poppins-SemiBold',
  },
  languageList: {
    maxHeight: height * 0.5,
  },
  languageOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  languageName: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
  },

  // Admin Panel Section styles
  adminSection: {
    marginBottom: 32,
  },
  adminCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  adminIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  adminIcon: {
    width: 30,
    height: 30,
  },
  adminInfo: {
    flex: 1,
  },
  adminTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
    marginBottom: 4,
  },
  adminSubtitle: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
  }
});