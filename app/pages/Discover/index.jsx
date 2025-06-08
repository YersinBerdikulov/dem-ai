import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Keyboard,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { discoverStyles as styles } from '../../../styles/discover/discoverStyles';
import DiscoverCard from '../../components/DiscoverCard';
import { useLanguage } from '../../context/LanguageContext';

const Discover = ({ navigation }) => {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredCards, setFilteredCards] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  // Get localized discover cards
  const getDiscoverCards = () => [
    {
      id: 'habits',
      title: t('discover.cards.habits'),
      sessions: 20,
      colors: ['#C219CD', '#01A0A3'],
      route: 'Habits',
      icon: require('../../../assets/icons/habits.png'),
      tags: [t('discover.tags.habits'), t('discover.tags.routine'), t('discover.tags.lifestyle')]
    },
    {
      id: 'therapy',
      title: t('discover.cards.therapy'),
      sessions: 20,
      colors: ['#52E5E7', '#130CB7'],
      route: 'Therapy',
      icon: require('../../../assets/icons/therapist.png'),
      tags: [t('discover.tags.therapy'), t('discover.tags.counseling'), t('discover.tags.mentalHealth')]
    },
    {
      id: 'relaxation',
      title: t('discover.cards.relaxation'),
      sessions: 1,
      colors: ['#79F1A4', '#0E5CAD'],
      route: 'BreathingStarts',
      icon: require('../../../assets/images/breathing1.png'),
      tags: [t('discover.tags.relaxation'), t('discover.tags.breathing'), t('discover.tags.calm')]
    },
    {
      id: 'games',
      title: t('discover.cards.games'),
      sessions: 4,
      colors: ['#1BAD7D', '#04D988'],
      route: 'Games',
      icon: require('../../../assets/images/game-cion.png'),
      tags: [t('discover.tags.games'), t('discover.tags.fun'), t('discover.tags.entertainment')]
    },
    {
      id: 'affirmation',
      title: t('discover.cards.affirmation'),
      sessions: 20,
      colors: ['#F05F57', '#360940'],
      route: 'Affirmation',
      icon: require('../../../assets/icons/affirmation1.png'),
      tags: [t('discover.tags.affirmation'), t('discover.tags.positivity'), t('discover.tags.motivation')]
    },
    {
      id: 'test',
      title: t('discover.cards.test'),
      sessions: 4,
      colors: ['#65FDF0', '#1D6FA3'],
      route: 'Test',
      icon: require('../../../assets/images/test.png'),
      tags: [t('discover.tags.test'), t('discover.tags.personality'), t('discover.tags.assessment')]
    },
    {
      id: 'nature',
      title: t('discover.cards.nature'),
      sessions: 6,
      colors: ['#C9778E', '#FCFF95'],
      route: 'NatureSounds',
      icon: require('../../../assets/images/nature.png'),
      tags: [t('discover.tags.nature'), t('discover.tags.sounds'), t('discover.tags.ambient')]
    },
    {
      id: 'news',
      title: t('discover.cards.news'),
      sessions: 20,
      colors: ['#EE9AE5', '#5961F9'],
      route: 'News',
      icon: require('../../../assets/images/news.png'),
      tags: [t('discover.tags.news'), t('discover.tags.updates'), t('discover.tags.information')]
    },
    {
      id: 'meditation',
      title: t('discover.cards.meditation'),
      sessions: 10,
      colors: ['#B2B2B2', '#0D00FF'],
      route: 'Meditation',
      icon: require('../../../assets/images/meditation.png'),
      tags: [t('discover.tags.meditation'), t('discover.tags.mindfulness'), t('discover.tags.peace')]
    },
    {
      id: 'diary',
      title: t('discover.cards.diary'),
      sessions: 1,
      colors: ['#F6459F', '#6E0F59'],
      route: 'Diary',
      icon: require('../../../assets/images/diary23.png'),
      tags: [t('discover.tags.diary'), t('discover.tags.journal'), t('discover.tags.writing')]
    },
  ];

  // Initialize cards when component mounts or language changes
  useEffect(() => {
    const cards = getDiscoverCards();
    setFilteredCards(cards);
    // Re-filter if there's an active search
    if (searchQuery) {
      filterCards(searchQuery, cards);
    }
  }, [t]); // Re-run when translation function changes

  // Filter cards whenever search query changes
  useEffect(() => {
    const cards = getDiscoverCards();
    filterCards(searchQuery, cards);
  }, [searchQuery]);

  // Function to filter cards based on search query
  const filterCards = (query, cards = getDiscoverCards()) => {
    const normalizedQuery = query.trim().toLowerCase();
    
    if (!normalizedQuery) {
      // If search is empty, show all cards
      setFilteredCards(cards);
      setIsSearching(false);
      return;
    }
    
    setIsSearching(true);
    
    // Filter cards that match the search query in title or tags
    const filtered = cards.filter(card => 
      card.title.toLowerCase().includes(normalizedQuery) ||
      (card.tags && card.tags.some(tag => tag.toLowerCase().includes(normalizedQuery)))
    );
    
    setFilteredCards(filtered);
  };

  // Updated handleCardPress to pass source parameter for specific routes
  const handleCardPress = (route) => {
    // Special handling for routes that need source parameter
    if (route === 'BreathingStarts') {
      navigation.navigate(route, { 
        source: 'Discovery'
      });
    } else if (route === 'News') {
      navigation.navigate(route, { 
        source: 'Discovery'
      });
    } else if (route === 'NatureSounds') {
      navigation.navigate(route, { 
        source: 'Discovery'
      });
    } else {
      // For other routes, navigate normally
      navigation.navigate(route);
    }
  };

  const handleSearch = () => {
    Keyboard.dismiss();
    filterCards(searchQuery);
  };

  const clearSearch = () => {
    setSearchQuery('');
    const cards = getDiscoverCards();
    setFilteredCards(cards);
    setIsSearching(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content}>
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={24} color="rgba(255, 255, 255, 0.6)" />
          <TextInput
            style={styles.searchInput}
            placeholder={t('discover.searchPlaceholder')}
            placeholderTextColor="rgba(255, 255, 255, 0.6)"
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
          />
          {searchQuery ? (
            <TouchableOpacity onPress={clearSearch}>
              <Ionicons name="close-circle" size={24} color="rgba(255, 255, 255, 0.6)" />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={handleSearch}>
            
            </TouchableOpacity>
          )}
        </View>

        {/* Section Title - Show different text when searching */}
        <Text style={styles.sectionTitle}>
          {isSearching ? 
            (filteredCards.length > 0 ? 
              `${t('discover.searchResults')} (${filteredCards.length})` : 
              t('discover.noResultsFound')) : 
            t('discover.browseAll')}
        </Text>

        {/* No Results Message */}
        {isSearching && filteredCards.length === 0 && (
          <View style={styles.noResultsContainer}>
            <Ionicons name="search-outline" size={48} color="rgba(255, 255, 255, 0.4)" />
            <Text style={styles.noResultsText}>
              {t('discover.noMatches')} "{searchQuery}"
            </Text>
            <Text style={styles.noResultsSubtext}>
              {t('discover.tryDifferentKeywords')}
            </Text>
          </View>
        )}

        {/* Cards Grid - Now shows filtered cards */}
        {filteredCards.length > 0 && (
          <View style={styles.cardsGrid}>
            {filteredCards.map((card) => (
              <DiscoverCard
                key={card.id}
                title={card.title}
                sessions={card.sessions}
                colors={card.colors}
                icon={card.icon}
                onPress={() => handleCardPress(card.route)}
              />
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default Discover;