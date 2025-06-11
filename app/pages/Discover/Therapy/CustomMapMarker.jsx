import React from 'react';
import { View } from 'react-native';
//import { Marker } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import { useLanguage } from '../../../context/LanguageContext';

const CustomMapMarker = ({ coordinate, title, description }) => {
  const { t } = useLanguage();
  
  return (
    <Marker
      coordinate={coordinate}
      title={title || t('therapy.specialist')}
      description={description || t('therapy.mentalHealthSpecialist')}
    >
      <View style={{
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#007AFF'
      }}>
        <Ionicons name="medkit" size={20} color="#03174C" />
      </View>
    </Marker>
  );
};

export default CustomMapMarker;