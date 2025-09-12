import React from 'react';

import { createStackNavigator,TransitionSpecs,TransitionPresets } from '@react-navigation/stack';


import AboutScreen from '_screens/about';
import ProductsScreen from '_screens/products';
import {ProductDetailsScreen} from '_screens/productDetails';
import {ProductProgramScreen} from '_screens/productProgram';
import {ProductScheduleScreen} from '_screens/products/productSchedule';
import {ProductDelayScreen} from '_screens/products/productDelay';
import {ProductProgramDayScreen} from '_screens/productProgram/programDayScreen';
import {ProductSettingsScreen} from '_screens/productSettings';
import {ThermostatUpdateScreen} from '_components/objects/thermostat/thermostatUpdateParameters';


import {VDPScreens} from '_components/objects/doorKeeper/navigation';
import {QrCodeVDPScreens} from'_components/objects/qrBasic/navigation';


const Stack = createStackNavigator();

export const  ProductStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="ProductsScreen" 
      screenOptions={{
        headerShown: false,
        ...TransitionPresets.SlideFromRightIOS,
      }}
    >
        <Stack.Screen name="productsScreen" component={ProductsScreen} />
        <Stack.Screen name="ProductDetails" component={ProductDetailsScreen} />
        <Stack.Screen name="ProductSchedule" component={ProductScheduleScreen} />
        <Stack.Screen name="ProductDelay" component={ProductDelayScreen} />
        <Stack.Screen name="ProductProgram" component={ProductProgramScreen} />
        <Stack.Screen name="ThermostatComponentUpdateInAll" component={ThermostatUpdateScreen} />
        {VDPScreens.map((v,i) => {        
          return (
            <Stack.Screen {...v} />
          )          
          })
        }
        {QrCodeVDPScreens.map((v,i) => {        
          return (
            <Stack.Screen {...v} />
          )          
          })
        }
      
    </Stack.Navigator>
  );
}


/*
 
*/



/*

ProductSchedule : {
        screen:ProductScheduleScreen,
        routeName:'ProductScheduleScreen'
    },
    ProductDelay : {
        screen:ProductDelayScreen,
        routeName:'ProductDelayScreen'
    },



*/