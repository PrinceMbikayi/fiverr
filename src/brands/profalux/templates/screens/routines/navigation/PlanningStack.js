import React from 'react';
import { createStackNavigator, TransitionSpecs, TransitionPresets } from '@react-navigation/stack';
import { PlanningScreen } from '_brand/templates/screens/routines/screens/planningScreen/index';

import { ModifyPlanning } from '_brand/templates/screens/routines/screens/planningScreen/ModifyPlanning';
import { AddRoutineToDayPlanning } from '_brand/templates/screens/routines/screens/planningScreen/AddRoutineToDayPlanning';
import { SelectRoutine } from '_brand/templates/screens/routines/screens/planningScreen/SelectRoutine';
// import { RoutineProgrammationProvider } from '_brand/templates/screens/routines/screens/planningScreen/hook'


const Stack = createStackNavigator();

export const PlanningStack = () => {

  return (

      <Stack.Navigator
        initialRouteName="PlanningHomeScreen"
        screenOptions={{
          headerShown: false,
          unmountOnBlur: true,
          ...TransitionPresets.SlideFromRightIOS,
        }}
      >
        <Stack.Screen name="PlanningHomeScreen" component={PlanningScreen} />
        <Stack.Screen name="ModifyPlanning" component={ModifyPlanning} />
        <Stack.Screen name="AddRoutineToDayPlanning" component={AddRoutineToDayPlanning} />
        <Stack.Screen name="SelectRoutine" component={SelectRoutine} />
      </Stack.Navigator>
  );
}