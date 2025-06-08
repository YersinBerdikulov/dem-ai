import React, { useState } from 'react';
import { 
  View, 
  Text, 
  SafeAreaView, 
  TouchableOpacity, 
  FlatList,
  Image,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { createClockStyles as styles } from '../../../../styles/settings/CreateClockStyles'
import { useLanguage } from '../../../context/LanguageContext';

const CreateClock = ({ navigation }) => {
  const { t } = useLanguage();
  const [selectedAddiction, setSelectedAddiction] = useState(null);
  
  const addictions = [
    { id: 'custom', title: t('createClock.addCustom'), icon: require('../../../../assets/icons/block.png') },
    { id: 'alcohol', title: t('createClock.alcohol'), icon: require('../../../../assets/icons/alcohol.png') },
    { id: 'smoking', title: t('createClock.smoking'), icon: require('../../../../assets/icons/smoking.png') },
    { id: 'drugs', title: t('createClock.drugs'), icon: require('../../../../assets/icons/drugs.png') },
    { id: 'vaping', title: t('createClock.vaping'), icon: require('../../../../assets/icons/vaping.png') },
    { id: 'caffeine', title: t('createClock.caffeine'), icon: require('../../../../assets/icons/caffeine.png') },
    { id: 'gambling', title: t('createClock.gambling'), icon: require('../../../../assets/icons/gambling.png') },
    { id: 'social-media', title: t('createClock.socialMedia'), icon: require('../../../../assets/icons/social-media.png') },
  ];

  const handleSelectAddiction = (item) => {
    setSelectedAddiction(item);
    navigation.navigate('DateSelection', { 
      addictionType: item.title 
    });
  };

  const renderAddictionItem = ({ item }) => (
    <TouchableOpacity
      style={styles.addictionItem}
      onPress={() => handleSelectAddiction(item)}
    >
      <View style={styles.iconContainer}>
        <Image source={item.icon} style={styles.addictionIcon} />
      </View>
      <Text style={styles.addictionTitle}>{item.title}</Text>
    </TouchableOpacity>
  );

  const handleClose = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('createClock.title')}</Text>
        <TouchableOpacity
          style={styles.closeButton}
          onPress={handleClose}
        >
          <Ionicons name="close" size={24} color="white" />
        </TouchableOpacity>
      </View>
      
      <FlatList
        data={addictions}
        renderItem={renderAddictionItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

export default CreateClock;