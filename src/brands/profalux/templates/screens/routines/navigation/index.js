import React from 'react';
import { createStackNavigator, TransitionSpecs, TransitionPresets } from '@react-navigation/stack';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ScenarioContextProvider } from '_brand/templates/screens/routines/context';

import RoutinesHomeScreen from '_brand/templates/screens/routines/screens';
import {SelectRoutineTypeScreen} from '_brand/templates/screens/routines/screens/SelectRoutineTypeScreen';
import {RoutineSelectionScreen} from '_brand/templates/screens/routines/screens/RoutineSelectionScreen';
import {HourlyRoutineStack} from "_brand/templates/screens/routines/navigation/HourlyRoutineStack"
import {ChooseRoutineNameAndObjectsScreen} from '_brand/templates/screens/routines/screens/ChooseRoutineNameAndObjectsScreen';
import { PlanningStack } from './PlanningStack';
import {EcoConfortSensorChoiceScreen} from '_brand/templates/screens/routines/screens/applicationScreen/EcoConfortSensorChoiceScreen';
import {EcoConfortNoSensorScreen} from '_brand/templates/screens/routines/screens/applicationScreen/EcoConfortNoSensorScreen';
import {ChooseEcoConfortNameAndObjects} from '_brand/templates/screens/routines/screens/applicationScreen/ChooseEcoConfortNameAndObjects';
import {EcoConfortDatePickerScreen} from '_brand/templates/screens/routines/screens/applicationScreen/EcoConfortDatePickerScreen';
import {EcoConfortConfirmConfigurationScreen} from '_brand/templates/screens/routines/screens/applicationScreen/EcoConfortConfirmConfigurationScreen';
import {EcoConfortParameterScreen} from '_brand/templates/screens/routines/screens/applicationScreen/EcoConfortParameterScreen';
import {EcoConfortCommonShutterDetails} from '_brand/templates/screens/routines/screens/applicationScreen/components/EcoConfortCommonShutterDetails';
import {getDetailsComponent} from '_brand/navigation/productDetails'
import {getSettingsComponent} from '_brand/navigation/productSettings';

import {WindProtectionSensorChoiceScreen} from '_brand/templates/screens/routines/screens/windProtection/WindProtectionSensorChoiceScreen';
import {ChooseWindProtectionNameAndObjects} from '_brand/templates/screens/routines/screens/windProtection/ChooseWindProtectionNameAndObjects';
import {WindProtectionConfirmScreen} from '_brand/templates/screens/routines/screens/windProtection/WindProtectionConfirmScreen';
import {WindProtectionNoSensorScreen} from '_brand/templates/screens/routines/screens/windProtection/WindProtectionNoSensorScreen';



const Stack = createStackNavigator();

export const RoutineHomeStack = () => {

  const navigation = useNavigation();
  const route = useRoute();
  const navParams = route?.params || {};

  const { id } = navParams;
  console.log("NAVPARMS_STACK_MAIN :", navParams)


  return (

    <ScenarioContextProvider home="RoutinesHomeScreen" id={id}>
      <Stack.Navigator
        initialRouteName="RoutinesHomeScreen"
        screenOptions={{
          headerShown: false,
          unmountOnBlur: true,
          ...TransitionPresets.SlideFromRightIOS,
        }}
      >
        <Stack.Screen name="RoutinesHomeScreen" component={RoutinesHomeScreen} />
        <Stack.Screen name="SelectRoutineTypeScreen" component={SelectRoutineTypeScreen} />
        <Stack.Screen name="RoutineSelectionScreen" component={RoutineSelectionScreen} />
        <Stack.Screen name="ChooseRoutineNameAndObjectsScreen" component={ChooseRoutineNameAndObjectsScreen}/>
        <Stack.Screen name="PlanningStack" component={PlanningStack} options={{gestureEnabled: false,}} />
        <Stack.Screen name="HourlyRoutineStack" component={HourlyRoutineStack} />
        <Stack.Screen name="EcoConfortSensorChoiceScreen" component={EcoConfortSensorChoiceScreen} />
        <Stack.Screen name="EcoConfortNoSensorScreen" component={EcoConfortNoSensorScreen} />
        <Stack.Screen name="ChooseEcoConfortNameAndObjects" component={ChooseEcoConfortNameAndObjects} />
        <Stack.Screen name="EcoConfortDatePickerScreen" component={EcoConfortDatePickerScreen} />
        <Stack.Screen name="EcoConfortConfirmConfigurationScreen" component={EcoConfortConfirmConfigurationScreen} />
        <Stack.Screen name="EcoConfortParameterScreen" component={EcoConfortParameterScreen} />
        <Stack.Screen name="EcoConfortCommonShutterDetails" component={EcoConfortCommonShutterDetails} />

        <Stack.Screen name="WindProtectionSensorChoiceScreen" component={WindProtectionSensorChoiceScreen} />
        <Stack.Screen name="ChooseWindProtectionNameAndObjects" component={ChooseWindProtectionNameAndObjects} />
        <Stack.Screen name="WindProtectionConfirmScreen" component={WindProtectionConfirmScreen} />
        <Stack.Screen name="WindProtectionNoSensorScreen" component={WindProtectionNoSensorScreen} />

        <Stack.Screen name="ProductDetails" component={getDetailsComponent} /> 
        <Stack.Screen name="ProductSettings">{(props) => getSettingsComponent(props)}</Stack.Screen>

      </Stack.Navigator>
    </ScenarioContextProvider>
  );
}