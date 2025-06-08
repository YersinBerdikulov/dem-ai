// app/pages/Registration/SplashScreen.jsx
import React from 'react';
import { View, Text, Image, StyleSheet, Dimensions, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');
const CIRCLE_SIZE = width * 0.85; // Slightly smaller than screen width
const LOGO_SIZE = CIRCLE_SIZE * 0.95; // Logo takes up half of the circle

const SplashScreen = ({ navigation }) => {
  // Animation values
  const scaleAnim = React.useRef(new Animated.Value(0.3)).current;
  const opacityAnim = React.useRef(new Animated.Value(0)).current;
  const textOpacityAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    // Sequence of animations
    Animated.sequence([
      // Scale and fade in the circle
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
      // Then fade in the text
      Animated.timing(textOpacityAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();

    // Navigate to Login after animations
    const timer = setTimeout(() => {
      navigation.replace('Login');
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const animatedStyle = {
    transform: [{ scale: scaleAnim }],
    opacity: opacityAnim,
  };

  return (
    <View style={styles.container}>
      {/* Animated circle with gradient */}
      <Animated.View style={[styles.circleContainer, animatedStyle]}>
        <LinearGradient
          colors={['#FAB2FF', '#1904E5']}
          style={styles.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          {/* Logo */}
          <Image
            source={require('../../../assets/images/logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </LinearGradient>
      </Animated.View>

      {/* Tagline */}
      <Animated.Text 
        style={[
          styles.text,
          { opacity: textOpacityAnim }
        ]}
      >
        Take a deep Breath
      </Animated.Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#03174C',
    justifyContent: 'center',
    alignItems: 'center',
  },
  circleContainer: {
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    borderRadius: CIRCLE_SIZE / 2,
    overflow: 'hidden',
  },
  gradient: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: LOGO_SIZE,
    height: LOGO_SIZE,
    tintColor: '#FFFFFF', // Make sure logo is white
  },
  text: {
    color: 'white',
    fontSize: 24,
    fontFamily: 'Poppins-Medium',
    marginTop: 40,
    textAlign: 'center',
  },
});

export default SplashScreen;