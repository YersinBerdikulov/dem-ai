import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

// Calculate proper grid dimensions
const ICON_MARGIN = 5;
const NUM_COLUMNS = 4;
// Calculate the available width (screen width minus side padding)
const AVAILABLE_WIDTH = width - 40; // 20px padding on each side
// Calculate the icon size based on available space and margins
const ICON_SIZE = (AVAILABLE_WIDTH - ((NUM_COLUMNS - 1) * ICON_MARGIN * 2)) / NUM_COLUMNS;

export const createHabitStyles = StyleSheet.create({
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
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    color: '#FFFFFF',
  },
  // Icon Preview
  iconPreviewContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 30,
    marginBottom: 20,
  },
  iconBox: {
    width: 80,
    height: 80,
    borderRadius: 16,
    backgroundColor: '#4C5EC0',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  emojiIcon: {
    fontSize: 40,
  },
  editIconButton: {
    position: 'absolute',
    right: -8,
    bottom: -8,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#0095FF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  // Description Step
  descriptionTitle: {
    fontFamily: 'Poppins-Bold',
    fontSize: 22,
    color: '#FFFFFF',
    textAlign: 'center',
    paddingHorizontal: 40,
    marginBottom: 10,
  },
  subtitleText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.6)',
    textAlign: 'center',
    marginBottom: 10,
  },
  suggestionsWrapper: {
    height: 50, // Fixed height for suggestions
    marginBottom: 20,
  },
  suggestionsContainer: {
    paddingHorizontal: 20,
    height: 50,
    alignItems: 'center',
  },
  suggestionButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
    height: 36,
    justifyContent: 'center',
  },
  suggestionText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: '#FFFFFF',
  },
  inputContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginTop: 5,
    alignItems: 'center',
  },
  habitInput: {
    flex: 1,
    height: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 10,
    paddingHorizontal: 15,
    color: '#FFFFFF',
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
  },
  nextButton: {
    width: 46,
    height: 46,
    backgroundColor: '#FF6B45',
    borderRadius: 23,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  nextButtonDisabled: {
    backgroundColor: 'rgba(255, 107, 69, 0.5)',
  },
  defineButton: {
    backgroundColor: '#0095FF',
    borderRadius: 12,
    marginHorizontal: 20,
    paddingVertical: 15,
    alignItems: 'center',
    position: 'absolute',
    bottom: 30,
    left: 0,
    right: 0,
  },
  defineButtonDisabled: {
    backgroundColor: 'rgba(0, 149, 255, 0.5)',
  },
  defineButtonText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: '#FFFFFF',
  },
  // Icon Selection Step
  chooseImageTitle: {
    fontFamily: 'Poppins-Bold',
    fontSize: 20,
    color: '#FFFFFF',
    textAlign: 'center',
    marginVertical: 20,
  },
  iconsGrid: {
    paddingHorizontal: 20,
    paddingBottom: 100,
    alignItems: 'center',
  },
  iconOption: {
    width: ICON_SIZE,
    height: ICON_SIZE,
    backgroundColor: '#4C5EC0',
    margin: ICON_MARGIN,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedIconOption: {
    borderWidth: 2,
    borderColor: '#0095FF',
  },
  iconEmoji: {
    fontSize: 28,
  },
  saveButton: {
    backgroundColor: '#0095FF',
    borderRadius: 12,
    marginHorizontal: 20,
    paddingVertical: 15,
    alignItems: 'center',
    position: 'absolute',
    bottom: 30,
    left: 0,
    right: 0,
  },
  saveButtonText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: '#FFFFFF',
  },
});