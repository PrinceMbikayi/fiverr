import '_brand/templates/screens/_locales'
import React,{ useState,useRef, useEffect} from 'react';
import {SafeAreaView, KeyboardAvoidingView,View,Text,StyleSheet,TouchableWithoutFeedback, Image, Pressable} from 'react-native';

import PagerView from 'react-native-pager-view';

import { useTranslation } from 'react-i18next';

import { useTheme } from '_theming/themeProvider';
import {H1,P} from '../../styled';
import Button from '_brand/templates/components/ui/Button';
import RecoverAccountComponent from '_brand/templates/screens/recoverAccount/RecoverAccountComponent';
import RecoverAccountConfirmComponent from '_brand/templates/components/forms/RecoverAccountConfirmComponent';
import { HeaderWithBack } from '_brand/templates/components/headers/header-with-back';
import { MultiPurposeWidgetLine } from '_brand/templates/components/objects/common/MultiPurposeWidgetLine';
import { iconsJs } from '_brand/utils/iconsJs';
import EtiquetteBox from './EtiquetteBox'


//--- icons ------
import MailSend from '_brand/images/illustrations/MailSend'

//--- Appium -----
import {buildTestId} from '_helpers/appium';
import { ScrollView } from 'react-native-gesture-handler';

// Function component start Here

const RecoverAccountScreen = (props) => {    
  
    const { t, i18n } = useTranslation();    
    const {theme} = useTheme();
    const {serverError,isConnected,oAuth} = props;
    
    const {move,subscribreStep,showServerSelectorTap,submit,confirmSubmit,goBack,pageIndex,userId = '',userPassword='' } = props;   
  
    const borderColor = theme?.prflxBorderColor||'orange';
    const Containerbgcolor = theme?.prflxContaintBgColor||'white';
    const bgcolor = theme?.prflxbgColor||'white';
    const lineWidgetBgColor = theme?.prflxVerticalMultiIconsBgColor||"white";
    const textColor = theme?.prflxTextColor||'black'
    const headerBgColor = theme?.prflxHeaderBackground || '#FFFFFF'




    const stepToPage = {"begin":0,"waiting":1}
    // create our ref
    const myViewPager = useRef();
    const [login,setLogin] = useState("")
    /* ------- custom server ------------ */
    const [countTap, setCountTap] = useState(0);

    useEffect(() => {
        myViewPager.current.setPage(stepToPage[subscribreStep])
        console.log("WHICH PAGE :", myViewPager.current)
       // myViewPager.current.setPage(1)
    },[subscribreStep])

    
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
        // J'ai inversé le Login et Subscribe dans la navigation profalux afin d'atterir sur la page login d'abord
        move("Subscribe")
        //move("Login")
    }

    const subscribeRef = useRef(null);

    const submitMe = () => {
        subscribeRef.current.submitForm();
    }

    const confirmSubscribeRef = useRef (null);

    const submitMeConfirm = () => {
        confirmSubscribeRef.current.submitForm();
    }



    return (
        <SafeAreaView style={{height:'100%', backgroundColor:'white'}}>
            <View style={{flex:1,backgroundColor:bgcolor,}}>
                <View style={{backgroundColor:'transparent' || headerBgColor, alignItems:'center',justifyContent:'flex-end'}}>
                        <HeaderWithBack
                            //title={uObject.name}
                            title={t('account:RENIT_IDENTIFIER')}
                            backSVG centered
                            goBack={{ action: goBack }}
                            noShadow    
                        />
                </View>
            
                <View style={{flex:1,backgroundColor:bgcolor,padding:20}}>
                    <KeyboardAvoidingView
                            behavior={Platform.OS === "ios" ? "height" : "height"}
                            style={{flex:1}}
                            >          
                        {/* <View style={{alignItems:'flex-end'}}> 
                            <CloseCircle  color={theme.neutral_lighter} onPress={goBack}/>
                        </View>              */}
                    
                        {/* 
                        <Pressable onPress={goBack} style={{ backgroundColor: 'transparent', height: 30, width: 30, marginBottom: 0, marginLeft: -10 }}>
                            <MultiPurposeWidgetLine
                                icons={[iconsJs.leftChevronIcon]}
                                isPressable={true}
                                iconSize={25}
                                iconBgColor='transparent'
                                onPress={goBack}
                                //active = {sendCurrentActive}
                                iconWrapperStyle={{ backgroundColor: 'transparent' }}
                            />
                        </Pressable>
                        <View style={{ marginLeft: 15 }}>
                            <TouchableWithoutFeedback onPress={onSelectServerTap} {...logoTest} style={{ flex: 1 }} >
                                <Image source={require('_brand/images/icons/app/profaluxIconJs/Logo.png')} />
                            </TouchableWithoutFeedback>
                        </View> */}
                        <View style={{flex:1,backgroundColor:bgcolor}}>
                            <PagerView 
                                style={styles.viewPager} 
                                initialPage={pageIndex} 
                                scrollEnabled={false} 
                                ref={myViewPager}>
                                <View key="1">
                                    <View style={{marginTop:0}}>
                                            <Text style={{fontSize:16, fontWeight:'400', textAlign:'center', marginBottom:15}}>{t('account:REINIT_IDENTIFIER_ENTER_BOX_INSTRUCTIONS')}</Text>
                                    </View> 
                                    <ScrollView style={{flex:1,height:'100%'}}>
                                        <View style={{justifyContent:'center', alignItems:'center'}}>
                                            <View style={{width:'100%'}}>
                                                <RecoverAccountComponent goBack={goBack} submit={submit} ref={subscribeRef} bgColor={theme?.primary_2_darker}/>
                                            </View>

                                            <View style={{marginTop:20, width:'100%', justifyContent:'center', alignItems:'center', backgroundColor:'transparent'}}>
                                                <Text style={{fontSize:16, fontWeight:'400', textAlign:'center', marginBottom:15}}>{t('account:RENIT_IDENTIFIER_LOCATE_BOX_ID')}</Text>
                                            </View> 
                                            <View style={{width:200, height:200, backgroundColor:'transparent',justifyContent:'center', marginLeft:0}}>
                                                <EtiquetteBox/>
                                            </View> 

                                            <View style={{marginTop:40, width:'100%'}}>
                                                <Button title={t("account:CONFIRM")} onPress={submitMe} titleColor="white"   bgColor={textColor} />
                                            </View>     
                                            <View style={{marginBottom:20}}></View> 

                                        </View>
                                    </ScrollView>                                  
                                </View>     

                                <View key="2">
                                    <ScrollView style={{flex:1,height:'100%'}}>
                                            <View style={styles.insideBlock}>
                                            <View style={{marginTop:16,marginBottom:32,padding:48,height:200,width:200,borderRadius:100,backgroundColor:'white',alignSelf:'center'}}>
                                                <MailSend/>    
                                            </View>            
                                            <H1 style={{color:textColor,}}>{t('account:MAIL_SEND')}</H1>
                                            <P  style={{color:textColor, textAlign:'center', fontSize:16, fontWeight:'400',marginTop:16}}>{t('account:MAIL_SEND_CODE')}</P>
                                            </View>
                                            <View style={{marginTop:40}}> 
                                                <RecoverAccountConfirmComponent goBack={handleBackPress} ref={confirmSubscribeRef} submit={confirmSubmit} bgColor={theme?.primary_2_darker}/>
                                                <Button title={t('account:SUBMIT_CODE_BUTTON')} onPress={submitMeConfirm}  bgColor={textColor}  titleColor="white" />    
                                            </View>
                                    </ScrollView>
                                </View>                
                            </PagerView>
                        </View>            
                    </KeyboardAvoidingView>
                </View>
            </View>
        </SafeAreaView>
       
       
         );
}

export default RecoverAccountScreen;

const styles = StyleSheet.create({
    insideBlock: {
      margin:10
     
    },
    viewPager : {
        flex:1
    },
    headerStyle:{
        justifyContent:'flex-end',
        alignItems:'stretch',
        borderBottomWidth:1,
        height:'18%',
        marginTop:-66,
        marginBottom:0,
      },
  });