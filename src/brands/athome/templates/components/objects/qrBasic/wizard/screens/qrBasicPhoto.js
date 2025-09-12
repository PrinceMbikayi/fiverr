import "../../locales";
import React from 'react';
import {useState,useRef,useEffect} from 'react';
import { View,SafeAreaView,ScrollView} from 'react-native';

import { useTranslation } from 'react-i18next';
import { useNavigation,useRoute} from '@react-navigation/native';
import styled,{ThemeProvider} from 'styled-components/native';

//----------------------------------------------------------------------
import { useTheme } from '_theming/themeProvider';
import {HeaderWithBack} from '_components/headers/header-with-back';
import AccessButton from '_components/forms/accessButton';
import { SettingsButton } from '../../components/settingsButton';
import {Body,ViewerTitle,ViewerText,VSpacer} from '../../components/styled';

import {H1,P} from  '_brand/templates/styled'; 
import Button from '_brand/templates/components/ui/Button';
import InfoCircle from '_brand/images/icons/app/InfoCircleR';


const QrPublicWizardPhotoTemplateScreen = (props) => {


    const defaultImage = require("../../assets/default-image.png");

    const {children,imageSource = defaultImage,onOpenSelect,onContinue} = props;
    const isMounted = useRef(false)
    const { t, i18n } = useTranslation();
    const { theme,baseColors} = useTheme();
    const {bgColor,textColor,headerBackgroundColor,headerTextColor} = baseColors;   
    
   const navigation = useNavigation();
   const route = useRoute();
   const navigationParams = route?.params || {};    
   const {name,extra} = navigationParams || {}
 
    const title = t("qrbasic:PHOTO_PAGE_HEADER");
    // DID MOUNT
    // exemple mount / unmount fonctional component
    useEffect(() => {
        isMounted.current = true;       
       
        // WILL UNMOUNT
        return () => (isMounted.current = false)
      }, []);

      const goBack = () => {       
        navigation.goBack();
      }     

const showInfos = () => {
  //
}

    // Attention à la version wizard sans props goBack   

    const ScreenHeader = () => {
      
      const hTitle =  title; 
      const hGoback = goBack;
       return  <View style={{height:84,alignItems:'center',justifyContent:'center'}}>
                        <HeaderWithBack title={hTitle} goBack={{action:hGoback}}  backSVG centered noShadow
                          extraButtons={[{action:showInfos,svgr:<InfoCircle/>}]} bgColor="transparent"/>
                    </View>       
    }
    
    

    //------------------------------------------------
    const backgroundColor = bgColor
    // ----------------------------------
    const styledTheme = {'textColor':textColor};
   
    


    useEffect(()=> {
     // just refresh
    },[imageSource]);

   
    const gloglo = () => {
      console.log("gloglo !!")
    }
   
    
    // ------------------------


    

    return (
         <ThemeProvider theme={styledTheme}>
            <SafeAreaView style={{flex:1,backgroundColor:'white' || backgroundColor}}>            
              <ScreenHeader/>
             {children}            
              <ScrollView style={{paddingBottom:0,marginBottom:0}}> 
                <Body>
                  <H1 style={{marginBottom:8}}>{t("qrbasic:ADD_PHOTO_SCREEN_TITLE")}</H1>
                  <P style={{alignSelf:'flex-start',marginBottom:16}}>{t("qrbasic:ADD_PHOTO_SCREEN_BODY")}</P>
                  <View style={{width:'100%',maxWidth:375,aspectRatio:1, backgroundColor:"pink"}}>                 
                        <ImageBackgroundStyled source={imageSource} style={{ width: '100%', aspectRatio:1 }}>  
                            <SettingsButton bgColor="white" appIcon={true}  zIndex={4} callback={onOpenSelect}/>
                        </ImageBackgroundStyled>                  
                     <VSpacer/>                                                     
                  </View>
                  <VSpacer/>  
                  <Button title={t("qrbasic:CONTINUE")} onPress={onContinue}   bgColor={theme.primary_1_light} />       
                </Body> 
               
                </ScrollView>
            </SafeAreaView>
          </ThemeProvider>
    )        
}

export default QrPublicWizardPhotoTemplateScreen

const ImageBackgroundStyled = styled.ImageBackground`
           
            align-items:center;
            justify-content:center;

`;