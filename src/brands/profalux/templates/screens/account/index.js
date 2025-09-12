import '_brand/templates/screens/_locales'
import React, {useEffect,useState,useRef,useCallback} from 'react';
import { Text,View,Image,ScrollView,SafeAreaView, StatusBar} from 'react-native'; // use in styled components
import { useSelector,useDispatch } from 'react-redux';
import{getUser} from '_helpers/selectors';

import { useNavigation,useRoute,StackActions } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '_theming/themeProvider';

import { CardImageArrow } from '_brand/templates/screens/addObject/components/addBoxComponents/CardImageArrow';
import { HeaderWithBack } from '_brand/templates/components/headers/header-with-back';

//------- olivier --------------

import {H1, HR, P, VSeparator} from '_brand/templates/styled';
import DeleteAccountButton from './deleteAccountButtonProfalux';


export const AccountHome= (props) => {
   


    const dispatch = useDispatch();
    const { t, i18n } = useTranslation();
    const { theme,changeTheme,themeID,baseColors} = useTheme();
    const title = t("MENU_ACCOUNT");
    const userDetails = useSelector(state =>getUser(state));
    console.log("userDetails",userDetails);

  
    const borderColor = theme?.prflxBorderColor||'orange';
    const bgWhitecolor = theme?.prflxContaintBgColor||'white';
    const bgcolor = theme?.prflxbgColor||'white';
    const lineWidgetBgColor = theme?.prflxVerticalMultiIconsBgColor||"white";
    const textColor = theme?.prflxTextColor||'black'
    const headerBgColor = theme?.prflxHeaderBackground || 'white';


   const navigation = useNavigation();
   const route = useRoute();
   const navParams = route?.params || {}; 




    const goBack = () => {

        navigation.goBack();
    }

    const goChangeUserInfos = () => {
       
        navigation.navigate("PersonalInfos");
        //navigation.navigate("ReinitPassword");
       
    }
    const goLangSetting = () => {
        console.log("Changer la langue")
        //navigation.navigate("MeteoSettings");
    }
    const goMyBox = () => {
        navigation.navigate("MyGateways");
    }
    const goAbout = () => {
        navigation.navigate("About");
    }


    return (
        <SafeAreaView style={{height:'100%', backgroundColor:'white'}}>
            <StatusBar no_hidden={true} barStyle="dark-content"/>

            <View style={{flex:1, backgroundColor:'white',}}>
                <View style={{backgroundColor:'transparent' || headerBgColor, alignItems:'center',justifyContent:'flex-end'}}>
                        <HeaderWithBack
                        //title={uObject.name}
                        title={t("account:MY_ACCOUNT")}
                        backSVG centered
                        goBack={{ action: goBack }}
                        noShadow
                    />
                </View>
                {/* <HeaderScreen title = "Settings" goBack={()=>console.log("GOING BACK")}/> */}

                <View style={{flex:1, justifyContent:'flex-start', alignItems:'center', paddingHorizontal:10, paddingVertical:40,backgroundColor:bgcolor}}>
                    <CardImageArrow 
                        onPressNextArrow = {goChangeUserInfos}
                        withNextArrow = {true}
                        textDisplay = {t("account:PERSONAL_INFOS")}
                        textStyle={{marginLeft:40, paddingVertical:10}}
                    />
                    <CardImageArrow 
                        onPressNextArrow = {goMyBox}
                        withNextArrow = {true}
                        textDisplay = {t("account:MY_CALYPSHOME_BOX")}
                        textStyle={{marginLeft:40, paddingVertical:10}}
                    />
                    <CardImageArrow 
                        onPressNextArrow = {goAbout}
                        withNextArrow = {true}
                        textDisplay = {t("account:ABOUT")}
                        textStyle={{marginLeft:40, paddingVertical:10}}
                    />
                    {/* <CardImageArrow 
                        onPressNextArrow = {goLangSetting}
                        withNextArrow = {true}
                        textDisplay = {t("account:BATERY_STATE")}
                        textStyle={{marginLeft:40, paddingVertical:10}}
                    />
                    <CardImageArrow 
                        onPressNextArrow = {goWeatherWizard}
                        withNextArrow = {true}
                        textDisplay = {t("account:ADD_NEW_HOME")}
                        textStyle={{marginLeft:40, paddingVertical:10}}
                    /> */}
                     <HR style={{marginTop:48,marginBottom:16}}/>
                    <View style={{paddingHorizontal:0,width:"100%"}}>
                        <DeleteAccountButton />
                    </View>
                </View>
               
            </View>
       
        </SafeAreaView>
        )
}
