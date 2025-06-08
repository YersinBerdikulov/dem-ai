import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export const dateStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#03174C',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  backButton: {
    marginRight: 10,
  },
  headerTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: '600',
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingTop: 60,
  },
  iconContainer: {
    marginBottom: 40,
  },
  questionText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 40,
  },
  inputButton: {
    backgroundColor: '#4A3EE8',
    width: '100%',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginBottom: 20,
    alignItems: 'center',
  },
  inputButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  saveButton: {
    backgroundColor: '#0F9BF2',
    width: '100%',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginTop: 20,
    alignItems: 'center',
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  
  // New styles for modal picker
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#1F2A61',
    borderRadius: 16,
    width: width * 0.85,
    paddingBottom: 20,
    overflow: 'hidden',
  },
  pickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#4A3EE8',
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  pickerTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  pickerButton: {
    paddingHorizontal: 10,
  },
  pickerButtonText: {
    color: 'white',
    fontSize: 16,
  },
  doneButton: {
    color: '#0F9BF2',
    fontWeight: '600',
  },
  pickerContainer: {
    height: 200,
    backgroundColor: '#1F2A61',
  },
});