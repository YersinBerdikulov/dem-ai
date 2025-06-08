import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  SafeAreaView,
  StatusBar,
  Animated
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from '../../../../../styles/discover/insomniaRating/questionStyles';
import { useLanguage } from '../../../../context/LanguageContext';

const QuestionsPage = ({ questions, answers, onAnswer, onFinish, navigation }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [fadeAnim] = useState(new Animated.Value(1));
  const { t } = useLanguage();
  const currentQuestion = questions[currentQuestionIndex];

  const handleNext = () => {
    // Fade out
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 200,
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
        duration: 300,
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
      <StatusBar barStyle="light-content" backgroundColor="#061440" />
      
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()} 
          style={styles.headerIcon}
        >
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.title}>{t('insomniaTest.title')}</Text>
        <TouchableOpacity style={styles.menuIcon}>
          <Ionicons name="ellipsis-vertical" size={24} color="white" />
        </TouchableOpacity>
      </View>

      {renderProgressDots()}

      <Animated.View style={{ opacity: fadeAnim, flex: 1 }}>
        <View style={styles.questionCard}>
          <View style={styles.questionIcon}>
            <Ionicons name="help-circle-outline" size={28} color="white" />
          </View>
          <Text style={styles.questionText}>
            {`${currentQuestionIndex + 1}. ${currentQuestion.text}`}
          </Text>
        </View>

        {currentQuestion.options.map((option, index) => {
          const isSelected = answers[currentQuestion.id] === index + 1;
          
          return (
            <TouchableOpacity
              key={option.label}
              style={[
                styles.optionButton,
                isSelected && styles.optionButtonSelected
              ]}
              onPress={() => onAnswer(currentQuestion.id, index + 1)}
              activeOpacity={0.8}
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
                isSelected && styles.optionTextSelected
              ]}>
                {option.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </Animated.View>

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
          {isLastQuestion ? t('common.finish') : t('common.next')}
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

export default QuestionsPage;