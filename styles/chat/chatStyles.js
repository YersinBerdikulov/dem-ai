import { StyleSheet, Dimensions, Platform } from 'react-native';

const { width } = Dimensions.get('window');

export const chatStyles = StyleSheet.create({
  ...Platform.select({
    ios: {
      container: {
        flex: 1,
        backgroundColor: 'transparent',
      },
      gradientBackground: {
        ...StyleSheet.absoluteFillObject,
      },
    },
    android: {
      container: {
        flex: 1,
        backgroundColor: 'transparent',
      },
      gradientBackground: {
        ...StyleSheet.absoluteFillObject,
      },
    }
  }),
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
    backgroundColor: 'rgba(0, 0, 0, 0.15)',
  },
  backButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 12,
    flex: 1,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    marginBottom: 2,
  },
  userStatus: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerIcon: {
    padding: 6,
    marginLeft: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 18,
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chatContainer: {
    flex: 1,
    padding: 16,
  },
  messageList: {
    flex: 1,
  },
  message: {
    maxWidth: '80%',
    marginBottom: 16,
    padding: 16,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#4E66E3',
    borderTopRightRadius: 4,
  },
  botMessage: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderTopLeftRadius: 4,
  },
  messageText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontFamily: 'Poppins-Regular',
    lineHeight: 22,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingTop: 12,
    paddingBottom: Platform.OS === 'ios' ? 32 : 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.08)',
    backgroundColor: 'rgba(0, 0, 0, 0.15)',
  },
  inputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderRadius: 24,
    marginRight: 12,
    paddingHorizontal: 4,
  },
  input: {
    flex: 1,
    color: '#FFFFFF',
    fontFamily: 'Poppins-Regular',
    fontSize: 15,
    paddingHorizontal: 12,
    paddingVertical: 10,
    minHeight: 44,
    maxHeight: 120,
  },
  actionButtonLeft: {
    padding: 8,
    marginHorizontal: 2,
  },
  actionButtonRight: {
    width: 46,
    height: 46,
    borderRadius: 23,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  sendButtonActive: {
    backgroundColor: '#4E66E3',
  },
  sendButtonInactive: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  emptyChat: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  emptyChatText: {
    color: 'rgba(255,255,255,0.7)',
    marginTop: 20,
    textAlign: 'center',
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    maxWidth: '80%',
    lineHeight: 24,
  }
});