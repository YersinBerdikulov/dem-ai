// Affirmation.jsx - Updated with multi-language support
import React, { useState, useRef } from 'react';
import { trackActivity, ACTIVITY_TYPES } from '../../../../utils/activityTracker';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Animated,
  Share,
  StatusBar,
  Platform
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { affirmationStyles as styles } from '../../../../styles/discover/affirmation/affirmationStyles';
import { useLanguage } from '../../../context/LanguageContext';

const Affirmation = () => {
  const { t } = useLanguage(); // Add language hook
  
  // Get translated affirmations
  const getAffirmations = () => [
    t('affirmations.1') || "You are allowed to be exactly who you are.",
    t('affirmations.2') || "Your feelings are valid and deserve to be acknowledged.",
    t('affirmations.3') || "It's okay to prioritize your mental health today.",
    t('affirmations.4') || "You are stronger than the challenges you're facing right now.",
    t('affirmations.5') || "Taking time for yourself is not selfish, it's necessary.",
    t('affirmations.6') || "Small steps forward are still progress worth celebrating.",
    t('affirmations.7') || "You don't have to be perfect to be worthy of love and respect.",
    t('affirmations.8') || "It's okay to ask for help when you need it.",
    t('affirmations.9') || "Your past mistakes don't define your future potential.",
    t('affirmations.10') || "You deserve peace and joy in your life.",
    t('affirmations.11') || "Your presence in this world makes a difference.",
    t('affirmations.12') || "You are enough exactly as you are right now."
  ];

  const affirmations = getAffirmations();

  // State to track current affirmation index
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;
  
  // Function to handle navigation to next affirmation
  const nextAffirmation = () => {
    trackActivity(ACTIVITY_TYPES.AFFIRMATION, {
      affirmationText: affirmations[(currentIndex + 1) % affirmations.length]
    });
    // Animate out
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: -50,
        duration: 200,
        useNativeDriver: true,
      })
    ]).start(() => {
      // Update index
      setCurrentIndex((prevIndex) => (prevIndex + 1) % affirmations.length);
      // Reset animation values
      slideAnim.setValue(50);
      
      // Animate in
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        })
      ]).start();
    });
  };

  // Function to handle navigation to previous affirmation
  const prevAffirmation = () => {
    // Animate out
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 50,
        duration: 200,
        useNativeDriver: true,
      })
    ]).start(() => {
      // Update index
      setCurrentIndex((prevIndex) => 
        prevIndex === 0 ? affirmations.length - 1 : prevIndex - 1
      );
      // Reset animation values
      slideAnim.setValue(-50);
      
      // Animate in
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        })
      ]).start();
    });
  };

  // Function to share current affirmation
  const shareAffirmation = async () => {
    try {
      await trackActivity(ACTIVITY_TYPES.AFFIRMATION, {
        affirmationText: affirmations[currentIndex]
      });
      const result = await Share.share({
        message: affirmations[currentIndex],
        title: t('affirmation.shareTitle') || 'Daily Affirmation'
      });
      
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // Shared with activity type of result.activityType
          console.log('Shared with activity type');
        } else {
          // Shared
          console.log('Shared successfully');
        }
      } else if (result.action === Share.dismissedAction) {
        // Dismissed
        console.log('Share dismissed');
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#03174C" />
      
      <View style={{flex: 0}}>
        <Text style={styles.headerTitle}>{t('affirmation.title')}</Text>
      
        <View style={styles.affirmationContainer}>
          <LinearGradient
            colors={['#52E5E7', '#130CB7']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.gradientBox}
          >
            <Text style={styles.affirmationLabel}>{t('affirmation.shareAffirmation')}</Text>
            
            <View style={styles.affirmationTextContainer}>
              <TouchableOpacity 
                style={styles.navButton}
                onPress={prevAffirmation}
                activeOpacity={0.7}
              >
                <Ionicons name="chevron-back" size={28} color="#FFFFFF" />
              </TouchableOpacity>
              
              <Animated.View 
                style={[
                  styles.affirmationTextWrapper,
                  {
                    opacity: fadeAnim,
                    transform: [{ translateX: slideAnim }]
                  }
                ]}
              >
                <Text style={styles.affirmationText}>
                  {affirmations[currentIndex]}
                </Text>
              </Animated.View>
              
              <TouchableOpacity 
                style={styles.navButton}
                onPress={nextAffirmation}
                activeOpacity={0.7}
              >
                <Ionicons name="chevron-forward" size={28} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </View>
      </View>
      
      <TouchableOpacity 
        style={styles.shareButton}
        onPress={shareAffirmation}
        activeOpacity={0.8}
      >
        <Text style={styles.shareButtonText}>{t('affirmation.shareButton')}</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default Affirmation;