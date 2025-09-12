import React from 'react';
import {createStackNavigator, TransitionPresets} from '@react-navigation/stack';

import AddGuideScreen from './screens/guide/guidePage';
import AddBluetoothScan from './screens/scan';

const Stack = createStackNavigator();

// AddQrPublicStart

const AddMotorStack = () => {
  return (
    <>
      <Stack.Navigator
        initialRouteName="AddBlueToothScan"
        screenOptions={{
          headerShown: false,
          ...TransitionPresets.SlideFromRightIOS,
        }}
      >
        <Stack.Screen name="AddGuide" component={AddGuideScreen} />
        <Stack.Screen name="AddBlueToothScan" component={AddBluetoothScan} />
      </Stack.Navigator>
    </>
  );
};

export default AddMotorStack;
