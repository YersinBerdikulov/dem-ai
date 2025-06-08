import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  SafeAreaView, 
  StatusBar, 
  Alert, 
  Dimensions, 
  Image,
  ScrollView, 
  Animated 
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import styles from '../../../../../styles/Games/matchingItemsLevels';
import { 
  getMatchingItemsProgress, 
  completeMatchingItemsLevel,
  resetMatchingItemsProgress,
  updateBestTimeAndMoves
} from '../../../../../config/getMatchingItemsProgress';
import { auth } from '../../../../../config/firebase';
import { useLanguage } from '../../../../context/LanguageContext';

const MatchingItemsLevels = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { t } = useLanguage();
  const { width } = Dimensions.get('window');
  const scrollViewRef = useRef(null);
  
  const [currentLevel, setCurrentLevel] = useState(route.params?.level || 1);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [isLevelCompleted, setIsLevelCompleted] = useState(false);
  const [cards, setCards] = useState([]);
  const [flippedIndices, setFlippedIndices] = useState([]);
  const [matchedPairs, setMatchedPairs] = useState([]);
  const [moves, setMoves] = useState(0);
  const [time, setTime] = useState(0);
  const [timeLimit, setTimeLimit] = useState(60);
  const [timerActive, setTimerActive] = useState(false);
  const [processingMatch, setProcessingMatch] = useState(false);
  const [bestTime, setBestTime] = useState(null);
  const [bestMoves, setBestMoves] = useState(null);
  const [gameOver, setGameOver] = useState(false);
  const timerRef = useRef(null);
  const timeLimitRef = useRef(null);
  
  // Time limits for each level (in seconds)
  const timeLimits = {
    1: 60,  // 1 minute
    2: 120, // 2 minutes
    3: 180, // 3 minutes
    4: 240, // 4 minutes
    5: 300, // 5 minutes
    6: 360, // 6 minutes
    7: 420, // 7 minutes
    8: 480, // 8 minutes
    9: 540, // 9 minutes
    10: 600 // 10 minutes
  };
  
  // Fruit/item images for the cards
  const itemImages = {
    apple: require('../../../../../assets/icons/apple.png'),
    banana: require('../../../../../assets/icons/banana.png'),
    strawberry: require('../../../../../assets/icons/strawberry.png'),
    orange: require('../../../../../assets/icons/orange.png'),
    kiwi: require('../../../../../assets/icons/kiwi.png'),
    watermelon: require('../../../../../assets/icons/watermelon.png'),
    pineapple: require('../../../../../assets/icons/pineapple.png'),
    carrot: require('../../../../../assets/icons/carrot.png'),
    potato: require('../../../../../assets/icons/potato.png'),
    cherry: require('../../../../../assets/icons/cherry.png')
  };

  // Level configurations - ensuring even number of cards
  const levelConfigs = {
    1: { rows: 2, cols: 2, items: ['apple', 'banana'] },
    2: { rows: 2, cols: 3, items: ['apple', 'banana', 'strawberry'] },
    3: { rows: 2, cols: 4, items: ['apple', 'banana', 'strawberry', 'orange'] },
    4: { rows: 4, cols: 4, items: ['apple', 'banana', 'strawberry', 'orange', 'kiwi', 'potato', 'pineapple', 'carrot'] },
    5: { rows: 4, cols: 5, items: ['apple', 'banana', 'strawberry', 'orange', 'kiwi', 'potato', 'pineapple', 'carrot', 'watermelon', 'cherry'] },
    6: { rows: 5, cols: 4, items: ['apple', 'banana', 'strawberry', 'orange', 'kiwi', 'potato', 'pineapple', 'carrot', 'watermelon', 'cherry'] },
    7: { rows: 5, cols: 6, items: ['apple', 'banana', 'strawberry', 'orange', 'kiwi', 'potato', 'pineapple', 'carrot', 'watermelon', 'cherry'] },
    8: { rows: 6, cols: 5, items: ['apple', 'banana', 'strawberry', 'orange', 'kiwi', 'potato', 'pineapple', 'carrot', 'watermelon', 'cherry'] },
    9: { rows: 6, cols: 6, items: ['apple', 'banana', 'strawberry', 'orange', 'kiwi', 'potato', 'pineapple', 'carrot', 'watermelon', 'cherry'] },
    10: { rows: 7, cols: 6, items: ['apple', 'banana', 'strawberry', 'orange', 'kiwi', 'potato', 'pineapple', 'carrot', 'watermelon', 'cherry'] }
  };

  // Load user progress when component mounts
  useEffect(() => {
    const loadUserProgress = async () => {
      try {
        const currentUser = auth.currentUser;
        if (currentUser) {
          const progress = await getMatchingItemsProgress(currentUser.uid);
          if (progress.bestTimes && progress.bestTimes[currentLevel]) {
            setBestTime(progress.bestTimes[currentLevel]);
          } else {
            setBestTime(null);
          }
          
          if (progress.bestMoves && progress.bestMoves[currentLevel]) {
            setBestMoves(progress.bestMoves[currentLevel]);
          } else {
            setBestMoves(null);
          }
        }
      } catch (error) {
        console.error('Error loading user progress:', error);
      }
    };
    
    loadUserProgress();
  }, [currentLevel]);

  // Initialize level
  useEffect(() => {
    if (currentLevel && levelConfigs[currentLevel]) {
      setTimeLimit(timeLimits[currentLevel] || 60);
      initializeLevel();
    }
  }, [currentLevel, route.params?.level]);

  // Initialize from route params
  useEffect(() => {
    if (route.params?.level && levelConfigs[route.params.level]) {
      setCurrentLevel(route.params.level);
    }
  }, [route.params?.level]);

  // Timer effect for elapsed time
  useEffect(() => {
    if (timerActive) {
      timerRef.current = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [timerActive]);

  // Time limit countdown effect
  useEffect(() => {
    if (timerActive && !gameCompleted && !gameOver) {
      timeLimitRef.current = setInterval(() => {
        setTimeLimit((prevLimit) => {
          if (prevLimit <= 1) {
            clearInterval(timeLimitRef.current);
            setTimerActive(false);
            setGameOver(true);
            
            Alert.alert(
              t('games.timeUp'), 
              t('games.timeUpMessage'),
              [
                { text: t('games.tryAgain'), onPress: () => resetLevel() },
                { text: t('games.goBack'), onPress: () => navigation.goBack() }
              ]
            );
            return 0;
          }
          return prevLimit - 1;
        });
      }, 1000);
    } else if (timeLimitRef.current) {
      clearInterval(timeLimitRef.current);
    }

    return () => {
      if (timeLimitRef.current) {
        clearInterval(timeLimitRef.current);
      }
    };
  }, [timerActive, gameCompleted, gameOver]);

  // Check if game is completed
  useEffect(() => {
    if (cards.length > 0 && matchedPairs.length === cards.length / 2) {
      setGameCompleted(true);
      setTimerActive(false);
      saveProgress();
    }
  }, [matchedPairs, cards]);

  // Save progress to Firebase when level is completed
  const saveProgress = async () => {
    if (!isLevelCompleted) {
      try {
        setIsLevelCompleted(true);
        const currentUser = auth.currentUser;
        if (currentUser) {
          await completeMatchingItemsLevel(currentUser.uid, currentLevel, time, moves);
          
          if (!bestTime || time < bestTime) {
            setBestTime(time);
          }
          
          if (!bestMoves || moves < bestMoves) {
            setBestMoves(moves);
          }
          
          console.log(`Level ${currentLevel} progress saved to Firebase`);
        } else {
          console.warn("No user logged in, progress not saved");
        }
      } catch (error) {
        console.error('Error saving level progress:', error);
      }
    }
  };

  // Initialize the level
  const initializeLevel = () => {
    setGameCompleted(false);
    setIsLevelCompleted(false);
    setFlippedIndices([]);
    setMatchedPairs([]);
    setMoves(0);
    setTime(0);
    setTimerActive(false);
    setProcessingMatch(false);
    setGameOver(false);
    
    setTimeLimit(timeLimits[currentLevel] || 60);
    
    const config = levelConfigs[currentLevel];
    const totalCards = config.rows * config.cols;
    
    if (totalCards % 2 !== 0) {
      console.warn(`Level ${currentLevel} has an odd number of cards (${totalCards}). This may cause issues.`);
    }
    
    const uniquePairs = Math.floor(totalCards / 2);
    const selectedItems = [...config.items].slice(0, uniquePairs);
    
    let cardPairs = [];
    selectedItems.forEach(item => {
      cardPairs.push({ id: `${item}-1`, item });
      cardPairs.push({ id: `${item}-2`, item });
    });
    
    cardPairs = shuffleArray(cardPairs);
    setCards(cardPairs);
  };

  // Shuffle array using Fisher-Yates algorithm
  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  // Handle card flip
  const handleCardPress = (index) => {
    if (
      gameOver ||
      processingMatch || 
      flippedIndices.includes(index) || 
      matchedPairs.some(pair => pair.includes(index))
    ) {
      return;
    }

    if (!timerActive && flippedIndices.length === 0 && matchedPairs.length === 0) {
      setTimerActive(true);
    }

    if (flippedIndices.length < 2) {
      setFlippedIndices(prev => [...prev, index]);
      
      if (flippedIndices.length === 1) {
        setMoves(prev => prev + 1);
        
        const firstCardIndex = flippedIndices[0];
        const secondCardIndex = index;
        
        if (cards[firstCardIndex].item === cards[secondCardIndex].item) {
          setMatchedPairs(prev => [...prev, [firstCardIndex, secondCardIndex]]);
          setFlippedIndices([]);
        } else {
          setProcessingMatch(true);
          setTimeout(() => {
            setFlippedIndices([]);
            setProcessingMatch(false);
          }, 1000);
        }
      }
    }
  };

  // Reset current level
  const resetLevel = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    if (timeLimitRef.current) {
      clearInterval(timeLimitRef.current);
      timeLimitRef.current = null;
    }
    
    initializeLevel();
  };

  // Function to go to the next level
  const goToNextLevel = () => {
    if (currentLevel < Object.keys(levelConfigs).length) {
      setCurrentLevel(prev => prev + 1);
    } else {
      Alert.alert(
        t('games.gameCompleted'), 
        t('games.gameCompletedMessage'),
        [{ text: t('common.ok'), onPress: () => navigation.goBack() }]
      );
    }
  };

  // Format time to MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Render card grid
  const renderCardGrid = () => {
    if (!cards.length) return null;
    
    const config = levelConfigs[currentLevel];
    const cardSize = calculateCardSize(config.rows, config.cols);
    
    const rows = Array(config.rows).fill().map((_, rowIndex) => {
      const rowCards = Array(config.cols).fill().map((_, colIndex) => {
        const index = rowIndex * config.cols + colIndex;
        
        if (index >= cards.length) return null;
        
        const card = cards[index];
        const isFlipped = flippedIndices.includes(index);
        const isMatched = matchedPairs.some(pair => pair.includes(index));
        
        return (
          <TouchableOpacity
            key={`card-${index}`}
            style={[
              styles.card,
              { width: cardSize, height: cardSize },
              (isFlipped || isMatched) && styles.cardFlipped
            ]}
            onPress={() => handleCardPress(index)}
            disabled={isFlipped || isMatched || gameOver}
          >
            {(isFlipped || isMatched) ? (
              <Image
                source={itemImages[card.item]}
                style={styles.cardImage}
                resizeMode="contain"
              />
            ) : (
              <View style={styles.cardBack}>
                <Text style={styles.cardBackText}>?</Text>
              </View>
            )}
          </TouchableOpacity>
        );
      });
      
      return (
        <View key={`row-${rowIndex}`} style={styles.cardRow}>
          {rowCards}
        </View>
      );
    });
    
    return <View style={styles.cardGrid}>{rows}</View>;
  };

  // Calculate appropriate card size based on grid dimensions and screen width
  const calculateCardSize = (rows, cols) => {
    const padding = 32;
    const gap = 8;
    const availableWidth = width - padding;
    
    let cardSize = (availableWidth - (cols - 1) * gap) / cols;
    const maxCardSize = 80;
    return Math.min(cardSize, maxCardSize);
  };

  // Render time information
  const renderTimeInfo = () => {
    return (
      <View style={styles.timeInfoContainer}>
        <View style={styles.timeItem}>
          <Text style={styles.timeLabel}>{t('games.time')}</Text>
          <Text style={styles.timeValue}>{formatTime(time)}</Text>
        </View>
        
        <View style={styles.timeItem}>
          <Text style={styles.timeLabel}>{t('games.timeLimit')}</Text>
          <Text style={[
            styles.timeValue, 
            timeLimit < 30 && !gameCompleted ? styles.timeWarning : null,
            gameCompleted ? styles.timeSuccess : null
          ]}>
            {formatTime(timeLimit)}
          </Text>
        </View>
      </View>
    );
  };

  // Render score information
  const renderScoreInfo = () => {
    return (
      <View style={styles.scoreContainer}>
        <View style={styles.scoreItem}>
          <Text style={styles.scoreLabel}>{t('games.moves')}</Text>
          <Text style={styles.scoreValue}>{moves}</Text>
          {bestMoves && (
            <Text style={styles.scoreLabel}>{t('games.best')}: {bestMoves}</Text>
          )}
        </View>
        
        <View style={styles.scoreItem}>
          <Text style={styles.scoreLabel}>{t('games.pairs')}</Text>
          <Text style={styles.scoreValue}>{matchedPairs.length}/{cards.length/2}</Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#03174C" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.levelTitle}>{t('games.level')} {currentLevel}</Text>
        <TouchableOpacity 
          style={styles.helpButton} 
          onPress={() => Alert.alert(t('games.howToPlay'), t('games.howToPlayMessage'))}
        >
          <Ionicons name="help-circle" size={28} color="#fff" />
        </TouchableOpacity>
      </View>
      
      {/* Time Information */}
      {renderTimeInfo()}
      
      {/* Score Information */}
      {renderScoreInfo()}
      
      <ScrollView 
        ref={scrollViewRef}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Card Grid */}
        {renderCardGrid()}
      </ScrollView>
      
      {/* Control Buttons */}
      <View style={styles.controlsContainer}>
        <TouchableOpacity style={styles.controlButton} onPress={resetLevel}>
          <Ionicons name="refresh" size={24} color="#fff" />
          <Text style={styles.controlButtonText}>{t('games.reset')}</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[
            styles.nextButton,
            gameCompleted ? styles.nextButtonEnabled : styles.nextButtonDisabled
          ]} 
          onPress={goToNextLevel}
          disabled={!gameCompleted}
        >
          <Text style={styles.nextButtonText}>{t('games.nextLevel')}</Text>
          <Ionicons name="arrow-forward" size={22} color="#fff" style={styles.nextButtonIcon} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default MatchingItemsLevels;