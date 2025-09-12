import React,  { useContext }from 'react';
import { View, Text, ScrollView, SafeAreaView,TouchableOpacity,StyleSheet,Image } from 'react-native';
import { withTranslation } from 'react-i18next';
import { useTranslation } from 'react-i18next'; // needed for menuItme renderer
import { connect } from "react-redux";
import { MaterialIcon } from '_components/ui/icons';
import { Button} from 'react-native-elements';
import {APP_PREVIOUS_ROUTE} from '../actions/app' 
import { withTheme} from '_theming/themeProvider';
import { useTheme } from '_theming/themeProvider';
import styled from 'styled-components/native'


import {MyDivider} from './drawerComponents'
import {appRoutesNames} from '_config/AppConfig'

import {AutomatedTestIdDisplay} from '_components/objects/@common/testAutomation/AutomatedTestId';


/* for Brand Block Shadow */
import Svg, {
 
  Rect,  
  Defs,
  LinearGradient, 
  Stop,  
} from 'react-native-svg';



class CustomDrawer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      menus: [
       
        {key: 'Rooms', title: "MENU_ROOMS", screen: 'Rooms'},  
       
        /*{key: 'logout', title: 'MENU_LOGOUT', screen: 'LogoutGateway'}*/
      ]
    };
  }



  getOrigin(){
    /*
    let navState = this.props.navigation.state;
    console.log("pppp",this.props.navigation,this.props.navigation.getState());
    return navState.routes[navState.index].routeName;
    */

    const navState = this.props.navigation.getState();
    //console.log("navState",navState)
    return navState.routeNames[navState.index];


  }

  /*

  Here to find the lower nested key But we only need to fing the level 0 routeName

  getOrigin(){
    let start = this.props.navigation.state;
    let gloglo = this.findOriginRecur(this.props.navigation.state);
    console.log('gloglo',gloglo);
  }

  findOriginRecur(value) {
    let val = value.routes[value.index];
    if(val.index != undefined) {
      return this.findOriginRecur(val)
    } else {
      return val
    }
  }
  */


  navigateToScreen = (route,params,key) => {
    console.log("route",route,"params",params)
    let previousRoute = this.getOrigin();
    console.log("PreviousRoute",previousRoute)
    this.props.setRoute(previousRoute)
    let destination = {'routeName':route};
    if(params != undefined)destination.params = params;
    if(key!=undefined)destination.key = key;
    console.log("destination",destination);
    this.props.navigation.navigate(destination.routeName); 
    this.props.navigation.closeDrawer();
  }

  closeMe = () => {
    this.props.navigation.closeDrawer();
  }

  menulogo = (this.props.theme.key == "DARK") ? require('_brand/images/logo_menu.png')  : require('_brand/images/logo_menu_light.png');  
  appMenuLogo = (this.props.theme.key == "MAXIMUM BLUE GREEN") ? require('_brand/images/logo_appli.png')  : require('_brand/images/logo_appli.png');

  brandTexts = require('_brand/texts/drawer.json')

  



  render() {

    const { t,theme } = this.props;
    const bgc = theme['drawer--color--bg'];
    //<SafeAreaView style={{flex:1,backgroundColor:theme['color--bg']}}>
    return (
        
      <SafeAreaView  style={[styles.drawerContainer, { backgroundColor:bgc}]}>       
         <StyledDrawerHeaderView>
          <TouchableOpacity onPress={() => this.closeMe()} style={{flexDirection:'row',alignItems:'center'}}>
            <MaterialIcon name="chevron-left" size={40} color={theme['drawer--color--text']}/>
            <View style={{width:'40%',height:63,flex:2,alignItems: 'center',justifyContent:'center'}}>
              <Image source={this.menulogo} style={{width:'50%',resizeMode: 'contain',marginRight:40,tintColor:'white'}} />
            </View>
            <View style={{width:3,height:'100%',backgroundColor:'red'}}></View>
          </TouchableOpacity>
          <MyDivider color={theme.drawerDividerColor}/>
          </StyledDrawerHeaderView>
          <Svg height="30" width="100%" >
            <Defs>
              <LinearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0" stopColor="#000000" stopOpacity="1" />
                <Stop offset="1" stopColor="#333333" stopOpacity="0" />
              </LinearGradient>
            </Defs>            
            <Rect x="0" y="0" width="100%" height="20" fill="url(#grad)"/>
          </Svg>
          <View style={{alignItems:'center',marginTop:0,marginBottom:20,maxHeight:100,borderColor:'red',borderWodth:2}}>
              <Image source={this.appMenuLogo} style={{width:50,height:50,resizeMode: 'contain',marginBottom:10}}/>
              <Text style={{color:theme.onPrimary}}>{this.brandTexts?.appName || ""}</Text>
            </View>
          
          <ScrollView style={{paddingLeft:10,paddingRight:10}}>


         <View>
            <MenuDivider color={theme["drawer--color--divider"]}/>
            <MenuButton title_key="MENU_ACCOUNT" icon="account" destination={appRoutesNames.ACCOUNT} callback={this.navigateToScreen}/>
            <MenuDivider color={theme["drawer--color--divider"]}/>
            <MenuButton title_key="MENU_SCENARIOS" icon="account" destination={appRoutesNames.PROGRAMMATION} callback={this.navigateToScreen}/>
            <MenuDivider color={theme["drawer--color--divider"]}/>
            <MenuButton title_key="MENU_DASHBOARD" icon="home" destination={appRoutesNames.HOME} callback={this.navigateToScreen}/>
            <MenuDivider color={theme["drawer--color--divider"]}/>
            <MenuButton title_key="productTypes:HEATER" icon="heater" destination={appRoutesNames.FAMILY_HEATER_PRODUCTS} callback={this.navigateToScreen}/>
            <MenuButton title_key="productTypes:LIGHT" icon="light" destination={appRoutesNames.FAMILY_LIGHT_PRODUCTS} callback={this.navigateToScreen}/>
            <MenuButton title_key="productTypes:GATE" icon="gate" destination={appRoutesNames.FAMILY_GATE_PRODUCTS} callback={this.navigateToScreen}/>
            <MenuButton title_key={t("productTypes:PLUG")} icon="plug" destination={appRoutesNames.FAMILY_PLUG_PRODUCTS} callback={this.navigateToScreen}/>
            <MenuButton title_key="productTypes:SHUTTER" icon="shutter" destination={appRoutesNames.FAMILY_SHUTTER_PRODUCTS} callback={this.navigateToScreen}/>
            <MenuDivider color={theme["drawer--color--divider"]}/>        
            <MenuButton title_key="MENU_ADD_GROUP" icon="add" destination={appRoutesNames.ADD_GROUP} callback={this.navigateToScreen}/>
            <MenuDivider color={theme["drawer--color--divider"]}/>
            <MenuButton title_key="MENU_ADD_PRODUCT" icon="add" destination="AddProduct" callback={this.navigateToScreen}/>
            <MenuDivider color={theme["drawer--color--divider"]}/>
            <MenuButton title_key="MENU_SETTINGS" icon="settings" destination="Settings" callback={this.navigateToScreen}/>
            <MenuDivider color={theme["drawer--color--divider"]}/>
            <MenuButton title_key="MENU_NOTIFICATIONS" icon="notifications" destination={appRoutesNames.NOTIFICATIONS} callback={this.navigateToScreen}/>
            <MenuDivider color={theme["drawer--color--divider"]}/>
            <MenuButton title_key="MENU_ABOUT" icon="about" destination={appRoutesNames.ABOUT} callback={this.navigateToScreen}/>
            <MenuDivider color={theme["drawer--color--divider"]}/>
            <MenuButton title_key="MENU_LOGOUT" icon="power" destination="LogoutGateway" callback={this.navigateToScreen}/>
            <MenuDivider color={theme["drawer--color--divider"]}/>
            <MenuDivider color={theme["drawer--color--divider"]}/>
         </View>


           <View>
               


              <MyDivider color={theme.drawerDividerColor}/>
              </View>
          </ScrollView>
      </SafeAreaView >
    );
  }
}


const styles = StyleSheet.create({
  drawerContainer: {
    flex: 1,
   
   
  },
  drawerDivider : {
    backgroundColor:"white"
  },

  
});


function mapStateToProps(state){
  return {}
};
mapDispatchToProps = (dispatch) => {
  return({
      setRoute: (route) => {console.log("previous route du setRoute",route);dispatch({type:APP_PREVIOUS_ROUTE,payload:{previousRoute:route}})}
  })
}

export default withTranslation()(withTheme(connect(mapStateToProps,mapDispatchToProps)(CustomDrawer)));


//------------------------------------------------------------------
/* shadow no supported
const StyledDrawerHeaderView = styled.View`
                                  box-shadow: 0px 6px 1px rgba(0,0,0,0.8);
                                  `;
*/
const StyledDrawerHeaderView = styled.View`

`;


//------------------------------------------------------------------



const MenuButton = (props) => {
  const { t, i18n } = useTranslation();
  const {icon} = props
  const {themeID,theme,test} = useTheme();
  const textColor = props.textColor || theme['drawer--color--text'];
  const accessibilityLabel = "Drawer_"+props.title_key;
  return (
            <>
              <Button                         
                  title={t(props.title_key).toUpperCase()}
                  icon = {<MenuButtonIcon size={24} icon={icon}/>}
                  type="clear"
                  onPress={() => props.callback(props.destination)}
                  buttonStyle={{ justifyContent: 'flex-start',marginLeft:0,marginTop:5}}
                  titleStyle={{paddingLeft:20,color:textColor,textAlign:'left' }}
                  accessibilityLabel={accessibilityLabel}
            />
            <AutomatedTestIdDisplay autoTestId={accessibilityLabel}/>
            </>
  )

}

/*
   icon = {<Image style={{width:24,height:24}} source={require('_images/interfaces/menu/home.png')}></Image>}
*/



/**
 * 
 * @param {*} props
 * 
 *  home, light, heater
 *  
 */
const MenuButtonIcon= (props) => {

  const {icon,size} = props
  const {themeID,theme,test} = useTheme();
  //console.log("themeID",themeID,test)
  switch(icon) {
    case 'light':
      return  <Image style={{width:props.size,height:props.size}} source={require('_images/interfaces/menu/light.png')}></Image>
      break;
    case 'heater' :
      return  <Image style={{width:props.size,height:props.size}} source={require('_images/interfaces/menu/heater.png')}></Image>
      break;
    case 'gate' :
      return  <Image style={{width:props.size,height:props.size}} source={require('_images/interfaces/menu/gate.png')}></Image>
      break;
    case 'plug' :
        return  <Image style={{width:props.size,height:props.size}} source={require('_images/interfaces/menu/plug.png')}></Image>
        break;
    case 'shutter' :
          return  <Image style={{width:props.size,height:props.size}} source={require('_images/interfaces/menu/shutter.png')}></Image>
          break;
    case 'scenarios' :
          return  <Image style={{width:props.size,height:props.size}} source={require('_images/interfaces/menu/scenarios.png')}></Image>
          break;
    case 'add' :
      return  <Image style={{width:props.size,height:props.size}} source={require('_images/interfaces/menu/add.png')}></Image>
      break;
    case 'settings' :
        return  <Image style={{width:props.size,height:props.size}} source={require('_images/interfaces/menu/settings.png')}></Image>
        break;
    case 'about' :
        return  <Image style={{width:props.size,height:props.size}} source={require('_images/interfaces/menu/about.png')}></Image>
        break;
    case 'power' :
          return  <Image style={{width:props.size,height:props.size}} source={require('_images/interfaces/menu/power.png')}></Image>
          break;
    case 'home' : 
      return  <Image style={{width:props.size,height:props.size}} source={require('_images/interfaces/menu/home.png')}></Image>
      break;
    case 'account' : 
      return  <Image style={{width:props.size,height:props.size}} source={require('_images/interfaces/menu/user.png')}></Image>
      break;
    case 'notifications' : 
      return  <Image style={{width:props.size,height:props.size}} source={require('_images/interfaces/menu/notifications.png')}></Image>
      break;
  }

  return <Image style={{width:props.size,height:props.size}} source={require('_images/interfaces/menu/home.png')}></Image>
}

const MenuDivider = (props) => {
  const {color} = props;
  //console.log("MenuDivider color",color)
  return (
    <View style={{height:1,width:'100%',backgroundColor:color}}></View>
  )
}