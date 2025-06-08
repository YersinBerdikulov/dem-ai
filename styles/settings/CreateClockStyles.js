import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export const createClockStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#03174C',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  backButton: {
    width: 30,
  },
  headerTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: '600',
    flex: 1,
    textAlign: 'center',
  },
  closeButton: {
    width: 30,
    alignItems: 'flex-end',
  },
  listContainer: {
    padding: 20,
  },
  addictionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4A3EE8',
    padding: 16,
    borderRadius: 10,
    marginBottom: 16,
  },
  iconContainer: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  addictionIcon: {
    width: 30,
    height: 30,
    resizeMode: 'contain',
  },
  addictionTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
});