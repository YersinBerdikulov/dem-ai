// IntroPageStyles.js
import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export const introPageStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#03174C',
  },
  gradientContainer: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    paddingTop: 20,
  },
  headerTitle: {
    fontSize: 18,
    color: 'white',
    fontFamily: 'Poppins-Medium',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  imageContainer: {
    width: width * 0.4,
    height: width * 0.4,
    borderRadius: width * 0.2,
    backgroundColor: '#223272',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
    overflow: 'hidden',
  },
  image: {
    width: '60%',
    height: '60%',
    resizeMode: 'contain',
  },
  infoContainer: {
    width: '100%',
    backgroundColor: 'rgba(34, 50, 114, 0.4)',
    borderRadius: 12,
    padding: 15,
    marginBottom: 40,
  },
  infoRow: {
    marginBottom: 15,
  },
  infoLabel: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
    marginBottom: 5,
  },
  infoValue: {
    color: 'white',
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
  },
  infoDescription: {
    color: 'white',
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    lineHeight: 22,
  },
  startButton: {
    backgroundColor: '#007AFF',
    width: '100%',
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: 'center',
  },
  startButtonText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
  },
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
    paddingVertical: 8,
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 5,
  },
  tabText: {
    fontSize: 10,
    marginTop: 3,
    color: 'white',
    fontFamily: 'Poppins-Regular',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#007AFF',
  },
  activeTabText: {
    color: '#007AFF',
  },
});