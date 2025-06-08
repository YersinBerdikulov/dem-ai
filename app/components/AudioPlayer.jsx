import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { Audio } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';

const AudioPlayer = ({ title, audioUrl, coverImage }) => {
  const [sound, setSound] = useState();
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [position, setPosition] = useState(0);

  async function loadAudio() {
    try {
      const { sound } = await Audio.Sound.createAsync(
        { uri: audioUrl },
        { shouldPlay: false },
        onPlaybackStatusUpdate
      );
      setSound(sound);
    } catch (error) {
      console.error('Error loading sound', error);
    }
  }

  useEffect(() => {
    loadAudio();
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [audioUrl]);

  const onPlaybackStatusUpdate = (status) => {
    if (status.isLoaded) {
      setDuration(status.durationMillis);
      setPosition(status.positionMillis);
      setIsPlaying(status.isPlaying);
    }
  };

  const handlePlayPause = async () => {
    if (sound) {
      if (isPlaying) {
        await sound.pauseAsync();
      } else {
        await sound.playAsync();
      }
    }
  };

  const formatTime = (millis) => {
    const minutes = Math.floor(millis / 60000);
    const seconds = ((millis % 60000) / 1000).toFixed(0);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <View className="bg-primary p-4 rounded-xl">
      <View className="flex-row items-center mb-4">
        <Image
          source={coverImage}
          className="w-16 h-16 rounded-lg mr-4"
        />
        <View className="flex-1">
          <Text className="text-white text-lg font-bold">{title}</Text>
        </View>
      </View>

      <View className="mb-4">
        <Slider
          value={position}
          maximumValue={duration}
          minimumValue={0}
          onSlidingComplete={async (value) => {
            if (sound) {
              await sound.setPositionAsync(value);
            }
          }}
          minimumTrackTintColor="#1904E5"
          maximumTrackTintColor="#ffffff30"
          thumbTintColor="#FAB2FF"
        />
        <View className="flex-row justify-between">
          <Text className="text-white/60">{formatTime(position)}</Text>
          <Text className="text-white/60">{formatTime(duration)}</Text>
        </View>
      </View>

      <View className="flex-row justify-center items-center space-x-8">
        <TouchableOpacity>
          <Ionicons name="play-skip-back" size={24} color="white" />
        </TouchableOpacity>
        
        <TouchableOpacity 
          onPress={handlePlayPause}
          className="bg-gradient-end p-4 rounded-full"
        >
          <Ionicons 
            name={isPlaying ? "pause" : "play"} 
            size={32} 
            color="white" 
          />
        </TouchableOpacity>

        <TouchableOpacity>
          <Ionicons name="play-skip-forward" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default AudioPlayer;