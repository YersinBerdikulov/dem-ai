import { doc, getDoc, setDoc, serverTimestamp, updateDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { auth, db } from '../config/firebase';

/**
 * Save personality test results to Firebase
 * @param {Object} answers - Object containing the user's answers
 * @param {String} personalityType - The determined personality type
 * @param {Object} counts - Object with counts of each answer type (A, B, C)
 * @returns {Promise<boolean>} - Whether the operation was successful
 */
export const saveTestResults = async (answers, personalityType, counts) => {
  try {
    const user = auth.currentUser;
    if (user) {
      const testResultRef = doc(db, 'personalityTests', user.uid);
      await setDoc(testResultRef, {
        userId: user.uid,
        answers: answers,
        personalityType: personalityType,
        counts: counts,
        completedAt: serverTimestamp(),
        testVersion: '1.0'
      });
      console.log('Test results saved successfully');
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error saving test results:', error);
    return false;
  }
};

/**
 * Retrieve personality test results for the current user
 * @returns {Promise<Object|null>} - The test results or null if not found/error
 */
export const getTestResults = async () => {
  try {
    const user = auth.currentUser;
    if (user) {
      const testResultRef = doc(db, 'personalityTests', user.uid);
      const testResultDoc = await getDoc(testResultRef);
      
      if (testResultDoc.exists()) {
        return testResultDoc.data();
      } else {
        console.log('No test results found for this user');
        return null;
      }
    }
    return null;
  } catch (error) {
    console.error('Error retrieving test results:', error);
    return null;
  }
};

/**
 * Update existing test results or create new ones if they don't exist
 * @param {Object} newData - The updated test data
 * @returns {Promise<boolean>} - Whether the operation was successful
 */
export const updateTestResults = async (newData) => {
  try {
    const user = auth.currentUser;
    if (user) {
      const testResultRef = doc(db, 'personalityTests', user.uid);
      const testResultDoc = await getDoc(testResultRef);
      
      if (testResultDoc.exists()) {
        // Update existing document
        await updateDoc(testResultRef, {
          ...newData,
          updatedAt: serverTimestamp()
        });
      } else {
        // Create new document
        await setDoc(testResultRef, {
          userId: user.uid,
          ...newData,
          completedAt: serverTimestamp(),
          testVersion: '1.0'
        });
      }
      console.log('Test results updated successfully');
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error updating test results:', error);
    return false;
  }
};

/**
 * Check if the user has already taken the personality test
 * @returns {Promise<boolean>} - Whether the user has taken the test
 */
export const hasUserTakenTest = async () => {
  try {
    const results = await getTestResults();
    return results !== null;
  } catch (error) {
    console.error('Error checking if user has taken test:', error);
    return false;
  }
};

/**
 * Get statistics on personality types across all users
 * This is an admin function and should be properly secured
 * @returns {Promise<Object|null>} - Statistics about personality types
 */
export const getPersonalityTypeStats = async () => {
  try {
    // Check if current user has admin privileges (implement your own check)
    const isAdmin = false; // Replace with your admin check
    
    if (!isAdmin) {
      console.log('Unauthorized access to personality type stats');
      return null;
    }
    
    const stats = {
      introvert: 0,
      extrovert: 0,
      ambivert: 0,
      total: 0
    };
    
    const testsRef = collection(db, 'personalityTests');
    const testsSnapshot = await getDocs(testsRef);
    
    testsSnapshot.forEach(doc => {
      const data = doc.data();
      stats.total++;
      
      if (data.personalityType === 'Introvert') {
        stats.introvert++;
      } else if (data.personalityType === 'Extrovert') {
        stats.extrovert++;
      } else if (data.personalityType === 'Ambivert') {
        stats.ambivert++;
      }
    });
    
    return stats;
  } catch (error) {
    console.error('Error getting personality type stats:', error);
    return null;
  }
};

export default {
  saveTestResults,
  getTestResults,
  updateTestResults,
  hasUserTakenTest,
  getPersonalityTypeStats
};