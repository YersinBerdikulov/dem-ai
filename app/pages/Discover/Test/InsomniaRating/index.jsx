// app/pages/Discover/Test/InsomniaRating/index.js
import React, { useState, useMemo } from 'react';
import { Alert } from 'react-native';
import IntroPage from './IntroPage';
import QuestionsPage from './QuestionsPage';
import ResultsPage from './ResultsPage';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../../../../../config/firebase';
import { useLanguage } from '../../../../context/LanguageContext';

const InsomniaRating = ({ navigation }) => {
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
      text: t('insomniaTest.questions.sleepTime') || "How many minutes do you need to fall asleep?",
      type: 'time',
      options: [
        { label: t('insomniaTest.options.sleepTime.option1') || "1-20 minutes", score: 0 },
        { label: t('insomniaTest.options.sleepTime.option2') || "21-40 minutes", score: 1 },
        { label: t('insomniaTest.options.sleepTime.option3') || "41-60 minutes", score: 2 },
        { label: t('insomniaTest.options.sleepTime.option4') || "61-90 minutes", score: 3 },
        { label: t('insomniaTest.options.sleepTime.option5') || "91 minutes and more", score: 4 }
      ]
    },
    {
      id: 2,
      text: t('insomniaTest.questions.sleepDuration') || "How many hours do you sleep during the night?",
      type: 'hours',
      options: [
        { label: t('insomniaTest.options.sleepDuration.option1') || "7 hours and more", score: 0 },
        { label: t('insomniaTest.options.sleepDuration.option2') || "5-6 hours", score: 1 },
        { label: t('insomniaTest.options.sleepDuration.option3') || "4 hours", score: 2 },
        { label: t('insomniaTest.options.sleepDuration.option4') || "2-3 hours", score: 3 },
        { label: t('insomniaTest.options.sleepDuration.option5') || "0-1 hours", score: 4 }
      ]
    },
    {
      id: 3,
      text: t('insomniaTest.questions.sleepDisturbed') || "My sleep is disturbed.",
      type: 'frequency',
      options: [
        { label: t('insomniaTest.options.frequency.always') || "Always", score: 4 },
        { label: t('insomniaTest.options.frequency.mostly') || "Mostly", score: 3 },
        { label: t('insomniaTest.options.frequency.sometimes') || "Sometimes", score: 2 },
        { label: t('insomniaTest.options.frequency.seldom') || "Seldom", score: 1 },
        { label: t('insomniaTest.options.frequency.never') || "Never", score: 0 }
      ]
    },
    {
      id: 4,
      text: t('insomniaTest.questions.wakeEarly') || "I wake up too early.",
      type: 'frequency',
      options: [
        { label: t('insomniaTest.options.frequency.always') || "Always", score: 4 },
        { label: t('insomniaTest.options.frequency.mostly') || "Mostly", score: 3 },
        { label: t('insomniaTest.options.frequency.sometimes') || "Sometimes", score: 2 },
        { label: t('insomniaTest.options.frequency.seldom') || "Seldom", score: 1 },
        { label: t('insomniaTest.options.frequency.never') || "Never", score: 0 }
      ]
    },
    {
      id: 5,
      text: t('insomniaTest.questions.lightSleep') || "I wake up from the slightest sound.",
      type: 'frequency',
      options: [
        { label: t('insomniaTest.options.frequency.always') || "Always", score: 4 },
        { label: t('insomniaTest.options.frequency.mostly') || "Mostly", score: 3 },
        { label: t('insomniaTest.options.frequency.sometimes') || "Sometimes", score: 2 },
        { label: t('insomniaTest.options.frequency.seldom') || "Seldom", score: 1 },
        { label: t('insomniaTest.options.frequency.never') || "Never", score: 0 }
      ]
    },
    {
      id: 6,
      text: t('insomniaTest.questions.notSlept') || "I feel that I have not slept all night.",
      type: 'frequency',
      options: [
        { label: t('insomniaTest.options.frequency.always') || "Always", score: 4 },
        { label: t('insomniaTest.options.frequency.mostly') || "Mostly", score: 3 },
        { label: t('insomniaTest.options.frequency.sometimes') || "Sometimes", score: 2 },
        { label: t('insomniaTest.options.frequency.seldom') || "Seldom", score: 1 },
        { label: t('insomniaTest.options.frequency.never') || "Never", score: 0 }
      ]
    },
    {
      id: 7,
      text: t('insomniaTest.questions.thinkAboutSleep') || "I think a lot about my sleep.",
      type: 'frequency',
      options: [
        { label: t('insomniaTest.options.frequency.always') || "Always", score: 4 },
        { label: t('insomniaTest.options.frequency.mostly') || "Mostly", score: 3 },
        { label: t('insomniaTest.options.frequency.sometimes') || "Sometimes", score: 2 },
        { label: t('insomniaTest.options.frequency.seldom') || "Seldom", score: 1 },
        { label: t('insomniaTest.options.frequency.never') || "Never", score: 0 }
      ]
    },
    {
      id: 8,
      text: t('insomniaTest.questions.afraidToBed') || "I am afraid to go to bed because of my disturbed sleep.",
      type: 'frequency',
      options: [
        { label: t('insomniaTest.options.frequency.always') || "Always", score: 4 },
        { label: t('insomniaTest.options.frequency.mostly') || "Mostly", score: 3 },
        { label: t('insomniaTest.options.frequency.sometimes') || "Sometimes", score: 2 },
        { label: t('insomniaTest.options.frequency.seldom') || "Seldom", score: 1 },
        { label: t('insomniaTest.options.frequency.never') || "Never", score: 0 }
      ]
    },
    {
      id: 9,
      text: t('insomniaTest.questions.feelFit') || "I feel fit during the day.",
      type: 'frequency',
      options: [
        { label: t('insomniaTest.options.frequency.always') || "Always", score: 0 },
        { label: t('insomniaTest.options.frequency.mostly') || "Mostly", score: 1 },
        { label: t('insomniaTest.options.frequency.sometimes') || "Sometimes", score: 2 },
        { label: t('insomniaTest.options.frequency.seldom') || "Seldom", score: 3 },
        { label: t('insomniaTest.options.frequency.never') || "Never", score: 4 }
      ]
    },
    {
      id: 10,
      text: t('insomniaTest.questions.sleepingPills') || "I take sleeping pills in order to get to sleep.",
      type: 'frequency',
      options: [
        { label: t('insomniaTest.options.frequency.always') || "Always", score: 4 },
        { label: t('insomniaTest.options.frequency.mostly') || "Mostly", score: 3 },
        { label: t('insomniaTest.options.frequency.sometimes') || "Sometimes", score: 2 },
        { label: t('insomniaTest.options.frequency.seldom') || "Seldom", score: 1 },
        { label: t('insomniaTest.options.frequency.never') || "Never", score: 0 }
      ]
    }
  ], [t]);

  const handleStartTest = () => {
    if (!auth.currentUser) {
      Alert.alert(
        t('insomniaTest.signInRequired') || 'Sign In Required',
        t('insomniaTest.signInMessage') || 'Please sign in to take the test',
        [{ text: t('common.ok') || 'OK', onPress: () => navigation.navigate('Login') }]
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
      if (question && question.options && question.options[answerIndex - 1]) {
        total += question.options[answerIndex - 1].score;
      }
    });
    return total;
  };

  const handleFinishTest = async () => {
    if (!auth.currentUser) {
      Alert.alert(t('common.error') || 'Error', t('insomniaTest.signInMessage') || 'Please sign in to save your results');
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
        testType: 'insomnia',
        createdAt: new Date().toISOString(),
        answers: Object.entries(answers).map(([questionId, answer]) => {
          const question = QUESTIONS.find(q => q.id === parseInt(questionId));
          return {
            questionId: parseInt(questionId),
            answer,
            score: question?.options?.[answer - 1]?.score || 0
          };
        })
      };

      await addDoc(collection(db, 'insomniaScores'), scoreData);
      setLastRefreshTime(new Date());
      setCurrentPage('results');
    } catch (error) {
      console.error('Error saving score:', error);
      Alert.alert(
        t('common.error') || 'Error',
        t('insomniaTest.saveError') || 'Unable to save your test results. Please try again.',
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

export default InsomniaRating;