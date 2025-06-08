// styles/discover/testStyles.js
import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');
const cardWidth = (width - 48) / 2; // Accounting for padding and gap

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#03174C',
  },
  headerImageCard: {
    marginHorizontal: 16,
    marginTop: 16,
    height: 200,
    borderRadius: 16,
    overflow: 'hidden',
  },
  headerImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  headerTextContainer: {
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 24,
  },
  title: {
    color: 'white',
    fontSize: 24,
    fontFamily: 'Poppins-SemiBold',
    marginBottom: 8,
  },
  description: {
    color: 'white',
    fontSize: 14,
    fontFamily: 'Poppins',
    opacity: 0.9,
    lineHeight: 20,
  },
  cardGrid: {
    paddingHorizontal: 16,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    width: cardWidth,
    height: 120,
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
  },
  cardContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    zIndex: 1,
  },
  cardImage: {
    width: 32,
    height: 32,
    marginBottom: 12,
    tintColor: 'white',
    opacity: 0.9,
  },
  cardText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
  },
  gradientBackground: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  }
});