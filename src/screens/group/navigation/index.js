import React from 'react';
import { createStackNavigator,TransitionSpecs,TransitionPresets } from '@react-navigation/stack';
import {GroupHomeScreen,GroupSelectTypeScreen} from '_screens/group';
import GroupSelectProductsScreen   from '_screens/group/groupSelectProducts' // class component


  const Stack = createStackNavigator();

  export const  AddGroupStack = () => {
    return (
      <Stack.Navigator
        initialRouteName="GroupHome" 
        screenOptions={{
          headerShown: false,
          ...TransitionPresets.SlideFromRightIOS,
        }}
      >
          <Stack.Screen name="GroupHome" component={GroupHomeScreen} />
          <Stack.Screen name="GroupSelectType" component={GroupSelectTypeScreen} />
          <Stack.Screen name="GroupSelectProducts" component={GroupSelectProductsScreen} />
      </Stack.Navigator>
    );
  }