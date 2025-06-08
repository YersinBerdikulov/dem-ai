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
  export const getMatchingItemsProgress = async (userId) => {
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
        return data.matchingItems || {
          unlockedLevel: 1,
          completedLevels: [],
          lastPlayed: null,
          bestTimes: {},
          bestMoves: {}
        };
      } else {
        // If document doesn't exist, create a new one with default values
        const defaultProgress = {
          userId,
          matchingItems: {
            unlockedLevel: 1,
            completedLevels: [],
            lastPlayed: serverTimestamp(),
            bestTimes: {},
            bestMoves: {}
          },
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        };
        
        // Create the document in Firestore
        await setDoc(gameProgressRef, defaultProgress);
        return defaultProgress.matchingItems;
      }
    } catch (error) {
      console.error('Error getting user game progress:', error);
      throw error;
    }
  };
  
  // Function to complete a level and unlock the next one
  export const completeMatchingItemsLevel = async (userId, level, time = null, moves = null) => {
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
        const currentProgress = userData.matchingItems || {};
        const completedLevels = currentProgress.completedLevels || [];
        const bestTimes = currentProgress.bestTimes || {};
        const bestMoves = currentProgress.bestMoves || {};
        
        // Don't add duplicates to completedLevels array
        if (!completedLevels.includes(level)) {
          completedLevels.push(level);
        }
        
        // Update best time if provided
        if (time !== null) {
          const currentBestTime = bestTimes[level];
          if (!currentBestTime || time < currentBestTime) {
            bestTimes[level] = time;
          }
        }
        
        // Update best moves if provided
        if (moves !== null) {
          const currentBestMoves = bestMoves[level];
          if (!currentBestMoves || moves < currentBestMoves) {
            bestMoves[level] = moves;
          }
        }
        
        // Calculate the next level to unlock
        const nextLevel = level + 1;
        const unlockedLevel = Math.max(currentProgress.unlockedLevel || 1, nextLevel);
        
        // Update the document
        const updatedProgress = {
          matchingItems: {
            unlockedLevel,
            completedLevels,
            bestTimes,
            bestMoves,
            lastPlayed: serverTimestamp()
          },
          updatedAt: serverTimestamp()
        };
        
        await updateDoc(gameProgressRef, updatedProgress);
        
        return {
          unlockedLevel,
          completedLevels,
          bestTimes,
          bestMoves,
          lastPlayed: serverTimestamp()
        };
      } else {
        // Create new progress document if it doesn't exist
        return await getMatchingItemsProgress(userId);
      }
    } catch (error) {
      console.error('Error updating Matching Items level:', error);
      throw error;
    }
  };
  
  // Function to reset user's progress
  export const resetMatchingItemsProgress = async (userId) => {
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
        // Reset the Matching Items progress
        await updateDoc(gameProgressRef, {
          'matchingItems': {
            unlockedLevel: 1,
            completedLevels: [],
            bestTimes: {},
            bestMoves: {},
            lastPlayed: serverTimestamp()
          },
          updatedAt: serverTimestamp()
        });
      } else {
        // Create a new document with default values
        await getMatchingItemsProgress(userId);
      }
      
      return {
        unlockedLevel: 1,
        completedLevels: [],
        bestTimes: {},
        bestMoves: {},
        lastPlayed: serverTimestamp()
      };
    } catch (error) {
      console.error('Error resetting Matching Items progress:', error);
      throw error;
    }
  };
  
  // Function to update user's best time and moves for a level
  export const updateBestTimeAndMoves = async (userId, level, time, moves) => {
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
        const currentProgress = userData.matchingItems || {};
        const bestTimes = currentProgress.bestTimes || {};
        const bestMoves = currentProgress.bestMoves || {};
        
        let updated = false;
        
        // Only update if the new time is better than the current best
        const currentBestTime = bestTimes[level];
        if (!currentBestTime || time < currentBestTime) {
          bestTimes[level] = time;
          updated = true;
        }
        
        // Only update if the new moves count is better than the current best
        const currentBestMoves = bestMoves[level];
        if (!currentBestMoves || moves < currentBestMoves) {
          bestMoves[level] = moves;
          updated = true;
        }
        
        if (updated) {
          // Update the document
          await updateDoc(gameProgressRef, {
            'matchingItems.bestTimes': bestTimes,
            'matchingItems.bestMoves': bestMoves,
            'updatedAt': serverTimestamp()
          });
          
          return true; // Updated successfully
        }
        
        return false; // No update needed (not a new best)
      } else {
        // Create new progress document if it doesn't exist
        await getMatchingItemsProgress(userId);
        return await updateBestTimeAndMoves(userId, level, time, moves);
      }
    } catch (error) {
      console.error('Error updating best time and moves:', error);
      throw error;
    }
  };
  
  export default {
    getMatchingItemsProgress,
    completeMatchingItemsLevel,
    resetMatchingItemsProgress,
    updateBestTimeAndMoves
  };