import { auth } from '../config/firebase';
import { 
  sendPasswordResetEmail, 
  applyActionCode,
  ActionCodeSettings 
} from 'firebase/auth';

const actionCodeSettings = {
  // URL you want to redirect back to. The domain (www.example.com) for this
  // URL must be in the authorized domains list in the Firebase Console.
  url: 'https://dem-ai-67730.firebaseapp.com/__/auth/action',
  // This must be true for mobile apps
  handleCodeInApp: true,
  iOS: {
    bundleId: 'com.demai.app'
  },
  android: {
    packageName: 'com.demai.app',
    installApp: true,
    minimumVersion: '12'
  }
};

// Send verification email with custom template
export const sendVerificationEmail = async (email, verificationCode) => {
  try {
    // Send password reset email with custom template
    await sendPasswordResetEmail(auth, email, {
      ...actionCodeSettings,
      // Add custom template parameters
      customParameters: {
        // This will be replaced in your custom email template
        verificationCode: verificationCode
      }
    });

    return true;
  } catch (error) {
    console.error('Error sending verification email:', error);
    throw error;
  }
};

// Handle verification code validation
export const verifyEmailCode = async (code, continueUrl) => {
  try {
    await applyActionCode(auth, code);
    return true;
  } catch (error) {
    console.error('Error verifying email code:', error);
    throw error;
  }
};

// Helper function to format verification email content
export const getVerificationEmailContent = (verificationCode) => {
  return `
    Your verification code is: ${verificationCode}
    
    This code will expire in 15 minutes.
    
    If you didn't request this code, you can safely ignore this email.
    
    Thanks,
    Your App Team
  `;
};

// Format the email subject
export const getVerificationEmailSubject = () => {
  return 'Your Password Reset Code';
};