// SoundMeditationStyles.js
import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export const soundMeditationStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#03174C',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 10,
    height: 60,
  },
  headerTitle: {
    color: 'white',
    fontSize: 18,
    fontFamily: 'Poppins-Medium',
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 15,
  },
  artworkContainer: {
    width: width - 40,
    height: width - 40,
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 16,
  },
  artworkImage: {
    width: '100%',
    height: '100%',
  },
  trackInfoContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 25,
  },
  trackTitle: {
    color: 'white',
    fontSize: 18,
    fontFamily: 'Poppins-Medium',
  },
  trackDuration: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
  },
  favoriteButton: {
    position: 'absolute',
    right: 0,
  },
  waveformContainer: {
    width: '100%',
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  waveformBar: {
    width: 3.5,
    borderRadius: 1.5,
    marginHorizontal: 2,
  },
  waveformBarActive: {
    backgroundColor: 'white',
  },
  waveformBarInactive: {
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
  },
  timeIndicatorContainer: {
    width: '100%',
    alignItems: 'flex-start',
    marginBottom: 25,
  },
  timeText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
  },
  controlsContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  controlButton: {
    padding: 12,
  },
  playPauseButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  }
});