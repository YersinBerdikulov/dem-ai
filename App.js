// App.js - Fixed with proper authentication state management
import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { ThemeProvider } from 'styled-components';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './config/firebase';

// Import Language Provider
import { LanguageProvider } from './app/context/LanguageContext';

// Import Authentication screens
import SplashScreen from './app/pages/Registration/SplashScreen';
import Login from './app/pages/Registration/Login';
import SignUp from './app/pages/Registration/SignUp';
import ForgotPassword from './app/pages/Registration/ForgotPassword';
import Verification from './app/pages/Registration/Verification';
import NewPassword from './app/pages/Registration/NewPassword';

// Import Main screens
import Home from './app/pages/Home';
import Discover from './app/pages/Discover';
import Settings from './app/pages/Settings/Settings';

// Import Chat screens - modified to create a chat stack
import Session from './app/pages/Chat/Session';
import SessionList from './app/pages/Chat/SessionList';

// Import Discover feature screens
import BreathingStarts from './app/pages/Discover/BreathingStarts';
import BreathingExercise from './app/pages/Discover/Breathing';
import NatureSounds from './app/pages/Discover/NatureSounds';
import { OpenNews } from './app/pages/Discover/News';

import News from './app/pages/Discover/News';
import SoundPlayer from './app/pages/Discover/NatureSounds/SoundPlayer';

import Test from './app/pages/Discover/Test';
import WorryTest from './app/pages/Discover/Test/WorryTest';
import SelfEsteemTest from './app/pages/Discover/Test/SelfEsteem';
import LifeSatisfaction from './app/pages/Discover/Test/LifeSatisfaction';
import InsomniaRating from './app/pages/Discover/Test/InsomniaRating';
import ResultsPage from './app/pages/Discover/Test/WorryTest/ResultsPage';
import QuestionsPage from './app/pages/Discover/Test/WorryTest/QuestionsPage';
import IntroPage from './app/pages/Discover/Test/WorryTest/IntroPage';
import IntroPages from './app/pages/Discover/Test/LifeSatisfaction/IntroPage';
import QuestionsPages from './app/pages/Discover/Test/LifeSatisfaction/QuestionsPage';
import ResultsPages from './app/pages/Discover/Test/LifeSatisfaction/ResultsPage';
import ResultsPagee from './app/pages/Discover/Test/InsomniaRating/ResultsPage';
import QuestionsPagee from './app/pages/Discover/Test/InsomniaRating/QuestionsPage';
import IntroPagee from './app/pages/Discover/Test/InsomniaRating/IntroPage';
import IntroPaget from './app/pages/Discover/Test/SelfEsteem/IntroPage';
import QuestionsPaget from './app/pages/Discover/Test/SelfEsteem/QuestionsPage';
import ResultsPaget from './app/pages/Discover/Test/SelfEsteem/ResultsPage';
import DiaryPage from './app/pages/Discover/Diary';
import BodyFeelingScreen from './app/pages/Discover/Diary/BodyFeelingScreen';
import MoodSelectionScreen from './app/pages/Discover/Diary/MoodSelectionScreen';

import ShareFeelingScreen from './app/pages/Discover/Diary/ShareFeelingScreen';
import TherapeuticQuestionsScreen from './app/pages/Discover/Diary/TherapeuticQuestionsScreen';
import UserAnswersScreen from './app/pages/Discover/Diary/UserAnswersScreen';
import Games from './app/pages/Discover/Games';
import ConnectDotsGame from './app/pages/Discover/Games/ConnectDots/connectDots';
import ConnectDotsLevels from './app/pages/Discover/Games/ConnectDots/levels';
import Notifications from './app/pages/Settings/Notifications';
import Affirmation from './app/pages/Discover/Affirmation/affirmation';
import Habits from './app/pages/Discover/Habits/habits';
import AddHabits from './app/pages/Discover/Habits/addHabits';
import CategoryHabits from './app/pages/Discover/Habits/CategoryHabits';
import CharacterAvatar from './app/pages/Discover/Habits/CharacterAvatar';
import CreateHabit from './app/pages/Discover/Habits/Createhabits';

import MathGames from './app/pages/Discover/Games/MathGames/MathGames';
import MathGameLevels from './app/pages/Discover/Games/MathGames/MathGameLevels';
import Achievements from './app/pages/Settings/Achievments/Achievements';

import MatchingItems from './app/pages/Discover/Games/MatchItem/MatchingItems';
import MatchingItemsLevels from './app/pages/Discover/Games/MatchItem/MatchingItemsLevels';

import Clock from './app/pages/Settings/Clock/Clock';
import CreateClock from './app/pages/Settings/Clock/CreateClock';
import DateSelection from './app/pages/Settings/Clock/DateSelection';
import Admin from './app/pages/Settings/Admin';

import PersonalityTest from './app/pages/Home/PersonalityTest/PersonalityTest';
import ResultTest from './app/pages/Home/PersonalityTest/ResultTest';

import Meditation from './app/pages/Discover/Meditation/Meditation';
import IntroMeditation from './app/pages/Discover/Meditation/IntroMeditation';
import SoundMeditation from './app/pages/Discover/Meditation/SoundMeditation';
import Therapy from './app/pages/Discover/Therapy/Therapy';
import TherapistDetail from './app/pages/Discover/Therapy/TherapistDetail';

// Create stack and tab navigators
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const HomeStack = createNativeStackNavigator();
const DiscoverStack = createNativeStackNavigator();
const SettingsStack = createNativeStackNavigator();
const ChatStack = createNativeStackNavigator();

// Clean theme with professional colors
const theme = {
  colors: {
    primary: '#1904E5',
    background: '#03174C',
    text: 'white',
    tabBackground: '#03174C',
    tabActive: '#FFFFFF', // Clean white for active tabs
    tabInactive: 'rgba(255, 255, 255, 0.6)',
    border: 'rgba(255, 255, 255, 0.1)',
  },
};

function HomeStackScreen() {
  return (
    <HomeStack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: theme.colors.background },
      }}
    >
      <HomeStack.Screen name="HomeMain" component={Home} />
      <HomeStack.Screen name="PersonalityTest" component={PersonalityTest} />
      <HomeStack.Screen name="ResultTest" component={ResultTest} />
      <HomeStack.Screen name="BreathingStarts" component={BreathingStarts} />
      <HomeStack.Screen name="BreathingExercise" component={BreathingExercise} />
      <HomeStack.Screen name="NatureSounds" component={NatureSounds} />
      <HomeStack.Screen name="SoundPlayer" component={SoundPlayer} />
      <HomeStack.Screen name="News" component={News} />
    </HomeStack.Navigator>
  );
}

function DiscoverStackScreen() {
  return (
    <DiscoverStack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: theme.colors.background },
      }}
    >
      <DiscoverStack.Screen name="DiscoverHome" component={Discover} />
      <DiscoverStack.Screen name="BreathingStarts" component={BreathingStarts} />
      <DiscoverStack.Screen name="BreathingExercise" component={BreathingExercise} />
      <DiscoverStack.Screen name="NatureSounds" component={NatureSounds} />
      <DiscoverStack.Screen name="Test" component={Test} />
      <DiscoverStack.Screen name="QuestionsPage" component={QuestionsPage} />
      <DiscoverStack.Screen name="IntroPage" component={IntroPage} />
      <DiscoverStack.Screen name="ResultsPage" component={ResultsPage} />
      <DiscoverStack.Screen name="WorryTest" component={WorryTest} />
      <DiscoverStack.Screen name="SelfEsteemTest" component={SelfEsteemTest} />
      <DiscoverStack.Screen name="LifeSatisfaction" component={LifeSatisfaction} />
      <DiscoverStack.Screen name="InsomniaRating" component={InsomniaRating} />
      <DiscoverStack.Screen name="IntroPages" component={IntroPages} />
      <DiscoverStack.Screen name="ResultsPages" component={ResultsPages} />
      <DiscoverStack.Screen name="QuestionsPages" component={QuestionsPages} />
      <DiscoverStack.Screen name="QuestionsPagee" component={QuestionsPagee} />
      <DiscoverStack.Screen name="IntroPagee" component={IntroPagee} />
      <DiscoverStack.Screen name="ResultPagee" component={ResultsPagee} />
      <DiscoverStack.Screen name="ResultPaget" component={ResultsPaget} />
      <DiscoverStack.Screen name="IntroPaget" component={IntroPaget} />
      <DiscoverStack.Screen name="QuestionPaget" component={QuestionsPaget} />
      <DiscoverStack.Screen name="News" component={News} />
      <DiscoverStack.Screen name="OpenNews" component={OpenNews} />
      <DiscoverStack.Screen name="Diary" component={DiaryPage} />
      <DiscoverStack.Screen name="BodyFeeling" component={BodyFeelingScreen} />
      <DiscoverStack.Screen name="MoodSelection" component={MoodSelectionScreen} />
      <DiscoverStack.Screen name="ShareFeeling" component={ShareFeelingScreen} />
      <DiscoverStack.Screen name="TherapeuticQuestions" component={TherapeuticQuestionsScreen} />
      <DiscoverStack.Screen name="UserAnswers" component={UserAnswersScreen} />
      <DiscoverStack.Screen name="ConnectDotsGame" component={ConnectDotsGame} />
      <DiscoverStack.Screen name="Games" component={Games} />
      <DiscoverStack.Screen name="ConnectDotsLevels" component={ConnectDotsLevels} />
      <DiscoverStack.Screen name="Affirmation" component={Affirmation} />
      <DiscoverStack.Screen name="Habits" component={Habits} />
      <DiscoverStack.Screen name="AddHabits" component={AddHabits} />
      <DiscoverStack.Screen name="CategoryHabits" component={CategoryHabits} />
      <DiscoverStack.Screen name="CharacterAvatar" component={CharacterAvatar} />
      <DiscoverStack.Screen name="CreateHabit" component={CreateHabit} />
      <DiscoverStack.Screen name="MathGames" component={MathGames} />
      <DiscoverStack.Screen name="MathGameLevels" component={MathGameLevels} />
      <DiscoverStack.Screen name="MatchingItems" component={MatchingItems} />
      <DiscoverStack.Screen name="MatchingItemsLevels" component={MatchingItemsLevels} />
      <DiscoverStack.Screen name="Meditation" component={Meditation} />
      <DiscoverStack.Screen name="IntroMeditation" component={IntroMeditation} />
      <DiscoverStack.Screen name="SoundMeditation" component={SoundMeditation} />
      <DiscoverStack.Screen name="Therapy" component={Therapy} />
      <DiscoverStack.Screen name="TherapistDetail" component={TherapistDetail} />
      <DiscoverStack.Screen name="SoundPlayer" component={SoundPlayer} />
    </DiscoverStack.Navigator>
  );
}

function SettingsStackScreen() {
  return (
    <SettingsStack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: theme.colors.background },
      }}
    >
      <SettingsStack.Screen name="SettingsHome" component={Settings} />
      <SettingsStack.Screen name="Achievements" component={Achievements} />
      <SettingsStack.Screen name="Notifications" component={Notifications} />
      <SettingsStack.Screen name="SobrietyClocks" component={Clock} />
      <SettingsStack.Screen name="CreateClock" component={CreateClock} />
      <SettingsStack.Screen name="DateSelection" component={DateSelection} />
      <SettingsStack.Screen name="Admin" component={Admin} />
    </SettingsStack.Navigator>
  );
}

function ChatStackScreen() {
  return (
    <ChatStack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: theme.colors.background },
      }}
    >
      <ChatStack.Screen name="SessionList" component={SessionList} />
      <ChatStack.Screen name="Session" component={Session} />
    </ChatStack.Navigator>
  );
}

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarHideOnKeyboard: true,
        tabBarStyle: {
          backgroundColor: theme.colors.tabBackground,
          borderTopColor: theme.colors.border,
          borderTopWidth: 1,
          height: 80,
          paddingBottom: 20,
          paddingTop: 8,
          paddingHorizontal: 10,
        },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Discover') {
            iconName = focused ? 'compass' : 'compass-outline';
          } else if (route.name === 'Chat') {
            iconName = focused ? 'chatbubbles' : 'chatbubbles-outline';
          } else if (route.name === 'Settings') {
            iconName = focused ? 'settings' : 'settings-outline';
          }
          return <Ionicons name={iconName} size={26} color={color} />;
        },
        tabBarActiveTintColor: theme.colors.tabActive,
        tabBarInactiveTintColor: theme.colors.tabInactive,
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
          marginTop: 4,
        },
        tabBarIconStyle: {
          marginBottom: 2,
        },
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeStackScreen}
        options={{
          tabBarLabel: 'Home',
        }}
      />
      <Tab.Screen 
        name="Discover" 
        component={DiscoverStackScreen}
        options={{
          tabBarLabel: 'Discover',
        }}
      />
      <Tab.Screen 
        name="Chat" 
        component={ChatStackScreen}
        options={{
          tabBarLabel: 'Chat',
        }}
      />
      <Tab.Screen 
        name="Settings" 
        component={SettingsStackScreen}
        options={{
          tabBarLabel: 'Settings',
        }}
      />
    </Tab.Navigator>
  );
}

// Authentication Navigator
function AuthNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: theme.colors.background },
      }}
    >
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="SignUp" component={SignUp} />
      <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
      <Stack.Screen name="Verification" component={Verification} />
      <Stack.Screen name="NewPassword" component={NewPassword} />
    </Stack.Navigator>
  );
}

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(!!user);
      setIsLoading(false);
    });

    return unsubscribe;
  }, []);

  if (isLoading) {
    return (
      <GestureHandlerRootView style={{ flex: 1 }}>
        <LanguageProvider>
          <ThemeProvider theme={theme}>
            <SplashScreen />
          </ThemeProvider>
        </LanguageProvider>
      </GestureHandlerRootView>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <LanguageProvider>
        <ThemeProvider theme={theme}>
          <NavigationContainer>
            {isAuthenticated ? <TabNavigator /> : <AuthNavigator />}
          </NavigationContainer>
        </ThemeProvider>
      </LanguageProvider>
    </GestureHandlerRootView>
  );
}