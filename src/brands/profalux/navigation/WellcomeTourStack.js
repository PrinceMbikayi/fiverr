import React from 'react';

import { createStackNavigator,TransitionSpecs,TransitionPresets } from '@react-navigation/stack';


import LoginScreen from '_screens/login';
import AccessScreen from '_screens/access';
import SubscribeScreen from '_screens/subscribe';
import ReinitPasswordScreen from '_screens/reinitPassword';
import LostPasswordScreen from '_screens/lostPassword';
import {BeginRoundScreen} from "_brand/templates/screens/wellcomeTour/screens/BeginRoundScreen"





const Stack = createStackNavigator();

export const  WellcomeTourStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="BeginRound" 
      noscreenOptions={{headerShown: false, animationEnabled: false }} 
      screenOptions={{headerShown: false,...TransitionPresets.SlideFromRightIOS, cardStyle: { backgroundColor: '#EBF1F5' }
      }}
    >
        <Stack.Screen name="BeginRound" component={BeginRoundScreen} options={{animationEnabled: false }}/>
        {/* <Stack.Screen name="Subscribe" component={LoginScreen} />
        <Stack.Screen name="Login" component={SubscribeScreen} />
        <Stack.Screen name="LostPassword" component={LostPasswordScreen} />
        <Stack.Screen name="ReinitPassword" component={ReinitPasswordScreen} /> */}
      
    </Stack.Navigator>
  );
}
