import React from 'react';
import { createStackNavigator,TransitionPresets } from '@react-navigation/stack';

import { garageDoorBleAssistantHomeScreen } from '_brand/templates/screens/addObject/screens/garageDoorBleAssistant/garageDoorBleAssistantHomeScreen';

import WifiSettings from '_src/brands/profalux/templates/components/objects/bluetoothPairing/wifi/wifiSetup';


//import { WifiConnectionPasswordScreen } from '_brand/templates/screens/addObject/screens/garageDoorBleAssistant/WifiConnectionPasswordScreen';

//-------------- olivier ----------------
import {BleContextProvider} from '_hooks/ble/bleContext';
import {useRoute} from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';

import references from '_src/brands//profalux/templates/screens/addObject/screens/blePairingObjects.json';
import WizardScreensWrapper from '../wizardScreensWrapper';


const Stack = createStackNavigator();

  export const  SesameWifiStack = () => {

     const route = useRoute();
      const navigationParams = route?.params || {};
      const navParams = navigationParams;
      console.log("SesameWifiStack",navigationParams)
      const CLOSE_DESTINATION = "ToTop";

    return (
      <BleContextProvider home="garageDoorBleAssistantHomeScreen" references={references} >
         <WizardScreensWrapper cancelDestination={CLOSE_DESTINATION} debug="settings navigation">
      <Stack.Navigator
       initialRouteName="WifiConnectionPasswordScreen" 
           __initialRouteName="WifiConnectionPasswordScreen"
        screenOptions={{
          headerShown: false,
          unmountOnBlur: true,
          cardStyle: { backgroundColor: '#FFFFFF' },
          ...TransitionPresets.SlideFromRightIOS,
        }}
      >

          <Stack.Screen name="WifiConnectionPasswordScreen" component={WifiSettings} initialParams={{...navParams,next:"SesameEndSettings",isWizard:0}}/>
      
      </Stack.Navigator>
      </WizardScreensWrapper>
      </BleContextProvider>
    );
  }
  