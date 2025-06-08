import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export const soundPlayerStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#03174C',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
  },
  headerTitle: {
    fontSize: 18,
    color: 'white',
    fontFamily: 'Poppins-Medium',
    padding:25,
  },
  content: {
    alignItems: 'center',
    padding: 20,
  },
  artwork: {
    width: width - 80,
    height: width - 80,
    borderRadius: 20,
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    color: 'white',
    fontFamily: 'Poppins-SemiBold',
    textAlign: 'center',
    marginBottom: 8,
  },
  duration: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.6)',
    marginBottom: 40,
  },
  progressBar: {
    width: '100%',
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 2,
    marginBottom: 40,
  },
  progress: {
    width: '45%',
    height: '100%',
    backgroundColor: '#FFA8A8',
    borderRadius: 2,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '80%',
  },
  playButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#FFA8A8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  gradientBackground: {
    ...StyleSheet.absoluteFillObject
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)'
  },
  backButton: {
    padding: 10,
    marginLeft: -10,
  },
  progressBarContainer: {
    width: '100%',
    marginBottom: 30,
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 8,
    paddingHorizontal: 5,
  },
  timeText: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
  }
  
});