import React from 'react';
import { createStackNavigator,TransitionPresets } from '@react-navigation/stack';


import { MaisonScreen } from '_brand/templates/screens/maison/MaisonScreen';
import { AddRoomScreen } from '_brand/templates/screens/maison/AddRoomScreen';
import { SelectRoomScreen } from '_brand/templates/screens/maison/SelectRoomScreen';
import { ModifyRoomScreen } from '_brand/templates/screens/maison/ModifyRoomScreen';
import {getDetailsComponent} from '_brand/navigation/productDetails'
import {getSettingsComponent} from '_brand/navigation/productSettings';

  const Stack = createStackNavigator();

  export const  MaisonNavigationStack = () => {
    return (
      <Stack.Navigator
        initialRouteName="MaisonScreen" 
        screenOptions={{
          headerShown: false,
    
          ...TransitionPresets.SlideFromRightIOS,
        }}
      >
          <Stack.Screen name="MaisonScreen" component={MaisonScreen} screenOptions={{}}/>
          <Stack.Screen name="ProductDetails" component={getDetailsComponent} /> 
          <Stack.Screen name="ProductSettings">{(props) => getSettingsComponent(props)}</Stack.Screen>
          <Stack.Screen name="AddRoomScreen" component={AddRoomScreen} />
          <Stack.Screen name="SelectRoomScreen" component={SelectRoomScreen} />
          <Stack.Screen name="ModifyRoomScreen" component={ModifyRoomScreen} />
      </Stack.Navigator>
    );
  }