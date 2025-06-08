// Meditation.jsx - Updated with multi-language support
import React, { useState, useEffect } from 'react';
import { View, Text, SafeAreaView, Image, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../../../config/firebase';
import { meditationStyles as styles } from '../../../../styles/discover/meditation/MeditationStyles';
import { useLanguage } from '../../../context/LanguageContext';

const Meditation = ({ navigation }) => {
  const { t } = useLanguage();
  
  const getMeditationCategories = () => [
    {
      title: t('meditation.categories.overallWellbeing'),
      items: [
        { 
          id: '1', 
          titleKey: 'introToMeditation',
          title: t('meditation.titles.introToMeditation'), 
          image: require('../../../../assets/icons/intro.png'), 
          duration: '5 min' 
        },
        { 
          id: '2', 
          titleKey: 'fosterMindfulness',
          title: t('meditation.titles.fosterMindfulness'), 
          image: require('../../../../assets/icons/mindfulness.png'), 
          duration: '12 min' 
        },
        { 
          id: '3', 
          titleKey: 'lovingKindness',
          title: t('meditation.titles.lovingKindness'), 
          image: require('../../../../assets/icons/loving.png'), 
          duration: '13 min' 
        },
      ]
    },
    {
      title: t('meditation.categories.mindset'),
      items: [
        { 
          id: '4', 
          titleKey: 'focusingOnWork',
          title: t('meditation.titles.focusingOnWork'), 
          image: require('../../../../assets/icons/work.png'), 
          duration: '11 min' 
        },
        { 
          id: '5', 
          titleKey: 'focusingOnStudy',
          title: t('meditation.titles.focusingOnStudy'), 
          image: require('../../../../assets/icons/study.png'), 
          duration: '12 min' 
        },
      ]
    },
    {
      title: t('meditation.categories.dealingWithChallenges'),
      items: [
        { 
          id: '6', 
          titleKey: 'fiveSenses',
          title: t('meditation.titles.fiveSenses'), 
          image: require('../../../../assets/icons/senses.png'), 
          duration: '7 min' 
        },
        { 
          id: '7', 
          titleKey: 'positivityBoost',
          title: t('meditation.titles.positivityBoost'), 
          image: require('../../../../assets/icons/positivity.png'), 
          duration: '9 min' 
        },
        { 
          id: '8', 
          titleKey: 'lettingGo',
          title: t('meditation.titles.lettingGo'), 
          image: require('../../../../assets/icons/lettinggo.png'), 
          duration: '11 min' 
        },
      ]
    },
    {
      title: t('meditation.categories.sleep'),
      items: [
        { 
          id: '9', 
          titleKey: 'fallingAsleep',
          title: t('meditation.titles.fallingAsleep'), 
          image: require('../../../../assets/icons/fallasleep.png'), 
          duration: '12 min' 
        },
        { 
          id: '10', 
          titleKey: 'soothingSleep',
          title: t('meditation.titles.soothingSleep'), 
          image: require('../../../../assets/icons/soothe.png'), 
          duration: '11 min' 
        },
      ]
    },
  ];

  const [meditationCategories, setMeditationCategories] = useState([]);

  useEffect(() => {
    // Update categories when language changes
    setMeditationCategories(getMeditationCategories());
  }, [t]); // Re-run when translation function changes

  useEffect(() => {
    // You could fetch meditation categories from Firestore here if needed
    setMeditationCategories(getMeditationCategories());
  }, []);

  const handleMeditationPress = (meditation) => {
    // Pass the original English title for backend compatibility
    const englishTitleMap = {
      'introToMeditation': 'Intro to Meditation',
      'fosterMindfulness': 'Foster Mindfulness',
      'lovingKindness': 'Loving-Kindness',
      'focusingOnWork': 'Focusing on Work',
      'focusingOnStudy': 'Focusing on Study',
      'fiveSenses': 'Five Senses',
      'positivityBoost': 'Positivity Boost',
      'lettingGo': 'Letting Go',
      'fallingAsleep': 'Falling Asleep',
      'soothingSleep': 'Soothing Sleep'
    };
    
    const englishTitle = englishTitleMap[meditation.titleKey] || meditation.title;
    
    navigation.navigate('IntroMeditation', { 
      meditationId: meditation.id, 
      meditationTitle: englishTitle, 
      duration: meditation.duration 
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#03174C', '#03174C']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradientContainer}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{t('meditation.title')}</Text>
          <View style={{width: 24}} />
        </View>
        
        <ScrollView style={styles.content}>
          {meditationCategories.map((category, index) => (
            <View key={index} style={styles.categoryContainer}>
              <Text style={styles.categoryTitle}>{category.title}</Text>
              <View style={styles.itemsContainer}>
                {category.items.map((item) => (
                  <TouchableOpacity 
                    key={item.id} 
                    style={styles.meditationItem}
                    onPress={() => handleMeditationPress(item)}
                  >
                    <View style={styles.itemImageContainer}>
                      <Image source={item.image} style={styles.itemImage} />
                    </View>
                    <Text style={styles.itemTitle}>{item.title}</Text>
                    <Text style={styles.itemDuration}>{item.duration}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          ))}
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
};

export default Meditation;