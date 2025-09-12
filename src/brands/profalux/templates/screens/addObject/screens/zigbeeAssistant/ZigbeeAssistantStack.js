import React from 'react';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';

import { ZigbeeAssistantHomeScreen } from './ZigbeeAssistantHomeScreen';
import { ZigbeeAssistantChooseBoxScreen } from './ZigbeeAssistantChooseBoxScreen';
import { PortableRemoteEquipmentsScreen } from './PortableRemoteEquipmentsScreen';
import { AddShuttersProcessScreen } from './AddShuttersProcessScreen';
import { WallRemoteEquipmentsScreen } from './WallRemoteEquipmentsScreen';
import { CalypsHomeSensorsScreen } from './CalypsHomeSensorsScreen';
import { ZigbeeReceptorEquipmentsScreen } from './ZigbeeReceptorEquipmentsScreen';
import {AssociateBoxToNetworkInfoScreen} from '_brand/templates/screens/addObject/screens/zigbeeAssistant/AssociateBoxToNetworkInfoScreen';
import {RemoteTypeChoiceScreen} from '_brand/templates/screens/addObject/screens/zigbeeAssistant/RemoteTypeChoiceScreen';
import {OpenNetworkScreen} from '_brand/templates/screens/addObject/screens/zigbeeAssistant/OpenNetworkScreen';
import {BoxJoiningNetworkLoadingScreen} from '_brand/templates/screens/addObject/screens/zigbeeAssistant/BoxJoiningNetworkLoadingScreen';
import {BoxScanResultScreen} from '_brand/templates/screens/addObject/screens/zigbeeAssistant/BoxScanResultScreen';




const Stack = createStackNavigator();

export const ZigbeeAssistantStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="ZigbeeAssistantChooseBoxScreen"
      screenOptions={{
        headerShown: false,
        unmountOnBlur: true,
        cardStyle: { backgroundColor: '#FFFFFF' },
        ...TransitionPresets.SlideFromRightIOS,
      }}
    >

      <Stack.Screen name="ZigbeeAssistantChooseBoxScreen" component={ZigbeeAssistantChooseBoxScreen} />
      <Stack.Screen name="ZigbeeAssistantHomeScreen" component={ZigbeeAssistantHomeScreen} />
      <Stack.Screen name="PortableRemoteEquipmentsScreen" component={PortableRemoteEquipmentsScreen} />
      <Stack.Screen name="AddShuttersProcessScreen" component={AddShuttersProcessScreen} />
      <Stack.Screen name="WallRemoteEquipmentsScreen" component={WallRemoteEquipmentsScreen} />
      <Stack.Screen name="CalypsHomeSensorsScreen" component={CalypsHomeSensorsScreen} />
      <Stack.Screen name="ZigbeeReceptorEquipmentsScreen" component={ZigbeeReceptorEquipmentsScreen} />
      <Stack.Screen name="AssociateBoxToNetworkInfoScreen" component={AssociateBoxToNetworkInfoScreen} />
      <Stack.Screen name="RemoteTypeChoiceScreen" component={RemoteTypeChoiceScreen} />
      <Stack.Screen name="OpenNetworkScreen" component={OpenNetworkScreen} />
      <Stack.Screen name="BoxJoiningNetworkLoadingScreen" component={BoxJoiningNetworkLoadingScreen} />
      <Stack.Screen name="BoxScanResultScreen" component={BoxScanResultScreen} />
    </Stack.Navigator>
  );
}
