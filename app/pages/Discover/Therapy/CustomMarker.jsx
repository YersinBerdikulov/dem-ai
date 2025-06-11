import React from 'react';
import { View, TouchableOpacity } from 'react-native';
//import { Marker } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import { useLanguage } from '../../../context/LanguageContext';

const CustomMarker = ({ therapist, onPress, isSelected }) => {
  const { t } = useLanguage();
  
  return (
    <Marker
      coordinate={{
        latitude: therapist.lat,
        longitude: therapist.lng,
      }}
      tracksViewChanges={false}
      onPress={onPress}
      title={therapist.name || t('therapy.specialist')}
      description={therapist.specialization || t('therapy.mentalHealthSpecialist')}
    >
      <TouchableOpacity
        style={{
          width: 44,
          height: 44,
          borderRadius: 22,
          backgroundColor: isSelected ? '#FFEBB5' : 'white',
          justifyContent: 'center',
          alignItems: 'center',
          borderWidth: 2,
          borderColor: isSelected ? '#FF8C00' : '#007AFF',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
          elevation: 5,
        }}
      >
        <Ionicons name="medkit" size={22} color="#03174C" />
      </TouchableOpacity>
    </Marker>
  );
};

export default CustomMarker;