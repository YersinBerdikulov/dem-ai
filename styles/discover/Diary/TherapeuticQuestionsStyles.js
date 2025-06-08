// src/styles/diary/therapeuticQuestions.styles.js
import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: "#03174C",
  },

  // Header Styles
  headerBox: {
    width: "100%",
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
    top: 15,
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
    marginBottom: 10,
    marginRight:210
  },

  // Progress Bar
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
    width: "100%",
  },

  // Content Styles
  scrollContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },

  title: {
    fontSize: 20,
    fontFamily: "Poppins-Bold",
    color: "white",
    marginTop: 20,
    marginBottom: 20,
  },

  questionContainer: {
    marginBottom: 15,
  },

  questionText: {
    fontSize: 16,
    fontFamily: "Poppins-Medium",
    color: "white",
    marginBottom: 8,
  },

  input: {
    backgroundColor: "#E6EEF8",
    borderRadius: 15,
    paddingVertical: 12,
    paddingHorizontal: 15,
    fontSize: 14,
    fontFamily: "Poppins-Regular",
    color: "#03174C",
    marginBottom: 15,
    height: 45,
  },

  finishButton: {
    backgroundColor: "#736EFE",
    width: "100%",
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    marginBottom: 30,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },

  finishButtonText: {
    fontSize: 16,
    fontFamily: "Poppins-Bold",
    color: "white",
  },
});

export default styles;