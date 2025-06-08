// Session.jsx - Updated with multi-language support
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Image,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
  Animated
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { chatStyles as styles } from '../../../styles/chat/chatStyles';
import { 
  doc, 
  collection, 
  onSnapshot, 
  serverTimestamp,
  getDoc
} from 'firebase/firestore';

import { auth, db } from '../../../config/firebase';
import { LinearGradient } from 'expo-linear-gradient';

import { sendMessageToDeepSeek } from '../../../services/deepseek-ai-service';
import { sessionService, messageService } from '../../../services/firebase-service';
import { useLanguage } from '../../context/LanguageContext';

// Helper function to ensure LinearGradient doesn't cause Android errors
const getSafeGradientProps = (colors, start = { x: 0, y: 0 }, end = { x: 1, y: 0 }) => {
  // Ensure we have at least 2 colors
  let safeColors;
  if (!colors) {
    safeColors = ['#03174C', '#03174C'];
  } else if (!Array.isArray(colors)) {
    safeColors = [colors, colors];
  } else if (colors.length === 0) {
    safeColors = ['#03174C', '#03174C'];
  } else if (colors.length === 1) {
    safeColors = [colors[0], colors[0]];
  } else {
    safeColors = colors;
  }
  
  // Ensure start and end positions are different
  let safeEnd = { ...end };
  if (start.x === end.x && start.y === end.y) {
    safeEnd = { x: end.x + 0.01, y: end.y + 0.01 };
  }
  
  return {
    colors: safeColors,
    start,
    end: safeEnd
  };
};

const Session = ({ navigation, route }) => {
  const { t } = useLanguage(); // Add language hook
  
  const [message, setMessage] = useState('');
  const [chatBackground, setChatBackground] = useState(['#03174C', '#03174C']);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [sessionTitle, setSessionTitle] = useState(t('chat.therapySession'));
  const [initialMessageSent, setInitialMessageSent] = useState(false);
  const scrollViewRef = useRef();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateYAnim = useRef(new Animated.Value(50)).current;

  // Create a new session or load existing one
  useEffect(() => {
    const user = auth.currentUser;
    if (!user) {
      Alert.alert(t('chat.authenticationError'), t('chat.authenticationErrorMessage'));
      navigation.goBack();
      return;
    }

    const setupSession = async () => {
      try {
        // Check if we're loading an existing session
        if (route.params?.sessionId) {
          setSessionId(route.params.sessionId);
          
          // Load session details
          const sessionData = await sessionService.getSession(route.params.sessionId);
          if (sessionData?.title) {
            setSessionTitle(sessionData.title);
          }
          
          return;
        }

        // Create a new session
        const newSessionId = await sessionService.createSession();
        setSessionId(newSessionId);
      } catch (error) {
        console.error("Error setting up session:", error);
        Alert.alert(t('chat.sessionError'), t('chat.sessionErrorMessage'));
      }
    };

    setupSession();
  }, [route.params, t]);

  // Load background preferences
  useEffect(() => {
    const fetchChatBackground = () => {
      const user = auth.currentUser;
      if (!user) return;

      const userDocRef = doc(db, 'users', user.uid);

      // Listen for real-time changes
      const unsubscribe = onSnapshot(userDocRef, (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data.chatBackground) {
            const safeProps = getSafeGradientProps(
              data.chatBackground.colors || data.chatBackground
            );
            setChatBackground(safeProps.colors);
          } else {
            setChatBackground(['#03174C', '#03174C']);
          }
        } else {
          setChatBackground(['#03174C', '#03174C']);
        }
      });
  
      return () => unsubscribe();
    };

    fetchChatBackground();
    
    // Start entrance animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(translateYAnim, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  // Subscribe to messages for the current session
  useEffect(() => {
    if (!sessionId) return;

    const unsubscribe = messageService.subscribeMessages(sessionId, (loadedMessages) => {
      setMessages(loadedMessages);
    });

    return () => unsubscribe();
  }, [sessionId]);

  // Process initial message from search bar if it exists
  useEffect(() => {
    const processInitialMessage = async () => {
      if (
        sessionId && 
        route.params?.initialMessage && 
        !initialMessageSent &&
        messages.length === 0
      ) {
        setInitialMessageSent(true);
        const initialMsg = route.params.initialMessage;
        await handleSendMessage(initialMsg);
      }
    };

    processInitialMessage();
  }, [sessionId, messages, route.params?.initialMessage, initialMessageSent]);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollViewRef.current && messages.length > 0) {
      setTimeout(() => {
        scrollViewRef.current.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  const animateNewMessage = (callback) => {
    // Animation for typing indicator or new message
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 0.8,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(callback);
  };

  const handleSendMessage = async (textToSend) => {
    if (!textToSend.trim() || loading || !sessionId) return;
    
    setLoading(true);
    const userMessage = textToSend.trim();
    
    try {
      // Save user message to Firestore
      await messageService.addMessage(sessionId, userMessage, true);
      
      // Animate the AI typing indicator
      animateNewMessage();
      
      // Get AI response from DeepSeek
      const aiResponse = await sendMessageToDeepSeek([
        ...messages,
        { text: userMessage, isUser: true }
      ]);
      
      // Save AI response to Firestore
      await messageService.addMessage(sessionId, aiResponse, false);
      
      // Update session title if this is the first exchange
      if (messages.length <= 1 && sessionTitle === t('chat.therapySession')) {
        const newTitle = userMessage.length > 30 
          ? userMessage.substring(0, 27) + '...' 
          : userMessage;
        
        await sessionService.updateSession(sessionId, { title: newTitle });
        setSessionTitle(newTitle);
      }
    } catch (error) {
      console.error("Error in chat flow:", error);
      Alert.alert(
        t('chat.communicationError'),
        t('chat.communicationErrorMessage')
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSend = () => {
    if (!message.trim() || loading) return;
    
    const userMessage = message.trim();
    setMessage('');
    handleSendMessage(userMessage);
  };

  const renderTypingIndicator = () => {
    if (!loading) return null;
    
    return (
      <Animated.View 
        style={[
          styles.message, 
          styles.botMessage, 
          { 
            padding: 16,
            opacity: fadeAnim
          }
        ]}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <ActivityIndicator size="small" color="#FFFFFF" style={{ marginRight: 8 }} />
          <Text style={[styles.messageText, { opacity: 0.8 }]}>{t('chat.typing')}</Text>
        </View>
      </Animated.View>
    );
  };

  const renderMessage = (msg, index) => {
    const isLast = index === messages.length - 1;
    return (
      <View
        key={msg.id}
        style={[
          styles.message,
          msg.isUser ? styles.userMessage : styles.botMessage,
          isLast && { marginBottom: loading ? 8 : 16 }
        ]}
      >
        <Text style={styles.messageText}>{msg.text}</Text>
      </View>
    );
  };

  // Get safe gradient props to prevent Android errors
  const gradientProps = getSafeGradientProps(chatBackground);

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={gradientProps.colors}
        start={gradientProps.start}
        end={gradientProps.end}
        style={styles.container}
      >
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="chevron-back" size={20} color="white" />
          </TouchableOpacity>

          <View style={styles.profileContainer}>
            <Image
              source={require('../../../assets/images/weChat.png')}
              style={styles.avatar}
            />
            <View style={styles.userInfo}>
              <Text style={styles.userName}>{t('chat.therapyAssistant')}</Text>
              <Text style={styles.userStatus}>{t('chat.mentalHealthSpecialist')}</Text>
            </View>
          </View>

          <View style={styles.headerIcons}>
          
          
          </View>
        </View>

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
        >
          <ScrollView
            ref={scrollViewRef}
            style={styles.chatContainer}
            contentContainerStyle={messages.length === 0 && !initialMessageSent ? { flex: 1, justifyContent: 'center', alignItems: 'center' } : {}}
            showsVerticalScrollIndicator={false}
          >
            {messages.length === 0 && !initialMessageSent ? (
              <Animated.View 
                style={[
                  styles.emptyChat,
                  {
                    opacity: fadeAnim,
                    transform: [{ translateY: translateYAnim }]
                  }
                ]}
              >
                <Ionicons name="chatbubble-ellipses-outline" size={60} color="rgba(255,255,255,0.3)" />
                <Text style={styles.emptyChatText}>{t('chat.emptyChatText')}</Text>
              </Animated.View>
            ) : (
              messages.map((msg, index) => renderMessage(msg, index))
            )}
            {renderTypingIndicator()}
          </ScrollView>

          <Animated.View 
            style={[
              styles.inputContainer,
              { 
                opacity: fadeAnim,
                transform: [{ translateY: translateYAnim }]
              }
            ]}
          >
            <View style={styles.inputWrapper}>
         

              <TextInput
                style={styles.input}
                value={message}
                onChangeText={setMessage}
                placeholder={t('chat.typeMessage')}
                placeholderTextColor="rgba(255, 255, 255, 0.5)"
                multiline
                maxHeight={120}
              />

            </View>

            <TouchableOpacity
              style={[
                styles.actionButtonRight,
                message.trim() && !loading ? styles.sendButtonActive : styles.sendButtonInactive,
              ]}
              onPress={handleSend}
              disabled={!message.trim() || loading}
              activeOpacity={0.75}
            >
              <Ionicons
                name="send"
                size={20}
                color="white"
                style={{ marginLeft: 2 }}
              />
            </TouchableOpacity>
          </Animated.View>
        </KeyboardAvoidingView>
      </LinearGradient>
    </SafeAreaView>
  );
};

export default Session;