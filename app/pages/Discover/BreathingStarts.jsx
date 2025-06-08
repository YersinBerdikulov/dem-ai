// BreathingStarts.js - Updated with multi-language support
import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { breathingStyles as styles } from '../../../styles/discover/breathingStyles';
import { useLanguage } from '../../context/LanguageContext';

const BreathingStarts = ({ navigation, route }) => {
  const { t } = useLanguage(); // Add language hook
  
  const [technique, setTechnique] = useState(t('breathing.defaultTechnique') || '4-7-8 breathing');
  const [selectedDuration, setSelectedDuration] = useState(5); // in minutes

  // Get the source parameter to determine where we came from
  const source = route?.params?.source;

  const getTimeOptions = () => [
    { label: t('breathing.timeOptions.3min') || '3 minutes', value: 3 },
    { label: t('breathing.timeOptions.5min') || '5 minutes', value: 5 },
    { label: t('breathing.timeOptions.10min') || '10 minutes', value: 10 },
  ];

  const timeOptions = getTimeOptions();

  const handleStartExercise = () => {
    navigation.navigate('BreathingExercise', {
      duration: selectedDuration * 60, // Convert to seconds
      source: source // Pass the source forward
    });
  };

  const handleGoBack = () => {
    // Check where we came from and navigate accordingly
    if (source === 'Home') {
      // Navigate back to the Home tab specifically
      navigation.reset({
        index: 0,
        routes: [{ name: 'Home' }],
      });
    } else if (source === 'Discovery') {
      // Navigate back to the Discovery tab specifically
      navigation.reset({
        index: 0,
        routes: [{ name: 'Discover' }],
      });
    } else {
      // Default behavior - go back to previous screen
      navigation.goBack();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={handleGoBack}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.title}>{t('breathing.title')}</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.iconContainer}>
          <View style={[styles.circle, styles.outerCircle]} />
          <View style={[styles.circle, styles.middleCircle]} />
          <View style={[styles.circle, styles.innerCircle]} />
          <Image
            source={require('../../../assets/images/noseinhale.png')}
            style={styles.breathingIcon}
            resizeMode="contain"
          />
        </View>

        <Text style={styles.sectionTitle}>{t('breathing.technique')}</Text>
        <TextInput
          style={styles.input}
          value={technique}
          onChangeText={setTechnique}
          placeholder={t('breathing.techniquePlaceholder') || 'Select breathing technique'}
          placeholderTextColor="rgba(255, 255, 255, 0.5)"
        />

        <Text style={styles.sectionTitle}>{t('breathing.sessionLength')}</Text>
        <View style={styles.timeOptionsContainer}>
          {timeOptions.map((option) => (
            <TouchableOpacity
              key={option.value}
              style={[
                styles.timeOption,
                selectedDuration === option.value && styles.selectedTimeOption
              ]}
              onPress={() => setSelectedDuration(option.value)}
            >
              <Text
                style={[
                  styles.timeOptionText,
                  selectedDuration === option.value && styles.selectedTimeOptionText
                ]}
              >
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          style={styles.startButton}
          onPress={handleStartExercise}
        >
          <Text style={styles.buttonText}>{t('breathing.startExercise')}</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default BreathingStarts;