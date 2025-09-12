import React from 'react';

import { createDrawerNavigator } from '@react-navigation/drawer';


import CustomDrawerContent from './drawerComponent/profalux-drawer';

import { SettingsStack } from '_navigation/settingsStack';
import { AccountStack } from '_brand/templates/screens/account/navigation';
import { AddGroupStack } from '_screens/group/navigation';
import { AddObjectStack} from '_brand/templates/screens/addObject/screens';
import { GroupNavigationStack } from '_brand/templates/screens/group/navigation/GroupNavigationStack';
import { MaisonNavigationStack } from '_brand/templates/screens/maison/navigation/MaisonNavigationStack';
import {NotificationsScreen} from '_screens/notifications';
import AboutScreen from '_brand/templates/screens/about'
import Logout from '_screens/MenuGateways/LogoutGatewayScreen';

import {FamilyStack} from  '_screens/familyProducts/navigation';
import { ProductStack } from './productStack';
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


const getAbout = async () => {

  const hop = await  import('../../../../src/screens/about/index.js');
  return 'AboutScreen';

}

const glo = (props) => {
  return <AboutScreen {...props}/>;
} ;



export const getFamilyComponent = (props) => {
   
  const params = props?.route?.params || {} ;
  const {typeName} = params;   

  return <ProductStack />
}



export const AppDrawer = () => {


  return (
    <Drawer.Navigator initialRouteName="Home" 
                      drawerContent={(props) => <CustomDrawerContent {...props} />}
                     
      >
      <Drawer.Screen name="Account" component={AccountStack} />
      {/*<Drawer.Screen name="Home" component={ProductStack} />*/}
      <Drawer.Screen name="Home" component={TabNavigator} options={{swipeEnabled: false}} />
      {/* example tab and drawer <Drawer.Screen name="Home" component={TabNavigator} /> */}
      <Drawer.Screen name="AddObject" component={AddObjectStack} />
      {/* <Drawer.Screen name={appRoutesNames.GROUP_HOME} component={ GroupNavigationStack} /> */}
      {/* <Drawer.Screen name={appRoutesNames.MAISON_SCREEN} component={ MaisonNavigationStack} /> */}
      <Drawer.Screen name={appRoutesNames.ADD_GROUP} component={AddGroupStack} />
      <Drawer.Screen name="Settings" component={SettingsStack} />
      <Drawer.Screen name="Notifications" component={NotificationsScreen} initialParams={{ header:'back' }}/>
      {/*<Drawer.Screen name="About" component={AboutScreen} />*/}
      <Drawer.Screen name="About">{(props) => glo(props)}</Drawer.Screen>
      <Drawer.Screen name="LogoutGateway" component={Logout} /> 
      {DrawerFamilies}
      
    </Drawer.Navigator>
  );
}