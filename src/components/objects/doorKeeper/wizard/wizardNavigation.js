import React from 'react';

import { createStackNavigator,TransitionPresets } from '@react-navigation/stack';

import DoorKeeperWizardStartScreen from './screens/doorKeeperWizard';
import DoorKeeperWizardWifiScreen from './screens/doorKeeperWizardWifi';
import DoorKeeperWizardGenerateQRCodeScreen from './screens/doorKeeperWizardGenerateQRCode';
import DoorKeeperReadQRCodeScreen from './screens/doorKeeperWizardReadQRCode';
import DoorKeeperSimpleRegisterScreen from './screens/doorKeeperWizardRegisterSimple';


const Stack = createStackNavigator();

export const  AddDoorKeeperStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="VdpArchiveHome" 
      screenOptions={{
        headerShown: false,
        ...TransitionPresets.SlideFromRightIOS,
      }}   
    >
        <Stack.Screen name="AddDoorKeeperStart" component={DoorKeeperWizardStartScreen} />
        <Stack.Screen name="AddDoorKeeperWifi" component={DoorKeeperWizardWifiScreen}/>
        <Stack.Screen name="AddDoorKeeperGenerateQRCode" component={DoorKeeperWizardGenerateQRCodeScreen} />
        <Stack.Screen name="AddDoorKeeperReadQRCode" component={DoorKeeperReadQRCodeScreen}/>
        <Stack.Screen name="AddDoorKeeperRegister" component={DoorKeeperSimpleRegisterScreen} />
    </Stack.Navigator>
  );
}