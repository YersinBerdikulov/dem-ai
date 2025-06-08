import React from 'react';
import { View, Image, Text, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { avatarStyles as styles } from '../../../../styles/discover/Habits/avatarStyles';
import { useLanguage } from '../../../context/LanguageContext';

const CharacterAvatar = ({ level, completionRate }) => {
  const { t } = useLanguage();

  // Get emoji character based on level
  const getAvatarEmoji = () => {
    if (level >= 20) return "🧙‍♂️"; // Wizard (legendary)
    if (level >= 15) return "🦸‍♂️"; // Superhero (champion)
    if (level >= 10) return "🧠"; // Brain (master)
    if (level >= 5) return "🚀"; // Rocket (builder)
    return "🌱"; // Seedling (beginner)
  };
  
  // Get emoji mood based on completion rate
  const getMoodEmoji = () => {
    if (completionRate >= 0.7) return "😄"; // Happy
    if (completionRate >= 0.4) return "🙂"; // Neutral
    return "😕"; // Sad
  };
  
  // Get character title based on level
  const getCharacterTitle = () => {
    if (level >= 20) return t('habits.characterTitles.legend');
    if (level >= 15) return t('habits.characterTitles.champion');
    if (level >= 10) return t('habits.characterTitles.master');
    if (level >= 5) return t('habits.characterTitles.builder');
    return t('habits.characterTitles.beginner');
  };
  
  // Get motivational message based on completion rate
  const getMotivationalMessage = () => {
    if (completionRate >= 0.7) {
      return t('habits.motivationalMessages.great');
    } else if (completionRate >= 0.4) {
      return t('habits.motivationalMessages.progress');
    } else {
      return t('habits.motivationalMessages.encourage');
    }
  };

  // Calculate completion percentage for display
  const completionPercentage = Math.round(completionRate * 100);
  
  // Choose which emoji to display (level or mood)
  const emojiToShow = completionRate > 0 ? getMoodEmoji() : getAvatarEmoji();

  return (
    <View style={styles.container}>
      <View style={styles.glowEffect} />
      <View style={styles.avatarContainer}>
        <Text style={{ fontSize: 50 }}>{emojiToShow}</Text>
        <View style={styles.levelBadge}>
          <Text style={styles.levelText}>{level}</Text>
        </View>
      </View>
      <Text style={styles.title}>{getCharacterTitle()}</Text>
      <Text style={styles.message}>{getMotivationalMessage()}</Text>
      
      <View style={styles.statsContainer}>
        <View style={styles.statColumn}>
          <Text style={styles.statValue}>{completionPercentage}%</Text>
          <Text style={styles.statLabel}>{t('habits.completion')}</Text>
        </View>
        <View style={styles.statColumn}>
          <Text style={styles.statValue}>{level}</Text>
          <Text style={styles.statLabel}>{t('habits.level')}</Text>
        </View>
        <View style={styles.statColumn}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Ionicons name="star" size={16} color="#FFD700" />
            <Text style={styles.statValue}> {Math.ceil(level/5)}</Text>
          </View>
          <Text style={styles.statLabel}>{t('habits.rank')}</Text>
        </View>
      </View>
    </View>
  );
};

export default CharacterAvatar;