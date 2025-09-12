import React from 'react';
import { createStackNavigator,TransitionSpecs,TransitionPresets } from '@react-navigation/stack';



import { AccountHome } from '../index';
import {GalleryHome} from '../screens/galleryHome';
import { PushNotificationClientsScreen } from '../screens/notificationClients';
import { HelpScreen } from '../screens/help';
import { HotlineScreen } from '../screens/hotline';
import { LegalScreen } from '../screens/legal';



import {VdpArchiveHomeScreen} from '_components/objects/doorKeeper/screens/vdpArchiveHome';
import {VdpArchivePlayerScreen} from '_components/objects/doorKeeper/screens/vdpArchivePlayer';
import UpdatePasswordScreen from '_screens/updatePassword';
import ChangeWifiAccessPointScreen from '_screens/wifiAccessPoint';




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
          <Stack.Screen name="ChangePassword" component={UpdatePasswordScreen} />
          <Stack.Screen name="GalleryHome" component={GalleryHome} />
          <Stack.Screen name="DeviceGallery" component={VdpArchiveHomeScreen} />
          <Stack.Screen name="VdpArchivePlayer" component={VdpArchivePlayerScreen} />
          <Stack.Screen name="WifiSettings" component={ChangeWifiAccessPointScreen} />
          <Stack.Screen name="PushNotificationClients" component={PushNotificationClientsScreen} />
        
          <Stack.Screen name="Help" component={HelpScreen} />
          <Stack.Screen name="Hotline" component={HotlineScreen} />
          <Stack.Screen name="Legal" component={LegalScreen} />         
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