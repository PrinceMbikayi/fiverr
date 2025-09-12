import React from 'react';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
import { AssistantsHomeScreen } from '_brand/templates/screens/addObject/AssistantsHomeScreen';
import { ZigbeeAssistantStack } from './zigbeeAssistant/ZigbeeAssistantStack';
import { SolarAssistantStack } from './solarAssistant/SolarAssistantStack';
import { CalypsHomeAssistantStack } from './calypshomeAssistant/CalypsHomeAssistantStack';
import { NetatmoAssistantStack } from './netatmoAssistant/NetatmoAssistantStack';
import { VoiceAssistantStack } from './voiceAssistant/VoiceAssistantStack';
import { garageDoorBleAssistantStack } from './garageDoorBleAssistant/garageDoorBleAssistantStack';


const Stack = createStackNavigator();

export const AddObjectStack = () => {

  return (
    <Stack.Navigator
      initialRouteName="AddObject"
      screenOptions={{
        headerShown: false,
        unmountOnBlur: true,
        cardStyle: { backgroundColor: '#FFFFFF' },
        ...TransitionPresets.SlideFromRightIOS,
      }}
    >


      <Stack.Screen name="AddObject" component={AssistantsHomeScreen} />
      <Stack.Screen name="ZigbeeAssistantChooseBoxScreen" component={ZigbeeAssistantStack} />
      <Stack.Screen name="SolarAssistantHomeScreen" component={SolarAssistantStack} />
      <Stack.Screen name="CalypsHomeAssistantStack" component={CalypsHomeAssistantStack} />
      <Stack.Screen name="NetatmoAssistantStack" component={NetatmoAssistantStack} />
      <Stack.Screen name="VoiceAssistantStack" component={VoiceAssistantStack} />
      <Stack.Screen name="garageDoorBleAssistantStack" component={garageDoorBleAssistantStack} />
    </Stack.Navigator>
  );
}
