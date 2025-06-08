// src/screens/Diary/ShareFeelingScreen.js
import React, { useState } from "react";
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import styles from "../../../../styles/discover/Diary/ShareFeelingStyles";
import { useLanguage } from '../../../context/LanguageContext';

const ShareFeelingScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { t } = useLanguage();
  const { selectedMood, selectedFeeling, selectedDate } = route.params;
  const [thought, setThought] = useState("");

  const handleNext = () => {
    Keyboard.dismiss();
    if (thought.trim()) {
      navigation.navigate("TherapeuticQuestions", {
        selectedMood,
        selectedFeeling,
        initialThought: thought,
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
          <View style={[styles.progressBar, { width: '60%' }]} />
        </View>
      </View>

      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoidingView}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.container}>
            <View style={styles.contentContainer}>
              <TextInput
                style={styles.input}
                placeholder={t('diary.placeholders.shareThoughts')}
                placeholderTextColor="#A9A9A9"
                value={thought}
                onChangeText={setThought}
                multiline
                textAlignVertical="top"
                returnKeyType="done"
                onSubmitEditing={Keyboard.dismiss}
              />
            </View>

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[
                  styles.nextButton,
                  !thought.trim() && styles.disabledButton
                ]}
                disabled={!thought.trim()}
                onPress={handleNext}
                activeOpacity={0.7}
              >
                <Text style={styles.buttonText}>{t('common.next')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ShareFeelingScreen;