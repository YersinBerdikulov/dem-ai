import { auth, db } from '../config/firebase';
import { 
  doc, 
  getDoc, 
  updateDoc, 
  addDoc, 
  collection,
  serverTimestamp,
  arrayUnion
} from 'firebase/firestore';

/**
 * Utility functions for tracking user activities and achievements
 */

// Activity types
export const ACTIVITY_TYPES = {
  DIARY: 'diary',
  BREATHING: 'breathing',
  AFFIRMATION: 'affirmation',
  GAME: 'game',
  TEST: 'test',
  HABIT: 'habit'
};

// Maximum number of recent activities to track
const MAX_RECENT_ACTIVITIES = 5;

/**
 * Track a user activity and update their achievements
 * @param {string} activityType - The type of activity (use ACTIVITY_TYPES constants)
 * @param {object} details - Optional details about the activity
 */
export const trackActivity = async (activityType, details = {}) => {
  try {
    const user = auth.currentUser;
    if (!user) return;

    // Get activity collection mapping
    const collectionMap = {
      [ACTIVITY_TYPES.DIARY]: 'diaryEntries',
      [ACTIVITY_TYPES.BREATHING]: 'sessions',  // Using existing sessions collection
      [ACTIVITY_TYPES.AFFIRMATION]: 'sessions', // Using existing sessions collection
      [ACTIVITY_TYPES.GAME]: 'gameProgress',    // Using existing gameProgress collection
      [ACTIVITY_TYPES.TEST]: 'worryScores',     // Using existing test scores collection
      [ACTIVITY_TYPES.HABIT]: 'user_habits'     // Using existing habits collection
    };

    // Use your existing collections to track activities based on collection mapping
    const collectionName = collectionMap[activityType];
    
    if (!collectionName) {
      console.error('Invalid activity type:', activityType);
      return;
    }

    // Most collections need a userId field
    const activityData = {
      userId: user.uid,
      timestamp: serverTimestamp(),
      type: activityType,
      ...details
    };

    // Add the activity document to the appropriate collection
    await addDoc(collection(db, collectionName), activityData);

    // Update the user's achievements directly in the users collection
    await updateUserAchievements(activityType);
    
    // Also update recent activities
    await updateRecentActivities(activityType, details);
    
    console.log(`Activity tracked: ${activityType}`);
  } catch (error) {
    console.error('Error tracking activity:', error);
  }
};

/**
 * Update the list of recent activities
 * @param {string} activityType - The type of activity 
 * @param {object} details - Optional details about the activity
 */
const updateRecentActivities = async (activityType, details = {}) => {
  try {
    const user = auth.currentUser;
    if (!user) return;

    // Get user document
    const userRef = doc(db, 'users', user.uid);
    const userDoc = await getDoc(userRef);
    
    if (!userDoc.exists()) return;
    
    // Get the user's current recent activities or initialize
    const userData = userDoc.data();
    const recentActivities = userData.recentActivities || [];
    
    // Map activity types to the corresponding card IDs
    const typeToCardMap = {
      [ACTIVITY_TYPES.DIARY]: 'Diary',
      [ACTIVITY_TYPES.BREATHING]: 'relaxation',
      [ACTIVITY_TYPES.AFFIRMATION]: 'affiramation',
      [ACTIVITY_TYPES.GAME]: 'Games',
      [ACTIVITY_TYPES.TEST]: 'Test',
      [ACTIVITY_TYPES.HABIT]: 'habits'
    };
    
    // Get the card ID for this activity type
    const cardId = typeToCardMap[activityType];
    
    if (!cardId) {
      console.warn(`No card mapping for activity type: ${activityType}`);
      return;
    }
    
    // Create new activity entry
    const newActivity = {
      cardId,
      timestamp: new Date().toISOString(),
      type: activityType,
      details: details.details || ''
    };
    
    // Remove any existing activities with the same cardId
    const filteredActivities = recentActivities.filter(activity => 
      activity.cardId !== cardId
    );
    
    // Add the new activity to the beginning of the array
    const updatedActivities = [newActivity, ...filteredActivities]
      .slice(0, MAX_RECENT_ACTIVITIES); // Keep only the most recent activities
    
    // Update the user document with the new recent activities
    await updateDoc(userRef, {
      recentActivities: updatedActivities
    });
    
    console.log(`Recent activity updated: ${activityType}`);
  } catch (error) {
    console.error('Error updating recent activities:', error);
  }
};

/**
 * Update user achievements directly in the users collection
 * @param {string} activityType - The type of activity completed
 */
const updateUserAchievements = async (activityType) => {
  try {
    const user = auth.currentUser;
    if (!user) return;

    // Get user document
    const userRef = doc(db, 'users', user.uid);
    const userDoc = await getDoc(userRef);
    
    if (!userDoc.exists()) return;
    
    // Get the user's current achievements or initialize
    const userData = userDoc.data();
    const achievements = userData.achievements || [];
    const activityCounts = userData.activityCounts || {};
    
    // Increment activity count
    activityCounts[activityType] = (activityCounts[activityType] || 0) + 1;
    const count = activityCounts[activityType];
    
    // Define achievement templates
    const achievementTemplates = {
      [ACTIVITY_TYPES.DIARY]: [
        { 
          id: 'diary1', 
          title: 'You have filled in your mood diary for the first time', 
          icon: 'book', 
          threshold: 1 
        },
        { 
          id: 'diary7', 
          title: 'You have filled in your mood diary every day for 7 Days', 
          icon: 'book', 
          threshold: 7 
        },
        { 
          id: 'diary30', 
          title: 'You have filled in your mood diary every day for 30 Days', 
          icon: 'book', 
          threshold: 30 
        }
      ],
      [ACTIVITY_TYPES.BREATHING]: [
        { 
          id: 'breathing1', 
          title: 'You have completed your first breathing session', 
          icon: 'medkit', 
          threshold: 1 
        }
      ],
      [ACTIVITY_TYPES.TEST]: [
        { 
          id: 'test1', 
          title: 'You passed your first test', 
          icon: 'clipboard', 
          threshold: 1 
        },
        { 
          id: 'test4', 
          title: 'You passed 4 tests', 
          icon: 'clipboard', 
          threshold: 4 
        }
      ],
      [ACTIVITY_TYPES.GAME]: [
        { 
          id: 'game1', 
          title: 'You played your first game', 
          icon: 'game-controller', 
          threshold: 1 
        },
        { 
          id: 'game2', 
          title: 'You played all 2 games', 
          icon: 'game-controller', 
          threshold: 2 
        }
      ],
      [ACTIVITY_TYPES.HABIT]: [
        { 
          id: 'habit1', 
          title: 'You created your first habit', 
          icon: 'calendar', 
          threshold: 1 
        }
      ],
      [ACTIVITY_TYPES.AFFIRMATION]: [
        { 
          id: 'affirmation1', 
          title: 'You read your first affirmation phrase', 
          icon: 'heart', 
          threshold: 1 
        }
      ]
    };
    
    // Get templates for the current activity type
    const templates = achievementTemplates[activityType] || [];
    
    // Check each achievement template
    let updated = false;
    const updatedAchievements = [...achievements];
    
    for (const template of templates) {
      // Only check templates where count matches or exceeds threshold
      if (count >= template.threshold) {
        // Find existing achievement or create new one
        const existingIndex = updatedAchievements.findIndex(a => a.id === template.id);
        
        if (existingIndex >= 0) {
          // Update existing achievement
          if (!updatedAchievements[existingIndex].completed) {
            updatedAchievements[existingIndex] = {
              ...updatedAchievements[existingIndex],
              progress: 100,
              completed: true
            };
            updated = true;
          }
        } else {
          // Add new achievement
          updatedAchievements.push({
            id: template.id,
            title: template.title,
            icon: template.icon,
            color: getColorForActivityType(activityType),
            progress: 100,
            completed: true,
            type: 'badge'
          });
          updated = true;
        }
      }
    }
    
    // Only update Firestore if achievements changed
    if (updated) {
      await updateDoc(userRef, {
        achievements: updatedAchievements,
        activityCounts: activityCounts
      });
      
      console.log('User achievements updated');
    } else {
      // Still update the activity counts
      await updateDoc(userRef, {
        activityCounts: activityCounts
      });
    }
  } catch (error) {
    console.error('Error updating achievements:', error);
  }
};

/**
 * Get color for activity type
 * @param {string} activityType - Activity type
 * @returns {string} - Color code
 */
const getColorForActivityType = (activityType) => {
  const colorMap = {
    [ACTIVITY_TYPES.DIARY]: '#4CAF50',
    [ACTIVITY_TYPES.BREATHING]: '#2196F3',
    [ACTIVITY_TYPES.TEST]: '#FF9800',
    [ACTIVITY_TYPES.GAME]: '#673AB7',
    [ACTIVITY_TYPES.HABIT]: '#009688',
    [ACTIVITY_TYPES.AFFIRMATION]: '#E91E63'
  };
  
  return colorMap[activityType] || '#607D8B';
};

/**
 * Get user achievements
 * @returns {Array} - List of user achievements
 */
export const getUserAchievements = async () => {
  try {
    const user = auth.currentUser;
    if (!user) return [];
    
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    
    if (userDoc.exists()) {
      return userDoc.data().achievements || [];
    }
    
    return [];
  } catch (error) {
    console.error('Error getting achievements:', error);
    return [];
  }
};