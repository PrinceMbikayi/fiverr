import React from 'react';

import { createStackNavigator,TransitionPresets } from '@react-navigation/stack';

import UpdatePasswordScreen from '_screens/updatePassword';
import ChangeWifiAccessPointScreen from '_screens/wifiAccessPoint';
//import {WeatherWizard} from '_brand/templates/components/objects/weatherSupport/WeatherWizard';
import { MeteoSettings } from '_brand/templates/screens/settings/MeteoSettings';
//import BlueToothScanHomeScreen from '_screens/settings/bluetooth';

//import {BLEStack} from '_screens/settings/bluetooth/navigation';


import SettingsScreen from '../templates/screens/settings'
import UdpAuditScreen from '_screens/settings/udpAudit/';



const Stack = createStackNavigator();

export const  SettingsStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="Settings" 
      screenOptions={{
        headerShown: false,
        unmountOnBlur: true,
        ...TransitionPresets.SlideFromRightIOS,
      }}   
    >
        <Stack.Screen name="Settings" component={SettingsScreen} />
        {/* <Stack.Screen name="WifiAccessPoint" component={ChangeWifiAccessPointScreen}/> */}
        <Stack.Screen name="MeteoSettings" component={MeteoSettings}/>
        {/* <Stack.Screen name="BlueToothScanHome" component={BLEStack} />
        <Stack.Screen name="UdpAudit" component={UdpAuditScreen}/>
        <Stack.Screen name="UpdatePassword" component={UpdatePasswordScreen}/> */}
    </Stack.Navigator>
  );
}


/*






const SettingsStack = createStackNavigator(
    {
       
        UpdatePassword : { screen:UpdatePasswordScreen,navigationOptions:noHeader},
        WifiAccessPoint : {screen:ChangeWifiAccessPointScreen,navigationOptions:noHeader},
        BlueToothScanHome : {screen:BlueToothScanHomeScreen,navigationOptions:noHeader},
        UdpAudit : {screen:udpAuditStack,navigationOptions:noHeader},
        Settings : {screen:SettingsScreen,navigationOptions:noHeader},
    },
    {
        initialRouteName:'Settings'
    }
*/