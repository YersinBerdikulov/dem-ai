// context/LanguageContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Import language files (adjust the path based on your file structure)
import en from '../locales/en.json';
import ru from '../locales/ru.json';
import kz from '../locales/kz.json';

const languages = {
  en,
  ru,
  kz
};

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const LanguageProvider = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [translations, setTranslations] = useState(languages.en);

  useEffect(() => {
    loadSavedLanguage();
  }, []);

  const loadSavedLanguage = async () => {
    try {
      const savedLanguage = await AsyncStorage.getItem('selectedLanguage');
      if (savedLanguage && languages[savedLanguage]) {
        setCurrentLanguage(savedLanguage);
        setTranslations(languages[savedLanguage]);
      }
    } catch (error) {
      console.error('Error loading saved language:', error);
    }
  };

  const changeLanguage = async (languageCode) => {
    try {
      if (languages[languageCode]) {
        setCurrentLanguage(languageCode);
        setTranslations(languages[languageCode]);
        await AsyncStorage.setItem('selectedLanguage', languageCode);
      }
    } catch (error) {
      console.error('Error saving language:', error);
    }
  };

  const t = (key) => {
    const keys = key.split('.');
    let value = translations;
    
    for (const k of keys) {
      value = value?.[k];
    }
    
    // Debug logging
    console.log('Translation key:', key);
    console.log('Current language:', currentLanguage);
    console.log('Translation value:', value);
    console.log('Available translations:', Object.keys(translations));
    
    return value || key;
  };

  const value = {
    currentLanguage,
    changeLanguage,
    t,
    availableLanguages: [
      { code: 'en', name: 'English', nativeName: 'English' },
      { code: 'ru', name: 'Russian', nativeName: 'Русский' },
      { code: 'kz', name: 'Kazakh', nativeName: 'Қазақша' }
    ]
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};