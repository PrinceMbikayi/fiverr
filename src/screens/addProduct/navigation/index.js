import {unionBy} from 'lodash';
import React from 'react';
import { createStackNavigator,TransitionSpecs,TransitionPresets } from '@react-navigation/stack';

import AddProductScreenSelect from '_screens/addProduct/athome/selectProduct';
import AddProductScreenSelectRound2 from '_screens/addProduct/athome/selectProductRound2';
import AddProductScreenInformations from '_screens/addProduct/athome/productInformations';
import AddProductScreenWifi from '_screens/addProduct/athome/getWifi';
import AddProductScreenSmartConfig from '_screens/addProduct/athome/smartConfig';

import WeatherWizard from '_components/objects/weather/weatherWizard';
import ThermostatWizard from '_components/objects/thermostat/thermostatWizard';
import {AddDoorKeeperStack} from '_components/objects/doorKeeper/wizard/wizardNavigation';
import AddQrBasicStack from '_components/objects/qrBasic/wizard/wizardNavigation';

//import brands addProducts
import BrandScreens from '_brand/templates/screens/productsRelated/addProduct/navigation.js'




const Stack = createStackNavigator();

const ScreensBase = [
              {"name":'AddProduct',"component":AddProductScreenSelect},
              {"name":'SelectProductRound2',"component":AddProductScreenSelectRound2},
              {name:"AddProductInfos", component:AddProductScreenInformations},
              {name:"AddProductWifi", component:AddProductScreenWifi},
              {name:"AddProductSmartConfig", component:AddProductScreenSmartConfig},
              {name:"AddWeather", component:WeatherWizard},
              {name:"AddThermostat", component:ThermostatWizard},
              {name:"AddDoorKeeper", component:AddDoorKeeperStack},
              {name:"AddQrBasic", component:AddQrBasicStack}
             
  ]

  const Screens = unionBy(BrandScreens,ScreensBase,  'name');


  export const  AddProductStack = () => {
    return (
      <Stack.Navigator
        initialRouteName="AddProduct" 
        screenOptions={{
          headerShown: false,
          ...TransitionPresets.SlideFromRightIOS,
        }}
      >
         { Screens.map((v,i) => {
            return (
              <Stack.Screen name={v.name} component={v.component}/>
            )
          })
        }
          {/*<Stack.Screen name="AddProduct" component={AddProductScreenSelect} />
          <Stack.Screen name="SelectProductRound2" component={AddProductScreenSelectRound2} />
          <Stack.Screen name="AddProductInfos" component={AddProductScreenInformations} />
          <Stack.Screen name="AddProductWifi" component={AddProductScreenWifi} />
          <Stack.Screen name="AddProductSmartConfig" component={AddProductScreenSmartConfig} />
          <Stack.Screen name="AddWeather" component={WeatherWizard} />
          <Stack.Screen name="AddThermostat" component={ThermostatWizard} />
          <Stack.Screen name="AddDoorKeeper" component={AddDoorKeeperStack} />
          <Stack.Screen name="AddQrBasic" component={AddQrBasicStack} />
      */}
           
      </Stack.Navigator>
    );
  }
/*
  const AddProductStack = createStackNavigator(
    {
     
      AddProduct: {screen:AddProductScreenSelect,navigationOptions:noHeader},
      AddProductInfos: {screen:AddProductScreenInformations,navigationOptions:noHeader},
      AddProductWifi : {screen:AddProductScreenWifi,navigationOptions:noHeader},
      AddProductSmartConfig:{screen:AddProductScreenSmartConfig,navigationOptions:noHeader},
      AddWeather:{screen:WeatherWizard,navigationOptions:noHeader},
      AddThermostat:{screen:ThermostatWizard,routeName:"AddThermostat",navigationOptions:noHeader},
      AddDoorKeeper:{screen:AddDoorKeeperStack,navigationOptions:noHeader},
     
    } 
   
  )
  */

  