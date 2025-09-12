import React from 'react';
import { createStackNavigator,TransitionPresets } from '@react-navigation/stack';

import { SolarAssistantHomeScreen } from '_brand/templates/screens/addObject/screens/solarAssistant/SolarAssistantHomeScreen';
import { ConnectSolarDongleScreen } from './ConnectSolarDongleScreen';
import { SolarAssistantProcess } from './SolarAssistantProcess';



const Stack = createStackNavigator();

  export const  SolarAssistantStack = () => {
    return (
      <Stack.Navigator
        initialRouteName="SolarAssistantHomeScreen" 
        screenOptions={{
          headerShown: false,
          unmountOnBlur: true,
          cardStyle: { backgroundColor: '#FFFFFF' },
          ...TransitionPresets.SlideFromRightIOS,
        }}
      >


          <Stack.Screen name="SolarAssistantHomeScreen" component={SolarAssistantHomeScreen} />
          <Stack.Screen name="ConnectSolarDongleScreen" component={ConnectSolarDongleScreen} />
          <Stack.Screen name="SolarAssistantProcess" component={SolarAssistantProcess} />
      </Stack.Navigator>
    );
  }
  