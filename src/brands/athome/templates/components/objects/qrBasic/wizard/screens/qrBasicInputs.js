import React from 'react';
import {useContext,useState,useRef,useEffect} from 'react';

import { View,SafeAreaView,ScrollView,KeyboardAvoidingView} from 'react-native';

import { useTranslation } from 'react-i18next';
import { useNavigation,useRoute,StackActions } from '@react-navigation/native';
import styled,{ThemeProvider} from 'styled-components/native';


import { useTheme } from '_theming/themeProvider';
import {HeaderWithBack} from '_components/headers/header-with-back';
import {QrCodeSettingsForm} from '../../components/settings/form';

import {H1,P} from  '_brand/templates/styled'; 
import Button from '_brand/templates/components/ui/Button';
import InfoCircle from '_brand/images/icons/app/InfoCircleR';

import {Body,ViewerTitle,ViewerText,TextInput,Label} from '../../components/styled';

const QrPublicWizardInputsTemplateScreen = (props) => {

    const {onSubmit} = props;
    const isMounted = useRef(false)
    const { t, i18n } = useTranslation();
    const { theme,baseColors} = useTheme();
    const {textColor,headerBackgroundColor,headerTextColor} = baseColors;   
    const bgColor = "white";
   const navigation = useNavigation();
   const route = useRoute();
   const navigationParams = route?.params || {}; 
   
    const {itemId,update : isUpdate, productId : atHomeObjectType,deviceSn,deviceUid} = navigationParams || {}
   
    const [startInstallIndex, setStartInstallIndex] = useState(0);
    const [startInstallCurrentPageTitle,setStartInstallCurrentPageTitle] = useState(t("doorkeeper:SETUP_TITLE"));  
    const title = t("qrbasic:INPUTS_PAGE_HEADER");

    // DID MOUNT   
    useEffect(() => {
        isMounted.current = true;       
        if(isUpdate) {
                //   
        }
        // WILL UNMOUNT
        return () => (isMounted.current = false)
      }, []);

      
      const goBack = () => {       
        navigation.navigate('AddProduct')
      }
 
      const goBackStartPager = () => {
        setStartInstallIndex(startInstallIndex-1)
      }

    // Attention à la version wizard sans props goBack  
    
    const showInfos = () => {

    }

    const ScreenHeader = () => {
      
      const hTitle = (startInstallIndex == 0)? title : startInstallCurrentPageTitle; 
      const hGoback = (startInstallIndex == 0)? goBack : goBackStartPager;
       return  <View style={{height:84,alignItems:'center',justifyContent:'center'}}>
                        <HeaderWithBack backSVG title={hTitle} goBack={{action:hGoback}}
                           centered noShadow
                          extraButtons={[{action:showInfos,svgr:<InfoCircle/>}]} />
                    </View>      
    }  
    

    //------------------------------------------------
    const backgroundColor = bgColor
    // ----------------------------------
    const styledTheme = {'textColor':textColor};
    const [submitEnabled,setSubmitEnabled] = useState(false)


    useEffect(()=> {
      // updatePlease
    },[submitEnabled])

    const formRef = useRef(null);


    const submitForm = () => {
      formRef.current.submitForm();
    }


    return (
         <ThemeProvider theme={styledTheme}>
            <SafeAreaView style={{flex:1,backgroundColor:backgroundColor}}>            
              <ScreenHeader/>
             
              <ScrollView style={{paddingBottom:0,marginBottom:0}}> 
                <Body>
                  <H1 style={{marginBottom:8}}>{t("qrbasic:INPUTS_PAGE_TITLE")}</H1>
                  <P style={{marginBottom:16}}>{t("qrbasic:INPUTS_PAGE_BODY")}</P>
                  <QrCodeSettingsForm callback={onSubmit} buttonLabel={t("qrbasic:CONTINUE")} ref={formRef}/>
                  <View style={{height:8}}/>   
                  <Button title={t("account:REINIT_PASSWORD_SUBMIT")} onPress={submitForm}   bgColor={theme.primary_1_light}   />
                  <P style={{marginTop:16}}>{t("qrbasic:INPUTS_TRICK")}</P>                     
                </Body> 
                </ScrollView>                 
            </SafeAreaView>
          </ThemeProvider>
    )        
}

export default QrPublicWizardInputsTemplateScreen
