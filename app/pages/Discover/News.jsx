import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
  Share,
  FlatList,
  Animated
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { newsStyles as styles } from '../../../styles/discover/newsStyles';
import { useLanguage } from '../../context/LanguageContext';

const API_KEY = '4419e91b3de34a8eaee0a18c923fc5e8';

// Main News List Component
const News = () => {
  const navigation = useNavigation();
  const { t } = useLanguage();
  const [articles, setArticles] = useState([]);
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [savedArticles, setSavedArticles] = useState([]);
  const [activeTab, setActiveTab] = useState('discover'); // 'discover' or 'saved'
  const [fadeAnim] = useState(new Animated.Value(1));

  // Get localized categories
  const getCategories = () => ({
    All: 'mental health psychology wellness',
    [t('news.categories.practices')]: 'meditation mindfulness therapy practices psychology',
    [t('news.categories.mental')]: 'mental health therapy depression anxiety psychology',
    [t('news.categories.biological')]: 'neuroscience brain psychology research',
    [t('news.categories.other')]: 'psychology self-help personal development'
  });

  useEffect(() => {
    fetchArticles(selectedCategory);
    loadSavedArticles();
  }, [selectedCategory]);

  useEffect(() => {
    filterArticles();
  }, [searchText, articles, activeTab, savedArticles]);

  // Load saved articles from storage
  const loadSavedArticles = async () => {
    try {
      const savedData = await AsyncStorage.getItem('savedArticles');
      if (savedData) {
        setSavedArticles(JSON.parse(savedData));
      }
    } catch (error) {
      console.error('Error loading saved articles:', error);
    }
  };

  // Save articles to storage
  const saveArticlesToStorage = async (updatedSavedArticles) => {
    try {
      await AsyncStorage.setItem('savedArticles', JSON.stringify(updatedSavedArticles));
    } catch (error) {
      console.error('Error saving articles:', error);
    }
  };

  const fetchArticles = async (category) => {
    setLoading(true);
    try {
      const categories = getCategories();
      const query = categories[category] || categories['All'];
      const response = await fetch(
        `https://newsapi.org/v2/everything?q=${query}&language=en&sortBy=publishedAt&pageSize=50&apiKey=${API_KEY}`
      );
      const data = await response.json();
      
      // Less restrictive filtering for initial load
      const validArticles = data.articles.filter(article => 
        article.title && 
        article.urlToImage &&
        (article.title.toLowerCase().includes('psychology') ||
         article.title.toLowerCase().includes('mental') ||
         article.title.toLowerCase().includes('wellness') ||
         article.title.toLowerCase().includes('health') ||
         article.title.toLowerCase().includes('therapy') ||
         article.description?.toLowerCase().includes('psychology') ||
         article.description?.toLowerCase().includes('mental health') ||
         article.description?.toLowerCase().includes('wellness'))
      );
      
      // Add saved status to each article
      const articlesWithSavedStatus = validArticles.map(article => {
        const isSaved = savedArticles.some(savedArticle => 
          savedArticle.title === article.title
        );
        return { ...article, isSaved };
      });
      
      setArticles(articlesWithSavedStatus);
      setFilteredArticles(articlesWithSavedStatus);
    } catch (error) {
      console.error('Error fetching articles:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterArticles = () => {
    if (activeTab === 'saved') {
      const filtered = searchText.trim() ? 
        savedArticles.filter(article => 
          article.title?.toLowerCase().includes(searchText.toLowerCase()) ||
          article.description?.toLowerCase().includes(searchText.toLowerCase()) ||
          article.content?.toLowerCase().includes(searchText.toLowerCase())
        ) : 
        savedArticles;
      
      setFilteredArticles(filtered);
      return;
    }
    
    if (!searchText.trim()) {
      setFilteredArticles(articles);
      return;
    }

    const searchLower = searchText.toLowerCase();
    const filtered = articles.filter(article => {
      const titleMatch = article.title?.toLowerCase().includes(searchLower);
      const descriptionMatch = article.description?.toLowerCase().includes(searchLower);
      const contentMatch = article.content?.toLowerCase().includes(searchLower);
      
      return titleMatch || descriptionMatch || contentMatch;
    });

    setFilteredArticles(filtered);
  };

  const toggleSaveArticle = (article) => {
    const isArticleSaved = savedArticles.some(savedArticle => 
      savedArticle.title === article.title
    );
    
    let updatedSavedArticles;
    
    if (isArticleSaved) {
      // Remove from saved articles
      updatedSavedArticles = savedArticles.filter(savedArticle => 
        savedArticle.title !== article.title
      );
    } else {
      // Add to saved articles
      updatedSavedArticles = [...savedArticles, { ...article, isSaved: true }];
    }
    
    // Update saved articles state and storage
    setSavedArticles(updatedSavedArticles);
    saveArticlesToStorage(updatedSavedArticles);
    
    // Update the isSaved flag in the articles array
    const updatedArticles = articles.map(a => 
      a.title === article.title ? { ...a, isSaved: !isArticleSaved } : a
    );
    setArticles(updatedArticles);
    
    // Also update filtered articles if needed
    setFilteredArticles(prevFiltered => 
      prevFiltered.map(a => 
        a.title === article.title ? { ...a, isSaved: !isArticleSaved } : a
      )
    );
  };

  const getReadingTime = (content) => {
    if (!content) return '3';
    const wordsPerMinute = 200;
    const wordCount = content.split(/\s+/).length;
    return Math.ceil(wordCount / wordsPerMinute);
  };

  const handleNewsCardPress = (article) => {
    navigation.navigate('OpenNews', {
      article: article,
      category: selectedCategory,
      allArticles: articles, // Pass all articles for related content generation
      onToggleSave: (updatedArticle) => {
        toggleSaveArticle(updatedArticle);
      }
    });
  };

  const switchTab = (tab) => {
    if (tab === activeTab) return;
    
    // Fade out current content
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 150,
      useNativeDriver: true,
    }).start(() => {
      setActiveTab(tab);
      
      // Fade in new content
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }).start();
    });
  };

  const NewsCard = ({ article }) => (
    <TouchableOpacity 
      style={styles.newsCard}
      onPress={() => handleNewsCardPress(article)}
      activeOpacity={0.8}
    >
      <Image
        source={{ 
          uri: article.urlToImage || 'https://via.placeholder.com/400x200?text=Psychology' 
        }}
        style={styles.newsImage}
      />
      <View style={styles.cardContent}>
        <Text style={styles.newsTitle} numberOfLines={2}>
          {article.title}
        </Text>
        <View style={styles.metaData}>
          <View style={{ flexDirection: 'row' }}>
            <View style={styles.tagContainer}>
              <Text style={styles.tagText}>{selectedCategory}</Text>
            </View>
            <View style={styles.readTime}>
              <Ionicons name="time-outline" size={14} color="rgba(255, 255, 255, 0.6)" />
              <Text style={styles.readTimeText}>
                {getReadingTime(article.content)} {t('news.minRead')}
              </Text>
            </View>
          </View>
          <Text style={styles.date}>
            {new Date(article.publishedAt).toLocaleDateString()}
          </Text>
        </View>
      </View>
      <TouchableOpacity 
        style={styles.bookmark}
        onPress={(e) => {
          e.stopPropagation(); // Prevent triggering the parent onPress
          toggleSaveArticle(article);
        }}
      >
        <Ionicons 
          name={article.isSaved ? "bookmark" : "bookmark-outline"} 
          size={24} 
          color="white" 
        />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const EmptySavedState = () => (
    <View style={styles.emptyStateContainer}>
      <Ionicons name="bookmark" size={60} color="rgba(255, 255, 255, 0.2)" />
      <Text style={styles.emptyStateTitle}>{t('news.noSavedArticles')}</Text>
      <Text style={styles.emptyStateDescription}>
        {t('news.savedArticlesDescription')}
      </Text>
      <TouchableOpacity 
        style={styles.browseButton}
        onPress={() => switchTab('discover')}
      >
        <Text style={styles.browseButtonText}>{t('news.browseArticles')}</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'discover' && styles.activeTab]}
          onPress={() => switchTab('discover')}
        >
          <Ionicons 
            name="newspaper-outline" 
            size={18} 
            color={activeTab === 'discover' ? '#FFFFFF' : 'rgba(255, 255, 255, 0.6)'} 
          />
          <Text 
            style={[
              styles.tabText, 
              activeTab === 'discover' && styles.activeTabText
            ]}
          >
            {t('news.discover')}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'saved' && styles.activeTab]}
          onPress={() => switchTab('saved')}
        >
          <Ionicons 
            name="bookmark-outline" 
            size={18} 
            color={activeTab === 'saved' ? '#FFFFFF' : 'rgba(255, 255, 255, 0.6)'}
          />
          <Text 
            style={[
              styles.tabText, 
              activeTab === 'saved' && styles.activeTabText
            ]}
          >
            {t('news.mySaves')}
          </Text>
          {savedArticles.length > 0 && (
            <View style={styles.savedCountBadge}>
              <Text style={styles.savedCountText}>{savedArticles.length}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={24} color="rgba(255, 255, 255, 0.6)" />
        <TextInput
          style={styles.searchInput}
          placeholder={activeTab === 'discover' ? t('news.searchPlaceholder') : t('news.searchSavedPlaceholder')}
          placeholderTextColor="rgba(255, 255, 255, 0.6)"
          value={searchText}
          onChangeText={setSearchText}
        />
        {searchText ? (
          <TouchableOpacity onPress={() => setSearchText('')}>
            <Ionicons name="close-circle" size={24} color="rgba(255, 255, 255, 0.6)" />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity>
            <Ionicons name="options-outline" size={24} color="rgba(255, 255, 255, 0.6)" />
          </TouchableOpacity>
        )}
      </View>

      <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
        {activeTab === 'discover' ? (
          <>
            {/* Categories - Only show in Discover tab */}
            <View style={styles.categoriesContainer}>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.categoryScroll}
              >
                {Object.keys(getCategories()).map((category) => (
                  <TouchableOpacity
                    key={category}
                    style={[
                      styles.categoryButton,
                      selectedCategory === category && styles.selectedCategory,
                    ]}
                    onPress={() => setSelectedCategory(category)}
                  >
                    <Text
                      style={[
                        styles.categoryText,
                        selectedCategory === category && styles.selectedCategoryText,
                      ]}
                    >
                      {category}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* News List */}
            <ScrollView 
              style={styles.newsList}
              showsVerticalScrollIndicator={false}
            >
              {loading ? (
                <ActivityIndicator size="large" color="#1904E5" style={{ marginTop: 40 }} />
              ) : filteredArticles.length > 0 ? (
                filteredArticles.map((article, index) => (
                  <NewsCard key={index} article={article} />
                ))
              ) : (
                <View style={styles.noResultsContainer}>
                  <Ionicons name="search" size={60} color="rgba(255, 255, 255, 0.2)" />
                  <Text style={styles.emptyStateTitle}>
                    {t('news.noArticlesFound')} {searchText ? `${t('news.for')} "${searchText}"` : ''}
                  </Text>
                  <Text style={styles.emptyStateDescription}>
                    {t('news.tryDifferentKeywords')}
                  </Text>
                </View>
              )}
            </ScrollView>
          </>
        ) : (
          // Saved Articles Tab
          <View style={{ flex: 1 }}>
            <Text style={styles.savedArticlesTitle}>
              {savedArticles.length > 0 ? 
                `${t('news.savedArticles')} (${filteredArticles.length})` : 
                t('news.savedArticles')}
            </Text>
            
            {savedArticles.length === 0 ? (
              <EmptySavedState />
            ) : filteredArticles.length === 0 ? (
              <View style={styles.noResultsContainer}>
                <Ionicons name="search" size={60} color="rgba(255, 255, 255, 0.2)" />
                <Text style={styles.emptyStateTitle}>
                  {t('news.noSavedArticlesFound')} "{searchText}"
                </Text>
                <Text style={styles.emptyStateDescription}>
                  {t('news.tryDifferentKeywordsOrCheck')}
                </Text>
              </View>
            ) : (
              <FlatList
                data={filteredArticles}
                keyExtractor={(item, index) => `saved-${index}`}
                renderItem={({ item }) => <NewsCard article={item} />}
                contentContainerStyle={styles.savedArticlesList}
                showsVerticalScrollIndicator={false}
              />
            )}
          </View>
        )}
      </Animated.View>
    </SafeAreaView>
  );
};

// Open News Detail Component
const OpenNews = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { t } = useLanguage();
  const { article, category, allArticles = [], onToggleSave } = route.params;
  const [isSaved, setIsSaved] = useState(article.isSaved || false);
  const [loading, setLoading] = useState(true);
  const [relatedArticles, setRelatedArticles] = useState([]);

  useEffect(() => {
    // Generate dynamic related articles based on current article
    generateRelatedArticles();
    
    // Simulate loading for a better UX
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [article.title]); // Re-run when article changes

  // Function to find related articles based on content similarity
  const generateRelatedArticles = () => {
    if (!allArticles || allArticles.length === 0) {
      setGenericRelatedArticles();
      return;
    }

    try {
      // Extract keywords from current article
      const keywords = extractKeywords(article.title + ' ' + (article.description || ''));
      
      // Score each article based on keyword matches
      const scoredArticles = allArticles
        .filter(a => a.title !== article.title) // Filter out current article
        .map(a => {
          const articleText = (a.title + ' ' + (a.description || '')).toLowerCase();
          const score = keywords.reduce((total, keyword) => {
            return total + (articleText.includes(keyword.toLowerCase()) ? 1 : 0);
          }, 0);
          return { ...a, score };
        });
      
      // Sort by score (highest first) and take top 3
      const related = scoredArticles
        .sort((a, b) => b.score - a.score)
        .slice(0, 3);
      
      if (related.length > 0) {
        setRelatedArticles(related);
      } else {
        // If no related articles found with keyword matching
        findRelatedByCategory();
      }
    } catch (error) {
      console.error('Error generating related articles:', error);
      setGenericRelatedArticles();
    }
  };

  // Find related articles by same category if keyword matching fails
  const findRelatedByCategory = () => {
    try {
      const categoryRelated = allArticles
        .filter(a => a.title !== article.title)
        .slice(0, 3);
      
      if (categoryRelated.length > 0) {
        setRelatedArticles(categoryRelated);
      } else {
        setGenericRelatedArticles();
      }
    } catch (error) {
      setGenericRelatedArticles();
    }
  };

  // Extract meaningful keywords from text
  const extractKeywords = (text) => {
    if (!text) return ['psychology', 'mental', 'health'];
    
    // Remove common words and punctuation
    const cleanText = text.toLowerCase()
      .replace(/[^\w\s]/g, '')
      .replace(/\s+/g, ' ');
    
    // Split into words
    const words = cleanText.split(' ');
    
    // Filter out common words and short words
    const significantWords = words.filter(word => 
      word.length > 4 && 
      !['about', 'after', 'again', 'also', 'another', 'because', 'being', 'between', 
        'could', 'doing', 'during', 'every', 'first', 'found', 'their', 'there', 
        'these', 'those', 'through', 'under', 'where', 'which', 'while', 'would'].includes(word)
    );
    
    // Get unique keywords
    const uniqueKeywords = [...new Set(significantWords)];
    
    // Return top keywords or defaults if not enough found
    return uniqueKeywords.length >= 3 ? 
      uniqueKeywords.slice(0, 5) : 
      [...uniqueKeywords, 'psychology', 'mental', 'health'].slice(0, 5);
  };

  // Fallback function for generic related articles
  const setGenericRelatedArticles = () => {
    setRelatedArticles([
      {
        id: '1',
        title: t('news.defaultArticles.meditation'),
        urlToImage: 'https://via.placeholder.com/400x200?text=Meditation',
        publishedAt: new Date().toISOString(),
        content: t('news.defaultArticles.meditationContent')
      },
      {
        id: '2',
        title: t('news.defaultArticles.anxiety'),
        urlToImage: 'https://via.placeholder.com/400x200?text=Anxiety',
        publishedAt: new Date().toISOString(),
        content: t('news.defaultArticles.anxietyContent')
      },
      {
        id: '3',
        title: t('news.defaultArticles.happiness'),
        urlToImage: 'https://via.placeholder.com/400x200?text=Happiness',
        publishedAt: new Date().toISOString(),
        content: t('news.defaultArticles.happinessContent')
      },
    ]);
  };

  const getReadingTime = (content) => {
    if (!content) return '3';
    const wordsPerMinute = 200;
    const wordCount = content.split(/\s+/).length;
    return Math.ceil(wordCount / wordsPerMinute);
  };

  const toggleSave = () => {
    setIsSaved(!isSaved);
    
    // Send the updated state back to the parent component
    if (onToggleSave) {
      const updatedArticle = { ...article, isSaved: !isSaved };
      onToggleSave(updatedArticle);
    }
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `${t('news.checkOutArticle')}: ${article.title} - ${article.url}`,
      });
    } catch (error) {
      console.error(error);
    }
  };

  const formatContent = (content) => {
    if (!content) return t('news.noContentAvailable');
    // Remove truncation text often added by News API
    return content.replace(/\[\+\d+ chars\]$/, '');
  };

  const handleBack = () => {
    navigation.goBack();
  };

  // Function to extract possible tags from article content
  const extractTags = () => {
    const possibleTags = [
      t('news.tags.mentalHealth'), 
      t('news.tags.psychology'), 
      t('news.tags.wellness'), 
      t('news.tags.therapy'), 
      t('news.tags.mindfulness'), 
      t('news.tags.stress'), 
      t('news.tags.anxiety'), 
      t('news.tags.depression')
    ];
    const foundTags = [];
    
    // Look for tags in title and description
    const textToSearch = (article.title + ' ' + (article.description || '')).toLowerCase();
    
    possibleTags.forEach(tag => {
      if (textToSearch.includes(tag.toLowerCase())) {
        foundTags.push(tag);
      }
    });
    
    // Return at least 3 tags, if not enough found, add some default ones
    if (foundTags.length < 3) {
      const remainingCount = 3 - foundTags.length;
      for (let i = 0; i < remainingCount; i++) {
        const tagToAdd = possibleTags[i];
        if (!foundTags.includes(tagToAdd)) {
          foundTags.push(tagToAdd);
        }
      }
    }
    
    return foundTags;
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#1904E5" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.detailScrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Header with image */}
        <View style={styles.headerContainer}>
          <Image
            source={{ uri: article.urlToImage || 'https://via.placeholder.com/400x200?text=Psychology' }}
            style={styles.coverImage}
            resizeMode="cover"
          />
          <View style={styles.gradientOverlay} />
          
          {/* Back button */}
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          
          {/* Save button */}
          <TouchableOpacity style={styles.saveButton} onPress={toggleSave}>
            <Ionicons 
              name={isSaved ? "bookmark" : "bookmark-outline"} 
              size={24} 
              color="white" 
            />
          </TouchableOpacity>
        </View>
        
        {/* Content */}
        <View style={styles.detailContentContainer}>
          {/* Title */}
          <Text style={styles.detailTitle}>{article.title}</Text>
          
          {/* Meta info (category, date, reading time) */}
          <View style={styles.detailMetaContainer}>
            <View style={styles.categoryDateContainer}>
              <View style={styles.detailCategoryContainer}>
                <Text style={styles.detailCategoryText}>{category}</Text>
              </View>
              <Text style={styles.detailDateText}>
                {new Date(article.publishedAt).toLocaleDateString()}
              </Text>
            </View>
            
            <View style={styles.detailReadingTime}>
              <Ionicons name="time-outline" size={14} color="rgba(255, 255, 255, 0.6)" />
              <Text style={styles.detailReadingTimeText}>
                {getReadingTime(article.content)} {t('news.minRead')}
              </Text>
            </View>
          </View>
          
          {/* Author info */}
          <View style={styles.authorContainer}>
            <View style={styles.authorImageContainer}>
              <Image
                source={{ uri: 'https://via.placeholder.com/40x40?text=A' }}
                style={styles.authorImage}
              />
            </View>
            <View style={styles.authorNameContainer}>
              <Text style={styles.authorLabel}>{t('news.author')}</Text>
              <Text style={styles.authorName}>{article.author || t('news.unknownAuthor')}</Text>
            </View>
          </View>
          
          {/* Article content */}
          <Text style={styles.content}>
            {article.description ? article.description + '\n\n' : ''}
            {formatContent(article.content)}
          </Text>
          
          {/* Tags */}
          <View style={styles.tagsContainer}>
            {extractTags().map((tag, index) => (
              <View key={index} style={styles.tag}>
                <Text style={styles.tagTextDetail}>#{tag}</Text>
              </View>
            ))}
          </View>
          
          {/* Save and Share buttons */}
          <View style={styles.actionButtonsContainer}>
            <TouchableOpacity 
              style={[styles.actionButton, isSaved ? styles.saveButtonActive : styles.saveButtonInactive]} 
              onPress={toggleSave}
            >
              <Ionicons 
                name={isSaved ? "bookmark" : "bookmark-outline"} 
                size={20} 
                color={isSaved ? "white" : "#1904E5"} 
              />
              <Text style={[styles.actionButtonText, isSaved ? styles.saveButtonActiveText : styles.saveButtonInactiveText]}>
                {isSaved ? t('news.saved') : t('news.save')}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
              <Ionicons name="share-social-outline" size={20} color="white" />
              <Text style={styles.shareButtonText}>{t('news.shareArticle')}</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.separator} />
          
          {/* Related articles */}
          <View style={styles.relatedContainer}>
            <Text style={styles.relatedTitle}>{t('news.relatedArticles')}</Text>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingRight: 20 }}
            >
              {relatedArticles.map((relatedArticle, index) => (
                <TouchableOpacity 
                  key={index} 
                  style={styles.relatedCard}
                  onPress={() => {
                    // Navigate to a new instance of OpenNews with the related article
                    navigation.push('OpenNews', {
                      article: relatedArticle,
                      category: category,
                      allArticles: allArticles, // Pass all articles again for the next screen
                      onToggleSave: onToggleSave // Pass the callback
                    });
                  }}
                >
                  <Image
                    source={{ uri: relatedArticle.urlToImage || 'https://via.placeholder.com/400x200?text=Psychology' }}
                    style={styles.relatedImage}
                    resizeMode="cover"
                  />
                  <Text style={styles.relatedCardTitle} numberOfLines={2}>
                    {relatedArticle.title}
                  </Text>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={styles.detailDateText}>
                      {new Date(relatedArticle.publishedAt).toLocaleDateString()}
                    </Text>
                    <View style={styles.detailReadingTime}>
                      <Ionicons name="time-outline" size={12} color="rgba(255, 255, 255, 0.6)" />
                      <Text style={styles.detailReadingTimeText}>
                        {getReadingTime(relatedArticle.content)} {t('news.min')}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

// Export both components
export { News as default, OpenNews };