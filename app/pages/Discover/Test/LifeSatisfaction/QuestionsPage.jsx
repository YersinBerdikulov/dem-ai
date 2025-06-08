// app/pages/Discover/Test/LifeSatisfaction/QuestionsPage.js
import React, { useState, useMemo } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  SafeAreaView,
  ScrollView,
  StatusBar,
  Animated
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from '../../../../../styles/discover/lifeSatisfaction/questionStyles';
import { useLanguage } from '../../../../context/LanguageContext';

const QuestionsPages = ({ questions, answers, onAnswer, onFinish, navigation }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [fadeAnim] = useState(new Animated.Value(1));
  const { t } = useLanguage();
  const currentQuestion = questions[currentQuestionIndex];

  // Memoize options to prevent recreation on every render
  const options = useMemo(() => [
    t('lifeSatisfactionTest.options.stronglyDisagree') || 'Strongly Disagree',
    t('lifeSatisfactionTest.options.disagree') || 'Disagree',
    t('lifeSatisfactionTest.options.slightlyDisagree') || 'Slightly Disagree',
    t('lifeSatisfactionTest.options.neutral') || 'Neither Agree nor Disagree',
    t('lifeSatisfactionTest.options.slightlyAgree') || 'Slightly Agree',
    t('lifeSatisfactionTest.options.agree') || 'Agree',
    t('lifeSatisfactionTest.options.stronglyAgree') || 'Strongly Agree'
  ], [t]);

  const handleNext = () => {
    // Fade out
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 150,
      useNativeDriver: true
    }).start(() => {
      // Change question
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
      } else {
        onFinish();
      }
      
      // Fade in
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true
      }).start();
    });
  };

  // Progress dots at the top
  const renderProgressDots = () => {
    return (
      <View style={styles.progressIndicator}>
        {questions.map((_, index) => (
          <View 
            key={index} 
            style={[
              styles.progressDot, 
              index === currentQuestionIndex && styles.progressDotActive
            ]} 
          />
        ))}
      </View>
    );
  };

  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#051445" />
      
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()} 
          style={styles.headerIcon}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.title}>{t('lifeSatisfactionTest.title') || 'Life Satisfaction'}</Text>
        <TouchableOpacity style={styles.menuIcon} activeOpacity={0.7}>
          <Ionicons name="ellipsis-vertical" size={24} color="white" />
        </TouchableOpacity>
      </View>

      {renderProgressDots()}

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View style={{ opacity: fadeAnim }}>
          <View style={styles.questionCard}>
            <View style={styles.questionIcon}>
              <Ionicons name="help-circle-outline" size={26} color="white" />
            </View>
            <Text style={styles.questionText}>
              {`${currentQuestionIndex + 1}. ${currentQuestion.text}`}
            </Text>
          </View>

          {options.map((option, index) => {
            const isSelected = answers[currentQuestion.id] === index + 1;
            
            return (
              <TouchableOpacity
                key={option}
                style={[
                  styles.optionButton,
                  isSelected && { backgroundColor: 'rgba(255, 255, 255, 0.12)', borderColor: 'rgba(255, 255, 255, 0.25)' }
                ]}
                onPress={() => onAnswer(currentQuestion.id, index + 1)}
                activeOpacity={0.7}
              >
                <View style={[
                  styles.optionCircle,
                  isSelected && styles.optionCircleSelected
                ]}>
                  {isSelected && (
                    <View style={styles.optionDot} />
                  )}
                </View>
                <Text style={[
                  styles.optionText,
                  isSelected && { fontFamily: 'Poppins-Medium' }
                ]}>
                  {option}
                </Text>
              </TouchableOpacity>
            );
          })}
        </Animated.View>
      </ScrollView>

      <TouchableOpacity
        style={[
          styles.nextButton,
          !answers[currentQuestion.id] && styles.nextButtonDisabled
        ]}
        onPress={handleNext}
        disabled={!answers[currentQuestion.id]}
        activeOpacity={0.7}
      >
        <Text style={styles.nextButtonText}>
          {isLastQuestion ? (t('common.finish') || 'Finish') : (t('common.next') || 'Next')}
        </Text>
        <Ionicons 
          name={isLastQuestion ? 'checkmark' : 'arrow-forward'} 
          size={22} 
          color="white" 
        />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default QuestionsPages;