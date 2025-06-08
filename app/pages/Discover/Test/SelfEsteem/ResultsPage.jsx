// app/pages/Discover/Test/SelfEsteem/ResultsPage.js
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, ActivityIndicator, ScrollView } from 'react-native';
import { styles } from '../../../../../styles/discover/selfEsteem/resultStyles';
import CircularProgress from '../../../../components/CircularProgress';
import { auth, db } from '../../../../../config/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { Ionicons } from '@expo/vector-icons';
import { useLanguage } from '../../../../context/LanguageContext';

const ResultsPaget = ({ score, navigation, answers }) => {
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(true);
  const [insightText, setInsightText] = useState("");
  const { t } = useLanguage();

  const getFeedbackText = (score) => {
    if (score <= 10) {
      return t('selfEsteemTest.feedback.veryLow') || "Your self-esteem level appears to be quite low. Consider seeking support to build a more positive self-image.";
    } else if (score <= 15) {
      return t('selfEsteemTest.feedback.belowAverage') || "Your self-esteem is below average. There's room for improvement in how you view yourself.";
    } else if (score <= 20) {
      return t('selfEsteemTest.feedback.moderate') || "You have a moderate level of self-esteem. There are both strengths and areas for growth.";
    } else if (score <= 25) {
      return t('selfEsteemTest.feedback.good') || "You show good self-esteem. Continue building on your positive self-image.";
    } else {
      return t('selfEsteemTest.feedback.veryHealthy') || "You demonstrate very healthy self-esteem. Keep maintaining this positive self-view.";
    }
  };

  const getDetailsInsight = (score, answers, username) => {
    let insight = `${username}, ${t('selfEsteemTest.insights.basedOnResponses') || 'based on your responses,'} `;

    if (score <= 10) {
      insight += t('selfEsteemTest.insights.challengesWithPerception') || "it seems you might be experiencing some challenges with self-perception. Consider working with a counselor to develop strategies for building self-esteem.";
    } else if (score <= 15) {
      insight += t('selfEsteemTest.insights.recognizeQualities') || "while you recognize some of your positive qualities, there's room to develop a stronger sense of self-worth.";
    } else if (score <= 20) {
      insight += t('selfEsteemTest.insights.balancedView') || "you have a balanced view of yourself, though there might be specific areas where you could build more confidence.";
    } else if (score <= 25) {
      insight += t('selfEsteemTest.insights.generallyPositive') || "you maintain a generally positive self-image while being aware of areas for personal growth.";
    } else {
      insight += t('selfEsteemTest.insights.strongSense') || "you demonstrate a strong sense of self-worth and maintain a healthy balance in self-perception.";
    }

    return insight;
  };

  useEffect(() => {
    const fetchUsername = async () => {
      try {
        const userDoc = await getDoc(doc(db, 'users', auth.currentUser.uid));
        const userData = userDoc.data();
        const name = userData?.fullName?.split(' ')[0] || t('selfEsteemTest.defaultUser') || "User";
        setUsername(name);
        setInsightText(getDetailsInsight(score, answers, name));
      } catch (error) {
        console.error('Error fetching user data:', error);
        const defaultName = t('selfEsteemTest.defaultUser') || "User";
        setUsername(defaultName);
        setInsightText(getDetailsInsight(score, answers, defaultName));
      } finally {
        setLoading(false);
      }
    };

    fetchUsername();
  }, [score, answers, t]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerIcon}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.title}>{t('selfEsteemTest.results') || 'Results'}</Text>
        <View style={styles.headerIcon} />
      </View>

      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.content}>
          <View style={styles.scoreSection}>
            <View style={styles.circleContainer}>
              <CircularProgress progress={score / 30} size={200} strokeWidth={12} />
              <View style={styles.scoreTextContainer}>
                <Text style={styles.scoreText}>{score}/30</Text>
                <Text style={styles.scoreLabel}>{t('selfEsteemTest.yourScore') || 'Your score'}</Text>
              </View>
            </View>
          </View>

          <View style={styles.feedbackCard}>
            <Text style={styles.feedbackText}>
              {getFeedbackText(score)}
            </Text>
          </View>

          <View style={styles.insightsCard}>
            <Text style={styles.insightsTitle}>{t('selfEsteemTest.insights.title') || 'Insights'}</Text>
            {loading ? (
              <>
                <ActivityIndicator color="white" size="large" />
                <Text style={styles.loadingText}>
                  {t('selfEsteemTest.analyzing') || 'Analyzing your responses...'}
                </Text>
              </>
            ) : (
              <Text style={styles.insightText}>{insightText}</Text>
            )}
          </View>

          <Text style={styles.disclaimer}>
            {t('selfEsteemTest.disclaimer') || 'This assessment is for informational purposes only. If you\'re experiencing persistent concerns about self-esteem, consider consulting with a mental health professional for personalized guidance and support.'}
          </Text>

          <TouchableOpacity 
            style={styles.doneButton}
            onPress={() => navigation.navigate('DiscoverHome')}
          >
            <Text style={styles.doneButtonText}>{t('common.done') || 'Done'}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ResultsPaget;