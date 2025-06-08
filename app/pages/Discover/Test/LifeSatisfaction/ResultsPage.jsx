// app/pages/Discover/Test/LifeSatisfaction/ResultsPage.js
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, ActivityIndicator, ScrollView} from 'react-native';
import { styles } from '../../../../../styles/discover/lifeSatisfaction/resultStyles';
import CircularProgress from '../../../../components/CircularProgress';
import { auth, db } from '../../../../../config/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { Ionicons } from '@expo/vector-icons';
import { useLanguage } from '../../../../context/LanguageContext';

const ResultsPages = ({ score, navigation, answers }) => {
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(true);
  const [insightText, setInsightText] = useState("");
  const { t } = useLanguage();

  const getFeedbackText = (score) => {
    if (score <= 9) return t('lifeSatisfactionTest.feedback.extremelyDissatisfied') || "You appear to be extremely dissatisfied with your current life.";
    if (score <= 14) return t('lifeSatisfactionTest.feedback.dissatisfied') || "You appear to be dissatisfied with your life.";
    if (score <= 19) return t('lifeSatisfactionTest.feedback.belowAverage') || "You appear to be slightly below average in life satisfaction.";
    if (score <= 25) return t('lifeSatisfactionTest.feedback.generallySatisfied') || "You appear to be generally satisfied with your life.";
    if (score <= 29) return t('lifeSatisfactionTest.feedback.satisfiedMostAreas') || "You appear to be satisfied with most areas of your life.";
    return t('lifeSatisfactionTest.feedback.extremelySatisfied') || "You appear to be extremely satisfied with your life.";
  };

  useEffect(() => {
    const fetchUsername = async () => {
      try {
        const userDoc = await getDoc(doc(db, 'users', auth.currentUser.uid));
        const userData = userDoc.data();
        const name = userData?.fullName?.split(' ')[0] || t('lifeSatisfactionTest.defaultUser') || "User";
        setUsername(name);
        setInsightText(generateInsights(score, name));
      } catch (error) {
        console.error('Error fetching user data:', error);
        const defaultName = t('lifeSatisfactionTest.defaultUser') || "User";
        setUsername(defaultName);
        setInsightText(generateInsights(score, defaultName));
      } finally {
        setLoading(false);
      }
    };

    fetchUsername();
  }, [score, t]);

  const generateInsights = (score, name) => {
    let insights = `${name}, `;
    if (score <= 9) {
      insights += t('lifeSatisfactionTest.insights.significantImprovement') || "your responses indicate significant room for improvement in life satisfaction. Consider professional support to explore ways to enhance your well-being.";
    } else if (score <= 19) {
      insights += t('lifeSatisfactionTest.insights.somePositive') || "while there are some positive aspects in your life, there might be areas where changes could bring greater satisfaction.";
    } else if (score <= 25) {
      insights += t('lifeSatisfactionTest.insights.healthyLevel') || "you show a healthy level of life satisfaction. Consider what specific elements contribute most to your contentment.";
    } else if (score <= 29) {
      insights += t('lifeSatisfactionTest.insights.strongSatisfaction') || "you demonstrate strong life satisfaction across multiple areas. Your approach to life appears to be working well.";
    } else {
      insights += t('lifeSatisfactionTest.insights.exceptional') || "you show exceptional life satisfaction! Your outlook and life choices seem to be creating very positive outcomes.";
    }
    return insights;
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerIcon}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.title}>{t('lifeSatisfactionTest.results') || 'Results'}</Text>
        <View style={styles.headerIcon} />
      </View>
      <ScrollView 
              style={styles.scrollView}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.scrollContent}
            >

      <View style={styles.content}>
        <View style={styles.scoreSection}>
          <CircularProgress progress={score / 35} size={200} strokeWidth={12} />
          <View style={styles.scoreTextContainer}>
            <Text style={styles.scoreText}>{score}/35</Text>
            <Text style={styles.scoreLabel}>{t('lifeSatisfactionTest.yourScore') || 'Your score'}</Text>
          </View>
        </View>

        <View style={styles.feedbackCard}>
          <Text style={styles.feedbackText}>
            {getFeedbackText(score)}
          </Text>
        </View>

        <View style={styles.insightsCard}>
          <Text style={styles.insightsTitle}>{t('lifeSatisfactionTest.insights.title') || 'Insights'}</Text>
          {loading ? (
            <>
              <ActivityIndicator color="white" size="large" />
              <Text style={styles.loadingText}>
                {t('lifeSatisfactionTest.generating') || 'Generating insights, please wait...'}
              </Text>
            </>
          ) : (
            <Text style={styles.insightText}>{insightText}</Text>
          )}
        </View>

        <Text style={styles.disclaimer}>
          {t('lifeSatisfactionTest.disclaimer') || 'This assessment is designed for informational purposes only and should not be considered as professional advice. Please consult with appropriate professionals for personalized guidance.'}
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

export default ResultsPages;