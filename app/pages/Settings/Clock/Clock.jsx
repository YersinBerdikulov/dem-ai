import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  SafeAreaView, 
  TouchableOpacity, 
  FlatList,
  Alert,
  Image
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { collection, query, where, getDocs, doc, deleteDoc } from 'firebase/firestore';
import { auth, db } from '../../../../config/firebase';
import { clockStyles as styles } from '../../../../styles/settings/ClockStyles'
import { useLanguage } from '../../../context/LanguageContext';

const Clock = ({ navigation }) => {
  const { t } = useLanguage();
  const [sobrietyItems, setSobrietyItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSobrietyData();
    
    // Add listener for when we come back to this screen
    const unsubscribe = navigation.addListener('focus', () => {
      fetchSobrietyData();
    });

    return unsubscribe;
  }, [navigation]);

  const fetchSobrietyData = async () => {
    try {
      setLoading(true);
      const user = auth.currentUser;
      
      if (!user) {
        setLoading(false);
        return;
      }
      
      const sobrietyRef = collection(db, 'sobriety');
      const q = query(sobrietyRef, where('userId', '==', user.uid));
      const querySnapshot = await getDocs(q);
      
      const items = [];
      querySnapshot.forEach((doc) => {
        items.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      setSobrietyItems(items);
    } catch (error) {
      console.error('Error fetching sobriety data:', error);
      Alert.alert(t('sobrietyClocks.error'), t('sobrietyClocks.loadError'));
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteItem = async (itemId) => {
    try {
      Alert.alert(
        t('sobrietyClocks.confirmDelete'),
        t('sobrietyClocks.confirmDeleteMessage'),
        [
          {
            text: t('sobrietyClocks.cancel'),
            style: 'cancel'
          },
          {
            text: t('sobrietyClocks.delete'),
            style: 'destructive',
            onPress: async () => {
              await deleteDoc(doc(db, 'sobriety', itemId));
              setSobrietyItems(sobrietyItems.filter(item => item.id !== itemId));
            }
          }
        ]
      );
    } catch (error) {
      console.error('Error deleting sobriety item:', error);
      Alert.alert(t('sobrietyClocks.error'), t('sobrietyClocks.deleteError'));
    }
  };

  const calculateStreak = (startDate) => {
    const start = new Date(startDate);
    const now = new Date();
    
    // Calculate difference in milliseconds
    const diffTime = Math.abs(now - start);
    
    // Calculate difference in days
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    // Calculate hours and minutes for current day
    const hours = Math.floor((diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diffTime % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diffTime % (1000 * 60)) / 1000);
    
    return `${diffDays}${t('sobrietyClocks.days')} ${hours}${t('sobrietyClocks.hours')} ${minutes}${t('sobrietyClocks.minutes')} ${seconds}${t('sobrietyClocks.seconds')}`;
  };

  const getIconForType = (type) => {
    switch (type.toLowerCase()) {
      case 'alcohol':
        return require('../../../../assets/icons/alcohol.png');
      case 'smoking':
        return require('../../../../assets/icons/smoking.png');
      case 'drugs':
        return require('../../../../assets/icons/drugs.png');
      case 'vaping':
        return require('../../../../assets/icons/vaping.png');
      case 'caffeine':
        return require('../../../../assets/icons/caffeine.png');
      case 'gambling':
        return require('../../../../assets/icons/gambling.png');
      case 'social media':
        return require('../../../../assets/icons/social-media.png');
      case 'custom':
      default:
        return require('../../../../assets/icons/block.png');
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.sobrietyCard}>
      <Image 
        source={getIconForType(item.type)} 
        style={styles.sobrietyIcon} 
      />
      <View style={styles.sobrietyInfo}>
        <Text style={styles.sobrietyTitle}>{item.type}</Text>
        <Text style={styles.sobrietySubtitle}>{t('sobrietyClocks.createdOn')} {new Date(item.createdAt).toLocaleDateString()}</Text>
        <Text style={styles.streakText}>{t('sobrietyClocks.currentStreak')}</Text>
        <Text style={styles.streakTimer}>{calculateStreak(item.startDate)}</Text>
      </View>
      <TouchableOpacity 
        style={styles.deleteButton}
        onPress={() => handleDeleteItem(item.id)}
      >
        <Ionicons name="trash-outline" size={24} color="#FF3B30" />
      </TouchableOpacity>
    </View>
  );

  const handleAddClock = () => {
    navigation.navigate('CreateClock');
  };

  const renderEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>{t('sobrietyClocks.emptyText')}</Text>
      <Text style={styles.emptySubText}>{t('sobrietyClocks.emptySubText')}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('sobrietyClocks.title')}</Text>
      </View>
      
      <FlatList
        data={sobrietyItems}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={renderEmptyComponent}
      />
      
      <TouchableOpacity
        style={styles.addButton}
        onPress={handleAddClock}
      >
        <Ionicons name="add" size={32} color="white" />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default Clock;