import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const OpenNewsStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#03174C',
  },
  scrollContainer: {
    flexGrow: 1,
  },
  headerContainer: {
    position: 'relative',
  },
  coverImage: {
    width: '100%',
    height: width * 0.7,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  gradientOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
    backgroundColor: 'rgba(3, 23, 76, 0.8)',
  },
  backButton: {
    position: 'absolute',
    top: 16,
    left: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 20,
    padding: 10,
    zIndex: 10,
  },
  saveButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 20,
    padding: 10,
    zIndex: 10,
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    color: 'white',
    fontSize: 24,
    fontFamily: 'Poppins-Bold',
    marginBottom: 16,
    lineHeight: 32,
  },
  metaContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  categoryDateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryContainer: {
    backgroundColor: '#1904E5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginRight: 12,
  },
  categoryText: {
    color: 'white',
    fontSize: 12,
    fontFamily: 'Poppins-Medium',
  },
  dateText: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
  },
  readingTime: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  readingTimeText: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 12,
    marginLeft: 4,
    fontFamily: 'Poppins-Regular',
  },
  authorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  authorImageContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    overflow: 'hidden',
    marginRight: 12,
  },
  authorImage: {
    width: '100%',
    height: '100%',
  },
  authorNameContainer: {
    flex: 1,
  },
  authorLabel: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
  },
  authorName: {
    color: 'white',
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
  },
  content: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    lineHeight: 24,
    marginBottom: 24,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 16,
  },
  tag: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 12,
    fontFamily: 'Poppins-Medium',
  },
  relatedContainer: {
    marginTop: 24,
  },
  relatedTitle: {
    color: 'white',
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    marginBottom: 16,
  },
  relatedCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: 12,
    marginRight: 16,
    width: width * 0.7,
  },
  relatedImage: {
    width: '100%',
    height: width * 0.3,
    borderRadius: 12,
    marginBottom: 12,
  },
  relatedCardTitle: {
    color: 'white',
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
    marginBottom: 8,
  },
  separator: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginVertical: 24,
  },
  shareButton: {
    backgroundColor: '#1904E5',
    borderRadius: 30,
    paddingVertical: 14,
    paddingHorizontal: 24,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
  },
  shareButtonText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
    marginLeft: 8,
  },
});

export default OpenNewsStyles;