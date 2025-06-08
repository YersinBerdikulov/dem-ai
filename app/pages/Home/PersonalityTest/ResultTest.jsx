// ResultTest.jsx - Updated with multi-language support
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
  StatusBar,
  Share,
  Animated
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { styles } from '../../../../styles/home/resultPageStyles';
import { useLanguage } from '../../../context/LanguageContext';

const ResultTest = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { t } = useLanguage(); // Add language hook
  
  // Animation values
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(50));
  
  // Get the results from route params
  const {
    personalityType,
    personalityDescription,
    personalityStrengths,
    personalityWeaknesses,
    personalityTips,
    counts,
    personalityIcon
  } = route.params;

  // Calculate percentages for the chart
  const [percentages, setPercentages] = useState({
    introvert: 0,
    extrovert: 0,
    ambivert: 0
  });

  useEffect(() => {
    if (counts) {
      const total = counts.A + counts.B + counts.C;
      setPercentages({
        introvert: Math.round((counts.A / total) * 100),
        extrovert: Math.round((counts.B / total) * 100),
        ambivert: Math.round((counts.C / total) * 100)
      });
    }
    
    // Start entrance animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      })
    ]).start();
  }, [counts]);

  // Get gradient colors based on personality type
  const getGradientColors = () => {
    // Check both translated and English versions for compatibility
    if (personalityType === t('personalityTest.introvert') || personalityType === 'Introvert') {
      return ['#81C784', '#A8D8C6'];
    } else if (personalityType === t('personalityTest.extrovert') || personalityType === 'Extrovert') {
      return ['#64B5F6', '#B3E5FC'];
    } else if (personalityType === t('personalityTest.ambivert') || personalityType === 'Ambivert') {
      return ['#CE93D8', '#E1BEE7'];
    } else {
      return ['#FFFFFF', '#F5F5F5'];
    }
  };

  // Function to share results
  const shareResults = async () => {
    try {
      // Create article check for translated personality type
      const personalityTypeForArticle = personalityType.toLowerCase();
      const needsArticle = personalityTypeForArticle.charAt(0) === 'a' || 
                          personalityTypeForArticle.charAt(0) === 'e' || 
                          personalityTypeForArticle.charAt(0) === 'i' || 
                          personalityTypeForArticle.charAt(0) === 'o' || 
                          personalityTypeForArticle.charAt(0) === 'u';
      
      const shareMessage = `${t('results.shareMessage')}${needsArticle ? 'n' : ''} ${personalityType}! ${personalityDescription.replace("Congratulations! ", "").replace("As an ", "").replace("As a ", "")}`;
      
      await Share.share({
        message: shareMessage,
        title: t('results.shareTitle'),
      });
    } catch (error) {
      console.error("Error sharing results:", error);
    }
  };

  // Function to take the test again
  const retakeTest = () => {
    navigation.navigate('PersonalityTest');
  };

  // Get the thriving text for the personality type
  const getThrivingText = () => {
    if (personalityType === t('personalityTest.introvert') || personalityType === 'Introvert') {
      return t('results.thrivingAs') + ' ' + t('personalityTest.introvert');
    } else if (personalityType === t('personalityTest.extrovert') || personalityType === 'Extrovert') {
      return t('results.thrivingAs') + ' ' + t('personalityTest.extrovert');
    } else {
      return t('results.thrivingAs') + ' ' + t('personalityTest.ambivert');
    }
  };

  // Clean the tips text to remove redundant parts
  const getCleanTipsText = () => {
    if (!personalityTips) return '';
    
    // Remove the "Thriving as an [type]:" part from the beginning
    let cleanText = personalityTips;
    
    // Remove patterns like "Thriving as an introvert:", "Thriving as an extrovert:", etc.
    const patterns = [
      /^Thriving as an? \w+:\s*/i,
      /^Процветание как \w+:\s*/i,
      /^[А-Я][\w\s]+ ретінде өркендеу:\s*/i
    ];
    
    patterns.forEach(pattern => {
      cleanText = cleanText.replace(pattern, '');
    });
    
    return cleanText;
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#E6EEF8" />
      
      {/* Header */}
      <LinearGradient
        colors={['#E6EEF8', '#E6EEF8']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.header}
      >
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#03174C" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('personalityTest.title')}</Text>
        <View style={{ width: 24 }} />
      </LinearGradient>

      <ScrollView 
        style={styles.scrollContainer}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View style={{
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
          width: '100%'
        }}>
          {/* Results Header */}
          <View style={styles.resultsHeader}>
            <Text style={styles.resultsTitle}>{t('results.title')}</Text>
            
            <LinearGradient
              colors={getGradientColors()}
              style={styles.personalityIconContainer}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Image 
                source={personalityIcon} 
                style={styles.personalityIcon}
              />
            </LinearGradient>
            
            {/* Personality Type */}
            <Text style={styles.personalityType}>{personalityType}</Text>
          </View>
          
          {/* Description Card with Gradient */}
          <LinearGradient
            colors={['#4E66E3', '#6A78E3']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.descriptionCard}
          >
            <Text style={styles.descriptionText}>
              {personalityDescription.replace("Congratulations! ", "")}
            </Text>
          </LinearGradient>
          
          {/* Strengths and Weaknesses Section */}
          <View style={styles.traitsContainer}>
            {/* Strengths */}
            <LinearGradient
              colors={['#4CAF50', '#66BB6A']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.strengthsCard}
            >
              <View style={styles.traitsTitleContainer}>
                <Ionicons name="shield-checkmark" size={18} color="#E0F2F1" style={styles.traitIcon} />
                <Text style={styles.traitsTitle}>{t('results.strengths')}</Text>
              </View>
              
              {personalityStrengths && personalityStrengths.map((strength, index) => (
                <View key={index} style={styles.traitItem}>
                  <Text style={styles.traitBullet}>• </Text>
                  <Text style={styles.traitText}>{strength}</Text>
                </View>
              ))}
            </LinearGradient>
            
            {/* Weaknesses */}
            <LinearGradient
              colors={['#F44336', '#EF5350']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.weaknessesCard}
            >
              <View style={styles.traitsTitleContainer}>
                <Ionicons name="alert-circle" size={18} color="#FFEBEE" style={styles.traitIcon} />
                <Text style={styles.traitsTitle}>{t('results.weaknesses')}</Text>
              </View>
              
              {personalityWeaknesses && personalityWeaknesses.map((weakness, index) => (
                <View key={index} style={styles.traitItem}>
                  <Text style={styles.traitBullet}>• </Text>
                  <Text style={styles.traitText}>{weakness}</Text>
                </View>
              ))}
            </LinearGradient>
          </View>
          
          {/* Tips Card */}
          <LinearGradient
            colors={['#009688', '#26A69A']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.tipsCard}
          >
            <View style={styles.tipsTitleContainer}>
              <Ionicons name="bulb" size={20} color="#E0F2F1" style={styles.tipsIcon} />
              <Text style={styles.tipsTitle}>{getThrivingText()}</Text>
            </View>
            
            <Text style={styles.tipsText}>
              {getCleanTipsText()}
            </Text>
          </LinearGradient>
          
          {/* Personality Breakdown Card */}
          <LinearGradient
            colors={['rgba(255, 255, 255, 0.15)', 'rgba(255, 255, 255, 0.05)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.distributionCard}
          >
            <View style={styles.distributionTitleContainer}>
              <Ionicons name="analytics" size={20} color="#FFFFFF" style={styles.distributionIcon} />
              <Text style={styles.distributionTitle}>{t('results.personalityBreakdown')}</Text>
            </View>
            
            {/* Introvert Bar */}
            <View style={styles.distributionItem}>
              <View style={styles.distributionLabelContainer}>
                <Text style={styles.distributionLabel}>{t('personalityTest.introvert')}</Text>
              </View>
              <View style={styles.distributionBarContainer}>
                <View 
                  style={[
                    styles.distributionBar, 
                    styles.introvertBar,
                    { width: `${percentages.introvert}%` }
                  ]} 
                />
              </View>
              <Text style={styles.distributionPercentage}>{percentages.introvert}%</Text>
            </View>
            
            {/* Extrovert Bar */}
            <View style={styles.distributionItem}>
              <View style={styles.distributionLabelContainer}>
                <Text style={styles.distributionLabel}>{t('personalityTest.extrovert')}</Text>
              </View>
              <View style={styles.distributionBarContainer}>
                <View 
                  style={[
                    styles.distributionBar, 
                    styles.extrovertBar,
                    { width: `${percentages.extrovert}%` }
                  ]} 
                />
              </View>
              <Text style={styles.distributionPercentage}>{percentages.extrovert}%</Text>
            </View>
            
            {/* Ambivert Bar */}
            <View style={styles.distributionItem}>
              <View style={styles.distributionLabelContainer}>
                <Text style={styles.distributionLabel}>{t('personalityTest.ambivert')}</Text>
              </View>
              <View style={styles.distributionBarContainer}>
                <View 
                  style={[
                    styles.distributionBar, 
                    styles.ambivertBar,
                    { width: `${percentages.ambivert}%` }
                  ]} 
                />
              </View>
              <Text style={styles.distributionPercentage}>{percentages.ambivert}%</Text>
            </View>
          </LinearGradient>
          
          {/* Action Buttons */}
          <View style={styles.actionsContainer}>
            <LinearGradient
              colors={['#3F51B5', '#5C6BC0']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.actionButton}
            >
              <TouchableOpacity 
                style={styles.actionButtonTouchable} 
                onPress={retakeTest}
                activeOpacity={0.8}
              >
                <Ionicons name="refresh" size={20} color="#fff" />
                <Text style={styles.buttonText}>{t('results.takeTestAgain')}</Text>
              </TouchableOpacity>
            </LinearGradient>
            
            <LinearGradient
              colors={['#009688', '#26A69A']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.actionButton}
            >
              <TouchableOpacity 
                style={styles.actionButtonTouchable} 
                onPress={shareResults}
                activeOpacity={0.8}
              >
                <Ionicons name="share-social" size={20} color="#fff" />
                <Text style={styles.buttonText}>{t('results.shareResults')}</Text>
              </TouchableOpacity>
            </LinearGradient>
          </View>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ResultTest;