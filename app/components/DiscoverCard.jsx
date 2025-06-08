// app/components/DiscoverCard.jsx
import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { discoverStyles as styles } from '../../styles/discover/discoverStyles';

// Helper function to ensure LinearGradient doesn't cause Android errors
const getSafeGradientProps = (colors, start = { x: 0, y: 0 }, end = { x: 1, y: 1 }) => {
  // Ensure we have at least 2 colors
  let safeColors;
  if (!colors) {
    safeColors = ['#03174C', '#03174C'];
  } else if (!Array.isArray(colors)) {
    safeColors = [colors, colors];
  } else if (colors.length === 0) {
    safeColors = ['#03174C', '#03174C'];
  } else if (colors.length === 1) {
    safeColors = [colors[0], colors[0]];
  } else {
    safeColors = colors;
  }
  
  // Ensure start and end positions are different
  let safeEnd = { ...end };
  if (start.x === end.x && start.y === end.y) {
    safeEnd = { x: end.x + 0.01, y: end.y + 0.01 };
  }
  
  return {
    colors: safeColors,
    start,
    end: safeEnd
  };
};

const DiscoverCard = ({ title, sessions, colors, icon, onPress }) => {
  // Use the helper function to ensure gradient props are safe
  const gradientProps = getSafeGradientProps(colors);
  
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <LinearGradient
        colors={gradientProps.colors}
        start={gradientProps.start}
        end={gradientProps.end}
        style={styles.card}
      >
        {/* Semi-transparent overlay */}
        <View style={styles.cardOverlay} />
        
        {/* Icon */}
        <Image
          source={icon}
          style={styles.cardIcon}
          resizeMode="contain"
        />

        {/* Content */}
        <View style={styles.cardContent}>
          <Text style={styles.cardTitle}>{title}</Text>
          <Text style={styles.cardSessions}>{sessions} sessions</Text>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
};

export default DiscoverCard;