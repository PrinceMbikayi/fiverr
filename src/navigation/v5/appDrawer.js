import React from 'react';

import { createDrawerNavigator } from '@react-navigation/drawer';


import CustomDrawerContent from '../AtHome-drawer';
import {AppStack} from './appStack';
import { ProductStack } from './productStack';
import { SettingsStack } from './settingsStack';
import { AccountStack } from '_screens/account/navigation';
import { AddProductStack} from '_screens/addProduct/navigation';
import { AddGroupStack } from '_screens/group/navigation';
import {NotificationsScreen} from '_screens/notifications';
import AboutScreen from '_screens/about';
import Logout from '_screens/MenuGateways/LogoutGatewayScreen';

import {FamilyStack} from  '_screens/familyProducts/navigation';
import {appRoutesNames} from '_config/AppConfig';

import TabNavigator from "./appTab";


const Drawer = createDrawerNavigator();

const drawerFamilies = () => {
  const families = ["LIGHT","PLUG","HEATER","SHUTTER","GATE"];
  return (
    families.map((v,i) => {
      return (
        <Drawer.Screen name={appRoutesNames["FAMILY_"+v+"_PRODUCTS"]} component={FamilyStack} initialParams={{ type:v}} key={"drawer_family_"+v}/>
      )
    })
  )
}
const DrawerFamilies = drawerFamilies();


export const AppDrawer = () => {

  return (
    <Drawer.Navigator initialRouteName="Home" drawerContent={(props) => <CustomDrawerContent {...props} />}      >
      <Drawer.Screen name="Account" component={AccountStack} />
      <Drawer.Screen name="Home" component={ProductStack} />     
      {/* example tab and drawer <Drawer.Screen name="Home" component={TabNavigator} /> */}
      <Drawer.Screen name="AddProduct" component={AddProductStack} />
      <Drawer.Screen name={appRoutesNames.ADD_GROUP} component={AddGroupStack} />
      <Drawer.Screen name="Settings" component={SettingsStack} />
      <Drawer.Screen name="Notifications" component={NotificationsScreen} />
      <Drawer.Screen name="About" component={AboutScreen} />
      <Drawer.Screen name="LogoutGateway" component={Logout} /> 
      {DrawerFamilies}
    </Drawer.Navigator>
  );
}