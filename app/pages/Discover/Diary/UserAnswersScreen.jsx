// src/screens/Diary/UserAnswersScreen.js
import React, { useState } from "react";
import { 
 View, 
 Text, 
 TouchableOpacity, 
 SafeAreaView, 
 FlatList,
 ActivityIndicator,
 ScrollView,
 Alert 
} from "react-native";
import { useNavigation, useRoute, useFocusEffect } from "@react-navigation/native";
import { format, isToday, addDays, subDays, isFuture} from "date-fns";
import { collection, query, where, getDocs, orderBy, deleteDoc, doc,  } from 'firebase/firestore';
import { db, auth } from '../../../../config/firebase';
import styles from "../../../../styles/discover/Diary/UserAnswersStyles";
import { useLanguage } from '../../../context/LanguageContext';

const UserAnswersScreen = () => {
 const navigation = useNavigation();
 const route = useRoute();
 const { t } = useLanguage();
 const today = new Date();
 const [selectedDate, setSelectedDate] = useState(route.params?.selectedDate || today);
 const [startDate, setStartDate] = useState(subDays(today, 3));
 const [diaryEntry, setDiaryEntry] = useState(null);
 const [loading, setLoading] = useState(true);

 // Get localized therapeutic questions
 const getTherapeuticQuestions = () => [
   t('diary.questions.q1'),
   t('diary.questions.q2'),
   t('diary.questions.q3'),
   t('diary.questions.q4'),
   t('diary.questions.q5'),
   t('diary.questions.q6')
 ];

 // Use useFocusEffect to fetch diary entry when screen comes into focus
 useFocusEffect(
   React.useCallback(() => {
     fetchDiaryEntry();
   }, [selectedDate])
 );

 const fetchDiaryEntry = async () => {
   try {
     setLoading(true);
     const userId = auth.currentUser?.uid;
     if (!userId) return;

     const selectedDateStart = new Date(selectedDate);
     selectedDateStart.setHours(0, 0, 0, 0);
     const selectedDateEnd = new Date(selectedDate);
     selectedDateEnd.setHours(23, 59, 59, 999);

     const diaryRef = collection(db, 'diaryEntries');
     const q = query(
       diaryRef,
       where('userId', '==', userId),
       where('date', '>=', selectedDateStart.toISOString()),
       where('date', '<=', selectedDateEnd.toISOString()),
       orderBy('date', 'asc')
     );

     const querySnapshot = await getDocs(q);
     if (!querySnapshot.empty) {
       const docData = querySnapshot.docs[0];
       setDiaryEntry({ id: docData.id, ...docData.data() });
     } else {
       setDiaryEntry(null);
     }
   } catch (error) {
     console.error('Error fetching diary entry:', error);
     Alert.alert(t('common.error'), t('diary.errors.failedToFetch'));
   } finally {
     setLoading(false);
   }
 };

 const handleChangeDiary = async () => {
   try {
     if (diaryEntry?.id) {
       setLoading(true);
       await deleteDoc(doc(db, 'diaryEntries', diaryEntry.id));
       setDiaryEntry(null);
     }
     
     navigation.navigate("MoodSelection", { 
       selectedDate,
       isUpdating: true
     });
   } catch (error) {
     console.error('Error updating diary:', error);
     Alert.alert(t('common.error'), t('diary.errors.failedToUpdate'));
   } finally {
     setLoading(false);
   }
 };

 const handleDateSelect = (date) => {
  if (!isFutureDate(date)) {
    setSelectedDate(date);
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
  const isDateInFuture = isFuture(item); // Using date-fns isFuture
  
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
      ]}>
        {format(item, "E")}
      </Text>
      <Text style={[
        styles.dateText,
        (isToday(item) || isSelected) && styles.activeText,
        isDateInFuture && styles.disabledText
      ]}>
        {format(item, "d")}
      </Text>
    </TouchableOpacity>
  );
};

 return (
   <SafeAreaView style={styles.safeContainer}>
     {/* Header */}
     <View style={styles.headerSection}>
       <View style={styles.navigationHeader}>
         <TouchableOpacity onPress={() => navigation.goBack()}>
           <Text style={styles.backIcon}>←</Text>
         </TouchableOpacity>
         <Text style={styles.headerTitle}>{t('diary.diaryEntries')}</Text>
         <TouchableOpacity style={styles.archiveButton}>
           <Text style={styles.archiveText}>{t('diary.archived')}</Text>
         </TouchableOpacity>
       </View>

       <Text style={styles.monthTitle}>{format(selectedDate, 'MMMM yyyy')}</Text>

       <View style={styles.calendarContainer}>
         <TouchableOpacity 
           style={styles.arrowButton}
           onPress={() => setStartDate(subDays(startDate, 3))}
         >
           <Text style={styles.arrowText}>←</Text>
         </TouchableOpacity>

         <FlatList
           data={Array.from({ length: 7 }, (_, i) => addDays(startDate, i))}
           horizontal
           showsHorizontalScrollIndicator={false}
           keyExtractor={(item) => item.toISOString()}
           style={styles.dateList}
           renderItem={renderDateItem}
         />

         <TouchableOpacity 
           style={styles.arrowButton}
           onPress={() => setStartDate(addDays(startDate, 3))}
         >
           <Text style={styles.arrowText}>→</Text>
         </TouchableOpacity>
       </View>
     </View>

     {/* Content */}
     {loading ? (
       <ActivityIndicator size="large" color="#736EFE" style={styles.loader} />
     ) : diaryEntry ? (
       <ScrollView style={styles.contentContainer}>
         <View style={styles.moodContainer}>
           <Text style={styles.moodTag}>{diaryEntry.mood.text}</Text>
           <Text style={styles.moodTag}>{diaryEntry.bodyFeeling.label}</Text>
         </View>

         <Text style={styles.userResponseText}>
           {diaryEntry.initialThought}
         </Text>

         <Text style={styles.title}>{t('diary.therapeuticQuestions')}</Text>
         
         {Object.entries(diaryEntry.answers).map(([key, answer]) => {
           const therapeuticQuestions = getTherapeuticQuestions();
           return (
             <View key={key} style={styles.questionContainer}>
               <Text style={styles.questionText}>{therapeuticQuestions[parseInt(key)]}</Text>
               <Text style={styles.userResponse}>{answer}</Text>
             </View>
           );
         })}

         <TouchableOpacity 
           style={styles.changeDiaryButton}
           onPress={handleChangeDiary}
         >
           <Text style={styles.buttonText}>{t('diary.changeDiary')}</Text>
         </TouchableOpacity>
       </ScrollView>
     ) : (
       <View style={styles.emptyContainer}>
         <Text style={styles.emptyText}>{t('diary.noEntryForDate')}</Text>
         <TouchableOpacity 
           style={styles.writeDiaryButton}
           onPress={handleChangeDiary}
         >
           <Text style={styles.buttonText}>{t('diary.writeDiary')}</Text>
         </TouchableOpacity>
       </View>
     )}
   </SafeAreaView>
 );
};

export default UserAnswersScreen;