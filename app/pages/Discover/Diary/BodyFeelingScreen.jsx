// src/screens/Diary/BodyFeelingScreen.js
import React, { useState } from "react";
import { 
  View, 
  Text, 
  TouchableOpacity, 
  SafeAreaView, 
  FlatList 
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import styles from "../../../../styles/discover/Diary/BodyFeelingStyles";
import { useLanguage } from '../../../context/LanguageContext';

const BodyFeelingScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { t } = useLanguage();
  const { selectedMood, selectedDate } = route.params;
  const [selectedFeeling, setSelectedFeeling] = useState(null);

  // Get localized body feelings
  const getBodyFeelings = () => [
    { id: '1', emoji: '🤒', label: t('diary.bodyFeelings.achy') },
    { id: '2', emoji: '😴', label: t('diary.bodyFeelings.tired') },
    { id: '3', emoji: '😰', label: t('diary.bodyFeelings.tense') },
    { id: '4', emoji: '😌', label: t('diary.bodyFeelings.relaxed') },
    { id: '5', emoji: '🧸', label: t('diary.bodyFeelings.comfortable') },
    { id: '6', emoji: '🦋', label: t('diary.bodyFeelings.nourished') },
    { id: '7', emoji: '💫', label: t('diary.bodyFeelings.energetic') },
    { id: '8', emoji: '⭐', label: t('diary.bodyFeelings.vibrant') },
    { id: '9', emoji: '💪', label: t('diary.bodyFeelings.powerful') }
  ];

  const bodyFeelings = getBodyFeelings();

  const renderFeelingItem = ({ item }) => (
    <TouchableOpacity 
      style={[
        styles.feelingItem,
        selectedFeeling?.id === item.id && styles.selectedFeelingItem
      ]}
      onPress={() => setSelectedFeeling(item)}
      activeOpacity={0.7}
    >
      <Text style={[
        styles.feelingEmoji,
        selectedFeeling?.id === item.id && styles.selectedEmoji
      ]}>{item.emoji}</Text>
      <Text style={[
        styles.feelingText,
        selectedFeeling?.id === item.id && styles.selectedText
      ]}>{item.label}</Text>
    </TouchableOpacity>
  );

  const handleNext = () => {
    if (selectedFeeling) {
      navigation.navigate("ShareFeeling", {
        selectedMood,
        selectedFeeling,
        selectedDate
      });
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
          <View style={[styles.progressBar, { width: '40%' }]} />
        </View>
        
        <Text style={styles.questionText}>{t('diary.howIsYourBody')}</Text>
      </View>

      <FlatList
        data={bodyFeelings}
        renderItem={renderFeelingItem}
        keyExtractor={item => item.id}
        numColumns={3}
        contentContainerStyle={styles.feelingsGrid}
        showsVerticalScrollIndicator={false}
      />

      <TouchableOpacity 
        style={[
          styles.nextButton,
          !selectedFeeling && styles.disabledButton
        ]}
        disabled={!selectedFeeling}
        onPress={handleNext}
        activeOpacity={0.7}
      >
        <Text style={styles.buttonText}>{t('common.next')}</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default BodyFeelingScreen;