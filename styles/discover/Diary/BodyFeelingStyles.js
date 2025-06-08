// src/styles/diary/bodyFeeling.styles.js
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: '#03174C',
  },
  
  // Header Styles
  headerBox: {

    backgroundColor: '#E6EEF8',
    
 
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    padding: 16,
    zIndex: 1,
    
  },
  
  backButton: {
    position: "absolute",
    left: 15,
    top: 12,
    padding: 10,
},
  
  backIcon: {
        flexDirection: "row",
        alignItems: "center",
        fontFamily: 'Poppins-Regular'
    },
  
  headerText: {
    fontSize: 18,
    fontWeight: "600",

    marginLeft: 28,
    color: "#000",
    fontFamily: 'Poppins-Bold',
},
  // Progress Bar
  progressBarContainer: {
    width: '90%',
    height: 6,
    backgroundColor: '#D9D9D9',
    borderRadius: 3,
    marginVertical: 15,
  },
  
  progressBar: {
    height: '100%',
    backgroundColor: '#736EFE',
    borderRadius: 3,
  },
  
  questionText: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: '#03174C',
    marginTop: 5,
  },
  
  // Feelings Grid
  feelingsGrid: {
    paddingTop: 20,
    paddingHorizontal: 10,
    alignItems: 'center',
  },
  
  feelingItem: {
    backgroundColor: '#E6EEF8',
    borderRadius: 15,
    width: 100,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  
  feelingEmoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  selectedFeelingItem: {
    backgroundColor: "#F0F0F0",
    borderColor: "#736EFE",
    borderWidth: 2,
},
  feelingText: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#03174C',
    textAlign: 'center',
  },
  
  // Next Button
  nextButton: {
    backgroundColor: '#736EFE',
    width: '90%',
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 'auto',
    marginBottom: 20,
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  
  buttonText: {
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
    color: 'white',
  },
});

export default styles;