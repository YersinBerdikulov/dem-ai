// TherapistCard.jsx
import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions, Platform, Alert, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLanguage } from '../../../context/LanguageContext';

const { width } = Dimensions.get('window');

const TherapistCard = ({ therapist, onPress, compact = false }) => {
  const { t } = useLanguage();

  // Function to display distance in appropriate units
  const formatDistance = (distance) => {
    if (distance === null || distance === undefined) return t('therapy.unknownDistance');
    
    if (distance < 1) { 
      // Convert to meters for small distances
      const meters = Math.round(distance * 1000);
      return `${meters} ${t('therapy.meters')}`;
    } else {
      // Display in kilometers with one decimal place
      return `${distance.toFixed(1)} ${t('therapy.kilometers')}`;
    }
  };

  // Function to handle call button press
  const handleCall = () => {
    // In the list view, we likely don't have phone numbers yet
    // Redirect to detail page instead
    onPress();
  };
  
  // Check if image is valid
  const hasValidImage = therapist.image && 
                      therapist.image !== 'https://via.placeholder.com/150' && 
                      !therapist.image.includes('undefined');
  
  return (
    <TouchableOpacity 
      style={[styles.container, compact && styles.compactContainer]} 
      onPress={onPress}
      activeOpacity={0.8}
    >
      {hasValidImage ? (
        <Image 
          source={{ uri: therapist.image }} 
          style={styles.image}
        
          onError={() => console.log('Failed to load image for', therapist.name)}
        />
      ) : (
        <View style={[styles.image, styles.placeholderImage]}>
          <Ionicons name="person" size={30} color="rgba(255, 255, 255, 0.7)" />
        </View>
      )}
      
      <View style={styles.infoContainer}>
        <Text style={styles.name} numberOfLines={1}>
          {therapist.name || t('therapy.noName')}
        </Text>
        <Text style={styles.specialization} numberOfLines={1}>
          {therapist.specialization || t('therapy.specialist')}
        </Text>
        
        <View style={styles.detailsRow}>
          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={14} color="#FFD700" />
            <Text style={styles.ratingText}>
              {therapist.rating?.toFixed(1) || t('therapy.noRating')}
            </Text>
            <Text style={styles.reviewCount}>
              ({therapist.reviewCount || 0})
            </Text>
          </View>
          
          {therapist.distance !== null && (
            <View style={styles.distanceContainer}>
              <Ionicons name="location" size={14} color="#007AFF" />
              <Text style={styles.distanceText}>{formatDistance(therapist.distance)}</Text>
            </View>
          )}
        </View>
        
        {therapist.address && !compact && (
          <View style={styles.addressContainer}>
            <Ionicons name="location-outline" size={12} color="rgba(255, 255, 255, 0.7)" />
            <Text style={styles.addressText} numberOfLines={1}>
              {therapist.address}
            </Text>
          </View>
        )}
        
        {!compact && (
          <View style={styles.bottomRow}>
            <TouchableOpacity 
              style={styles.contactButton} 
              onPress={handleCall}
            >
              <Ionicons name="information-circle" size={16} color="white" />
            </TouchableOpacity>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
    width: width - 40,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  compactContainer: {
    padding: 12,
    marginBottom: 0,
  },
  image: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginRight: 15,
    backgroundColor: '#2A3A5C',
  },
  placeholderImage: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoContainer: {
    flex: 1,
    justifyContent: 'space-between',
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    fontFamily: 'Poppins-SemiBold',
    marginBottom: 2,
  },
  specialization: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    fontFamily: 'Poppins-Regular',
    marginBottom: 8,
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    marginLeft: 4,
    fontSize: 13,
    color: 'white',
    fontFamily: 'Poppins-Medium',
  },
  reviewCount: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.5)',
    marginLeft: 2,
    fontFamily: 'Poppins-Regular',
  },
  distanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  distanceText: {
    marginLeft: 4,
    fontSize: 13,
    color: 'white',
    fontFamily: 'Poppins-Regular',
  },
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  addressText: {
    marginLeft: 4,
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
    fontFamily: 'Poppins-Regular',
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  contactButton: {
    backgroundColor: '#007AFF',
    borderRadius: 20,
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default TherapistCard;