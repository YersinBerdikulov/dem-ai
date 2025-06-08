import { 
    doc, 
    collection, 
    addDoc,
    setDoc, 
    getDoc, 
    getDocs,
    query,
    where,
    orderBy,
    serverTimestamp,
    deleteDoc,
    onSnapshot,
    updateDoc
  } from 'firebase/firestore';
  import { auth, db } from '../config/firebase';
  
  /*
  Firestore Collections Structure:
  
  users/
    {userId}/
      profile: {
        name: string,
        email: string,
        chatBackground: string | {colors: string[]},
        createdAt: timestamp
      }
      
      chatSessions/
        {sessionId}/
          title: string,
          createdAt: timestamp,
          updatedAt: timestamp,
          lastMessage: string,
          messageCount: number
          
          messages/
            {messageId}/
              text: string,
              isUser: boolean,
              timestamp: timestamp
  */
  
  // Session-related operations
  export const sessionService = {
    createSession: async (title = "New therapy session") => {
      const user = auth.currentUser;
      if (!user) throw new Error("User not authenticated");
  
      try {
        const sessionRef = await addDoc(collection(db, 'users', user.uid, 'chatSessions'), {
          title,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          messageCount: 0,
          lastMessage: ""
        });
        
        return sessionRef.id;
      } catch (error) {
        console.error("Error creating session:", error);
        throw error;
      }
    },
    // Get a session by ID
    getSession: async (sessionId) => {
      const user = auth.currentUser;
      if (!user) throw new Error("User not authenticated");
      try {
        const sessionDoc = await getDoc(doc(db, 'users', user.uid, 'chatSessions', sessionId));
        if (!sessionDoc.exists()) {
          throw new Error("Session not found");
        }
        return {
          id: sessionDoc.id,
          ...sessionDoc.data(),
          createdAt: sessionDoc.data().createdAt?.toDate() || new Date(),
          updatedAt: sessionDoc.data().updatedAt?.toDate() || new Date()
        };
      } catch (error) {
        console.error("Error getting session:", error);
        throw error;
      }
    },
    
    // Update session details
    updateSession: async (sessionId, data) => {
      const user = auth.currentUser;
      if (!user) throw new Error("User not authenticated");
      
      try {
        await updateDoc(
          doc(db, 'users', user.uid, 'chatSessions', sessionId), 
          {
            ...data,
            updatedAt: serverTimestamp()
          }
        );
      } catch (error) {
        console.error("Error updating session:", error);
        throw error;
      }
    },
    
    // Delete a session
    deleteSession: async (sessionId) => {
      const user = auth.currentUser;
      if (!user) throw new Error("User not authenticated");
      
      try {
        // First delete all messages in the session
        const messagesRef = collection(db, 'users', user.uid, 'chatSessions', sessionId, 'messages');
        const messagesSnapshot = await getDocs(messagesRef);
        
        const deletePromises = messagesSnapshot.docs.map(doc => 
          deleteDoc(doc.ref)
        );
        
        await Promise.all(deletePromises);
        
        // Then delete the session document
        await deleteDoc(doc(db, 'users', user.uid, 'chatSessions', sessionId));
      } catch (error) {
        console.error("Error deleting session:", error);
        throw error;
      }
    },
    
    // Set up real-time listener for sessions
    subscribeSessions: (callback) => {
      const user = auth.currentUser;
      if (!user) return () => {};
      
      const sessionsRef = collection(db, 'users', user.uid, 'chatSessions');
      const sessionsQuery = query(sessionsRef, orderBy('updatedAt', 'desc'));
      
      return onSnapshot(sessionsQuery, (snapshot) => {
        const sessions = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate() || new Date(),
          updatedAt: doc.data().updatedAt?.toDate() || new Date()
        }));
        
        callback(sessions);
      });
    }
  };
  
  // Message-related operations
  export const messageService = {
    // Add a message to a session
    addMessage: async (sessionId, text, isUser) => {
      const user = auth.currentUser;
      if (!user || !sessionId) throw new Error("User not authenticated or session ID missing");
      
      try {
        // Add the message
        const messageRef = await addDoc(
          collection(db, 'users', user.uid, 'chatSessions', sessionId, 'messages'),
          {
            text,
            isUser,
            timestamp: serverTimestamp()
          }
        );
        
        // Get current message count
        const messagesRef = collection(db, 'users', user.uid, 'chatSessions', sessionId, 'messages');
        const messagesSnapshot = await getDocs(messagesRef);
        const messageCount = messagesSnapshot.size;
        
        // Update session metadata
        await sessionService.updateSession(sessionId, {
          lastMessage: text.substring(0, 50) + (text.length > 50 ? "..." : ""),
          messageCount: messageCount
        });
        
        return messageRef.id;
      } catch (error) {
        console.error("Error adding message:", error);
        throw error;
      }
    },
    
    // Get all messages for a session
    getMessages: async (sessionId) => {
      const user = auth.currentUser;
      if (!user) throw new Error("User not authenticated");
      
      try {
        const messagesRef = collection(db, 'users', user.uid, 'chatSessions', sessionId, 'messages');
        const messagesQuery = query(messagesRef, orderBy('timestamp', 'asc'));
        const messagesSnapshot = await getDocs(messagesQuery);
        
        return messagesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          timestamp: doc.data().timestamp?.toDate() || new Date()
        }));
      } catch (error) {
        console.error("Error getting messages:", error);
        throw error;
      }
    },
    
    // Subscribe to messages for a session
    subscribeMessages: (sessionId, callback) => {
      const user = auth.currentUser;
      if (!user) return () => {};
      
      const messagesRef = collection(db, 'users', user.uid, 'chatSessions', sessionId, 'messages');
      const messagesQuery = query(messagesRef, orderBy('timestamp', 'asc'));
      
      return onSnapshot(messagesQuery, (snapshot) => {
        const messages = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          timestamp: doc.data().timestamp?.toDate() || new Date()
        }));
        
        callback(messages);
      });
    }
  };
  
  // User profile operations
  export const userService = {
    // Get user profile
    getProfile: async () => {
      const user = auth.currentUser;
      if (!user) throw new Error("User not authenticated");
      
      try {
        const profileDoc = await getDoc(doc(db, 'users', user.uid));
        if (!profileDoc.exists()) {
          return null;
        }
        
        return profileDoc.data();
      } catch (error) {
        console.error("Error getting user profile:", error);
        throw error;
      }
    },
    
    // Create or update user profile
    updateProfile: async (profileData) => {
      const user = auth.currentUser;
      if (!user) throw new Error("User not authenticated");
      
      try {
        await setDoc(
          doc(db, 'users', user.uid), 
          {
            ...profileData,
            updatedAt: serverTimestamp()
          }, 
          { merge: true }
        );
      } catch (error) {
        console.error("Error updating user profile:", error);
        throw error;
      }
    },
    
    // Subscribe to user profile changes
    subscribeProfile: (callback) => {
      const user = auth.currentUser;
      if (!user) return () => {};
      
      return onSnapshot(doc(db, 'users', user.uid), (doc) => {
        if (doc.exists()) {
          callback(doc.data());
        } else {
          callback(null);
        }
      });
    }
  };
  
  // Export all services individually
  export default {
    sessionService,
    messageService,
    userService
  };