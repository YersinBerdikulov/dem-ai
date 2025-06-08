// Affirmation.jsx
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, Animated, Easing,Dimensions } from 'react-native';
import { affirmationStyles as styles } from '../../../styles/discover/affirmationStyles';
const { width } = Dimensions.get('window');
const Affirmationss = () => {
 const [selectedAffirmations, setSelectedAffirmations] = useState([]);
 const spinValue = new Animated.Value(0);
 const scaleValue = new Animated.Value(1);

 const affirmations = [
   'beautiful', 'calm', 'worthy', 'free',
   'successful', 'confident', 'honest', 'responsible', 
   'strong', 'talented', 
 ]

 useEffect(() => {
   Animated.loop(
     Animated.sequence([
       Animated.timing(spinValue, {
         toValue: 1,
         duration: 30000,
         easing: Easing.linear,
         useNativeDriver: true
       }),
     ])
   ).start();
 }, []);

 const spin = spinValue.interpolate({
   inputRange: [0, 1],
   outputRange: ['0deg', '360deg']
 });

const toggleAffirmation = (affirmation) => {
 const rotateAmount = selectedAffirmations.length * 22.5;
 Animated.timing(spinValue, {
   toValue: rotateAmount,
   duration: 300,
   useNativeDriver: true
 }).start();
 
 if (selectedAffirmations.includes(affirmation)) {
   setSelectedAffirmations(prev => prev.filter(item => item !== affirmation));
 } else {
   setSelectedAffirmations(prev => [...prev, affirmation]);
 }
};

 return (
   <SafeAreaView style={styles.container}>
     <Animated.View style={[styles.content, { transform: [{ scale: scaleValue }] }]}>
       <View style={styles.centerCircle}>
         <Text style={styles.centerText}>I AM</Text>
       </View>
       <Animated.View style={[styles.affirmationsContainer, { transform: [{ rotate: spin }] }]}>
                {affirmations.map((affirmation, index) => (
            <TouchableOpacity
            key={index}
            style={[
                styles.affirmationPetal,
                selectedAffirmations.includes(affirmation) && styles.selectedPetal,
                {
                transform: [
                    { rotate: `${(index * (360 / affirmations.length))}deg` },
                    { translateY: -width * 0.4 }
                ]
                }
            ]}
            onPress={() => toggleAffirmation(affirmation)}
            >
            <Text style={[
                styles.affirmationText,
                selectedAffirmations.includes(affirmation) && styles.selectedText
            ]}>
                {affirmation}
            </Text>
            </TouchableOpacity>
         ))}
       </Animated.View>
     </Animated.View>
   </SafeAreaView>
 );
};
export default Affirmation;