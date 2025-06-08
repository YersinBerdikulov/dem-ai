// src/services/diaryService.js
import { db, auth } from '../config/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export const saveDiaryEntry = async (diaryData) => {
  try {
    const userId = auth.currentUser?.uid;
    if (!userId) throw new Error('User not authenticated');

    const diaryEntry = {
      ...diaryData,
      userId,
      createdAt: serverTimestamp(),
      date: new Date().toISOString()
    };

    const docRef = await addDoc(collection(db, 'diaryEntries'), diaryEntry);
    return docRef.id;
  } catch (error) {
    console.error('Error saving diary entry:', error);
    throw error;
  }
};