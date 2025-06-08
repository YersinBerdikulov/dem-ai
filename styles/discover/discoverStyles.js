import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');
const CARD_GAP = 16;
const CARD_WIDTH = (width - (CARD_GAP * 3)) / 2;

export const discoverStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#03174C',
  },
  content: {
    padding: 16,
  },
  searchContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    marginBottom: 24,
  },
  searchInput: {
    flex: 1,
    color: '#FFFFFF',
    marginLeft: 8,
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontFamily: 'Poppins-SemiBold',
    marginBottom: 16,
  },
  cardsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: CARD_GAP,
  },
  // Card Styles
 card: {
    width: CARD_WIDTH,
    height: CARD_WIDTH * 0.8,
    borderRadius: 20,
    padding: 16,
    overflow: 'hidden',
    position: 'relative', // For overlay positioning
  },
  cardOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#0F172A',
    opacity: 0.2, // 20% transparency
    zIndex: 1,
  },
  cardContent: {
    flex: 1,
    justifyContent: 'flex-end',
    zIndex: 2, // Above overlay
  },
  cardTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    marginBottom: 4,
  },
  cardSessions: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
  },
  cardIcon: {
    width: 150,
    height: 110,
    opacity: 0.8,
    position: 'absolute',
    right: 16,
    top: 16,
    zIndex: 2, // Above overlay
  },
});