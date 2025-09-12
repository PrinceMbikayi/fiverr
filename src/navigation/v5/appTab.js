import React from "react";
import {Image} from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import { ProductStack } from './productStack';
import AboutScreen from '_screens/about';
import { AccountStack } from '_screens/account/navigation';

import { useTheme } from '_theming/themeProvider';

//---------------------
const images = {  
                  "home":require("_images/interfaces/menu/home.png"),
                  "profile":require("_images/interfaces/menu/user.png"),
                  "about":require("_images/interfaces/menu/about.png")
                }

const doIcon = (iconName,color) => {
  return (
    <Image source={images[iconName]} tintColor={color} style={{maxHeight:20}} resizeMode="contain" />
  )
}
//---------------------

const Tab = createBottomTabNavigator();


const getTabBarVisibility = (route) => {
    console.log("getTabBarVisibility",route)
}


const BottomTabNavigator = () => {
  const {theme} = useTheme();
  const iconColor = theme['drawer--color--bg'];
  return (
    <Tab.Navigator tabBarOptions={{
      activeTintColor: iconColor,
      inactiveTintColor: 'gray',
    }}>
        <Tab.Screen name="Accueil" component={ProductStack} options={({route})=>({
          tabBarLabel: 'Accueil 2',
          tabBarIcon:({ color, size }) => (doIcon('home',color)),
          tabBarVisible: getTabBarVisibility(route)
          })}/>
        <Tab.Screen name="Profil" component={AccountStack} options={{
          tabBarLabel: 'Profil',
          tabBarIcon:({ color, size }) => (doIcon('profile',color))
          }}/>
         <Tab.Screen name="About" component={AboutScreen} options={{
          tabBarLabel: 'A propos',
          tabBarIcon:({ color, size }) => (doIcon('about',color))
          }}/>    
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;