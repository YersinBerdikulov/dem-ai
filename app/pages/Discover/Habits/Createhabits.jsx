import React, { useState } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  ScrollView,
  StatusBar,
  FlatList,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { createHabitStyles as styles } from '../../../../styles/discover/Habits/createHabitStyles';
import { auth, db } from '../../../../config/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { useLanguage } from '../../../context/LanguageContext';

// Emoji icons for habits
const habitIcons = [
  { id: 'heart', emoji: '❤️' },
  { id: 'exercise', emoji: '🏃‍♂️' },
  { id: 'book', emoji: '📚' },
  { id: 'bike', emoji: '🚴‍♂️' },
  { id: 'jump', emoji: '🤸‍♂️' },
  { id: 'flag', emoji: '🏁' },
  { id: 'muscle', emoji: '💪' },
  { id: 'walk', emoji: '🚶‍♂️' },
  { id: 'note', emoji: '📝' },
  { id: 'target', emoji: '🎯' },
  { id: 'calendar', emoji: '📅' },
  { id: 'music', emoji: '🎵' },
  { id: 'family', emoji: '👨‍👩‍👧‍👦' },
  { id: 'money', emoji: '💰' },
  { id: 'flower', emoji: '🌸' },
  { id: 'laptop', emoji: '💻' },
  { id: 'nosmoke', emoji: '🚭' },
  { id: 'chart', emoji: '📈' },
  { id: 'home', emoji: '🏠' },
  { id: 'apple', emoji: '🍎' },
  { id: 'broccoli', emoji: '🥦' },
  { id: 'plate', emoji: '🍽️' },
  { id: 'glass', emoji: '🥛' },
  { id: 'graduate', emoji: '🎓' },
  { id: 'idea', emoji: '💡' },
  { id: 'pizza', emoji: '🍕' },
  { id: 'cook', emoji: '👨‍🍳' },
  { id: 'guitar', emoji: '🎸' },
  { id: 'alarm', emoji: '⏰' },
  { id: 'syringe', emoji: '💉' },
  { id: 'sleep', emoji: '😴' },
  { id: 'shower', emoji: '🚿' },
];

const CreateHabit = ({ navigation }) => {
  const { t } = useLanguage();
  const [habitStep, setHabitStep] = useState(1); 
  const [habitTitle, setHabitTitle] = useState('');
  const [selectedIcon, setSelectedIcon] = useState({ id: 'smile', emoji: '😄' });
  const [duration, setDuration] = useState('5');
  const [points, setPoints] = useState('2');
  const [loading, setLoading] = useState(false);

  // Get localized habit suggestions
  const getHabitSuggestions = () => [
    t('habits.suggestions.read15'),
    t('habits.suggestions.pushups'),
    t('habits.suggestions.drinkWater'),
    t('habits.suggestions.meditate10'),
    t('habits.suggestions.gratitude'),
    t('habits.suggestions.stretch'),
    t('habits.suggestions.runningShoes'),
  ];

  const habitSuggestions = getHabitSuggestions();

  const handleSuggestionSelect = (suggestion) => {
    setHabitTitle(suggestion);
  };

  const handleIconSelect = (icon) => {
    setSelectedIcon(icon);
  };
  
  const moveToIconSelection = () => {
    if (!habitTitle.trim()) {
      return;
    }
    setHabitStep(2);
  };
  
  const saveHabit = async () => {
    if (!habitTitle.trim()) {
      return;
    }
    setLoading(true);
    try {
      const user = auth.currentUser;
      if (user) {
        const habitData = {
          userId: user.uid,
          title: habitTitle.trim(),
          duration: parseInt(duration, 10) || 5,
          points: parseInt(points, 10) || 2,
          emoji: selectedIcon.emoji,
          iconType: 'emoji',
          createdAt: new Date().toISOString(),
          category: 'custom',
          completed: false,
          isUserHabit: true
        };

        await addDoc(collection(db, 'user_habits'), habitData);
        navigation.navigate('Habits', { refresh: true });
      }
    } catch (error) {
      console.error('Error saving habit:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderDescriptionStep = () => (
    <KeyboardAvoidingView 
      style={{ flex: 1 }} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={20}
    >
      <View style={styles.iconPreviewContainer}>
        <View style={styles.iconBox}>
          <Text style={styles.emojiIcon}>{selectedIcon.emoji}</Text>
          <TouchableOpacity style={styles.editIconButton} onPress={() => setHabitStep(2)}>
            <Ionicons name="pencil" size={18} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>

      <Text style={styles.descriptionTitle}>{t('habits.describeHabits')}</Text>
      
      <Text style={styles.subtitleText}>{t('habits.selectFromBelow')}</Text>

      <View style={styles.suggestionsWrapper}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.suggestionsContainer}
        >
          {habitSuggestions.map((suggestion, index) => (
            <TouchableOpacity
              key={index}
              style={styles.suggestionButton}
              onPress={() => handleSuggestionSelect(suggestion)}
            >
              <Text style={styles.suggestionText}>{suggestion}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.habitInput}
          placeholder={t('habits.habit')}
          placeholderTextColor="rgba(255, 255, 255, 0.5)"
          value={habitTitle}
          onChangeText={setHabitTitle}
          returnKeyType="next"
        />
        <TouchableOpacity 
          style={[
            styles.nextButton,
            !habitTitle.trim() && styles.nextButtonDisabled
          ]}
          onPress={moveToIconSelection}
          disabled={!habitTitle.trim()}
        >
          <Ionicons name="arrow-forward" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={[
          styles.defineButton,
          !habitTitle.trim() && styles.defineButtonDisabled
        ]}
        onPress={moveToIconSelection}
        disabled={!habitTitle.trim()}
      >
        <Text style={styles.defineButtonText}>{t('habits.defineYourHabit')}</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );

  const renderIconSelectionStep = () => (
    <View style={{ flex: 1 }}>
      <Text style={styles.chooseImageTitle}>{t('habits.chooseImage')}</Text>
      
      <FlatList
        data={habitIcons}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.iconOption,
              selectedIcon.id === item.id && styles.selectedIconOption
            ]}
            onPress={() => handleIconSelect(item)}
          >
            <Text style={styles.iconEmoji}>{item.emoji}</Text>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.id}
        numColumns={4}
        contentContainerStyle={styles.iconsGrid}
        columnWrapperStyle={{justifyContent: 'center'}}
      />
      
      <TouchableOpacity
        style={styles.saveButton}
        onPress={saveHabit}
        disabled={loading}
      >
        <Text style={styles.saveButtonText}>
          {loading ? t('common.loading') : t('habits.save')}
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#03174C" />
      
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => {
            if (habitStep === 2) {
              setHabitStep(1);
            } else {
              navigation.goBack();
            }
          }}
        >
          <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('habits.newHabit')}</Text>
      </View>
      
      {habitStep === 1 ? renderDescriptionStep() : renderIconSelectionStep()}
    </SafeAreaView>
  );
};

export default CreateHabit;