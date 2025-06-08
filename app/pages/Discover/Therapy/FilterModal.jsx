// FilterModal.jsx
import React, { useState, useEffect } from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet, ScrollView, Switch, Dimensions, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import { useLanguage } from '../../../context/LanguageContext';

const { width } = Dimensions.get('window');

const FilterModal = ({ visible, onClose, currentFilters, onApply, cities, selectedCity }) => {
  const { t } = useLanguage();

  // Get translated specializations
  const getSpecializations = () => [
    t('therapy.specializations.psychologist'),
    t('therapy.specializations.psychiatrist'),
    t('therapy.specializations.therapist'),
    t('therapy.specializations.childPsychologist'),
    t('therapy.specializations.familyTherapist'),
    t('therapy.specializations.cognitiveTherapist'),
    t('therapy.specializations.counselor'),
    t('therapy.specializations.mentalHealthClinic'),
    t('therapy.specializations.neuropsychologist'),
    t('therapy.specializations.addictionSpecialist')
  ];

  // Get translated languages
  const getLanguages = () => [
    t('therapy.language.kazakh'),
    t('therapy.language.russian'),
    t('therapy.language.english'),
    t('therapy.language.turkish'),
    t('therapy.language.uzbek'),
    t('therapy.language.uighur'),
    t('therapy.language.tatar'),
    t('therapy.language.german'),
    t('therapy.language.korean'),
    t('therapy.language.chinese')
  ];

  const specializations = getSpecializations();
  const languages = getLanguages();

  const [filters, setFilters] = useState(currentFilters);
  const [selectedSpecializations, setSelectedSpecializations] = useState([]);
  const [selectedLanguages, setSelectedLanguages] = useState([]);
  const [citySelection, setCitySelection] = useState(selectedCity || cities[0]);

  useEffect(() => {
    setFilters(currentFilters);
    setSelectedSpecializations(currentFilters.specializations || []);
    setSelectedLanguages(currentFilters.languages || []);
    setCitySelection(selectedCity || cities[0]);
  }, [currentFilters, visible, selectedCity]);

  const toggleSpecialization = (specialization) => {
    if (selectedSpecializations.includes(specialization)) {
      setSelectedSpecializations(selectedSpecializations.filter(s => s !== specialization));
    } else {
      setSelectedSpecializations([...selectedSpecializations, specialization]);
    }
  };

  const toggleLanguage = (language) => {
    if (selectedLanguages.includes(language)) {
      setSelectedLanguages(selectedLanguages.filter(l => l !== language));
    } else {
      setSelectedLanguages([...selectedLanguages, language]);
    }
  };

  const handleCitySelection = (city) => {
    setCitySelection(city);
  };

  const handleApply = () => {
    const newFilters = {
      ...filters,
      specializations: selectedSpecializations,
      languages: selectedLanguages,
      city: citySelection
    };
    onApply(newFilters);
    onClose();
  };

  const resetFilters = () => {
    setFilters({
      specializations: [],
      distance: 5000, // 5km in meters for Google API
      rating: 0,
      videoSessions: false,
      languages: [],
      city: cities[0] // Reset to current location
    });
    setSelectedSpecializations([]);
    setSelectedLanguages([]);
    setCitySelection(cities[0]);
  };

  const getDisplayCityName = (city) => {
    if (city.name === 'Current Location') {
      return t('therapy.currentLocation');
    }
    return city.name;
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#03174C" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>{t('therapy.filterSpecialists')}</Text>
            <TouchableOpacity onPress={resetFilters} style={styles.resetButton}>
              <Text style={styles.resetText}>{t('common.reset')}</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
            {/* City Selection */}
            <View style={styles.filterSection}>
              <Text style={styles.sectionTitle}>{t('therapy.city')}</Text>
              <View style={styles.citiesGrid}>
                {cities.map((city) => (
                  <TouchableOpacity
                    key={city.name}
                    style={[
                      styles.cityChip,
                      citySelection?.name === city.name && styles.selectedCityChip
                    ]}
                    onPress={() => handleCitySelection(city)}
                  >
                    <Text
                      style={[
                        styles.cityChipText,
                        citySelection?.name === city.name && styles.selectedCityChipText
                      ]}
                    >
                      {getDisplayCityName(city)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Distance Filter */}
            <View style={styles.filterSection}>
              <Text style={styles.sectionTitle}>{t('therapy.searchRadius')}</Text>
              <View style={styles.sliderContainer}>
                <Slider
                  style={styles.slider}
                  minimumValue={1000}
                  maximumValue={50000}
                  step={1000}
                  value={filters.distance}
                  onValueChange={(value) => setFilters({...filters, distance: value})}
                  minimumTrackTintColor="#007AFF"
                  maximumTrackTintColor="rgba(0, 122, 255, 0.2)"
                  thumbTintColor="#007AFF"
                />
                <View style={styles.sliderLabels}>
                  <Text style={styles.sliderValue}>{(filters.distance / 1000).toFixed(0)} {t('therapy.kilometers')}</Text>
                </View>
              </View>
            </View>

            {/* Rating Filter */}
            <View style={styles.filterSection}>
              <Text style={styles.sectionTitle}>{t('therapy.minimumRating')}</Text>
              <View style={styles.starContainer}>
                {[1, 2, 3, 4, 5].map(star => (
                  <TouchableOpacity
                    key={star}
                    onPress={() => setFilters({...filters, rating: star})}
                  >
                    <Ionicons
                      name={filters.rating >= star ? "star" : "star-outline"}
                      size={32}
                      color={filters.rating >= star ? "#FFD700" : "#ccc"}
                      style={styles.star}
                    />
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Video Sessions Filter */}
            <View style={styles.filterSection}>
              <View style={styles.switchRow}>
                <Text style={styles.sectionTitle}>{t('therapy.onlineConsultations')}</Text>
                <Switch
                  trackColor={{ false: "#ccc", true: "rgba(0, 122, 255, 0.4)" }}
                  thumbColor={filters.videoSessions ? "#007AFF" : "#f4f3f4"}
                  ios_backgroundColor="#ccc"
                  onValueChange={() => setFilters({...filters, videoSessions: !filters.videoSessions})}
                  value={filters.videoSessions}
                />
              </View>
              <Text style={styles.noteText}>
                {t('therapy.onlineConsultationsNote')}
              </Text>
            </View>

            {/* Specializations Filter */}
            <View style={styles.filterSection}>
              <Text style={styles.sectionTitle}>{t('therapy.specialization')}</Text>
              <View style={styles.chipsContainer}>
                {specializations.map((specialization) => (
                  <TouchableOpacity
                    key={specialization}
                    style={[
                      styles.chip,
                      selectedSpecializations.includes(specialization) && styles.selectedChip
                    ]}
                    onPress={() => toggleSpecialization(specialization)}
                  >
                    <Text
                      style={[
                        styles.chipText,
                        selectedSpecializations.includes(specialization) && styles.selectedChipText
                      ]}
                    >
                      {specialization}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Languages Filter */}
            <View style={styles.filterSection}>
              <Text style={styles.sectionTitle}>{t('therapy.languages')}</Text>
              <Text style={styles.noteText}>
                {t('therapy.languageFilterNote')}
              </Text>
              <View style={styles.chipsContainer}>
                {languages.map((language) => (
                  <TouchableOpacity
                    key={language}
                    style={[
                      styles.chip,
                      selectedLanguages.includes(language) && styles.selectedChip
                    ]}
                    onPress={() => toggleLanguage(language)}
                  >
                    <Text
                      style={[
                        styles.chipText,
                        selectedLanguages.includes(language) && styles.selectedChipText
                      ]}
                    >
                      {language}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </ScrollView>

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.applyButton} onPress={handleApply}>
              <Text style={styles.applyButtonText}>{t('therapy.applyFilters')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: '85%',
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  closeButton: {
    padding: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#03174C',
    fontFamily: 'Poppins-SemiBold',
  },
  resetButton: {
    padding: 5,
  },
  resetText: {
    fontSize: 14,
    color: '#007AFF',
    fontFamily: 'Poppins-Medium',
  },
  modalContent: {
    flex: 1,
  },
  filterSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#03174C',
    marginBottom: 12,
    fontFamily: 'Poppins-Medium',
  },
  sliderContainer: {
    width: '100%',
  },
  slider: {
    width: '100%',
    height: 40,
  },
  sliderLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  sliderValue: {
    fontSize: 14,
    color: '#03174C',
    fontFamily: 'Poppins-Regular',
  },
  starContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  star: {
    marginRight: 8,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  noteText: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
    fontStyle: 'italic',
    fontFamily: 'Poppins-Regular',
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  chip: {
    backgroundColor: 'rgba(3, 23, 76, 0.08)',
    borderRadius: 16,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginRight: 8,
    marginBottom: 8,
  },
  selectedChip: {
    backgroundColor: 'rgba(0, 122, 255, 0.15)',
  },
  chipText: {
    fontSize: 14,
    color: '#03174C',
    fontFamily: 'Poppins-Regular',
  },
  selectedChipText: {
    color: '#007AFF',
    fontFamily: 'Poppins-Medium',
  },
  buttonContainer: {
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.05)',
  },
  applyButton: {
    backgroundColor: '#007AFF',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
  },
  applyButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Poppins-SemiBold',
  },
  citiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
  },
  cityChip: {
    backgroundColor: 'rgba(3, 23, 76, 0.08)',
    borderRadius: 16,
    paddingVertical: 10,
    paddingHorizontal: 12,
    margin: 4,
    minWidth: '30%',
    alignItems: 'center',
  },
  selectedCityChip: {
    backgroundColor: 'rgba(0, 122, 255, 0.15)',
  },
  cityChipText: {
    fontSize: 14,
    color: '#03174C',
    fontFamily: 'Poppins-Regular',
    textAlign: 'center',
  },
  selectedCityChipText: {
    color: '#007AFF',
    fontFamily: 'Poppins-Medium',
  },
});

export default FilterModal;