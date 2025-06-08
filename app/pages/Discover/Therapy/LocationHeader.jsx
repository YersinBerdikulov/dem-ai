import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLanguage } from '../../../context/LanguageContext';

const LocationHeader = ({ currentLocation, onPress }) => {
  const { t } = useLanguage();
  
  // Translate location if it's a default value
  const getDisplayLocation = () => {
    if (currentLocation === 'Near Me') {
      return t('therapy.nearMe');
    }
    if (currentLocation === 'Current Location') {
      return t('therapy.currentLocation');
    }
    return currentLocation;
  };

  return (
    <TouchableOpacity 
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.contentContainer}>
        <View style={styles.iconContainer}>
          <Ionicons name="location" size={18} color="#007AFF" />
        </View>
        <Text style={styles.locationText}>{getDisplayLocation()}</Text>
        <Ionicons name="chevron-down" size={16} color="rgba(255,255,255,0.5)" />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 10,
  },
  iconContainer: {
    marginRight: 8,
  },
  locationText: {
    fontSize: 16,
    color: 'white',
    fontWeight: '500',
    fontFamily: 'Poppins-Medium',
    marginRight: 6,
  }
});

export default LocationHeader;