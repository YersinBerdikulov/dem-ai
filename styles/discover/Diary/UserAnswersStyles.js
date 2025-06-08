// src/styles/diary/userAnswers.styles.js
import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: "#03174C",
  },

  // Header Section
  headerSection: {
    backgroundColor: "#E6EEF8",
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    paddingTop: 16,
    paddingBottom: 16,
  },

  navigationHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  disabledDate: {
    opacity: 0.5,
    backgroundColor: '#E0E0E0',
  },
  disabledText: {
    color: '#999',
  },

  backIcon: {
    fontSize: 24,
    color: "#03174C",
    fontFamily: "Poppins-Regular",
  },

  headerTitle: {
    fontSize: 18,
    color: "#03174C",
    fontFamily: "Poppins-Bold",
  },

  archiveButton: {
    backgroundColor: "#D1DAE3",
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 16,
  },

  archiveText: {
    fontSize: 14,
    color: "#03174C",
    fontFamily: "Poppins-Regular",
  },

  monthTitle: {
    fontSize: 16,
    color: "#03174C",
    fontFamily: "Poppins-Medium",
    textAlign: "center",
    marginBottom: 12,
  },

  // Calendar Section
  calendarContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 12,
  },

  arrowButton: {
    padding: 8,
  },

  arrowText: {
    fontSize: 16,
    color: "#03174C",
    fontFamily: "Poppins-Medium",
  },

  dateList: {
    flexGrow: 0,
  },

  dateItem: {
    alignItems: "center",
    justifyContent: "center",
    width: 45,
    height: 64,
    marginHorizontal: 4,
    borderRadius: 12,
    backgroundColor: "#F5F5F5",
  },

  todayItem: {
    backgroundColor: "#736EFE",
  },

  selectedDate: {
    backgroundColor: "#A29BFE",
  },

  dayText: {
    fontSize: 12,
    color: "#03174C",
    fontFamily: "Poppins-Regular",
    marginBottom: 4,
  },

  dateText: {
    fontSize: 14,
    color: "#03174C",
    fontFamily: "Poppins-Bold",
  },

  activeText: {
    color: "white",
  },

  // Content Section
  contentContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },

  moodContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 16,
  },

  moodTag: {
    backgroundColor: "#E6EEF8",
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginHorizontal: 6,
    fontSize: 14,
    color: "#03174C",
    fontFamily: "Poppins-Medium",
  },

  userResponseText: {
    fontSize: 14,
    color: "white",
    fontFamily: "Poppins-Regular",
    textAlign: "center",
    marginBottom: 24,
  },

  title: {
    fontSize: 20,
    color: "white",
    fontFamily: "Poppins-Bold",
    marginBottom: 16,
  },

  questionContainer: {
    marginBottom: 16,
  },

  questionText: {
    fontSize: 16,
    color: "white",
    fontFamily: "Poppins-Medium",
    marginBottom: 8,
  },

  userResponse: {
    fontSize: 14,
    color: "#A29BFE",
    fontFamily: "Poppins-Regular",
  },

  changeDiaryButton: {
    backgroundColor: "#736EFE",
    paddingVertical: 14,
    borderRadius: 25,
    alignItems: "center",
    marginTop: 'auto',
    marginBottom: 20,
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
});

export default styles;