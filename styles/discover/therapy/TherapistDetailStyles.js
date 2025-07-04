// TherapistDetailStyles.js
import { StyleSheet, Dimensions, Platform, StatusBar } from 'react-native';

const { width, height } = Dimensions.get('window');

export const therapistDetailStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#03174C',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  gradientContainer: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  headerTitle: {
    fontSize: 18,
    color: 'white',
    fontFamily: 'Poppins-Medium',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  profileHeader: {
    flexDirection: 'row',
    marginBottom: 25,
    padding: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 15,
  },
  profileImageContainer: {
    marginRight: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#2A3A5C',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  placeholderImage: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  name: {
    fontSize: 22,
    fontWeight: '600',
    color: 'white',
    fontFamily: 'Poppins-SemiBold',
    marginBottom: 6,
  },
  specialization: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    fontFamily: 'Poppins-Regular',
    marginBottom: 10,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 15,
    alignSelf: 'flex-start',
  },
  ratingText: {
    marginLeft: 6,
    fontSize: 14,
    color: 'white',
    fontFamily: 'Poppins-Regular',
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 20,
    marginHorizontal: -5,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    marginBottom: 25,
  },
  actionButton: {
    flex: 1,
    alignItems: 'center',
    margin: 5,
    padding: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
  },
  actionIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  actionText: {
    fontSize: 13,
    color: 'white',
    fontFamily: 'Poppins-Medium',
  },
  section: {
    marginBottom: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 15,
    padding: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
    fontFamily: 'Poppins-SemiBold',
    marginBottom: 15,
    borderLeftWidth: 3,
    borderLeftColor: '#007AFF',
    paddingLeft: 10,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  infoIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 122, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  infoTextContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: 'white',
    fontFamily: 'Poppins-Medium',
    marginBottom: 2,
  },
  infoText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    fontFamily: 'Poppins-Regular',
  },
  linkText: {
    color: '#007AFF',
    textDecorationLine: 'underline',
  },
  mapContainer: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 10,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  openMapButton: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: 'white',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  openMapButtonText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#03174C',
    fontFamily: 'Poppins-Medium',
    marginLeft: 5,
  },
  bookingContainer: {
    marginTop: 10,
    marginBottom: 30,
  },
  bookingButton: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 6,
  },
  bookingButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    fontFamily: 'Poppins-SemiBold',
  },
  reviewItem: {
    paddingVertical: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: 10,
    marginBottom: 10,
    padding: 10,
  },
  reviewSeparator: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginVertical: 5,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  reviewAuthor: {
    fontSize: 14,
    fontWeight: '500',
    color: 'white',
    fontFamily: 'Poppins-Medium',
  },
  reviewRating: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  reviewRatingText: {
    marginLeft: 4,
    fontSize: 12,
    color: '#FFD700',
    fontFamily: 'Poppins-Medium',
  },
  reviewText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    fontFamily: 'Poppins-Regular',
    lineHeight: 20,
    marginBottom: 8,
  },
  reviewTime: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.5)',
    fontFamily: 'Poppins-Regular',
  }
});