import '../_locales'

import React,{ useState,useRef, useEffect } from 'react';
import { View,Text,StyleSheet,KeyboardAvoidingView,ImageBackground,Image,Alert,TouchableWithoutFeedback,TouchableOpacity} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';

import PagerView from 'react-native-pager-view';
import {useNetInfo} from "@react-native-community/netinfo";
import styled from 'styled-components/native';
import { useTranslation } from 'react-i18next';
import { Trans } from 'react-i18next';
import { BackHandler } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useTheme } from '_theming/themeProvider';
import {H1,P} from '../../styled';

import Button from '../../components/ui/Button'



import LostPasswordComponent from '_components/forms/lostPasswordComponent';
import MailSend from '_brand/images/illustrations/MailSend';
import ReinitPasswordComponent from '_components/forms/reinitPasswordComponent';


import {TextStyles} from '_styles/text';


//--- icons ------
import CloseCircle from  '_brand/images/icons/app/CloseCircle';

//--- brand ----
import brandAppTexts from '_brand/texts/app.json';

//--- Appium -----
import {buildTestId} from '_helpers/appium';

// Function component start Here

const LostPasswordScreen = (props) => {    
  
    const { t, i18n } = useTranslation();    
    const {theme} = useTheme();
    const {serverError,isConnected,oAuth} = props;
    console.log("LoginScreen props",props)
    const {move,step,showServerSelectorTap,submit,submitReinit,goToRecovery,confirmSubmit,goBack,pageIndex,login = '',userId = '',userPassword='' } = props;   
  
    const stepToPage = {"begin":0,"waiting":1,"reinit":2}
    // create our ref
    const myViewPager = useRef();
    //const [login,setLogin] = useState("")
    /* ------- custom server ------------ */
    const [countTap, setCountTap] = useState(0);

    useEffect(() => {
        myViewPager.current.setPage(stepToPage[step])
       //myViewPager.current.setPage(0)
    },[step])
    

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

  const lostPasswordRef = useRef(null);

  const submitMe = () => {
    lostPasswordRef.current.submitForm();
  }

  const submitLostPassword = (values) => {
    console.log("intercept",values)
    submit(values)
  }




  const lostPassword = () => {
    console.log("lostPassword !!!")
  }

  const reinitPasswordRef = useRef(null);

  const onReinitPassword = () => {
    console.log("onReinitPassword")
    reinitPasswordRef.current.submitForm();
  }
 const  submitReinitPassword =(values) => {
    console.log("submitReinitPassword",values);
    submitReinit(values)
 }
  

    return (
       <SafeAreaView style={{ flex: 1 }} forceInset={{ top: 'never' }}>
           <View style={{flex:1,backgroundColor:theme?.primary_2_darker,padding:20}}>
               
                <View style={{flex:1,backgroundColor:theme.backgroundColor}}>
                    <PagerView style={styles.viewPager} initialPage={pageIndex} scrollEnabled={false} ref={myViewPager}>
                        <View key="1">
                          <View style={{marginTop:69}}>
                              <TouchableWithoutFeedback  onPress={onSelectServerTap} {...logoTest}style={{flex:1}} >   
                                  <H1 style={{color:theme.neutral_lighter,}}>{t('account:LOST_PASSWORD_TITLE')}</H1>
                              </TouchableWithoutFeedback>
                              <P style={{color:theme.neutral_lighter,marginTop:16,marginBottom:16}}>{t("account:LOST_PASWWORD_DESCRIPTION")}</P>
                          </View>          
                            <LostPasswordComponent goBack={goBack} submit={submitLostPassword} ref={lostPasswordRef} bgColor={theme?.primary_2_darker}/>
                            <View style={{marginBottom:32}}/> 
                            <Button title={t("account:LOST_PASSWORD_SUBMIT")} onPress={submitMe}   bgColor={theme.primary_1_light}   />       
                            
                            <View style={{marginBottom:20}}></View>                                    
                        </View>
                        <View key="2">
                            <View style={{marginBottom:16}}>
                                <View style={{marginTop:16,marginBottom:32,padding:48,height:200,width:200,borderRadius:100,backgroundColor:'white',alignSelf:'center'}}>
                                    <MailSend/>    
                                </View> 
                                <H1 style={{color:theme.neutral_lighter,}}>{t('account:MAIL_SEND')}</H1>
                                <P  style={{color:'white',marginTop:16}}>{t('account:LOST_PASSWORD_MAIL_RECIEVED')}</P>
                            </View>                          
                            <Button title={t('account:LOST_PASSWORD_CONTINUE')} onPress={goToRecovery}   bgColor={theme.primary_1_light}   />                            
                        </View>
                        <View key="3">
                          <View style={{marginTop:69}}>
                              <TouchableWithoutFeedback  onPress={onSelectServerTap} {...logoTest}style={{flex:1}} >   
                                  <H1 style={{color:theme.neutral_lighter,}}>{t('account:REINIT_PASSWORD_TITLE')}</H1>
                              </TouchableWithoutFeedback>
                              <P style={{color:theme.neutral_lighter,marginTop:16,marginBottom:16}}>{t("account:REINIT_PASSWORD_DESCRIPTION")}</P>
                          </View>          
                            <ReinitPasswordComponent goBack={goBack} submit={submitReinitPassword} ref={reinitPasswordRef} bgColor={theme?.primary_2_darker}/>
                            <View style={{marginBottom:32}}/> 
                            <Button title={t("account:REINIT_PASSWORD_SUBMIT")} onPress={onReinitPassword}   bgColor={theme.primary_1_light}   />       
                            
                            <View style={{marginBottom:20}}></View>      
                        </View>   
                    </PagerView>
                </View>
            </View>
           </SafeAreaView>
       
       
         );
}
export default LostPasswordScreen;

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