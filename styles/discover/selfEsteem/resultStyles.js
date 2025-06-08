import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
 container: {
   flex: 1,
   backgroundColor: '#03174C',
 },
 header: {
   flexDirection: 'row',
   alignItems: 'center',
   paddingHorizontal: 16,
   paddingTop: 16,
   marginBottom: 24,
 },
 headerIcon: {
   width: 32,
   justifyContent: 'center',
 },
 title: {
   flex: 1,
   color: 'white',
   fontSize: 20,
   fontFamily: 'Poppins-SemiBold',
   textAlign: 'center',
 },
 scrollView: {
   flex: 1,
 },
 scrollContent: {
   padding: 16,
 },
 content: {
   flex: 1,
 },
 scoreSection: {
   alignItems: 'center',
   marginBottom: 24,
 },
 circleContainer: {
   position: 'relative',
   width: 200,
   height: 200,
   alignItems: 'center',
   justifyContent: 'center',
 },
 scoreTextContainer: {
   position: 'absolute',
   alignItems: 'center',
 },
 scoreText: {
   color: 'white',
   fontSize: 32,
   fontFamily: 'Poppins-Bold',
 },
 scoreLabel: {
   color: 'white',
   fontSize: 14,
   fontFamily: 'Poppins',
   opacity: 0.8,
 },
 feedbackCard: {
   backgroundColor: '#8B7FFF',
   borderRadius: 16,
   padding: 20,
   marginBottom: 16,
 },
 feedbackText: {
   color: 'white',
   fontSize: 18,
   fontFamily: 'Poppins-Medium',
   textAlign: 'center',
   lineHeight: 26,
 },
 insightsCard: {
   backgroundColor: '#8B7FFF',
   borderRadius: 16,
   padding: 20,
   marginBottom: 16,
 },
 insightsTitle: {
   color: 'white',
   fontSize: 16,
   fontFamily: 'Poppins-Medium',
   marginBottom: 12,
 },
 insightText: {
   color: 'white',
   fontSize: 14,
   fontFamily: 'Poppins',
   lineHeight: 22,
 },
 loadingText: {
   color: 'white',
   fontSize: 14,
   fontFamily: 'Poppins',
   marginTop: 12,
   textAlign: 'center',
 },
 disclaimer: {
   color: 'white',
   fontSize: 12,
   fontFamily: 'Poppins',
   textAlign: 'center',
   opacity: 0.7,
   lineHeight: 18,
   marginBottom: 24,
   paddingHorizontal: 16,
 },
 doneButton: {
   backgroundColor: '#8B7FFF',
   borderRadius: 30,
   padding: 16,
   alignItems: 'center',
   marginBottom: 24,
 },
 doneButtonText: {
   color: 'white',
   fontSize: 16,
   fontFamily: 'Poppins-Medium',
 }
});