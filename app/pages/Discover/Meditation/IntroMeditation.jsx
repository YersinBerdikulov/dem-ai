// IntroMeditation.jsx - Updated with multi-language support
import React from 'react';
import { View, Text, SafeAreaView, Image, TouchableOpacity, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { introPageStyles as styles } from '../../../../styles/discover/meditation/IntroPageStyles';
import { useLanguage } from '../../../context/LanguageContext';

const IntroMeditation = ({ route, navigation }) => {
  const { meditationId, meditationTitle, duration } = route.params;
  const { t } = useLanguage();

  const getImageSource = () => {
    // Using meditation title key for consistency
    const titleKey = getMeditationTitleKey(meditationTitle);
    switch(titleKey) {
      case 'introToMeditation':
        return require('../../../../assets/icons/intro.png');
      case 'fosterMindfulness':
        return require('../../../../assets/icons/mindfulness.png');
      case 'lovingKindness':
        return require('../../../../assets/icons/loving.png');
      case 'focusingOnWork':
        return require('../../../../assets/icons/work.png');
      case 'focusingOnStudy':
        return require('../../../../assets/icons/study.png');
      case 'fiveSenses':
        return require('../../../../assets/icons/senses.png');
      case 'positivityBoost':
        return require('../../../../assets/icons/positivity.png');
      case 'lettingGo':
        return require('../../../../assets/icons/lettinggo.png');
      case 'fallingAsleep':
        return require('../../../../assets/icons/fallasleep.png');
      case 'soothingSleep':
        return require('../../../../assets/icons/soothe.png');
      default:
        return require('../../../../assets/icons/intro.png');
    }
  };

  const getMeditationTitleKey = (title) => {
    // Map English titles to keys for consistency
    const titleMap = {
      'Intro to Meditation': 'introToMeditation',
      'Foster Mindfulness': 'fosterMindfulness',
      'Loving-Kindness': 'lovingKindness',
      'Focusing on Work': 'focusingOnWork',
      'Focusing on Study': 'focusingOnStudy',
      'Five Senses': 'fiveSenses',
      'Positivity Boost': 'positivityBoost',
      'Letting Go': 'lettingGo',
      'Falling Asleep': 'fallingAsleep',
      'Soothing Sleep': 'soothingSleep'
    };
    return titleMap[title] || 'introToMeditation';
  };

  const getMeditationDescription = () => {
    const titleKey = getMeditationTitleKey(meditationTitle);
    return t(`meditation.descriptions.${titleKey}`) || 
           "Learn the principles and techniques to make your meditation practice effective and satisfying.";
  };

  const getLocalizedTitle = () => {
    const titleKey = getMeditationTitleKey(meditationTitle);
    return t(`meditation.titles.${titleKey}`) || meditationTitle;
  };

  const handleStart = () => {
    navigation.navigate('SoundMeditation', { 
      meditationId, 
      meditationTitle,
      duration
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
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
          <Text style={styles.headerTitle}>{getLocalizedTitle()}</Text>
          <View style={{width: 24}} />
        </View>
        
        <View style={styles.content}>
          <View style={styles.imageContainer}>
            <Image source={getImageSource()} style={styles.image} />
          </View>
          
          <View style={styles.infoContainer}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>{t('meditation.duration')}</Text>
              <Text style={styles.infoValue}>{duration}</Text>
            </View>
            
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>{t('meditation.learnAbout')}</Text>
              <Text style={styles.infoDescription}>
                {getMeditationDescription()}
              </Text>
            </View>
          </View>
          
          <TouchableOpacity style={styles.startButton} onPress={handleStart}>
            <Text style={styles.startButtonText}>{t('meditation.start')}</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
};

export default IntroMeditation;