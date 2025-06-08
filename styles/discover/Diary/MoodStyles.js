import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#03174C",
    alignItems: "center",
    justifyContent: "center",
  },
  questionText: {
    fontSize: 20,
    color: "white",
    fontWeight: "bold",
    marginBottom: 20,
  },
  moodItem: {
    backgroundColor: "#E6EEF8",
    padding: 15,
    borderRadius: 10,
    margin: 10,
    alignItems: "center",
  },
  moodText: {
    fontSize: 16,
    color: "#03174C",
  },
  nextButton: {
    backgroundColor: "#736EFE",
    paddingVertical: 12,
    paddingHorizontal: 50,
    borderRadius: 20,
    marginTop: 20,
  },
  buttonText: {
    fontSize: 16,
    color: "white",
  },
});

export default styles;
