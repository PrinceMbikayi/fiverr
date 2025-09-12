import React from 'react';
import { createStackNavigator,TransitionPresets } from '@react-navigation/stack';

import { VoiceAssistantHomeScreen } from './VoiceAssistantHomeScreen';
import { AppleHomeKitScreen } from './AppleHomeKitScreen';
import { AmazonAlexaScreen } from './AmazonAlexaScreen';
import { GoogleAssistantScreen } from './GoogleAssistantScreen';




const Stack = createStackNavigator();

  export const  VoiceAssistantStack = () => {
    return (
      <Stack.Navigator
        initialRouteName="VoiceAssistantHomeScreen" 
        screenOptions={{
          headerShown: false,
          cardStyle: { backgroundColor: '#FFFFFF' },
          ...TransitionPresets.SlideFromRightIOS,
        }}
      >


          <Stack.Screen name="VoiceAssistantHomeScreen" component={VoiceAssistantHomeScreen} />
          <Stack.Screen name="AppleHomeKitScreen" component={AppleHomeKitScreen} />
          <Stack.Screen name="AmazonAlexaScreen" component={AmazonAlexaScreen} />
          <Stack.Screen name="GoogleAssistantScreen" component={GoogleAssistantScreen} />
      </Stack.Navigator>
    );
  }
  