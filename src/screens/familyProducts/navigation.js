import React from 'react';
import { createStackNavigator,TransitionSpecs,TransitionPresets } from '@react-navigation/stack';

import {appRoutesNames} from '_config/AppConfig';

import {FamilyProductsScreen} from './index';
import { ProductDetailsScreen } from '_screens/productDetails';
import {ThermostatUpdateScreen} from '_components/objects/thermostat/thermostatUpdateParameters';
import {ProductProgramScreen} from '_screens/productProgram';
import {ProductScheduleScreen} from '_screens/products/productSchedule';
import {ProductDelayScreen} from '_screens/products/productDelay';
import {ProductProgramDayScreen} from '_screens/productProgram/programDayScreen';
import {ProductSettingsScreen} from '_screens/productSettings';


const getRouteName = (type) => appRoutesNames["FAMILY_"+type+"_PRODUCTS"];

const families = ["LIGHT"]



  const Stack = createStackNavigator();


    export const FamilyStack = (props) => {
    
       
        const {navigation,route} = props;
        const {type} = route.params;
       
        const initialRouteName = getRouteName(type);


    return (
        <Stack.Navigator
        initialRouteName={initialRouteName} 
        screenOptions={{
          headerShown: false,
          ...TransitionPresets.SlideFromRightIOS,
        }}
      >
          <Stack.Screen name={initialRouteName} component={FamilyProductsScreen} initialParams={{ 'type':type}}/>
          <Stack.Screen name="familyDetails" component={ProductDetailsScreen} />
          <Stack.Screen name="ProductSchedule" component={ProductScheduleScreen} />
          <Stack.Screen name="ProductDelay" component={ProductDelayScreen} />
          <Stack.Screen name="ProductProgram" component={ProductProgramScreen} />
          <Stack.Screen name="ProductProgramDay" component={ProductProgramDayScreen} />
          <Stack.Screen name="ProductSettings" component={ProductSettingsScreen} />
          <Stack.Screen name="ThermostatComponentUpdateInProductStack" component={ThermostatUpdateScreen} />

      </Stack.Navigator>      
    )
}