// app/pages/Discover/Test/WorryTest/ResultsPage.js
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, ActivityIndicator, ScrollView } from 'react-native';
import { styles } from '../../../../../styles/discover/resultStyles';
import CircularProgress from '../../../../components/CircularProgress';
import { auth, db } from '../../../../../config/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useLanguage } from '../../../../context/LanguageContext';

const ResultsPage = ({ score, navigation, answers }) => {
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(true);
  const [insightText, setInsightText] = useState("");
  const { t } = useLanguage();

  const getFeedbackText = (score) => {
    if (score <= 16) return t('worryTest.feedback.noWorries') || "No worries! You're handling things very well.";
    if (score <= 32) return t('worryTest.feedback.noticeable') || "Your concerns are noticeable but not severe.";
    if (score <= 48) return t('worryTest.feedback.moderate') || "You're experiencing moderate levels of worry.";
    if (score <= 64) return t('worryTest.feedback.high') || "Your worry levels are high. Consider talking to a professional.";
    return t('worryTest.feedback.veryHigh') || "You're experiencing very high levels of worry. Please consult a mental health professional.";
  };

  const getInsightText = (score, answers, username) => {
    const worryAreas = [];
    const strengths = [];

    // Analyze answers to identify specific worry areas and strengths
    if (answers) {
      if (answers[5] >= 4) worryAreas.push(t('worryTest.insights.uncontrollableWorry') || "uncontrollable worry");
      if (answers[7] >= 4) worryAreas.push(t('worryTest.insights.constantWorry') || "constant worry");
      if (answers[14] >= 4) worryAreas.push(t('worryTest.insights.difficultyStoppingWorry') || "difficulty stopping worry");
      
      if (answers[1] <= 2) strengths.push(t('worryTest.insights.timeManagement') || "time management");
      if (answers[8] <= 2) strengths.push(t('worryTest.insights.abilityToDismiss') || "ability to dismiss worries");
      if (answers[11] <= 2) strengths.push(t('worryTest.insights.lettingGo') || "letting go of concerns");
    }

    let insightText = `${username}, ${t('worryTest.insights.basedOnResponses') || 'based on your responses,'} `;

    if (score <= 16) {
      insightText += t('worryTest.insights.excellentResilience') || "you demonstrate excellent emotional resilience. ";
    } else if (score <= 32) {
      insightText += t('worryTest.insights.managingWell') || "you're managing your worries relatively well, though there's room for improvement. ";
    } else if (score <= 48) {
      insightText += t('worryTest.insights.noticeableLevels') || "you're experiencing noticeable levels of worry that might benefit from attention. ";
    } else if (score <= 64) {
      insightText += t('worryTest.insights.needCoping') || "your worry levels indicate a need for developing better coping strategies. ";
    } else {
      insightText += t('worryTest.insights.significantChallenges') || "your responses suggest significant challenges with worry management. ";
    }

    if (worryAreas.length > 0) {
      insightText += `${t('worryTest.insights.focusOn') || 'You might want to focus on managing'} ${worryAreas.join(", ")}. `;
    }

    if (strengths.length > 0) {
      insightText += `${t('worryTest.insights.strengthsInclude') || 'Your strengths include'} ${strengths.join(", ")}. ${t('worryTest.insights.buildOnPositive') || 'Build on these positive aspects!'}`;
    }

    return insightText;
  };

  useEffect(() => {
    const fetchUsername = async () => {
      try {
        const userDoc = await getDoc(doc(db, 'users', auth.currentUser.uid));
        const userData = userDoc.data();
        const name = userData?.fullName?.split(' ')[0] || t('worryTest.defaultUser') || "User";
        setUsername(name);
        setInsightText(getInsightText(score, answers, name));
      } catch (error) {
        console.error('Error fetching user data:', error);
        const defaultName = t('worryTest.defaultUser') || "User";
        setUsername(defaultName);
        setInsightText(getInsightText(score, answers, defaultName));
      } finally {
        setLoading(false);
      }
    };

    fetchUsername();
  }, [score, answers, t]);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>{t('worryTest.results') || 'Results'}</Text>

      <View style={styles.scoreCircle}>
        <CircularProgress progress={score / 80} />
        <View style={styles.scoreCircleInner}>
          <Text style={styles.scoreText}>{score}/80</Text>
          <Text style={styles.scoreLabel}>{t('worryTest.yourScore') || 'Your score'}</Text>
        </View>
      </View>
      
      <View style={styles.feedbackCard}>
        <Text style={styles.feedbackText}>
          {getFeedbackText(score)}
        </Text>
      </View>

      <View style={styles.insightsCard}>
        <Text style={styles.insightsTitle}>{t('worryTest.insights.title') || 'Insights'}</Text>
        {loading ? (
          <>
            <ActivityIndicator color="white" size="large" />
            <Text style={styles.loadingText}>
              {t('worryTest.generating') || 'Generating insights, please wait...'}
            </Text>
          </>
        ) : (
          <Text style={styles.insightText}>{insightText}</Text>
        )}
      </View>

      <Text style={styles.disclaimer}>
        {t('worryTest.disclaimer') || 'This report is a tool to empower you to have informed conversations with your doctor or healthcare provider. It is not a diagnosis. Please consult with your healthcare provider if you are concerned about your health.'}
      </Text>

      <TouchableOpacity 
        style={styles.doneButton}
        onPress={() => navigation.navigate('DiscoverHome')}
      >
        <Text style={styles.doneButtonText}>{t('common.done') || 'Done'}</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default ResultsPage;