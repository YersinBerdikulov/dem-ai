import React, { useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { styles } from '../../../../styles/discover/testStyles';
// Import activity tracker
import { trackActivity, ACTIVITY_TYPES } from '../../../../utils/activityTracker';
// Import language context
import { useLanguage } from '../../../context/LanguageContext';

const Test = () => {
  const navigation = useNavigation();
  const { t } = useLanguage();

  useEffect(() => {
    // Track test page view
    trackActivity(ACTIVITY_TYPES.TEST, {
      action: 'view_tests_page',
      timestamp: new Date().toISOString()
    });
  }, []);

  const handleWorryTest = () => {
    // Track test selection
    trackActivity(ACTIVITY_TYPES.TEST, {
      action: 'select_test',
      testType: 'worry',
      timestamp: new Date().toISOString()
    });
    
    navigation.navigate('WorryTest');
  };

  const handleSelfEsteemTest = () => {
    // Track test selection
    trackActivity(ACTIVITY_TYPES.TEST, {
      action: 'select_test',
      testType: 'self_esteem',
      timestamp: new Date().toISOString()
    });
    
    navigation.navigate('SelfEsteemTest');
  };

  const handleLifeSatisfaction = () => {
    // Track test selection
    trackActivity(ACTIVITY_TYPES.TEST, {
      action: 'select_test',
      testType: 'life_satisfaction',
      timestamp: new Date().toISOString()
    });
    
    navigation.navigate('LifeSatisfaction');
  };

  const handleInsomniaRating = () => {
    // Track test selection
    trackActivity(ACTIVITY_TYPES.TEST, {
      action: 'select_test',
      testType: 'insomnia_rating',
      timestamp: new Date().toISOString()
    });
    
    navigation.navigate('InsomniaRating');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header Image Card */}
        <View style={styles.headerImageCard}>
          <LinearGradient
            colors={['#92FFC0', '#002661']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.gradientBackground}
          />
          <Image 
            source={require('../../../../assets/images/reading.png')}
            style={styles.headerImage}
          />
        </View>

        {/* Header Text Section */}
        <View style={styles.headerTextContainer}>
          <Text style={styles.title}>
            {t('test.title')}
          </Text>
          <Text style={styles.description}>
            {t('test.description')}
          </Text>
        </View>

        {/* Test Cards Grid */}
        <View style={styles.cardGrid}>
          <TouchableOpacity
            style={styles.card}
            onPress={handleWorryTest}
          >
            <LinearGradient
              colors={['#92FFC0', '#002661']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.gradientBackground}
            />
            <View style={styles.cardContent}>
              <Image 
                source={require('../../../../assets/images/test.png')}
                style={styles.cardImage}
              />
              <Text style={styles.cardText}>{t('test.worryTest')}</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.card}
            onPress={handleSelfEsteemTest}
          >
            <LinearGradient
              colors={['#92FFC0', '#002661']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.gradientBackground}
            />
            <View style={styles.cardContent}>
              <Image 
                source={require('../../../../assets/images/test.png')}
                style={styles.cardImage}
              />
              <Text style={styles.cardText}>{t('test.selfEsteemTest')}</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.card}
            onPress={handleLifeSatisfaction}
          >
            <LinearGradient
              colors={['#92FFC0', '#002661']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.gradientBackground}
            />
            <View style={styles.cardContent}>
              <Image 
                source={require('../../../../assets/images/test.png')}
                style={styles.cardImage}
              />
              <Text style={styles.cardText}>{t('test.lifeSatisfaction')}</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.card}
            onPress={handleInsomniaRating}
          >
            <LinearGradient
              colors={['#92FFC0', '#002661']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.gradientBackground}
            />
            <View style={styles.cardContent}>
              <Image 
                source={require('../../../../assets/images/test.png')}
                style={styles.cardImage}
              />
              <Text style={styles.cardText}>{t('test.insomniaRating')}</Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

// Export a function to track test completion from the test result screens
export const trackTestCompletion = (testType, score, result) => {
  trackActivity(ACTIVITY_TYPES.TEST, {
    action: 'complete_test',
    testType: testType,
    score: score,
    result: result,
    completionTime: new Date().toISOString()
  });
};

export default Test;