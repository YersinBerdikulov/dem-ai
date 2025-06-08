// app/pages/Discover/Test/InsomniaRating/ResultsPage.js
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, ActivityIndicator, ScrollView } from 'react-native';
import { styles } from '../../../../../styles/discover/insomniaRating/resultStyles';
import CircularProgress from '../../../../components/CircularProgress';
import { auth, db } from '../../../../../config/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { Ionicons } from '@expo/vector-icons';
import { useLanguage } from '../../../../context/LanguageContext';

const ResultsPage = ({ score, navigation, answers }) => {
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(true);
  const [insightText, setInsightText] = useState("");
  const { t } = useLanguage();

  const getFeedbackText = (score) => {
    if (score <= 8) {
      return t('insomniaTest.feedback.healthy');
    } else if (score <= 16) {
      return t('insomniaTest.feedback.mild');
    } else if (score <= 24) {
      return t('insomniaTest.feedback.moderate');
    } else if (score <= 32) {
      return t('insomniaTest.feedback.significant');
    } else {
      return t('insomniaTest.feedback.severe');
    }
  };

  const getDetailsInsight = (score, answers, username) => {
    let insight = `${username}, `;

    // Add sleep duration insight
    const durationAnswer = answers[2]; // Question about sleep duration
    if (durationAnswer) {
      insight += t('insomniaTest.insights.sleepDuration');
      if (durationAnswer <= 2) {
        insight += t('insomniaTest.insights.healthyRange');
      } else {
        insight += t('insomniaTest.insights.improveRange');
      }
    }

    // Add sleep quality insights based on score
    if (score <= 8) {
      insight += t('insomniaTest.insights.goodQuality');
    } else if (score <= 16) {
      insight += t('insomniaTest.insights.considerRoutine');
    } else if (score <= 24) {
      insight += t('insomniaTest.insights.benefitHygiene');
    } else if (score <= 32) {
      insight += t('insomniaTest.insights.professionalGuidance');
    } else {
      insight += t('insomniaTest.insights.sleepSpecialist');
    }

    return insight;
  };

  useEffect(() => {
    const fetchUsername = async () => {
      try {
        const userDoc = await getDoc(doc(db, 'users', auth.currentUser.uid));
        const userData = userDoc.data();
        const name = userData?.fullName?.split(' ')[0] || t('insomniaTest.defaultUser');
        setUsername(name);
        setInsightText(getDetailsInsight(score, answers, name));
      } catch (error) {
        console.error('Error fetching user data:', error);
        const defaultName = t('insomniaTest.defaultUser');
        setUsername(defaultName);
        setInsightText(getDetailsInsight(score, answers, defaultName));
      } finally {
        setLoading(false);
      }
    };

    fetchUsername();
  }, [score, answers]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerIcon}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.title}>{t('insomniaTest.results')}</Text>
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
              <CircularProgress progress={score / 40} size={200} strokeWidth={12} />
              <View style={styles.scoreTextContainer}>
                <Text style={styles.scoreText}>{score}/40</Text>
                <Text style={styles.scoreLabel}>{t('insomniaTest.yourScore')}</Text>
              </View>
            </View>
          </View>

          <View style={styles.feedbackCard}>
            <Text style={styles.feedbackText}>
              {getFeedbackText(score)}
            </Text>
          </View>

          <View style={styles.insightsCard}>
            <Text style={styles.insightsTitle}>{t('insomniaTest.insights.title')}</Text>
            {loading ? (
              <>
                <ActivityIndicator color="white" size="large" />
                <Text style={styles.loadingText}>
                  {t('insomniaTest.analyzing')}
                </Text>
              </>
            ) : (
              <Text style={styles.insightText}>{insightText}</Text>
            )}
          </View>

          <Text style={styles.disclaimer}>
            {t('insomniaTest.disclaimer')}
          </Text>

          <TouchableOpacity 
            style={styles.doneButton}
            onPress={() => navigation.navigate('DiscoverHome')}
          >
            <Text style={styles.doneButtonText}>{t('common.done')}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ResultsPage;