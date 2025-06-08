// Breathing.js (BreathingExercise component) - Updated with multi-language support
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  SafeAreaView,
  Animated,
  Easing,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { breathingStyles as styles } from '../../../styles/discover/breathingStyles';
// Import activity tracker
import { trackActivity, ACTIVITY_TYPES } from '../../../utils/activityTracker';
import { useLanguage } from '../../context/LanguageContext';

const Breathing = ({ navigation, route }) => {
  const { t } = useLanguage(); // Add language hook
  
  const duration = route.params?.duration || 300; // Default 5 minutes
  const source = route.params?.source; // Extract source from route params
  
  const [isPaused, setIsPaused] = useState(false);
  const [timeLeft, setTimeLeft] = useState(duration);
  const breathAnimation = useRef(new Animated.Value(1)).current;
  const [currentPhase, setCurrentPhase] = useState('inhale');
  const timerInterval = useRef(null);
  const animationSequence = useRef(null);
  const phaseInterval = useRef(null);
  const sessionStarted = useRef(false);
  const sessionCompleted = useRef(false);

  const BREATH_PHASES = {
    inhale: { duration: 5000, scale: 1.2 },
    exhale: { duration: 5000, scale: 1.0 }
  };
  
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  useEffect(() => {
    // Track session start if it hasn't started yet
    if (!sessionStarted.current) {
      trackActivity(ACTIVITY_TYPES.BREATHING, {
        action: 'start',
        duration: duration,
        startTime: new Date().toISOString()
      });
      sessionStarted.current = true;
    }
  }, [duration]);

  const startTimer = () => {
    if (timerInterval.current) clearInterval(timerInterval.current);
    
    if (!isPaused) {
      timerInterval.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerInterval.current);
            // Track session completion when timer ends
            if (!sessionCompleted.current) {
              trackActivity(ACTIVITY_TYPES.BREATHING, {
                action: 'complete',
                duration: duration,
                completionTime: new Date().toISOString(),
                completionMethod: 'timer_end'
              });
              sessionCompleted.current = true;
            }
            handleGoBack();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
  };

  const startBreathingAnimation = () => {
    if (animationSequence.current) {
      animationSequence.current.stop();
    }

    if (!isPaused) {
      const createAnimation = (phase) => {
        const { duration, scale } = BREATH_PHASES[phase];
        return Animated.timing(breathAnimation, {
          toValue: scale,
          duration,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        });
      };

      const sequence = Animated.sequence([
        createAnimation('inhale'),
        createAnimation('exhale'),
      ]);

      animationSequence.current = Animated.loop(sequence);
      animationSequence.current.start();

      // Phase text updates
      if (phaseInterval.current) clearInterval(phaseInterval.current);
      
      phaseInterval.current = setInterval(() => {
        setCurrentPhase((prev) => prev === 'inhale' ? 'exhale' : 'inhale');
      }, BREATH_PHASES.inhale.duration);
    }
  };

  useEffect(() => {
    startBreathingAnimation();
    startTimer();

    return () => {
      clearAllTimers();
    };
  }, [isPaused]);

  const clearAllTimers = () => {
    if (timerInterval.current) clearInterval(timerInterval.current);
    if (phaseInterval.current) clearInterval(phaseInterval.current);
    if (animationSequence.current) animationSequence.current.stop();
  };

  const handlePauseResume = () => {
    setIsPaused(!isPaused);
    
    // Track pause/resume actions
    trackActivity(ACTIVITY_TYPES.BREATHING, {
      action: isPaused ? 'resume' : 'pause',
      timeRemaining: timeLeft,
      timestamp: new Date().toISOString()
    });
    
    if (!isPaused) {
      clearAllTimers();
    }
  };

  const handleGoBack = () => {
    // Clean up before navigating
    clearAllTimers();
    
    // Always go back to BreathingStarts screen (the previous screen in the flow)
    navigation.goBack();
  };

  const handleReset = () => {
    clearAllTimers();
    setTimeLeft(duration);
    setIsPaused(false);
    setCurrentPhase('inhale');
    breathAnimation.setValue(1);
    
    // Track reset action
    trackActivity(ACTIVITY_TYPES.BREATHING, {
      action: 'reset',
      timestamp: new Date().toISOString()
    });
    
    startBreathingAnimation();
    startTimer();
  };
  
  const handleDone = () => {
    // Track session completion when Done button is pressed
    if (!sessionCompleted.current) {
      trackActivity(ACTIVITY_TYPES.BREATHING, {
        action: 'complete',
        duration: duration,
        timeCompleted: duration - timeLeft,
        completionTime: new Date().toISOString(),
        completionMethod: 'button_press'
      });
      sessionCompleted.current = true;
    }
    
    handleGoBack();
  };

  // Get the current phase text with translation
  const getCurrentPhaseText = () => {
    if (currentPhase === 'inhale') {
      return t('breathing.inhale') || 'Inhale';
    } else {
      return t('breathing.exhale') || 'Exhale';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={handleGoBack}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.title}>{t('breathing.title')}</Text>
      </View>

      <View style={styles.iconContainer}>
        <Animated.View
          style={[
            styles.circle,
            styles.outerCircle,
            { transform: [{ scale: breathAnimation }] },
          ]}
        />
        <Animated.View
          style={[
            styles.circle,
            styles.middleCircle,
            { transform: [{ scale: breathAnimation }] },
          ]}
        />
        <Animated.View
          style={[
            styles.circle,
            styles.innerCircle,
            { transform: [{ scale: breathAnimation }] },
          ]}
        />
        <View style={[styles.iconWrapper, { zIndex: 10 }]}>
          <Image
            source={require('../../../assets/images/noseinhale.png')}
            style={[styles.breathingIcon1,]}
            resizeMode="contain"
          />
        </View>
      </View>

      <Text style={styles.timer}>{formatTime(timeLeft)}</Text>

      <View style={styles.controlsContainer}>
        <TouchableOpacity 
          style={styles.controlButton}
          onPress={handlePauseResume}
        >
          <Text style={styles.buttonText}>
            {isPaused ? t('breathing.resume') : t('breathing.pause')}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.controlButton, styles.controlButtonPrimary]}
          onPress={handleReset}
        >
          <Text style={styles.buttonText}>{t('breathing.reset')}</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.phaseText}>{getCurrentPhaseText()}</Text>

      <TouchableOpacity 
        style={styles.doneButton}
        onPress={handleDone}
      >
        <Text style={styles.buttonText}>{t('breathing.done')}</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default Breathing;