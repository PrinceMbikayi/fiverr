import '../_locales'

import React,{ useState,useRef, useEffect } from 'react';
import { View,Text,StyleSheet,ImageBackground,Image,Alert,TouchableWithoutFeedback,TouchableOpacity} from 'react-native';
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


import SubscribeComponent from '_components/forms/subscribeComponent';
import SubscribeConfirmComponent from '_components/forms/subscribeConfirmComponent';

import MailSend from '_brand/images/illustrations/MailSend'


import {TextStyles} from '_styles/text';


//--- icons ------
import CloseCircle from  '_brand/images/icons/app/CloseCircle';

//--- brand ----
import brandAppTexts from '_brand/texts/app.json';

//--- Appium -----
import {buildTestId} from '_helpers/appium';

// Function component start Here

const SubscribeScreen = (props) => {    
  
    const { t, i18n } = useTranslation();    
    const {theme} = useTheme();
    const {serverError,isConnected,oAuth} = props;
    console.log("SubscribeScreen props",props)
    const {move,subscribreStep,showServerSelectorTap,submit,confirmSubmit,goBack,pageIndex,userId = '',userPassword='' } = props;   
  

    const stepToPage = {"begin":0,"waiting":1}
    // create our ref
    const myViewPager = useRef();
    const [login,setLogin] = useState("")
    /* ------- custom server ------------ */
    const [countTap, setCountTap] = useState(0);

    useEffect(() => {
        myViewPager.current.setPage(stepToPage[subscribreStep])
       // myViewPager.current.setPage(1)
    },[subscribreStep])

    /*
    useEffect(() =>{
        BackHandler.addEventListener('hardwareBackPress', handleBackPress);
        return () => {
            BackHandler.removeEventListener('hardwareBackPress', handleBackPress);
            console.log("je suis retiré")
        };
      }, [pageIndex]);
      */

    const handleBackPress =  () => {  
        console.log("handleBackPress")
        goBack()
        
        return true; // intercept event    
    }
   
    const onSelectServerTap = () => {
        if(showServerSelectorTap)showServerSelectorTap()
    }
  
  
    const logoTest = buildTestId("activateServerSelection");

  const goLogin = () => {
    console.log("go login")
    move("Login")
  }

  const subscribeRef = useRef(null);

  const submitMe = () => {
    subscribeRef.current.submitForm();
  }



    return (
       <SafeAreaView style={{ flex: 1 }} forceInset={{ top: 'never' }}>
           <View style={{flex:1,backgroundColor:theme?.primary_2_darker,padding:20}}>
                <View style={{alignItems:'flex-end'}}> 
                    <CloseCircle  color={theme.neutral_lighter} onPress={goBack}/>
                </View>
                
              
                <View style={{flex:1,backgroundColor:theme.backgroundColor}}>
                    <PagerView style={styles.viewPager} initialPage={pageIndex} scrollEnabled={false} ref={myViewPager}>
                        <View key="1">
                        <View style={{marginTop:69}}>
                            <TouchableWithoutFeedback  onPress={onSelectServerTap} {...logoTest}style={{flex:1}} >   
                                <H1 style={{color:theme.neutral_lighter}}>{t('account:CREATE_ACCOUNT_TITLE')}</H1>
                            </TouchableWithoutFeedback>
                        </View>          
                            <SubscribeComponent goBack={goBack} submit={submit} ref={subscribeRef} bgColor={theme?.primary_2_darker}/>
                            <Button title={t("account:CREATE_ACCOUNT_SUBMIT")} onPress={submitMe}   bgColor={theme?.primary_1_light} />       
                            <Text style={{color:theme.neutral_lighter,textAlign:'center',marginTop:16}}>
                                <Trans i18nKey="account:ALREADY_GOT_ACCOUNT">
                                                ...texte principal<Text style={{textDecorationLine:'underline',fontWeight:'bold'}} onPress={() =>goLogin()}>texte lien</Text>
                                </Trans>   
                            </Text>  
                            <View style={{marginBottom:20}}></View>                                    
                        </View>
                        
                    </PagerView>
                </View>
            </View>
           </SafeAreaView>
       
       
         );
}

export default SubscribeScreen;

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