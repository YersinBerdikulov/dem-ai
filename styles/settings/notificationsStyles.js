import { StyleSheet } from 'react-native';

export const notificationsStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#03174C',
    paddingTop: 40,
  },
  header: {
    paddingHorizontal: 20,
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    padding: 5,
    marginRight: 10,
  },
  title: {
    fontFamily: 'Poppins-Bold',
    fontSize: 24,
    color: '#FFFFFF',
    marginBottom: 10,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  description: {
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    color: '#BFC1D6',
    lineHeight: 24,
    marginBottom: 30,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 30,
  },
  switchLabel: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    color: '#FFFFFF',
  },
  switch: {
    transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }],
  },
  notificationTypes: {
    marginTop: 20,
  },
  sectionTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    color: '#FFFFFF',
    marginBottom: 15,
  },
  notificationOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  optionTitle: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 4,
  },
  optionDescription: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: '#BFC1D6',
  },
  testButton: {
    backgroundColor: '#4E66E3',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 20,
  },
  testButtonText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    color: '#FFFFFF',
  },
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderTopWidth: 0.5,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
    backgroundColor: '#03174C',
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  navText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: '#6E7191',
    marginTop: 4,
  },
  activeNavText: {
    color: '#4E66E3',
    fontFamily: 'Poppins-Medium',
  },
});