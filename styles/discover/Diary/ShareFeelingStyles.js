// src/styles/diary/shareFeelings.styles.js
import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: "#03174C",
  },
  container: {
    flex: 1,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  headerBox: {
    backgroundColor: "#E6EEF8",
    paddingVertical: 15,
    paddingHorizontal: 20,
    alignItems: "center",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    paddingTop: 20,
    
  },
  backButton: {
    position: "absolute",
    left: 15,
    top: 12,
    padding: 10,
  },
  backIcon: {
    fontSize: 15,
    color: "#03174C",
    fontFamily: "Poppins-Regular",
  },
  headerText: {
    fontSize: 18,
    fontFamily: "Poppins-Bold",
    color: "#03174C",
    marginBottom: 7,
    marginRight:210
  },
  progressBarContainer: {
    width: "90%",
    height: 6,
    backgroundColor: "#D9D9D9",
    borderRadius: 3,
    marginVertical: 15,
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#736EFE",
    borderRadius: 3,
  },
  contentContainer: {
    flex: 1,
    padding: 20,
  },
  input: {
    backgroundColor: "#E6EEF8",
    width: "100%",
    height: 150,
    borderRadius: 15,
    padding: 15,
    fontSize: 16,
    color: "#03174C",
    fontFamily: "Poppins-Regular",
    textAlignVertical: "top",
  },
  buttonContainer: {
    padding: 20,
   
  },
  nextButton: {
    backgroundColor: "#736EFE",
    width: "100%",
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonText: {
    fontSize: 16,
    color: "white",
    fontFamily: "Poppins-Bold",
  },
  disabledButton: {
    backgroundColor: "#A29BFE",
    opacity: 0.6,
  },
});

export default styles;