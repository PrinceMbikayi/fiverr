import React from 'react';
import {createStackNavigator, TransitionPresets} from '@react-navigation/stack';
//-------- wrapper for check bluetooth connection ------------

//------- pages -----------------

import SelectNetworkPage from './pages/selectNetwork';
import ConnectPage from './pages/connectPage';
import ConnectionProcessPage from './pages/connectionProcess';

import {useRoute} from '@react-navigation/native';

const Stack = createStackNavigator();


const CLOSE_DESTINATION = 'ToTop';
// AddQrPublicStart

const WifiStack = () => {
        const route = useRoute();
      const navigationParams = route?.params || {};
      const params = navigationParams;
      console.log("WifiStack navigationParams",navigationParams)
      const {updateWifi} = params;

     if(updateWifi){
        console.log("So WifiStack updateWifi",params)
      }

  return (
    <>
   
      <Stack.Navigator
        initialRouteName="WifiBleSelectNetwork"
        screenOptions={{headerShown: false, ...TransitionPresets.SlideFromRightIOS}}>
        <Stack.Screen name="WifiBleSelectNetwork" component={SelectNetworkPage} initialParams={{...params}}/>
         <Stack.Screen name="WifiBleConnect" component={ConnectPage} />
         <Stack.Screen name="WifiBleConnectionProcess" component={ConnectionProcessPage} initialParams={{...params}}/>
      </Stack.Navigator>
    </>
  );
};

export default WifiStack;