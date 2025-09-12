import '_brand/templates/screens/_locales'
//import '../_locales'

import React from 'react';
import { useState,useEffect } from 'react';
import { View,Text,TouchableWithoutFeedback, Image, ImageBackground, Dimensions} from 'react-native';
import { useTranslation } from 'react-i18next';

//import AccessButton from '_components/forms/accessButton';
import AccessButton from '_brand/templates/components/forms/accessButton';


import styled from 'styled-components/native';

//--- theme ---
import { useTheme } from '_theming/themeProvider';

//--- illustrations ---
import Welcome from '_brand/images/illustrations/welcome3';

//--- styled Components
import {H2,P} from '_brand/templates/styled';

//--- logos ---
import LogoGoogle from '_brand/images/logos/js/Google';
import LogoApple from '_brand/images/logos/js/Apple';
import LogoAmazon from '_brand/images/logos/js/Amazon';
import MailIcon from '_brand/images/icons/app/Sms';

//---- hooks -----
import { useUser } from '_hooks/useUserHigher';

//--- Appium -----
import {buildTestId} from '_helpers/appium';
import { color } from 'react-native-reanimated';


const AccessScreen = (props) => {
    const { t, i18n } = useTranslation();
    
    const {theme} = useTheme();
    const uUser = useUser();
    const {getCredentials} = uUser

    const {move,serverError,isConnected,oAuth,showServerSelectorTap} = props;
    console.log("ACCESS PROPS :", isConnected)
   
    const logTest = buildTestId("login");
    const signUpTest = buildTestId("signUp");

    const buttonStyle = {borderColor:'white',borderWidth:0,borderRadius:16,width:260,marginBottom:0,backgroundColor:'white'};
    const titleStyle = {textTransform:'none',color:'black'}
    const defaultButtonProps = {titleStyle,buttonStyle,specialColor:"#555"}
    
    const onSelectServerTap = () => {
        if(showServerSelectorTap)showServerSelectorTap()
    }

    const RenderGoogle = ()=>{
        return(
            <View style={{width:16, height:16}}>
                <LogoGoogle/>
            </View>
        )
    }
    const RenderApple = ()=>{
        return(
            <View style={{width:16, height:16}}>
                <LogoApple color='white'/>
            </View>
        )
    }

    const borderColor = theme?.prflxBorderColor||'orange';
    const Containerbgcolor = theme?.prflxContaintBgColor||'white';
    const bgcolor = theme?.prflxbgColor||'white';
    const lineWidgetBgColor = theme?.prflxVerticalMultiIconsBgColor||"white";
    const textColor = theme?.prflxTextColor||'black'
    const headerBgColor = theme?.prflxHeaderBackground || '#FFFFFF'

    const DEVICE_HEIGHT = Dimensions.get('screen').height;        
    const DEVICE_WIDTH = Dimensions.get('window').width;

    const imageSource = require('_brand/images/icons/app/background.png')
    const imageSource1 = require('_brand/images/icons/app/calypshomesplash.png')
    //const imageSource = require('_brand/images/icons/app/accessBgImage.png')


    const [hasCredentials, setHasCredentials] = useState(false);
    
    useEffect(() => {
      (async () => {
          const result = await getCredentials();
          console.log("ACCESS in init getCredentials",result)
          setHasCredentials(!result?.error)
      })();
      console.log("TEst hasCredentials !!!!!!!!")
    }, []);
  
    useEffect(()=> {
    
    },[hasCredentials]);

    return (
        <View style={[{flex:1,backgroundColor:bgcolor, paddingVertical:100, alignItems:'center'}]}>
                <Image source={imageSource} style={{width:DEVICE_WIDTH, height:DEVICE_HEIGHT, zIndex:-2, position:'absolute', top:0}}/>
                <Image source={imageSource1} style={{flex:1, resizeMode:'contain', justifyContent:'center', alignItems:'center'}}/>
                {/* <Image source={imageSource1} style={{width:DEVICE_WIDTH, height:DEVICE_HEIGHT, zIndex:-1, position:'absolute', top:0}}/> */}
                
                <View>
                    <Image source={require('_brand/images/icons/app/profaluxIconJs/Logo.png')}/>
                </View>
            
                {!isConnected &&
                        <View style={{width:'100%',position:'absolute',alignItems:'center',paddingTop:20}}>
                            <Text style={{color:textColor}}>{t("NETWORK_IS_DECONNECTED")} AAA{hasCredentials} BBB</Text>
                        </View>
                }
                {serverError &&
                        <View style={{width:'100%',position:'absolute',alignItems:'center',paddingTop:20}}>
                            <Text style={{color:textColor}}>{t("SERVER_UNREACHABLE")}</Text>
                        </View>
                }   
                        
                {/* <WelcomeView style={{maxHeight:266}}>
                    <TouchableWithoutFeedback  onPress={onSelectServerTap}>
                     <Welcome style={{backgroundColor:'transparent',marginBottom:'-1.2%'}}/> 
                    </TouchableWithoutFeedback>                            
                </WelcomeView>  */}
                <View style={{paddingRight:44,paddingLeft:44,marginTop:32}}>
                    {/* <H2 color={textColor}>{t('account:WELCOME')}</H2> */}
                    <Text  style ={{color:textColor, textAlign:'center'}}>{t('account:DESCRIPTION')}</Text>
                    <View style={{fustifyContent:'flex-end',alignItems:'center'}}>
                            <View style={{marginBottom:20,width:'100%',padding:40,alignItems:'center'}}>
                                {/* <AccessButton titleStyle={{color:'red'}} title={t('account:APPLE_CREATE')} {...defaultButtonProps} onPress={() => oAuth("apple")} icon={<RenderApple/>} testAppium={signUpTest}/>
                                <AccessButton  title={t('account:GOOGLE_CREATE')} {...defaultButtonProps} onPress={() => oAuth("google")} icon={<RenderGoogle/>} testAppium={signUpTest}/> */}
                                {/* <AccessButton title={t('account:AMAZON_CREATE')} {...defaultButtonProps} onPress={() => move('Subscribe',"amazon")} icon={<LogoAmazon/>} testAppium={signUpTest}/>  */}
                                <AccessButton title={t('account:EMAIL_CREATE')} {...defaultButtonProps} onPress={() => move('Subscribe')} icon={<MailIcon color="#FFAA0B" />}testAppium={logTest}/>                    
                            </View>
                    </View>
                </View>  
                {/* {//(!isConnected && hasCredentials) &&
                        <View style={{
                            backgroundColor:'#f76464',width:'80%',height:"60%",
                            position:'absolute', top:"40%",
                            justifyContent:'center', alignItems:'center',
                            marginHorizontal:10, borderRadius:12,
                            }} zIndex={133}>
                          <Text
                            style={{fontSize:16, fontWeight:"600", color:'white'}}
                            >
                            {t("NETWORK_IS_DECONNECTED")}
                          </Text>
                        </View>
                }     */}
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