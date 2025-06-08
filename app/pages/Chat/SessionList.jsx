// SessionList.jsx - Updated with multi-language support
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { auth } from '../../../config/firebase';
import { LinearGradient } from 'expo-linear-gradient';
import { format } from 'date-fns';
import { sessionService, userService } from '../../../services/firebase-service';
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

const SessionList = ({ navigation }) => {
  const { t } = useLanguage(); // Add language hook
  
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [background, setBackground] = useState(['#03174C', '#03174C']);

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) {
      Alert.alert(t('sessionList.error'), t('chat.authenticationErrorMessage'));
      navigation.goBack();
      return;
    }

    // Load user background preferences
    const profileUnsubscribe = userService.subscribeProfile((profile) => {
      if (profile?.chatBackground) {
        const safeProps = getSafeGradientProps(
          profile.chatBackground.colors || profile.chatBackground
        );
        setBackground(safeProps.colors);
      } else {
        setBackground(['#03174C', '#03174C']);
      }
    });

    // Load user's chat sessions
    const sessionsUnsubscribe = sessionService.subscribeSessions((sessionList) => {
      setSessions(sessionList);
      setLoading(false);
    });

    return () => {
      profileUnsubscribe && profileUnsubscribe();
      sessionsUnsubscribe && sessionsUnsubscribe();
    };
  }, [t]);

  const handleCreateNewSession = () => {
    navigation.navigate('Session'); // This will create a new session
  };

  const handleSessionPress = (sessionId) => {
    navigation.navigate('Session', { sessionId });
  };

  const handleDeleteSession = async (sessionId) => {
    Alert.alert(
      t('sessionList.deleteSession'),
      t('sessionList.deleteConfirmation'),
      [
        {
          text: t('sessionList.cancel'),
          style: "cancel"
        },
        {
          text: t('sessionList.delete'),
          style: "destructive",
          onPress: async () => {
            try {
              setLoading(true);
              await sessionService.deleteSession(sessionId);
              // The sessions list will update automatically through the subscription
            } catch (error) {
              console.error("Error deleting session:", error);
              Alert.alert(t('sessionList.error'), t('sessionList.deleteError'));
            } finally {
              setLoading(false);
            }
          }
        }
      ]
    );
  };

  const renderSessionItem = ({ item }) => {
    const formattedDate = format(item.updatedAt, 'MMM d, yyyy • h:mm a');
    
    // Get the appropriate message count text
    const getMessageCountText = (count) => {
      if (count === 1) {
        return `1 ${t('sessionList.message')}`;
      } else {
        return `${count || 0} ${t('sessionList.messages')}`;
      }
    };
    
    return (
      <TouchableOpacity 
        style={styles.sessionItem}
        onPress={() => handleSessionPress(item.id)}
      >
        <View style={styles.sessionInfo}>
          <Text style={styles.sessionTitle}>
            {item.title || t('chat.therapySession')}
          </Text>
          <Text style={styles.sessionPreview} numberOfLines={1}>
            {item.lastMessage || t('sessionList.noMessagesYet')}
          </Text>
          <Text style={styles.sessionDate}>{formattedDate}</Text>
        </View>
        
        <View style={styles.sessionActions}>
          <Text style={styles.messageCount}>
            {getMessageCountText(item.messageCount)}
          </Text>
          <TouchableOpacity 
            style={styles.deleteButton}
            onPress={() => handleDeleteSession(item.id)}
          >
            <Ionicons name="trash-outline" size={20} color="rgba(255, 255, 255, 0.6)" />
          </TouchableOpacity>
          <Ionicons name="chevron-forward" size={20} color="rgba(255, 255, 255, 0.6)" />
        </View>
      </TouchableOpacity>
    );
  };

  // Get safe gradient props to prevent Android errors
  const gradientProps = getSafeGradientProps(background);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <LinearGradient
          colors={gradientProps.colors}
          start={gradientProps.start}
          end={gradientProps.end}
          style={styles.container}
        >
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#FFFFFF" />
          </View>
        </LinearGradient>
      </SafeAreaView>
    );
  }

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
            <Ionicons name="chevron-back" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{t('sessionList.title')}</Text>
          <View style={{ width: 40 }} />
        </View>

        <FlatList
          data={sessions}
          renderItem={renderSessionItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="chatbubbles-outline" size={60} color="rgba(255, 255, 255, 0.6)" />
              <Text style={styles.emptyTitle}>{t('sessionList.noSessions')}</Text>
              <Text style={styles.emptyText}>
                {t('sessionList.noSessionsText')}
              </Text>
            </View>
          }
        />

        <TouchableOpacity 
          style={styles.newSessionButton}
          onPress={handleCreateNewSession}
        >
          <Ionicons name="add" size={24} color="white" />
          <Text style={styles.newSessionText}>{t('sessionList.newSession')}</Text>
        </TouchableOpacity>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    textAlign: 'center',
  },
  listContainer: {
    padding: 16,
    paddingBottom: 90,
  },
  sessionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  sessionInfo: {
    flex: 1,
    marginRight: 12,
  },
  sessionTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    marginBottom: 4,
  },
  sessionPreview: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    marginBottom: 4,
  },
  sessionDate: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
  },
  sessionActions: {
    alignItems: 'flex-end',
  },
  messageCount: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    marginBottom: 8,
  },
  deleteButton: {
    marginBottom: 8,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    textAlign: 'center',
  },
  newSessionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1877F2',
    borderRadius: 24,
    margin: 16,
    padding: 14,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  newSessionText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    marginLeft: 8,
  },
});

export default SessionList;