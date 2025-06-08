// SoundPlayer.jsx - Updated with multi-language support
import React, { useState, useEffect } from 'react';
import { View, Text, SafeAreaView, Image, TouchableOpacity, PanResponder, Dimensions, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { doc, getDoc, collection, getDocs } from 'firebase/firestore';
import { db } from '../../../../config/firebase';
import { soundPlayerStyles as styles } from '../../../../styles/discover/soundPlayerStyles';
import { Audio } from 'expo-av';
import { useLanguage } from '../../../context/LanguageContext';

const { width } = Dimensions.get('window');

const SoundPlayer = ({ route, navigation }) => {
  const { t } = useLanguage(); // Add language hook
  
  const [sound, setSound] = useState(null);
  const [soundData, setSoundData] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isLooping, setIsLooping] = useState(false);
  const [isShuffled, setIsShuffled] = useState(false);
  const [allSounds, setAllSounds] = useState([]);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const { soundId } = route.params;

  const panResponder = React.useMemo(() => 
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        setIsDragging(true);
        if (isPlaying) {    
          sound?.pauseAsync();
        }
      },
      onPanResponderMove: (_, gestureState) => {
        if (duration > 0) {
          const progressBarWidth = width - 80;
          const offset = Math.max(0, Math.min(progressBarWidth, gestureState.moveX));
          const percentage = offset / progressBarWidth;
          const position = percentage * duration;
          setCurrentTime(position);
          setProgress(percentage * 100);
        }
      },
      onPanResponderRelease: async (_, gestureState) => {
        if (sound && duration > 0) {
          const progressBarWidth = width - 80;
          const offset = Math.max(0, Math.min(progressBarWidth, gestureState.moveX));
          const percentage = offset / progressBarWidth;
          const position = percentage * duration;
          await sound.setPositionAsync(position);
          if (isPlaying) {
            await sound.playAsync();
          }
        }
        setIsDragging(false);
      }
    }), [sound, duration, isPlaying]);
  
  const handleBackNavigation = async () => {
    try {
      await handleStop();
      navigation.navigate('NatureSounds');
    } catch (error) {
      console.error('Error during navigation:', error);
      navigation.navigate('NatureSounds');
    }
  };

  useEffect(() => {
    setupAudio();
    fetchAllSounds();
    const unsubscribe = navigation.addListener('beforeRemove', handleStop);
    return () => {
      handleStop();
      unsubscribe();
    };
  }, []);
   
  useEffect(() => {
    handleStop();
    fetchSoundData();
  }, [soundId]);

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

  const fetchAllSounds = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'natureSounds'));
      const sounds = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setAllSounds(sounds);
    } catch (error) {
      console.error('Error fetching sounds:', error);
    }
  };

  const fetchSoundData = async () => {
    try {
      const docRef = doc(db, 'natureSounds', soundId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setSoundData(docSnap.data());
        if (docSnap.data().audioFile) {
          await loadAudio(docSnap.data().audioFile);
        }
      }
    } catch (error) {
      console.error('Error fetching sound data:', error);
    }
  };

  const loadAudio = async (audioFileUrl) => {
    try {
      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: audioFileUrl },
        { shouldPlay: false, isLooping },
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

  const handlePrevNext = async (direction) => {
    const currentIndex = allSounds.findIndex(s => s.id === soundId);
    let nextIndex;
    
    if (isShuffled) {
      nextIndex = Math.floor(Math.random() * allSounds.length);
      while (nextIndex === currentIndex && allSounds.length > 1) {
        nextIndex = Math.floor(Math.random() * allSounds.length);
      }
    } else {
      nextIndex = direction === 'next' 
        ? (currentIndex + 1) % allSounds.length
        : (currentIndex - 1 + allSounds.length) % allSounds.length;
    }
    
    handleStop();
    navigation.replace('SoundPlayer', { soundId: allSounds[nextIndex].id });
  };

  const toggleLoop = async () => {
    if (sound) {
      await sound.setIsLoopingAsync(!isLooping);
      setIsLooping(!isLooping);
    }
  };

  const toggleShuffle = () => {
    setIsShuffled(!isShuffled);
  };

  const onPlaybackStatusUpdate = (status) => {
    if (status.isLoaded) {
      setProgress((status.positionMillis / status.durationMillis) * 100);
      setCurrentTime(status.positionMillis);
      setDuration(status.durationMillis);
      if (status.didJustFinish && !isLooping) {
        handlePrevNext('next');
      }
    }
  };

  const handleProgressPress = async (event) => {
    if (sound && duration > 0) {
      const width = event.nativeEvent.locationX;
      const progressBarWidth = styles.progressBar.width;
      const percentage = width / progressBarWidth;
      const position = percentage * duration;
      await sound.setPositionAsync(position);
    }
  };

  const formatTime = (millis) => {
    if (!millis) return "0:00";
    const minutes = Math.floor(millis / 60000);
    const seconds = ((millis % 60000) / 1000).toFixed(0);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#03174C', '#03174C']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradientBackground}
      >
        <View style={styles.overlay}>
          <View style={styles.header}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={handleBackNavigation}
            >
              <Ionicons name="chevron-back" size={24} color="white" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>{t('natureSounds.nowPlaying')}</Text>
            <TouchableOpacity>
              <Ionicons name="ellipsis-vertical" size={24} color="white" />
            </TouchableOpacity>
          </View>

          <View style={styles.content}>
            <Image source={{ uri: soundData?.image }} style={styles.artwork} />
            <Text style={styles.title}>{soundData?.title}</Text>
            
            <View style={styles.progressBarContainer} {...panResponder.panHandlers}>
              <View style={styles.progressBar}>
                <View style={[styles.progress, { width: `${progress}%` }]} />
              </View>
              <View style={styles.timeContainer}>
                <Text style={styles.timeText}>{formatTime(currentTime)}</Text>
                <Text style={styles.timeText}>{formatTime(duration)}</Text>
              </View>
            </View>

            <View style={styles.controls}>
              <TouchableOpacity onPress={toggleShuffle}>
                <Ionicons 
                  name="shuffle" 
                  size={24} 
                  color={isShuffled ? "#FFA8A8" : "white"} 
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handlePrevNext('prev')}>
                <Ionicons name="play-skip-back" size={32} color="white" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.playButton} onPress={handlePlayPause}>
                <Ionicons name={isPlaying ? "pause" : "play"} size={40} color="white" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handlePrevNext('next')}>
                <Ionicons name="play-skip-forward" size={32} color="white" />
              </TouchableOpacity>
              <TouchableOpacity onPress={toggleLoop}>
                <Ionicons 
                  name="repeat" 
                  size={24} 
                  color={isLooping ? "#FFA8A8" : "white"} 
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
};

export default SoundPlayer;