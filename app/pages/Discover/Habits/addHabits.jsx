import React, { useState } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Image,
  StatusBar
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { addHabitsStyles as styles } from '../../../../styles/discover/Habits/addHabitsStyles';
import { useLanguage } from '../../../context/LanguageContext';

const AddHabits = ({ navigation }) => {
  const { t } = useLanguage();
  const [activeFilter, setActiveFilter] = useState('#preset');

  // Get localized categories
  const getPresetCategories = () => [
    {
      id: 'preset',
      title: t('habits.categories.startYourDay'),
      color: '#A4C2F4',
      icon: require('../../../../assets/images/sun.png'),
      description: t('habits.descriptions.startYourDay'),
    },
    {
      id: 'must-haves',
      title: t('habits.categories.mustHaves'),
      color: '#B6E5D8',
      icon: require('../../../../assets/images/checklist.png'),
      description: t('habits.descriptions.mustHaves'),
    },
    {
      id: 'stress-free',
      title: t('habits.categories.stressFree'),
      color: '#FFDA6A',
      icon: require('../../../../assets/images/exercise.png'),
      description: t('habits.descriptions.stressFree'),
    },
    {
      id: 'before-sleep',
      title: t('habits.categories.beforeSleep'),
      color: '#733CF1',
      icon: require('../../../../assets/images/moon.png'),
      description: t('habits.descriptions.beforeSleep'),
    },
    {
      id: 'relationships',
      title: t('habits.categories.relationships'),
      color: '#F2A6B3',
      icon: require('../../../../assets/images/heart.png'),
      description: t('habits.descriptions.relationships'),
    }
  ];

  // Get localized filters
  const getFilters = () => [
    '#preset',
    t('habits.filters.all'),
    t('habits.filters.mustHaves'),
    t('habits.filters.stress'),
    t('habits.filters.sleep')
  ];

  const presetCategories = getPresetCategories();
  const filters = getFilters();

  const handleCategorySelect = (category) => {
    navigation.navigate('CategoryHabits', { category });
  };

  const handleCreateHabit = () => {
    navigation.navigate('CreateHabit');
  };

  const renderCategoryCard = (category) => {
    return (
      <TouchableOpacity
        key={category.id}
        style={[
          styles.categoryCard,
          { backgroundColor: category.color }
        ]}
        onPress={() => handleCategorySelect(category)}
      >
        <View style={styles.categoryContent}>
          <Text style={styles.categoryTitle}>{category.title}</Text>
          <Text style={styles.categoryDescription}>{category.description}</Text>
        </View>
        
        <View style={styles.categoryIconContainer}>
          <Image 
            source={category.icon} 
            style={styles.categoryIcon} 
            resizeMode="contain"
          />
        </View>
      </TouchableOpacity>
    );
  };

  // Get the title to display based on active filter
  const getSectionTitle = () => {
    if (activeFilter === '#preset') return t('habits.sections.preset');
    if (activeFilter === t('habits.filters.all')) return t('habits.sections.allCategories');
    if (activeFilter === t('habits.filters.mustHaves')) return t('habits.categories.mustHaves');
    if (activeFilter === t('habits.filters.stress')) return t('habits.categories.stressFree');
    if (activeFilter === t('habits.filters.sleep')) return t('habits.categories.beforeSleep');
    return activeFilter.replace('#', '');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#03174C" />
      
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('habits.addHabits')}</Text>
      </View>
      
      <View style={styles.filtersScrollContainer}>
        <ScrollView 
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filtersContainer}
        >
          {filters.map((filter) => (
            <TouchableOpacity
              key={filter}
              style={[
                styles.filterButton,
                activeFilter === filter && styles.activeFilterButton
              ]}
              onPress={() => setActiveFilter(filter)}
            >
              <Text 
                style={[
                  styles.filterText,
                  activeFilter === filter && styles.activeFilterText
                ]}
              >
                {filter}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      
      <TouchableOpacity 
        style={styles.createHabitButton}
        onPress={handleCreateHabit}
      >
        <Ionicons name="add-circle" size={20} color="#FFFFFF" style={styles.createButtonIcon} />
        <Text style={styles.createButtonText}>{t('habits.createYourOwn')}</Text>
      </TouchableOpacity>
      
      <Text style={styles.sectionTitle}>
        {getSectionTitle()}
      </Text>
      
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.categoriesContainer}
      >
        {presetCategories
          .filter(cat => 
            activeFilter === t('habits.filters.all') || 
            activeFilter === '#preset' || 
            (`#${cat.id}` === activeFilter) ||
            (activeFilter === t('habits.filters.stress') && cat.id === 'stress-free') ||
            (activeFilter === t('habits.filters.sleep') && cat.id === 'before-sleep')
          )
          .map(category => renderCategoryCard(category))
        }
      </ScrollView>
    </SafeAreaView>
  );
};

export default AddHabits;