import React from 'react';
import { createStackNavigator,TransitionPresets } from '@react-navigation/stack';

import { NetatmoAssistantHomeScreen } from './NetatmoAssistantHomeScreen';



const Stack = createStackNavigator();

  export const  NetatmoAssistantStack = () => {
    return (
      <Stack.Navigator
        initialRouteName="NetatmoAssistantHomeScreen" 
        screenOptions={{
          headerShown: false,
          unmountOnBlur: true,
          cardStyle: { backgroundColor: '#FFFFFF' },
          ...TransitionPresets.SlideFromRightIOS,
        }}
      >


          <Stack.Screen name="NetatmoAssistantHomeScreen" component={NetatmoAssistantHomeScreen} />
      </Stack.Navigator>
    );
  }
  