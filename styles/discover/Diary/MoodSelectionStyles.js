import { StyleSheet, Dimensions } from "react-native";

const { width } = Dimensions.get("window");
const ITEM_SIZE = (width - 64) / 3; // 3 columns with padding

const styles = StyleSheet.create({
    safeContainer: {
        flex: 1,
        backgroundColor: "#03174C",
    },
    headerSection: {
        backgroundColor: "#E6EEF8",
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        padding: 16,
        zIndex: 1,
    },
    headerContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 16,
    },
    backButton: {
        flexDirection: "row",
        alignItems: "center",
        fontFamily: 'Poppins-Regular',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: "600",
   
        marginLeft: 8,
        color: "#000",
        fontFamily: 'Poppins-Bold',
    },
    progressBar: {
        height: 4,
        backgroundColor: "#E5E5E5",
        borderRadius: 2,
        marginBottom: 24,
    },
    progressFill: {
        width: "25%",
        height: "100%",
        backgroundColor: "#736EFE",
        borderRadius: 2,
    },
    questionText: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#000",
        marginBottom: 16,
    },
    toggleContainer: {
        flexDirection: "row",
        marginBottom: 8,
    },
    toggleButton: {
        paddingVertical: 8,
        paddingHorizontal: 24,
        borderRadius: 20,
        marginRight: 8,
        backgroundColor: "#F5F5F5",
    },
    activeToggleButton: {
        backgroundColor: "#736EFE",
    },
    activeToggleButtonNegative: {
        backgroundColor: "#03174C",
    },
    toggleText: {
        fontSize: 14,
        color: "#666",
    },
    activeToggleText: {
        color: "white",
        fontWeight: "500",
    },
    scrollView: {
        flex: 1,
    },
    scrollViewContent: {
        paddingBottom: 24,
    },
    moodGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        padding: 16,
        justifyContent: "space-between",
    },
    moodItem: {
        width: ITEM_SIZE,
        height: ITEM_SIZE,
        backgroundColor: "#E6EEF8",
        borderRadius: 16,
        marginBottom: 16,
        justifyContent: "center",
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    selectedMoodItem: {
        backgroundColor: "#F0F0F0",
        borderColor: "#736EFE",
        borderWidth: 2,
    },
    moodEmoji: {
        fontSize: 28,
        marginBottom: 8,
    },
    moodText: {
        fontSize: 14,
        color: "#000",
        fontWeight: "500",
    },
    nextButton: {
        backgroundColor: "#736EFE",
        marginHorizontal: 16,
        marginTop: 8,
        marginBottom: 16,
        paddingVertical: 16,
        borderRadius: 30,
        alignItems: "center",
    },
    nextButtonText: {
        color: "white",
        fontSize: 16,
        fontWeight: "600",
    },
});

export default styles;