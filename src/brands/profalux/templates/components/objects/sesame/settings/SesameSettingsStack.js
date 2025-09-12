import React from 'react';
import { createStackNavigator,TransitionPresets } from '@react-navigation/stack';

import { garageDoorBleAssistantHomeScreen } from '_brand/templates/screens/addObject/screens/garageDoorBleAssistant/garageDoorBleAssistantHomeScreen';
import {SesameSettingsScreen} from './SesameSettingsScreen';
import {SesameWifiStack} from './SesameWifiStack';
import {useRoute} from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';

//import { WifiConnectionPasswordScreen } from '_brand/templates/screens/addObject/screens/garageDoorBleAssistant/WifiConnectionPasswordScreen';

//-------------- olivier ----------------




const Stack = createStackNavigator();

  export const  SesameSettingsStack = () => {

     const route = useRoute();
      const navigationParams = route?.params || {};
      const params = navigationParams;
      console.log("SesameSettingsStack navigationParams",navigationParams)
    return (
    
      <Stack.Navigator
       initialRouteName="SesameSettingsHome" 
           __initialRouteName="WifiConnectionPasswordScreen"
        screenOptions={{
          headerShown: false,
          unmountOnBlur: true,
          cardStyle: { backgroundColor: '#FFFFFF' },
          ...TransitionPresets.SlideFromRightIOS,
        }}
      >
         <Stack.Screen name="SesameSettingsHome" component={SesameSettingsScreen} initialParams={{...navigationParams}}/>
          <Stack.Screen name="SesameSettingsWifi" component={SesameWifiStack} initialParams={{next:"SesameEndWizard",isWizard:0}}/>
      
      </Stack.Navigator>
      
    );
  }
  