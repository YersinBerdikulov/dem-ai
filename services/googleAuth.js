import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';

// Initialize Google Sign In
GoogleSignin.configure({
  webClientId: '125644851914-hvmuvqr3imjcq2folfjjke9pb40rgooc.apps.googleusercontent.com',
  iosClientId: '125644851914-c8j53nva0indor4s9tlou71oifd1i573.apps.googleusercontent.com',
  offlineAccess: true
});

export const loginWithGoogle = async () => {
  try {
    await GoogleSignin.hasPlayServices();
    const userInfo = await GoogleSignin.signIn();
    
    const credential = GoogleAuthProvider.credential(userInfo.idToken);
    const userCredential = await signInWithCredential(auth, credential);
    
    // Save user data to Firestore
    await setDoc(doc(db, 'users', userCredential.user.uid), {
      fullName: userInfo.user.name || '',
      email: userInfo.user.email || '',
      photoURL: userInfo.user.photo || '',
      createdAt: new Date(),
      lastLogin: new Date(),
      provider: 'google'
    }, { merge: true });

    return userCredential.user;
  } catch (error) {
    console.error('Google sign in error:', error);
    throw error;
  }
};