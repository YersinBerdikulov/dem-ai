import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    safeContainer: {
        flex: 1,
        backgroundColor: "#03174C",
    },
    container: {
        flex: 1,
    },
    headerSection: {
        backgroundColor: "#E6EEF8",
        borderBottomLeftRadius: 24,
        borderBottomRightRadius: 24,
        paddingTop: 8,
        paddingBottom: 16,
    },
    disabledDate: {
        opacity: 0.5,
        backgroundColor: '#E0E0E0',
      },
      disabledText: {
        color: '#999',
      },
    navigationHeader: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 16,
        marginBottom: 12,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: "600",
        color: "#000",
    },
    archiveButton: {
        backgroundColor: "#F0F0F0",
        paddingHorizontal: 16,
        paddingVertical: 6,
        borderRadius: 16,
    },
    archiveText: {
        color: "#666",
        fontSize: 14,
    },
    monthTitle: {
        fontSize: 16,
        fontWeight: "500",
        color: "#000",
        textAlign: "center",
        marginBottom: 12,
    },
    calendarContainer: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 8,
    },
    arrowButton: {
        padding: 8,
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
        color: "#666",
        marginBottom: 4,
    },
    dateText: {
        fontSize: 14,
        fontWeight: "600",
        color: "#000",
    },
    activeText: {
        color: "white",
    },
    contentContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 24,
    },
    illustration: {
        width: 120,
        height: 120,
        marginBottom: 16,
    },
    emptyStateText: {
        fontSize: 16,
        color: "white",
        textAlign: "center",
        marginBottom: 24,
    },
    writeButton: {
        backgroundColor: "#736EFE",
        paddingHorizontal: 32,
        paddingVertical: 12,
        borderRadius: 24,
    },
    writeButtonText: {
        color: "white",
        fontSize: 16,
        fontWeight: "600",
    },
});

export default styles;