import React, { useState } from 'react';
import { View, Text, TextInput, Image, TouchableOpacity, FlatList, SafeAreaView, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import styles from '../../../../styles/Games/firstPage';
import { useLanguage } from '../../../context/LanguageContext';

const GameCard = ({ title, image, onPress }) => {
  return (
    <TouchableOpacity style={styles.gameCard} onPress={onPress}>
      <Image source={image} style={styles.gameImage} />
      <View style={styles.playButtonContainer}>
        <View style={styles.playButton}>
          <Ionicons name="play" size={20} color="white" />
        </View>
      </View>
      <Text style={styles.gameTitle}>{title}</Text>
    </TouchableOpacity>
  );
};

const Games = () => {
  const navigation = useNavigation();
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');

  const games = [
    {
      id: '1',
      title: t('games.connectTheDots'),
      image: require('../../../../assets/games/connectdots.jpg'),
      route: 'ConnectDotsGame'
    },
    {
      id: '2',
      title: t('games.mathGames'),
      image: require('../../../../assets/games/math.png'),
      route: 'MathGames'
    },
    {
      id: '3',
      title: t('games.matchingItems'),
      image: require('../../../../assets/games/memorygame.png'),
      route: 'MatchingItems'
    },
  ];

  const filteredGames = games.filter(game =>
    game.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const navigateToGame = (route) => {
    try {
      navigation.navigate(route);
    } catch (error) {
      console.error(`Navigation error: ${error.message}`);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#03174C" />
      <Text style={styles.pageTitle}>{t('games.title')}</Text>
      
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#8E8E93" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder={t('games.searchPlaceholder')}
          placeholderTextColor="#8E8E93"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <FlatList
        data={filteredGames}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <GameCard
            title={item.title}
            image={item.image}
            onPress={() => navigateToGame(item.route)}
          />
        )}
        contentContainerStyle={styles.gamesList}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

export default Games;