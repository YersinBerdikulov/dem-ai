export const requestPasswordReset = async (userId, newPassword) => {
  try {
    const isAdmin = await verifyAdminStatus();
    if (!isAdmin) return;
    
    // Create a password reset request document
    await setDoc(doc(db, 'passwordResetRequests', userId), {
      newPassword: newPassword, // WARNING: Store hashed or encrypted, not plaintext in production
      requestedBy: auth.currentUser.uid,
      requestedAt: new Date().toISOString(),
      fulfilled: false
    });
    
    // Update user document to indicate pending reset
    await updateDoc(doc(db, 'users', userId), {
      passwordResetPending: true,
      updatedAt: new Date().toISOString()
    });
    
    Alert.alert('Success', 'Password reset request has been saved. The user will need to log in with their temporary password.');
    
  } catch (error) {
    console.error('Error creating password reset request:', error);
    Alert.alert('Error', `Failed to create password reset request: ${error.message}`);
  }
};