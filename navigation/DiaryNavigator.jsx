import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";

import MoodSelectionScreen from "../pages/Discover/Diary/MoodSelectionScreen";
import BodyFeelingScreen from "../pages/Discover/Diary/BodyFeelingScreen";
import ShareFeelingScreen from "../pages/Discover/Diary/ShareFeelingScreen";
import TherapeuticQuestionsScreen from "../pages/Discover/Diary/TherapeuticQuestionsScreen";

const Stack = createStackNavigator();

const DiaryNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MoodSelection" component={MoodSelectionScreen} />
      <Stack.Screen name="BodyFeeling" component={BodyFeelingScreen} />
      <Stack.Screen name="ShareFeeling" component={ShareFeelingScreen} />
      <Stack.Screen name="TherapeuticQuestions" component={TherapeuticQuestionsScreen} />
    </Stack.Navigator>
  );
};

export default DiaryNavigator;
