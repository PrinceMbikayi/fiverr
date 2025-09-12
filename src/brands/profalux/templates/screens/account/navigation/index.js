import React from 'react';
import { createStackNavigator,TransitionSpecs,TransitionPresets } from '@react-navigation/stack';
import { AccountHome } from '../index';
// import UpdatePasswordScreen from '_screens/updatePassword';
import {PersonalInfos} from '_brand/templates/screens/account/screens/PersonalInfos'
import {EditLogin} from '_brand/templates/screens/account/screens/EditLogin'
import {EditPassword} from '_brand/templates/screens/account/screens/EditPassword'
import {MyGateways} from '_brand/templates/screens/account/screens/MyGateways'
import {GatewayDetails} from '_brand/templates/screens/account/screens/GatewayDetails'
import {SelectBox} from '_brand/templates/screens/account/screens/SelectBox'
import {ModifyBox} from '_brand/templates/screens/account/screens/ModifyBox'
import {RegisterBoxScreen} from '_brand/templates/screens/account/screens/RegisterBoxScreen'
import {ConfirmEditLogin} from '_brand/templates/screens/account/screens/ConfirmEditLogin'
import {ReinitLostPassword} from '_brand/templates/screens/account/screens/ReinitLostPassword'

import ReinitPasswordScreen from '_screens/reinitPassword';
import  LostPasswordScreen from '_screens/lostPassword';





  const Stack = createStackNavigator();

  export const  AccountStack = () => {
    return (
      <Stack.Navigator
        initialRouteName="AccountHome" 
        screenOptions={{
          headerShown: false,
          ...TransitionPresets.SlideFromRightIOS,
        }}
      >
          <Stack.Screen name="AccountHome" component={AccountHome} />
          <Stack.Screen name="PersonalInfos" component={PersonalInfos} />
          <Stack.Screen name="EditLogin" component={EditLogin} />
          <Stack.Screen name="EditPassword" component={EditPassword} />
          <Stack.Screen name="ReinitLostPassword" component={ReinitLostPassword}/>
          <Stack.Screen name="MyGateways" component={MyGateways}/>
          <Stack.Screen name="GatewayDetails" component={GatewayDetails}/>
          <Stack.Screen name="SelectBox" component={SelectBox}/>
          <Stack.Screen name="ModifyBox" component={ModifyBox}/>
          <Stack.Screen name="RegisterBoxScreen" component={RegisterBoxScreen}/>
          <Stack.Screen name="ConfirmEditLogin" component={ConfirmEditLogin}/>
          <Stack.Screen name="LostPassword" component={LostPasswordScreen} />
        {/* <Stack.Screen name="ReinitPassword" component={ReinitPasswordScreen} initialParams={{ 'destination':'PersonalInfos'}}/> */}
          {/* <Stack.Screen name="ChangePassword" component={UpdatePasswordScreen} /> */}
      </Stack.Navigator>
    );
  }





/*

export const AccountStack = createStackNavigator(
    {     
        AccountHome:   {screen:AccountHome,routeName:'AccountHome',navigationOptions:noHeader} , 
        ChangePassword : {screen:UpdatePasswordScreen,routeName:'ChangePassword',navigationOptions:noHeader}, 
        GalleryHome :  {screen:GalleryHome,routeName:'GalleryHome',navigationOptions:noHeader},
        DeviceGallery : {screen:VdpArchiveHomeScreen,routeName:'DeviceGallery',navigationOptions:noHeader},
        VdpArchivePlayer :{screen:VdpArchivePlayerScreen,routeName:'VdpArchivePlayer',navigationOptions:noHeader} , 
        WifiSettings : {screen:ChangeWifiAccessPointScreen,routeName:'WifiSettings',navigationOptions:noHeader},
        PushNotificationClients : {screen: PushNotificationClientsScreen,routeName:'PushNotificationClients',navigationOptions:noHeader},
        Help : {screen: HelpScreen,routeName:'Help',navigationOptions:noHeader},
        Hotline : {screen: HotlineScreen,routeName:'Hotline',navigationOptions:noHeader},
        Legal : {screen: LegalScreen,routeName:'Legal',navigationOptions:noHeader},
     
    }
    ,{
        defaultNavigationOptions: {
          gestureEnabled: false,     
          ...TransitionPresets.SlideFromRightIOS,
          }
    });
*/

/*
export const VpdPushStack =   createStackNavigator(
    {
      vdpcall : {
        screen:DoorKeeperPushScreen,
        routeName:'globalmodal',
        
        navigationOptions : {
          initialRouteName:'globalmodal',
          title:'gloglo 3',
          ...TransitionPresets.SlideFromRightIOS,
          animationEnabled:true
        }
        
      }
    }
    ,{
    defaultNavigationOptions: {
      gestureEnabled: false,     
      ...TransitionPresets.SlideFromRightIOS,
      }
    }
  )
  */