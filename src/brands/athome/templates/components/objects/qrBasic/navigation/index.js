import React from 'react';

import { createStackNavigator,TransitionPresets } from '@react-navigation/stack';


import QrCodeVDPSettingsScreen from '../screens/qrCodeVdpSettings';
import QrCodeVDPModalScreen from '../screens/qrCodeVdpModal';



const Stack = createStackNavigator();

/*
export const  VdpStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="VdpArchiveHome" 
      screenOptions={{
        headerShown: false,
        ...TransitionPresets.SlideFromRightIOS,
      }}   
    >
        <Stack.Screen name="VdpArchiveHome" component={VdpArchiveHomeScreen} />
        <Stack.Screen name="QrCodeVdpSettings" component={QrCodeVDPSettingsScreen}/>
        <Stack.Screen name="VdpArchivePlayer" component={VdpArchivePlayerScreen} />
    </Stack.Navigator>
  );
}
*/
export const QrCodeVDPScreens = [
  {'name':"QrCodeVDPSettings", key:'QrCodeVDPSettings','component':QrCodeVDPSettingsScreen},
  {'name':"QrCodeVDPModal", key:'QrCodeVDPModal','component':QrCodeVDPModalScreen, 'options':{ presentation: 'transparentModal' }}
];


