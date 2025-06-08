import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
  Image,
  StatusBar,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { categoryHabitsStyles as styles } from '../../../../styles/discover/Habits/categoryHabitsStyles';
import { auth, db } from '../../../../config/firebase';
import { collection, addDoc, getDocs, query, where } from 'firebase/firestore';
import { useLanguage } from '../../../context/LanguageContext';

// Replace with your actual icon paths
const habitIcons = {
  writing: require('../../../../assets/icons/writting.png'),
  exercise: require('../../../../assets/images/exercise.png'),
  water: require('../../../../assets/icons/water.png'),
  meditation: require('../../../../assets/icons/meditation0.png'),
  reading: require('../../../../assets/icons/writting.png'),
  sleep: require('../../../../assets/images/moon.png'),
  social: require('../../../../assets/icons/social1.png'),
  family: require('../../../../assets/icons/family.png'),
  breakfast: require('../../../../assets/icons/breakfast.png'),
  phone: require('../../../../assets/icons/phone.png'),
};

const CategoryHabits = ({ navigation, route }) => {
  const { category } = route.params;
  const { t } = useLanguage();
  const [habits, setHabits] = useState([]);
  const [userHabits, setUserHabits] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategoryHabits();
    fetchUserHabits();
  }, []);

  // Get localized habits based on category
  const getCategoryHabits = (categoryId) => {
    const habitSets = {
      'preset': [
        { id: 'preset1', titleKey: 'drinkingWater', duration: 1, points: 1, icon: 'water' },
        { id: 'preset2', titleKey: 'exercise', duration: 2, points: 3, icon: 'exercise' },
        { id: 'preset3', titleKey: 'planYourDay', duration: 5, points: 2, icon: 'writing' },
        { id: 'preset4', titleKey: 'eatBreakfast', duration: 20, points: 2, icon: 'breakfast' },
        { id: 'preset5', titleKey: 'phoneFreeMorning', duration: 60, points: 2, icon: 'phone' },
        { id: 'preset6', titleKey: 'practiceYoga', duration: 20, points: 2, icon: 'exercise' },
        { id: 'preset7', titleKey: 'writeGoals', duration: 15, points: 3, icon: 'writing' },
        { id: 'preset8', titleKey: 'shower', duration: 15, points: 1, icon: 'water' },
      ],
      'must-haves': [
        { id: 'must1', titleKey: 'celebrateVictories', duration: 2, points: 2, icon: 'celebrate' },
        { id: 'must2', titleKey: 'visualizeDream', duration: 5, points: 2, icon: 'meditation' },
        { id: 'must3', titleKey: 'writeBestMoment', duration: 2, points: 2, icon: 'writing' },
        { id: 'must4', titleKey: 'eatBreakfast', duration: 20, points: 2, icon: 'breakfast' },
        { id: 'must5', titleKey: 'importantTasks', duration: 60, points: 2, icon: 'writing' },
        { id: 'must6', titleKey: 'useStairs', duration: 1, points: 2, icon: 'exercise' },
        { id: 'must7', titleKey: 'complimentYourself', duration: 1, points: 1, icon: 'social' },
        { id: 'must8', titleKey: 'improvePoints', duration: 2, points: 3, icon: 'writing' },
      ],
      'stress-free': [
        { id: 'stress1', titleKey: 'digitalDetox', duration: 60, points: 5, icon: 'phone' },
        { id: 'stress2', titleKey: 'haveFun', duration: 25, points: 2, icon: 'social' },
        { id: 'stress3', titleKey: 'parkTime', duration: 30, points: 2, icon: 'exercise' },
        { id: 'stress4', titleKey: 'meditate', duration: 10, points: 3, icon: 'meditation' },
        { id: 'stress5', titleKey: 'favoriteSport', duration: 60, points: 3, icon: 'exercise' },
        { id: 'stress6', titleKey: 'cookMeal', duration: 30, points: 1, icon: 'breakfast' },
        { id: 'stress7', titleKey: 'inspiringMusic', duration: 60, points: 2, icon: 'social' },
        { id: 'stress8', titleKey: 'grateful', duration: 2, points: 3, icon: 'writing' },
      ],
      'before-sleep': [
        { id: 'sleep1', titleKey: 'windDown', duration: 60, points: 1, icon: 'sleep' },
        { id: 'sleep2', titleKey: 'planTomorrow', duration: 10, points: 2, icon: 'writing' },
        { id: 'sleep3', titleKey: 'cleanDesk', duration: 2, points: 2, icon: 'writing' },
        { id: 'sleep4', titleKey: 'noEatBefore', duration: 5, points: 1, icon: 'breakfast' },
        { id: 'sleep5', titleKey: 'phoneFreeDinner', duration: 60, points: 2, icon: 'phone' },
        { id: 'sleep6', titleKey: 'todayWins', duration: 2, points: 2, icon: 'writing' },
        { id: 'sleep7', titleKey: 'bedBy9', duration: 10, points: 2, icon: 'sleep' },
        { id: 'sleep8', titleKey: 'vitamins', duration: 2, points: 1, icon: 'water' },
      ],
      'relationships': [
        { id: 'rel1', titleKey: 'sayILoveYou', duration: 1, points: 2, icon: 'social' },
        { id: 'rel2', titleKey: 'thankPeople', duration: 1, points: 2, icon: 'social' },
        { id: 'rel3', titleKey: 'familyTime', duration: 15, points: 1, icon: 'family' },
        { id: 'rel4', titleKey: 'friendsEvening', duration: 3 * 60, points: 3, icon: 'social' },
        { id: 'rel5', titleKey: 'actKindness', duration: 60, points: 3, icon: 'social' },
        { id: 'rel6', titleKey: 'networking', duration: 60, points: 1, icon: 'social' },
        { id: 'rel7', titleKey: 'childrenTime', duration: 60, points: 2, icon: 'family' },
        { id: 'rel8', titleKey: 'smileStranger', duration: 1, points: 2, icon: 'social' },
      ]
    };

    return habitSets[categoryId] || [];
  };

  const fetchCategoryHabits = () => {
    const categoryHabits = getCategoryHabits(category.id);
    
    // Add localized titles to habits
    const localizedHabits = categoryHabits.map(habit => ({
      ...habit,
      title: t(`habits.habitTitles.${habit.titleKey}`)
    }));
    
    setHabits(localizedHabits);
    setLoading(false);
  };

  const fetchUserHabits = async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        const userHabitsCollection = collection(db, 'user_habits');
        const userHabitsQuery = query(
          userHabitsCollection, 
          where('userId', '==', user.uid),
          where('category', '==', category.id)
        );
        const snapshot = await getDocs(userHabitsQuery);
        
        const userHabitIds = [];
        snapshot.forEach(doc => {
          userHabitIds.push(doc.data().habitId);
        });
        
        setUserHabits(userHabitIds);
      }
    } catch (error) {
      console.error('Error fetching user habits:', error);
    }
  };

  const addHabitToUser = async (habit) => {
    try {
      const user = auth.currentUser;
      if (user) {
        const userHabitData = {
          userId: user.uid,
          habitId: habit.id,
          title: habit.title,
          duration: habit.duration,
          points: habit.points,
          icon: habit.icon,
          category: category.id,
          completed: false,
          isUserHabit: true,
          createdAt: new Date().toISOString()
        };
        
        await addDoc(collection(db, 'user_habits'), userHabitData);
        
        // Update local state
        setUserHabits([...userHabits, habit.id]);
        
        Alert.alert(
          t('habits.habitAdded'),
          `"${habit.title}" ${t('habits.habitAddedSuccess')}`,
          [{ 
            text: t('common.ok') || 'OK', 
            onPress: () => {
              navigation.navigate('Habits', { refresh: true });
            }
          }]
        );
      }
    } catch (error) {
      console.error('Error adding habit to user:', error);
      Alert.alert(t('common.error'), t('habits.addHabitError'));
    }
  };

  const renderHabitItem = ({ item }) => {
    const isAdded = userHabits.includes(item.id);
    
    return (
      <View style={styles.habitCard}>
        <View style={styles.habitIconContainer}>
          <Image 
            source={habitIcons[item.icon] || habitIcons.writing} 
            style={styles.habitIcon}
            resizeMode="contain"
          />
        </View>
        
        <View style={styles.habitDetails}>
          <Text style={styles.habitTitle}>{item.title}</Text>
          <Text style={styles.habitSubtitle}>
            {item.duration} {t('habits.min')} · {item.points > 0 ? `+${item.points}` : item.points} {t('habits.point')}{item.points !== 1 ? t('habits.pointsPlural') : ''}
          </Text>
        </View>
        
        <TouchableOpacity 
          style={[styles.addButton, isAdded && styles.addedButton]}
          onPress={() => {
            if (!isAdded) {
              addHabitToUser(item);
            }
          }}
          disabled={isAdded}
        >
          <Text style={styles.addButtonText}>
            {isAdded ? t('habits.added') : t('habits.add')}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#03174C" />
      
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => {
            navigation.navigate('Habits', { refresh: true });
          }}
        >
          <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{category.title}</Text>
      </View>
      
      <FlatList
        data={habits}
        renderItem={renderHabitItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.habitsList}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

export default CategoryHabits;