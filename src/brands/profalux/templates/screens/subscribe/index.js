import '_brand/templates/screens/_locales'
import React,{ useState,useRef, useEffect} from 'react';
import {SafeAreaView, KeyboardAvoidingView,View,Text,StyleSheet,TouchableWithoutFeedback, Image, Pressable} from 'react-native';

import PagerView from 'react-native-pager-view';

import { useTranslation } from 'react-i18next';

import { useTheme } from '_theming/themeProvider';
import {H1,P} from '../../styled';
import Button from '_brand/templates/components/ui/Button';
import SubscribeComponent from '_brand/templates/screens/subscribe/subscribeComponent';
import SubscribeConfirmComponent from '_brand/templates/components/forms/subscribeConfirmComponent';
import { HeaderWithBack } from '_brand/templates/components/headers/header-with-back';
import { MultiPurposeWidgetLine } from '_brand/templates/components/objects/common/MultiPurposeWidgetLine';
import { iconsJs } from '_brand/utils/iconsJs';
import { useNavigation,useRoute} from '@react-navigation/native';


//--- icons ------
import MailSend from '_brand/images/illustrations/MailSend'

//--- Appium -----
import {buildTestId} from '_helpers/appium';
import { ScrollView } from 'react-native-gesture-handler';

// Function component start Here

const SubscribeScreen = (props) => {    
  
    const { t, i18n } = useTranslation();    
    const {theme} = useTheme()
    const navigation = useNavigation()
    const {serverError,isConnected,oAuth} = props;

    console.log('APP_PREVIOUS_ROUTE_SUBSCRIBE :', navigation.getState()?.routes);
    
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
        move("Subscribe") // // Oui je fais un move vers Subscribe : cependant ce Subscribe appelle Login haaaa !!! really Bad staff
        //A corriger absolument!!!
        //move("Login") // before
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
        
            <View style={{flex:1,backgroundColor:bgcolor,padding:20}}>
                <KeyboardAvoidingView
                        behavior={Platform.OS === "ios" ? "height" : "height"}
                        style={{flex:1}}
                        >                
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
                    </View>
                    <View style={{flex:1,backgroundColor:bgcolor}}>
                        <PagerView 
                            style={styles.viewPager} 
                            initialPage={pageIndex} 
                            scrollEnabled={false} 
                            ref={myViewPager}>
                            <View key="1">
                                <View style={{marginTop:69}}>
                                    <TouchableWithoutFeedback  onPress={onSelectServerTap} {...logoTest}style={{flex:1}} >   
                                        <Text style={{fontSize:16, fontWeight:'400', textAlign:'center', marginBottom:15}}>{t('account:CREATE_ACCOUNT_TITLE')}</Text>
                                    </TouchableWithoutFeedback>
                                </View> 
                                <ScrollView style={{flex:1,height:'100%'}}>
                                    <View>
                                        <SubscribeComponent goBack={goBack} submit={submit} ref={subscribeRef} bgColor={theme?.primary_2_darker} submitMe={submitMe}/>
                                    </View>
                                    <View style={{marginBottom:20}}></View> 
                                </ScrollView>                                  
                            </View>     

                            <View key="2">
                                <ScrollView showsVerticalScrollIndicator={false} style={{flex:1,height:'100%'}}>
                                        <View style={styles.insideBlock}>
                                        <View style={{marginTop:16,marginBottom:32,padding:48,height:200,width:200,borderRadius:100,backgroundColor:'white',alignSelf:'center'}}>
                                            <MailSend/>    
                                        </View>            
                                        <H1 style={{color:textColor,}}>{t('account:MAIL_SEND')}</H1>
                                        <P  style={{color:textColor, textAlign:'center', fontSize:16, fontWeight:'400',marginTop:16}}>{t('account:MAIL_SEND_CODE')}</P>
                                        </View>
                                        <View style={{marginTop:40}}> 
                                            <SubscribeConfirmComponent goBack={handleBackPress} ref={confirmSubscribeRef} submit={confirmSubmit} bgColor={theme?.primary_2_darker}/>
                                            <Button title={t('account:SUBMIT_CODE_BUTTON')} onPress={submitMeConfirm}  bgColor={textColor}  titleColor="white" />    
                                        </View>
                                        <View style={{height:50, width:'100%'}}/>
                                </ScrollView>
                            </View>                
                        </PagerView>
                    </View>            
                </KeyboardAvoidingView>
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