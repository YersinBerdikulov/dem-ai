// app/pages/Discover/Test/WorryTest/index.js
import React, { useState, useMemo } from 'react';
import { Alert } from 'react-native';
import IntroPage from './IntroPage';
import QuestionsPage from './QuestionsPage';
import ResultsPage from './ResultsPage';
import { 
  addDoc, 
  collection, 
  serverTimestamp 
} from 'firebase/firestore';
import { auth, db } from '../../../../../config/firebase';
import { useLanguage } from '../../../../context/LanguageContext';

const WorryTest = ({ navigation }) => {
  const [currentPage, setCurrentPage] = useState('intro');
  const [answers, setAnswers] = useState({});
  const [finalScore, setFinalScore] = useState(0);
  const [loading, setLoading] = useState(false);
  const [lastRefreshTime, setLastRefreshTime] = useState(new Date());
  const { t } = useLanguage();

  // Memoize questions to prevent recreation on every render
  const QUESTIONS = useMemo(() => [
    {
      id: 1,
      text: t('worryTest.questions.noTimeWorry') || "If I don't have enough time to do everything, I don't worry about it.",
      isReverse: true,
      scoring: {
        [t('worryTest.options.notAtAll') || 'Not at all typical']: 5,
        [t('worryTest.options.rarely') || 'Rarely typical']: 4,
        [t('worryTest.options.somewhat') || 'Somewhat typical']: 3,
        [t('worryTest.options.often') || 'Often typical']: 2,
        [t('worryTest.options.very') || 'Very typical']: 1
      }
    },
    {
      id: 2,
      text: t('worryTest.questions.worriesOverwhelm') || "My worries overwhelm me.",
      isReverse: false,
      scoring: {
        [t('worryTest.options.notAtAll') || 'Not at all typical']: 1,
        [t('worryTest.options.rarely') || 'Rarely typical']: 2,
        [t('worryTest.options.somewhat') || 'Somewhat typical']: 3,
        [t('worryTest.options.often') || 'Often typical']: 4,
        [t('worryTest.options.very') || 'Very typical']: 5
      }
    },
    {
      id: 3,
      text: t('worryTest.questions.dontTendWorry') || "I do not tend to worry about things.",
      isReverse: true,
      scoring: {
        [t('worryTest.options.notAtAll') || 'Not at all typical']: 5,
        [t('worryTest.options.rarely') || 'Rarely typical']: 4,
        [t('worryTest.options.somewhat') || 'Somewhat typical']: 3,
        [t('worryTest.options.often') || 'Often typical']: 2,
        [t('worryTest.options.very') || 'Very typical']: 1
      }
    },
    {
      id: 4,
      text: t('worryTest.questions.manySituationsWorry') || "Many situations make me worry.",
      isReverse: false,
      scoring: {
        [t('worryTest.options.notAtAll') || 'Not at all typical']: 1,
        [t('worryTest.options.rarely') || 'Rarely typical']: 2,
        [t('worryTest.options.somewhat') || 'Somewhat typical']: 3,
        [t('worryTest.options.often') || 'Often typical']: 4,
        [t('worryTest.options.very') || 'Very typical']: 5
      }
    },
    {
      id: 5,
      text: t('worryTest.questions.cantHelp') || "I know I shouldn't worry about things, but I just cannot help it.",
      isReverse: false,
      scoring: {
        [t('worryTest.options.notAtAll') || 'Not at all typical']: 1,
        [t('worryTest.options.rarely') || 'Rarely typical']: 2,
        [t('worryTest.options.somewhat') || 'Somewhat typical']: 3,
        [t('worryTest.options.often') || 'Often typical']: 4,
        [t('worryTest.options.very') || 'Very typical']: 5
      }
    },
    {
      id: 6,
      text: t('worryTest.questions.underPressure') || "When I am under pressure I worry a lot.",
      isReverse: false,
      scoring: {
        [t('worryTest.options.notAtAll') || 'Not at all typical']: 1,
        [t('worryTest.options.rarely') || 'Rarely typical']: 2,
        [t('worryTest.options.somewhat') || 'Somewhat typical']: 3,
        [t('worryTest.options.often') || 'Often typical']: 4,
        [t('worryTest.options.very') || 'Very typical']: 5
      }
    },
    {
      id: 7,
      text: t('worryTest.questions.alwaysWorrying') || "I am always worrying about something.",
      isReverse: false,
      scoring: {
        [t('worryTest.options.notAtAll') || 'Not at all typical']: 1,
        [t('worryTest.options.rarely') || 'Rarely typical']: 2,
        [t('worryTest.options.somewhat') || 'Somewhat typical']: 3,
        [t('worryTest.options.often') || 'Often typical']: 4,
        [t('worryTest.options.very') || 'Very typical']: 5
      }
    },
    {
      id: 8,
      text: t('worryTest.questions.easyDismiss') || "I find it easy to dismiss worrisome thoughts.",
      isReverse: true,
      scoring: {
        [t('worryTest.options.notAtAll') || 'Not at all typical']: 5,
        [t('worryTest.options.rarely') || 'Rarely typical']: 4,
        [t('worryTest.options.somewhat') || 'Somewhat typical']: 3,
        [t('worryTest.options.often') || 'Often typical']: 2,
        [t('worryTest.options.very') || 'Very typical']: 1
      }
    },
    {
      id: 9,
      text: t('worryTest.questions.finishTask') || "As soon as I finish one task, I start to worry about everything else I have to do.",
      isReverse: false,
      scoring: {
        [t('worryTest.options.notAtAll') || 'Not at all typical']: 1,
        [t('worryTest.options.rarely') || 'Rarely typical']: 2,
        [t('worryTest.options.somewhat') || 'Somewhat typical']: 3,
        [t('worryTest.options.often') || 'Often typical']: 4,
        [t('worryTest.options.very') || 'Very typical']: 5
      }
    },
    {
      id: 10,
      text: t('worryTest.questions.neverWorry') || "I never worry about anything.",
      isReverse: true,
      scoring: {
        [t('worryTest.options.notAtAll') || 'Not at all typical']: 5,
        [t('worryTest.options.rarely') || 'Rarely typical']: 4,
        [t('worryTest.options.somewhat') || 'Somewhat typical']: 3,
        [t('worryTest.options.often') || 'Often typical']: 2,
        [t('worryTest.options.very') || 'Very typical']: 1
      }
    },
    {
      id: 11,
      text: t('worryTest.questions.nothingMore') || "When there is nothing more I can do about a concern, I don't worry about it anymore.",
      isReverse: true,
      scoring: {
        [t('worryTest.options.notAtAll') || 'Not at all typical']: 5,
        [t('worryTest.options.rarely') || 'Rarely typical']: 4,
        [t('worryTest.options.somewhat') || 'Somewhat typical']: 3,
        [t('worryTest.options.often') || 'Often typical']: 2,
        [t('worryTest.options.very') || 'Very typical']: 1
      }
    },
    {
      id: 12,
      text: t('worryTest.questions.worrierAllLife') || "I've been a worrier all my life.",
      isReverse: false,
      scoring: {
        [t('worryTest.options.notAtAll') || 'Not at all typical']: 1,
        [t('worryTest.options.rarely') || 'Rarely typical']: 2,
        [t('worryTest.options.somewhat') || 'Somewhat typical']: 3,
        [t('worryTest.options.often') || 'Often typical']: 4,
        [t('worryTest.options.very') || 'Very typical']: 5
      }
    },
    {
      id: 13,
      text: t('worryTest.questions.noticeWorrying') || "I notice that I have been worrying about things.",
      isReverse: false,
      scoring: {
        [t('worryTest.options.notAtAll') || 'Not at all typical']: 1,
        [t('worryTest.options.rarely') || 'Rarely typical']: 2,
        [t('worryTest.options.somewhat') || 'Somewhat typical']: 3,
        [t('worryTest.options.often') || 'Often typical']: 4,
        [t('worryTest.options.very') || 'Very typical']: 5
      }
    },
    {
      id: 14,
      text: t('worryTest.questions.cantStop') || "Once I start worrying, I can't stop.",
      isReverse: false,
      scoring: {
        [t('worryTest.options.notAtAll') || 'Not at all typical']: 1,
        [t('worryTest.options.rarely') || 'Rarely typical']: 2,
        [t('worryTest.options.somewhat') || 'Somewhat typical']: 3,
        [t('worryTest.options.often') || 'Often typical']: 4,
        [t('worryTest.options.very') || 'Very typical']: 5
      }
    },
    {
      id: 15,
      text: t('worryTest.questions.worryAllTime') || "I worry all the time.",
      isReverse: false,
      scoring: {
        [t('worryTest.options.notAtAll') || 'Not at all typical']: 1,
        [t('worryTest.options.rarely') || 'Rarely typical']: 2,
        [t('worryTest.options.somewhat') || 'Somewhat typical']: 3,
        [t('worryTest.options.often') || 'Often typical']: 4,
        [t('worryTest.options.very') || 'Very typical']: 5
      }
    },
    {
      id: 16,
      text: t('worryTest.questions.worryProjects') || "I worry about projects until they are all done.",
      isReverse: false,
      scoring: {
        [t('worryTest.options.notAtAll') || 'Not at all typical']: 1,
        [t('worryTest.options.rarely') || 'Rarely typical']: 2,
        [t('worryTest.options.somewhat') || 'Somewhat typical']: 3,
        [t('worryTest.options.often') || 'Often typical']: 4,
        [t('worryTest.options.very') || 'Very typical']: 5
      }
    }
  ], [t]);

  const handleStartTest = () => {
    if (!auth.currentUser) {
      Alert.alert(
        t('worryTest.signInRequired') || 'Sign In Required',
        t('worryTest.signInMessage') || 'Please sign in to take the test',
        [
          { text: t('common.ok') || 'OK', onPress: () => navigation.navigate('Login') }
        ]
      );
      return;
    }
    setCurrentPage('questions');
  };

  const handleAnswer = (questionId, answer) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const calculateScore = () => {
    let total = 0;
    Object.entries(answers).forEach(([questionId, answerIndex]) => {
      const question = QUESTIONS.find(q => q.id === parseInt(questionId));
      const answerOptions = [
        t('worryTest.options.notAtAll') || 'Not at all typical',
        t('worryTest.options.rarely') || 'Rarely typical',
        t('worryTest.options.somewhat') || 'Somewhat typical',
        t('worryTest.options.often') || 'Often typical',
        t('worryTest.options.very') || 'Very typical'
      ];
      const answerText = answerOptions[answerIndex - 1];
      if (question && question.scoring && question.scoring[answerText] !== undefined) {
        total += question.scoring[answerText];
      }
    });
    return total;
  };

  const handleFinishTest = async () => {
    if (!auth.currentUser) {
      Alert.alert(t('common.error') || 'Error', t('worryTest.signInMessage') || 'Please sign in to save your results');
      return;
    }

    try {
      setLoading(true);
      const score = calculateScore();
      setFinalScore(score);

      const scoreData = {
        userId: auth.currentUser.uid,
        score,
        timestamp: serverTimestamp(),
        testType: 'worry',
        createdAt: new Date().toISOString(),
        answers: Object.entries(answers).map(([questionId, answer]) => {
          const question = QUESTIONS.find(q => q.id === parseInt(questionId));
          const answerOptions = [
            t('worryTest.options.notAtAll') || 'Not at all typical',
            t('worryTest.options.rarely') || 'Rarely typical',
            t('worryTest.options.somewhat') || 'Somewhat typical',
            t('worryTest.options.often') || 'Often typical',
            t('worryTest.options.very') || 'Very typical'
          ];
          const answerText = answerOptions[answer - 1];
          return {
            questionId: parseInt(questionId),
            answer,
            score: question?.scoring?.[answerText] || 0
          };
        })
      };

      await addDoc(collection(db, 'worryScores'), scoreData);
      
      // Force a refresh of the progress data
      setLastRefreshTime(new Date());
      setCurrentPage('results');
    } catch (error) {
      console.error('Error saving score:', error);
      Alert.alert(
        t('common.error') || 'Error',
        t('worryTest.saveError') || 'Unable to save your test results. Please try again.',
        [
          { text: t('common.retry') || 'Try Again', onPress: () => handleFinishTest() },
          { text: t('common.cancel') || 'Cancel', style: 'cancel' }
        ]
      );
    } finally {
      setLoading(false);
    }
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'intro':
        return (
          <IntroPage 
            navigation={navigation} 
            onStartTest={handleStartTest}
            lastRefreshTime={lastRefreshTime}
            loading={loading}
          />
        );
      case 'questions':
        return (
          <QuestionsPage
            questions={QUESTIONS}
            answers={answers}
            onAnswer={handleAnswer}
            onFinish={handleFinishTest}
            navigation={navigation}
            loading={loading}
          />
        );
      case 'results':
        return (
          <ResultsPage
            score={finalScore}
            answers={answers}
            navigation={navigation}
            onRetakeTest={() => {
              setAnswers({});
              setFinalScore(0);
              setCurrentPage('questions');
            }}
          />
        );
      default:
        return null;
    }
  };

  return renderPage();
};

export default WorryTest;