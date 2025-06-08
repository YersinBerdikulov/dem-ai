import React, { useState } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Modal,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { collection, addDoc } from 'firebase/firestore';
import { auth, db } from '../../../../config/firebase';
import { dateStyles as styles } from '../../../../styles/settings/DateStyles';
import { useLanguage } from '../../../context/LanguageContext';

const DateSelection = ({ navigation, route }) => {
  const { t } = useLanguage();
  const { addictionType } = route.params;

  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());
  const [tempDate, setTempDate] = useState(new Date()); // for modal preview
  const [tempTime, setTempTime] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [loading, setLoading] = useState(false);

  const formatDate = (d) =>
    d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  const formatTime = (t) =>
    t.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

  const handleSave = async () => {
    try {
      setLoading(true);
      const user = auth.currentUser;

      if (!user) {
        Alert.alert(t('dateSelection.error'), t('dateSelection.loginRequired'));
        setLoading(false);
        return;
      }

      const combinedDateTime = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
        time.getHours(),
        time.getMinutes(),
        time.getSeconds()
      );

      await addDoc(collection(db, 'sobriety'), {
        userId: user.uid,
        type: addictionType,
        startDate: combinedDateTime.toISOString(),
        createdAt: new Date().toISOString(),
      });

      navigation.navigate('SobrietyClocks');
    } catch (error) {
      console.error('Error saving sobriety tracker:', error);
      Alert.alert(t('dateSelection.error'), t('dateSelection.saveError'));
    } finally {
      setLoading(false);
    }
  };

  // Show Date Modal (iOS-like)
  const showIOSDatePicker = () => (
    <Modal
      transparent
      animationType="fade"
      visible={showDatePicker}
      onRequestClose={() => setShowDatePicker(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.pickerHeader}>
            <TouchableOpacity onPress={() => setShowDatePicker(false)} style={styles.pickerButton}>
              <Text style={styles.pickerButtonText}>{t('dateSelection.cancel')}</Text>
            </TouchableOpacity>
            <Text style={styles.pickerTitle}>{t('dateSelection.selectDate')}</Text>
            <TouchableOpacity
              onPress={() => {
                setDate(tempDate);
                setShowDatePicker(false);
              }}
              style={styles.pickerButton}
            >
              <Text style={[styles.pickerButtonText, styles.doneButton]}>{t('dateSelection.done')}</Text>
            </TouchableOpacity>
          </View>
          <DateTimePicker
            value={tempDate}
            mode="date"
            display="spinner"
            onChange={(e, selected) => selected && setTempDate(selected)}
            maximumDate={new Date()}
            style={styles.pickerContainer}
          />
        </View>
      </View>
    </Modal>
  );

  const showIOSTimePicker = () => (
    <Modal
      transparent
      animationType="fade"
      visible={showTimePicker}
      onRequestClose={() => setShowTimePicker(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.pickerHeader}>
            <TouchableOpacity onPress={() => setShowTimePicker(false)} style={styles.pickerButton}>
              <Text style={styles.pickerButtonText}>{t('dateSelection.cancel')}</Text>
            </TouchableOpacity>
            <Text style={styles.pickerTitle}>{t('dateSelection.selectTime')}</Text>
            <TouchableOpacity
              onPress={() => {
                setTime(tempTime);
                setShowTimePicker(false);
              }}
              style={styles.pickerButton}
            >
              <Text style={[styles.pickerButtonText, styles.doneButton]}>{t('dateSelection.done')}</Text>
            </TouchableOpacity>
          </View>
          <DateTimePicker
            value={tempTime}
            mode="time"
            display="spinner"
            onChange={(e, selected) => selected && setTempTime(selected)}
            style={styles.pickerContainer}
          />
        </View>
      </View>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('dateSelection.title')}</Text>
      </View>

      <View style={styles.contentContainer}>
        <View style={styles.iconContainer}>
          <Ionicons name="calendar-outline" size={80} color="white" />
        </View>

        <Text style={styles.questionText}>{t('dateSelection.questionText')}</Text>

        <TouchableOpacity
          style={styles.inputButton}
          onPress={() => {
            setTempDate(date);
            setShowDatePicker(true);
          }}
        >
          <Text style={styles.inputButtonText}>{formatDate(date)}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.inputButton}
          onPress={() => {
            setTempTime(time);
            setShowTimePicker(true);
          }}
        >
          <Text style={styles.inputButtonText}>{formatTime(time)}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.saveButton} onPress={handleSave} disabled={loading}>
          {loading ? (
            <ActivityIndicator color="white" size="small" />
          ) : (
            <Text style={styles.saveButtonText}>{t('dateSelection.save')}</Text>
          )}
        </TouchableOpacity>
      </View>

      {showDatePicker && showIOSDatePicker()}
      {showTimePicker && showIOSTimePicker()}
    </SafeAreaView>
  );
};

export default DateSelection;