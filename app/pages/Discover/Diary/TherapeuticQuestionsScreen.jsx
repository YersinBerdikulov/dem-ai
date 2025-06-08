// src/screens/Diary/TherapeuticQuestionsScreen.js
import React, { useState } from "react";
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  SafeAreaView, 
  ScrollView,
  Alert
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '../../../../config/firebase';
import styles from "../../../../styles/discover/Diary/TherapeuticQuestionsStyles";
import { useLanguage } from '../../../context/LanguageContext';

const TherapeuticQuestionsScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { t } = useLanguage();
  const { selectedMood, selectedFeeling, initialThought, selectedDate } = route.params;
  const [answers, setAnswers] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get localized questions
  const getQuestions = () => [
    t('diary.questions.q1'),
    t('diary.questions.q2'),
    t('diary.questions.q3'),
    t('diary.questions.q4'),
    t('diary.questions.q5'),
    t('diary.questions.q6')
  ];

  const questions = getQuestions();

  const saveDiaryEntry = async () => {
    try {
      const userId = auth.currentUser?.uid;
      if (!userId) {
        Alert.alert(t('common.error'), t('diary.errors.mustBeLoggedIn'));
        return;
      }

      const diaryEntry = {
        userId,
        createdAt: serverTimestamp(),
        date: selectedDate.toISOString(),
        mood: selectedMood,
        bodyFeeling: selectedFeeling,
        initialThought,
        answers,
        status: 'active'
      };

      const docRef = await addDoc(collection(db, 'diaryEntries'), diaryEntry);
      return docRef.id;
    } catch (error) {
      console.error('Error saving diary entry:', error);
      throw error;
    }
  };

  const handleFinish = async () => {
    if (!Object.keys(answers).length) {
      Alert.alert(t('diary.errors.pleaseAnswerQuestions'));
      return;
    }

    try {
      setIsSubmitting(true);
      const entryId = await saveDiaryEntry();
      navigation.navigate("UserAnswers", {
        entryId,
        selectedDate,
        mood: selectedMood,
        bodyFeeling: selectedFeeling,
        initialThought,
        answers
      });
    } catch (error) {
      Alert.alert(t('common.error'), t('diary.errors.failedToSave'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeContainer}>
      <View style={styles.headerBox}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()} 
          style={styles.backButton}
        >
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerText}>{t('diary.addEntry')}</Text>
        
        <View style={styles.progressBarContainer}>
          <View style={styles.progressBar} />
        </View>
      </View>

      <ScrollView style={styles.scrollContainer}>
        <Text style={styles.title}>{t('diary.therapeuticQuestions')}</Text>

        {questions.map((question, index) => (
          <View key={index} style={styles.questionContainer}>
            <Text style={styles.questionText}>{question}</Text>
            <TextInput
              style={styles.input}
              placeholder={t('diary.placeholders.shareThoughts')}
              placeholderTextColor="#A9A9A9"
              value={answers[index]}
              onChangeText={(text) => 
                setAnswers(prev => ({...prev, [index]: text}))
              }
              multiline
            />
          </View>
        ))}

        <TouchableOpacity 
          style={[
            styles.finishButton,
            isSubmitting && styles.disabledButton
          ]}
          disabled={isSubmitting}
          onPress={handleFinish}
        >
          <Text style={styles.finishButtonText}>
            {isSubmitting ? t('diary.buttons.saving') : t('diary.buttons.finish')}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default TherapeuticQuestionsScreen;