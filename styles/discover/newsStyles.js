import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export const newsStyles = StyleSheet.create({
  // ==== SHARED STYLES ====
  container: {
    flex: 1,
    backgroundColor: '#03174C',
  },

  // ==== TABS STYLES ====
  tabsContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
    marginHorizontal: 16,
    marginTop: 10,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    marginRight: 25,
    position: 'relative',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#1904E5',
  },
  tabText: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
    marginLeft: 6,
  },
  activeTabText: {
    color: '#FFFFFF',
  },
  savedCountBadge: {
    position: 'absolute',
    top: 8,
    right: -15,
    backgroundColor: '#FF4A4A',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 5,
  },
  savedCountText: {
    color: 'white',
    fontSize: 12,
    fontFamily: 'Poppins-Bold',
  },

  // ==== NEWS LIST STYLES ====
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    margin: 16,
    padding: 16,
    borderRadius: 16,
  },
  searchInput: {
    flex: 1,
    color: 'white',
    marginLeft: 12,
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
  },
  categoriesContainer: {
    marginBottom: 20,
  },
  categoryScroll: {
    paddingHorizontal: 16,
  },
  categoryButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginRight: 12,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  selectedCategory: {
    backgroundColor: '#1904E5',
  },
  categoryText: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
  },
  selectedCategoryText: {
    color: 'white',
  },
  newsList: {
    paddingHorizontal: 16,
  },
  newsCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 20,
    marginBottom: 16,
    overflow: 'hidden',
  },
  newsImage: {
    width: '100%',
    height: width * 0.5,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  cardContent: {
    padding: 20,
  },
  newsTitle: {
    color: 'white',
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    marginBottom: 12,
    lineHeight: 24,
  },
  metaData: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tagContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginRight: 8,
  },
  tagText: {
    color: 'white',
    fontSize: 12,
    fontFamily: 'Poppins-Medium',
  },
  date: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
  },
  readTime: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  readTimeText: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 12,
    marginLeft: 4,
    fontFamily: 'Poppins-Regular',
  },
  bookmark: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 12,
    padding: 10,
  },

  // ==== SAVED ARTICLES STYLES ====
  savedArticlesTitle: {
    color: 'white',
    fontSize: 22,
    fontFamily: 'Poppins-Bold',
    marginHorizontal: 16,
    marginBottom: 16,
  },
  savedArticlesList: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  emptyStateContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30,
    marginTop: 100,
  },
  emptyStateTitle: {
    color: 'white',
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    marginTop: 20,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyStateDescription: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    textAlign: 'center',
    marginBottom: 30,
  },
  browseButton: {
    backgroundColor: '#1904E5',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 30,
    marginTop: 10,
  },
  browseButtonText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
  },
  noResultsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30,
    paddingVertical: 60,
  },

  // ==== NEWS DETAIL STYLES ====
  detailScrollContainer: {
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
  detailContentContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  detailTitle: {
    color: 'white',
    fontSize: 24,
    fontFamily: 'Poppins-Bold',
    marginBottom: 16,
    lineHeight: 32,
  },
  detailMetaContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  categoryDateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailCategoryContainer: {
    backgroundColor: '#1904E5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginRight: 12,
  },
  detailCategoryText: {
    color: 'white',
    fontSize: 12,
    fontFamily: 'Poppins-Medium',
  },
  detailDateText: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
  },
  detailReadingTime: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailReadingTimeText: {
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
  tagTextDetail: {
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
  // Action buttons styles
  actionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  actionButton: {
    borderRadius: 30,
    paddingVertical: 14,
    paddingHorizontal: 24,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    flex: 1,
    marginRight: 10,
  },
  saveButtonActive: {
    backgroundColor: '#1904E5',
  },
  saveButtonInactive: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#1904E5',
  },
  saveButtonActiveText: {
    color: 'white',
  },
  saveButtonInactiveText: {
    color: '#1904E5',
  },
  actionButtonText: {
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
    marginLeft: 8,
  },
  shareButton: {
    backgroundColor: '#1904E5',
    borderRadius: 30,
    paddingVertical: 14,
    paddingHorizontal: 24,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    flex: 1,
  },
  shareButtonText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
    marginLeft: 8,
  },
});