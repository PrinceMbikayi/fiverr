import "_brand/templates/screens/settings/locales"
import React from 'react';
import {useEffect} from 'react';
import { View ,SafeAreaView, StyleSheet, StatusBar} from 'react-native';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';

import { useTheme} from '_theming/themeProvider'
import { CardImageArrow } from '_brand/templates/screens/addObject/components/addBoxComponents/CardImageArrow';
import { HeaderWithBack } from '_brand/templates/components/headers/header-with-back';





const SettingsScreen = (props) => {
    const test="Test";

    const { t, i18n } = useTranslation();
    const tns = "settings";
    const {theme} = useTheme();
    const testColor = theme?.onBody||'yellow';
    const borderColor = theme?.prflxBorderColor||'orange';
    const bgWhitecolor = theme?.prflxContaintBgColor||'white';
    const bgcolor = theme?.prflxbgColor||'white';
    const lineWidgetBgColor = theme?.prflxVerticalMultiIconsBgColor||"white";
    const textColor = theme?.prflxTextColor||'black'
    const headerBgColor = theme?.prflxHeaderBackground || 'white';
   
    const navigation = useNavigation();
    const isTester = useSelector(state => state.user.isTester);


    const _goPassword = () => {
       
        navigation.navigate("UpdatePassword");
       
    }
    const goWeatherWizard = () => {
        navigation.navigate("MeteoSettings");
    }
    const goLangSetting = () => {
        console.log("Changer la langue")
        //navigation.navigate("MeteoSettings");
    }
    
    useEffect(()=> {
        // refresh on theme change
    },[theme])


    const goBack = () => {

        navigation.goBack();
    }

    return (
            <SafeAreaView style={{height:'100%', backgroundColor:'white'}}>
                <StatusBar no_hidden={true} barStyle="dark-content"/>
            
            <View style={{flex:5, backgroundColor:'white',}}>
                <View style={{backgroundColor:'transparent' || headerBgColor, alignItems:'center',justifyContent:'flex-end'}}>
                        <HeaderWithBack
                        //title={uObject.name}
                        title={t(tns + ":" + "SETTING_HEADER_TITLE")}
                        backSVG centered
                        goBack={{ action: goBack }}
                        noShadow
                    />
                </View>
                {/* <HeaderScreen title = "Settings" goBack={()=>console.log("GOING BACK")}/> */}

                <View style={{backgroundColor:bgcolor, flex:1, justifyContent:'flex-start', alignItems:'center', paddingHorizontal:10, paddingVertical:40}}>
                    {/* <CardImageArrow 
                        onPressNextArrow = {_goPassword}
                        withNextArrow = {true}
                        textDisplay = {t(tns + ":" + "CONFIG_WIFI")}
                        textStyle={{marginLeft:40, paddingVertical:10}}
                    /> */}
                    {/* <CardImageArrow 
                        onPressNextArrow = {goLangSetting}
                        withNextArrow = {true}
                        textDisplay = {t(tns + ":" + "LANGUAGE")}
                        textStyle={{marginLeft:40, paddingVertical:10}}
                    /> */}
                    <CardImageArrow 
                        onPressNextArrow = {goWeatherWizard}
                        withNextArrow = {true}
                        textDisplay = {t(tns + ":" + "WEATHER_SETTING")}
                        textStyle={{marginLeft:40, paddingVertical:10}}
                    />
                </View>
            </View>
            </SafeAreaView> 
   
)
    };

export default SettingsScreen;

const styles = StyleSheet.create({
    headerStyle:{
        justifyContent:'flex-end',
        alignItems:'stretch',
        height:'16%',
        marginTop:-60,
        //marginBottom:5,
      },
      bodyWrapper:{
        flexDirection:'column',
        padding:10,
      },
})