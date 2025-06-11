import React, { useState, useEffect, useRef } from 'react';
import { View, Text, SafeAreaView, Image, TouchableOpacity, TextInput, FlatList, Animated, Dimensions, ActivityIndicator, Platform, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import MapView, { PROVIDER_DEFAULT } from 'react-native-maps';
import * as Location from 'expo-location';
import { therapyStyles as styles } from '../../../../styles/discover/therapy/TherapyStyles';
import { LinearGradient } from 'expo-linear-gradient';
import axios from 'axios';
import TherapistCard from './TherapistCard';
import FilterModal from './FilterModal';
import CustomMarker from './CustomMarker';
import LocationHeader from './LocationHeader';
import { useLanguage } from '../../../context/LanguageContext';

const { width } = Dimensions.get('window');

// Google Places API Key
const GOOGLE_API_KEY = 'AIzaSyB8fLg94z3mXIZTYWuGeT6a2IuCoEcog30';

const Therapy = ({ navigation }) => {
  const { t } = useLanguage();

  // Kazakhstan major cities with coordinates - dynamically translated
  const getKazakhstanCities = () => [
    { name: t('therapy.currentLocation'), lat: null, lng: null },
    { name: 'Astana', lat: 51.1605, lng: 71.4704 },
    { name: 'Almaty', lat: 43.2220, lng: 76.8512 },
    { name: 'Shymkent', lat: 42.3167, lng: 69.5901 },
    { name: 'Karaganda', lat: 49.8019, lng: 73.1021 },
    { name: 'Aktobe', lat: 50.2797, lng: 57.2072 },
    { name: 'Taraz', lat: 42.9000, lng: 71.3667 },
    { name: 'Pavlodar', lat: 52.2873, lng: 76.9674 },
    { name: 'Ust-Kamenogorsk', lat: 49.9844, lng: 82.6149 },
    { name: 'Semey', lat: 50.4111, lng: 80.2275 },
    { name: 'Atyrau', lat: 47.1167, lng: 51.8833 },
    { name: 'Kostanay', lat: 53.2198, lng: 63.6354 },
    { name: 'Aktau', lat: 43.6410, lng: 51.1722 },
    { name: 'Kyzylorda', lat: 44.8489, lng: 65.4989 },
  ];

  // Use try-catch to prevent rendering errors
  try {
    const kazakhstanCities = getKazakhstanCities();
    
    const [location, setLocation] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);
    const [therapists, setTherapists] = useState([]);
    const [filteredTherapists, setFilteredTherapists] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [mapView, setMapView] = useState(false);
    const [selectedTherapist, setSelectedTherapist] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedCity, setSelectedCity] = useState(kazakhstanCities[0]); // Default to current location
    
    const [filters, setFilters] = useState({
      specializations: [t('therapy.specializations.psychologist')], // Default to psychologist
      distance: 5000, // 5km in meters for Google API
      rating: 0,
      videoSessions: false,
      languages: [],
      city: kazakhstanCities[0]
    });

    const mapRef = useRef(null);
    const scrollY = useRef(new Animated.Value(0)).current;

    useEffect(() => {
      requestLocationPermission();
    }, []);

    useEffect(() => {
      if (selectedCity && selectedCity.name !== t('therapy.currentLocation')) {
        // If a specific city is selected, use its coordinates
        fetchNearbyTherapists(selectedCity.lat, selectedCity.lng);
      } else if (location) {
        // Otherwise use current location if available
        fetchNearbyTherapists(location.coords.latitude, location.coords.longitude);
      }
    }, [selectedCity, filters]);

    const requestLocationPermission = async () => {
      setIsLoading(true);
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setErrorMsg(t('therapy.locationAccessDenied'));
          // Default to Astana if location permission denied
          setSelectedCity(kazakhstanCities[1]); // Astana
          return;
        }

        let location = await Location.getCurrentPositionAsync({});
        setLocation(location);
        fetchNearbyTherapists(location.coords.latitude, location.coords.longitude);
      } catch (error) {
        console.error('Error getting location:', error);
        setErrorMsg(t('therapy.couldNotGetLocation'));
        // Default to Astana if there's an error
        setSelectedCity(kazakhstanCities[1]); // Astana
      }
    };

    // Helper function to determine if a place is a mental health specialist
    const isMentalHealthSpecialist = (place) => {
      const name = place.name.toLowerCase();
      const types = place.types || [];
      
      // Keywords that indicate mental health specialists
      const mentalHealthKeywords = [
        'psycholog', 'psychiatr', 'therap', 'counsel', 'mental', 'clinic',
        'психолог', 'психиатр', 'терапевт', 'консультант', 'клиника'
      ];
      
      // Check if name contains mental health keywords
      const nameMatch = mentalHealthKeywords.some(keyword => 
        name.includes(keyword)
      );
      
      // Check if it's a health-related place
      const isHealthRelated = types.includes('health') || 
                             types.includes('hospital') || 
                             types.includes('doctor') ||
                             types.includes('establishment');
      
      return nameMatch && isHealthRelated;
    };

    // Helper function to determine specialization based on place data
    const determineSpecialization = (place) => {
      const name = place.name.toLowerCase();
      const types = place.types || [];
      
      if (name.includes('psychiatr') || name.includes('психиатр')) {
        return t('therapy.specializations.psychiatrist');
      } else if (name.includes('child') || name.includes('детск') || name.includes('ребен')) {
        return t('therapy.specializations.childPsychologist');
      } else if (name.includes('family') || name.includes('семейн') || name.includes('пар')) {
        return t('therapy.specializations.familyTherapist');
      } else if (name.includes('cognitive') || name.includes('когнитивн')) {
        return t('therapy.specializations.cognitiveTherapist');
      } else if (name.includes('counsel') || name.includes('консультант')) {
        return t('therapy.specializations.counselor');
      } else if (name.includes('clinic') || name.includes('клиника')) {
        return t('therapy.specializations.mentalHealthClinic');
      } else if (name.includes('neuro') || name.includes('нейро')) {
        return t('therapy.specializations.neuropsychologist');
      } else if (name.includes('addiction') || name.includes('зависим') || name.includes('наркол')) {
        return t('therapy.specializations.addictionSpecialist');
      } else if (name.includes('therap') || name.includes('терапевт')) {
        return t('therapy.specializations.therapist');
      } else {
        // Default to psychologist for mental health places
        return t('therapy.specializations.psychologist');
      }
    };

    // Fetch nearby therapists using Google Places API
    const fetchNearbyTherapists = async (latitude, longitude) => {
      try {
        setIsLoading(true);
        
        // Multiple search queries to get comprehensive results
        const searchQueries = [
          'psychologist',
          'psychiatrist', 
          'therapist',
          'mental health clinic',
          'counselor',
          'psychological services',
          'психолог',
          'психиатр',
          'психологическая помощь'
        ];
        
        let allResults = [];
        
        // Search for each query
        for (const query of searchQueries) {
          try {
            const response = await axios.get(
              `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=${filters.distance}&type=health&keyword=${query}&key=${GOOGLE_API_KEY}`
            );
            
            if (response.data && response.data.results) {
              allResults = [...allResults, ...response.data.results];
            }
          } catch (error) {
            console.error(`Error searching for ${query}:`, error);
          }
        }
        
        // Remove duplicates based on place_id
        const uniqueResults = allResults.filter((place, index, self) =>
          index === self.findIndex(p => p.place_id === place.place_id)
        );
        
        // Filter to only include mental health specialists
        const mentalHealthPlaces = uniqueResults.filter(place => 
          isMentalHealthSpecialist(place)
        );
        
        if (mentalHealthPlaces.length > 0) {
          // Process the results from Google Places API
          const therapistsData = mentalHealthPlaces.map(place => {
            // Calculate distance
            const distance = calculateDistance(
              latitude, 
              longitude,
              place.geometry.location.lat,
              place.geometry.location.lng
            );
            
            const specialization = determineSpecialization(place);
            
            return {
              id: place.place_id,
              name: place.name,
              specialization: specialization,
              rating: place.rating || 0,
              reviewCount: place.user_ratings_total || 0,
              address: place.vicinity,
              phone: place.international_phone_number || '',
              image: place.photos && place.photos.length > 0 ? 
                    `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${place.photos[0].photo_reference}&key=${GOOGLE_API_KEY}` : 
                    'https://via.placeholder.com/150',
              lat: place.geometry.location.lat,
              lng: place.geometry.location.lng,
              distance: distance,
              place_id: place.place_id,
              city: selectedCity?.name || t('therapy.currentLocation')
            };
          });
          
          // Apply filters
          let filtered = applyCurrentFilters(therapistsData);
          
          // Sort by distance
          filtered.sort((a, b) => a.distance - b.distance);
          
          setTherapists(filtered);
          setFilteredTherapists(filtered);
        } else {
          setTherapists([]);
          setFilteredTherapists([]);
        }
      } catch (error) {
        console.error('Error fetching nearby therapists:', error);
        Alert.alert(
          t('common.error'),
          t('therapy.errorFindingSpecialists')
        );
        setTherapists([]);
        setFilteredTherapists([]);
      } finally {
        setIsLoading(false);
      }
    };

    // Apply current filters to therapists data
    const applyCurrentFilters = (therapistsData) => {
      let filtered = [...therapistsData];
      
      // Filter by specializations if any selected
      if (filters.specializations && filters.specializations.length > 0) {
        filtered = filtered.filter(therapist => 
          filters.specializations.includes(therapist.specialization)
        );
      }
      
      // Filter by rating if needed
      if (filters.rating > 0) {
        filtered = filtered.filter(therapist => therapist.rating >= filters.rating);
      }
      
      // Filter by languages if any selected (this would need to be implemented with place details)
      // For now, we'll skip language filtering as it requires additional API calls
      
      return filtered;
    };

    // Fetch detailed information about a selected therapist
    const fetchTherapistDetails = async (therapist) => {
      try {
        const response = await axios.get(
          `https://maps.googleapis.com/maps/api/place/details/json?place_id=${therapist.place_id}&fields=name,formatted_address,formatted_phone_number,website,opening_hours,rating,review&key=${GOOGLE_API_KEY}`
        );
        
        if (response.data && response.data.result) {
          const details = response.data.result;
          const updatedTherapist = {
            ...therapist,
            address: details.formatted_address || therapist.address,
            phone: details.formatted_phone_number || therapist.phone,
            website: details.website || '',
            availability: details.opening_hours ? 
                      details.opening_hours.weekday_text.join('\n') : 
                      t('therapy.hoursNotAvailable'),
            reviews: details.reviews || []
          };
          
          // Navigate to details page with enhanced data
          navigation.navigate('TherapistDetail', { therapist: updatedTherapist });
        } else {
          // Navigate with existing data if detailed fetch fails
          navigation.navigate('TherapistDetail', { therapist });
        }
      } catch (error) {
        console.error('Error fetching therapist details:', error);
        // Navigate with existing data if detailed fetch fails
        navigation.navigate('TherapistDetail', { therapist });
      }
    };

    // Calculate distance between two coordinates in kilometers
    const calculateDistance = (lat1, lon1, lat2, lon2) => {
      const R = 6371; // Radius of the earth in km
      const dLat = deg2rad(lat2 - lat1);
      const dLon = deg2rad(lon2 - lon1);
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const distance = R * c; // Distance in km
      return distance;
    };

    const deg2rad = (deg) => {
      return deg * (Math.PI / 180);
    };

    useEffect(() => {
      if (searchQuery.trim() === '') {
        setFilteredTherapists(therapists);
        return;
      }

      const filtered = therapists.filter(
        therapist => 
          therapist.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          therapist.specialization?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      
      setFilteredTherapists(filtered);
    }, [searchQuery, therapists]);

    const applyFilters = (selectedFilters) => {
      setFilters(selectedFilters);
      
      // Handle city selection
      if (selectedFilters.city && selectedFilters.city.name !== selectedCity?.name) {
        setSelectedCity(selectedFilters.city);
      } else {
        // Apply filters to current therapists list
        const filtered = applyCurrentFilters(therapists);
        setFilteredTherapists(filtered);
      }
    };

    const handleTherapistSelect = (therapist) => {
      setSelectedTherapist(therapist);
      if (mapView && mapRef.current) {
        mapRef.current.animateToRegion({
          latitude: therapist.lat,
          longitude: therapist.lng,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01
        }, 1000);
      } else {
        // Fetch more details before navigating to detail page
        fetchTherapistDetails(therapist);
      }
    };

    const toggleView = () => {
      setMapView(!mapView);
    };

    // Get the current location display name
    const getCurrentLocationName = () => {
      if (selectedCity && selectedCity.name !== t('therapy.currentLocation')) {
        return selectedCity.name;
      }
      return t('therapy.nearMe');
    };

    if (isLoading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>
            {t('therapy.findingSpecialists')} {getCurrentLocationName()}...
          </Text>
        </View>
      );
    }

    return (
      <SafeAreaView style={styles.container}>
        <LinearGradient
          colors={['#03174C', '#03174C']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradientContainer}
        >
          {/* Fixed Header with Location */}
          <View style={styles.fixedHeaderContainer}>
            {/* Main Header */}
            <View style={styles.headerRow}>
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Ionicons name="chevron-back" size={24} color="white" />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>{t('therapy.findSpecialists')}</Text>
              <TouchableOpacity onPress={() => setModalVisible(true)}>
              
              </TouchableOpacity>
            </View>

            {/* Location Header - Always visible */}
            <LocationHeader 
              currentLocation={getCurrentLocationName()} 
              onPress={() => setModalVisible(true)} 
            />
          </View>

          {/* Search Bar & View Toggle */}
          <View style={[styles.searchContainer, styles.searchContainerAdjusted]}>
            <View style={styles.searchInputContainer}>
              <Ionicons name="search" size={20} color="rgba(255,255,255,0.7)" style={styles.searchIcon} />
              <TextInput
                style={styles.searchInput}
                placeholder={t('therapy.searchPlaceholder')}
                placeholderTextColor="rgba(255,255,255,0.5)"
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>
            <TouchableOpacity style={styles.viewToggleButton} onPress={toggleView}>
              <Ionicons name={mapView ? "list" : "map"} size={24} color="white" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.filterButton} onPress={() => setModalVisible(true)}>
              <Ionicons name="options" size={22} color="white" />
            </TouchableOpacity>
          </View>

          {/* Results Counter */}
          <View style={styles.resultsCountContainer}>
            <Text style={styles.resultsCountText}>
              {filteredTherapists.length} {t('therapy.specialistsFound')}
            </Text>
          </View>

          {/* Map View or List View */}
          {mapView ? (
            <View style={styles.mapContainer}>
              {(location || (selectedCity && selectedCity.name !== t('therapy.currentLocation'))) ? (
                <>
                  <MapView
                    ref={mapRef}
                    style={styles.map}
                    provider={PROVIDER_DEFAULT}
                    initialRegion={{
                      latitude: selectedCity && selectedCity.name !== t('therapy.currentLocation')
                        ? selectedCity.lat 
                        : (location ? location.coords.latitude : kazakhstanCities[1].lat),
                      longitude: selectedCity && selectedCity.name !== t('therapy.currentLocation')
                        ? selectedCity.lng 
                        : (location ? location.coords.longitude : kazakhstanCities[1].lng),
                      latitudeDelta: 0.02,
                      longitudeDelta: 0.02,
                    }}
                    showsUserLocation={true}
                    showsCompass={true}
                    showsScale={true}
                    showsBuildings={true}
                    showsTraffic={false}
                    showsIndoors={true}
                    rotateEnabled={true}
                    loadingEnabled={true}
                    loadingIndicatorColor="#007AFF"
                    loadingBackgroundColor="#03174C"
                  >
                    {filteredTherapists.map((therapist) => (
                      <CustomMarker
                        key={therapist.id}
                        therapist={therapist}
                        onPress={() => handleTherapistSelect(therapist)}
                        isSelected={selectedTherapist?.id === therapist.id}
                      />
                    ))}
                  </MapView>
                  
                  {/* Map Controls */}
                  <View style={styles.mapControlsContainer}>
                    <TouchableOpacity 
                      style={styles.mapControlButton}
                      onPress={() => {
                        if (mapRef.current) {
                          if (selectedCity && selectedCity.name !== t('therapy.currentLocation')) {
                            mapRef.current.animateToRegion({
                              latitude: selectedCity.lat,
                              longitude: selectedCity.lng,
                              latitudeDelta: 0.02,
                              longitudeDelta: 0.02,
                            }, 1000);
                          } else if (location) {
                            mapRef.current.animateToRegion({
                              latitude: location.coords.latitude,
                              longitude: location.coords.longitude,
                              latitudeDelta: 0.02,
                              longitudeDelta: 0.02,
                            }, 1000);
                          }
                        }
                      }}
                    >
                      <Ionicons name="locate" size={22} color="#03174C" />
                    </TouchableOpacity>
                  </View>
                </>
              ) : (
                <View style={styles.locationErrorContainer}>
                  <Text style={styles.locationErrorText}>
                    {errorMsg || t('therapy.locationAccessError')}
                  </Text>
                  <TouchableOpacity 
                    style={styles.retryButton} 
                    onPress={requestLocationPermission}
                  >
                    <Text style={styles.retryButtonText}>{t('common.retry')}</Text>
                  </TouchableOpacity>
                </View>
              )}
              
              {/* Bottom Sheet for Map View */}
              {selectedTherapist && (
                <View style={styles.bottomSheet}>
                  <TherapistCard 
                    therapist={selectedTherapist} 
                    onPress={() => fetchTherapistDetails(selectedTherapist)}
                    compact={true}
                  />
                </View>
              )}
            </View>
          ) : (
            <Animated.FlatList
              data={filteredTherapists}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.listContainer}
              onScroll={Animated.event(
                [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                { useNativeDriver: true }
              )}
              renderItem={({ item }) => (
                <TherapistCard 
                  therapist={item} 
                  onPress={() => handleTherapistSelect(item)}
                  compact={false}
                />
              )}
              showsVerticalScrollIndicator={false}
              ListEmptyComponent={
                <View style={styles.emptyResultsContainer}>
                  <Ionicons name="search-outline" size={60} color="rgba(255,255,255,0.5)" />
                  <Text style={styles.emptyResultsText}>{t('therapy.noSpecialistsFound')}</Text>
                  <Text style={styles.emptyResultsSubtext}>{t('therapy.tryAdjustingFilters')}</Text>
                </View>
              }
            />
          )}

          {/* Filter Modal */}
          <FilterModal
            visible={modalVisible}
            onClose={() => setModalVisible(false)}
            currentFilters={filters}
            onApply={applyFilters}
            cities={kazakhstanCities}
            selectedCity={selectedCity}
          />
        </LinearGradient>
      </SafeAreaView>
    );
  } catch (error) {
    // Fallback UI in case of rendering errors
    console.error("Error rendering Therapy component:", error);
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#03174C' }}>
        <Text style={{ color: 'white', fontSize: 16, marginBottom: 20 }}>
          {t('therapy.somethingWentWrong')}
        </Text>
        <TouchableOpacity 
          style={{ 
            backgroundColor: '#007AFF', 
            paddingVertical: 10, 
            paddingHorizontal: 20, 
            borderRadius: 10 
          }}
          onPress={() => navigation.goBack()}
        >
          <Text style={{ color: 'white', fontSize: 16 }}>{t('common.goBack')}</Text>
        </TouchableOpacity>
      </View>
    );
  }
};

export default Therapy;