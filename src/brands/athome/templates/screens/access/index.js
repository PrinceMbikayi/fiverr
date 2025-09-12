import '../_locales'

import React from 'react';
import { View,SafeAreaView,Text,StyleSheet,ImageBackground,Image,BackHandler } from 'react-native';
import { useTranslation } from 'react-i18next';
import {useNetInfo} from "@react-native-community/netinfo";


import { useTheme } from '_theming/themeProvider';
import AccessButton from '_components/forms/accessButton';

import styled from 'styled-components/native'
//--- illustrations ---
//import Welcome from '_brand/images/illustrations/welcome2'
//--- styled Components
import {H2,P} from '_brand/templates/styled';
//--- logos ---

//--- Appium -----
import {buildTestId} from '_helpers/appium';

const AccessScreen = (props) => {
    const { t, i18n } = useTranslation();
    const netInfo = useNetInfo();
    const {theme} = useTheme();

    const {move,serverError,isConnected,oAuth} = props;
   
    const logTest = buildTestId("login");
    const signUpTest = buildTestId("signUp");

      


      const buttonStyle = {borderColor:'white',borderWidth:2,width:240};
      const titleStyle = {textTransform:'none',color:'white'}
      const backgroundImageStyle = {flex:1,alignItems:'center',justifyContent:'center',resizeMode:'cover',backgroundColor: 'rgba(0,0,0,1)'}


       return (
        <View style={[{flex:1,backgroundColor:'transparent'}]}>
            <ImageBackground source={require('_images/interfaces/accueil-HD-resized.jpg')} style={backgroundImageStyle} imageStyle={{opacity:0.6}} fadeDuration={0}>
                {!netInfo.isConnected &&
                        <View style={{width:'100%',position:'absolute',alignItems:'center',paddingTop:20}}>
                            <Text style={{color:"white"}}>{t("NETWORK_IS_DECONNECTED")}</Text>
                        </View>

                }
                {serverError &&
                        <View style={{width:'100%',position:'absolute',alignItems:'center',paddingTop:20}}>
                            <Text style={{color:"white"}}>{t("SERVER_UNREACHABLE")}</Text>
                        </View>

                }
               
                <View style={{width:'100%',alignItems:'center',flex:2,alignItems:'center',justifyContent:'center'}}>
                    <Image source={require('_brand/images/logo_menu.png')} style={{width:'50%',resizeMode: 'contain',marginBottom:10}} fadeDuration={0}/>
                    <Image source={require('_brand/images/logo_appli.png')} style={{width: 100, height: 100}} fadeDuration={0}/>
                </View>                    
                
                
                <View style={{flex:1,justifyContent:'flex-end',alignItems:'center'}}>
                    <View style={{marginBottom:20,width:'100%',padding:20,alignItems:'center'}}>
                        <AccessButton title={t('ACCESS_SUBSCRIBE')} titleStyle={titleStyle} buttonStyle={buttonStyle} theme={theme} specialColor="#555" onPress={() => move('Subscribe')} testAppium={signUpTest}/>
                        <AccessButton title={t('ACCESS_CONNECT')} titleStyle={titleStyle} buttonStyle={buttonStyle} theme={theme} specialColor="#555" onPress={() => move('Login')} testAppium={logTest}/>                    
                    </View>
                </View>
            </ImageBackground>
        </View>
    );
    }

export default AccessScreen;


const WelcomeView = styled.View`
    flex:1;
    background-color:white;
    border-bottom-left-radius:32px;
    border-bottom-right-radius:32px;
    padding-left:44px;
    padding-right:44px;
   
    align-items:center;
    justify-content:flex-end;
`;




const styles = StyleSheet.create({
    insideBlock: {
      margin:10
     
    },
    buttonContainer: {
        width:'100%',
        marginTop:10,
        
    }
  });