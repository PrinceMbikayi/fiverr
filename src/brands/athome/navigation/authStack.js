import React from 'react';

import { createStackNavigator,TransitionSpecs,TransitionPresets } from '@react-navigation/stack';


import LoginScreen from '_screens/login';
import AccessScreen from '_screens/access';
import SubscribeScreen from '_screens/subscribe';
import ReinitPasswordScreen from '_screens/reinitPassword';
import LostPasswordScreen from '_screens/lostPassword';




const Stack = createStackNavigator();

export const  AuthStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="Access" 
      noscreenOptions={{  headerShown: false, animationEnabled: false }} 
      screenOptions={{headerShown: false,...TransitionPresets.SlideFromRightIOS,}}
    >
        <Stack.Screen name="Access" component={AccessScreen} options={{animationEnabled: false }}/>
        <Stack.Screen name="Subscribe" component={SubscribeScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="LostPassword" component={LostPasswordScreen} />
        <Stack.Screen name="ReinitPassword" component={ReinitPasswordScreen} />
      
    </Stack.Navigator>
  );
}
