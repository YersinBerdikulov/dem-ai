import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export const natureSoundsStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradientContainer: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    marginTop: 20,
  },
  contentContainer: {
    flex: 1,
    backgroundColor: '#03174C',
    marginTop: '45%',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingTop: 30,
  },
  title: {
    fontSize: 32,
    color: 'white',
    fontFamily: 'Poppins-Bold',
    paddingHorizontal: 20,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.7)',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  tracksList: {
    paddingHorizontal: 20,
  },
  trackItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  trackImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  trackInfo: {
    marginLeft: 15,
    flex: 1,
  },
  trackTitle: {
    fontSize: 16,
    color: 'white',
    fontFamily: 'Poppins-Medium',
  },
  trackDuration: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.6)',
    marginTop: 4,
  },
  backgroundImage: {
    width: width,
    height: 200,
    position: 'absolute',
    top: 50,
    opacity: 0.6,
  },
});