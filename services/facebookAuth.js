import { useState, useEffect, useCallback } from 'react';
import { FacebookAuthProvider, signInWithCredential } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';
import * as WebBrowser from 'expo-web-browser';
import * as AuthSession from 'expo-auth-session';
import * as Facebook from 'expo-auth-session/providers/facebook';

// Ensure browser sessions complete properly
WebBrowser.maybeCompleteAuthSession();

// Constants for Facebook Auth
const FACEBOOK_APP_ID = '1131088858800791';
// Use the Firebase redirect URI
const REDIRECT_URI = 'https://dem-ai-67730.firebaseapp.com/__/auth/handler';

export const useFacebookAuth = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    
    // Use the Firebase redirect URI
    const [request, response, promptAsync] = Facebook.useAuthRequest({
        clientId: FACEBOOK_APP_ID,
        // Use the Firebase redirect URI
        redirectUri: REDIRECT_URI,
        responseType: AuthSession.ResponseType.Token,
        // These are necessary for Facebook auth to work
        scopes: ['public_profile', 'email'],
        extraParams: {
            display: 'popup',
            auth_type: 'rerequest',
        },
        // Don't use the Expo proxy when using Firebase redirect
        useProxy: false,
    });
    
    // Log the redirect URL configuration
    useEffect(() => {
        console.log('Using Firebase redirect URI:', REDIRECT_URI);
    }, []);

    // Handle the Facebook credentials
    const handleFacebookCredential = useCallback(async (accessToken) => {
        try {
            setLoading(true);
            console.log('Got Facebook access token, length:', accessToken?.length);

            // Create a Firebase credential with the Facebook access token
            const credential = FacebookAuthProvider.credential(accessToken);
            const userCredential = await signInWithCredential(auth, credential);
            console.log('Successfully signed in with Firebase:', userCredential.user.uid);

            // Fetch additional user data from Facebook Graph API
            const fbResponse = await fetch(
                `https://graph.facebook.com/me?access_token=${accessToken}&fields=id,name,email,picture.type(large)`
            );
            const userData = await fbResponse.json();
            
            // Check if user already exists in Firestore
            const userDocRef = doc(db, 'users', userCredential.user.uid);
            const userDoc = await getDoc(userDocRef);
            
            // Save or update user data in Firestore
            await setDoc(userDocRef, {
                fullName: userData.name || userCredential.user.displayName || '',
                email: userData.email || userCredential.user.email || '',
                photoURL: userData.picture?.data?.url || userCredential.user.photoURL || '',
                lastLogin: new Date(),
                provider: 'facebook',
                facebookId: userData.id,
                // Only set createdAt if this is a new user
                ...(userDoc.exists() ? {} : { createdAt: new Date() })
            }, { merge: true });

            setUser(userCredential.user);
            return userCredential.user;
        } catch (err) {
            console.error('Facebook credential error:', err);
            setError(err);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    // Process the authentication response
    useEffect(() => {
        if (response?.type === 'success' && response.authentication?.accessToken) {
            console.log('Facebook auth successful, processing token');
            handleFacebookCredential(response.authentication.accessToken)
                .catch(err => console.error('Error processing Facebook auth:', err));
        } else if (response?.type === 'error') {
            console.error('Facebook auth error response:', response.error);
            setError(response.error);
        }
    }, [response, handleFacebookCredential]);

    // Function to start the Facebook login flow
    const startFacebookLogin = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            if (!request) {
                console.error('Facebook login request not ready');
                throw new Error('Facebook login request not ready. Did you configure Facebook properly?');
            }

            console.log('Starting Facebook authentication...');
            await promptAsync({ useProxy: false }); // Ensure we're not using Expo proxy
            // The response will be handled in the useEffect above
            
        } catch (err) {
            console.error('Error initiating Facebook login:', err);
            setError(err);
            throw err;
        } finally {
            setLoading(false);
        }
    }, [request, promptAsync]);

    return [startFacebookLogin, user, loading, error];
};