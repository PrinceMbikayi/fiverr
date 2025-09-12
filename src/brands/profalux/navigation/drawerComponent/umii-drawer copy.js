import React from 'react';
import { View, Text, ScrollView, SafeAreaView,TouchableOpacity,StyleSheet,Image } from 'react-native';
import { withTranslation } from 'react-i18next';
import { useTranslation } from 'react-i18next'; // needed for menuItme renderer
import { connect } from "react-redux";

import {APP_PREVIOUS_ROUTE} from '_actions/app' 
import { withTheme} from '_theming/themeProvider';
import { useTheme } from '_theming/themeProvider';
import styled from 'styled-components/native';
import Icon from 'react-native-vector-icons/MaterialIcons';

import {appRoutesNames} from '_config/AppConfig';
import {AutomatedTestIdDisplay} from '_components/objects/@common/testAutomation/AutomatedTestId';

import {iconsJs} from '_brand/utils/iconsJs';
import { MultiPurposeWidgetLine } from "_brand/templates/components/objects/common/MultiPurposeWidgetLine";


//=======================================
import Ratings from '_brand/templates/components/ui/ratings'
import {useGlobalModal} from '_components/ui/globalModal';

/* for Brand Block Shadow */
import Svg, {
 
  Rect,  
  Defs,
  LinearGradient, 
  Stop,  
} from 'react-native-svg';

import {drawerIcons} from '_brand/images/drawer';

import {logout as ApiLogout} from '_api/Api';

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
   

    const navState = this.props.navigation.getState();
    return navState.routeNames[navState.index];


  }


  navigateToScreen = (route,params,key) => {
  
     
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

  // menulogo = (this.props.theme.key == "DARK") ? require('_brand/images/logo_menu.png')  : require('_brand/images/logo_menu_light.png');  
  // appMenuLogo = (this.props.theme.key == "MAXIMUM BLUE GREEN") ? require('_brand/images/logo_appli.png')  : require('_brand/images/logo_appli.png');
  brandTexts = require('_brand/texts/drawer.json')

  
  doLogout = async() => {
   
    console.log("before Call =>")
    const callLogout = await ApiLogout().catch((err) => console.log("alorss",err));
    this.props.navigation.navigate('Auth',{ screen: 'Access' });    
    this.closeMe();
  }

  



  render() {

    const { t,theme } = this.props;
    // const bgc = theme['drawer--color--bg'];
    const bgc = '#465970';
   
    return (
        
      <SafeAreaView  style={[styles.drawerContainer, { backgroundColor:bgc}]}>       
         <StyledDrawerHeaderView style={{backgroundColor:'lightblue'}}>
          <TouchableOpacity onPress={() => this.closeMe()} style={{flexDirection:'row',alignItems:'center'}} >
            <Icon name="chevron-left" size={50} color={theme['drawer--color--text']}/>
            <View style={{width:'40%',height:67 ,flex:2,alignItems:'flex-start',justifyContent:'center'}}>
              {/* <Image source={this.menulogo} style={{width:'50%',resizeMode: 'contain',marginRight:40,tintColor:'white'}} /> */}
              <Text style={{fontSize:25, backgroundColor:'transparent', color:'white', fontWeight:'bold'}}>Menu</Text>
            </View>
            {/* <View style={{width:3,height:'100%',backgroundColor:'red'}}></View> */}
          </TouchableOpacity>
        
          </StyledDrawerHeaderView>
          {/* <Svg height="30" width="100%" >
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
            </View> */}
          
          <ScrollView style={{paddingLeft:10,paddingRight:10}}>


            <View>
                <MenuDivider color={theme["drawer--color--divider"]}/>
                {/*
                <MenuButton title_key="MENU_ACCOUNT" icon="account" destination={appRoutesNames.ACCOUNT} callback={this.navigateToScreen}/>
                <MenuDivider color={theme["drawer--color--divider"]}/>
                <MenuButton title_key="MENU_SCENARIOS" icon="account" destination={appRoutesNames.PROGRAMMATION} callback={this.navigateToScreen}/>
                <MenuDivider color={theme["drawer--color--divider"]}/>
              */}
                <MenuButton title_key="MENU_DASHBOARD" icon="home" destination={appRoutesNames.HOME} callback={this.navigateToScreen}/>
                <MenuDivider color={theme["drawer--color--divider"]}/>
                <View style={{flexDirection:'row',flex:1,justifyContent:'space-between'}}>
                  <MenuButton icon="heater" destination={appRoutesNames.FAMILY_HEATER_PRODUCTS} callback={this.navigateToScreen}/>
                  <MenuButton icon="light" destination={appRoutesNames.FAMILY_LIGHT_PRODUCTS} callback={this.navigateToScreen}/>
                  <MenuButton icon="gate" destination={appRoutesNames.FAMILY_GATE_PRODUCTS} callback={this.navigateToScreen}/>
                  <MenuButton icon="plug" destination={appRoutesNames.FAMILY_PLUG_PRODUCTS} callback={this.navigateToScreen}/>
                  <MenuButton icon="shutter" destination={appRoutesNames.FAMILY_SHUTTER_PRODUCTS} callback={this.navigateToScreen}/>
                
                </View>
                <MenuDivider color={theme["drawer--color--divider"]}/>        
                <MenuButton title_key="MENU_GROUP_HOME" icon="group" destination={appRoutesNames.GROUP_HOME} callback={this.navigateToScreen}/>
                <MenuDivider color={theme["drawer--color--divider"]}/>
                <MenuButton title_key="MENU_ADD_PRODUCT" icon="add" destination="AddProduct" callback={this.navigateToScreen}/>
                <MenuDivider color={theme["drawer--color--divider"]}/>
                <MenuButton title_key="MENU_SETTINGS" icon="settings" destination="Settings" callback={this.navigateToScreen}/>
                <MenuDivider color={theme["drawer--color--divider"]}/>
                <MenuButton title_key="MENU_NOTIFICATIONS" icon="notifications" destination={appRoutesNames.NOTIFICATIONS} callback={this.navigateToScreen}/>
                <MenuDivider color={theme["drawer--color--divider"]}/>
                
                <MenuButton title_key="MENU_ABOUT" icon="about" destination={appRoutesNames.ABOUT} callback={this.navigateToScreen}/>
                <MenuDivider color={theme["drawer--color--divider"]}/>

                <MenuButton title_key="MENU_TEST_RATING" icon="star" testCallback={true}/>
                <MenuDivider color={theme["drawer--color--divider"]}/>

                <MenuButton title_key="MENU_LOGOUT" icon="power" destination="LogoutGateway" callback={this.doLogout}/>
                <MenuDivider color={theme["drawer--color--divider"]}/>
            </View>
          </ScrollView>
      </SafeAreaView >
    );
  }
}


const styles = StyleSheet.create({
  drawerContainer: {
    flex: 1,
  }
  
});


function mapStateToProps(state){
  return {}
};
mapDispatchToProps = (dispatch) => {
  return({
      setRoute: (route) => {dispatch({type:APP_PREVIOUS_ROUTE,payload:{previousRoute:route}})}
  })
}

export default withTranslation()(withTheme(connect(mapStateToProps,mapDispatchToProps)(CustomDrawer)));


//------------------------------------------------------------------

const StyledDrawerHeaderView = styled.View`

`;


//------------------------------------------------------------------
const MenuButton = (props) => {


  const { t, i18n } = useTranslation();
  const globalModal = useGlobalModal();
 
  const {icon,callback,destination} = props
  const {themeID,theme,test} = useTheme();
  const textColor = props.textColor || theme['drawer--color--text'];
  const accessibilityLabel = "Drawer_"+props.title_key;
  const MyButtonStyle = (props.title_key == undefined) ? {marginRight:0,width:24} : {justifyContent: 'flex-start',marginLeft:0}


  const doCallback = () => {
    if(callback) {
      callback(destination);
    }
    if(props.testCallback) {
     
      const content =   <Ratings/> 
      globalModal.setContent(content,{type:'centered'});    
      globalModal.toggle();
    }
  }


  return (
            <View style={{backgroundColor:'transparent',marginBottom:10,marginTop:10}}>
              <TouchableOpacity  onPress={doCallback} >
                <View style={{...MyButtonStyle ,marginTop:5,borderWidth:0,flexDirection:'row',justifyContent:'center'}}> 
                  <MenuButtonIcon size={24} icon={icon}/>
                  {props.title_key &&
                    <View style={{flex:1}}>
                      <Text style={{fontSize:16,paddingLeft:20,color:textColor,textAlign:'left' }}>{t(props.title_key).toUpperCase()}</Text>             
                    </View>
                  }
                  </View>
                </TouchableOpacity>
              <AutomatedTestIdDisplay autoTestId={accessibilityLabel}/>
            </View>
  )
}

const MenuButtonIcon = (props) => {
  const {icon,size} = props
  const imgSource = drawerIcons?.[icon] || null;
  
  return (
    <View>
        <MultiPurposeWidgetLine 
          icons={stateIcon} 
          iconSize={73}
          onPress = {handleOnPress} 
          active = {sendCurrentActive}
          iconWrapperStyle = {{borderColor:textColor, borderWidth:2}}
        />
    </View>
  )
}
// const MenuButtonIcon = (props) => {
//   const {icon,size} = props
//   const imgSource = drawerIcons?.[icon] || null;
  
//   return (
//     <Image style={{width:size,height:size}} source={imgSource}></Image>

//   )
// }

const MenuDivider = (props) => {
  const {color} = props;
  //console.log("MenuDivider color",color)
  return (
    <View style={{height:1,width:'100%',backgroundColor:color}}></View>
  )
}