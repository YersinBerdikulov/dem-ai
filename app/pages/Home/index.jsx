// Home.jsx - Updated with multi-language support
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
  ActivityIndicator
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { homeStyles } from '../../../styles/home/styles';
import { useNavigation } from '@react-navigation/native';
import { auth, db } from '../../../config/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { DISCOVER_CARDS } from '../../../constants/discoverData';
import { ACTIVITY_TYPES, trackActivity } from '../../../utils/activityTracker';
import { sessionService } from '../../../services/firebase-service';
import { useLanguage } from '../../context/LanguageContext';

// Helper function to ensure LinearGradient doesn't cause Android errors
const getSafeGradientProps = (colors, start = { x: 0, y: 0 }, end = { x: 1, y: 0 }) => {
  // Ensure we have at least 2 colors
  let safeColors;
  if (!colors) {
    safeColors = ['#03174C', '#03174C'];
  } else if (!Array.isArray(colors)) {
    safeColors = [colors, colors];
  } else if (colors.length === 0) {
    safeColors = ['#03174C', '#03174C'];
  } else if (colors.length === 1) {
    safeColors = [colors[0], colors[0]];
  } else {
    safeColors = colors;
  }
  
  // Ensure start and end positions are different
  let safeEnd = { ...end };
  if (start.x === end.x && start.y === end.y) {
    safeEnd = { x: end.x + 0.01, y: end.y + 0.01 };
  }
  
  return {
    colors: safeColors,
    start,
    end: safeEnd
  };
};

const Home = () => {
  const navigation = useNavigation();
  const { t } = useLanguage(); // Add language hook
  
  const [userData, setUserData] = useState({
    fullName: '',
    avatarUrl: null,
    activityCounts: {},
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [recentActivities, setRecentActivities] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    fetchUserData();
    
    const unsubscribe = navigation.addListener('focus', () => {
      fetchUserData();
      // Clear search query when returning to home
      setSearchQuery('');
      setIsSearching(false);
    });
    
    return unsubscribe;
  }, [navigation]);

  const fetchUserData = async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          const data = userDoc.data();
          
          // If avatar URL exists, use it, otherwise keep null
          const avatarUrl = data.avatar || null;

          setUserData({
            fullName: data.fullName || user.email?.split('@')[0] || 'User',
            avatarUrl: avatarUrl ? avatarUrl : null,
            activityCounts: data.activityCounts || {},
          });
          
          // Get recent activities from the user document
          if (data.recentActivities && data.recentActivities.length > 0) {
            generateRecentActivitiesFromData(data.recentActivities);
          } else {
            setRecentActivities([]);
          }
        }
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };
  
  const generateRecentActivitiesFromData = (recentActivitiesData) => {
    try {
      // Map the recent activities to the correct card format
      const recentCards = recentActivitiesData.map(activity => {
        // Find the corresponding card from DISCOVER_CARDS
        const card = DISCOVER_CARDS.find(c => c.id === activity.cardId);
        
        if (!card) return null;
        
        // Create timestamp for display (like "2 days ago" or "Just now")
        const timestamp = new Date(activity.timestamp);
        const now = new Date();
        const diffTime = Math.abs(now - timestamp);
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        
        let timeAgo;
        if (diffDays === 0) {
          // Less than a day ago
          const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
          if (diffHours === 0) {
            // Less than an hour ago
            const diffMinutes = Math.floor(diffTime / (1000 * 60));
            if (diffMinutes === 0) {
              timeAgo = t('home.justNow') || 'Just now';
            } else {
              timeAgo = `${diffMinutes} ${t('home.minAgo') || 'min ago'}`;
            }
          } else {
            timeAgo = `${diffHours} ${t('home.hrsAgo') || 'hrs ago'}`;
          }
        } else if (diffDays === 1) {
          timeAgo = t('home.yesterday') || 'Yesterday';
        } else {
          timeAgo = `${diffDays} ${t('home.daysAgo') || 'days ago'}`;
        }
        
        return {
          ...card,
          duration: timeAgo,
        };
      }).filter(Boolean); // Remove null entries
      
      setRecentActivities(recentCards);
    } catch (error) {
      console.error('Error generating recent activities:', error);
      setRecentActivities([]);
    }
  };
  
  // Create a new session and navigate to chat with search query as initial message
  const handleSearchSubmit = async () => {
    if (!searchQuery.trim() || isSearching) return;
    
    try {
      setIsSearching(true);
      
      // Track this activity
      trackActivity(ACTIVITY_TYPES.AFFIRMATION, { 
        details: 'Chat started from search with: ' + searchQuery
      });
      
      // Create a new chat session
      const newSessionId = await sessionService.createSession(
        // Use search query as session title, truncate if too long
        searchQuery.length > 30 ? searchQuery.substring(0, 27) + '...' : searchQuery
      );
      
      // Navigate to chat session with initial message
      navigation.navigate('Chat', {
        screen: 'Session',
        params: {
          sessionId: newSessionId,
          initialMessage: searchQuery.trim()
        }
      });
    } catch (error) {
      console.error('Error starting chat from search:', error);
      setIsSearching(false);
    }
  };
  
  const handleChatPress = () => {
    // Track this activity
    trackActivity(ACTIVITY_TYPES.AFFIRMATION, { details: 'Chat session started' });
    
    navigation.navigate('Chat', {
      screen: 'Session',
    });
  };

  // FIXED: Updated navigation logic to handle direct navigation
  const handleDiscoverPress = (screen, activityType = null) => {
    // Track the activity if an activity type is provided
    if (activityType) {
      trackActivity(activityType, { details: `Visited ${screen}` });
    }
    
    // Navigate to the appropriate screen
    if (screen === 'Breathing') {
      // Direct navigation to BreathingStarts with source parameter
      navigation.navigate('BreathingStarts', { 
        source: 'Home' // Add source parameter to identify where it came from
      });
    } else if (screen === 'News') {
      // Direct navigation to News with source parameter
      navigation.navigate('News', { 
        source: 'Home' // Add source parameter to identify where it came from
      });
    } else if (screen === 'NatureSounds') {
      // Direct navigation to NatureSounds with source parameter
      navigation.navigate('NatureSounds', { 
        source: 'Home' // Add source parameter to identify where it came from
      });
    } else if (screen === 'PersonalityTest') {
      navigation.navigate('PersonalityTest');
    } else {
      // For other discover screens, navigate through the Discover stack
      navigation.navigate('Discover', {
        screen: screen,
      });
    }
  };

  // FIXED: Handle navigation for recent activities
  const handleRecentActivityPress = (item) => {
    // Map the activity type back for tracking
    const cardToTypeMap = {
      'Diary': ACTIVITY_TYPES.DIARY,
      'relaxation': ACTIVITY_TYPES.BREATHING,
      'affiramation': ACTIVITY_TYPES.AFFIRMATION,
      'Games': ACTIVITY_TYPES.GAME,
      'Test': ACTIVITY_TYPES.TEST,
      'habits': ACTIVITY_TYPES.HABIT
    };
    
    const activityType = cardToTypeMap[item.id];
    
    // Special handling for breathing exercise, news, and nature sounds from recent activities
    if (item.route === 'BreathingStarts') {
      navigation.navigate('BreathingStarts', { 
        source: 'Home' // Add source parameter
      });
    } else if (item.route === 'News') {
      navigation.navigate('News', { 
        source: 'Home' // Add source parameter
      });
    } else if (item.route === 'NatureSounds') {
      navigation.navigate('NatureSounds', { 
        source: 'Home' // Add source parameter
      });
    } else {
      handleDiscoverPress(item.route, activityType);
    }
  };

  return (
    <SafeAreaView style={homeStyles.container}>
      <ScrollView
        style={homeStyles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={homeStyles.header}>
          <View style={homeStyles.userInfo}>
            {userData.avatarUrl ? (
              <Image
                source={{ uri: userData.avatarUrl }}
                style={homeStyles.avatar}
              />
            ) : (
              <View style={homeStyles.avatarPlaceholder}>
                <Ionicons name="person" size={40} color="#666" />
              </View>
            )}
            <Text style={homeStyles.userName}>{t('home.greeting')}, {userData.fullName}</Text>
          </View>
          <View style={homeStyles.headerIcons}>
            <TouchableOpacity onPress={() => navigation.navigate('Notifications')}>
              <Ionicons name="notifications-outline" size={24} color="white" />
            </TouchableOpacity>
          </View>
        </View>

        <Text style={homeStyles.title}>
          {t('home.title')}
        </Text>

        {/* Search Bar with loading indicator */}
        <View style={homeStyles.searchContainer}>
          <Ionicons name="search" size={24} color="rgba(255, 255, 255, 0.6)" />
          <TextInput
            placeholder={t('home.searchPlaceholder')}
            placeholderTextColor="rgba(255, 255, 255, 0.6)"
            style={homeStyles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearchSubmit}
            returnKeyType="search"
            editable={!isSearching}
          />
          <TouchableOpacity 
            onPress={handleSearchSubmit}
            disabled={!searchQuery.trim() || isSearching}
          >
            {isSearching ? (
              <ActivityIndicator size="small" color="rgba(255, 255, 255, 0.6)" />
            ) : (
              <Ionicons 
                name="arrow-forward" 
                size={24} 
                color={searchQuery.trim() ? "rgba(255, 255, 255, 0.8)" : "rgba(255, 255, 255, 0.6)"}
              />
            )}
          </TouchableOpacity>
        </View>

        {/* Main Cards Container */}
        <View style={homeStyles.cardsContainer}>
          <TouchableOpacity activeOpacity={0.7} onPress={handleChatPress}>
            {/* Talk Card */}
            <LinearGradient
              {...getSafeGradientProps(['#555A63', '#D8BD20'])}
              style={homeStyles.talkCard}
            >
              <View style={homeStyles.cardContentRow}>
                <Text style={homeStyles.cardTitle}>{t('home.talkCard')}</Text>
                <Image
                  source={require('../../../assets/images/meditation.png')}
                  style={homeStyles.cardIcon}
                />
              </View>
            </LinearGradient>
          </TouchableOpacity>

          <View style={homeStyles.cardsRow}>
            {/* Left Side - Breathing Exercise */}
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => handleDiscoverPress('Breathing', ACTIVITY_TYPES.BREATHING)}
            >
              <LinearGradient
                {...getSafeGradientProps(['#F05F57', '#360940'], { x: 0, y: 0 }, { x: 1, y: 1 })}
                style={homeStyles.breathingCard}
              >
                <Image
                  source={require('../../../assets/images/breathing.png')}
                  style={[homeStyles.cardIcon, styles.topRightIcon]}
                />
                <View style={homeStyles.cardContent}>
                  <Text style={homeStyles.cardTitle}>{t('home.breathingExercise')}</Text>
                </View>
              </LinearGradient>
            </TouchableOpacity>

            {/* Right Side Column */}
            <View style={styles.rightColumn}>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => handleDiscoverPress('NatureSounds')}
              >
                <LinearGradient
                  {...getSafeGradientProps(['#52E5E7', '#130CB7'], { x: 0, y: 0 }, { x: 1, y: 1 })}
                  style={homeStyles.regularCard}
                >
                  <Image
                    source={require('../../../assets/images/soundscape.png')}
                    style={[homeStyles.cardIcon, styles.topRightIcon]}
                  />
                  <View style={homeStyles.cardContent}>
                    <Text style={homeStyles.cardTitle}>{t('home.soundscape')}</Text>
                  </View>
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => handleDiscoverPress('News')}
              >
                <LinearGradient
                  {...getSafeGradientProps(['#EE9AE5', '#5961F9'], { x: 0, y: 0 }, { x: 1, y: 1 })}
                  style={homeStyles.regularCard}
                >
                  <Image
                    source={require('../../../assets/images/news.png')}
                    style={[homeStyles.cardIcon, styles.topRightIcon]}
                  />
                  <View style={homeStyles.cardContent}>
                    <Text style={homeStyles.cardTitle}>{t('home.news')}</Text>
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
          
          {/* Personality Test Card */}
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => handleDiscoverPress('PersonalityTest', ACTIVITY_TYPES.TEST)}
            style={{ marginTop: 16 }}
          >
            <LinearGradient
              {...getSafeGradientProps(['#8E2DE2', '#4A00E0'])}
              style={homeStyles.talkCard}
            >
              <View style={homeStyles.cardContentRow}>
                <Text style={homeStyles.cardTitle}>{t('home.personalityTest')}</Text>
                <Image
                  source={require('../../../assets/icons/PersonalityTest.png')}
                  style={homeStyles.cardIcon}
                />
              </View>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Recent Packs Section */}
        <Text style={homeStyles.sectionTitle}>{t('home.recentPacks')}</Text>
        {recentActivities.length > 0 ? (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={homeStyles.recentPacksScroll}
            contentContainerStyle={{ paddingRight: 20 }}
          >
            {recentActivities.map((item) => (
              <TouchableOpacity 
                key={item.id}
                activeOpacity={0.7}
                onPress={() => handleRecentActivityPress(item)}
              >
                <LinearGradient
                  {...getSafeGradientProps(item.colors, { x: 0, y: 0 }, { x: 1, y: 1 })}
                  style={homeStyles.recentCard}
                >
                  <Text style={homeStyles.recentCardTitle}>{item.title}</Text>
                  <Text style={homeStyles.duration}>{item.duration}</Text>
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </ScrollView>
        ) : (
          <View style={styles.emptyRecentPacks}>
            <Ionicons name="time-outline" size={40} color="rgba(255, 255, 255, 0.3)" />
            <Text style={styles.emptyText}>{t('home.noRecentActivities')}</Text>
            <Text style={styles.emptySubtext}>{t('home.recentActivitiesSubtext')}</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  rightColumn: {
    flex: 1,
    gap: 12,
  },
  topRightIcon: {
    position: 'absolute',
    top: 20,
    right: 20,
  },
  emptyRecentPacks: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 20,
    padding: 30,
    marginBottom: 20,
  },
  emptyText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.7)',
    marginTop: 12,
  },
  emptySubtext: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.5)',
    marginTop: 4,
    textAlign: 'center',
  },
  loadingIcon: {
    opacity: 0.6,
    transform: [{ rotate: '45deg' }]
  }
});

export default Home;