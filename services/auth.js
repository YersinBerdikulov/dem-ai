import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  FacebookAuthProvider,
  signInWithCredential,
  sendPasswordResetEmail,
  signOut,
  sendEmailVerification,
  applyActionCode,
  checkActionCode,
  updatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential
} from 'firebase/auth';
import { 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  collection, 
  query, 
  where, 
  getDocs,
  deleteDoc,
  addDoc
} from 'firebase/firestore';
import { auth, db } from '../config/firebase';

// Generate a 6-digit verification code (for UI only)
export const generateVerificationCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const signUpWithEmail = async (email, password, fullName) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    
    const verificationCode = generateVerificationCode();
    

    await setDoc(doc(db, 'users', user.uid), {
      fullName,
      email,
      createdAt: new Date().toISOString(),
      chats: [],
      emailVerified: false,
      displayVerificationCode: verificationCode, 
      verificationCodeExpiry: new Date(Date.now() + 30 * 60000).toISOString() 
    });
    
   
    await sendEmailVerification(user);
    
    return { user, verificationCode };
  } catch (error) {
    throw error;
  }
};



// Add this to your auth.js file - Enhanced signInWithEmail function with better error handling

export const signInWithEmail = async (email, password) => {
  try {
    console.log(`Attempting to sign in with email: ${email}`);
    
    // First try normal sign in
    try {
      console.log('Trying standard authentication...');
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Update last login time
      console.log('Auth successful, updating last login time');
      await updateDoc(doc(db, 'users', user.uid), {
        lastLogin: new Date().toISOString()
      });
      
      // Check if email is verified in Firebase Auth
      if (!user.emailVerified) {
        console.log('Email not verified');
        throw new Error('EMAIL_NOT_VERIFIED');
      }
      
      console.log('Normal sign-in successful');
      return { user };
    } catch (authError) {
      console.log(`Normal auth failed: ${authError.code} - ${authError.message}`);
      
      // Permission check - Before doing any Firestore queries, check if user is logged in
      // This is important because the security rules require authentication for queries
      if (!auth.currentUser) {
        // First try to sign in with the provided credentials
        // This allows us to do the Firestore queries protected by security rules
        try {
          console.log('Attempting pre-auth to check temp password...');
          await signInWithEmailAndPassword(auth, email, password);
        } catch (preAuthError) {
          console.log('Pre-auth failed, cannot check for temp password');
          // If we can't sign in, we can't check for temp password
          throw authError; // Rethrow the original auth error
        }
      }
      
      // Now we should be authenticated, so we can query Firestore
      try {
        console.log('Checking if this is a temporary password...');
        
        // Find user by email
        console.log('Querying users collection...');
        const usersRef = collection(db, 'users');
        const q = query(usersRef, where('email', '==', email));
        const userSnapshot = await getDocs(q);
        
        if (userSnapshot.empty) {
          console.log('No user found with this email in Firestore');
          throw authError; // Rethrow the original error
        }
        
        const userId = userSnapshot.docs[0].id;
        const userData = userSnapshot.docs[0].data();
        
        console.log(`Found user in Firestore: ${userId}`);
        console.log(`Password reset pending: ${userData.passwordResetPending}`);
        
        if (userData.passwordResetPending !== true) {
          console.log('User does not have pending password reset');
          throw authError; // Not a password reset user, rethrow the error
        }
        
        // Look for matching reset request
        console.log('Querying passwordResets collection...');
        const resetQuery = query(
          collection(db, 'passwordResets'),
          where('userEmail', '==', email),
          where('status', '==', 'pending')
        );
        
        const resetSnapshot = await getDocs(resetQuery);
        
        if (resetSnapshot.empty) {
          console.log('No pending password resets found');
          throw authError; // No reset requests found
        }
        
        console.log(`Found ${resetSnapshot.size} password reset records`);
        
        // Check all reset documents for a matching password
        let matchFound = false;
        for (const resetDoc of resetSnapshot.docs) {
          const resetData = resetDoc.data();
          console.log(`Checking reset record: ${resetDoc.id}`);
          
          if (resetData.tempPassword === password) {
            console.log('Found matching temporary password!');
            matchFound = true;
            break;
          }
        }
        
        if (!matchFound) {
          console.log('No matching temporary password');
          throw authError; // No matching password found
        }
        
        console.log('Valid temporary password found');
        
        // At this point we're already authenticated (from the pre-auth step)
        // So we can return the current user
        return { 
          user: auth.currentUser, 
          tempPasswordUsed: true
        };
      } catch (firestoreError) {
        console.error('Error checking for temporary password:', firestoreError);
        throw firestoreError; // Rethrow the Firestore error
      }
    }
  } catch (error) {
    console.error(`Login error: ${error.code} - ${error.message}`);
    throw error;
  }
};


export const signInWithGoogle = async (idToken) => {
  try {
    const credential = GoogleAuthProvider.credential(idToken);
    const userCredential = await signInWithCredential(auth, credential);
    const user = userCredential.user;

    const userDoc = await getDoc(doc(db, 'users', user.uid));
    
    // Check if this is the admin email
    const isAdmin = user.email.toLowerCase() === 'mobilelegendsakk1@gmail.com';
    
    if (!userDoc.exists()) {
      await setDoc(doc(db, 'users', user.uid), {
        fullName: user.displayName,
        email: user.email,
        createdAt: new Date().toISOString(),
        chats: [],
        isAdmin: isAdmin // Set admin flag based on email
      });
    }

    return { user };
  } catch (error) {
    throw error;
  }
};

export const signInWithFacebook = async (accessToken) => {
  try {
    const credential = FacebookAuthProvider.credential(accessToken);
    const userCredential = await signInWithCredential(auth, credential);
    const user = userCredential.user;

    // Check if this is the admin email
    const isAdmin = user.email && user.email.toLowerCase() === 'mobilelegendsakk1@gmail.com';
    
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    if (!userDoc.exists()) {
      await setDoc(doc(db, 'users', user.uid), {
        fullName: user.displayName,
        email: user.email,
        createdAt: new Date().toISOString(),
        chats: [],
        isAdmin: isAdmin // Set admin flag based on email
      });
    }

    return { user };
  } catch (error) {
    throw error;
  }
};

export const resetPassword = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    return true;
  } catch (error) {
    throw error;
  }
};

export const logOut = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    throw error;
  }
};



// Verify email with oobCode from link
export const verifyEmailWithLink = async (oobCode) => {
  try {
    // First check if the action code is valid
    await checkActionCode(auth, oobCode);
    
    // Apply the verification code
    await applyActionCode(auth, oobCode);
    
    // Get current user
    const user = auth.currentUser;
    if (user) {
      // Update user document in Firestore
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        emailVerified: true,
        verifiedAt: new Date().toISOString()
      });
    }
    
    return true;
  } catch (error) {
    throw error;
  }
};

// Resend verification email
export const resendVerificationEmail = async () => {
  try {
    const user = auth.currentUser;
    if (!user) {
      throw new Error('No user is currently signed in');
    }
    
    // Generate a new display code for UI
    const displayVerificationCode = generateVerificationCode();
    
    // Update user document with new display code
    const userRef = doc(db, 'users', user.uid);
    await updateDoc(userRef, {
      displayVerificationCode,
      verificationCodeExpiry: new Date(Date.now() + 30 * 60000).toISOString() // 30 minutes expiry
    });
    
    // Send new verification email
    await sendEmailVerification(user);
    
    return displayVerificationCode;
  } catch (error) {
    throw error;
  }
};

// Check verification status
export const checkEmailVerificationStatus = async (userId) => {
  try {
    // Reload the current user to get updated information
    const user = auth.currentUser;
    if (user) {
      await user.reload();
      
      // Update Firestore if Firebase Auth shows email is verified
      if (user.emailVerified) {
        const userRef = doc(db, 'users', userId);
        await updateDoc(userRef, {
          emailVerified: true,
          verifiedAt: new Date().toISOString()
        });
      }
      
      return user.emailVerified;
    }
    return false;
  } catch (error) {
    throw error;
  }
};

// Find user by email (useful for login verification flow)
export const findUserByEmail = async (email) => {
  try {
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('email', '==', email));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      throw new Error('User not found');
    }
    
    return {
      userId: querySnapshot.docs[0].id,
      userData: querySnapshot.docs[0].data()
    };
  } catch (error) {
    throw error;
  }
};

// ----- ADMIN FUNCTIONS -----

// Check if user is an admin
export const checkAdminStatus = async (userId) => {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (userDoc.exists()) {
      return userDoc.data().isAdmin === true;
    }
    return false;
  } catch (error) {
    console.error('Error checking admin status:', error);
    return false;
  }
};

// Get all users (admin only)
export const getAllUsers = async () => {
  try {
    const usersRef = collection(db, 'users');
    const querySnapshot = await getDocs(usersRef);
    
    const users = [];
    querySnapshot.forEach((doc) => {
      users.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return users;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

// Admin: Reset password for a user
export const adminResetPassword = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    return true;
  } catch (error) {
    console.error('Error resetting password:', error);
    throw error;
  }
};

// Admin: Set user as admin
export const setUserAsAdmin = async (userId, isAdmin) => {
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      isAdmin: isAdmin,
      updatedAt: new Date().toISOString()
    });
    return true;
  } catch (error) {
    console.error('Error updating admin status:', error);
    throw error;
  }
};

// Admin: Delete user
export const deleteUserAccount = async (userId) => {
  try {
    // Delete user from Firestore
    await deleteDoc(doc(db, 'users', userId));
    
    // Note: Deleting a user from Firebase Authentication requires
    // either the Firebase Admin SDK or for the user to be logged in.
    // Here we're only handling Firestore deletion.
    
    return true;
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
};

// Admin: Update user profile
export const updateUserProfile = async (userId, userData) => {
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      ...userData,
      updatedAt: new Date().toISOString()
    });
    return true;
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
};

// Check if current user is admin
export const isCurrentUserAdmin = async () => {
  try {
    const user = auth.currentUser;
    if (!user) return false;
    
    return await checkAdminStatus(user.uid);
  } catch (error) {
    console.error('Error checking current user admin status:', error);
    return false;
  }
};