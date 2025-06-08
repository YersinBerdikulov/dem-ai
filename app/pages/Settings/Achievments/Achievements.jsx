import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Image,
  ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { auth, db } from '../../../../config/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { achievementStyles as styles } from '../../../../styles/settings/achievementStyles';
import { useLanguage } from '../../../context/LanguageContext';

const Achievements = ({ navigation }) => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('badges');
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetchUserAchievements();
  }, []);

  // Fetch user achievements or get default achievements
  const fetchUserAchievements = async () => {
    try {
      setLoading(true);
      const user = auth.currentUser;
      if (!user) {
        setLoading(false);
        return;
      }

      // Always get the default achievements first
      const defaultAchievements = getDefaultAchievements();
      
      // Get user document
      const userRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userRef);
      
      if (userDoc.exists()) {
        const userData = userDoc.data();
        // Get achievements array or empty array if it doesn't exist
        const userAchievements = userData.achievements || [];
        
        // If there are user achievements, update the completed status in defaults
        if (userAchievements.length > 0) {
          // Create a map of user achievements by ID for quick lookup
          const userAchievementsMap = {};
          userAchievements.forEach(achievement => {
            userAchievementsMap[achievement.id] = achievement;
          });
          
          // Update default achievements with user progress
          const mergedAchievements = defaultAchievements.map(defaultAchievement => {
            const userAchievement = userAchievementsMap[defaultAchievement.id];
            if (userAchievement) {
              return {
                ...defaultAchievement,
                progress: userAchievement.progress || 0,
                completed: userAchievement.completed || false
              };
            }
            return defaultAchievement;
          });
          
          setAchievements(mergedAchievements);
        } else {
          // No user achievements yet, use defaults
          setAchievements(defaultAchievements);
        }
      } else {
        // User document doesn't exist, use default achievements
        setAchievements(defaultAchievements);
      }
    } catch (error) {
      console.error('Error fetching user achievements:', error);
      // Fall back to default achievements if there's an error
      setAchievements(getDefaultAchievements());
    } finally {
      setLoading(false);
    }
  };

  // Default achievements for new users or when there's an error
  const getDefaultAchievements = () => {
    return [
      { 
        id: 'diary1', 
        title: t('achievements.achievements.diary1'), 
        icon: 'book', 
        color: '#4CAF50', 
        progress: 0,
        completed: false,
        type: 'badge'
      },
      { 
        id: 'diary7', 
        title: t('achievements.achievements.diary7'), 
        icon: 'book', 
        color: '#4CAF50', 
        progress: 0,
        completed: false,
        type: 'badge'
      },
      { 
        id: 'diary30', 
        title: t('achievements.achievements.diary30'), 
        icon: 'book', 
        color: '#4CAF50', 
        progress: 0,
        completed: false,
        type: 'badge'
      },
      { 
        id: 'breathing1', 
        title: t('achievements.achievements.breathing1'), 
        icon: 'medkit', 
        color: '#2196F3', 
        progress: 0,
        completed: false,
        type: 'badge'
      },
      { 
        id: 'test1', 
        title: t('achievements.achievements.test1'), 
        icon: 'clipboard', 
        color: '#FF9800', 
        progress: 0,
        completed: false,
        type: 'badge'
      },
      { 
        id: 'test4', 
        title: t('achievements.achievements.test4'), 
        icon: 'clipboard', 
        color: '#FF9800', 
        progress: 0,
        completed: false,
        type: 'badge'
      },
      { 
        id: 'game1', 
        title: t('achievements.achievements.game1'), 
        icon: 'game-controller', 
        color: '#673AB7', 
        progress: 0,
        completed: false,
        type: 'badge'
      },
      { 
        id: 'game2', 
        title: t('achievements.achievements.game2'), 
        icon: 'game-controller', 
        color: '#673AB7', 
        progress: 0,
        completed: false,
        type: 'badge'
      },
      { 
        id: 'habit1', 
        title: t('achievements.achievements.habit1'), 
        icon: 'calendar', 
        color: '#009688', 
        progress: 0,
        completed: false,
        type: 'badge'
      },
      { 
        id: 'affirmation1', 
        title: t('achievements.achievements.affirmation1'), 
        icon: 'heart', 
        color: '#E91E63', 
        progress: 0,
        completed: false,
        type: 'badge'
      }
    ];
  };

  const renderIcon = (item) => {
    // Use any available image assets from your app
    try {
      if (item.icon === 'book') {
        return <Image source={require('../../../../assets/icons/daily.png')} style={styles.achievementIcon} />;
      } else if (item.icon === 'clipboard') {
        return <Image source={require('../../../../assets/icons/medal-test.png')} style={styles.achievementIcon} />;
      } else if (item.icon === 'game-controller') {
        return <Image source={require('../../../../assets/icons/game-medal.png')} style={styles.achievementIcon} />;
      } else if (item.icon === 'heart') {
        return <Image source={require('../../../../assets/icons/medal-heart.png')} style={styles.achievementIcon} />;
      } else if (item.icon === 'calendar') {
        return <Image source={require('../../../../assets/icons/medal-1.png')} style={styles.achievementIcon} />;
      } else if (item.icon === 'medkit') {
        return <Image source={require('../../../../assets/icons/medal-breath.png')} style={styles.achievementIcon} />;
      } else if (item.icon === 'trophy') {
        return <Image source={require('../../../../assets/icons/medal-1.png')} style={styles.achievementIcon} />;
      }
    } catch (error) {
      console.error("Error loading image:", error);
    }
    
    // Fallback to Ionicons
    return <Ionicons name={item.icon || "checkmark-circle"} size={24} color={item.color || "#FFD700"} />;
  };

  // Sort achievements by completion status and progress
  const sortedAchievements = [...achievements].sort((a, b) => {
    // First sort by completion status (completed first)
    if (a.completed && !b.completed) return -1;
    if (!a.completed && b.completed) return 1;
    
    // Then sort by progress (higher progress first)
    return b.progress - a.progress;
  });

  // Check if there are completed achievements
  const hasCompletedAchievements = sortedAchievements.some(item => item.completed);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.title}>{t('achievements.title')}</Text>
      </View>

      <View style={styles.tabContainer}>
       
      
      </View>

      <Text style={styles.infoText}>
        {t('achievements.infoText')}
      </Text>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#1904E5" />
        </View>
      ) : (
        <ScrollView 
          style={styles.achievementsContainer}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.achievementsContentContainer}
        >
          {/* Completed achievements section */}
          {hasCompletedAchievements && (
            <>
              <Text style={styles.sectionHeader}>{t('achievements.completed')}</Text>
              {sortedAchievements
                .filter(item => item.completed)
                .map((item, index) => (
                  <View key={`completed-${item.id || index}`} style={styles.achievementCard}>
                    {renderIcon(item)}
                    <View style={styles.achievementContent}>
                      <Text style={styles.achievementTitle}>{item.title}</Text>
                      <View style={styles.progressBarContainer}>
                        <View 
                          style={[
                            styles.progressBar, 
                            { width: `${item.progress || 0}%` }
                          ]} 
                        />
                      </View>
                    </View>
                    <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
                  </View>
                ))
              }
            </>
          )}

          {/* Incomplete achievements section */}
          <Text style={styles.sectionHeader}>{t('achievements.available')}</Text>
          {sortedAchievements
            .filter(item => !item.completed)
            .map((item, index) => (
              <View key={`available-${item.id || index}`} style={styles.achievementCard}>
                {renderIcon(item)}
                <View style={styles.achievementContent}>
                  <Text style={styles.achievementTitle}>{item.title}</Text>
                  <View style={styles.progressBarContainer}>
                    <View 
                      style={[
                        styles.progressBar, 
                        { width: `${item.progress || 0}%` },
                        !item.completed && styles.incompleteProgressBar
                      ]} 
                    />
                  </View>
                </View>
              </View>
            ))}
          
          {sortedAchievements.length === 0 && (
            <View style={styles.emptyStateContainer}>
              <Text style={styles.emptyStateText}>
                {t('achievements.emptyStateText')}
              </Text>
            </View>
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

export default Achievements;