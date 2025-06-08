// Import necessary Firestore functions
import { 
    doc, 
    setDoc, 
    getDoc, 
    updateDoc, 
    collection,
    serverTimestamp 
  } from 'firebase/firestore';
  import { auth, db } from './firebase';
  
  // Function to initialize or get a user's game progress
  export const getMathGameProgress = async (userId) => {
    try {
      // If no userId is provided, get it from the current authenticated user
      if (!userId) {
        const currentUser = auth.currentUser;
        if (!currentUser) {
          throw new Error('No authenticated user found');
        }
        userId = currentUser.uid;
      }
      
      // Reference to the user's game progress document
      const gameProgressRef = doc(db, 'gameProgress', userId);
      const gameProgressDoc = await getDoc(gameProgressRef);
      
      // If document exists, return it
      if (gameProgressDoc.exists()) {
        const data = gameProgressDoc.data();
        return data.mathGame || {
          unlockedLevel: 1,
          completedLevels: [],
          lastPlayed: null
        };
      } else {
        // If document doesn't exist, create a new one with default values
        const defaultProgress = {
          userId,
          mathGame: {
            unlockedLevel: 1,
            completedLevels: [],
            lastPlayed: serverTimestamp(),
            bestMoves: {}
          },
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        };
        
        // Create the document in Firestore
        await setDoc(gameProgressRef, defaultProgress);
        return defaultProgress.mathGame;
      }
    } catch (error) {
      console.error('Error getting user game progress:', error);
      // Return default values instead of throwing an error
      return {
        unlockedLevel: 1,
        completedLevels: [],
        lastPlayed: null,
        bestMoves: {}
      };
    }
  };
  
  // Function to complete a level and unlock the next one
  export const completeMathGameLevel = async (userId, level, moves = null) => {
    try {
      // If no userId is provided, get it from the current authenticated user
      if (!userId) {
        const currentUser = auth.currentUser;
        if (!currentUser) {
          throw new Error('No authenticated user found');
        }
        userId = currentUser.uid;
      }
      
      // Reference to the user's game progress document
      const gameProgressRef = doc(db, 'gameProgress', userId);
      
      // Get current progress
      const gameProgressDoc = await getDoc(gameProgressRef);
      
      if (gameProgressDoc.exists()) {
        const userData = gameProgressDoc.data();
        const currentProgress = userData.mathGame || {};
        const completedLevels = currentProgress.completedLevels || [];
        const bestMoves = currentProgress.bestMoves || {};
        
        // Don't add duplicates to completedLevels array
        if (!completedLevels.includes(level)) {
          completedLevels.push(level);
        }
        
        // Update best moves if provided
        if (moves !== null) {
          const currentBest = bestMoves[level];
          if (!currentBest || moves < currentBest) {
            bestMoves[level] = moves;
          }
        }
        
        // Calculate the next level to unlock
        const nextLevel = level + 1;
        const unlockedLevel = Math.max(currentProgress.unlockedLevel || 1, nextLevel);
        
        // Update the document
        const updatedProgress = {
          mathGame: {
            unlockedLevel,
            completedLevels,
            bestMoves,
            lastPlayed: serverTimestamp()
          },
          updatedAt: serverTimestamp()
        };
        
        await updateDoc(gameProgressRef, updatedProgress);
        
        return {
          unlockedLevel,
          completedLevels,
          bestMoves,
          lastPlayed: serverTimestamp()
        };
      } else {
        // Create new progress document if it doesn't exist
        return await getMathGameProgress(userId);
      }
    } catch (error) {
      console.error('Error updating Math Game level:', error);
      // Return default values instead of throwing an error
      return {
        unlockedLevel: level + 1,
        completedLevels: [level],
        lastPlayed: new Date(),
        bestMoves: {}
      };
    }
  };
  
  // Function to reset user's progress
  export const resetMathGameProgress = async (userId) => {
    try {
      // If no userId is provided, get it from the current authenticated user
      if (!userId) {
        const currentUser = auth.currentUser;
        if (!currentUser) {
          throw new Error('No authenticated user found');
        }
        userId = currentUser.uid;
      }
      
      // Reference to the user's game progress document
      const gameProgressRef = doc(db, 'gameProgress', userId);
      
      // Check if document exists
      const gameProgressDoc = await getDoc(gameProgressRef);
      
      if (gameProgressDoc.exists()) {
        // Reset the Math Game progress
        await updateDoc(gameProgressRef, {
          'mathGame': {
            unlockedLevel: 1,
            completedLevels: [],
            bestMoves: {},
            lastPlayed: serverTimestamp()
          },
          updatedAt: serverTimestamp()
        });
      } else {
        // Create a new document with default values
        await getMathGameProgress(userId);
      }
      
      return {
        unlockedLevel: 1,
        completedLevels: [],
        bestMoves: {},
        lastPlayed: serverTimestamp()
      };
    } catch (error) {
      console.error('Error resetting Math Game progress:', error);
      // Return default values instead of throwing an error
      return {
        unlockedLevel: 1,
        completedLevels: [],
        bestMoves: {},
        lastPlayed: new Date()
      };
    }
  };
  
  export default {
    getMathGameProgress,
    completeMathGameLevel,
    resetMathGameProgress
  };