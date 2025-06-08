import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
  Image,
  Alert,
  Animated,
  StatusBar
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Swipeable } from 'react-native-gesture-handler';
import { habitsStyles as styles } from '../../../../styles/discover/Habits/habitsStyles';
import { auth, db } from '../../../../config/firebase';
import { collection, getDocs, doc, updateDoc, deleteDoc, query, where } from 'firebase/firestore';
import { useFocusEffect } from '@react-navigation/native';
import CharacterAvatar from './CharacterAvatar';
import { useLanguage } from '../../../context/LanguageContext';

// Mock icons - replace with your actual icons paths
const habitIcons = {
  writing: require('../../../../assets/icons/writting.png'),
  exercise: require('../../../../assets/images/exercise.png'),
  water: require('../../../../assets/icons/water.png'),
  celebrate: require('../../../../assets/icons/celebrate.png'),
  main: require('../../../../assets/icons/main.png'),
  meditation: require('../../../../assets/icons/meditation0.png'),
  reading: require('../../../../assets/icons/writting.png'),
  sleep: require('../../../../assets/images/moon.png'),
  social: require('../../../../assets/icons/social1.png'),
  family: require('../../../../assets/icons/family.png'),
  breakfast: require('../../../../assets/icons/main.png'),
  phone: require('../../../../assets/icons/phone.png'),
};

const Habits = ({ navigation, route }) => {
  const { t } = useLanguage();
  const [habits, setHabits] = useState([]);
  const [userHabits, setUserHabits] = useState([]);
  const [totalPoints, setTotalPoints] = useState(0);
  const [level, setLevel] = useState(1);
  const [progress, setProgress] = useState(0);
  const [refreshKey, setRefreshKey] = useState(0);
  const [completionRate, setCompletionRate] = useState(0);
  const [showCharacter, setShowCharacter] = useState(false);
  
  // Animated values for character container
  const characterAnimation = useRef(new Animated.Value(0)).current;

  // This effect will run whenever the screen comes into focus
  // or when refreshKey changes
  useFocusEffect(
    React.useCallback(() => {
      // Check if we need to refresh (either from route params or screen focus)
      const shouldRefresh = route.params?.refresh || true;
      
      if (shouldRefresh) {
        fetchUserHabits();
        
        // Clear the refresh parameter after fetching
        if (route.params?.refresh) {
          navigation.setParams({ refresh: undefined });
        }
      }
      
      return () => {
        // Cleanup function if needed
      };
    }, [refreshKey, route.params?.refresh])
  );

  // Also use normal useEffect to handle initial load
  useEffect(() => {
    fetchUserHabits();
  }, []);

  useEffect(() => {
    // Calculate level based on total points
    calculateLevelAndProgress();
  }, [totalPoints]);
  
  // Calculate completion rate when habits change
  useEffect(() => {
    calculateCompletionRate();
  }, [userHabits]);
  
  // Animate character container when showCharacter changes
  useEffect(() => {
    Animated.timing(characterAnimation, {
      toValue: showCharacter ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [showCharacter]);

  const fetchUserHabits = async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        // Get user's selected habits
        const userHabitsCollection = collection(db, 'user_habits');
        const userHabitsQuery = query(userHabitsCollection, where('userId', '==', user.uid));
        const userHabitsSnapshot = await getDocs(userHabitsQuery);
        
        const userHabitsList = [];
        let points = 0;
        
        userHabitsSnapshot.forEach((doc) => {
          const habit = {
            id: doc.id,
            ...doc.data(),
            isUserHabit: true
          };
          userHabitsList.push(habit);
          
          // Add completed habit points to total
          if (habit.completed) {
            points += habit.points || 0;
          }
        });
        
        setUserHabits(userHabitsList);
        setTotalPoints(points);

        // Combine all habits for display
        const combinedHabits = [...userHabitsList];
        setHabits(combinedHabits);
      }
    } catch (error) {
      console.error('Error fetching habits:', error);
    }
  };

  const calculateLevelAndProgress = () => {
    // Define points needed for each level
    const pointsPerLevel = 20;
    const currentLevel = Math.floor(totalPoints / pointsPerLevel) + 1;
    const pointsInCurrentLevel = totalPoints % pointsPerLevel;
    const progressPercentage = (pointsInCurrentLevel / pointsPerLevel) * 100;
    
    setLevel(currentLevel);
    setProgress(progressPercentage);
  };
  
  const calculateCompletionRate = () => {
    if (userHabits.length === 0) {
      setCompletionRate(0);
      return;
    }
    
    const completedCount = userHabits.filter(habit => habit.completed).length;
    const rate = completedCount / userHabits.length;
    setCompletionRate(rate);
  };

  const toggleHabitCompletion = async (id, completed, isUserHabit) => {
    try {
      const user = auth.currentUser;
      if (user) {
        // Determine which collection to update
        const collectionPath = isUserHabit ? 'user_habits' : `preset_habits`;
        const habitRef = doc(db, collectionPath, id);
        
        await updateDoc(habitRef, {
          completed: !completed,
          lastCompletedAt: new Date().toISOString()
        });
        
        // Update local state based on which list the habit belongs to
        if (isUserHabit) {
          const updatedHabits = userHabits.map(habit => 
            habit.id === id ? { ...habit, completed: !completed } : habit
          );
          setUserHabits(updatedHabits);
          
          // Update combined habits list
          const updatedCombined = habits.map(habit => 
            habit.id === id ? { ...habit, completed: !completed } : habit
          );
          setHabits(updatedCombined);
        }
        
        // Recalculate total points
        let points = 0;
        const habitsToCount = [...userHabits].map(h => 
          h.id === id ? { ...h, completed: !completed } : h
        );
        
        habitsToCount.forEach(habit => {
          if (habit.completed) {
            points += habit.points || 0;
          }
        });
        
        setTotalPoints(points);
        
        // Show celebration animation for newly completed habits
        if (!completed) {
          // Show character after completing a habit
          setShowCharacter(true);
          
          // Hide character after 3 seconds
          setTimeout(() => {
            setShowCharacter(false);
          }, 3000);
        }
      }
    } catch (error) {
      console.error('Error updating habit completion:', error);
    }
  };

  const deleteHabit = async (id, isUserHabit) => {
    try {
      const user = auth.currentUser;
      if (user) {
        if (isUserHabit) {
          await deleteDoc(doc(db, 'user_habits', id));
      
          const updatedUserHabits = userHabits.filter(habit => habit.id !== id);
          setUserHabits(updatedUserHabits);
          const updatedHabits = habits.filter(habit => habit.id !== id);
          setHabits(updatedHabits);
   
          let points = 0;
          updatedUserHabits.forEach(habit => {
            if (habit.completed) {
              points += habit.points || 0;
            }
          });
          
          setTotalPoints(points);
        }
      }
    } catch (error) {
      console.error('Error deleting habit:', error);
    }
  };

  const renderRightActions = (progress, dragX, id, isUserHabit) => {
    // Only show delete option for user habits
    if (!isUserHabit) return null;
    
    const trans = dragX.interpolate({
      inputRange: [-100, 0],
      outputRange: [0, 100],
      extrapolate: 'clamp',
    });
    
    return (
      <Animated.View
        style={[
          styles.deleteAction,
          {
            transform: [{ translateX: trans }],
          },
        ]}>
        <TouchableOpacity
          onPress={() => {
            Alert.alert(
              t('habits.deleteHabit'),
              t('habits.deleteConfirmation'),
              [
                { text: t('common.cancel'), style: "cancel" },
                { text: t('habits.delete'), onPress: () => deleteHabit(id, isUserHabit), style: "destructive" }
              ]
            );
          }}
          style={styles.deleteButton}
        >
          <Text style={styles.deleteText}>{t('habits.delete')}</Text>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  // Updated renderHabitItem function for Habits.jsx
  const renderHabitItem = ({ item }) => {
    return (
      <Swipeable
        renderRightActions={(progress, dragX) => 
          renderRightActions(progress, dragX, item.id, item.isUserHabit)
        }
      >
        <View style={styles.habitCard}>
          <View style={styles.habitIconContainer}>
            {item.emoji && (item.iconType === 'emoji' || !item.icon) ? (
              // If the habit has an emoji and it's marked as an emoji type, display it with white color
              <Text style={[styles.habitEmoji, { color: '#FFFFFF' }]}>{item.emoji}</Text>
            ) : (
              // Otherwise, use the image icon
              <Image 
                source={habitIcons[item.icon] || habitIcons.main} 
                style={styles.habitIcon} 
                resizeMode="contain"
              />
            )}
          </View>
          
          <View style={styles.habitDetails}>
            <Text style={styles.habitTitle}>{item.title}</Text>
            <Text style={styles.habitSubtitle}>
              {item.duration} {t('habits.min')} · {item.points > 0 ? `+${item.points}` : item.points} {t('habits.point')}{item.points !== 1 ? t('habits.pointsPlural') : ''}
            </Text>
          </View>
          
          <View style={styles.habitActions}>
            <TouchableOpacity
              style={[
                styles.checkButton,
                item.completed && styles.checkButtonCompleted
              ]}
              onPress={() => toggleHabitCompletion(item.id, item.completed, item.isUserHabit)}
            >
              {item.completed && <Ionicons name="checkmark" size={20} color="#FFFFFF" />}
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.menuButton}>
              <Ionicons name="ellipsis-horizontal" size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>
      </Swipeable>
    );
  };

  const handleAddHabit = () => {
    navigation.navigate('AddHabits');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#03174C" />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{t('habits.myHabits')}</Text>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={handleAddHabit}
        >
          <Text style={styles.addButtonText}>{t('habits.addAHabit')}</Text>
          <Ionicons name="add-circle" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
      
      <FlatList
        data={habits}
        renderItem={renderHabitItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.habitsList}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>{t('habits.noHabitsYet')}</Text>
          </View>
        }
      />
      
      {/* Character container with animation */}
      <Animated.View style={[
        styles.characterContainer,
        {
          opacity: characterAnimation,
          transform: [
            { 
              translateY: characterAnimation.interpolate({
                inputRange: [0, 1],
                outputRange: [50, 0],
              })
            }
          ]
        }
      ]}>
        <CharacterAvatar 
          level={level} 
          completionRate={completionRate} 
        />
      </Animated.View>
      
      <View style={styles.levelContainer}>
        <View style={styles.levelHeader}>
          <View>
            <Text style={styles.levelTitle}>{t('habits.level')} {level}</Text>
            <Text style={styles.levelPoints}>{totalPoints} {t('habits.totalPoints')}</Text>
          </View>
          
          {/* User avatar button that toggles character display */}
          <TouchableOpacity 
            style={styles.userAvatarButton}
            onPress={() => setShowCharacter(!showCharacter)}
          >
            <View style={styles.userAvatarCircle}>
              <Ionicons name="person" size={18} color="#FFFFFF" />
            </View>
          </TouchableOpacity>
        </View>
        
        <View style={styles.progressContainer}>
          <View style={styles.progressBackground}>
            <View 
              style={[
                styles.progressFill,
                { width: `${progress}%` }
              ]} 
            />
          </View>
          <Text style={styles.progressText}>
            {Math.floor(progress)}% {t('habits.toLevel')} {level + 1}
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Habits;