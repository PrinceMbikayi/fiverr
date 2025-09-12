import React from 'react';
import { createStackNavigator,TransitionPresets } from '@react-navigation/stack';

import { InstallZigbeeNetworkScreen } from './InstallZigbeeNetworkScreen';
import { CalypshomeBoxHomeScreen } from './CalypshomeBoxHomeScreen';



const Stack = createStackNavigator();

  export const  CalypsHomeAssistantStack = () => {
    return (
      <Stack.Navigator
        initialRouteName="CalypshomeBoxHomeScreen" 
        screenOptions={{
          headerShown: false,
          unmountOnBlur: true,
          cardStyle: { backgroundColor: '#FFFFFF' },
          ...TransitionPresets.SlideFromRightIOS,
        }}
      >


          <Stack.Screen name="CalypshomeBoxHomeScreen" component={CalypshomeBoxHomeScreen} />
          <Stack.Screen name="InstallZigbeeNetworkScreen" component={InstallZigbeeNetworkScreen} />
      </Stack.Navigator>
    );
  }
  