import { initializeApp } from 'firebase/app';
import { 
  initializeAuth, 
  getReactNativePersistence,
  GoogleAuthProvider,
  FacebookAuthProvider
} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyAME6EtPdwB1LEa9siBgx8Fc3vq2Chaie8",
  authDomain: "dem-ai-67730.firebaseapp.com",
  projectId: "dem-ai-67730",
  storageBucket: "dem-ai-67730.firebasestorage.app",
  messagingSenderId: "445082810786",
  appId: "1:445082810786:web:3c91e64b4861b613079afb",
  measurementId: "G-D30LRFX847"
};

const app = initializeApp(firebaseConfig);


export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});


export const db = getFirestore(app);


export const googleProvider = new GoogleAuthProvider();
export const facebookProvider = new FacebookAuthProvider();


googleProvider.setCustomParameters({
  prompt: 'select_account'
});

facebookProvider.setCustomParameters({
  'display': 'popup'
});