import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');
const HORIZONTAL_PADDING = 20;
const CARD_WIDTH = (width - (HORIZONTAL_PADDING * 2) - 12) / 2;
const BREATHING_CARD_HEIGHT = CARD_WIDTH * 1.2; // Make breathing card 20% taller
const REGULAR_CARD_HEIGHT = (BREATHING_CARD_HEIGHT - 12) / 2;

export const homeStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#03174C',
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: HORIZONTAL_PADDING,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
    paddingBottom: 16,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  userName: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    color: '#FFFFFF',
  },
  headerIcons: {
    flexDirection: 'row',
    gap: 20,
  },
  title: {
    fontFamily: 'Poppins-Bold',
    fontSize: 32,
    color: '#FFFFFF',
    marginBottom: 24,
    lineHeight: 38,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
    marginBottom: 24,
    paddingHorizontal: 20,
    height: 56,
  },
  searchInput: {
    flex: 1,
    color: '#FFFFFF',
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    marginLeft: 12,
  },
  cardsContainer: {
    width: '100%',
    gap: 12,
  },
  cardsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  talkCard: {
    width: '100%',
    height: 100,
    borderRadius: 24,
    padding: 20,
  },
  breathingCard: {
    width: CARD_WIDTH,
    height: BREATHING_CARD_HEIGHT, // Using the new height
    borderRadius: 24,
    padding: 20,
  },
  regularCard: {
    width: '100%',
    height: REGULAR_CARD_HEIGHT, // Using the new calculated height
    borderRadius: 24,
    padding: 20,
  },
  cardContent: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  cardContentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: '100%',
  },
  cardIcon: {
    width: 55,
    height: 54,
    opacity: 0.8,
  },
  cardTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 20,
    color: '#FFFFFF',
  },
  sectionTitle: {
    fontFamily: 'Poppins-Bold',
    fontSize: 24,
    color: '#FFFFFF',
    marginTop: 32,
    marginBottom: 16,
  },
  recentPacksScroll: {
    marginLeft: -HORIZONTAL_PADDING,
  },
  recentCard: {
    width: width * 0.35,
    height: width * 0.35,
    borderRadius: 24,
    marginLeft: HORIZONTAL_PADDING,
    padding: 16,
  },
  recentCardTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: '#FFFFFF',
    marginTop: 'auto',
  },
  duration: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
    marginTop: 4,
  },
});