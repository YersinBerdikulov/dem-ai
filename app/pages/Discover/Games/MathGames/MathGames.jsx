import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, SafeAreaView, StatusBar, FlatList, ScrollView, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { getMathGameProgress } from '../../../../../config/getMathGameProgress';
import { auth } from '../../../../../config/firebase';
import styles from '../../../../../styles/Games/mathGame';
import { useLanguage } from '../../../../context/LanguageContext';

const MathGames = () => {
  const navigation = useNavigation();
  const { t } = useLanguage();
  const totalLevels = 10;
  const [unlockedLevels, setUnlockedLevels] = useState(4);
  const [completedLevels, setCompletedLevels] = useState([1, 2, 3]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserProgress = async () => {
      try {
        setIsLoading(true);
        const currentUser = auth.currentUser;
        
        if (currentUser) {
          const progress = await getMathGameProgress(currentUser.uid);
          setUnlockedLevels(progress.unlockedLevel || 4);
          setCompletedLevels(progress.completedLevels || [1, 2, 3]);
        }
      } catch (error) {
        console.error('Error fetching game progress:', error);
        Alert.alert(t('common.error'), t('games.failedToLoadProgress'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProgress();
  }, []);

  const levelData = Array.from({ length: totalLevels }, (_, i) => {
    const levelNumber = i + 1;
    let status = 'locked';
    
    if (completedLevels.includes(levelNumber)) {
      status = 'completed';
    } else if (levelNumber === unlockedLevels) {
      status = 'current';
    } else if (levelNumber < unlockedLevels) {
      status = 'unlocked';
    }
    
    return {
      id: levelNumber.toString(),
      number: levelNumber,
      status: status
    };
  });

  const renderLevelItem = ({ item }) => {
    const { number, status } = item;
    
    return (
      <View style={styles.levelItemContainer}>
        <TouchableOpacity 
          style={[
            styles.levelButton, 
            status === 'completed' && styles.completedLevelButton,
            status === 'current' && styles.currentLevelButton,
            status === 'unlocked' && styles.unlockedLevelButton,
            status === 'locked' && styles.lockedLevelButton
          ]} 
          disabled={status === 'locked'}
          onPress={() => navigateToGameLevel(number)}
        >
          {status === 'completed' && (
            <Ionicons name="checkmark" size={22} color="#FFFFFF" />
          )}
          {status === 'current' && (
            <Ionicons name="play" size={22} color="#FFFFFF" />
          )}
          {(status === 'unlocked') && (
            <Text style={styles.levelButtonText}>{number}</Text>
          )}
          {status === 'locked' && (
            <Ionicons name="lock-closed" size={18} color="#FFFFFF" />
          )}
        </TouchableOpacity>
        <Text style={styles.levelNumber}>{number}</Text>
      </View>
    );
  };

  const navigateToGameLevel = (levelNumber) => {
    navigation.navigate('MathGameLevels', { level: levelNumber });
  };

  const startGame = () => {
    const startLevel = levelData.find(item => item.status === 'current')?.number || unlockedLevels;
    navigateToGameLevel(startLevel);
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>{t('games.loadingProgress')}</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#03174C" />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuButton}>
          <Ionicons name="ellipsis-vertical" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.logoContainer}>
          <Image 
            source={require('../../../../../assets/images/math-logo.png')} 
            style={styles.gameLogo}
            resizeMode="contain"
          />
          <Text style={styles.gameTitle}>{t('games.mathGames')}</Text>
        </View>

        <View style={styles.levelSection}>
          <Text style={styles.levelLabel}>{t('games.level')}</Text>
          <FlatList
            data={levelData}
            renderItem={renderLevelItem}
            keyExtractor={item => item.id}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.levelList}
          />
        </View>

        <View style={styles.goalContainer}>
          <Text style={styles.goalText}>{t('games.reachLevel10')}</Text>
        </View>

        <View style={styles.benefitsSection}>
          <Text style={styles.benefitsTitle}>{t('games.benefits')}</Text>
          
          <View style={styles.benefitsContainer}>
            <View style={styles.benefitItem}>
              <View style={styles.benefitIconContainer}>
                <Ionicons name="bulb-outline" size={28} color="#fff" />
              </View>
              <Text style={styles.benefitText}>{t('games.creativity')}</Text>
            </View>
            
            <View style={styles.benefitItem}>
              <View style={styles.benefitIconContainer}>
                <Ionicons name="hammer-outline" size={28} color="#fff" />
              </View>
              <Text style={styles.benefitText}>{t('games.decisionMaking')}</Text>
            </View>
            
            <View style={styles.benefitItem}>
              <View style={styles.benefitIconContainer}>
                <Ionicons name="construct-outline" size={28} color="#fff" />
              </View>
              <Text style={styles.benefitText}>{t('games.problemSolving')}</Text>
            </View>
          </View>
        </View>

        <TouchableOpacity style={styles.startButton} onPress={startGame}>
          <Text style={styles.startButtonText}>{t('games.start')}</Text>
          <Ionicons name="play" size={20} color="#fff" style={styles.startButtonIcon} />
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default MathGames;