import { useEffect, useState } from 'react';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import { makeRedirectUri } from 'expo-auth-session';
import { signInWithGoogle } from '../../services/auth';
import Constants from 'expo-constants';

// Must be called before any auth flows
WebBrowser.maybeCompleteAuthSession();

export const useGoogleAuth = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [error, setError] = useState(null);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  
  // Configure Google Auth Request with the correct client IDs
  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    clientId: "445082810786-lq9d5b1lh6i4e83v1k82h2g8nk8mhdh1.apps.googleusercontent.com", // Web client ID
    iosClientId: "445082810786-1lmm42tv3phjj4rbc9nnh59dtugk0743.apps.googleusercontent.com",
    androidClientId: "445082810786-vjcadpk95mrtnvmdkmgq0tqrljkalc59.apps.googleusercontent.com",
    scopes: ['profile', 'email'],
    redirectUri: makeRedirectUri({
      scheme: 'demai',
      path: 'auth/callback'
    }),
    useProxy: true // Important for Expo Go
  });

  // Log configuration details for debugging (only on mount)
  useEffect(() => {
    console.log("Google Auth configuration:", {
      redirectUri: makeRedirectUri({
        scheme: 'demai',
        path: 'auth/callback'
      }),
      isProxyEnabled: Constants.appOwnership === 'expo',
      iosClientId: "445082810786-1lmm42tv3phjj4rbc9nnh59dtugk0743.apps.googleusercontent.com",
      androidClientId: "445082810786-vjcadpk95mrtnvmdkmgq0tqrljkalc59.apps.googleusercontent.com",
      webClientId: "445082810786-lq9d5b1lh6i4e83v1k82h2g8nk8mhdh1.apps.googleusercontent.com",
    });
  }, []);

  // Handle the authentication response
  useEffect(() => {
    const processAuthResponse = async () => {
      if (!response) return;
      
      if (response.type === 'success') {
        // Validate that we actually have an id_token
        const { id_token } = response.params;
        
        if (!id_token) {
          console.error("No ID token received from Google OAuth response");
          setError(new Error("Authentication failed: Missing ID token"));
          setIsAuthenticating(false);
          return;
        }
        
        console.log("Authentication successful, processing token");
        
        try {
          // Use your existing signInWithGoogle function from auth.js
          const { user } = await signInWithGoogle(id_token);
          
          if (!user) {
            throw new Error("No user returned from Firebase authentication");
          }
          
          console.log("Successfully authenticated with Firebase");
          setUserInfo(user);
        } catch (error) {
          console.error("Error signing in with Firebase:", error);
          setError(error);
        }
      } else if (response.type === 'error') {
        console.error("Auth error response:", response.error);
        setError(response.error);
      } else if (response.type === 'dismiss' || response.type === 'cancel') {
        console.log("Auth flow was dismissed or cancelled by user");
        setError(new Error("Authentication cancelled"));
      }
      
      // Always set authenticating to false when response is processed
      setIsAuthenticating(false);
    };

    // Only process if we're actively authenticating and have a response
    if (isAuthenticating && response) {
      processAuthResponse();
    }
  }, [response, isAuthenticating]);

  const googleSignIn = async () => {
    try {
      // Only start the flow if we're not already authenticating
      if (isAuthenticating) return;
      
      console.log("Starting Google sign in flow");
      setError(null);
      setIsAuthenticating(true);
      
      const result = await promptAsync({ showInRecents: true });
      
      // Log the result for debugging
      console.log("Google auth prompt result:", result);
      
      // Return the result for the component to use
      return result;
    } catch (error) {
      console.error("Google prompt error:", error);
      setError(error);
      setIsAuthenticating(false);
      throw error;
    }
  };

  // Return the sign-in function and state
  return [
    googleSignIn, 
    { 
      user: userInfo, 
      error: error, 
      loading: isAuthenticating 
    }
  ];
};