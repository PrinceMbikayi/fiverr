import React from 'react';
import {useContext,useState,useEffect} from 'react';
import { Text, View,ScrollView,SafeAreaView,TouchableHighlight } from 'react-native';
import { useSelector} from "react-redux";
import { useNavigation,useRoute,StackActions } from '@react-navigation/native';
import { TransitionPresets } from '@react-navigation/stack';
import { useTranslation } from 'react-i18next';

import TypeDynamicSettings from '_components/objects/@dynamics/indexSettings';
import {HeaderWithBack} from '_components/headers/header-with-back';
import { useTheme } from '_theming/themeProvider';
import { getObjectById } from '_helpers/selectors';

export const ProductSettingsScreen = () => {
     
    
    const navigation = useNavigation();
    const route = useRoute();
    const navigationParams = route?.params || {}; 
    const {itemId} =  navigationParams;


    const { t, i18n } = useTranslation();   
    const {theme,baseColors} = useTheme();
    const {bgColor,textColor,headerBackgroundColor,headerTextColor} = baseColors;
       
    const objectDatas = useSelector(state => getObjectById(state,itemId));
   
    let type = objectDatas.typeName;
    const typeArg = navigationParams?.type

    if(typeArg)type = typeArg;
    if(objectDatas.typeName == 'composite' && objectDatas.uniType != undefined)type = objectDatas.uniType; 
    let newIcon = objectDatas.img;
    
    useEffect(() => {
       
    }, []);
  
    const goBack = () => {       
        navigation.goBack();
    }

    const noHeader = ['AirConditionerAirwell'];
    const noScrollViewWrap = ['AirConditionerAirwell'];

    

    const getHeader = () => {
       
        if(noHeader.indexOf(objectDatas.typeName) != -1) {
            return null
        } else {
            
            return  <View style={{minHeight:84,alignItems:'center',justifyContent:'flex-start'}}>
                        <HeaderWithBack title={t("SCREEN_TITLE_SETTINGS")} themeDependency/>
                    </View>
        }
    }

    const _backgroundColor = bgColor || theme["details_body_color"] || theme["card--color--bodybg"];

    const getBody = () => {
        console.log("getBody",type)
       return (
            <ScrollView style={{'backgroundColor':_backgroundColor}}> 
                <TypeDynamicSettings className={objectDatas.className} itemId = {itemId} newIcon={newIcon} typeName={type}/> 
            </ScrollView>  
       )  
    }

    

    return (
        <SafeAreaView style={{flex:1,'backgroundColor':_backgroundColor}}>
            {
                getHeader()
            }
            {
                 getBody()
            }
                           
        </SafeAreaView>  
    );
}

ProductSettingsScreen.navigationOptions = {
   
    headerShown: false,
    headerMode:'screen',
    gestureEnabled: false,   
    ...TransitionPresets.SlideFromRightIOS
  }

