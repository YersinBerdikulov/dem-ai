// app/pages/Discover/Test/LifeSatisfaction/index.js
import React, { useState, useMemo } from 'react';
import { Alert } from 'react-native';
import QuestionsPages from './QuestionsPage';
import IntroPages from './IntroPage';
import ResultsPages from './ResultsPage';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../../../../../config/firebase';
import { useLanguage } from '../../../../context/LanguageContext';

const LifeSatisfactionTest = ({ navigation }) => {
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
      text: t('lifeSatisfactionTest.questions.closeToIdeal') || "In most ways my life is close to my ideal.",
      scoring: {
        [t('lifeSatisfactionTest.options.stronglyDisagree') || 'Strongly Disagree']: 1,
        [t('lifeSatisfactionTest.options.disagree') || 'Disagree']: 2,
        [t('lifeSatisfactionTest.options.slightlyDisagree') || 'Slightly Disagree']: 3,
        [t('lifeSatisfactionTest.options.neutral') || 'Neither Agree nor Disagree']: 4,
        [t('lifeSatisfactionTest.options.slightlyAgree') || 'Slightly Agree']: 5,
        [t('lifeSatisfactionTest.options.agree') || 'Agree']: 6,
        [t('lifeSatisfactionTest.options.stronglyAgree') || 'Strongly Agree']: 7
      }
    },
    {
      id: 2,
      text: t('lifeSatisfactionTest.questions.excellentConditions') || "The conditions of my life are excellent.",
      scoring: {
        [t('lifeSatisfactionTest.options.stronglyDisagree') || 'Strongly Disagree']: 1,
        [t('lifeSatisfactionTest.options.disagree') || 'Disagree']: 2,
        [t('lifeSatisfactionTest.options.slightlyDisagree') || 'Slightly Disagree']: 3,
        [t('lifeSatisfactionTest.options.neutral') || 'Neither Agree nor Disagree']: 4,
        [t('lifeSatisfactionTest.options.slightlyAgree') || 'Slightly Agree']: 5,
        [t('lifeSatisfactionTest.options.agree') || 'Agree']: 6,
        [t('lifeSatisfactionTest.options.stronglyAgree') || 'Strongly Agree']: 7
      }
    },
    {
      id: 3,
      text: t('lifeSatisfactionTest.questions.satisfied') || "I am satisfied with my life.",
      scoring: {
        [t('lifeSatisfactionTest.options.stronglyDisagree') || 'Strongly Disagree']: 1,
        [t('lifeSatisfactionTest.options.disagree') || 'Disagree']: 2,
        [t('lifeSatisfactionTest.options.slightlyDisagree') || 'Slightly Disagree']: 3,
        [t('lifeSatisfactionTest.options.neutral') || 'Neither Agree nor Disagree']: 4,
        [t('lifeSatisfactionTest.options.slightlyAgree') || 'Slightly Agree']: 5,
        [t('lifeSatisfactionTest.options.agree') || 'Agree']: 6,
        [t('lifeSatisfactionTest.options.stronglyAgree') || 'Strongly Agree']: 7
      }
    },
    {
      id: 4,
      text: t('lifeSatisfactionTest.questions.importantThings') || "So far I have gotten the important things I want in life.",
      scoring: {
        [t('lifeSatisfactionTest.options.stronglyDisagree') || 'Strongly Disagree']: 1,
        [t('lifeSatisfactionTest.options.disagree') || 'Disagree']: 2,
        [t('lifeSatisfactionTest.options.slightlyDisagree') || 'Slightly Disagree']: 3,
        [t('lifeSatisfactionTest.options.neutral') || 'Neither Agree nor Disagree']: 4,
        [t('lifeSatisfactionTest.options.slightlyAgree') || 'Slightly Agree']: 5,
        [t('lifeSatisfactionTest.options.agree') || 'Agree']: 6,
        [t('lifeSatisfactionTest.options.stronglyAgree') || 'Strongly Agree']: 7
      }
    },
    {
      id: 5,
      text: t('lifeSatisfactionTest.questions.changeNothing') || "If I could live my life over, I would change almost nothing.",
      scoring: {
        [t('lifeSatisfactionTest.options.stronglyDisagree') || 'Strongly Disagree']: 1,
        [t('lifeSatisfactionTest.options.disagree') || 'Disagree']: 2,
        [t('lifeSatisfactionTest.options.slightlyDisagree') || 'Slightly Disagree']: 3,
        [t('lifeSatisfactionTest.options.neutral') || 'Neither Agree nor Disagree']: 4,
        [t('lifeSatisfactionTest.options.slightlyAgree') || 'Slightly Agree']: 5,
        [t('lifeSatisfactionTest.options.agree') || 'Agree']: 6,
        [t('lifeSatisfactionTest.options.stronglyAgree') || 'Strongly Agree']: 7
      }
    }
  ], [t]);

  const handleStartTest = () => {
    if (!auth.currentUser) {
      Alert.alert(
        t('lifeSatisfactionTest.signInRequired') || 'Sign In Required',
        t('lifeSatisfactionTest.signInMessage') || 'Please sign in to take the test',
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
        t('lifeSatisfactionTest.options.stronglyDisagree') || 'Strongly Disagree',
        t('lifeSatisfactionTest.options.disagree') || 'Disagree',
        t('lifeSatisfactionTest.options.slightlyDisagree') || 'Slightly Disagree',
        t('lifeSatisfactionTest.options.neutral') || 'Neither Agree nor Disagree',
        t('lifeSatisfactionTest.options.slightlyAgree') || 'Slightly Agree',
        t('lifeSatisfactionTest.options.agree') || 'Agree',
        t('lifeSatisfactionTest.options.stronglyAgree') || 'Strongly Agree'
      ];
      const answerText = answerOptions[answerIndex - 1];
      if (question && question.scoring && question.scoring[answerText]) {
        total += question.scoring[answerText];
      }
    });
    return total;
  };

  const handleFinishTest = async () => {
    if (!auth.currentUser) {
      Alert.alert(t('common.error') || 'Error', t('lifeSatisfactionTest.signInMessage') || 'Please sign in to save your results');
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
        testType: 'lifeSatisfaction',
        createdAt: new Date().toISOString(),
        answers: Object.entries(answers).map(([questionId, answer]) => {
          const question = QUESTIONS.find(q => q.id === parseInt(questionId));
          const answerOptions = [
            t('lifeSatisfactionTest.options.stronglyDisagree') || 'Strongly Disagree',
            t('lifeSatisfactionTest.options.disagree') || 'Disagree',
            t('lifeSatisfactionTest.options.slightlyDisagree') || 'Slightly Disagree',
            t('lifeSatisfactionTest.options.neutral') || 'Neither Agree nor Disagree',
            t('lifeSatisfactionTest.options.slightlyAgree') || 'Slightly Agree',
            t('lifeSatisfactionTest.options.agree') || 'Agree',
            t('lifeSatisfactionTest.options.stronglyAgree') || 'Strongly Agree'
          ];
          const answerText = answerOptions[answer - 1];
          return {
            questionId: parseInt(questionId),
            answer,
            score: question?.scoring?.[answerText] || 0
          };
        })
      };

      await addDoc(collection(db, 'lifeSatisfactionScores'), scoreData);
      setLastRefreshTime(new Date());
      setCurrentPage('results');
    } catch (error) {
      console.error('Error saving score:', error);
      Alert.alert(
        t('common.error') || 'Error',
        t('lifeSatisfactionTest.saveError') || 'Unable to save your test results. Please try again.',
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
          <IntroPages
            navigation={navigation} 
            onStartTest={handleStartTest}
            lastRefreshTime={lastRefreshTime}
            loading={loading}
          />
        );
      case 'questions':
        return (
          <QuestionsPages
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
          <ResultsPages
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

export default LifeSatisfactionTest;