import React from 'react';
import { createStackNavigator,TransitionPresets } from '@react-navigation/stack';
import ProfaluxGroupHomeScreen from '_brand/templates/screens/group/ProfaluxGroupHomeScreen';
import GroupSelectionScreen from '_brand/templates/screens/group/GroupSelectionScreen';
import GroupModifyScreen from '_brand/templates/screens/group/GroupModifyScreen';
import GroupAddScreen from '_brand/templates/screens/group/GroupAddScreen';

import {getDetailsComponent} from '_brand/navigation/productDetails'
import {getSettingsComponent} from '_brand/navigation/productSettings';


  const Stack = createStackNavigator();

  export const  GroupNavigationStack = () => {
    return (
      <Stack.Navigator
        initialRouteName="ProfaluxGroupHomeScreen" 
        screenOptions={{
          headerShown: false,
          ...TransitionPresets.SlideFromRightIOS,
        }}
      >
          <Stack.Screen name="ProfaluxGroupHomeScreen" component={ProfaluxGroupHomeScreen} />
          <Stack.Screen name="ProductDetails" component={getDetailsComponent} />
          <Stack.Screen name="ProductSettings">{(props) => getSettingsComponent(props)}</Stack.Screen>
          <Stack.Screen name="GroupSelectionScreen" component={GroupSelectionScreen} />
          <Stack.Screen name="GroupModifyScreen" component={GroupModifyScreen} />
          <Stack.Screen name="GroupAddScreen" component={GroupAddScreen} />
      </Stack.Navigator>
    );
  }