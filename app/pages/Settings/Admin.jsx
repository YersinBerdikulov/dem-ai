import React, { useState, useEffect } from 'react';
import {
  View, Text, SafeAreaView, TouchableOpacity, ScrollView, 
  Alert, ActivityIndicator, StatusBar, TextInput, Modal
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { db, auth } from '../../../config/firebase';
import { 
  collection, 
  query, 
  getDocs, 
  doc, 
  getDoc,
  updateDoc, 
  deleteDoc,
  where,
  addDoc,
  serverTimestamp
} from 'firebase/firestore';
import { 
  signInWithEmailAndPassword,
  sendPasswordResetEmail
} from 'firebase/auth';
import { adminStyles as styles } from '../../../styles/settings/adminStyles';
import { useLanguage } from '../../context/LanguageContext';

const Admin = ({ navigation }) => {
  const { t } = useLanguage();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  
  // Delete user modal states
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [adminPassword, setAdminPassword] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    checkAdminStatus();
    fetchUsers();
  }, []);

  const checkAdminStatus = async () => {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        Alert.alert(t('admin.error'), t('admin.mustBeLoggedIn'));
        navigation.goBack();
        return;
      }

      const userRef = doc(db, 'users', currentUser.uid);
      const userDoc = await getDoc(userRef);
      
      if (userDoc.exists()) {
        const userData = userDoc.data();
        const userIsAdmin = userData.isAdmin === true;
        
        setIsAdmin(userIsAdmin);
        
        if (!userIsAdmin) {
          Alert.alert(t('admin.accessDenied'), t('admin.accessDeniedMessage'));
          navigation.goBack();
        }
      } else {
        Alert.alert(t('admin.error'), t('admin.userDataNotFound'));
        navigation.goBack();
      }
    } catch (error) {
      console.error('Error checking admin status:', error);
      Alert.alert(t('admin.error'), t('admin.failedToVerify'));
      navigation.goBack();
    }
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const usersRef = collection(db, 'users');
      const querySnapshot = await getDocs(usersRef);
      
      const usersList = [];
      querySnapshot.forEach((doc) => {
        usersList.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      setUsers(usersList);
    } catch (error) {
      console.error('Error fetching users:', error);
      Alert.alert(t('admin.error'), 'Failed to load users list');
    } finally {
      setLoading(false);
    }
  };

  // Email password reset
  const handleEmailResetPassword = async (email) => {
    try {
      setLoading(true);
      await sendPasswordResetEmail(auth, email);
      Alert.alert(t('admin.success'), t('admin.passwordResetSent', { email }));
    } catch (error) {
      console.error('Error sending password reset:', error);
      Alert.alert(t('admin.error'), t('admin.passwordResetFailed', { error: error.message }));
    } finally {
      setLoading(false);
    }
  };

  const handleToggleAdmin = async (user) => {
    try {
      setLoading(true);
      
      // Prevent removing admin status from self
      if (user.id === auth.currentUser.uid && user.isAdmin) {
        Alert.alert(t('admin.error'), t('admin.cannotRemoveOwnAdmin'));
        return;
      }
      
      const userRef = doc(db, 'users', user.id);
      
      // Toggle admin status
      await updateDoc(userRef, {
        isAdmin: user.isAdmin === true ? false : true,
        updatedAt: new Date().toISOString(),
        updatedBy: auth.currentUser.uid
      });
      
      // Update local state
      const updatedUsers = users.map(u => {
        if (u.id === user.id) {
          return { ...u, isAdmin: user.isAdmin === true ? false : true };
        }
        return u;
      });
      
      setUsers(updatedUsers);
      Alert.alert(
        t('admin.success'), 
        user.isAdmin ? t('admin.removedAdminRights', { email: user.email }) : t('admin.grantedAdminRights', { email: user.email })
      );
    } catch (error) {
      console.error('Error toggling admin status:', error);
      Alert.alert(t('admin.error'), t('admin.failedToUpdateAdmin', { error: error.message }));
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (user) => {
    // Prevent deleting self
    if (user.id === auth.currentUser.uid) {
      Alert.alert(t('admin.error'), t('admin.cannotDeleteSelf'));
      return;
    }
    
    setSelectedUser(user);
    setDeleteModalVisible(true);
  };

  const confirmDeleteUser = async () => {
    if (!selectedUser || !adminPassword) return;
    
    try {
      setIsProcessing(true);
      
      // Verify admin password by re-authenticating
      try {
        const currentUser = auth.currentUser;
        if (!currentUser) {
          Alert.alert(t('admin.error'), t('admin.notSignedIn'));
          return;
        }
        
        // Get admin email
        const adminDoc = await getDoc(doc(db, 'users', currentUser.uid));
        if (!adminDoc.exists()) {
          throw new Error(t('admin.adminUserNotFound'));
        }
        
        const adminEmail = adminDoc.data().email;
        
        // Attempt to sign in with provided password
        await signInWithEmailAndPassword(auth, adminEmail, adminPassword);
      } catch (authError) {
        console.error('Authentication error:', authError);
        Alert.alert(t('admin.authenticationFailed'), t('admin.incorrectPassword'));
        setIsProcessing(false);
        return;
      }
      
      // First create a record of the deletion for audit purposes
      await addDoc(collection(db, 'userDeletions'), {
        deletedUserId: selectedUser.id,
        deletedUserEmail: selectedUser.email,
        deletedAt: serverTimestamp(),
        deletedBy: auth.currentUser.uid,
        deletedByEmail: auth.currentUser.email,
        reason: 'Admin deletion'
      });
      
      // Delete user data from Firestore
      await deleteDoc(doc(db, 'users', selectedUser.id));
      
      // Update local state
      setUsers(users.filter(user => user.id !== selectedUser.id));
      
      Alert.alert(t('admin.success'), t('admin.userDeleted', { email: selectedUser.email }));
      
      // Close modal and reset
      setDeleteModalVisible(false);
      setSelectedUser(null);
      setAdminPassword('');
    } catch (error) {
      console.error('Error deleting user:', error);
      Alert.alert(t('admin.error'), t('admin.failedToDelete', { error: error.message }));
    } finally {
      setIsProcessing(false);
    }
  };

  const filteredUsers = users.filter(user => 
    user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.fullName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderUserItem = (user) => (
    <View key={user.id} style={styles.userCard}>
      <View style={styles.userInfo}>
        <Text style={styles.userName}>{user.fullName || 'Anonymous'}</Text>
        <Text style={styles.userEmail}>{user.email}</Text>
        <View style={styles.statusContainer}>
          {user.isAdmin && 
            <View style={styles.adminBadge}>
              <Text style={styles.adminBadgeText}>{t('admin.admin')}</Text>
            </View>
          }
          <View style={[styles.verificationBadge, 
            {backgroundColor: user.emailVerified ? '#4CD964' : '#FF3B30'}]}>
            <Text style={styles.verificationBadgeText}>
              {user.emailVerified ? t('admin.verified') : t('admin.unverified')}
            </Text>
          </View>
          {user.passwordResetPending && (
            <View style={styles.resetPendingBadge}>
              <Text style={styles.resetPendingText}>{t('admin.resetPending')}</Text>
            </View>
          )}
        </View>
      </View>
      
      <View style={styles.actionButtons}>
        <TouchableOpacity 
          style={[styles.actionButton, styles.resetButton]}
          onPress={() => handleEmailResetPassword(user.email)}
        >
          <Ionicons name="mail" size={16} color="white" />
          <Text style={styles.actionButtonText}>{t('admin.emailReset')}</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.actionButton, user.isAdmin ? styles.removeButton : styles.adminButton]}
          onPress={() => handleToggleAdmin(user)}
          disabled={user.id === auth.currentUser.uid && user.isAdmin}
        >
          <Ionicons name={user.isAdmin ? "person-remove" : "person-add"} size={16} color="white" />
          <Text style={styles.actionButtonText}>{user.isAdmin ? t('admin.demote') : t('admin.makeAdmin')}</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[
            styles.actionButton, 
            styles.deleteButton,
            user.id === auth.currentUser.uid && styles.disabledButton
          ]}
          onPress={() => handleDeleteUser(user)}
          disabled={user.id === auth.currentUser.uid}
        >
          <Ionicons name="trash-outline" size={16} color="white" />
          <Text style={styles.actionButtonText}>{t('admin.delete')}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#03174C" />
      
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.title}>{t('admin.title')}</Text>
        <TouchableOpacity 
          style={styles.refreshButton}
          onPress={fetchUsers}
        >
          <Ionicons name="refresh" size={24} color="white" />
        </TouchableOpacity>
      </View>
      
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="rgba(255, 255, 255, 0.7)" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder={t('admin.searchPlaceholder')}
          placeholderTextColor="rgba(255, 255, 255, 0.5)"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Ionicons name="close-circle" size={20} color="rgba(255, 255, 255, 0.7)" />
          </TouchableOpacity>
        )}
      </View>
      
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{users.length}</Text>
          <Text style={styles.statLabel}>{t('admin.totalUsers')}</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>
            {users.filter(user => user.isAdmin === true).length}
          </Text>
          <Text style={styles.statLabel}>{t('admin.admins')}</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>
            {users.filter(user => user.emailVerified === true).length}
          </Text>
          <Text style={styles.statLabel}>{t('admin.verified')}</Text>
        </View>
      </View>
      
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#1904E5" />
          <Text style={styles.loadingText}>{t('admin.loading')}</Text>
        </View>
      ) : (
        <ScrollView style={styles.userList} showsVerticalScrollIndicator={false}>
          {filteredUsers.length > 0 ? (
            filteredUsers.map(renderUserItem)
          ) : (
            <View style={styles.emptyContainer}>
              <Ionicons name="people" size={60} color="rgba(255, 255, 255, 0.3)" />
              <Text style={styles.emptyText}>
                {searchQuery ? t('admin.noUsersMatch') : t('admin.noUsersFound')}
              </Text>
            </View>
          )}
          <View style={styles.bottomSpace} />
        </ScrollView>
      )}
      
      {/* Delete Confirmation Modal */}
      <Modal
        visible={deleteModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => {
          setDeleteModalVisible(false);
          setSelectedUser(null);
          setAdminPassword('');
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{t('admin.deleteUser')}</Text>
            <Text style={styles.modalMessage}>
              {t('admin.deleteConfirmation', { email: selectedUser?.email })}
            </Text>
            
            <View style={styles.passwordContainer}>
              <Text style={styles.passwordLabel}>{t('admin.enterAdminPassword')}</Text>
              <TextInput
                style={styles.passwordInput}
                secureTextEntry
                placeholder={t('admin.adminPassword')}
                placeholderTextColor="rgba(255, 255, 255, 0.5)"
                value={adminPassword}
                onChangeText={setAdminPassword}
              />
            </View>
            
            <View style={styles.modalButtonContainer}>
              <TouchableOpacity 
                style={styles.cancelButton}
                onPress={() => {
                  setDeleteModalVisible(false);
                  setSelectedUser(null);
                  setAdminPassword('');
                }}
              >
                <Text style={styles.cancelButtonText}>{t('admin.cancel')}</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[
                  styles.deleteConfirmButton,
                  (!adminPassword || isProcessing) && styles.disabledButton
                ]}
                onPress={confirmDeleteUser}
                disabled={!adminPassword || isProcessing}
              >
                {isProcessing ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <Text style={styles.deleteConfirmButtonText}>{t('admin.delete')}</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default Admin;