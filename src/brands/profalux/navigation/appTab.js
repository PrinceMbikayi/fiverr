import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import { View } from "react-native";
import "./locales";

import { GroupNavigationStack } from '_brand/templates/screens/group/navigation/GroupNavigationStack';
import { ProductStack } from './productStack';
//import { RoutinesNavigationStack } from '_brand/templates/screens/routines/navigation/RoutinesNavigationStack'
import { MaisonNavigationStack } from '_brand/templates/screens/maison/navigation/MaisonNavigationStack';
import { RoutineHomeStack } from '_brand/templates/screens/routines/navigation/index';
import { NotificationsScreen } from "_screens/notifications";

import { useTheme } from '_theming/themeProvider';



import { MultiPurposeWidgetLine } from "_brand/templates/components/objects/common/MultiPurposeWidgetLine";
import { iconsJs } from '_brand/utils/iconsJs';
import { useTranslation } from 'react-i18next'; //



import MyTabBar from "./tabComponents/tabBar";



//---------------------


const Tab = createBottomTabNavigator();

const IconWrapper = (props) => {

  const { focused, color } = props;
  const borderColorValue = (!focused) ? "transparent" : color;
  return (
    // harold : it was this style : style={{padding:8,paddingTop:4,borderTopWidth:4,borderTopColor:borderColorValue,width:'30%',backgroundColor:'transparent'}}
    <View style={{ padding: 3, width: '30%', backgroundColor: 'transparent', marginTop: 0 }}>
      {props.children}
    </View>
  )
}



const getTabBarVisibility = (route) => {

  const routesWithNoTab = [
    "ProductSettings",
    "ProductDetails",
    "FavorisSettings",
    "RegisterBoxScreen",
    "AddRoomScreen",
    "SelectRoomScreen",
    "ModifyRoomScreen",
    "GroupSelectionScreen",
    "GroupModifyScreen",
    "GroupAddScreen",
    "HandleRoutine",
    "RoutineLaunchType",
    "RoutineSelectionScreen",
    "EditRoutineActionsScreen"
  ]
  const routeName = getFocusedRouteNameFromRoute(route);


  return (routesWithNoTab.indexOf(routeName) == -1)

}


const MenuButtonIcon = (props) => {
  const { icon } = props
  //const imgSource = drawerIcons?.[icon] || null;

  return (
    <View>
      <MultiPurposeWidgetLine
        icons={icon}
        iconSize={20}
      // onPress = {handleOnPress} 
      // active = {sendCurrentActive}
      //iconWrapperStyle = {{borderColor:'black', borderWidth:2}}
      />
    </View>
  )
}

//<MenuButton title_key="MENU_LOGOUT" icon={[iconsJs.logoutIcon]} destination="LogoutGateway" callback={this.doLogout}/>


const BottomTabNavigator = () => {
  const { theme } = useTheme();
  const borderColor = theme?.prflxBorderColor || 'orange';
  const containerbgcolor = theme?.prflxContaintBgColor || 'white';
  const bgcolor = theme?.prflxbgColor || 'white';
  const lineWidgetBgColor = theme?.prflxVerticalMultiIconsBgColor || "white";
  const textColor = theme?.prflxTextColor || 'black'
  const headerBgColor = theme?.prflxHeaderBackground || '#FFFFFF'
  const iconColor = theme?.prflxIconColor || "#3E495E";
  const iconBgColor = theme?.prflxIconbgColor || "#FFFFFF";

  const { t, i18n } = useTranslation();
  const tns = "navigation";

  return (
    <Tab.Navigator
      initialRouteName="Accueil"
      notabBar={props => <MyTabBar {...props} />}
      screenOptions={{
       //unmountOnBlur: true
      }}
      tabBarOptions={{
        activeTintColor: borderColor,
        inactiveTintColor: 'gray',
        labelStyle: { fontSize: 12, fontWeight: '700' },
        style: {
          backgroundColor: containerbgcolor,
          borderTopColor: 'orange',
          borderTopWidth: 2,
          padding: 5
        }
      }}
    >
      <Tab.Screen name="Accueil" component={ProductStack} options={({ route }) => ({
        tabBarLabel: `${t(tns + ":" + "FAVORITE_MENU")}`,
        tabBarIcon: ({ color, size, focused }) => <IconWrapper {...{ focused, color }}>{!focused ? <iconsJs.favoritesIcon.name color={textColor} /> : <iconsJs.favoritesIcon.name color={borderColor} />}</IconWrapper>,
        tabBarVisible: getTabBarVisibility(route)
      })} />

      <Tab.Screen name="MaisonScreen" component={MaisonNavigationStack} options={({ route }) => ({
        tabBarLabel: `${t(tns + ":" + "HOME_MENU")}`,
        tabBarIcon: ({ color, size, focused }) => <IconWrapper {...{ focused, color }}>{!focused ? <iconsJs.homeIcon.name color={textColor} /> : <iconsJs.homeIcon.name color={borderColor} />}</IconWrapper>,
        tabBarVisible: getTabBarVisibility(route)
      })} />

      <Tab.Screen name="Groups" component={GroupNavigationStack} options={({ route }) => ({
        tabBarLabel: `${t(tns + ":" + "GROUPS_MENU")}`,
        tabBarIcon: ({ color, size, focused }) => <IconWrapper {...{ focused, color }}>{!focused ? <iconsJs.groupesIcon.name color={textColor} /> : <iconsJs.groupesIcon.name color={borderColor} />}</IconWrapper>,
        tabBarVisible: getTabBarVisibility(route)
      })} />

      <Tab.Screen name="Routines" component={RoutineHomeStack} options={({ route }) => ({
        tabBarLabel: `${t(tns + ":" + "ROUTINES_MENU")}`,
        tabBarIcon: ({ color, size, focused }) => <IconWrapper {...{ focused, color }}>{!focused ? <iconsJs.routinesIcon.name color={textColor} /> : <iconsJs.routinesIcon.name color={borderColor} />}</IconWrapper>,
        tabBarVisible: getTabBarVisibility(route)
      })} />

      <Tab.Screen
        name="Notifications"
        component={NotificationsScreen}
        options={{
          tabBarLabel: '',
          tabBarIcon: () => null,
          tabBarButton: () => null
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;