/** exemple navigation get component */
import React from 'react';

import { createStackNavigator,TransitionPresets } from '@react-navigation/stack';


// import AboutScreen from '_screens/about';
//import ProductsScreen from '_screens/products';
import ProductsScreen from '_brand/templates/screens/productsRelated/products/ProductsScreen';


//Harold 
import {FavorisSettings} from '_brand/templates/screens/productsRelated/products/FavorisSettings';
import {WeatherDetails} from "_brand/templates/components/objects/weatherSupport/WeatherDetails";


import {VDPScreens} from '_components/objects/doorKeeper/navigation';
import {QrCodeVDPScreens} from'_components/objects/qrBasic/navigation';


import {getSettingsComponent} from './productSettings';
import {getDetailsComponent} from './productDetails'
import RegisterBoxScreen from '_brand/templates/screens/productsRelated/products/RegisterBoxScreen';

import { RemoveWizardStack } from '_brand/templates/components/objects/shutters/shutter868/removalWizard/RemoveWizardStack';



const Stack = createStackNavigator();


const addExtraScreens = (arr) => {
  return arr.map((v,i) => {        
    return (
      <Stack.Screen {...v} />
    )          
    })
}

export const  ProductStack = (props) => {


  return (
    <Stack.Navigator
    
      initialRouteName="ProductsScreen"
      screenOptions={{
        headerShown: false,
        ...TransitionPresets.SlideFromRightIOS,
      }}
    >
       <Stack.Screen name="productsScreen" component={ProductsScreen} initialParams={{"vrai":"ment"}}/>
      
      
        <Stack.Screen name="FavorisSettings" component={FavorisSettings} />
        <Stack.Screen name="RegisterBoxScreen" component={RegisterBoxScreen} />
        <Stack.Screen name="WeatherDetails" component={WeatherDetails} />
        <Stack.Screen name="ProductDetails" component={getDetailsComponent} />
        <Stack.Screen name="RemoveWizardStack" component={RemoveWizardStack} />
        <Stack.Screen name="ProductSettings">{(props) => getSettingsComponent(props)}</Stack.Screen>
        
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