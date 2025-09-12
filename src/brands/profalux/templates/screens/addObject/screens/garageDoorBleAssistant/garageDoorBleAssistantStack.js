import React from 'react';
import { createStackNavigator,TransitionPresets } from '@react-navigation/stack';

import { garageDoorBleAssistantHomeScreen } from '_brand/templates/screens/addObject/screens/garageDoorBleAssistant/garageDoorBleAssistantHomeScreen';
import { BluetoothActivationWarningScreen } from '_brand/templates/screens/addObject/screens/garageDoorBleAssistant/BluetoothActivationWarningScreen';
import { BleEquipmentSearchScreen } from '_brand/templates/screens/addObject/screens/garageDoorBleAssistant/BleEquipmentSearchScreen';
import {BleEquipmentCreateOnServer} from '_brand/templates/screens/addObject/screens/garageDoorBleAssistant/BleEquipmentCreateOnServer';
import { OPRollBleActivationInfosScreen } from '_brand/templates/screens/addObject/screens/garageDoorBleAssistant/OPRollBleActivationInfosScreen';
import { WifiConnectionPasswordScreen } from '_brand/templates/screens/addObject/screens/garageDoorBleAssistant/WifiConnectionPasswordScreen';
import { BleDevicesFoundScreen } from '_brand/templates/screens/addObject/screens/garageDoorBleAssistant/BleDevicesFoundScreen';
// import { BlePairingScreen } from '_brand/templates/screens/addObject/screens/garageDoorBleAssistant/BlePairingScreen';
import {SesameEndWizard} from '_brand/templates/screens/addObject/screens/garageDoorBleAssistant/NameAndCompleteWizard';
import WifiSettings from '_src/brands/profalux/templates/components/objects/bluetoothPairing/wifi/wifiSetup';

import {getDetailsComponent} from '_brand/navigation/productDetails'
import {getSettingsComponent} from '_brand/navigation/productSettings';


//import { WifiConnectionPasswordScreen } from '_brand/templates/screens/addObject/screens/garageDoorBleAssistant/WifiConnectionPasswordScreen';

//-------------- olivier ----------------
import {BleContextProvider} from '_hooks/ble/bleContext';
import references from '../blePairingObjects';



const Stack = createStackNavigator();

  export const  garageDoorBleAssistantStack = () => {
    return (
      <BleContextProvider home="garageDoorBleAssistantHomeScreen" references={references} >
      <Stack.Navigator
       initialRouteName="garageDoorBleAssistantHomeScreen" 
           __initialRouteName="WifiConnectionPasswordScreen"
        screenOptions={{
          headerShown: false,
          unmountOnBlur: true,
          cardStyle: { backgroundColor: '#FFFFFF' },
          ...TransitionPresets.SlideFromRightIOS,
        }}
      >


          <Stack.Screen name="garageDoorBleAssistantHomeScreen" component={garageDoorBleAssistantHomeScreen} />
          <Stack.Screen name="BluetoothActivationWarningScreen" component={BluetoothActivationWarningScreen} />
          <Stack.Screen name="BleEquipmentSearchScreen" component={BleEquipmentSearchScreen} initialParams={{next:"BleEquipmentCreateOnServer"}}/>
          <Stack.Screen name="BleEquipmentCreateOnServer" component={BleEquipmentCreateOnServer} initialParams={{next:"WifiConnectionPasswordScreen"}} /> 
          <Stack.Screen name="OPRollBleActivationInfosScreen" component={OPRollBleActivationInfosScreen} />
          <Stack.Screen name="WifiConnectionPasswordScreenHarold" component={WifiConnectionPasswordScreen} />
          <Stack.Screen name="BleDevicesFoundScreen" component={BleDevicesFoundScreen} />
          {/* <Stack.Screen name="BlePairingScreen" component={BlePairingScreen} /> */}
          <Stack.Screen name="WifiConnectionPasswordScreen" component={WifiSettings} initialParams={{next:"SesameEndWizard",isWizard:1}}/>
          <Stack.Screen name="SesameEndWizard" component={SesameEndWizard}/>
          {/* <Stack.Screen name="ProductDetails" component={getDetailsComponent} /> 
          <Stack.Screen name="ProductSettings">{(props) => getSettingsComponent(props)}</Stack.Screen> */}
      </Stack.Navigator>
      </BleContextProvider>
    );
  }
  