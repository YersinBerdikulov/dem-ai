import { 
    collection,
    addDoc,
    query,
    where,
    orderBy,
    onSnapshot,
    doc,
    updateDoc,
    arrayUnion
  } from 'firebase/firestore';
  import { db } from '../config/firebase';
  
  export const startNewChat = async (userId, initialMessage) => {
    try {
      // Create a new chat document
      const chatRef = await addDoc(collection(db, 'chats'), {
        userId,
        messages: [{
          text: initialMessage,
          timestamp: new Date().toISOString(),
          senderId: userId
        }],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
  
      // Update user's chats array
      await updateDoc(doc(db, 'users', userId), {
        chats: arrayUnion(chatRef.id)
      });
  
      return chatRef.id;
    } catch (error) {
      throw error;
    }
  };
  
  export const sendMessage = async (chatId, userId, message) => {
    try {
      const chatRef = doc(db, 'chats', chatId);
      await updateDoc(chatRef, {
        messages: arrayUnion({
          text: message,
          timestamp: new Date().toISOString(),
          senderId: userId
        }),
        updatedAt: new Date().toISOString()
      });
    } catch (error) {
      throw error;
    }
  };
  
  export const subscribeToChat = (chatId, callback) => {
    const chatRef = doc(db, 'chats', chatId);
    return onSnapshot(chatRef, (doc) => {
      if (doc.exists()) {
        callback(doc.data());
      }
    });
  };
  
  export const getUserChats = (userId, callback) => {
    const chatsQuery = query(
      collection(db, 'chats'),
      where('userId', '==', userId),
      orderBy('updatedAt', 'desc')
    );
  
    return onSnapshot(chatsQuery, (snapshot) => {
      const chats = [];
      snapshot.forEach((doc) => {
        chats.push({ id: doc.id, ...doc.data() });
      });
      callback(chats);
    });
  };