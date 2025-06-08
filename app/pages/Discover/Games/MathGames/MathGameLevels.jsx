import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  SafeAreaView, 
  StatusBar, 
  Alert, 
  Dimensions, 
  ScrollView, 
  Animated 
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import styles from '../../../../../styles/Games/mathLevels';
import { useLanguage } from '../../../../context/LanguageContext';

// Firebase might not be fully set up yet, so add fallback functions
const defaultGetMathGameProgress = async () => {
  return {
    unlockedLevel: 1,
    completedLevels: [],
    lastPlayed: null,
    bestMoves: {}
  };
};

const defaultCompleteMathGameLevel = async () => {
  console.log('Level completed (using default function)');
  return {
    unlockedLevel: 2,
    completedLevels: [1],
    lastPlayed: new Date(),
    bestMoves: {}
  };
};

// Try to import from config, but use defaults if not available
let getMathGameProgress, completeMathGameLevel;
try {
  const progressModule = require('../../../../../config/getMathGameProgress');
  getMathGameProgress = progressModule.getMathGameProgress || defaultGetMathGameProgress;
  completeMathGameLevel = progressModule.completeMathGameLevel || defaultCompleteMathGameLevel;
} catch (error) {
  console.warn('Failed to import game progress functions, using defaults', error);
  getMathGameProgress = defaultGetMathGameProgress;
  completeMathGameLevel = defaultCompleteMathGameLevel;
}

// Try to import auth, or create a mock if not available
let auth;
try {
  auth = require('../../../../../config/firebase').auth;
} catch (error) {
  console.warn('Failed to import firebase auth, using mock', error);
  auth = {
    currentUser: { uid: 'test-user-id' }
  };
}

const MathGameLevels = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { t } = useLanguage();
  const { width } = Dimensions.get('window');
  const scrollViewRef = useRef(null);
  
  const [currentLevel, setCurrentLevel] = useState(route.params?.level || 1);   
  const [gameCompleted, setGameCompleted] = useState(false);
  const [isLevelCompleted, setIsLevelCompleted] = useState(false);
  const [selectedNumbers, setSelectedNumbers] = useState([]);
  const [boardState, setBoardState] = useState([]);
  const [availableNumbers, setAvailableNumbers] = useState([]);
  const [selectedCell, setSelectedCell] = useState(null);
  const [moveCount, setMoveCount] = useState(0);
  const [shakeAnim] = useState(new Animated.Value(0));
  const [moveHistory, setMoveHistory] = useState([]);

  // Level configurations with progressively more challenging multi-equation problems
  const levels = {
    1: {
      grid: [
        ['7', '+', '?', '=', '15'],
        ['', '', '', '', ''],
        ['3', '×', '4', '=', '12']
      ],
      numbers: [2, 4, 6, 8, 10, 12, 15, 18],
      solution: {
        '0-2': '8' // 7 + 8 = 15 (horizontal equation)
      }
    },
    2: {
      grid: [
        ['24', '÷', '?', '=', '6'],
        ['', '', '', '', ''],
        ['16', '+', '?', '=', '19']
      ],
      numbers: [2, 3, 4, 5, 6, 8, 10, 15],
      solution: {
        '0-2': '4', // 24 ÷ 4 = 6 (top row)
        '2-2': '3'  // 16 + 3 = 19 (bottom row)
      }
    },
    3: {
      grid: [
        ['?', '+', '12', '=', '27'],
        ['', '', '', '', ''],
        ['7', '×', '?', '=', '35']
      ],
      numbers: [5, 9, 15, 18, 21, 24, 32, 45],
      solution: {
        '0-0': '15', // 15 + 12 = 27 (top row)
        '2-2': '5'   // 7 × 5 = 35 (bottom row)
                     // Also 15 + 7 = 22 (left column)
      }
    },
    4: {
      grid: [
        ['?', '×', '9', '=', '72'],
        ['+', '', '+', '', '+'],
        ['14', '+', '?', '=', '23'],
        ['=', '', '=', '', '='],
        ['22', '', '18', '', '95']
      ],
      numbers: [8, 9, 11, 15, 17, 22, 28, 35],
      solution: {
        '0-0': '8',  // 8 × 9 = 72 (top row)
        '2-2': '9'   // 14 + 9 = 23 (middle row)
                     // Also 8 + 14 = 22 (left column)
                     // And 9 + 9 = 18 (middle column)
      }
    },
    5: {
      grid: [
        ['36', '÷', '?', '=', '4'],
        ['×', '', '+', '', '+'],
        ['5', '×', '?', '=', '50'],
        ['=', '', '=', '', '='],
        ['180', '', '90', '', '54']
      ],
      numbers: [5, 9, 10, 11, 15, 17, 21, 36],
      solution: {
        '0-2': '9',  // 36 ÷ 9 = 4 (top row)
        '2-2': '10'   // 5 × 10 = 50 (middle row)
                     // Also 36 × 5 = 180 (left column)
                     // And 9 + 10 = 19 (middle column)
      }
    },
    6: {
      grid: [
        ['?', '+', '?', '=', '80'],
        ['-', '', '+', '', '+'],
        ['32', '×', '2', '=', '64'],
        ['=', '', '=', '', '='],
        ['13', '', '37', '', '144']
      ],
      numbers: [13, 16, 19, 29, 35, 37, 45, 47],
      solution: {
        '0-0': '45',  // 45 + 35 = 80 (top row)
        '0-2': '35',  // Also contributes to top row
                      // And 45 - 32 = 13 (left column)
                      // And 35 + 2 = 37 (middle column)
      }
    },
    7: {
      grid: [
        ['125', '÷', '?', '=', '25'],
        ['-', '', '×', '', '+'],
        ['?', '×', '15', '=', '75'],
        ['=', '', '=', '', '='],
        ['119', '', '80', '', '115']
      ],
      numbers: [5, 6, 9, 15, 18, 25, 45, 75],
      solution: {
        '0-2': '5',   // 125 ÷ 5 = 25 (top row)
        '2-0': '5'    // 5 × 15 = 75 (middle row)
                      // Also 125 - 5 = 120 (left column)
                      // And 5 × 15 = 75 (middle column)
      }
    },
    8: {
      grid: [
        ['?', '×', '?', '=', '156'],
        ['+', '', '+', '', '+'],
        ['17', '+', '12', '=', '29'],
        ['=', '', '=', '', '='],
        ['29', '', '25', '', '185']
      ],
      numbers: [12, 13, 17, 22, 25, 29, 36, 45],
      solution: {
        '0-0': '12',  // 12 × 13 = 156 (top row)
        '0-2': '13',  // Part of top row
                      // Also 13 + 12 = 25 (middle column)
                      // And 12 + 17 = 29 (left column)
      }
    },
    9: {
      grid: [
        ['49', '÷', '?', '=', '7'],
        ['×', '', '×', '', ''],
        ['?', '×', '8', '=', '64'],
        ['=', '', '=', '', ''],
        ['392', '', '56', '', '28']
      ],
      numbers: [7, 8, 11, 14, 17, 21, 25, 32],
      solution: {
        '0-2': '7',   // 49 ÷ 7 = 7 (top row)
        '2-0': '8'    // 8 × 8 = 64 (middle row)
                      // Also 49 × 8 = 392 (left column)
                      // And 7 × 8 = 56 (middle column)
      }
    },
    10: {
      grid: [
        ['?', '×', '?', '-', '?', '=', '20'],
        ['×', '', '×', '', '+', '', '+'],
        ['25', '+', '15', '×', '2', '=', '55'],
        ['=', '', '=', '', '=', '', '='],
        ['200', '', '75', '', '22', '', '75']
      ],
      numbers: [8, 5, 15, 20, 22, 25, 38, 44],
      solution: {
        '0-0': '8',  // 8 × 5 - 20 = 40 - 20 = 20 (top row)
        '0-2': '5',   // Part of top row
        '0-4': '20'   // Part of top row
                      // Also 8 × 25 = 200 (left column)
                      // And 5 × 15 = 75 (middle column)
      }
    }
  };
  
  // Get current level data safely
  const currentLevelData = currentLevel && levels[currentLevel] ? 
    levels[currentLevel] : levels[1];

  // Initialize level
  useEffect(() => {
    if (currentLevelData) {
      initializeLevel();
    }
  }, [currentLevel, route.params?.level]);

  // Initialize from route params
  useEffect(() => {
    if (route.params?.level && levels[route.params.level]) {
      setCurrentLevel(route.params.level);
    }
  }, [route.params?.level]);
  
  // Save progress to Firebase when level is completed
  useEffect(() => {
    const saveProgress = async () => {
      if (gameCompleted && !isLevelCompleted) {
        try {
          setIsLevelCompleted(true);
          const currentUser = auth.currentUser;
          if (currentUser) {
            await completeMathGameLevel(currentUser.uid, currentLevel);
            console.log(`Level ${currentLevel} progress saved to Firebase`);
          } else {
            console.warn("No user logged in, progress not saved");
          }
        } catch (error) {
          console.error('Error saving level progress:', error);
          // Don't show an alert to the user - just log the error
        }
      }
    };

    saveProgress();
  }, [gameCompleted, currentLevel, isLevelCompleted]);

  // Initialize the level
  const initializeLevel = () => {
    setGameCompleted(false);
    setIsLevelCompleted(false);
    setSelectedNumbers([]);
    setBoardState(JSON.parse(JSON.stringify(currentLevelData.grid)));
    setAvailableNumbers([...currentLevelData.numbers]);
    setSelectedCell(null);
    setMoveCount(0);
    setMoveHistory([]);
  };

  // Handle cell selection
  const handleCellPress = (rowIndex, colIndex) => {
    const cellValue = boardState[rowIndex][colIndex];
    
    // Only allow selection of empty cells or '?' cells
    if (cellValue === '' || cellValue === '?') {
      setSelectedCell({ row: rowIndex, col: colIndex });
    }
  };

  // Handle number selection
  const handleNumberSelect = (number) => {
    if (!selectedCell) {
      Alert.alert(t('games.selectCell'), t('games.selectCellMessage'));
      return;
    }

    // Check if this number has already been used
    if (selectedNumbers.includes(number)) {
      // Shake animation for invalid move
      Animated.sequence([
        Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: -10, duration: 50, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: 0, duration: 50, useNativeDriver: true })
      ]).start();
      
      return;
    }

    // Save current state to history for undo
    const currentState = {
      boardState: JSON.parse(JSON.stringify(boardState)),
      selectedNumbers: [...selectedNumbers],
      selectedCell: {...selectedCell}
    };
    setMoveHistory([...moveHistory, currentState]);

    // Update board state
    const newBoardState = [...boardState];
    newBoardState[selectedCell.row][selectedCell.col] = number.toString();
    setBoardState(newBoardState);
    
    // Add to selected numbers
    setSelectedNumbers([...selectedNumbers, number]);
    
    // Increment move count
    setMoveCount(moveCount + 1);
    
    // Check if the puzzle is solved
    checkSolution(newBoardState);
    
    // Clear selection
    setSelectedCell(null);
  };

  // Undo the last move
  const undoLastMove = () => {
    if (moveHistory.length === 0) return;
    
    const lastState = moveHistory[moveHistory.length - 1];
    setBoardState(lastState.boardState);
    setSelectedNumbers(lastState.selectedNumbers);
    setSelectedCell(null);
    
    // Remove the last state from history
    setMoveHistory(moveHistory.slice(0, -1));
    
    // Decrement move count
    if (moveCount > 0) {
      setMoveCount(moveCount - 1);
    }
  };

  // Check if the solution is correct
  const checkSolution = (currentBoard) => {
    const solution = currentLevelData.solution;
    let isSolved = true;
    
    // Check if all required cells have correct values
    for (const [position, value] of Object.entries(solution)) {
      const [row, col] = position.split('-').map(Number);
      if (currentBoard[row][col] !== value) {
        isSolved = false;
        break;
      }
    }
    
    if (isSolved) {
      setGameCompleted(true);
      setTimeout(() => {
        Alert.alert(t('games.levelCompleted'), t('games.levelCompletedMessage'));
      }, 500);
    }
  };

  // Remove a number from the board
  const removeNumber = (rowIndex, colIndex) => {
    const cellValue = boardState[rowIndex][colIndex];
    
    // Only allow removal of numbers that were placed (not part of the initial puzzle)
    if (!isNaN(cellValue) && cellValue !== '' && cellValue !== '?') {
      // Check if this was one of the numbers we placed
      const numberValue = parseInt(cellValue, 10);
      if (selectedNumbers.includes(numberValue)) {
        // Save current state to history for undo
        const currentState = {
          boardState: JSON.parse(JSON.stringify(boardState)),
          selectedNumbers: [...selectedNumbers],
          selectedCell: null
        };
        setMoveHistory([...moveHistory, currentState]);
        
        // Update board state - replace with '?' if it was a '?' in the original puzzle
        const originalValue = currentLevelData.grid[rowIndex][colIndex];
        const newBoardState = [...boardState];
        newBoardState[rowIndex][colIndex] = originalValue;
        setBoardState(newBoardState);
        
        // Remove from selected numbers
        setSelectedNumbers(selectedNumbers.filter(num => num !== numberValue));
      }
    }
  };

  // Reset current level
  const resetLevel = () => {
    initializeLevel();
  };

  // Function to move to the next level
  const goToNextLevel = () => {
    if (currentLevel < Object.keys(levels).length) {
      setCurrentLevel(prev => prev + 1);
    } else {
      // All levels completed
      Alert.alert(
        t('games.gameCompleted'), 
        t('games.gameCompletedMessage'),
        [{ text: t('common.ok'), onPress: () => navigation.goBack() }]
      );
    }
  };

  // Render the game board
  const renderBoard = () => {
    if (!boardState || !boardState.length) return null;
    
    return (
      <View style={styles.boardContainer}>
        {boardState.map((row, rowIndex) => (
          <View key={`row-${rowIndex}`} style={styles.boardRow}>
            {row.map((cell, colIndex) => {
              // Determine if cell is selected
              const isSelected = selectedCell && 
                selectedCell.row === rowIndex && 
                selectedCell.col === colIndex;
              
              // Determine if cell is part of the initial puzzle or was placed
              const isInitial = cell !== '' && cell !== '?' && 
                currentLevelData.grid[rowIndex][colIndex] === cell;
              
              // Determine style for operators and numbers
              const isOperator = ['+', '-', '×', '÷', '='].includes(cell);
              
              return (
                <TouchableOpacity
                  key={`cell-${rowIndex}-${colIndex}`}
                  style={[
                    styles.cell,
                    isSelected && styles.selectedCell,
                    isInitial && styles.initialCell,
                    isOperator && styles.operatorCell,
                    cell === '?' && styles.questionCell,
                  ]}
                  onPress={() => handleCellPress(rowIndex, colIndex)}
                  onLongPress={() => removeNumber(rowIndex, colIndex)}
                  disabled={isInitial && cell !== '?'}
                >
                  <Text style={[
                    styles.cellText,
                    isOperator && styles.operatorText,
                    cell === '?' && styles.questionText,
                  ]}>
                    {cell}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        ))}
      </View>
    );
  };

  // Render the available numbers
  const renderAvailableNumbers = () => {
    return (
      <Animated.View 
        style={[
          styles.numberPad,
          { transform: [{ translateX: shakeAnim }] }
        ]}
      >
        {availableNumbers.map((number, index) => (
          <TouchableOpacity
            key={`number-${index}`}
            style={[
              styles.numberButton,
              selectedNumbers.includes(number) && styles.disabledNumberButton
            ]}
            onPress={() => handleNumberSelect(number)}
            disabled={selectedNumbers.includes(number)}
          >
            <Text style={styles.numberButtonText}>{number}</Text>
          </TouchableOpacity>
        ))}
      </Animated.View>
    );
  };

  // Render hint text for each level
  const renderHint = () => {
    const hints = {
      1: t('games.mathHint1') || "Fill in the value that makes 7 + ? = 15 correct.",
      2: t('games.mathHint2') || "Solve both horizontal equations on the top and bottom rows.",
      3: t('games.mathHint3') || "Find values that make both horizontal equations work.",
      4: t('games.mathHint4') || "Fill in the missing numbers to make the equations work both horizontally and vertically.",
      5: t('games.mathHint5') || "Complete the puzzle by finding values that satisfy multiple equations at once.",
      6: t('games.mathHint6') || "Challenge: Some of the equations might be misleading!",
      7: t('games.mathHint7') || "Advanced level: Solve for values that work in multiple rows and columns.",
      8: t('games.mathHint8') || "This puzzle requires finding numbers that satisfy both rows and columns.",
      9: t('games.mathHint9') || "Master level: Many equations must be satisfied simultaneously.",
      10: t('games.mathHint10') || "Expert level: This is the hardest challenge with potential red herrings!"
    };

    return (
      <Text style={styles.hintText}>
        {t('games.hint')}: {hints[currentLevel] || t('games.mathHintDefault')}
      </Text>
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
        <View style={styles.actionButtons || { flexDirection: 'row' }}>
          <TouchableOpacity 
            onPress={undoLastMove} 
            style={[styles.actionButton || { padding: 8 }, { opacity: moveHistory.length > 0 ? 1 : 0.5 }]}
            disabled={moveHistory.length === 0}
          >
            <Ionicons name="arrow-undo" size={24} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={resetLevel} 
            style={styles.actionButton || { padding: 8 }}
          >
            <Ionicons name="refresh" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView 
        ref={scrollViewRef}
        contentContainerStyle={styles.content || { alignItems: 'center', paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Game Board */}
        {renderBoard()}
        
        {/* Hint Text */}
        {renderHint()}
        
        {/* Available Numbers */}
        {renderAvailableNumbers()}
        
        {/* Instructions */}
        <Text style={styles.instructionText || { color: '#FFFFFF', textAlign: 'center', marginTop: 24, marginBottom: 16 }}>
          {t('games.mathInstructionsDetailed')}
        </Text>
      </ScrollView>
      
      {/* Next Level Button */}
      <View style={styles.buttonContainer || { position: 'absolute', bottom: 24, left: 0, right: 0, alignItems: 'center' }}>
        <TouchableOpacity 
          style={[
            styles.nextButton || { flexDirection: 'row', paddingVertical: 16, paddingHorizontal: 40, borderRadius: 30, justifyContent: 'center', alignItems: 'center', width: width * 0.7 },
            gameCompleted ? (styles.nextButtonEnabled || { backgroundColor: '#4CAF50' }) : (styles.nextButtonDisabled || { backgroundColor: '#757575' })
          ]} 
          onPress={goToNextLevel}
          disabled={!gameCompleted}
        >
          <Text style={styles.nextButtonText || { color: '#FFFFFF', fontSize: 18 }}>{t('games.next')}</Text>
          <Ionicons name="arrow-forward" size={24} color="#fff" style={styles.nextButtonIcon || { marginLeft: 12 }} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default MathGameLevels;