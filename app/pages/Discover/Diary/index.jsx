import React, { useState, useEffect } from "react";
import { 
   View, 
   Text, 
   TouchableOpacity, 
   Image, 
   FlatList, 
   SafeAreaView,
   ActivityIndicator 
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { format, isToday, addDays, subDays, isFuture } from "date-fns";
import { collection, query, where, getDocs, doc, deleteDoc} from 'firebase/firestore';
import { db, auth } from '../../../../config/firebase';
import styles from "../../../../styles/discover/Diary/firstPageStyles";
import { AntDesign } from "@expo/vector-icons";
import { useLanguage } from '../../../context/LanguageContext';
// Import activity tracker
import { trackActivity, ACTIVITY_TYPES } from '../../../../utils/activityTracker';

const DiaryPage = () => {
   const navigation = useNavigation();
   const { t } = useLanguage();
   const today = new Date();
   const [selectedDate, setSelectedDate] = useState(today);
   const [startDate, setStartDate] = useState(subDays(today, 3));
   const [loading, setLoading] = useState(true);
   const [hasDiaryEntry, setHasDiaryEntry] = useState(false);
   const [diaryEntry, setDiaryEntry] = useState(null);
   const [trackingInitialized, setTrackingInitialized] = useState(false);

   useEffect(() => {
       // Track diary page view once
       if (!trackingInitialized) {
           trackActivity(ACTIVITY_TYPES.DIARY, {
               action: 'view_page',
               timestamp: new Date().toISOString()
           });
           setTrackingInitialized(true);
       }
       
       checkDiaryEntry();
   }, [selectedDate]);

   const checkDiaryEntry = async () => {
       try {
           setLoading(true);
           const userId = auth.currentUser?.uid;
           if (!userId) {
               setHasDiaryEntry(false);
               setDiaryEntry(null);
               return;
           }

           const selectedDateStart = new Date(selectedDate);
           selectedDateStart.setHours(0, 0, 0, 0);
           const selectedDateEnd = new Date(selectedDate);
           selectedDateEnd.setHours(23, 59, 59, 999);

           const diaryRef = collection(db, 'diaryEntries');
           const q = query(
               diaryRef,
               where('userId', '==', userId),
               where('date', '>=', selectedDateStart.toISOString()),
               where('date', '<=', selectedDateEnd.toISOString())
           );

           const querySnapshot = await getDocs(q);
           if (!querySnapshot.empty) {
               const doc = querySnapshot.docs[0];
               const diaryData = { id: doc.id, ...doc.data() };
               setDiaryEntry(diaryData);
               setHasDiaryEntry(true);
               
               // Track viewing existing entry
               trackActivity(ACTIVITY_TYPES.DIARY, {
                   action: 'view_existing_entry',
                   entryDate: selectedDateStart.toISOString(),
                   entryId: doc.id
               });
           } else {
               setDiaryEntry(null);
               setHasDiaryEntry(false);
           }
       } catch (error) {
           console.error('Error checking diary entry:', error);
           setHasDiaryEntry(false);
           setDiaryEntry(null);
       } finally {
           setLoading(false);
       }
   };

   const handleDateSelect = (date) => {
    if (!isFutureDate(date)) {
      setSelectedDate(date);
      
      // Track date selection
      trackActivity(ACTIVITY_TYPES.DIARY, {
          action: 'select_date',
          selectedDate: date.toISOString()
      });
    }
  };
  
   const handleWriteDiary = async () => {
       if (hasDiaryEntry && diaryEntry) {
           // Track viewing existing entry details
           trackActivity(ACTIVITY_TYPES.DIARY, {
               action: 'open_existing_entry',
               entryDate: selectedDate.toISOString(),
               entryId: diaryEntry.id
           });
           
           // If viewing existing entry
           navigation.navigate("UserAnswers", { 
               selectedDate,
               diaryEntry
           });
       } else {
           // Track starting new entry
           trackActivity(ACTIVITY_TYPES.DIARY, {
               action: 'create_new_entry',
               entryDate: selectedDate.toISOString()
           });
           
           // If creating new entry
           navigation.navigate("MoodSelection", { 
               selectedDate,
               isUpdating: false
           });
       }
   };
   
   const isFutureDate = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    date.setHours(0, 0, 0, 0);
    return date > today;
  };

   const renderDateItem = ({ item }) => {
    const isSelected = selectedDate.toDateString() === item.toDateString();
    const dayNumber = format(item, "d");
    const dayName = format(item, "EEE");
    const isDateInFuture = isFuture(item);
    
    return (
        <TouchableOpacity
            style={[
                styles.dateItem,
                isToday(item) && styles.todayItem,
                isSelected && styles.selectedDate,
                isDateInFuture && styles.disabledDate,
            ]}
            onPress={() => !isDateInFuture && handleDateSelect(item)}
            disabled={isDateInFuture}
        >
            <Text style={[
                styles.dayText,
                (isToday(item) || isSelected) && styles.activeText,
                isDateInFuture && styles.disabledText
            ]}>{dayName}</Text>
            <Text style={[
                styles.dateText,
                (isToday(item) || isSelected) && styles.activeText,
                isDateInFuture && styles.disabledText
            ]}>{dayNumber}</Text>
        </TouchableOpacity>
    );
};

   const navigateBack = () => {
       navigation.goBack();
   };

   return (
       <SafeAreaView style={styles.safeContainer}>
           <View style={styles.container}>
               <View style={styles.headerSection}>
                   <View style={styles.navigationHeader}>
                       <TouchableOpacity onPress={navigateBack}>
                           <AntDesign name="arrowleft" size={24} color="#03174C" />
                       </TouchableOpacity>
                       <Text style={[styles.headerTitle, { fontFamily: 'Poppins-Bold' }]}>
                           {t('diary.diaryEntries')}
                       </Text>
                       <TouchableOpacity style={styles.archiveButton}>
                           <Text style={[styles.archiveText, { fontFamily: 'Poppins-Regular' }]}>
                               {t('diary.archived')}
                           </Text>
                       </TouchableOpacity>
                   </View>

                   <Text style={[styles.monthTitle, { fontFamily: 'Poppins-Medium' }]}>
                       {format(selectedDate, "yyyy MMMM")}
                   </Text>

                   <View style={styles.calendarContainer}>
                       <TouchableOpacity 
                           style={styles.arrowButton}
                           onPress={() => {
                               const newDate = subDays(startDate, 7);
                               setStartDate(newDate);
                               trackActivity(ACTIVITY_TYPES.DIARY, {
                                   action: 'calendar_nav',
                                   direction: 'previous_week',
                                   startDate: newDate.toISOString()
                               });
                           }}
                       >
                           <AntDesign name="left" size={20} color="#03174C" />
                       </TouchableOpacity>

                       <FlatList
                           horizontal
                           data={Array.from({ length: 7 }, (_, i) => addDays(startDate, i))}
                           renderItem={renderDateItem}
                           keyExtractor={item => item.toISOString()}
                           showsHorizontalScrollIndicator={false}
                           style={styles.dateList}
                       />

                       <TouchableOpacity 
                           style={styles.arrowButton}
                           onPress={() => {
                               const newDate = addDays(startDate, 7);
                               setStartDate(newDate);
                               trackActivity(ACTIVITY_TYPES.DIARY, {
                                   action: 'calendar_nav',
                                   direction: 'next_week',
                                   startDate: newDate.toISOString()
                               });
                           }}
                       >
                           <AntDesign name="right" size={20} color="#03174C" />
                       </TouchableOpacity>
                   </View>
               </View>

               {loading ? (
                   <View style={styles.contentContainer}>
                       <ActivityIndicator size="large" color="#736EFE" />
                   </View>
               ) : (
                   <View style={styles.contentContainer}>
                       {!hasDiaryEntry ? (
                           <>
                               <Image 
                                   source={require("../../../../assets/images/boy.png")}
                                   style={styles.illustration}
                               />
                               <Text style={[styles.emptyStateText, { fontFamily: 'Poppins-Regular' }]}>
                                   {t('diary.emptyStateText', { date: format(selectedDate, "MMMM d") })}
                               </Text>
                           </>
                       ) : null}
                       <TouchableOpacity 
                           style={styles.writeButton}
                           onPress={handleWriteDiary}
                       >
                           <Text style={[styles.writeButtonText, { fontFamily: 'Poppins-Bold' }]}>
                               {hasDiaryEntry ? t('diary.viewDiary') : t('diary.writeDiary')}
                           </Text>
                       </TouchableOpacity>
                   </View>
               )}
           </View>
       </SafeAreaView>
   );
};

// Function that can be used by child components to track diary completion
export const trackDiaryCompletion = async (entryData) => {
    try {
        await trackActivity(ACTIVITY_TYPES.DIARY, {
            action: 'complete_entry',
            entryDate: entryData.date,
            entryId: entryData.id,
            mood: entryData.mood
        });
    } catch (error) {
        console.error('Error tracking diary completion:', error);
    }
};

export default DiaryPage;