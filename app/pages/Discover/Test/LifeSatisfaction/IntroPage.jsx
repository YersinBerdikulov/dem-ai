// app/pages/Discover/Test/LifeSatisfaction/IntroPage.js
import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, ActivityIndicator, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from '../../../../../styles/discover/introStyles';
import { collection, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { auth, db } from '../../../../../config/firebase';
import ProgressChart from '../../../../components/ProgressChart';
import CircularProgress from '../../../../components/CircularProgress';
import { useLanguage } from '../../../../context/LanguageContext';

const formatDate = (date) => {
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const IntroPages = ({ navigation, onStartTest, lastRefreshTime }) => {
  const [progressData, setProgressData] = useState([]);
  const [historyData, setHistoryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const { t } = useLanguage();

  const handleDeleteHistory = async (docId) => {
    try {
      await deleteDoc(doc(db, 'lifeSatisfactionScores', docId));
      await fetchProgressData();
    } catch (error) {
      console.error('Error deleting history:', error);
      Alert.alert(t('common.error') || 'Error', t('lifeSatisfactionTest.deleteError') || 'Unable to delete history. Please try again.');
    }
  };

  const fetchProgressData = useCallback(async () => {
    if (!auth.currentUser) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const q = query(
        collection(db, 'lifeSatisfactionScores'),
        where('userId', '==', auth.currentUser.uid)
      );

      const querySnapshot = await getDocs(q);
      const rawData = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.score !== undefined) {
          const date = data.createdAt ? new Date(data.createdAt) : new Date(data.timestamp);
          if (date && !isNaN(date.getTime())) {
            rawData.push({
              ...data,
              id: doc.id,
              date: date
            });
          }
        }
      });

      // Sort rawData by date
      rawData.sort((a, b) => b.date - a.date);

      // Set history data
      setHistoryData(rawData);

      // Process monthly data for progress chart
      const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
      const monthsData = new Map(months.map(month => [month, { score: 0, hasData: false }]));

      rawData.forEach((item) => {
        const monthName = months[item.date.getMonth()];
        const currentMonthData = monthsData.get(monthName);
        
        if (!currentMonthData.hasData) {
          monthsData.set(monthName, {
            score: item.score,
            hasData: true,
            date: item.date
          });
        }
      });

      const chartData = months.map(month => ({
        month,
        score: monthsData.get(month).score || 0,
        hasData: monthsData.get(month).hasData || false,
        date: monthsData.get(month).date
      }));

      setProgressData(chartData);
    } catch (error) {
      console.error('Error fetching progress:', error);
      setProgressData([]);
      setHistoryData([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProgressData();
  }, [fetchProgressData, lastRefreshTime]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', fetchProgressData);
    return unsubscribe;
  }, [navigation, fetchProgressData]);

  const hasAnyData = progressData.some(item => item.hasData);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerIcon}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.title}>{t('lifeSatisfactionTest.title') || 'Life Satisfaction'}</Text>
          <TouchableOpacity onPress={fetchProgressData} style={styles.menuIcon}>
            <Ionicons name="refresh" size={24} color="white" />
          </TouchableOpacity>
        </View>

        <View style={styles.contentContainer}>
          <View style={styles.progressCard}>
            <Text style={styles.progressTitle}>{t('lifeSatisfactionTest.progress') || 'Progress'}</Text>
            <View style={styles.progressLines}>
              {loading ? (
                <ActivityIndicator size="large" color="white" />
              ) : hasAnyData ? (
                <ProgressChart data={progressData} maxScore={35} />
              ) : (
                <Text style={styles.noDataText}>{t('lifeSatisfactionTest.noResults') || 'No test results yet'}</Text>
              )}
            </View>
          </View>

          <View style={styles.insightsCard}>
            <View style={styles.insightIcon}>
              <Ionicons name="bulb-outline" size={32} color="white" />
            </View>
            <Text style={styles.insightText}>
              {t('lifeSatisfactionTest.insight') || 'Understand your overall life satisfaction and identify areas for personal growth.'}
            </Text>
          </View>

          {historyData.length > 0 && (
            <View style={styles.historySection}>
              <Text style={styles.historyTitle}>{t('lifeSatisfactionTest.history') || 'History'}</Text>
              {historyData.map((item) => (
                <View key={item.id} style={styles.historyCard}>
                  <View style={styles.historyLeft}>
                    <View style={styles.circleWrapper}>
                      <CircularProgress progress={item.score / 35} size={50} strokeWidth={4} />
                    </View>
                  </View>
                  <View style={styles.historyRight}>
                    <View style={styles.historyScoreSection}>
                      <Text style={styles.historyScore}>{item.score}</Text>
                      <Text style={styles.historyDate}>{formatDate(item.date)}</Text>
                    </View>
                    <TouchableOpacity 
                      style={styles.deleteButton}
                      onPress={() => {
                        Alert.alert(
                          t('lifeSatisfactionTest.deleteTitle') || 'Delete Result',
                          t('lifeSatisfactionTest.deleteConfirmation') || 'Are you sure you want to delete this test result?',
                          [
                            { text: t('common.cancel') || 'Cancel', style: 'cancel' },
                            { 
                              text: t('common.delete') || 'Delete', 
                              onPress: () => handleDeleteHistory(item.id),
                              style: 'destructive'
                            }
                          ]
                        );
                      }}
                    >
                      <Ionicons name="trash-outline" size={20} color="white" />
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>

        <TouchableOpacity style={styles.startButton} onPress={onStartTest}>
          <Text style={styles.startButtonText}>{t('lifeSatisfactionTest.startTest') || 'Start the test'}</Text>
          <Ionicons name="arrow-forward" size={20} color="white" />
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default IntroPages;