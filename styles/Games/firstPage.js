import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#03174C',
    paddingTop: 16,
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    fontFamily: 'Poppins-Bold',
    color: 'white',
    marginBottom: 20,
    marginHorizontal: 35,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 25,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 24,
    marginHorizontal:35, // Significantly larger margin to match the red lines in Image 2
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    color: '#333333',
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    height: 40,
  },
  gamesList: {
    paddingBottom: 20,
    paddingHorizontal: 35, // Significantly larger margin to match the red lines in Image 2
  },
  gameCard: {
    width: '100%',
    height: 140,
    backgroundColor: '#1c2740',
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
  },
  gameImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  playButtonContainer: {
    position: 'absolute',
    top: 12,
    left: 12,
  },
  playButton: {
    width: 40,
    height: 40,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gameTitle: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    fontFamily: 'Poppins-SemiBold',
  },
});

export default styles;