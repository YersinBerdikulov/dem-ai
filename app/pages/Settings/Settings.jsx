// Settings.jsx - Updated with multi-language support
import React, { useState, useEffect } from 'react';
import {
  View, Text, SafeAreaView, TouchableOpacity, ScrollView, Image, 
  Alert, ActivityIndicator, Modal, StatusBar
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import { auth, db } from '../../../config/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { settingsStyles as styles } from '../../../styles/settings/settingsStyles';
import { useTheme } from '@react-navigation/native';
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

const Settings = ({ navigation }) => {
  const [theme, setTheme] = useState('light');
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState({
    fullName: '',
    email: '',
    avatarUrl: null,
    isAdmin: false
  });
  const [selectedGradient, setSelectedGradient] = useState(4);
  const [achievements, setAchievements] = useState([]);
  const { setChatBackground } = useTheme();
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);
  
  // Language state and hooks
  const { t, currentLanguage, changeLanguage, availableLanguages } = useLanguage();
  const [languageModalVisible, setLanguageModalVisible] = useState(false);

  const gradients = [
    { id: 0, colors: ['#52E5E7', '#130CB7'], name: 'Ocean' },
    { id: 1, colors: ['#3B31D2', '#839CE9'], name: 'Sky' },
    { id: 2, colors: ['#FAB2FF', '#1904E5'], name: 'Violet' },
    { id: 3, colors: ['#F1CA74', '#A64DB6'], name: 'Sunset' },
    { id: 4, colors: ['#03174C', '#03174C'], name: 'Default' }
  ];
  
  useEffect(() => {
    fetchUserData();
    fetchUserAchievements();
  }, []);

  const fetchUserData = async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          const data = userDoc.data();
          
          console.log("User data:", data);
          
          // Check if user is admin
          const isUserAdmin = data.isAdmin === true || 
                             user.email.toLowerCase() === 'mobilelegendsakk1@gmail.com';
          
          // If user has admin email but isAdmin flag is not set, update it
          if (user.email.toLowerCase() === 'mobilelegendsakk1@gmail.com' && !data.isAdmin) {
            await updateDoc(doc(db, 'users', user.uid), {
              isAdmin: true,
              updatedAt: new Date().toISOString()
            });
          }
          
          setUserData({
            fullName: data.fullName || user.email?.split('@')[0] || 'User',
            email: data.email || user.email,
            avatarUrl: data.avatar || null,
            isAdmin: isUserAdmin
          });
          
          console.log("Is admin:", isUserAdmin);
          
          // Load saved language preference and update context
          if (data.language) {
            changeLanguage(data.language);
          }
          
          // Check the user's saved chat background and set it correctly
          if (data.chatBackground) {
            const index = gradients.findIndex(g => {
              if (!data.chatBackground.colors || !Array.isArray(data.chatBackground.colors)) {
                return false;
              }
              
              const backgroundColors = getSafeGradientProps(data.chatBackground.colors).colors;
              const gradientColors = getSafeGradientProps(g.colors).colors;
              
              return JSON.stringify(backgroundColors) === JSON.stringify(gradientColors);
            });
            
            setSelectedGradient(index !== -1 ? index : 4);
          }
        }
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      Alert.alert(t('common.error'), 'Failed to load user data');
    }
  };

  // Fetch user achievements or get default achievements
  const fetchUserAchievements = async () => {
    try {
      const user = auth.currentUser;
      if (!user) return;

      const defaultAchievements = getDefaultAchievements();
      
      const userRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userRef);
      
      if (userDoc.exists()) {
        const userData = userDoc.data();
        const userAchievements = userData.achievements || [];
        
        if (userAchievements.length > 0) {
          const userAchievementsMap = {};
          userAchievements.forEach(achievement => {
            userAchievementsMap[achievement.id] = achievement;
          });
          
          const mergedAchievements = defaultAchievements.map(defaultAchievement => {
            const userAchievement = userAchievementsMap[defaultAchievement.id];
            if (userAchievement) {
              return {
                ...defaultAchievement,
                progress: userAchievement.progress || 0,
                completed: userAchievement.completed || false
              };
            }
            return defaultAchievement;
          });
          
          setAchievements(mergedAchievements);
        } else {
          setAchievements(defaultAchievements);
        }
      } else {
        setAchievements(getDefaultAchievements());
      }
    } catch (error) {
      console.error('Error fetching user achievements:', error);
      setAchievements(getDefaultAchievements());
    }
  };

  // Default achievements for new users
  const getDefaultAchievements = () => {
    return [
      { 
        id: 'diary1', 
        title: 'First Diary Entry', 
        icon: 'book', 
        color: '#4CAF50', 
        progress: 0,
        completed: false,
        type: 'badge'
      },
      { 
        id: 'breathing1', 
        title: 'First Breathing Session', 
        icon: 'medkit', 
        color: '#2196F3', 
        progress: 0,
        completed: false,
        type: 'badge'
      },
      { 
        id: 'test1', 
        title: 'First Test Completed', 
        icon: 'clipboard', 
        color: '#FF9800', 
        progress: 0,
        completed: false,
        type: 'badge'
      },
      { 
        id: 'game1', 
        title: 'Game Master', 
        icon: 'game-controller', 
        color: '#673AB7', 
        progress: 0,
        completed: false,
        type: 'badge'
      },
      { 
        id: 'habit1', 
        title: 'First Habit Created', 
        icon: 'calendar', 
        color: '#009688', 
        progress: 0,
        completed: false,
        type: 'badge'
      },
      { 
        id: 'diary7', 
        title: 'Diary 7 Days Streak', 
        icon: 'book', 
        color: '#4CAF50', 
        progress: 0,
        completed: false,
        type: 'badge'
      },
      { 
        id: 'diary30', 
        title: 'Diary 30 Days Streak', 
        icon: 'book', 
        color: '#4CAF50', 
        progress: 0,
        completed: false,
        type: 'badge'
      },
      { 
        id: 'test4', 
        title: 'Complete 4 Tests', 
        icon: 'clipboard', 
        color: '#FF9800', 
        progress: 0,
        completed: false,
        type: 'badge'
      },
      { 
        id: 'affirmation1', 
        title: 'First Affirmation', 
        icon: 'heart', 
        color: '#E91E63', 
        progress: 0,
        completed: false,
        type: 'badge'
      },
      { 
        id: 'game2', 
        title: 'Try All Games', 
        icon: 'game-controller', 
        color: '#673AB7', 
        progress: 0,
        completed: false,
        type: 'badge'
      }
    ];
  };

  const handleGradientSelect = async (gradient) => {
    try {
      setSelectedGradient(gradient.id);
      const user = auth.currentUser;
      if (user) {
        const safeProps = getSafeGradientProps(gradient.colors);
        
        const backgroundData = {
          colors: safeProps.colors,
          start: safeProps.start,
          end: safeProps.end
        };
  
        await updateDoc(doc(db, 'users', user.uid), {
          chatBackground: backgroundData
        });
  
        navigation.setParams({ chatBackground: safeProps.colors });
      }
    } catch (error) {
      console.error('Error updating chat background:', error);
    }
  };

  const pickImage = async () => {
    if (loading) return;

    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Please grant permission to access your photos');
        return;
      }

      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.2,
        base64: true,
      });
      
      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        if (asset.base64) {
          await uploadImage(`data:image/jpeg;base64,${asset.base64}`);
        } else {
          await uploadImage(asset.uri);
        }
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert(t('common.error'), 'Failed to select image');
    }
  };

  const uploadImage = async (uri) => {
    if (!uri) {
      Alert.alert(t('common.error'), 'No image selected');
      return;
    }

    try {
      setLoading(true);
      const user = auth.currentUser;
      if (!user) throw new Error('No user logged in');

      let base64 = uri;
      if (!uri.startsWith('data:image')) {
        const response = await fetch(uri);
        const blob = await response.blob();
        base64 = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.readAsDataURL(blob);
        });
      }

      await updateDoc(doc(db, 'users', user.uid), {
        avatar: base64,
        updatedAt: new Date().toISOString()
      });

      setUserData(prev => ({
        ...prev,
        avatarUrl: base64
      }));

      Alert.alert(t('common.success'), 'Profile picture updated successfully');
    } catch (error) {
      console.error('Error uploading image:', error);
      Alert.alert(t('common.error'), 'Failed to upload image');
    } finally {
      setLoading(false);
    }
  };

  // Function to handle logout
  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    } catch (error) {
      console.error('Error signing out:', error);
      Alert.alert(t('common.error'), 'Failed to sign out. Please try again.');
    } finally {
      setLogoutModalVisible(false);
    }
  };

  // Function to select a language and save it to the user's profile
  const selectLanguage = async (languageCode) => {
    try {
      setLanguageModalVisible(false);
      
      // Change language in context
      await changeLanguage(languageCode);
      
      // Save to Firebase
      const user = auth.currentUser;
      if (user) {
        await updateDoc(doc(db, 'users', user.uid), {
          language: languageCode,
          updatedAt: new Date().toISOString()
        });
        
        Alert.alert(t('common.success'), t('settings.languageUpdated'));
      }
    } catch (error) {
      console.error('Error updating language:', error);
      Alert.alert(t('common.error'), 'Failed to update language');
    }
  };

  const renderRadioButton = (isSelected) => (
    <View style={styles.radioButton}>
      {isSelected && <View style={styles.radioButtonSelected} />}
    </View>
  );
  
  // Get the appropriate icon based on the achievement type and position
  const getAchievementIcon = (iconType, index) => {
    if (index === 0) {
      return <Image source={require('../../../assets/icons/daily.png')} style={styles.medalIcon} />;
    } else if (index === 1) {
      return <Image source={require('../../../assets/icons/medal-breath.png')} style={styles.medalIcon} />;
    } else if (index === 2) {
      return <Image source={require('../../../assets/icons/medal-test.png')} style={styles.medalIcon} />;
    } else if (index === 3) {
      return <Image source={require('../../../assets/icons/game-medal.png')} style={styles.medalIcon} />;
    }
    
    switch(iconType) {
      case 'book':
        return <Image source={require('../../../assets/icons/daily.png')} style={styles.medalIcon} />;
      case 'medkit':
        return <Image source={require('../../../assets/icons/medal-breath.png')} style={styles.medalIcon} />;
      case 'clipboard':
        return <Image source={require('../../../assets/icons/medal-test.png')} style={styles.medalIcon} />;
      case 'game-controller':
        return <Image source={require('../../../assets/icons/game-medal.png')} style={styles.medalIcon} />;
      case 'calendar':
        return <Image source={require('../../../assets/icons/medal-1.png')} style={styles.medalIcon} />;
      case 'heart':
        return <Image source={require('../../../assets/icons/medal-heart.png')} style={styles.medalIcon} />;
      case 'trophy':
        return <Image source={require('../../../assets/icons/medal-1.png')} style={styles.medalIcon} />;
      default:
        return <Image source={require('../../../assets/icons/medal-heart.png')} style={styles.medalIcon} />;
    }
  };

  // Navigate to Sobriety Clocks screen
  const navigateToSobrietyClocks = () => {
    navigation.navigate('SobrietyClocks');
  };

  // Navigate to Admin Panel
  const navigateToAdminPanel = () => {
    navigation.navigate('Admin');
  };

  // Sort achievements by completion status
  const sortedAchievements = [...achievements].sort((a, b) => {
    if (a.completed && !b.completed) return -1;
    if (!a.completed && b.completed) return 1;
    return b.progress - a.progress;
  });
  
  // Calculate remaining achievements for the +X badge
  const remainingAchievements = sortedAchievements.length - 4 > 0 ? sortedAchievements.length - 4 : 0;

  // Get the currently selected language name for display
  const getSelectedLanguageName = () => {
    const selectedLang = availableLanguages.find(lang => lang.code === currentLanguage);
    return selectedLang ? selectedLang.nativeName : 'English';
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <StatusBar barStyle="light-content" backgroundColor="#03174C" />
        <Text style={styles.title}>{t('settings.title')}</Text>

        {/* Enhanced Profile Card */}
        <TouchableOpacity 
          style={styles.profileCard}
          onPress={() => setLogoutModalVisible(true)}
          activeOpacity={0.9}
        >
          <View style={styles.profileCardContent}>
            {/* Avatar container */}
            <TouchableOpacity 
              style={styles.avatarContainer}
              onPress={(e) => {
                e.stopPropagation();
                pickImage();
              }}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="white" size="small" />
              ) : (
                <>
                  {userData.avatarUrl ? (
                    <Image
                      source={{ uri: userData.avatarUrl }}
                      style={styles.avatar}
                      resizeMode="cover"
                    />
                  ) : (
                    <View style={styles.avatarPlaceholder}>
                      <Ionicons name="person" size={30} color="#fff" />
                    </View>
                  )}
                  <View style={styles.onlineIndicator} />
                  <View style={styles.editIconContainer}>
                    <Ionicons name="pencil" size={12} color="white" />
                  </View>
                </>
              )}
            </TouchableOpacity>

            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>{userData.fullName}</Text>
              <Text style={styles.profileEmail}>{userData.email}</Text>
              {userData.isAdmin && (
                <View style={styles.adminBadgeContainer}>
                  <Text style={styles.adminBadge}>{t('settings.admin')}</Text>
                </View>
              )}
            </View>
            <Ionicons name="chevron-forward" size={24} color="white" />
          </View>
        </TouchableOpacity>

        {/* Achievements Section */}
        <View style={styles.achievementSection}>
          <View style={styles.achievementHeader}>
            <Text style={styles.sectionTitle}>{t('settings.achievements')}</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Achievements')}>
              <Text style={styles.seeAllText}>{t('settings.seeAll')}</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.achievementScrollContent}
          >
            {sortedAchievements.slice(0, 4).map((achievement, index) => (
              <View key={achievement.id || index} style={styles.achievementItem}>
                <View 
                  style={[
                    styles.achievementCircle, 
                    { borderColor: achievement.color },
                    !achievement.completed && styles.achievementCircleIncomplete
                  ]}
                >
                  {getAchievementIcon(achievement.icon, index)}
                </View>
                <View 
                  style={[
                    styles.achievementCount,
                    !achievement.completed && styles.achievementCountIncomplete
                  ]}
                >
                  <Text style={styles.achievementCountText}>{index + 1}</Text>
                </View>
              </View>
            ))}
            
            {remainingAchievements > 0 && (
              <View style={styles.achievementItem}>
                <View style={[styles.achievementCircle, styles.remainingCircle]}>
                  <Text style={styles.remainingText}>+{remainingAchievements}</Text>
                </View>
              </View>
            )}
          </ScrollView>
        </View>

        {/* Sobriety Clocks Section */}
        <View style={styles.sobrietySection}>
          <View style={styles.sobrietyHeader}>
            <Text style={styles.sectionTitle}>{t('settings.sobrietyClocks')}</Text>
            <TouchableOpacity onPress={navigateToSobrietyClocks}>
              <Text style={styles.seeAllText}>{t('settings.seeAll')}</Text>
            </TouchableOpacity>
          </View>
          
          <TouchableOpacity onPress={navigateToSobrietyClocks}>
            <View style={styles.sobrietyCard}>
              <LinearGradient
                {...getSafeGradientProps(['#2DC2BD', '#14707E'], { x: 0, y: 0 }, { x: 1, y: 1 })}
                style={styles.sobrietyIconContainer}
              >
                <Image source={require('../../../assets/icons/clock.png')} style={styles.sobrietyIcon} />
              </LinearGradient>
              
              <View style={styles.sobrietyInfo}>
                <Text style={styles.sobrietyTitle}>{t('settings.sobrietyClocks')}</Text>
                <Text style={styles.sobrietySubtitle}>{t('settings.yourBestStreak')}</Text>
              </View>
              
              <Ionicons name="chevron-forward" size={24} style={styles.chevron} />
            </View>
          </TouchableOpacity>
        </View>

        {/* Admin Panel Section - Only shown for admins */}
        {userData.isAdmin && (
          <>
            <Text style={styles.sectionTitle}>{t('settings.adminPanel')}</Text>
            <TouchableOpacity 
              style={styles.menuItem}
              onPress={navigateToAdminPanel}
            >
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Ionicons name="shield-checkmark" size={24} color="#8E2DE2" style={{marginRight: 10}} />
                <Text style={styles.menuText}>{t('settings.adminDashboard')}</Text>
              </View>
              <Ionicons name="chevron-forward" size={24} style={styles.chevron} />
            </TouchableOpacity>
          </>
        )}

        {/* Language Section */}
        <Text style={styles.sectionTitle}>{t('settings.language')}</Text>
        <TouchableOpacity 
          style={styles.menuItem}
          onPress={() => setLanguageModalVisible(true)}
        >
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Ionicons name="language" size={24} color="#4A90E2" style={{marginRight: 10}} />
            <Text style={styles.menuText}>{getSelectedLanguageName()}</Text>
          </View>
          <Ionicons name="chevron-forward" size={24} style={styles.chevron} />
        </TouchableOpacity>

        <Text style={styles.sectionTitle}>{t('settings.chatBackground')}</Text>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.gradientScroll}
          contentContainerStyle={styles.gradientContent}
        >
          {gradients.map((gradient) => {
            const gradientProps = getSafeGradientProps(gradient.colors);
            
            return (
              <TouchableOpacity
                key={gradient.id}
                onPress={() => handleGradientSelect(gradient)}
                style={styles.gradientWrapper}
              >
                <LinearGradient
                  colors={gradientProps.colors}
                  start={gradientProps.start}
                  end={gradientProps.end}
                  style={[
                    styles.gradientOption,
                    selectedGradient === gradient.id && styles.selectedGradient
                  ]}
                />
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        <Text style={styles.sectionTitle}>{t('settings.notification')}</Text>
        <TouchableOpacity 
          style={styles.menuItem}
          onPress={() => navigation.navigate('Notifications')}
        >
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Ionicons name="notifications" size={24} color="#FF6B6B" style={{marginRight: 10}} />
            <Text style={styles.menuText}>{t('settings.custom')}</Text>
          </View>
          <Ionicons name="chevron-forward" size={24} style={styles.chevron} />
        </TouchableOpacity>

        <Text style={styles.sectionTitle}>{t('settings.helpSupport')}</Text>
        <View style={styles.helpSection}>
          <View style={styles.helpItem}>
            <Text style={styles.helpLabel}>{t('settings.phone')}</Text>
            <Text style={styles.helpValue}>87053981251</Text>
          </View>
          <View style={[styles.helpItem, styles.helpItemLast]}>
            <Text style={styles.helpLabel}>{t('settings.email')}</Text>
            <Text style={styles.helpValue}>demai@gmail.com</Text>
          </View>
        </View>
      </ScrollView>

      {/* Language Selection Modal */}
      <Modal
        visible={languageModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setLanguageModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{t('settings.selectLanguage')}</Text>
              <TouchableOpacity onPress={() => setLanguageModalVisible(false)}>
                <Ionicons name="close" size={24} color="white" />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.languageList}>
              {availableLanguages.map((language) => (
                <TouchableOpacity
                  key={language.code}
                  style={styles.languageOption}
                  onPress={() => selectLanguage(language.code)}
                >
                  <Text style={styles.languageName}>{language.nativeName}</Text>
                  {renderRadioButton(currentLanguage === language.code)}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Logout Modal */}
      <Modal
        visible={logoutModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setLogoutModalVisible(false)}
      >
        <View style={styles.logoutModal}>
          <StatusBar backgroundColor="rgba(0, 0, 0, 0.6)" barStyle="light-content" />
          <View style={styles.logoutModalContent}>
            <Text style={styles.logoutModalTitle}>{t('settings.logOut')}</Text>
            <Text style={styles.logoutModalMessage}>
              {t('settings.logoutConfirmation')}
            </Text>
            
            <View style={styles.logoutButtonContainer}>
              <TouchableOpacity 
                style={styles.cancelButton}
                onPress={() => setLogoutModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>{t('common.cancel')}</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.logoutButton}
                onPress={handleLogout}
              >
                <Text style={styles.logoutButtonText}>{t('settings.logOut')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default Settings;