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
  export const getConnectDotsProgress = async (userId) => {
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
        return data.connectDots || {
          unlockedLevel: 1,
          completedLevels: [],
          lastPlayed: null
        };
      } else {
        // If document doesn't exist, create a new one with default values
        const defaultProgress = {
          userId,
          connectDots: {
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
        return defaultProgress.connectDots;
      }
    } catch (error) {
      console.error('Error getting user game progress:', error);
      throw error;
    }
  };
  
  // Function to complete a level and unlock the next one
  export const completeConnectDotsLevel = async (userId, level, moves = null) => {
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
        const currentProgress = userData.connectDots || {};
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
          connectDots: {
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
        return await getConnectDotsProgress(userId);
      }
    } catch (error) {
      console.error('Error updating Connect Dots level:', error);
      throw error;
    }
  };
  
  // Function to reset user's progress
  export const resetConnectDotsProgress = async (userId) => {
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
        // Reset the Connect Dots progress
        await updateDoc(gameProgressRef, {
          'connectDots': {
            unlockedLevel: 1,
            completedLevels: [],
            bestMoves: {},
            lastPlayed: serverTimestamp()
          },
          updatedAt: serverTimestamp()
        });
      } else {
        // Create a new document with default values
        await getConnectDotsProgress(userId);
      }
      
      return {
        unlockedLevel: 1,
        completedLevels: [],
        bestMoves: {},
        lastPlayed: serverTimestamp()
      };
    } catch (error) {
      console.error('Error resetting Connect Dots progress:', error);
      throw error;
    }
  };
  
  // Function to update user's best moves for a level
  export const updateBestMoves = async (userId, level, moves) => {
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
        const currentProgress = userData.connectDots || {};
        const bestMoves = currentProgress.bestMoves || {};
        
        // Only update if the new moves count is better than the current best
        const currentBest = bestMoves[level];
        if (!currentBest || moves < currentBest) {
          bestMoves[level] = moves;
          
          // Update the document
          await updateDoc(gameProgressRef, {
            'connectDots.bestMoves': bestMoves,
            'updatedAt': serverTimestamp()
          });
          
          return true; // Updated successfully
        }
        
        return false; // No update needed (not a new best)
      } else {
        // Create new progress document if it doesn't exist
        await getConnectDotsProgress(userId);
        return await updateBestMoves(userId, level, moves);
      }
    } catch (error) {
      console.error('Error updating best moves:', error);
      throw error;
    }
  };
  
  export default {
    getConnectDotsProgress,
    completeConnectDotsLevel,
    resetConnectDotsProgress,
    updateBestMoves
  };