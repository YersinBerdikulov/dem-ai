import React, { useState, useEffect } from 'react';
import {
  View, 
  Text, 
  SafeAreaView, 
  Switch,
  TouchableOpacity,
  Alert,
  Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { auth, db } from '../../../config/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { notificationsStyles as styles } from '../../../styles/settings/notificationsStyles';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants';
import { useLanguage } from '../../context/LanguageContext';

// Configure how notifications appear when the app is in the foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

const NotificationsScreen = ({ navigation }) => {
  const { t } = useLanguage();
  const [isEnabled, setIsEnabled] = useState(false);
  const [expoPushToken, setExpoPushToken] = useState('');
  
  useEffect(() => {
    fetchUserNotificationSettings();
    
    // Register for push notifications when component mounts
    registerForPushNotificationsAsync().then(token => {
      setExpoPushToken(token);
      // Save token to user's document in Firestore
      if (token) {
        saveTokenToDatabase(token);
      }
    });

    // Set up notification listeners
    const notificationListener = Notifications.addNotificationReceivedListener(notification => {
      console.log('Notification received:', notification);
    });

    const responseListener = Notifications.addNotificationResponseReceivedListener(response => {
      console.log('Notification response received:', response);
      // Handle notification tap
      handleNotificationTap(response.notification.request.content);
    });

   
    return () => {
      Notifications.removeNotificationSubscription(notificationListener);
      Notifications.removeNotificationSubscription(responseListener);
    };
  }, []);

  const saveTokenToDatabase = async (token) => {
    try {
      const user = auth.currentUser;
      if (user) {
        await updateDoc(doc(db, 'users', user.uid), {
          expoPushToken: token,
          updatedAt: new Date().toISOString()
        });
      }
    } catch (error) {
      console.error('Error saving push token:', error);
    }
  };

  const handleNotificationTap = (content) => {
   
    if (content.data && content.data.screen) {
      navigation.navigate(content.data.screen, content.data.params);
    }
  };

  const fetchUserNotificationSettings = async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          const data = userDoc.data();
          setIsEnabled(data.notificationsEnabled || false);
        }
      }
    } catch (error) {
      console.error('Error fetching notification settings:', error);
    }
  };

  const toggleSwitch = async () => {
    try {
      const newState = !isEnabled;
      setIsEnabled(newState);
      
      const user = auth.currentUser;
      if (user) {
        await updateDoc(doc(db, 'users', user.uid), {
          notificationsEnabled: newState,
          updatedAt: new Date().toISOString()
        });

        if (newState) {
          // Schedule a test notification
          await scheduleDailyReminder();
          Alert.alert(
            t('notifications.notificationsEnabled'), 
            t('notifications.notificationsEnabledMessage')
          );
        } else {
          // Cancel all scheduled notifications
          await Notifications.cancelAllScheduledNotificationsAsync();
        }
      }
    } catch (error) {
      console.error('Error updating notification settings:', error);
      // Revert the state if the update fails
      setIsEnabled(!isEnabled);
    }
  };

  // Schedule a daily reminder notification
  const scheduleDailyReminder = async () => {
    // Cancel any existing notifications first
    await Notifications.cancelAllScheduledNotificationsAsync();
    
    // Schedule new notification
    await Notifications.scheduleNotificationAsync({
      content: {
        title: t('notifications.dailyReminderTitle'),
        body: t('notifications.dailyReminderBody'),
        data: { screen: 'Home' },
      },
      trigger: {
        hour: 9, // 9 AM
        minute: 0,
        repeats: true,
      },
    });

    // Schedule another notification for evening check-in
    await Notifications.scheduleNotificationAsync({
      content: {
        title: t('notifications.eveningReminderTitle'),
        body: t('notifications.eveningReminderBody'),
        data: { screen: 'Home' },
      },
      trigger: {
        hour: 18, // 6 PM
        minute: 0,
        repeats: true,
      },
    });
  };

  // Send an immediate test notification
  const sendTestNotification = async () => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: t('notifications.testNotificationTitle'),
        body: t('notifications.testNotificationBody'),
        data: { screen: 'Home' },
      },
      trigger: null, // Null trigger means send immediately
    });
  };

  const registerForPushNotificationsAsync = async () => {
    let token;
    
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }

    if (Device.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      
      if (finalStatus !== 'granted') {
        Alert.alert(
          t('notifications.permissionRequired'),
          t('notifications.permissionRequiredMessage')
        );
        return;
      }
      
      token = (await Notifications.getExpoPushTokenAsync({
        projectId: Constants.expoConfig?.extra?.eas?.projectId,
      })).data;
    } else {
      Alert.alert(t('notifications.physicalDeviceRequired'));
    }

    return token;
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.title}>{t('notifications.title')}</Text>
      </View>
      
      <View style={styles.content}>
        <Text style={styles.description}>
          {t('notifications.description')}
        </Text>
        
        <View style={styles.switchContainer}>
          <Text style={styles.switchLabel}>{t('notifications.turnOnNotifications')}</Text>
          <Switch
            trackColor={{ false: "#3e3e3e", true: "#4E66E3" }}
            thumbColor={isEnabled ? "#f4f3f4" : "#f4f3f4"}
            ios_backgroundColor="#3e3e3e"
            onValueChange={toggleSwitch}
            value={isEnabled}
            style={styles.switch}
          />
        </View>

        {isEnabled && (
          <View style={styles.notificationTypes}>
            <Text style={styles.sectionTitle}>{t('notifications.notificationSettings')}</Text>
            
            <View style={styles.notificationOption}>
              <View>
                <Text style={styles.optionTitle}>{t('notifications.dailyReminders')}</Text>
                <Text style={styles.optionDescription}>{t('notifications.dailyRemindersDesc')}</Text>
              </View>
              <Switch
                trackColor={{ false: "#3e3e3e", true: "#4E66E3" }}
                thumbColor={"#f4f3f4"}
                ios_backgroundColor="#3e3e3e"
                value={true}
                disabled={true}
              />
            </View>
            
            <View style={styles.notificationOption}>
              <View>
                <Text style={styles.optionTitle}>{t('notifications.eveningCheckIn')}</Text>
                <Text style={styles.optionDescription}>{t('notifications.eveningCheckInDesc')}</Text>
              </View>
              <Switch
                trackColor={{ false: "#3e3e3e", true: "#4E66E3" }}
                thumbColor={"#f4f3f4"}
                ios_backgroundColor="#3e3e3e"
                value={true}
                disabled={true}
              />
            </View>
            
            <TouchableOpacity 
              style={styles.testButton}
              onPress={sendTestNotification}
            >
              <Text style={styles.testButtonText}>{t('notifications.sendTestNotification')}</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

export default NotificationsScreen;