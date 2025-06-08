// TherapyStyles.js
import { StyleSheet, Dimensions, Platform, StatusBar } from 'react-native';

const { width, height } = Dimensions.get('window');

export const therapyStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#03174C',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  gradientContainer: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#03174C',
  },
  loadingText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    marginTop: 15,
  },
  mapControlsContainer: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  mapControlButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
    marginBottom: 10,
  },
  fixedHeaderContainer: {
    backgroundColor: '#03174C',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
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
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    height: 60,
  },
  searchContainerAdjusted: {
    marginTop: 10, // Adjust this value to position below the LocationHeader
  },
  bottomSheet: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 6,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#03174C',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    height: 60,
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
  headerTitle: {
    fontSize: 18,
    color: 'white',
    fontFamily: 'Poppins-Medium',
  },
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginTop: 70, // Allow for header
    marginBottom: 10,
    alignItems: 'center',
  },
  searchInputContainer: {
    flex: 1,
    height: 45,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 22.5,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    marginRight: 10,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    color: 'white',
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
  },
  viewToggleButton: {
    width: 45,
    height: 45,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 22.5,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  filterButton: {
    width: 45,
    height: 45,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 22.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  resultsCountContainer: {
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  resultsCountText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    fontFamily: 'Poppins-Regular',
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 100, // Extra space at the bottom
  },
  mapContainer: {
    flex: 1,
    position: 'relative',
    overflow: 'hidden',
    borderRadius: 10,
    margin: 10,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  markerContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#007AFF',
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
  selectedMarker: {
    borderColor: '#FF8C00',
    backgroundColor: '#FFEBB5',
  },
  bottomSheet: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    borderRadius: 12,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.27,
        shadowRadius: 4.65,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  locationErrorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  locationErrorText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#007AFF',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
  },
  emptyResultsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    marginTop: 40,
  },
  emptyResultsText: {
    fontSize: 18,
    color: 'white',
    fontFamily: 'Poppins-Medium',
    marginTop: 20,
    marginBottom: 10,
  },
  emptyResultsSubtext: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    fontFamily: 'Poppins-Regular',
    textAlign: 'center',
  },
  loadingMore: {
    padding: 20,
  }
});