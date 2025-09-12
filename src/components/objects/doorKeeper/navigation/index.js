import React from 'react';

import { createStackNavigator,TransitionPresets } from '@react-navigation/stack';

import {VdpArchiveHomeScreen} from '../screens/vdpArchiveHome';
import {VdpArchivePlayerScreen} from '../screens/vdpArchivePlayer';
import DoorKeeperSettingsScreen from '../screens/vdpSettings';
import {DoorKeeperPushScreen} from '../screens/doorKeeperPush';



const Stack = createStackNavigator();

export const  VdpStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="VdpArchiveHome" 
      screenOptions={{
        headerShown: false,
        ...TransitionPresets.SlideFromRightIOS,
      }}   
    >
        <Stack.Screen name="VdpArchiveHome" component={VdpArchiveHomeScreen} />
        <Stack.Screen name="VdpSettings" component={DoorKeeperSettingsScreen}/>
        <Stack.Screen name="VdpArchivePlayer" component={VdpArchivePlayerScreen} />
    </Stack.Navigator>
  );
}

export const VDPScreens = [
  {name:"VdpArchiveHome",key :"VdpArchiveHome", component:VdpArchiveHomeScreen},
  {name:"VdpSettings",key :"VdpSettings", component:DoorKeeperSettingsScreen},
  {name:"VdpArchivePlayer",key :"VdpArchivePlayer", component:VdpArchivePlayerScreen}
]


/*
export const VDPScreens = [
  <Stack.Screen name="VdpArchiveHome" key="VdpArchiveHome" component={VdpArchiveHomeScreen} />,
  <Stack.Screen name="VdpSettings" key="VdpSettings"component={DoorKeeperSettingsScreen}/>,
  <Stack.Screen name="VdpArchivePlayer" key="VdpArchivePlayer" component={VdpArchivePlayerScreen} />
]
*/

/*

export const VDPScreens = () => {

  return (
    <Stack.Screen name="VdpArchiveHome" component={VdpArchiveHomeScreen} />,
    <Stack.Screen name="VdpSettings" component={DoorKeeperSettingsScreen}/>,
    <Stack.Screen name="VdpArchivePlayer" component={VdpArchivePlayerScreen} />
  )
}



*/


/*
export const VdpStack = 
    {     
        VdpArchiveHome: {screen:VdpArchiveHomeScreen,routeName:'VdpArchiveHome',navigationOptions:noHeader} ,      
        VdpSettings: {screen:DoorKeeperSettingsScreen,routeName:'VdpSettings',navigationOptions:noHeader} , 
        VdpArchivePlayer :{screen:VdpArchivePlayerScreen,routeName:'VdpArchivePlayer',navigationOptions:noHeader} ,     
     
    }
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