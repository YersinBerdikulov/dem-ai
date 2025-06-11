// TherapistDetail.jsx
import React, { useState } from 'react';
import { 
  View, 
  Text, 
  SafeAreaView, 
  Image, 
  ScrollView, 
  TouchableOpacity, 
  Linking, 
  Platform,
  Alert,
  StatusBar,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
//import MapView, { Marker, PROVIDER_DEFAULT } from 'react-native-maps';
import { therapistDetailStyles as styles } from '../../../../styles/discover/therapy/TherapistDetailStyles';
import CustomMapMarker from './CustomMapMarker';
import { useLanguage } from '../../../context/LanguageContext';


const TherapistDetail = ({ route, navigation }) => {
  const { therapist } = route.params;
  const { t } = useLanguage();
  const [isFavorite, setIsFavorite] = useState(therapist.isFavorite || false);
  
  // Handle phone call
  const handleCall = () => {
    if (!therapist.phone) {
      Alert.alert(t('common.error'), t('therapy.phoneNotAvailable'));
      return;
    }
    
    // Format phone number to remove any non-numeric characters
    const phoneNumber = therapist.phone.replace(/\D/g, '');
    
    // Check if phone number is valid
    if (phoneNumber.length < 5) {
      Alert.alert(t('common.error'), t('therapy.invalidPhoneNumber'));
      return;
    }
    
    // Attempt to open phone app
    Linking.canOpenURL(`tel:${phoneNumber}`)
      .then(supported => {
        if (!supported) {
          Alert.alert(t('common.error'), t('therapy.phoneCallsNotSupported'));
        } else {
          return Linking.openURL(`tel:${phoneNumber}`);
        }
      })
      .catch(err => {
        console.error('Error opening phone app:', err);
        Alert.alert(t('common.error'), t('therapy.couldNotOpenPhone'));
      });
  };
  
  // Handle website navigation
  const handleWebsite = () => {
    if (!therapist.website) {
      Alert.alert(t('common.error'), t('therapy.websiteNotAvailable'));
      return;
    }
    
    Linking.openURL(therapist.website);
  };
  
  // Handle booking action
  const handleBooking = () => {
    // This would typically navigate to a booking screen
    Alert.alert(
      t('therapy.bookAppointment'),
      t('therapy.bookAppointmentMessage').replace('{{name}}', therapist.name),
      [
        {
          text: t('common.cancel'),
          style: 'cancel'
        },
        {
          text: t('common.continue'),
          onPress: () => console.log('Booking confirmed')
        }
      ]
    );
  };
  
  // Toggle favorite status
  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
    // Here you would update the database
  };
  
  // Open in maps app
  const openMap = () => {
    if (!therapist.lat || !therapist.lng) {
      Alert.alert(t('common.error'), t('therapy.locationNotAvailable'));
      return;
    }
    
    const scheme = Platform.select({ ios: 'maps:0,0?q=', android: 'geo:0,0?q=' });
    const latLng = `${therapist.lat},${therapist.lng}`;
    const label = therapist.name;
    const url = Platform.select({
      ios: `${scheme}${label}@${latLng}`,
      android: `${scheme}${latLng}(${label})`
    });
    
    Linking.openURL(url);
  };

  // Format day and time for availability
  const formatAvailability = (availability) => {
    if (!availability || typeof availability !== 'string') return t('therapy.hoursNotAvailable');
    
    // If availability is already in a good format, return it
    if (availability.includes('\n')) return availability;
    
    // Otherwise, try to format it better
    return availability;
  };

  // Format distance
  const formatDistance = (distance) => {
    if (typeof distance === 'number') {
      return `${distance.toFixed(1)} ${t('therapy.kmAway')}`;
    }
    return t('therapy.distanceNotAvailable');
  };

  // Render a single review
  const renderReview = ({ item }) => {
    if (!item) return null;
    
    return (
      <View style={styles.reviewItem}>
        <View style={styles.reviewHeader}>
          <Text style={styles.reviewAuthor}>
            {item.author_name || t('therapy.anonymousReviewer')}
          </Text>
          <View style={styles.reviewRating}>
            <Ionicons name="star" size={14} color="#FFD700" />
            <Text style={styles.reviewRatingText}>
              {item.rating?.toFixed(1) || t('therapy.noRating')}
            </Text>
          </View>
        </View>
        <Text style={styles.reviewText}>
          {item.text || t('therapy.noReviewText')}
        </Text>
        {item.time && (
          <Text style={styles.reviewTime}>
            {new Date(item.time * 1000).toLocaleDateString()}
          </Text>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      <LinearGradient
        colors={['#03174C', '#03174C']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradientContainer}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{t('therapy.specialistProfile')}</Text>
          <TouchableOpacity onPress={toggleFavorite}>
         
          </TouchableOpacity>
        </View>
        
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.profileHeader}>
            <View style={styles.profileImageContainer}>
              {therapist.image ? (
                <Image 
                  source={{ uri: therapist.image }} 
                  style={styles.profileImage} 
                />
              ) : (
                <View style={[styles.profileImage, styles.placeholderImage]}>
                  <Ionicons name="person" size={50} color="rgba(255, 255, 255, 0.7)" />
                </View>
              )}
            </View>
            
            <View style={styles.profileInfo}>
              <Text style={styles.name}>{therapist.name || t('therapy.noName')}</Text>
              <Text style={styles.specialization}>{therapist.specialization || t('therapy.specialist')}</Text>
              
              <View style={styles.ratingContainer}>
                <Ionicons name="star" size={16} color="#FFD700" />
                <Text style={styles.ratingText}>
                  {therapist.rating?.toFixed(1) || t('therapy.noRating')} ({therapist.reviewCount || 0} {t('therapy.reviews')})
                </Text>
              </View>
            </View>
          </View>
          
          <View style={styles.actionsContainer}>
            <TouchableOpacity style={styles.actionButton} onPress={handleCall}>
              <View style={styles.actionIconContainer}>
                <Ionicons name="call" size={20} color="white" />
              </View>
              <Text style={styles.actionText}>{t('therapy.call')}</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionButton} onPress={handleWebsite}>
              <View style={styles.actionIconContainer}>
                <Ionicons name="globe" size={20} color="white" />
              </View>
              <Text style={styles.actionText}>{t('therapy.website')}</Text>
            </TouchableOpacity>
            
          
          </View>
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t('therapy.information')}</Text>
            
            {therapist.address && (
              <View style={styles.infoRow}>
                <View style={styles.infoIconContainer}>
                  <Ionicons name="location-outline" size={20} color="#007AFF" />
                </View>
                <View style={styles.infoTextContainer}>
                  <Text style={styles.infoLabel}>{t('therapy.address')}</Text>
                  <Text style={styles.infoText}>{therapist.address}</Text>
                </View>
              </View>
            )}
            
            {therapist.phone && (
              <View style={styles.infoRow}>
                <View style={styles.infoIconContainer}>
                  <Ionicons name="call-outline" size={20} color="#007AFF" />
                </View>
                <View style={styles.infoTextContainer}>
                  <Text style={styles.infoLabel}>{t('therapy.phone')}</Text>
                  <Text style={styles.infoText}>{therapist.phone}</Text>
                </View>
              </View>
            )}
            
            {therapist.website && (
              <View style={styles.infoRow}>
                <View style={styles.infoIconContainer}>
                  <Ionicons name="globe-outline" size={20} color="#007AFF" />
                </View>
                <View style={styles.infoTextContainer}>
                  <Text style={styles.infoLabel}>{t('therapy.website')}</Text>
                  <TouchableOpacity onPress={handleWebsite}>
                    <Text style={[styles.infoText, styles.linkText]}>{therapist.website}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
            
            {therapist.availability && (
              <View style={styles.infoRow}>
                <View style={styles.infoIconContainer}>
                  <Ionicons name="time-outline" size={20} color="#007AFF" />
                </View>
                <View style={styles.infoTextContainer}>
                  <Text style={styles.infoLabel}>{t('therapy.hours')}</Text>
                  <Text style={styles.infoText}>
                    {formatAvailability(therapist.availability)}
                  </Text>
                </View>
              </View>
            )}
            
            {therapist.distance !== undefined && (
              <View style={styles.infoRow}>
                <View style={styles.infoIconContainer}>
                  <Ionicons name="navigate-outline" size={20} color="#007AFF" />
                </View>
                <View style={styles.infoTextContainer}>
                  <Text style={styles.infoLabel}>{t('therapy.distance')}</Text>
                  <Text style={styles.infoText}>
                    {formatDistance(therapist.distance)}
                  </Text>
                </View>
              </View>
            )}
          </View>
          
          {therapist.lat && therapist.lng && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>{t('therapy.location')}</Text>
              <View style={styles.mapContainer}>
                <MapView
                  style={styles.map}
                  provider={PROVIDER_DEFAULT}
                  initialRegion={{
                    latitude: therapist.lat,
                    longitude: therapist.lng,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01,
                  }}
                  scrollEnabled={false}
                  zoomEnabled={false}
                >
                  <Marker
                    coordinate={{
                      latitude: therapist.lat,
                      longitude: therapist.lng,
                    }}
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
                </MapView>
                <TouchableOpacity style={styles.openMapButton} onPress={openMap}>
                  <Ionicons name="navigate" size={16} color="#03174C" />
                  <Text style={styles.openMapButtonText}>{t('therapy.openMap')}</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
          
          {therapist.reviews && therapist.reviews.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>{t('therapy.reviews')}</Text>
              <FlatList
                data={therapist.reviews}
                renderItem={renderReview}
                keyExtractor={(item, index) => `review-${index}`}
                scrollEnabled={false}
                ItemSeparatorComponent={() => <View style={styles.reviewSeparator} />}
              />
            </View>
          )}
          
        
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
};

export default TherapistDetail;