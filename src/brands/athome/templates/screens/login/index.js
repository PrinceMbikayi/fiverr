import '../_locales'

import React,{ useState,useRef, useEffect } from 'react';
import { View,Text,StyleSheet,KeyboardAvoidingView,ImageBackground,Image,Alert,TouchableWithoutFeedback,TouchableOpacity} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';

import {useNetInfo} from "@react-native-community/netinfo";
import styled from 'styled-components/native';
import { useTranslation } from 'react-i18next';
import { Trans } from 'react-i18next';
import { BackHandler } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useTheme } from '_theming/themeProvider';
import {H1,P} from '../../styled';

import Button from '../../components/ui/Button'



import LoginComponent from '_components/forms/loginComponent';



import {TextStyles} from '_styles/text';


//--- icons ------


//--- brand ----
import brandAppTexts from '_brand/texts/app.json';

//--- Appium -----
import {buildTestId} from '_helpers/appium';

// Function component start Here

const LoginScreen = (props) => {    
  
    const { t, i18n } = useTranslation();    
    const {theme} = useTheme();
    const {serverError,isConnected,oAuth} = props;

    const netInfo = useNetInfo();
    const [countTap,setCountTap] = useState(0)


    console.log("LoginScreen props",props)
    const {move,subscribreStep,showServerSelectorTap,submit,confirmSubmit,goBack,pageIndex,userId = '',userPassword='' } = props;   
  
    

    const handleBackPress =  () => {  
        console.log("handleBackPress")
        goBack()
        
        return true; // intercept event    
    }
   
    const onSelectServerTap = () => {
        if(showServerSelectorTap)showServerSelectorTap()
    }
  
  
    const logoTest = buildTestId("activateServerSelection");

  const goCreate = () => {
    console.log("go create")
    move("Subscribe")
  }

  const loginRef = useRef(null);

  const submitMe = () => {
    loginRef.current.submitForm();
  }

  const lostPassword = () => {
    console.log("lostPassword !!!")
    move('LostPassword')
  }

  const logoButton = buildTestId("logoButton");


  const logoTap = () => {
    console.log("tapatapatapa")
    if((countTap+1)> 7 ){
      //dispatch(userSetIsTester(true));
      //storage
      //storeIsTester(true)
      onSelectServerTap();
    }
    setCountTap(countTap+1)
  
  }



    return (
     
          
           <View style={{backgroundColor:'transparent'}}>
                        <ImageBackground source={require('_images/interfaces/access.png')} style={{minHeight:270,alignItems:'center',justifyContent:'center',resizeMode:'cover'}} fadeDuration={0}>
                            <TouchableWithoutFeedback onPress={() => logoTap()} {...logoButton}>   
                                <View style={{width:'100%',alignItems:'center'}}>
                                    <Image source={require('_brand/images/logo_menu.png')} style={{width:'50%',resizeMode: 'contain',marginBottom:10}} fadeDuration={0}/>
                                    <Image source={require('_brand/images/logo_appli.png')} style={{width: 50, height: 50}} fadeDuration={0}/>
                                </View> 
                                </TouchableWithoutFeedback>            
                                <View style={{height:24,width:'100%',position:'absolute',bottom:0,backgroundColor:theme.redBar,alignItems:'flex-end'}}>
                                    <Image source={require('_images/interfaces/ligne_rouge.png')} fadeDuration={0}/>
                                </View>                                
                        </ImageBackground>
            <View style={[styles.block,{alignContent:'center', backgroundColor:theme.backgroundColor,borderBottomColor:'#ccc',borderBottomWidth:1}]}>
                  
                    <View style={[styles.insideBlock,{}]}>  
                    {/* {t('APP_NAME')} */ }                     
                        <Text style={[TextStyles.authTitles,{marginTop:10,paddingLeft:10,color:theme.primaryColor}]}>{brandAppTexts.appName || t('APP_NAME')}</Text>
                        <Text style={[TextStyles.authSubtitles,{paddingLeft:10,color:theme.textColor}]}>{t('ACCESS_CONNECT')}</Text>                
                    </View>  
                        
                </View>                
                <View style={{backgroundColor:'transparent',padding:16}}>
                    <LoginComponent goBack={goBack} submit={submit} lostPasswordRequest={lostPassword} ref={loginRef} />
                    <Button title={t("account:LOGIN_SUBMIT")} onPress={submitMe}   bgColor={theme.primary_1_light}   />  
                </View> 
                              
            </View>
       
       
         );
}

export default LoginScreen;

const styles = StyleSheet.create({
    insideBlock: {
      margin:10
     
    },
    viewPager : {
        flex:1
    }
  });

  const GroupButtonText = styled.Text`
font-size: ${props => (props.fontSize|| 12)}px;
font-weight:normal;
text-transform:capitalize;

`; 