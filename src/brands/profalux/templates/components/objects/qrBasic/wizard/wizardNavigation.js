import React from 'react';

import { createStackNavigator,TransitionPresets } from '@react-navigation/stack';

import QrPublicWizardStartScreen from './screens/qrBasicWizard';
import QrPublicWizardInputsScreen from '_components/objects/qrBasic/wizard/screens/qrBasicInputs.js';
import QrPublicWizardPhotoScreen from '_components/objects/qrBasic/wizard/screens/qrBasicPhoto.js';
import QrBasicReadQRCodeScreen from '_components/objects/qrBasic/wizard/screens/qrBasicWizardReadQRCode.js';
import QrBasicCompleteScreen from '_components/objects/qrBasic/wizard/screens/qrBasicComplete';


const Stack = createStackNavigator();

// AddQrPublicStart

const  AddQrBasicStack = () => {
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

export default AddQrBasicStack