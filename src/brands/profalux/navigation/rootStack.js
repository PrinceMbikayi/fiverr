import React from 'react';

import { createStackNavigator  } from '@react-navigation/stack';

import AuthLoadingScreen from '_screens/authLoadingScreen';
import { AuthStack } from './authStack';

import {AppDrawer} from './appDrawer';
import {WellcomeTourStack} from './WellcomeTourStack';
import {UserContextProvider} from '_hooks/useUserHigher';


const Stack = createStackNavigator();

const  RootStack = () => {
  return (
    <UserContextProvider>
      <Stack.Navigator
        real_initialRouteName="AuthLoading"
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

        {/* <Stack.Screen
          name="WellcomeTour"
          component={WellcomeTourStack}
          options={{ animationEnabled: false}}        
        /> */}

        <Stack.Screen
          name="App"
          component={AppDrawer} 
          options={{ animationEnabled: false}}  
      />
      </Stack.Navigator>
    </UserContextProvider>
  );
}

export default RootStack