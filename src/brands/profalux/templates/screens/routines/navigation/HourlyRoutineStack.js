import React from 'react';
import { createStackNavigator, TransitionSpecs, TransitionPresets } from '@react-navigation/stack';

import { getDetailsComponent } from '_brand/navigation/productDetails'
import { useNavigation, useRoute } from '@react-navigation/native';
//import {ChooseRoutineNameAndObjectsScreen} from '_brand/templates/screens/routines/screens/ChooseRoutineNameAndObjectsScreen';
import { EditRoutineActionsScreen } from '_brand/templates/screens/routines/screens/EditRoutineActionsScreen';
import { RoutinePlanningScreen } from '_brand/templates/screens/routines/screens/RoutinePlanningScreen';

const Stack = createStackNavigator();

export const HourlyRoutineStack = () => {

  return (

      <Stack.Navigator
        initialRouteName="ChooseRoutineNameAndObjectsScreen"
        screenOptions={{
          headerShown: false,
          unmountOnBlur: true,
          ...TransitionPresets.SlideFromRightIOS,
        }}
      >
        {/* <Stack.Screen name="ChooseRoutineNameAndObjectsScreen" component={ChooseRoutineNameAndObjectsScreen}/> */}
        <Stack.Screen name="EditRoutineActionsScreen" component={EditRoutineActionsScreen} />
        <Stack.Screen name="RoutinePlanningScreen" component={RoutinePlanningScreen} />
        <Stack.Screen name="ProductDetails" component={getDetailsComponent} />
        {/* <Stack.Screen name="MyRoutineSelectionScreen" component={MyRoutineSelectionScreen} /> */}
      </Stack.Navigator>
  );
}