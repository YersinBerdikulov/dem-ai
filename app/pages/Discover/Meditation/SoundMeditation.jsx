// SoundMeditation.jsx - Updated with multi-language support
import React, { useState, useEffect } from 'react';
import { View, Text, SafeAreaView, Image, TouchableOpacity, Dimensions, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../../../config/firebase';
import { soundMeditationStyles as styles } from '../../../../styles/discover/meditation/SoundMeditationStyles';
import { Audio } from 'expo-av';
import { useLanguage } from '../../../context/LanguageContext';

const { width } = Dimensions.get('window');

const SoundMeditation = ({ route, navigation }) => {
  const { meditationId, meditationTitle, duration } = route.params;
  const { t } = useLanguage();
  
  const [sound, setSound] = useState(null);
  const [meditationData, setMeditationData] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);

  const getMeditationTitleKey = (title) => {
    const titleMap = {
      'Intro to Meditation': 'introToMeditation',
      'Foster Mindfulness': 'fosterMindfulness',
      'Loving-Kindness': 'lovingKindness',
      'Focusing on Work': 'focusingOnWork',
      'Focusing on Study': 'focusingOnStudy',
      'Five Senses': 'fiveSenses',
      'Positivity Boost': 'positivityBoost',
      'Letting Go': 'lettingGo',
      'Falling Asleep': 'fallingAsleep',
      'Soothing Sleep': 'soothingSleep'
    };
    return titleMap[title] || 'introToMeditation';
  };

  const getLocalizedTitle = () => {
    const titleKey = getMeditationTitleKey(meditationTitle);
    return t(`meditation.titles.${titleKey}`) || meditationTitle;
  };

  const generateWaveformBars = () => {
    const bars = [];
    const numberOfBars = 40;
    
    for (let i = 0; i < numberOfBars; i++) {
      const height = Math.floor(Math.random() * 20) + 10;
      const isActive = (i / numberOfBars) * 100 <= progress;
      
      bars.push(
        <View 
          key={i} 
          style={[
            styles.waveformBar, 
            { height }, 
            isActive ? styles.waveformBarActive : styles.waveformBarInactive
          ]} 
        />
      );
    }
    
    return bars;
  };

  const handleBackNavigation = async () => {
    try {
      await handleStop();
      navigation.goBack();
    } catch (error) {
      console.error('Error during navigation:', error);
      navigation.goBack();
    }
  };

  useEffect(() => {
    setupAudio();
    fetchMeditationData();
    const unsubscribe = navigation.addListener('beforeRemove', handleStop);
    return () => {
      handleStop();
      unsubscribe();
    };
  }, []);

  const setupAudio = async () => {
    try {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        playsInSilentModeIOS: true,
        staysActiveInBackground: false,
        shouldDuckAndroid: true,
        playThroughEarpieceAndroid: false
      });
    } catch (error) {
      console.error('Error setting up audio:', error);
    }
  };

  const handleStop = async () => {
    if (sound) {
      try {
        await sound.stopAsync();
        await sound.unloadAsync();
        setSound(null);
        setIsPlaying(false);
        setProgress(0);
        setCurrentTime(0);
      } catch (error) {
        console.error('Error stopping sound:', error);
      }
    }
  };

  const fetchMeditationData = async () => {
    try {
      const meditationRef = doc(db, 'meditations', meditationId);
      const meditationSnap = await getDoc(meditationRef);
      
      if (meditationSnap.exists()) {
        const data = meditationSnap.data();
        setMeditationData(data);
        if (data.audioFile) {
          await loadAudio(data.audioFile);
        }
      } else {
        const defaultData = {
          title: meditationTitle,
          audioFile: 'https://s31.aconvert.com/convert/p3r68-cdx67/mvwiv-q9vjr.mp3',
        };
        setMeditationData(defaultData);
        await loadAudio(defaultData.audioFile);
      }
    } catch (error) {
      console.error('Error fetching meditation data:', error);
      const defaultData = {
        title: meditationTitle,
        audioFile: 'https://s31.aconvert.com/convert/p3r68-cdx67/mvwiv-q9vjr.mp3',
      };
      setMeditationData(defaultData);
      await loadAudio(defaultData.audioFile);
    }
  };

  const loadAudio = async (audioFileUrl) => {
    try {
      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: audioFileUrl },
        { shouldPlay: false },
        onPlaybackStatusUpdate
      );
      setSound(newSound);
    } catch (error) {
      console.error('Error loading audio:', error);
    }
  };

  const handlePlayPause = async () => {
    if (!sound) return;
    try {
      if (isPlaying) {
        await sound.pauseAsync();
      } else {
        await sound.playAsync();
      }
      setIsPlaying(!isPlaying);
    } catch (error) {
      console.error('Error playing/pausing:', error);
    }
  };

  const handleSkipForward = async () => {
    if (!sound) return;
    try {
      const newPosition = Math.min(currentTime + 15000, totalDuration);
      await sound.setPositionAsync(newPosition);
    } catch (error) {
      console.error('Error skipping forward:', error);
    }
  };

  const handleSkipBackward = async () => {
    if (!sound) return;
    try {
      const newPosition = Math.max(currentTime - 15000, 0);
      await sound.setPositionAsync(newPosition);
    } catch (error) {
      console.error('Error skipping backward:', error);
    }
  };

  const handleShuffle = () => {
    console.log('Shuffle pressed');
  };

  const handleFullscreen = () => {
    console.log('Fullscreen pressed');
  };

  const onPlaybackStatusUpdate = (status) => {
    if (status.isLoaded) {
      const progressValue = (status.positionMillis / status.durationMillis) * 100;
      setProgress(progressValue);
      setCurrentTime(status.positionMillis);
      setTotalDuration(status.durationMillis);
    }
  };

  const formatTime = (millis) => {
    if (!millis) return "0:00";
    const totalSeconds = Math.floor(millis / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBackNavigation}>
          <Ionicons name="chevron-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('meditation.nowPlaying')}</Text>
        <TouchableOpacity>
          <Ionicons name="ellipsis-vertical" size={24} color="white" />
        </TouchableOpacity>
      </View>
      
      <View style={styles.contentContainer}>
        <View style={styles.artworkContainer}>
          <Image 
            source={require('../../../../assets/icons/backgraund.png')} 
            style={styles.artworkImage} 
            resizeMode="cover"
          />
        </View>
        
        <View style={styles.trackInfoContainer}>
          <Text style={styles.trackTitle}>{getLocalizedTitle()}</Text>
          <Text style={styles.trackDuration}>{duration}</Text>
        </View>
        
        <View style={styles.waveformContainer}>
          {generateWaveformBars()}
        </View>
        
        <View style={styles.timeIndicatorContainer}>
          <Text style={styles.timeText}>{formatTime(currentTime)}</Text>
        </View>
        
        <View style={styles.controlsContainer}>
          <TouchableOpacity 
            style={styles.controlButton}
            onPress={handleShuffle}
          >
            <Ionicons name="shuffle" size={22} color="white" />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.controlButton}
            onPress={handleSkipBackward}
          >
            <Ionicons name="play-skip-back" size={24} color="white" />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.playPauseButton}
            onPress={handlePlayPause}
          >
            <Ionicons name={isPlaying ? "pause" : "play"} size={30} color="#03174C" />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.controlButton}
            onPress={handleSkipForward}
          >
            <Ionicons name="play-skip-forward" size={24} color="white" />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.controlButton}
            onPress={handleFullscreen}
          >
            <Ionicons name="expand" size={22} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default SoundMeditation;