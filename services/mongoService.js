// src/services/mongoService.js

import axios from 'axios';

// For local development, use your computer's IP address
const API_URL = 'http://10.0.2.2:3000/api'; 
// For production, use your deployed backend URL
// const API_URL = 'https://your-app.herokuapp.com/api';
export const uploadImageToMongo = async (imageUri, userId) => {
  try {
    // Log for debugging
    console.log('Starting upload with URI:', imageUri);
    console.log('User ID:', userId);

    const formData = new FormData();

    // Convert image URI to blob
    const response = await fetch(imageUri);
    const blob = await response.blob();

    // Create file from blob
    formData.append('avatar', {
      uri: imageUri,
      type: 'image/jpeg',  // or detect from blob.type
      name: `${userId}_${Date.now()}.jpg`
    });

    formData.append('userId', userId);

    // Log formData for debugging
    console.log('FormData created:', formData);

    const uploadResponse = await axios({
      method: 'post',
      url: `${API_URL}/upload-avatar`,
      data: formData,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'multipart/form-data',
      },
    });

    console.log('Upload response:', uploadResponse.data);

    if (uploadResponse.data.success) {
      return `${API_URL}/get-avatar/${userId}`;
    } else {
      throw new Error('Upload failed');
    }
  } catch (error) {
    console.error('Detailed upload error:', error.response || error);
    throw new Error('Failed to upload image');
  }
};

export const getImageFromMongo = async (userId) => {
  try {
    const checkResponse = await axios.get(`${API_URL}/get-avatar/${userId}`);
    if (checkResponse.status === 200) {
      return `${API_URL}/get-avatar/${userId}`;
    }
    return null;
  } catch (error) {
    console.error('Error getting image:', error);
    return null;
  }
};