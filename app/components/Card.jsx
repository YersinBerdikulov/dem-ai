import React from 'react';
import { TouchableOpacity, Text, View, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const Card = ({ title, subtitle, icon, onPress, gradientColors = ['#FAB2FF', '#1904E5'] }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="m-2 rounded-xl overflow-hidden"
    >
      <LinearGradient
        colors={gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="p-4 h-40 justify-between"
      >
        <View className="flex-row justify-between items-start">
          <View className="flex-1">
            <Text className="text-white text-xl font-bold mb-2">{title}</Text>
            {subtitle && (
              <Text className="text-white/80 text-sm">{subtitle}</Text>
            )}
          </View>
          <Image
            source={icon}
            className="w-12 h-12"
            resizeMode="contain"
          />
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
};

export default Card;