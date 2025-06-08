# DEM AI - Meditation & Wellness App

A comprehensive meditation and wellness application built with React Native and Expo, designed to help users manage stress, practice mindfulness, and improve their overall mental well-being.

## 🧘‍♀️ Overview

DEM AI is a modern meditation app that provides users with guided breathing exercises, meditation sessions, therapy resources, and wellness tracking tools. The app features an intuitive interface with personalized recommendations and professional support options.

## ✨ Features

### 🏠 Home Dashboard
- Personalized greeting and mood check-in
- Quick access to essential features
- Recent meditation packs display
- Smart recommendations based on user activity

### 🌬️ Breathing Exercises
- Guided breathing sessions with visual cues
- Customizable timer (shown: 59 seconds)
- Pause and reset functionality
- Breathing pattern visualization

### 🧠 Meditation Library
- **Overall Wellbeing**: Intro to Meditation, Foster Mindfulness, Loving-Kindness
- **Mindset**: Focusing on Work, Focusing on Study
- **Challenges**: Five Senses, Positivity Boost, Letting Go
- **Sleep**: Falling Asleep, Soothing Sleep sessions

### 📚 Content Categories
- **Habits** (26 sessions)
- **Therapy** (12 sessions) 
- **Relaxation** (12 sessions)
- **Games** (65 sessions)
- **Affirmation** (11 sessions)
- **Test** (32 sessions)
- **Nature** (52 sessions)
- **News** (18 sessions)
- **Diary** (19 sessions)

### 🩺 Professional Support
- Find local specialists (Psychologists & Psychiatrists)
- Location-based search (Astana, Kazakhstan and surrounding areas)
- Filter by specialization and ratings
- Online consultation options

### 📝 Personal Diary
- Daily mood and thought tracking
- Calendar view for entries
- Progress monitoring
- Reflection prompts

### 💬 AI Chat Support
- Conversational AI for immediate support
- Personalized wellness tips
- Crisis intervention guidance
- 24/7 availability

## 🛠️ Technical Stack

- **Framework**: React Native with Expo
- **Platform**: iOS/Android
- **Design**: Based on Figma design system
- **State Management**: React Hooks
- **Navigation**: React Navigation


## 📱 Screenshots
### App Launch & Home
![image](https://github.com/user-attachments/assets/93134848-e851-48a6-a629-ecae16845df0)
![image](https://github.com/user-attachments/assets/710b4405-5e2a-40f6-b52b-954b3c87183a)


### Content Discovery
![image](https://github.com/user-attachments/assets/c99c5be9-b2e2-42c2-88de-e357552bdd22)

### Core Features

![image](https://github.com/user-attachments/assets/1b98d62b-672d-43eb-86d2-b7b2eeff3c37)
![image](https://github.com/user-attachments/assets/8ded0a82-b722-4409-b88b-664fa791d826)
![image](https://github.com/user-attachments/assets/d0f8de24-c251-4c39-a91d-1afd472c93ef)



### Personal Tools
![image](https://github.com/user-attachments/assets/eb34ce82-5fad-4d5a-97e8-13cacaac1d73)
![image](https://github.com/user-attachments/assets/a9fc7a3c-0a03-4c38-8cc5-b7d4246d49c9)
![image](https://github.com/user-attachments/assets/a8a1f808-facc-4c49-8e74-aee705bebe09)
![image](https://github.com/user-attachments/assets/de229417-a9bf-49ee-9cdb-410a470e909d)


## 🎨 Design

The app follows a modern, calming design philosophy with:
- Deep blue primary color scheme promoting tranquility
- Gradient overlays and soft shadows
- Intuitive iconography and typography
- Accessible color contrasts
- Smooth animations and transitions

**Figma Design**: [View Design System](https://www.figma.com/design/q3CN6vrNXIo9pHXt23zYID/Meditation-app-UI--Community-?node-id=0-1&p=f&t=vKHmbTPjC6LGSVUn-0)

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- Expo CLI
- iOS Simulator or Android Emulator
- Expo Go app (for physical device testing)

### Installation

1. Clone the repository
```bash
git clone [your-repo-url]
cd meditation-app
```

2. Install dependencies
```bash
npm install
# or
yarn install
```

3. Start the development server
```bash
npx expo start
# or
yarn start
```

4. Run on your preferred platform
```bash
# iOS
npx expo run:ios

# Android  
npx expo run:android
```

## 📦 Key Dependencies

```json
{
  "expo": "~49.0.0",
  "react": "18.2.0",
  "react-native": "0.72.0",
  "@react-navigation/native": "^6.0.0",
  "@react-navigation/stack": "^6.0.0",
  "react-native-safe-area-context": "^4.0.0",
  "react-native-screens": "^3.0.0",
  "react-native-vector-icons": "^10.0.0",
  "react-native-linear-gradient": "^2.8.0",
  "@react-native-async-storage/async-storage": "^1.19.0"
}
```

## 🏗️ Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── common/         # Common components (buttons, inputs)
│   ├── breathing/      # Breathing exercise components
│   ├── meditation/     # Meditation-related components
│   └── chat/          # Chat interface components
├── screens/            # App screens
│   ├── HomeScreen.js
│   ├── MeditationScreen.js
│   ├── BreathingScreen.js
│   ├── ChatScreen.js
│   ├── DiaryScreen.js
│   └── SpecialistScreen.js
├── navigation/         # Navigation configuration
│   └── AppNavigator.js
├── services/          # API and external services
│   ├── meditationAPI.js
│   └── locationService.js
├── utils/             # Helper functions
│   └── constants.js
├── assets/            # Images, fonts, icons
│   ├── images/
│   ├── icons/
│   └── fonts/
└── styles/            # Global styles and themes
    ├── colors.js
    ├── typography.js
    └── globalStyles.js
```

## 🌟 Key Features Implementation

### Breathing Timer Component
```javascript
// Custom circular progress indicator with pause/resume functionality
const BreathingTimer = ({ duration, onComplete }) => {
  // Implementation details...
};
```

### Content Library Grid
```javascript
// Grid-based browsing with category filtering
const ContentGrid = ({ categories, onCategorySelect }) => {
  // Implementation details...
};
```

### Location-based Specialist Search
```javascript
// Integration with maps for specialist search
const SpecialistFinder = ({ location, filters }) => {
  // Implementation details...
};
```

### Calendar Diary Component
```javascript
// Custom diary entry tracking with calendar view
const DiaryCalendar = ({ entries, onDateSelect }) => {
  // Implementation details...
};
```

## 🎯 App Flow

1. **Launch Screen**: Splash screen with DEM AI branding
2. **Home Dashboard**: Personalized welcome with quick actions
3. **Content Discovery**: Browse meditation categories and sessions
4. **Breathing Exercises**: Guided breathing with visual timer
5. **AI Chat**: Conversational support and guidance
6. **Specialist Finder**: Location-based professional search
7. **Personal Diary**: Mood tracking and reflection
8. **Meditation Library**: Categorized content for different needs

## 🔧 Configuration

### Environment Variables
```bash
# .env file
API_BASE_URL=https://your-api-endpoint.com
MAPS_API_KEY=your_google_maps_key
CHAT_API_KEY=your_openai_key
```

### App Configuration
```javascript
// app.config.js
export default {
  expo: {
    name: "DEM AI",
    slug: "dem-ai-meditation",
    version: "1.0.0",
    platforms: ["ios", "android"],
    // Additional config...
  },
};
```

## 🔮 Future Enhancements

- [ ] Push notifications for meditation reminders
- [ ] Social features and community sharing
- [ ] Advanced analytics and progress tracking
- [ ] Offline content download
- [ ] Wearable device integration
- [ ] Multiple language support
- [ ] Voice-guided meditation
- [ ] Biometric integration (heart rate monitoring)



## 📱 Build & Deployment

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📞 Support

For support and questions, please contact:
- Email: [your-email@example.com]
- GitHub Issues: [Create an issue](https://github.com/your-username/dem-ai-meditation/issues)

## 🙏 Acknowledgments

- Design inspiration from meditation and wellness apps
- Icons from React Native Vector Icons
- UI components based on the Figma community design
- Special thanks to the React Native and Expo communities

---

*Built with ❤️ using React Native and Expo*

## 📊 App Statistics

- **Categories**: 10+ content categories
- **Sessions**: 300+ meditation and wellness sessions
- **Languages**: Currently English, expanding to more
- **Platforms**: iOS & Android
- **Offline Support**: Selected content available offline




