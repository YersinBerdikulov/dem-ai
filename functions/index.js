const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

exports.adminResetPassword = functions.https.onCall(async (data, context) => {
  // Log the incoming request for debugging
  console.log('Admin Reset Password function called with data:', JSON.stringify(data));
  console.log('Auth context:', context.auth ? `UID: ${context.auth.uid}` : 'No auth');

  // Check if the request is made by an authenticated user
  if (!context.auth) {
    console.log('Error: Unauthenticated request');
    throw new functions.https.HttpsError(
      'unauthenticated', 
      'You must be logged in to perform this action'
    );
  }
  
  try {
    // Get the admin's UID
    const adminUid = context.auth.uid;
    console.log(`Admin UID: ${adminUid}`);
    
    // Verify the user is an admin
    const adminDoc = await admin.firestore()
      .collection('users')
      .doc(adminUid)
      .get();
      
    if (!adminDoc.exists) {
      console.log('Error: Admin document not found');
      throw new functions.https.HttpsError(
        'permission-denied',
        'Admin user not found'
      );
    }

    if (!adminDoc.data().isAdmin) {
      console.log('Error: User is not an admin');
      throw new functions.https.HttpsError(
        'permission-denied',
        'Only administrators can reset passwords'
      );
    }
    
    console.log('Admin verification successful');
    
    // Get the parameters from the function call
    const { userId, newPassword, userEmail } = data;
    
    if ((!userId && !userEmail) || !newPassword) {
      console.log('Error: Missing required parameters');
      throw new functions.https.HttpsError(
        'invalid-argument',
        'User ID/email and new password are required'
      );
    }
    
    let targetUserEmail;
    let targetUserId = userId;
    
    // If userEmail is provided, use it directly
    if (userEmail) {
      targetUserEmail = userEmail;
      console.log(`Using provided email: ${targetUserEmail}`);
    } 
    // Otherwise get the user's email from Firestore
    else if (userId) {
      try {
        console.log(`Looking up user document for ID: ${userId}`);
        const userDoc = await admin.firestore()
          .collection('users')
          .doc(userId)
          .get();
          
        if (!userDoc.exists) {
          console.log(`Error: User document with ID ${userId} not found`);
          throw new functions.https.HttpsError(
            'not-found',
            'User document not found in Firestore'
          );
        }
        
        targetUserEmail = userDoc.data().email;
        console.log(`Found email from user document: ${targetUserEmail}`);
        
        if (!targetUserEmail) {
          console.log('Error: User document does not contain email field');
          throw new functions.https.HttpsError(
            'invalid-argument',
            'User document does not contain an email field'
          );
        }
      } catch (error) {
        console.error('Error getting user document:', error);
        throw new functions.https.HttpsError(
          'internal',
          `Error retrieving user information: ${error.message}`
        );
      }
    } else {
      console.log('Error: Neither userId nor userEmail provided');
      throw new functions.https.HttpsError(
        'invalid-argument',
        'Either user ID or email must be provided'
      );
    }
    
    // Try to get the user from Auth
    let userRecord;
    try {
      console.log(`Looking up user in Auth by email: ${targetUserEmail}`);
      userRecord = await admin.auth().getUserByEmail(targetUserEmail);
      console.log(`Found user in Auth: ${userRecord.uid}`);
      
      // Update the user's password
      console.log('Updating password...');
      await admin.auth().updateUser(userRecord.uid, {
        password: newPassword
      });
      
      console.log('Password updated successfully');
      
      // Log the action
      await admin.firestore().collection('adminLogs').add({
        action: 'password_reset',
        adminId: adminUid,
        targetUserId: userRecord.uid,
        targetUserEmail: targetUserEmail,
        timestamp: admin.firestore.FieldValue.serverTimestamp()
      });
      
      return { 
        success: true, 
        operation: 'updated',
        uid: userRecord.uid
      };
    } catch (authError) {
      // If user doesn't exist in Auth, create it
      if (authError.code === 'auth/user-not-found') {
        console.log(`User ${targetUserEmail} not found in Auth, creating...`);
        
        try {
          userRecord = await admin.auth().createUser({
            email: targetUserEmail,
            password: newPassword,
            emailVerified: true // Set as verified since admin is creating it
          });
          
          console.log(`Created new user in Auth: ${userRecord.uid}`);
          
          // If we have a Firestore document for this user but with different ID
          if (targetUserId && targetUserId !== userRecord.uid) {
            console.log(`Handling mismatch: Firestore ID ${targetUserId} vs Auth ID ${userRecord.uid}`);
            
            // Get the old document
            const oldUserDoc = await admin.firestore()
              .collection('users')
              .doc(targetUserId)
              .get();
              
            if (oldUserDoc.exists) {
              // Create a new document with matching Auth UID
              console.log('Creating new document with matching Auth UID');
              await admin.firestore()
                .collection('users')
                .doc(userRecord.uid)
                .set({
                  ...oldUserDoc.data(),
                  email: targetUserEmail,
                  uid: userRecord.uid,
                  updatedAt: admin.firestore.FieldValue.serverTimestamp()
                });
            } else {
              // Create a basic user document
              console.log('Creating basic user document');
              await admin.firestore()
                .collection('users')
                .doc(userRecord.uid)
                .set({
                  email: targetUserEmail,
                  uid: userRecord.uid,
                  createdAt: admin.firestore.FieldValue.serverTimestamp(),
                  emailVerified: true
                });
            }
          }
          
          // Log the action
          await admin.firestore().collection('adminLogs').add({
            action: 'user_creation',
            adminId: adminUid,
            targetUserId: userRecord.uid,
            targetUserEmail: targetUserEmail,
            timestamp: admin.firestore.FieldValue.serverTimestamp()
          });
          
          console.log('User creation and password set completed successfully');
          
          return { 
            success: true, 
            operation: 'created',
            uid: userRecord.uid
          };
        } catch (createError) {
          console.error('Error creating user:', createError);
          throw new functions.https.HttpsError(
            'internal',
            `Could not create user: ${createError.message}`
          );
        }
      } else {
        // For other auth errors, throw them
        console.error('Auth error:', authError);
        throw new functions.https.HttpsError(
          'internal',
          `Auth error: ${authError.message}`
        );
      }
    }
  } catch (error) {
    console.error('Admin password reset error:', error);
    throw new functions.https.HttpsError(
      'internal',
      error.message
    );
  }
});