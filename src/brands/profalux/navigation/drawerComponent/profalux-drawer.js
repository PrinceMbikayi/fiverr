import React from 'react';
import { View, Text, ScrollView, SafeAreaView,TouchableOpacity,StyleSheet  } from 'react-native';
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
    //console.log("navState",navState)
    return navState.routeNames[navState.index];


  }


  navigateToScreen = (route,params,key) => {
  
    // console.log("PreviousRoute :",previousRoute)
    let previousRoute = this.getOrigin();
    this.props.setRoute(previousRoute)

    const isRootArray = Array.isArray(route);

     if(route.length > 1){
      let destination = {'routeName':route};
      //console.log('ROUTE :', route[0], route[1])
        this.props.navigation.navigate(route[0], {screen:route[1]}); 
        
     }else{

       let destination = {'routeName':route};
       if(params != undefined)destination.params = params;
       if(key!=undefined)destination.key = key;
       this.props.navigation.navigate(route[0]); 
       this.props.navigation.closeDrawer();

     }
  }

  closeMe = () => {
    this.props.navigation.closeDrawer();
  }

  // menulogo = (this.props.theme.key == "DARK") ? require('_brand/images/logo_menu.png')  : require('_brand/images/logo_menu_light.png');  
  // appMenuLogo = (this.props.theme.key == "MAXIMUM BLUE GREEN") ? require('_brand/images/logo_appli.png')  : require('_brand/images/logo_appli.png');
  brandTexts = require('_brand/texts/drawer.json')

  
  doLogout = async() => {
   
    const callLogout = await ApiLogout().catch((err) =>console.log("alorss",err));
    this.props.navigation.navigate('Auth',{ screen: 'Access' });    
    this.closeMe();
  }

  



  render() {

    const { t,theme } = this.props;
    //const bgc = '#465970';
    const bgcolor = theme?.prflxContaintBgColor||'white';
    const textColor = theme?.prflxTextColor||'black'
    const borderColor = theme?.prflxBorderColor||'orange';
   
    return (

      <SafeAreaView style={{height:'100%', backgroundColor:'transparent'}} >
          
      <View style={{flex:1, backgroundColor:bgcolor}}>
      <View   style={{backgroundColor:bgcolor, alignItems:'center',justifyContent:'flex-end'}}>
            <TouchableOpacity onPress={() => this.closeMe()} style={{flexDirection:'row',alignItems:'center', backgroundColor:'transparent'}} >
              <View style={{flexDirection:'row',width:'100%' ,alignItems:'center',height:51, borderBottomColor:borderColor, borderBottomWidth:2, backgroundColor:'transparent'}}>
                <Icon name="chevron-left" size={40} color={textColor}/>
                {/* <Image source={this.menulogo} style={{width:'50%',resizeMode: 'contain',marginRight:40,tintColor:'white'}} /> */}
                  <Text style={{fontSize:20, backgroundColor:'transparent', color:textColor, fontWeight:'600'}}>Menu</Text>
              </View>
              {/* <View style={{width:3,height:'100%',backgroundColor:'red'}}></View> */}
            </TouchableOpacity>
        
          </View>
              <ScrollView style={{paddingLeft:10,paddingRight:10, marginTop:20}}>


                <View>
                    <MenuButton title_key="MENU_FAVORITE" icon={[iconsJs.favoritesIcon]} destination={['Accueil', 'productsScreen']} callback={this.navigateToScreen }/>

                    <MenuDivider color={textColor}/>
                    <MenuButton title_key="MENU_MAISON" icon={[iconsJs.homeIcon]} destination={['MaisonScreen']} callback={this.navigateToScreen}/>

                    <MenuDivider color={textColor}/>        
                    <MenuButton title_key="MENU_GROUP_HOME" icon={[iconsJs.groupesIcon]} destination={['Groups','ProfaluxGroupHomeScreen']} callback={this.navigateToScreen}/>

                    <MenuDivider color={textColor}/>        
                    <MenuButton title_key="MENU_ROUTINES" icon={[iconsJs.routinesIcon]} destination={['Routines','RoutinesHomeScreen']} callback={this.navigateToScreen}/> 

                    <MenuDivider color={textColor}/>
                    <MenuButton title_key="MENU_ADD_PRODUCT_PROFALUX" icon={[iconsJs.addIcon]} destination={["AddObject"]} callback={this.navigateToScreen}/>

                    {/* <MenuDivider color={textColor}/>
                    <MenuButton title_key="MENU_ADD_PRODUCT" icon={[iconsJs.routinesIcon]} destination="AddObject" callback={this.navigateToScreen}/> */}


                    <MenuDivider color={textColor}/>
                    <MenuButton title_key="MENU_SETTINGS" icon={[iconsJs.settingsIcon]} destination={["Settings"]} callback={this.navigateToScreen}/>

                    <MenuDivider color={textColor}/>
                    <MenuButton title_key="MENU_MY_ACCOUNT" icon={[iconsJs.accountIcon]} destination={["Account"]} callback={this.navigateToScreen}/>

                    {/* <MenuDivider color={textColor}/>
                    <MenuButton title_key="WELLCOME_TOUR" icon={[iconsJs.routinesIcon]} destination={["WellcomeTour","BeginRound"]} callback={this.navigateToScreen}/> */}

                    {/* <MenuDivider color={textColor}/>
                    <MenuButton title_key="MENU_ABOUT" icon={[iconsJs.accountIcon]} destination={["About"]} callback={this.navigateToScreen}/> */}

                    {/* <MenuDivider color={textColor}/>
                    <MenuButton title_key="MENU_NOTIFICATIONS" icon={[iconsJs.notifyIcon]} destination={appRoutesNames.NOTIFICATIONS} callback={this.navigateToScreen}/>

                    <MenuDivider color={textColor}/>
                    <MenuButton title_key="MENU_TEST_RATING" icon={[iconsJs.helpIcon]} testCallback={true}/> */}

                    <MenuDivider color={textColor}/>
                    <MenuButton title_key="MENU_LOGOUT_PROFALUX" icon={[iconsJs.logoutIcon]} destination={["LogoutGateway"]} callback={this.doLogout}/>
                    <MenuDivider color={textColor}/>
                </View>
              </ScrollView>
          </View>

          </SafeAreaView> 
    );
  }
}


const styles = StyleSheet.create({
  drawerContainer: {
    flex: 1,
    // width:346,
    // opacity:0.75
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

  const borderColor = theme?.prflxBorderColor||'orange';
  const bgcolor = theme?.prflxContaintBgColor||'white';
  const lineWidgetBgColor = theme?.prflxVerticalMultiIconsBgColor||"white";
  const textColor = theme?.prflxTextColor||'black'


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
                      <Text style={{fontSize:18,fontWeight:'700', paddingLeft:20,color:textColor,textAlign:'left' }}>{t(props.title_key)}</Text>             
                    </View>
                  }
                  </View>
                </TouchableOpacity>
              <AutomatedTestIdDisplay autoTestId={accessibilityLabel}/>
            </View>
  )
}

const MenuButtonIcon = (props) => {
  const {icon} = props
  //const imgSource = drawerIcons?.[icon] || null;
  
  return (
    <View>
        <MultiPurposeWidgetLine 
          icons={icon} 
          iconSize={30}
          isPressable = {false}
          //onPress = {doCallback} 
          // active = {sendCurrentActive}
          //iconWrapperStyle = {{borderColor:'black', borderWidth:2}}
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
  return (
    <View style={{height:2,width:'100%',backgroundColor:color}}></View>
  )
}