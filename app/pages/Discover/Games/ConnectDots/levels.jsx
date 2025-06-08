import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, StatusBar, Alert, Dimensions, PanResponder } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import styles from '../../../../../styles/Games/levels';
import { completeConnectDotsLevel, getConnectDotsProgress } from '../../../../../config/getConnectDotsProgress';
import { auth } from '../../../../../config/firebase';

const ConnectDotsLevels = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { width } = Dimensions.get('window');
  const boardRef = useRef(null);
  
  const [currentLevel, setCurrentLevel] = useState(route.params?.level || 1);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [isLevelCompleted, setIsLevelCompleted] = useState(false); // Add this missing state variable
  const [gridState, setGridState] = useState([]);
  const [paths, setPaths] = useState([]);
  const [currentPath, setCurrentPath] = useState([]);
  const [currentDot, setCurrentDot] = useState(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [colorPairs, setColorPairs] = useState({});
  const [boardPosition, setBoardPosition] = useState({ x: 0, y: 0 });
  const [pathHistory, setPathHistory] = useState([]); // For undo feature

  // Level configurations - COMPLETELY REDESIGNED to prevent crossing
  const levels = {
    1: { // Level 1 - 5x5 grid - Based on clear screenshot
      grid: { rows: 5, cols: 5 },
      pairs: [
        { color: '#FFEB3B', dots: [{row: 0, col: 0}, {row: 1, col: 1}] },     // Yellow pair
        { color: '#E91E63', dots: [{row: 0, col: 3}, {row: 2, col: 1}] },     // Magenta pair
        { color: '#FF9800', dots: [{row: 0, col: 4}, {row: 3, col: 1}] },     // Orange pair
        { color: '#2196F3', dots: [{row: 1, col: 0}, {row: 2, col: 4}] }      // Blue pair
      ]
    },
    
    2: { // Level 2 - 5x5 grid - From screenshot 2
      grid: { rows: 5, cols: 5 },
      pairs: [
        { color: '#2196F3', dots: [{row: 2, col: 1}, {row: 0, col: 4}] },     // Blue dots
        { color: '#FF9800', dots: [{row: 1, col: 1}, {row: 1, col: 4}] },     // Orange dots
        { color: '#E91E63', dots: [{row: 2, col: 2}, {row: 3, col: 4}] },     // Magenta dots
        { color: '#FFEB3B', dots: [{row: 3, col: 0}, {row: 4, col: 2}] },     // Yellow dots
        { color: '#4CAF50', dots: [{row: 3, col: 1}, {row: 4, col: 4}] }      // Green dots
      ]
    },
    
    3: { // Level 3 - 6x6 grid - From screenshot 3
      grid: { rows: 6, cols: 6 },
      pairs: [
        { color: '#2196F3', dots: [{row: 2, col: 1}, {row: 4, col: 5}] },     // Blue dots
        { color: '#FFEB3B', dots: [{row: 0, col: 1}, {row: 1, col: 4}] },     // Yellow dots
        { color: '#4CAF50', dots: [{row: 0, col: 0}, {row: 3, col: 3}] },     // Green dots
        { color: '#FF9800', dots: [{row: 0, col: 5}, {row: 3, col: 1}] },     // Orange dots
        { color: '#E91E63', dots: [{row: 1, col: 3}, {row: 2, col: 4}] }      // Magenta dots
      ]
    },
    
    4: { // Level 4 - 7x7 grid - Based on screenshot 4
      grid: { rows: 6, cols: 6 },
      pairs: [
        { color: '#2196F3', dots: [{row: 0, col: 0}, {row: 4, col: 3}] },     // Blue dots
        { color: '#FFEB3B', dots: [{row: 0, col: 3}, {row: 3, col: 2}] },     // Yellow dots
        { color: '#4CAF50', dots: [{row: 5, col: 5}, {row: 0, col: 5}] },     // Green dots
        { color: '#FF9800', dots: [{row: 1, col: 1}, {row: 4, col: 0}] },     // Orange dots
        { color: '#E91E63', dots: [{row: 5, col: 0}, {row: 2, col: 2}] }      // Magenta dots
      ]
    },
    
    5: { // Level 4 - 7x7 grid - Based on screenshot 4
      grid: { rows: 7, cols: 7 },
      pairs: [
        { color: '#4CAF50', dots: [{row: 0, col: 3}, {row: 5, col: 2}] },     // Green dots
        { color: '#FFEB3B', dots: [{row: 1, col: 2}, {row: 3, col: 1}] },     // Yellow dots
        { color: '#FF9800', dots: [{row: 1, col: 3}, {row: 1, col: 6}] },     // Orange dots
        { color: '#E91E63', dots: [{row: 1, col: 5}, {row: 4, col: 2}] },     // Magenta dots
        { color: '#00BCD4', dots: [{row: 2, col: 6}, {row: 6, col: 6}] },     // Cyan dots
        { color: '#9C27B0', dots: [{row: 3, col: 5}, {row: 5, col: 4}] },     // Purple dots
        { color: '#2196F3', dots: [{row: 4, col: 4}, {row: 5, col: 5}] },     // Blue dots
        { color: '#964B00', dots: [{row: 6, col: 5}, {row: 5, col: 0}] }      // Brown dots
      ]
    },
    
    6: { // Level 6 - 8x8 grid - Based on screenshot 7
      grid: { rows: 7, cols: 7 },
      pairs: [
        { color: '#4CAF50', dots: [{row: 3, col: 0}, {row: 6, col: 5}] },     // Green dots
        { color: '#00BCD4', dots: [{row: 1, col: 5}, {row: 4, col: 6}] },     // Cyan dots
        { color: '#E91E63', dots: [{row: 1, col: 1}, {row: 4, col: 2}] },     // Magenta dots
        { color: '#F44336', dots: [{row: 0, col: 3}, {row: 6, col: 6}] },     // Red dots
        { color: '#2196F3', dots: [{row: 5, col: 0}, {row: 6, col: 1}] },     // Blue dots
        { color: '#FFEB3B', dots: [{row: 4, col: 0}, {row: 6, col: 3}] },     // Yellow dots
        { color: '#FF9800', dots: [{row: 0, col: 4}, {row: 2, col: 6}] }      // Orange dots
      ]
    },
    
    7: { // Level 7 - 8x8 grid - Based on screenshot 8
      grid: { rows: 8, cols: 8 },
      pairs: [
        { color: '#FF9800', dots: [{row: 2, col: 4}, {row: 3, col: 1}] },     // Orange dots
        { color: '#F44336', dots: [{row: 0, col: 6}, {row: 4, col: 7}] },     // Red dots
        { color: '#4CAF50', dots: [{row: 0, col: 0}, {row: 5, col: 7}] },     // Green dots
        { color: '#E91E63', dots: [{row: 0, col: 5}, {row: 2, col: 1}] },     // Magenta dots
        { color: '#FFEB3B', dots: [{row: 1, col: 4}, {row: 5, col: 6}] },     // Yellow dots
        { color: '#00BCD4', dots: [{row: 0, col: 2}, {row: 1, col: 1}] },     // Cyan dots
        { color: '#2196F3', dots: [{row: 5, col: 2}, {row: 1, col: 6}] }      // Blue dots
      ]
    },
    
    8: { // Level 8 - 9x9 grid - Based on screenshot 9
      grid: { rows: 8, cols: 8 }, // Changed to 9x9 instead of 8x8 to accommodate all dots
      pairs: [
        { color: '#FFEB3B', dots: [{row: 4, col: 4}, {row: 5, col: 5}] },     // Yellow dots
    
        { color: '#4CAF50', dots: [{row: 1, col: 7}, {row: 5, col: 4}] },     // Green dots - fixed to avoid row 8
        { color: '#E91E63', dots: [{row: 0, col: 7}, {row: 1, col: 6}] },     // Magenta dots
        { color: '#00BCD4', dots: [{row: 4, col: 6}, {row: 7, col: 4}] },     // Cyan dots
        { color: '#2196F3', dots: [{row: 4, col: 3}, {row: 7, col: 6}] },     // Blue dots
        { color: '#FF9800', dots: [{row: 0, col: 5}, {row: 6, col: 4}] },     // Orange dots
        { color: '#9C27B0', dots: [{row: 6, col: 2}, {row: 1, col: 5}] },     // Purple dots
      
      ]
    },
    
    9: { // Level 9 - 9x9 grid - Based on screenshot 10
      grid: { rows: 9, cols: 9 },
      pairs: [
        { color: '#FF9800', dots: [{row: 1, col: 4}, {row: 4, col: 4}] },     // Orange dots
        { color: '#FFEB3B', dots: [{row: 0, col: 0}, {row: 1, col: 5}] },     // Yellow dots
        { color: '#4CAF50', dots: [{row: 8, col: 3}, {row: 1, col: 6}] },     // Green dots
        { color: '#A020F0', dots: [{row: 2, col: 1}, {row: 3, col: 4}] },     // Purple dots
        { color: '#2196F3', dots: [{row: 7, col: 7}, {row: 7, col: 4}] },     // Blue dots
        { color: '#00BCD4', dots: [{row: 2, col: 6}, {row: 7, col: 3}] },     // Cyan dots
        { color: '#E91E63', dots: [{row: 3, col: 1}, {row: 4, col: 3}] },     // Magenta dots
        { color: '#795548', dots: [{row: 0, col: 6}, {row: 5, col: 7}] },     // Brown dots
        { color: '#808080', dots: [{row: 5, col: 1}, {row: 7, col: 1}] },    // Gray dots
        { color: '#FFFFFF', dots: [{row: 2, col: 3}, {row: 2, col: 5}] }       // white dots
      ]
    },
    
    10: { // Level 10 - 9x9 grid - Based from screenshot without reference
      grid: { rows: 9, cols: 9 },
      pairs: [
        { color: '#FFEB3B', dots: [{row: 3, col: 3}, {row: 5, col: 3}] },     // Yellow dots
       
        { color: '#4CAF50', dots: [{row: 2, col: 4}, {row: 5, col: 1}] },     // Green dots
        { color: '#E91E63', dots: [{row: 7, col: 0}, {row: 7, col: 5}] },     // Magenta dots
        { color: '#00BCD4', dots: [{row: 4, col: 5}, {row: 8, col: 0}] },     // Cyan dots
        { color: '#2196F3', dots: [{row: 1, col: 7}, {row: 6, col: 3}] },     // Blue dots
        { color: '#FF9800', dots: [{row: 3, col: 0}, {row: 8, col: 8}] },     // Orange dots
        { color: '#9C27B0', dots: [{row: 4, col: 7}, {row: 7, col: 8}] },     // Purple dots
        
        { color: '#795548', dots: [{row: 1, col: 6}, {row: 6, col: 2}] }      // Brown dots
      ]
    }
  };
  // Get current level data safely
  const currentLevelData = currentLevel && levels[currentLevel] ? 
    levels[currentLevel] : levels[1];
    
  // Calculate grid properties based on screen size
  const gridSize = currentLevelData.grid;
  const boardWidth = width * 0.85;
  const cellSize = Math.floor(boardWidth / gridSize.cols);
  const gridWidth = gridSize.cols * cellSize;
  const gridHeight = gridSize.rows * cellSize;
  const dotRadius = Math.min(cellSize * 0.35, 25);

  // Initialize level
  useEffect(() => {
    if (currentLevelData && currentLevelData.grid) {
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
            await completeConnectDotsLevel(currentUser.uid, currentLevel);
            console.log(`Level ${currentLevel} progress saved to Firebase`);
          } else {
            console.warn("No user logged in, progress not saved");
          }
        } catch (error) {
          console.error('Error saving level progress:', error);
          Alert.alert('Error', 'Failed to save your progress. Please try again.');
        }
      }
    };

    saveProgress();
  }, [gameCompleted, currentLevel, isLevelCompleted]);


  // Initialize the level grid and dots
  const initializeLevel = () => {
    setGameCompleted(false);
    setIsLevelCompleted(false); // Reset the isLevelCompleted state
    setPaths([]);
    setCurrentPath([]);
    setCurrentDot(null);
    setIsDrawing(false);
    setPathHistory([]);
    
    // Create an empty grid state
    const rows = gridSize.rows;
    const cols = gridSize.cols;
    
    const emptyGrid = Array(rows).fill().map(() => 
      Array(cols).fill(null)
    );
    
    // Map color pairs with their dots and IDs
    const pairs = {};
    currentLevelData.pairs.forEach((pair, index) => {
      pairs[pair.color] = {
        dots: pair.dots.map((dot, dotIndex) => ({
          ...dot,
          id: `${index}-${dotIndex}`,
          color: pair.color
        })),
        completed: false
      };
      
      // Mark dots in the grid
      pair.dots.forEach((dot, dotIndex) => {
        emptyGrid[dot.row][dot.col] = {
          type: 'dot',
          color: pair.color,
          id: `${index}-${dotIndex}`
        };
      });
    });
    
    setGridState(emptyGrid);
    setColorPairs(pairs);
  };

  // [... rest of your existing code ...]

  // Check if two positions are adjacent
  const areAdjacent = (pos1, pos2) => {
    if (!pos1 || !pos2) return false;
    
    return (
      (Math.abs(pos1.row - pos2.row) === 1 && pos1.col === pos2.col) ||
      (Math.abs(pos1.col - pos2.col) === 1 && pos1.row === pos2.row)
    );
  };

  // Check if position is already in path
  const isInPath = (path, row, col) => {
    return path.some(pos => pos.row === row && pos.col === col);
  };

  // Check if a path intersects with any existing paths
  const doesPathIntersect = (newPath, existingPaths) => {
    for (let i = 0; i < newPath.length - 1; i++) {
      const seg1Start = newPath[i];
      const seg1End = newPath[i + 1];
      
      for (const pathInfo of existingPaths) {
        const path = pathInfo.path;
        for (let j = 0; j < path.length - 1; j++) {
          const seg2Start = path[j];
          const seg2End = path[j + 1];
          
          // Check for crossing segments
          if ((seg1Start.row === seg1End.row && seg2Start.col === seg2End.col) ||
              (seg1Start.col === seg1End.col && seg2Start.row === seg2End.row)) {
            
            // Check if segments cross
            const horizontal = seg1Start.row === seg1End.row ? 
                              {start: seg1Start, end: seg1End} : 
                              {start: seg2Start, end: seg2End};
            const vertical = seg1Start.col === seg1End.col ? 
                            {start: seg1Start, end: seg1End} : 
                            {start: seg2Start, end: seg2End};
            
            // Check if the vertical line crosses through the horizontal line
            if (vertical.start.col >= Math.min(horizontal.start.col, horizontal.end.col) && 
                vertical.start.col <= Math.max(horizontal.start.col, horizontal.end.col) &&
                horizontal.start.row >= Math.min(vertical.start.row, vertical.end.row) && 
                horizontal.start.row <= Math.max(vertical.start.row, vertical.end.row)) {
              return true; // Paths cross
            }
          }
        }
      }
    }
    return false;
  };

  // Find path between two dots using horizontal/vertical movements
  const findPath = (startRow, startCol, endRow, endCol) => {
    // Create a simple direct path (horizontal then vertical)
    const path = [{ row: startRow, col: startCol }];
    
    // Horizontal first, then vertical
    let currentCol = startCol;
    while (currentCol !== endCol) {
      currentCol += currentCol < endCol ? 1 : -1;
      path.push({ row: startRow, col: currentCol });
    }
    
    // Then move vertically
    let currentRow = startRow;
    while (currentRow !== endRow) {
      currentRow += currentRow < endRow ? 1 : -1;
      path.push({ row: currentRow, col: endCol });
    }
    
    return path;
  };

  // Handle dot touch - start drawing
  const handleDotTouch = (row, col) => {
    if (gameCompleted) return;
    
    const cell = gridState[row] && gridState[row][col];
    if (!cell || cell.type !== 'dot') return;
    
    // If already drawing, check if this is valid end
    if (isDrawing && currentDot) {
      if (cell.color === currentDot.color && cell.id !== currentDot.id) {
        // Check if we're adjacent to the last position in the current path
        const lastPos = currentPath[currentPath.length - 1];
        if (areAdjacent(lastPos, { row, col })) {
          // Complete path
          completePath(row, col);
        } else {
          // Try to find a valid path
          const autoPath = findPath(currentDot.row, currentDot.col, row, col);
          
          // Check if auto path crosses existing paths
          const existingPaths = paths.filter(p => p.color !== cell.color);
          if (!doesPathIntersect(autoPath, existingPaths)) {
            completePath(row, col, autoPath);
          } else {
            // Try alternative path (vertical first, then horizontal)
            const altPath = [{ row: currentDot.row, col: currentDot.col }];
            
            // Vertical first
            let currentRow = currentDot.row;
            while (currentRow !== row) {
              currentRow += currentRow < row ? 1 : -1;
              altPath.push({ row: currentRow, col: currentDot.col });
            }
            
            // Then horizontal
            let currentCol = currentDot.col;
            while (currentCol !== col) {
              currentCol += currentCol < col ? 1 : -1;
              altPath.push({ row, col: currentCol });
            }
            
            // Check if this alternative path works
            if (!doesPathIntersect(altPath, existingPaths)) {
              completePath(row, col, altPath);
            } else {
              // Both paths cross - cannot connect
              Alert.alert("Cannot Connect", "These dots cannot be connected without crossing other paths.");
            }
          }
        }
      }
      return;
    }
    
    // Start a new path
    setCurrentDot({
      row, 
      col, 
      color: cell.color, 
      id: cell.id
    });
    setCurrentPath([{ row, col }]);
    setIsDrawing(true);
  };
  
  // Handle movement to a cell during path drawing
  const handleCellMove = (row, col) => {
    if (!isDrawing || !currentDot || gameCompleted) return;
    
    // Safety check for valid grid position
    if (row < 0 || row >= gridSize.rows || col < 0 || col >= gridSize.cols) {
      return;
    }
    
    // Can only move to adjacent cells
    const lastPos = currentPath[currentPath.length - 1];
    if (!areAdjacent(lastPos, { row, col })) {
      return;
    }
    
    // Check if already in path
    if (isInPath(currentPath, row, col)) {
      return;
    }
    
    // Check if cell has another dot or path
    const cell = gridState[row] && gridState[row][col];
    
    // Can't go through other dots unless it's the matching end dot
    if (cell && cell.type === 'dot') {
      if (cell.color === currentDot.color && cell.id !== currentDot.id) {
        // This is the matching end dot - complete the path
        completePath(row, col);
      }
      return;
    }
    
    // Check if this move would cross an existing path
    const newPath = [...currentPath, { row, col }];
    const existingPaths = paths.filter(p => p.color !== currentDot.color);
    
    if (existingPaths.length > 0 && doesPathIntersect(newPath, existingPaths)) {
      // Would cross an existing path - don't allow
      return;
    }
    
    // Add to current path
    setCurrentPath(newPath);
  };
  
  // Complete a path
  const completePath = (endRow, endCol, customPath = null) => {
    // Save current state to history for undo
    setPathHistory([...pathHistory, { paths, colorPairs }]);
    
    // Use the custom path if provided, otherwise add the end position to current path
    const finalPath = customPath || [...currentPath, { row: endRow, col: endCol }];
    
    // Add to completed paths
    const newPaths = [...paths];
    
    // Remove existing path of this color if it exists
    const existingPathIndex = newPaths.findIndex(p => p.color === currentDot.color);
    if (existingPathIndex !== -1) {
      newPaths.splice(existingPathIndex, 1);
    }
    
    newPaths.push({
      id: `path-${currentDot.color}`,
      color: currentDot.color,
      path: finalPath
    });
    
    setPaths(newPaths);
    // Mark this color pair as completed
    const updatedColorPairs = {...colorPairs};
    updatedColorPairs[currentDot.color].completed = true;
    setColorPairs(updatedColorPairs);
    
    // Check if level is completed
    const allCompleted = Object.values(updatedColorPairs).every(pair => pair.completed);
    if (allCompleted) {
      setGameCompleted(true);
      setTimeout(() => {
        Alert.alert("Level Completed!", "Great job! You can proceed to the next level.");
      }, 500);
    }
    
    // Reset current path state
    setCurrentPath([]);
    setCurrentDot(null);
    setIsDrawing(false);
  };

  // Undo the last path
  const undoLastPath = () => {
    if (pathHistory.length === 0) return;
    
    // Get the last state
    const lastState = pathHistory[pathHistory.length - 1];
    
    // Restore the previous state
    setPaths(lastState.paths);
    setColorPairs(lastState.colorPairs);
    
    // Update history
    setPathHistory(pathHistory.slice(0, -1));
    
    // Reset drawing state
    setCurrentPath([]);
    setCurrentDot(null);
    setIsDrawing(false);
  };
  
  // Function to move to the next level
  const goToNextLevel = () => {
    if (currentLevel < Object.keys(levels).length) {
      setCurrentLevel(prev => prev + 1);
    } else {
      // All levels completed
      Alert.alert(
        "Game Completed!", 
        "Congratulations! You've completed all levels.",
        [{ text: "OK", onPress: () => navigation.goBack() }]
      );
    }
  };

  // Reset current level
  const resetLevel = () => {
    initializeLevel();
  };

  // Start measuring board position after render
  useEffect(() => {
    setTimeout(() => {
      if (boardRef.current) {
        boardRef.current.measure((x, y, width, height, pageX, pageY) => {
          setBoardPosition({ x: pageX, y: pageY });
        });
      }
    }, 500);
  }, []);

  // Pan responder for touch handling
  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderGrant: (evt, gestureState) => {
      // Get position relative to the board
      const relativeX = gestureState.x0 - boardPosition.x;
      const relativeY = gestureState.y0 - boardPosition.y;
      
      if (relativeX < 0 || relativeY < 0 || relativeX >= gridWidth || relativeY >= gridHeight) {
        return;
      }
      
      const col = Math.floor(relativeX / cellSize);
      const row = Math.floor(relativeY / cellSize);
      
      // Check if touch is on a dot
      if (row >= 0 && row < gridSize.rows && col >= 0 && col < gridSize.cols) {
        const cell = gridState[row] && gridState[row][col];
        if (cell && cell.type === 'dot') {
          handleDotTouch(row, col);
        }
      }
    },
    onPanResponderMove: (evt, gestureState) => {
      if (!isDrawing) return;
      
      // Get position relative to the board
      const relativeX = gestureState.moveX - boardPosition.x;
      const relativeY = gestureState.moveY - boardPosition.y;
      
      if (relativeX < 0 || relativeY < 0 || relativeX >= gridWidth || relativeY >= gridHeight) {
        return;
      }
      
      const col = Math.floor(relativeX / cellSize);
      const row = Math.floor(relativeY / cellSize);
      
      if (row >= 0 && row < gridSize.rows && col >= 0 && col < gridSize.cols) {
        const lastPos = currentPath[currentPath.length - 1];
        if (lastPos && (lastPos.row !== row || lastPos.col !== col)) {
          handleCellMove(row, col);
        }
      }
    },
    onPanResponderRelease: () => {
      if (!isDrawing) return;
      
      // Check if path is complete (ends on matching dot)
      const lastPos = currentPath[currentPath.length - 1];
      if (lastPos) {
        const lastCell = gridState[lastPos.row] && gridState[lastPos.row][lastPos.col];
        if (lastCell && lastCell.type === 'dot' && 
            lastCell.color === currentDot.color && 
            lastCell.id !== currentDot.id) {
          // Path is complete - leave it
          return;
        }
      }
      
      // Path is incomplete - reset
      setIsDrawing(false);
      setCurrentDot(null);
      setCurrentPath([]);
    }
  });

  // Render a single cell of the grid
  const renderCell = (row, col) => {
    const cell = gridState[row] && gridState[row][col];
    const isSelected = currentDot && currentDot.row === row && currentDot.col === col;
    
    // Render dot
    if (cell && cell.type === 'dot') {
      return (
        <TouchableOpacity
          key={`dot-${row}-${col}`}
          onPress={() => handleDotTouch(row, col)}
          style={[
            styles.dot,
            {
              backgroundColor: cell.color,
              left: col * cellSize + (cellSize - dotRadius * 2) / 2,
              top: row * cellSize + (cellSize - dotRadius * 2) / 2,
              width: dotRadius * 2,
              height: dotRadius * 2,
              borderRadius: dotRadius,
              borderWidth: isSelected ? 3 : 0,
              borderColor: 'white',
            }
          ]}
        />
      );
    }
    
    return null;
  };

  // Render all completed and current paths
  const renderPaths = () => {
    const allPaths = [];
    
    // Render completed paths
    paths.forEach(pathInfo => {
      if (!pathInfo || !pathInfo.path || pathInfo.path.length < 2) return;
      
      const { path, color } = pathInfo;
      
      // Draw line segments between each point
      for (let i = 0; i < path.length - 1; i++) {
        const start = path[i];
        const end = path[i + 1];
        
        const startX = start.col * cellSize + cellSize / 2;
        const startY = start.row * cellSize + cellSize / 2;
        const endX = end.col * cellSize + cellSize / 2;
        const endY = end.row * cellSize + cellSize / 2;
        
        // Calculate line length and angle
        const dx = endX - startX;
        const dy = endY - startY;
        const length = Math.sqrt(dx * dx + dy * dy);
        const angle = Math.atan2(dy, dx) * 180 / Math.PI;
        
        allPaths.push(
          <View
            key={`path-${pathInfo.id}-${i}`}
            style={{
              position: 'absolute',
              backgroundColor: color,
              height: 10,
              width: length,
              left: startX,
              top: startY - 5,
              borderRadius: 5,
              zIndex: 10,
              transform: [
                { translateX: -length / 2 },
                { rotate: `${angle}deg` },
                { translateX: length / 2 },
              ],
            }}
          />
        );
      }
    });
    
    // Render current path being drawn
    if (currentPath.length >= 2 && currentDot) {
      for (let i = 0; i < currentPath.length - 1; i++) {
        const start = currentPath[i];
        const end = currentPath[i + 1];
        
        const startX = start.col * cellSize + cellSize / 2;
        const startY = start.row * cellSize + cellSize / 2;
        const endX = end.col * cellSize + cellSize / 2;
        const endY = end.row * cellSize + cellSize / 2;
        
        // Calculate line length and angle
        const dx = endX - startX;
        const dy = endY - startY;
        const length = Math.sqrt(dx * dx + dy * dy);
        const angle = Math.atan2(dy, dx) * 180 / Math.PI;
        
        allPaths.push(
          <View
            key={`current-path-${i}`}
            style={{
              position: 'absolute',
              backgroundColor: currentDot.color,
              height: 10,
              width: length,
              left: startX,
              top: startY - 5,
              borderRadius: 5,
              zIndex: 10,
              opacity: 0.8,
              transform: [
                { translateX: -length / 2 },
                { rotate: `${angle}deg` },
                { translateX: length / 2 },
              ],
            }}
          />
        );
      }
    }
    
    return allPaths;
  };

  // Render the game grid
  const renderGrid = () => {
    if (!gridState || !gridState.length) {
      return null;
    }
    
    const cells = [];
    
    // Add grid cells
    for (let row = 0; row < gridSize.rows; row++) {
      for (let col = 0; col < gridSize.cols; col++) {
        const cellView = renderCell(row, col);
        if (cellView) {
          cells.push(cellView);
        }
      }
    }
    
    return (
      <View
        ref={boardRef}
        style={[
          styles.gameBoard,
          {
            width: gridWidth,
            height: gridHeight,
          }
        ]}
        {...panResponder.panHandlers}
      >
        {/* Grid Lines */}
        {Array.from({ length: gridSize.cols + 1 }).map((_, i) => (
          <View 
            key={`v-${i}`} 
            style={[
              styles.gridLine, 
              { 
                left: i * cellSize, 
                height: gridHeight,
                width: 1,
              }
            ]} 
          />
        ))}
        
        {Array.from({ length: gridSize.rows + 1 }).map((_, i) => (
          <View 
            key={`h-${i}`} 
            style={[
              styles.gridLine, 
              { 
                top: i * cellSize, 
                width: gridWidth,
                height: 1,
              }
            ]} 
          />
        ))}
        
        {/* Paths */}
        {renderPaths()}
        
        {/* Dots */}
        {cells}
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
        <Text style={styles.levelTitle}>Level {currentLevel}</Text>
        <View style={{ flexDirection: 'row' }}>
          <TouchableOpacity 
            onPress={undoLastPath} 
            style={[styles.resetButton, { marginRight: 8, opacity: pathHistory.length > 0 ? 1 : 0.5 }]}
            disabled={pathHistory.length === 0}
          >
            <Ionicons name="arrow-undo" size={24} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity onPress={resetLevel} style={styles.resetButton}>
            <Ionicons name="refresh" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Game Board */}
      <View style={styles.gameContainer}>
        {renderGrid()}
      </View>

      {/* Instructions */}
      <View style={{ paddingHorizontal: 20, marginBottom: 10 }}>
        <Text style={{ color: 'white', textAlign: 'center' }}>
          Connect matching colors by dragging from one dot to another.
        </Text>
      </View>

      {/* Next Level Button */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={[
            styles.nextButton,
            gameCompleted ? styles.nextButtonEnabled : styles.nextButtonDisabled
          ]} 
          onPress={goToNextLevel}
          disabled={!gameCompleted}
        >
          <Text style={styles.nextButtonText}>NEXT</Text>
          <Ionicons name="arrow-forward" size={24} color="#fff" style={styles.nextButtonIcon} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default ConnectDotsLevels;