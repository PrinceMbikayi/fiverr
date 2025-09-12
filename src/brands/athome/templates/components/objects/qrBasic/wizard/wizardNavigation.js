import React from 'react';

import { createStackNavigator,TransitionPresets } from '@react-navigation/stack';

import QrPublicWizardStartScreen from './screens/qrBasicWizard';
import QrPublicWizardInputsScreen from './screens/qrBasicInputs';
import QrPublicWizardPhotoScreen from './screens/qrBasicPhoto';
import QrBasicReadQRCodeScreen from './screens/qrBasicWizardReadQRCode';
import QrBasicCompleteScreen from './screens/qrBasicComplete';


const Stack = createStackNavigator();

// AddQrPublicStart

export const  AddQrBasicStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="AddQrPublicStart" 
      screenOptions={{
        headerShown: false,
        ...TransitionPresets.SlideFromRightIOS,
      }}   
    >
        <Stack.Screen name="AddQrPublicStart" component={QrPublicWizardStartScreen} />       
        <Stack.Screen name="AddQrBasicInputs" component={QrPublicWizardInputsScreen} />
        <Stack.Screen name="AddQrBasicPhoto" component={QrPublicWizardPhotoScreen} />
        <Stack.Screen name="AddQrBasicReadQRCode" component={QrBasicReadQRCodeScreen}/>
        <Stack.Screen name="AddQrBasicComplete" component={QrBasicCompleteScreen}/>       
    </Stack.Navigator>
  );
}