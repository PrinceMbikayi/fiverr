import React from 'react';

import { createStackNavigator,TransitionSpecs,TransitionPresets  } from '@react-navigation/stack';

import AuthLoadingScreen from '_screens/authLoadingScreen';
import { AuthStack } from './authStack';

import {AppDrawer} from './appDrawer';
const Stack = createStackNavigator();

export const  RootStack = () => {
  return (
    <Stack.Navigator
     
      initialRouteName="AuthLoading"
      screenOptions={{
        headerShown: false,
       
      }}   
    >
      
      <Stack.Screen
        name="AuthLoading"
        component={AuthLoadingScreen} 
        options={{ animationEnabled: false}}  
        
      />
       <Stack.Screen
        name="Auth"
        component={AuthStack}
        options={{ animationEnabled: false}}        
      />
       <Stack.Screen
        name="App"
        component={AppDrawer} 
        options={{ animationEnabled: false}}  
        />
    </Stack.Navigator>
  );
}