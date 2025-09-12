import React from 'react';
import {useContext,useState,useRef,useEffect} from 'react';
import { View,SafeAreaView,ScrollView,Button,Image,Modal,ImageBackground} from 'react-native';
import { useSelector,useStore} from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useNavigation,useRoute,StackActions,CommonActions } from '@react-navigation/native';
import styled,{ThemeProvider} from 'styled-components/native';

import { AnimatedLoaderMaison } from '_assets/lotties/LoaderMaison';
import { AnimatedCheck } from '_assets/lotties/check';

import {refreshObjectAction} from '_actions/asyncActions'
import { useTheme } from '_theming/themeProvider';
import AccessButton from '_components/forms/accessButton';

import {Body,ViewerTitle,ViewerText,TextInput,Label,VSpacer} from '../../components/styled';



import { getObjectsByNames } from '_helpers/selectors';

const QrPublicWizardCompleteTemplateScreen = (props) => {


  console.log("QrPublicWizardCompleteTemplateScreen",props)

  const {currentStep,goToSelectProduct,goBack} = props

    const isMounted = useRef(false)
    const { t, i18n } = useTranslation();
    const { theme,baseColors} = useTheme();
    const {bgColor,textColor,headerBackgroundColor,headerTextColor} = baseColors;   
    
    const store = useStore()
    const navigation = useNavigation();
    const route = useRoute();
    const navigationParams = route?.params || {}; 

    const title = t("qrbasic:INPUTS_PAGE_HEADER");

    const allObjectNames = useSelector(getObjectsByNames);

    


    //------------------------------------------------
    const backgroundColor = 'red' || bgColor
    // ----------------------------------
    const styledTheme = {'textColor':textColor};
    
    const bodyTextColor = textColor;


    return (
         <ThemeProvider theme={styledTheme}>
            <SafeAreaView style={{flex:1,backgroundColor:backgroundColor}}>          
               {/*<ScreenHeader/>*/}
              
                <View style={{alignItems:'center',backgroundColor:'transparent',flex:1,alignItems:'center',justifyContent:'center'}}>
                {currentStep == 'upload' && 
                        <View style={{alignItems:'center'}}>
                          <ViewerTitle  centered> </ViewerTitle>
                          <VSpacer/> 
                          <AnimationWrapper size={200}>
                            <AnimatedLoaderMaison/>                           
                          </AnimationWrapper>                          
                          <VSpacer/>                  
                          <ViewerTitle></ViewerTitle>
                          <VSpacer/>                         
                      </View>
                    }
                    {currentStep == 'success' && 
                        <View style={{alignItems:'center'}}>
                          <ViewerTitle  centered> </ViewerTitle>
                          <VSpacer/> 
                          <AnimationWrapper size={200}>
                            <AnimatedCheck loop={false}/>                           
                          </AnimationWrapper>                          
                          <VSpacer/>                  
                          <ViewerTitle>{t("qrbasic:CREATION_COMPLETE_TITLE")}</ViewerTitle>
                          <VSpacer/> 
                          <AccessButton  onPress={goToSelectProduct} specialColor={bodyTextColor} centered title={t("addProduct:PAIRING_COMPLETED").toUpperCase()}/>                        
                      </View>
                    }                                
                </View> 
                          
            </SafeAreaView>
          </ThemeProvider>
    )        
}

export default QrPublicWizardCompleteTemplateScreen



const AnimationWrapper = styled.View`
      background-color:${props => props.bgColor || "white"};
      border-radius:${props => props.size/2}px;
      height:${props => props.size}px;
      width:${props => props.size}px;
      align-items:center;
      justify-content:center;
`;