import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');
// affirmationStyles.js
const PETAL_SIZE = width * 0.35; // Increased size

export const affirmationStyles = StyleSheet.create({
 container: {
   flex: 1,
   backgroundColor: '#03174C',
 },
 content: {
   flex: 1,
   alignItems: 'center',
   justifyContent: 'center',
 },
 centerCircle: {
   width: width * 0.2,
   height: width * 0.2,
   borderRadius: width * 0.1,
   backgroundColor: '#03174C',
   alignItems: 'center',
   justifyContent: 'center',
   position: 'absolute',
   zIndex: 3,
 },
 centerText: {
   color: 'white',
   fontSize: 24,
   fontFamily: 'Poppins-Bold',
 },
 affirmationsContainer: {
   width: width,
   height: width,
   alignItems: 'center',
   justifyContent: 'center',
 },
 affirmationPetal: {
   position: 'absolute',
   width: PETAL_SIZE,
   height: PETAL_SIZE * 1.8,
   backgroundColor: 'transparent',
   alignItems: 'center',
   justifyContent: 'center',
   left: '50%',
   top: '50%',
   marginLeft: -PETAL_SIZE / 2,
   marginTop: -PETAL_SIZE,
   borderColor: '#4299E1',
   borderRadius: PETAL_SIZE,
   transform: [{ skewY: '-30deg' }],
 },
 selectedPetal: {
   backgroundColor: '#4299E1',
   borderWidth: 0,
 },
 affirmationText: {
   color: '#4299E1',
   fontSize: 16,
   fontFamily: 'Poppins-SemiBold',
   transform: [{ rotate: '30deg' }],
   width: PETAL_SIZE,
   textAlign: 'center',
 },
 selectedText: {
   color: 'white',
 }
});