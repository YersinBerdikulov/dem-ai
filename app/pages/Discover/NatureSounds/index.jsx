// NatureSounds.jsx - Updated with multi-language support
import React, { useState, useEffect } from 'react';
import { View, Text, SafeAreaView, Image, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { collection, getDocs } from 'firebase/firestore';
import { useRoute } from '@react-navigation/native';
import { db } from '../../../../config/firebase';
import { natureSoundsStyles as styles } from '../../../../styles/discover/natureSoundsStyles';
import { useLanguage } from '../../../context/LanguageContext';

const NatureSounds = ({ navigation }) => {
  const { t } = useLanguage(); // Add language hook
  const route = useRoute();
  const [soundsList, setSoundsList] = useState([]);

  // Get the source parameter to determine where we came from
  const source = route?.params?.source;

  useEffect(() => {
    fetchSounds();
  }, []);

  const fetchSounds = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'natureSounds'));
      const sounds = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setSoundsList(sounds);
    } catch (error) {
      console.error('Error fetching sounds:', error);
    }
  };

  // Handle back navigation based on source
  const handleGoBack = () => {
    if (source === 'Home') {
      // If we came from Home, navigate back to Home tab
      navigation.navigate('Home');
    } else {
      // Default behavior - go back to previous screen
      navigation.goBack();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#FFA8A8', '#FCFF00']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradientContainer}
      >
        <Image 
          source={require('../../../../assets/images/nature.png')} // Add mountain background image
          style={styles.backgroundImage}
          resizeMode="contain"
        />
        <View style={styles.header}>
          <TouchableOpacity 
            onPress={handleGoBack}
            activeOpacity={0.7}
          >
            <Ionicons name="chevron-back" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity>
            <Ionicons name="heart" size={24} color="#FF4365" />
          </TouchableOpacity>
        </View>

        <View style={styles.contentContainer}>
          <Text style={styles.title}>{t('natureSounds.title')}</Text>
          <Text style={styles.subtitle}>
            {soundsList.length} {t('natureSounds.tracks')}
          </Text>

          <ScrollView style={styles.tracksList}>
            {soundsList.map((sound) => (
              <TouchableOpacity 
                key={sound.id}
                style={styles.trackItem}
                onPress={() => navigation.navigate('SoundPlayer', { soundId: sound.id })}
              >
                <Image 
                  source={{ uri: sound.image }} 
                  style={styles.trackImage}
                  resizeMode="cover"
                />
                <View style={styles.trackInfo}>
                  <Text style={styles.trackTitle}>{sound.title}</Text>
                  <Text style={styles.trackDuration}>{sound.duration}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
};

export default NatureSounds;