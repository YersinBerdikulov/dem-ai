// app/pages/Discover/Test/SelfEsteem/index.js
import React, { useState, useMemo } from 'react';
import { Alert } from 'react-native';
import IntroPage from './IntroPage';
import QuestionsPage from './QuestionsPage';
import ResultsPage from './ResultsPage';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../../../../../config/firebase';
import { useLanguage } from '../../../../context/LanguageContext';

const SelfEsteemTest = ({ navigation }) => {
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
      text: t('selfEsteemTest.questions.satisfiedWithMyself') || "On the whole, I am satisfied with myself",
      scoring: {
        [t('selfEsteemTest.options.stronglyAgree') || 'Strongly Agree']: 3,
        [t('selfEsteemTest.options.agree') || 'Agree']: 2,
        [t('selfEsteemTest.options.disagree') || 'Disagree']: 1,
        [t('selfEsteemTest.options.stronglyDisagree') || 'Strongly Disagree']: 0
      }
    },
    {
      id: 2,
      text: t('selfEsteemTest.questions.noGoodAtAll') || "At times, I think I am no good at all",
      scoring: {
        [t('selfEsteemTest.options.stronglyAgree') || 'Strongly Agree']: 0,
        [t('selfEsteemTest.options.agree') || 'Agree']: 1,
        [t('selfEsteemTest.options.disagree') || 'Disagree']: 2,
        [t('selfEsteemTest.options.stronglyDisagree') || 'Strongly Disagree']: 3
      }
    },
    {
      id: 3,
      text: t('selfEsteemTest.questions.goodQualities') || "I feel that I have a number of good qualities",
      scoring: {
        [t('selfEsteemTest.options.stronglyAgree') || 'Strongly Agree']: 3,
        [t('selfEsteemTest.options.agree') || 'Agree']: 2,
        [t('selfEsteemTest.options.disagree') || 'Disagree']: 1,
        [t('selfEsteemTest.options.stronglyDisagree') || 'Strongly Disagree']: 0
      }
    },
    {
      id: 4,
      text: t('selfEsteemTest.questions.asWellAsOthers') || "I am able to do things as well as most other people",
      scoring: {
        [t('selfEsteemTest.options.stronglyAgree') || 'Strongly Agree']: 3,
        [t('selfEsteemTest.options.agree') || 'Agree']: 2,
        [t('selfEsteemTest.options.disagree') || 'Disagree']: 1,
        [t('selfEsteemTest.options.stronglyDisagree') || 'Strongly Disagree']: 0
      }
    },
    {
      id: 5,
      text: t('selfEsteemTest.questions.notProud') || "I feel I do not have much to be proud of",
      scoring: {
        [t('selfEsteemTest.options.stronglyAgree') || 'Strongly Agree']: 0,
        [t('selfEsteemTest.options.agree') || 'Agree']: 1,
        [t('selfEsteemTest.options.disagree') || 'Disagree']: 2,
        [t('selfEsteemTest.options.stronglyDisagree') || 'Strongly Disagree']: 3
      }
    },
    {
      id: 6,
      text: t('selfEsteemTest.questions.uselessAtTimes') || "I certainly feel useless at times",
      scoring: {
        [t('selfEsteemTest.options.stronglyAgree') || 'Strongly Agree']: 0,
        [t('selfEsteemTest.options.agree') || 'Agree']: 1,
        [t('selfEsteemTest.options.disagree') || 'Disagree']: 2,
        [t('selfEsteemTest.options.stronglyDisagree') || 'Strongly Disagree']: 3
      }
    },
    {
      id: 7,
      text: t('selfEsteemTest.questions.personOfWorth') || "I feel that I'm a person of worth, at least on an equal plane with others",
      scoring: {
        [t('selfEsteemTest.options.stronglyAgree') || 'Strongly Agree']: 3,
        [t('selfEsteemTest.options.agree') || 'Agree']: 2,
        [t('selfEsteemTest.options.disagree') || 'Disagree']: 1,
        [t('selfEsteemTest.options.stronglyDisagree') || 'Strongly Disagree']: 0
      }
    },
    {
      id: 8,
      text: t('selfEsteemTest.questions.moreRespect') || "I wish I could have more respect for myself",
      scoring: {
        [t('selfEsteemTest.options.stronglyAgree') || 'Strongly Agree']: 0,
        [t('selfEsteemTest.options.agree') || 'Agree']: 1,
        [t('selfEsteemTest.options.disagree') || 'Disagree']: 2,
        [t('selfEsteemTest.options.stronglyDisagree') || 'Strongly Disagree']: 3
      }
    },
    {
      id: 9,
      text: t('selfEsteemTest.questions.feelFailure') || "All in all, I am inclined to feel that I am a failure",
      scoring: {
        [t('selfEsteemTest.options.stronglyAgree') || 'Strongly Agree']: 0,
        [t('selfEsteemTest.options.agree') || 'Agree']: 1,
        [t('selfEsteemTest.options.disagree') || 'Disagree']: 2,
        [t('selfEsteemTest.options.stronglyDisagree') || 'Strongly Disagree']: 3
      }
    },
    {
      id: 10,
      text: t('selfEsteemTest.questions.positiveAttitude') || "I take a positive attitude toward myself",
      scoring: {
        [t('selfEsteemTest.options.stronglyAgree') || 'Strongly Agree']: 3,
        [t('selfEsteemTest.options.agree') || 'Agree']: 2,
        [t('selfEsteemTest.options.disagree') || 'Disagree']: 1,
        [t('selfEsteemTest.options.stronglyDisagree') || 'Strongly Disagree']: 0
      }
    }
  ], [t]);

  const handleStartTest = () => {
    if (!auth.currentUser) {
      Alert.alert(
        t('selfEsteemTest.signInRequired') || 'Sign In Required',
        t('selfEsteemTest.signInMessage') || 'Please sign in to take the test',
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
      const answerOptions = [
        t('selfEsteemTest.options.stronglyAgree') || 'Strongly Agree',
        t('selfEsteemTest.options.agree') || 'Agree',
        t('selfEsteemTest.options.disagree') || 'Disagree',
        t('selfEsteemTest.options.stronglyDisagree') || 'Strongly Disagree'
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
      Alert.alert(t('common.error') || 'Error', t('selfEsteemTest.signInMessage') || 'Please sign in to save your results');
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
        testType: 'selfEsteem',
        createdAt: new Date().toISOString(),
        answers: Object.entries(answers).map(([questionId, answer]) => {
          const question = QUESTIONS.find(q => q.id === parseInt(questionId));
          const answerOptions = [
            t('selfEsteemTest.options.stronglyAgree') || 'Strongly Agree',
            t('selfEsteemTest.options.agree') || 'Agree',
            t('selfEsteemTest.options.disagree') || 'Disagree',
            t('selfEsteemTest.options.stronglyDisagree') || 'Strongly Disagree'
          ];
          const answerText = answerOptions[answer - 1];
          return {
            questionId: parseInt(questionId),
            answer,
            score: question?.scoring?.[answerText] || 0
          };
        })
      };

      await addDoc(collection(db, 'selfEsteemScores'), scoreData);
      setLastRefreshTime(new Date());
      setCurrentPage('results');
    } catch (error) {
      console.error('Error saving score:', error);
      Alert.alert(
        t('common.error') || 'Error',
        t('selfEsteemTest.saveError') || 'Unable to save your test results. Please try again.',
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

export default SelfEsteemTest;