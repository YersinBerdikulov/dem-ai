import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export const addHabitsStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#03174C',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 15,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  headerTitle: {
    fontFamily: 'Poppins-Bold',
    fontSize: 22,
    color: '#FFFFFF',
  },
  // Added a container for the ScrollView to properly handle width
  filtersScrollContainer: {
    paddingLeft: 20,
    marginBottom: 15,
    height: 50, // Fixed height to ensure proper display
  },
  filtersContainer: {
    paddingRight: 20, // Add padding to the right
  },
  filterButton: {
    height: 45, // Fixed height for all buttons
    paddingHorizontal: 15,
    paddingVertical: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 25, // More rounded to match screenshots
    marginRight: 10, // Space between buttons
    justifyContent: 'center', // Center content vertically
    alignItems: 'center', // Center content horizontally
    minWidth: 100, // Minimum width to ensure all buttons have similar size
  },
  activeFilterButton: {
    backgroundColor: '#4E66E3', // Blue color when active
    // Add shadow for active filter button
    shadowColor: '#4E66E3',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.5,
    shadowRadius: 3.84,
    elevation: 5,
  },
  filterText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
  },
  activeFilterText: {
    color: '#FFFFFF',
    fontFamily: 'Poppins-SemiBold', // Bolder text when active
  },
  createHabitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4E66E3',
    borderRadius: 12,
    marginHorizontal: 20,
    paddingVertical: 15,
    marginBottom: 20,
  },
  createButtonIcon: {
    marginRight: 10,
  },
  createButtonText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: '#FFFFFF',
  },
  sectionTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    color: '#FFFFFF',
    marginHorizontal: 20,
    marginBottom: 15,
    textTransform: 'capitalize',
  },
  categoriesContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  categoryCard: {
    flexDirection: 'row',
    borderRadius: 15,
    marginBottom: 12,
    padding: 15,
    overflow: 'hidden',
  },
  categoryContent: {
    flex: 1,
    justifyContent: 'center',
  },
  categoryTitle: {
    fontFamily: 'Poppins-Bold',
    fontSize: 16,
    color: '#03174C',
    marginBottom: 5,
  },
  categoryDescription: {
    fontFamily: 'Poppins-Regular',
    fontSize: 13,
    color: '#03174C',
    opacity: 0.8,
    width: '90%',
  },
  categoryIconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 60,
    height: 60,
  },
  categoryIcon: {
    width: 40,
    height: 40,
  },
  habitSelectionOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  habitSelectionBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    padding: 20,
  },
  habitSelectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    paddingTop: 40,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  habitSelectionTitle: {
    fontFamily: 'Poppins-Bold',
    fontSize: 20,
    color: '#FFFFFF',
  },
  habitOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
  },
  habitOptionIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  habitOptionDetails: {
    flex: 1,
  },
  habitOptionTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 3,
  },
  habitOptionSubtitle: {
    fontFamily: 'Poppins-Regular',
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.7)',
  },
});