// PersonalityTest.jsx - Updated with multi-language support
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
  StatusBar,
  ActivityIndicator,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from '../../../../styles/home/personalityTestStyles';
import { auth } from '../../../../config/firebase';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../../../config/firebase';
import personalityTestService from '../../../../services/personalityTestService';
import { useLanguage } from '../../../context/LanguageContext';

const PersonalityTest = () => {
  const navigation = useNavigation();
  const { t } = useLanguage(); // Add language hook
  
  const [testStarted, setTestStarted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [previousTestResult, setPreviousTestResult] = useState(null);
  const [fadeAnim] = useState(new Animated.Value(1));
  const [slideAnim] = useState(new Animated.Value(0));

  // Define the personality test questions with translation keys
  const getQuestions = () => [
   {
    id: 1,
    question: t('personalityTest.questions.1.question') || "How do you typically recharge your energy?",
    options: [
      { text: t('personalityTest.questions.1.options.0') || "By spending time alone", value: "A" },
      { text: t('personalityTest.questions.1.options.1') || "By being around others and socializing", value: "B" },
      { text: t('personalityTest.questions.1.options.2') || "It depends on the situation and my mood", value: "C" }
    ]
  },
  {
    id: 2,
    question: t('personalityTest.questions.2.question') || "How do you typically approach meeting new people?",
    options: [
      { text: t('personalityTest.questions.2.options.0') || "With excitement and a desire to get to know them", value: "B" },
      { text: t('personalityTest.questions.2.options.1') || "With some hesitation or nervousness, but still willing to engage", value: "C" },
      { text: t('personalityTest.questions.2.options.2') || "With reluctance or avoidance", value: "A" }
    ]
  },
  {
    id: 3,
    question: t('personalityTest.questions.3.question') || "What do you prefer to do on a Friday night?",
    options: [
      { text: t('personalityTest.questions.3.options.0') || "Hang out with companions or participate in a social gathering", value: "B" },
      { text: t('personalityTest.questions.3.options.1') || "Stay home and watch a movie or engage in a solitary activity", value: "C" },
      { text: t('personalityTest.questions.3.options.2') || "Reflecting on the issue alone before addressing it", value: "A" }
    ]
  },
  {
    id: 4,
    question: t('personalityTest.questions.4.question') || "How do you typically recharge after a long day or week?",
    options: [
      { text: t('personalityTest.questions.4.options.0') || "Spending time with friends or attending social events", value: "A" },
      { text: t('personalityTest.questions.4.options.1') || "Engaging in a solitary hobby or activity", value: "C" },
      { text: t('personalityTest.questions.4.options.2') || "Relaxing at home while enjoying a book or movie", value: "B" }
    ]
  },
  {
    id: 5,
    question: t('personalityTest.questions.5.question') || "How do you feel about being the centre of attention?",
    options: [
      { text: t('personalityTest.questions.5.options.0') || "Enjoy it and find it energizing", value: "B" },
      { text: t('personalityTest.questions.5.options.1') || "Tolerate it but feel uncomfortable or self-conscious", value: "A" },
      { text: t('personalityTest.questions.5.options.2') || "Dislike it and actively avoid being the centre of attention", value: "C" }
    ]
  },
  {
    id: 6,
    question: t('personalityTest.questions.6.question') || "How do you typically handle conflict or difficult conversations?",
    options: [
      { text: t('personalityTest.questions.6.options.0') || "Addressing it head-on and seeking to resolve the issue quickly", value: "B" },
      { text: t('personalityTest.questions.6.options.1') || "Avoiding it and hoping the issue resolves on its own", value: "C" },
      { text: t('personalityTest.questions.6.options.2') || "Reflecting on the issue alone before addressing it", value: "A" }
    ]
  },
  {
    id: 7,
    question: t('personalityTest.questions.7.question') || "How do you feel about meeting new people or attending social events?",
    options: [
      { text: t('personalityTest.questions.7.options.0') || "Enjoy it and find it easy to make new connections", value: "B" },
      { text: t('personalityTest.questions.7.options.1') || "Tolerate it but don't enjoy it much", value: "C" },
      { text: t('personalityTest.questions.7.options.2') || "Feel nervous or anxious about meeting new people", value: "A" }
    ]
  },
  {
    id: 8,
    question: t('personalityTest.questions.8.question') || "Which of the following best describes your communication style?",
    options: [
      { text: t('personalityTest.questions.8.options.0') || "Talkative and outgoing", value: "B" },
      { text: t('personalityTest.questions.8.options.1') || "Thoughtful and introspective", value: "A" },
      { text: t('personalityTest.questions.8.options.2') || "Analytical and detail-oriented", value: "C" }
    ]
  },
  {
    id: 9,
    question: t('personalityTest.questions.9.question') || "In a social setting, would you rather:",
    options: [
      { text: t('personalityTest.questions.9.options.0') || "Be in a large group of people", value: "B" },
      { text: t('personalityTest.questions.9.options.1') || "Be in a small group of people", value: "C" },
      { text: t('personalityTest.questions.9.options.2') || "Be alone", value: "A" }
    ]
  },
  {
  id: 10,
  question: t('personalityTest.questions.10.question') || "Which of the following do you prefer in terms of communication?",
  options: [
    { text: t('personalityTest.questions.10.options.0') || "Face-to-face conversations", value: "B" },
    { text: t('personalityTest.questions.10.options.1') || "Phone or video calls", value: "C" },
    { text: t('personalityTest.questions.10.options.2') || "Text or email", value: "A" }
  ]
},
{
  id: 11,
  question: t('personalityTest.questions.11.question') || "In a meeting or group discussion, do you:",
  options: [
    { text: t('personalityTest.questions.11.options.0') || "Speak up often and contribute to the conversation", value: "B" },
    { text: t('personalityTest.questions.11.options.1') || "Listen more than you speak", value: "C" },
    { text: t('personalityTest.questions.11.options.2') || "Prefer not to participate", value: "A" }
  ]
},
{
  id: 12,
  question: t('personalityTest.questions.12.question') || "Which type of environment do you prefer in terms of work or study?",
  options: [
    { text: t('personalityTest.questions.12.options.0') || "A busy, social environment", value: "B" },
    { text: t('personalityTest.questions.12.options.1') || "A quiet, focused environment", value: "A" },
    { text: t('personalityTest.questions.12.options.2') || "A mix of both", value: "C" }
  ]
},
{
  id: 13,
  question: t('personalityTest.questions.13.question') || "Do you feel energized or drained after socializing?",
  options: [
    { text: t('personalityTest.questions.13.options.0') || "Energized", value: "B" },
    { text: t('personalityTest.questions.13.options.1') || "Drained", value: "A" },
    { text: t('personalityTest.questions.13.options.2') || "Depends on the situation", value: "C" }
  ]
},
{
  id: 14,
  question: t('personalityTest.questions.14.question') || "When making plans with friends or family, do you:",
  options: [
    { text: t('personalityTest.questions.14.options.0') || "Enjoy planning and organizing social events", value: "B" },
    { text: t('personalityTest.questions.14.options.1') || "Prefer when someone else takes charge of planning", value: "C" },
    { text: t('personalityTest.questions.14.options.2') || "Avoid making plans altogether", value: "A" }
  ]
},
{
  id: 15,
  question: t('personalityTest.questions.15.question') || "Do you prefer to have a few close friends or a large network of acquaintances?",
  options: [
    { text: t('personalityTest.questions.15.options.0') || "A few close friends", value: "A" },
    { text: t('personalityTest.questions.15.options.1') || "A large network of acquaintances", value: "B" },
    { text: t('personalityTest.questions.15.options.2') || "Somewhere in between", value: "C" }
  ]
},
{
  id: 16,
  question: t('personalityTest.questions.16.question') || "Which type of activities do you prefer:",
  options: [
    { text: t('personalityTest.questions.16.options.0') || "Action-packed and adventurous", value: "B" },
    { text: t('personalityTest.questions.16.options.1') || "Calm and relaxing", value: "A" },
    { text: t('personalityTest.questions.16.options.2') || "A mix of both", value: "C" }
  ]
},
{
  id: 17,
  question: t('personalityTest.questions.17.question') || "When you are feeling stressed, what do you prefer to do?",
  options: [
    { text: t('personalityTest.questions.17.options.0') || "Talk to someone about it", value: "B" },
    { text: t('personalityTest.questions.17.options.1') || "Spend time alone to think", value: "A" },
    { text: t('personalityTest.questions.17.options.2') || "It depends on the situation", value: "C" }
  ]
},
{
  id: 18,
  question: t('personalityTest.questions.18.question') || "How do you feel about large social events like parties?",
  options: [
    { text: t('personalityTest.questions.18.options.0') || "Love them!", value: "B" },
    { text: t('personalityTest.questions.18.options.1') || "Prefer small gatherings", value: "C" },
    { text: t('personalityTest.questions.18.options.2') || "Avoid them if possible", value: "A" }
  ]
},
{
  id: 19,
  question: t('personalityTest.questions.19.question') || "When working on a project, what do you prefer?",
  options: [
    { text: t('personalityTest.questions.19.options.0') || "Collaborating with others", value: "B" },
    { text: t('personalityTest.questions.19.options.1') || "Working independently", value: "A" },
    { text: t('personalityTest.questions.19.options.2') || "A mix of both", value: "C" }
  ]
},
{
  id: 20,
  question: t('personalityTest.questions.20.question') || "How do you feel about meeting new people?",
  options: [
    { text: t('personalityTest.questions.20.options.0') || "Excited to make new connections", value: "B" },
    { text: t('personalityTest.questions.20.options.1') || "Take time to get to know someone before feeling comfortable", value: "C" },
    { text: t('personalityTest.questions.20.options.2') || "Prefer to stick with familiar people", value: "A" }
  ]
},
{
  id: 21,
  question: t('personalityTest.questions.21.question') || "When making a decision, what do you rely on?",
  options: [
    { text: t('personalityTest.questions.21.options.0') || "Gut feeling", value: "B" },
    { text: t('personalityTest.questions.21.options.1') || "Careful analysis of pros and cons", value: "C" },
    { text: t('personalityTest.questions.21.options.2') || "Advice from others", value: "A" }
  ]
},
{
  id: 22,
  question: t('personalityTest.questions.22.question') || "Which statement best reflects your personality?",
  options: [
    { text: t('personalityTest.questions.22.options.0') || "I enjoy trying new things and stepping outside my comfort zone", value: "B" },
    { text: t('personalityTest.questions.22.options.1') || "I prefer routines and familiar environments", value: "A" },
    { text: t('personalityTest.questions.22.options.2') || "I like a balance of both", value: "C" }
  ]
},
{
  id: 23,
  question: t('personalityTest.questions.23.question') || "How do you usually respond to unexpected changes?",
  options: [
    { text: t('personalityTest.questions.23.options.0') || "Adapt quickly and go with the flow", value: "B" },
    { text: t('personalityTest.questions.23.options.1') || "Feel uncomfortable and try to maintain the status quo", value: "A" },
    { text: t('personalityTest.questions.23.options.2') || "Take time to adjust but eventually adapt", value: "C" }
  ]
},
{
  id: 24,
  question: t('personalityTest.questions.24.question') || "How do you handle responsibilities and tasks?",
  options: [
    { text: t('personalityTest.questions.24.options.0') || "Prefer structure and planning ahead", value: "A" },
    { text: t('personalityTest.questions.24.options.1') || "Go with the flow and adjust as needed", value: "B" },
    { text: t('personalityTest.questions.24.options.2') || "Combine structure with flexibility", value: "C" }
  ]
},
{
  id: 25,
  question: t('personalityTest.questions.25.question') || "Which best describes your ideal weekend?",
  options: [
    { text: t('personalityTest.questions.25.options.0') || "Spending time with a lot of people doing fun activities", value: "B" },
    { text: t('personalityTest.questions.25.options.1') || "Having alone time to recharge", value: "A" },
    { text: t('personalityTest.questions.25.options.2') || "Mix of socializing and relaxing alone", value: "C" }
  ]
},
{
  id: 26,
  question: t('personalityTest.questions.26.question') || "How do you handle your daily routine?",
  options: [
    { text: t('personalityTest.questions.26.options.0') || "Stick to a strict routine", value: "A" },
    { text: t('personalityTest.questions.26.options.1') || "Be spontaneous and go with the flow", value: "B" },
    { text: t('personalityTest.questions.26.options.2') || "Have a loose structure with flexibility", value: "C" }
  ]
},
{
  id: 27,
  question: t('personalityTest.questions.27.question') || "How do you approach personal goals?",
  options: [
    { text: t('personalityTest.questions.27.options.0') || "Plan and set clear steps", value: "A" },
    { text: t('personalityTest.questions.27.options.1') || "Take action when inspired", value: "B" },
    { text: t('personalityTest.questions.27.options.2') || "Do a mix of planning and spontaneous action", value: "C" }
  ]
},
{
  id: 28,
  question: t('personalityTest.questions.28.question') || "Which best describes your approach to challenges?",
  options: [
    { text: t('personalityTest.questions.28.options.0') || "Face them directly with optimism", value: "B" },
    { text: t('personalityTest.questions.28.options.1') || "Think things through carefully before acting", value: "A" },
    { text: t('personalityTest.questions.28.options.2') || "Adapt based on the situation", value: "C" }
  ]
},
{
  id: 29,
  question: t('personalityTest.questions.29.question') || "What best describes how you prefer to spend your free time?",
  options: [
    { text: t('personalityTest.questions.29.options.0') || "Doing social activities with others", value: "B" },
    { text: t('personalityTest.questions.29.options.1') || "Engaging in solo hobbies", value: "A" },
    { text: t('personalityTest.questions.29.options.2') || "A mix of both", value: "C" }
  ]
},
{
  id: 30,
  question: t('personalityTest.questions.30.question') || "When starting a new activity, do you prefer:",
  options: [
    { text: t('personalityTest.questions.30.options.0') || "Jumping right in and learning as you go", value: "B" },
    { text: t('personalityTest.questions.30.options.1') || "Understanding everything before starting", value: "A" },
    { text: t('personalityTest.questions.30.options.2') || "A bit of both — some preparation and some spontaneity", value: "C" }
  ]
}
];
  const questions = getQuestions();

  useEffect(() => {
    const checkPreviousTest = async () => {
      try {
        setIsLoading(true);
        const results = await personalityTestService.getTestResults();
        
        if (results) {
          setPreviousTestResult({
            personalityType: results.personalityType,
            counts: results.counts
          });
        }
      } catch (error) {
        console.error('Error checking previous test:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkPreviousTest();
  }, []);

  // Update progress when current question changes
  useEffect(() => {
    if (testStarted) {
      setProgress((currentQuestionIndex / (questions.length - 1)) * 100);
    }
  }, [currentQuestionIndex, testStarted]);

  // Function to handle option selection
  const handleOptionSelect = (optionValue) => {
    setAnswers({
      ...answers,
      [currentQuestionIndex]: optionValue
    });
  };

  // Animate question transition
  const animateQuestionTransition = (nextIndex) => {
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
      setCurrentQuestionIndex(nextIndex);
      slideAnim.setValue(50);
      
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

  // Function to handle next button press
  const handleNextPress = () => {
    if (answers[currentQuestionIndex]) {
      if (currentQuestionIndex < questions.length - 1) {
        animateQuestionTransition(currentQuestionIndex + 1);
      } else {
        calculateResults();
      }
    }
  };

  // Function to restart the test
  const restartTest = () => {
    setCurrentQuestionIndex(0);
    setAnswers({});
    setProgress(0);
    setTestStarted(true);
    setPreviousTestResult(null);
  };

  // Calculate the personality type based on answers
  const calculateResults = async () => {
    const counts = {
      A: 0,
      B: 0,
      C: 0
    };

    Object.values(answers).forEach(value => {
      counts[value]++;
    });

    let personalityType;
    let personalityDescription;
    let personalityStrengths;
    let personalityWeaknesses;
    let personalityTips;
    let personalityIcon;

    if (counts.A > counts.B && counts.A > counts.C) {
      personalityType = t('personalityTest.introvert');
      personalityDescription = t('personalityTest.introvertDescription') || "As an introvert, you thrive in solitude, find socializing draining, and excel as a thoughtful listener with a rich inner world.";
      personalityStrengths = [
        t('personalityTest.strengths.deepThinking') || "Deep Thinking & Reflection",
        t('personalityTest.strengths.focus') || "Focus & Concentration",
        t('personalityTest.strengths.listening') || "Listening Skills",
        t('personalityTest.strengths.creativity') || "Creativity & Innovation",
        t('personalityTest.strengths.independence') || "Independence"
      ];
      personalityWeaknesses = [
        t('personalityTest.weaknesses.socialFatigue') || "Social Fatigue",
        t('personalityTest.weaknesses.networkingStruggles') || "Networking Struggles",
        t('personalityTest.weaknesses.overthinking') || "The tendency towards overthinking and ruminating"
      ];
      personalityTips = t('personalityTest.introvertTips') || "Thriving as an introvert: Embrace your strengths in deep thinking and creativity, find environments that suit you, improve communication, and practice self-care. Step outside your comfort zone gradually to grow and succeed.";
      personalityIcon = require('../../../../assets/icons/Introvert.png');
    } else if (counts.B > counts.A && counts.B > counts.C) {
      personalityType = t('personalityTest.extrovert');
      personalityDescription = t('personalityTest.extrovertDescription') || "As an extrovert, you thrive on social interaction, are energetic and outgoing, and excel at communication and building connections.";
      personalityStrengths = [
        t('personalityTest.strengths.communication') || "Communication Skills",
        t('personalityTest.strengths.socialNetworking') || "Social Networking",
        t('personalityTest.strengths.energy') || "Energy & Enthusiasm",
        t('personalityTest.strengths.leadership') || "Leadership Potential",
        t('personalityTest.strengths.adaptability') || "Adaptability"
      ];
      personalityWeaknesses = [
        t('personalityTest.weaknesses.solitudeChallenging') || "May find solitude challenging",
        t('personalityTest.weaknesses.overwhelming') || "Sometimes overwhelming to others",
        t('personalityTest.weaknesses.actBeforeThinking') || "Might act before thinking through"
      ];
      personalityTips = t('personalityTest.extrovertTips') || "Thriving as an extrovert: Harness your natural communication abilities and social energy. Practice active listening and allow space for others to contribute. Find balance by developing comfort with occasional solitude.";
      personalityIcon = require('../../../../assets/icons/Extrovert.png');
    } else {
      personalityType = t('personalityTest.ambivert');
      personalityDescription = t('personalityTest.ambivertDescription') || "As an ambivert, you balance both introverted and extroverted traits, adapting well to different situations with flexibility.";
      personalityStrengths = [
        t('personalityTest.strengths.adaptability') || "Adaptability",
        t('personalityTest.strengths.balance') || "Balance",
        t('personalityTest.strengths.socialFlexibility') || "Social Flexibility",
        t('personalityTest.strengths.empathy') || "Empathy",
        t('personalityTest.strengths.wellRoundedCommunication') || "Well-rounded Communication"
      ];
      personalityWeaknesses = [
        t('personalityTest.weaknesses.indecisive') || "Sometimes indecisive",
        t('personalityTest.weaknesses.identityStruggle') || "May struggle with identity",
        t('personalityTest.weaknesses.unpredictableEnergy') || "Energy levels can be unpredictable"
      ];
      personalityTips = t('personalityTest.ambivertTips') || "Thriving as an ambivert: Leverage your adaptability to connect with different types of people. Learn to recognize your energy patterns and honor both your social and solitary needs.";
      personalityIcon = require('../../../../assets/icons/Ambivert.png');
    }

    try {
      await personalityTestService.updateTestResults({
        answers,
        personalityType,
        counts
      });
    } catch (error) {
      console.error('Error saving test results:', error);
    }

    navigation.navigate('ResultTest', {
      personalityType,
      personalityDescription,
      personalityStrengths,
      personalityWeaknesses,
      personalityTips,
      counts,
      personalityIcon
    });
  };

  // Render the introduction screen
  const renderIntro = () => {
    if (isLoading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4E66E3" />
          <Text style={styles.loadingText}>{t('personalityTest.loading')}</Text>
        </View>
      );
    }

    return (
      <View style={styles.introContainer}>
        <Text style={styles.introTitle}>{t('personalityTest.discoverTitle')}</Text>
        <Text style={styles.introText}>
          {t('personalityTest.description')}
        </Text>

        {/* Personality Types Cards */}
        <View style={styles.personalityTypesContainer}>
          {/* Introvert Card */}
          <LinearGradient
            colors={['#81C784', '#A8D8C6']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.personalityCard}
          >
            <View style={styles.personalityCardContent}>
              <Text style={styles.personalityTypeTitle}>{t('personalityTest.introvert')}</Text>
              <Text style={styles.personalityTypeDescription}>
                {t('personalityTest.introvertDescription')}
              </Text>
            </View>
            <Image 
              source={require('../../../../assets/icons/Introvert.png')} 
              style={styles.personalityIcon} 
            />
          </LinearGradient>

          {/* Extrovert Card */}
          <LinearGradient
            colors={['#64B5F6', '#B3E5FC']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.personalityCard}
          >
            <View style={styles.personalityCardContent}>
              <Text style={styles.personalityTypeTitle}>{t('personalityTest.extrovert')}</Text>
              <Text style={styles.personalityTypeDescription}>
                {t('personalityTest.extrovertDescription')}
              </Text>
            </View>
            <Image 
              source={require('../../../../assets/icons/Extrovert.png')} 
              style={styles.personalityIcon} 
            />
          </LinearGradient>

          {/* Ambivert Card */}
          <LinearGradient
            colors={['#CE93D8', '#E1BEE7']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.personalityCard}
          >
            <View style={styles.personalityCardContent}>
              <Text style={styles.personalityTypeTitle}>{t('personalityTest.ambivert')}</Text>
              <Text style={styles.personalityTypeDescription}>
                {t('personalityTest.ambivertDescription')}
              </Text>
            </View>
            <Image 
              source={require('../../../../assets/icons/Ambivert.png')} 
              style={styles.personalityIcon} 
            />
          </LinearGradient>
        </View>

        {/* Show previous result if exists, otherwise show Start button */}
        {previousTestResult ? (
          <LinearGradient
            colors={['rgba(255, 255, 255, 0.15)', 'rgba(255, 255, 255, 0.05)']}
            style={styles.previousResultContainer}
          >
            <Text style={styles.previousResultHeading}>{t('personalityTest.previousTestResult')}</Text>
            <Text style={styles.previousResultText}>
              {t('personalityTest.youAre')}{previousTestResult.personalityType.charAt(0).toLowerCase() === 'a' || 
                      previousTestResult.personalityType.charAt(0).toLowerCase() === 'e' || 
                      previousTestResult.personalityType.charAt(0).toLowerCase() === 'i' || 
                      previousTestResult.personalityType.charAt(0).toLowerCase() === 'o' || 
                      previousTestResult.personalityType.charAt(0).toLowerCase() === 'u' 
                      ? 'n' : ''} <Text style={styles.previousResultType}>{previousTestResult.personalityType}</Text>
            </Text>
            
            <View style={styles.distributionContainer}>
              {previousTestResult.counts && (
                <>
                  <View style={styles.distributionRow}>
                    <View style={styles.distributionLabelContainer}>
                      <Text style={styles.distributionLabel}>{t('personalityTest.introvert')}</Text>
                    </View>
                    <View style={styles.distributionBarContainer}>
                      <View 
                        style={[
                          styles.distributionBar, 
                          styles.introvertBar,
                          { 
                            width: `${Math.round((previousTestResult.counts.A / (previousTestResult.counts.A + previousTestResult.counts.B + previousTestResult.counts.C)) * 100)}%` 
                          }
                        ]} 
                      />
                    </View>
                    <Text style={styles.distributionValue}>{Math.round((previousTestResult.counts.A / (previousTestResult.counts.A + previousTestResult.counts.B + previousTestResult.counts.C)) * 100)}%</Text>
                  </View>
                  
                  <View style={styles.distributionRow}>
                    <View style={styles.distributionLabelContainer}>
                      <Text style={styles.distributionLabel}>{t('personalityTest.extrovert')}</Text>
                    </View>
                    <View style={styles.distributionBarContainer}>
                      <View 
                        style={[
                          styles.distributionBar, 
                          styles.extrovertBar,
                          { 
                            width: `${Math.round((previousTestResult.counts.B / (previousTestResult.counts.A + previousTestResult.counts.B + previousTestResult.counts.C)) * 100)}%` 
                          }
                        ]} 
                      />
                    </View>
                    <Text style={styles.distributionValue}>{Math.round((previousTestResult.counts.B / (previousTestResult.counts.A + previousTestResult.counts.B + previousTestResult.counts.C)) * 100)}%</Text>
                  </View>
                  
                  <View style={styles.distributionRow}>
                    <View style={styles.distributionLabelContainer}>
                      <Text style={styles.distributionLabel}>{t('personalityTest.ambivert')}</Text>
                    </View>
                    <View style={styles.distributionBarContainer}>
                      <View 
                        style={[
                          styles.distributionBar, 
                          styles.ambivertBar,
                          { 
                            width: `${Math.round((previousTestResult.counts.C / (previousTestResult.counts.A + previousTestResult.counts.B + previousTestResult.counts.C)) * 100)}%` 
                          }
                        ]} 
                      />
                    </View>
                    <Text style={styles.distributionValue}>{Math.round((previousTestResult.counts.C / (previousTestResult.counts.A + previousTestResult.counts.B + previousTestResult.counts.C)) * 100)}%</Text>
                  </View>
                </>
              )}
            </View>
            
            <TouchableOpacity 
              style={styles.retakeButton} 
              onPress={restartTest}
            >
              <Text style={styles.retakeButtonText}>{t('personalityTest.takeTestAgain')}</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.viewResultsButton}
              onPress={() => {
                const personalityType = previousTestResult.personalityType;
                let personalityIcon;
                
                if (personalityType === t('personalityTest.introvert') || personalityType === "Introvert") {
                  personalityIcon = require('../../../../assets/icons/Introvert.png');
                } else if (personalityType === t('personalityTest.extrovert') || personalityType === "Extrovert") {
                  personalityIcon = require('../../../../assets/icons/Extrovert.png');
                } else {
                  personalityIcon = require('../../../../assets/icons/Ambivert.png');
                }
                
                navigation.navigate('ResultTest', {
                  personalityType,
                  counts: previousTestResult.counts,
                  personalityIcon,
                  personalityDescription: personalityType === t('personalityTest.introvert') || personalityType === "Introvert"
                    ? t('personalityTest.introvertDescription')
                    : personalityType === t('personalityTest.extrovert') || personalityType === "Extrovert"
                    ? t('personalityTest.extrovertDescription')
                    : t('personalityTest.ambivertDescription'),
                  personalityStrengths: personalityType === t('personalityTest.introvert') || personalityType === "Introvert"
                    ? [t('personalityTest.strengths.deepThinking'), t('personalityTest.strengths.focus'), t('personalityTest.strengths.listening'), t('personalityTest.strengths.creativity'), t('personalityTest.strengths.independence')]
                    : personalityType === t('personalityTest.extrovert') || personalityType === "Extrovert"
                    ? [t('personalityTest.strengths.communication'), t('personalityTest.strengths.socialNetworking'), t('personalityTest.strengths.energy'), t('personalityTest.strengths.leadership'), t('personalityTest.strengths.adaptability')]
                    : [t('personalityTest.strengths.adaptability'), t('personalityTest.strengths.balance'), t('personalityTest.strengths.socialFlexibility'), t('personalityTest.strengths.empathy'), t('personalityTest.strengths.wellRoundedCommunication')],
                  personalityWeaknesses: personalityType === t('personalityTest.introvert') || personalityType === "Introvert"
                    ? [t('personalityTest.weaknesses.socialFatigue'), t('personalityTest.weaknesses.networkingStruggles'), t('personalityTest.weaknesses.overthinking')]
                    : personalityType === t('personalityTest.extrovert') || personalityType === "Extrovert"
                    ? [t('personalityTest.weaknesses.solitudeChallenging'), t('personalityTest.weaknesses.overwhelming'), t('personalityTest.weaknesses.actBeforeThinking')]
                    : [t('personalityTest.weaknesses.indecisive'), t('personalityTest.weaknesses.identityStruggle'), t('personalityTest.weaknesses.unpredictableEnergy')],
                  personalityTips: personalityType === t('personalityTest.introvert') || personalityType === "Introvert"
                    ? t('personalityTest.introvertTips')
                    : personalityType === t('personalityTest.extrovert') || personalityType === "Extrovert"
                    ? t('personalityTest.extrovertTips')
                    : t('personalityTest.ambivertTips')
                });
              }}
            >
              <Text style={styles.viewResultsButtonText}>{t('personalityTest.viewFullResults')}</Text>
            </TouchableOpacity>
          </LinearGradient>
        ) : (
          <LinearGradient
            colors={['#4E66E3', '#6A78E3']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.startButton}
          >
            <TouchableOpacity 
              style={styles.startButtonTouchable} 
              onPress={() => setTestStarted(true)}
            >
              <Text style={styles.startButtonText}>{t('personalityTest.startTest')}</Text>
              <Ionicons name="arrow-forward" size={20} color="#fff" />
            </TouchableOpacity>
          </LinearGradient>
        )}
      </View>
    );
  };

  // Render a single question and its options
  const renderQuestion = () => {
    const currentQuestion = questions[currentQuestionIndex];
    
    return (
      <Animated.View 
        style={[
          styles.questionContainer,
          {
            opacity: fadeAnim,
            transform: [{ translateX: slideAnim }]
          }
        ]}
      >
        {/* Question Number and Progress Indicator */}
        <View style={styles.questionHeader}>
          <Text style={styles.questionCount}>{t('personalityTest.question')} {currentQuestion.id} {t('personalityTest.of')} {questions.length}</Text>
          <Text style={styles.questionProgress}>{Math.round(progress)}% {t('personalityTest.completed')}</Text>
        </View>
        
        {/* Question Text */}
        <Text style={styles.questionText}>{currentQuestion.question}</Text>
        
        {/* Options */}
        <View style={styles.optionsContainer}>
          {currentQuestion.options.map((option, index) => {
            const isSelected = answers[currentQuestionIndex] === option.value;
            
            return (
              <TouchableOpacity
                key={index}
                style={[
                  styles.optionButton,
                  isSelected && styles.selectedOption
                ]}
                onPress={() => handleOptionSelect(option.value)}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={isSelected ? ['#4E66E3', '#6A78E3'] : ['rgba(255, 255, 255, 0.1)', 'rgba(255, 255, 255, 0.05)']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={[
                    styles.optionGradient,
                    isSelected && styles.selectedOptionGradient
                  ]}
                >
                  <View style={styles.optionContent}>
                    <View style={[
                      styles.optionCircle,
                      isSelected && styles.selectedOptionCircle
                    ]}>
                      {isSelected && (
                        <View style={styles.selectedInnerCircle} />
                      )}
                    </View>
                    <Text style={[
                      styles.optionText,
                      isSelected && styles.selectedOptionText
                    ]}>
                      {option.text}
                    </Text>
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Next Button */}
        <LinearGradient
          colors={answers[currentQuestionIndex] ? ['#4CAF50', '#66BB6A'] : ['rgba(76, 175, 80, 0.5)', 'rgba(102, 187, 106, 0.5)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[
            styles.nextButtonGradient,
            !answers[currentQuestionIndex] && styles.disabledNextButton
          ]}
        >
          <TouchableOpacity 
            style={styles.nextButtonTouchable}
            onPress={handleNextPress}
            disabled={!answers[currentQuestionIndex]}
            activeOpacity={0.8}
          >
            <Text style={styles.nextButtonText}>
              {currentQuestionIndex < questions.length - 1 ? t('personalityTest.nextQuestion') : t('personalityTest.seeResults')}
            </Text>
            <Ionicons 
              name={currentQuestionIndex < questions.length - 1 ? "arrow-forward" : "checkmark-circle"} 
              size={20} 
              color="#fff" 
            />
          </TouchableOpacity>
        </LinearGradient>
        
        {/* Question Counter Pills */}
        <View style={styles.questionPillsContainer}>
          {Array(Math.min(5, questions.length)).fill(0).map((_, index) => {
            const pillIndex = (() => {
              if (currentQuestionIndex < 2) return index;
              if (currentQuestionIndex > questions.length - 3) return questions.length - 5 + index;
              return currentQuestionIndex - 2 + index;
            })();
            
            if (pillIndex >= 0 && pillIndex < questions.length) {
              return (
                <View 
                  key={index}
                  style={[
                    styles.questionPill,
                    pillIndex === currentQuestionIndex && styles.activeQuestionPill,
                    pillIndex < currentQuestionIndex && styles.completedQuestionPill
                  ]}
                />
              );
            }
            return null;
          })}
        </View>
      </Animated.View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#03174C" />
      
      {/* Header */}
      <LinearGradient
        colors={['#E6EEF8', '#E6EEF8']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.header}
      >
        <TouchableOpacity 
          onPress={() => {
            if (testStarted) {
              setTestStarted(false);
              setCurrentQuestionIndex(0);
              setAnswers({});
            } else {
              navigation.goBack();
            }
          }}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#03174C" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('personalityTest.title')}</Text>
        <View style={{ width: 24 }} />
      </LinearGradient>

      {/* Progress Bar */}
      {testStarted && (
        <View style={styles.progressBarContainer}>
          <View 
            style={[
              styles.progressBar, 
              { width: `${progress}%` }
            ]} 
          />
        </View>
      )}

      <ScrollView 
        style={styles.scrollContainer}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {testStarted ? renderQuestion() : renderIntro()}
      </ScrollView>
    </SafeAreaView>
  );
};

export default PersonalityTest;