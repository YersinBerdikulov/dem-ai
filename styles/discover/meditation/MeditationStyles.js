// MeditationStyles.js
import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');
const itemWidth = (width - 60) / 3;

export const meditationStyles = StyleSheet.create({
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
    padding: 15,
  },
  categoryContainer: {
    marginBottom: 20,
  },
  categoryTitle: {
    fontSize: 16,
    color: 'white',
    fontFamily: 'Poppins-Medium',
    marginBottom: 15,
  },
  itemsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  meditationItem: {
    width: itemWidth,
    alignItems: 'center',
    marginBottom: 20,
    marginRight: 10,
  },
  itemImageContainer: {
    width: itemWidth - 10,
    height: itemWidth - 10,
    borderRadius: (itemWidth - 10) / 2,
    backgroundColor: '#223272',
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  itemImage: {
    width: '60%',
    height: '60%',
    resizeMode: 'contain',
  },
  itemTitle: {
    fontSize: 12,
    color: 'white',
    fontFamily: 'Poppins-Regular',
    textAlign: 'center',
    marginBottom: 2,
  },
  itemDuration: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.6)',
    fontFamily: 'Poppins-Regular',
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