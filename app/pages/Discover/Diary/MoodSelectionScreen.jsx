import React, { useState } from "react";
import { 
  View, 
  Text, 
  TouchableOpacity, 
  SafeAreaView, 
  ScrollView,
  Alert
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '../../../../config/firebase';
import styles from "../../../../styles/discover/Diary/MoodSelectionStyles";
import { useLanguage } from '../../../context/LanguageContext';

const MoodSelectionScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { t } = useLanguage();
    const { selectedDate, isUpdating } = route.params;
    const [selectedMood, setSelectedMood] = useState(null);
    const [isPositive, setIsPositive] = useState(true);
    const [loading, setLoading] = useState(false);

    // Get localized moods
    const getPositiveMoods = () => [
        { emoji: "😊", text: t('diary.moods.positive.hopeful') },
        { emoji: "🙂", text: t('diary.moods.positive.happy') },
        { emoji: "😇", text: t('diary.moods.positive.calm') },
        { emoji: "😃", text: t('diary.moods.positive.great') },
        { emoji: "🙂", text: t('diary.moods.positive.joyful') },
        { emoji: "😇", text: t('diary.moods.positive.inspired') },
        { emoji: "🥲", text: t('diary.moods.positive.proud') },
        { emoji: "🏃", text: t('diary.moods.positive.motivated') },
        { emoji: "😎", text: t('diary.moods.positive.confident') },
        { emoji: "🤩", text: t('diary.moods.positive.excited') },
        { emoji: "💛", text: t('diary.moods.positive.loved') },
        { emoji: "🤪", text: t('diary.moods.positive.energetic') },
        { emoji: "😍", text: t('diary.moods.positive.amazing') },
        { emoji: "😆", text: t('diary.moods.positive.ecstatic') },
        { emoji: "😌", text: t('diary.moods.positive.euphoric') }
    ];

    const getNegativeMoods = () => [
        { emoji: "😐", text: t('diary.moods.negative.indifferent') },
        { emoji: "😔", text: t('diary.moods.negative.melancholic') },
        { emoji: "😟", text: t('diary.moods.negative.worried') },
        { emoji: "😕", text: t('diary.moods.negative.nervous') },
        { emoji: "😠", text: t('diary.moods.negative.annoyed') },
        { emoji: "😰", text: t('diary.moods.negative.anxious') },
        { emoji: "😡", text: t('diary.moods.negative.frustrated') },
        { emoji: "😫", text: t('diary.moods.negative.agitated') },
        { emoji: "😤", text: t('diary.moods.negative.irritated') },
        { emoji: "😢", text: t('diary.moods.negative.pessimistic') },
        { emoji: "😱", text: t('diary.moods.negative.furious') },
        { emoji: "😩", text: t('diary.moods.negative.distressed') },
        { emoji: "😣", text: t('diary.moods.negative.awful') },
        { emoji: "😨", text: t('diary.moods.negative.panicked') },
        { emoji: "😭", text: t('diary.moods.negative.desperate') }
    ];
  
    const currentMoods = isPositive ? getPositiveMoods() : getNegativeMoods();
  
    const handleMoodSelection = (mood, index) => {
      setSelectedMood({
        type: isPositive ? 'positive' : 'negative',
        emoji: mood.emoji,
        text: mood.text,
        index
      });
    };
  
    const handleNext = () => {
      if (selectedMood) {
        navigation.navigate("BodyFeeling", { 
          selectedMood,
          selectedDate,
          isUpdating 
        });
      }
    };
  
    return (
      <SafeAreaView style={styles.safeContainer}>
        {/* Header Section */}
        <View style={styles.headerSection}>
          <View style={styles.headerContainer}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.backIcon}>←</Text>
            </TouchableOpacity>
            <Text style={styles.headerTitle}>{t('diary.addEntry')}</Text>
          </View>
  
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: '20%' }]} />
          </View>
  
          <Text style={styles.questionText}>{t('diary.whatIsYourMood')}</Text>
  
          {/* Toggle buttons */}
          <View style={styles.toggleContainer}>
            <TouchableOpacity
              style={[
                styles.toggleButton,
                isPositive && styles.activeToggleButton
              ]}
              onPress={() => setIsPositive(true)}
            >
              <Text style={[
                styles.toggleText,
                isPositive && styles.activeToggleText
              ]}>{t('diary.positive')}</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.toggleButton,
                !isPositive && styles.activeToggleButtonNegative
              ]}
              onPress={() => setIsPositive(false)}
            >
              <Text style={[
                styles.toggleText,
                !isPositive && styles.activeToggleText
              ]}>{t('diary.negative')}</Text>
            </TouchableOpacity>
          </View>
        </View>
  
        {/* Mood Grid */}
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollViewContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.moodGrid}>
            {currentMoods.map((mood, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.moodItem,
                  selectedMood?.index === index && styles.selectedMoodItem
                ]}
                onPress={() => handleMoodSelection(mood, index)}
                activeOpacity={0.7}
              >
                <Text style={styles.moodEmoji}>{mood.emoji}</Text>
                <Text style={styles.moodText}>{mood.text}</Text>
              </TouchableOpacity>
            ))}
          </View>
  
          <TouchableOpacity 
            style={[
              styles.nextButton,
              !selectedMood && styles.disabledButton
            ]}
            disabled={!selectedMood || loading}
            onPress={handleNext}
          >
            <Text style={styles.buttonText}>
              {loading ? t('common.loading') : t('common.next')}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    );
  };
  
  export default MoodSelectionScreen;