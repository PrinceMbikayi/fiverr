import React from 'react';
import {useContext,useState,useEffect} from 'react';
import { Text, View ,ScrollView,SafeAreaView} from 'react-native';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useNavigation,useFocusEffect } from '@react-navigation/native';

import { useTheme} from '_theming/themeProvider'
import { HeaderWithMenu } from '_components/headers/header-with-menu';
import { LineWithIcon} from '_components/ui/base/lineIcon';





const SettingsScreen = (props) => {
    const test="Test";

    const { t, i18n } = useTranslation();
    const {theme,baseColors} = useTheme();
   
    const navigation = useNavigation();
    const isTester = useSelector(state => state.user.isTester);

    
    /*
    useEffect(() => {
       
       if(loadedObjects) {
           //console.log("In useEffect loadedObjects",loadedObjects);
       }
        const didis = getObjectsVisible(objectsState,"all");       
        setObjectsArray(didis);
       
    }, [objectsArray,loadedObjects]);

    */
    
    const _goPassword = () => {
       
        navigation.navigate("UpdatePassword");
       
    }
    const _goWifi = () => {
        navigation.navigate("WifiAccessPoint");
    }


    const _goUdpAudit = () => {
        /*
        const pushAction = StackActions.push({
            routeName: 'UdpAutit'
        });
        navigation.dispatch(pushAction)
        */
        navigation.navigate("UdpAudit")
    }

    const _goBluetooth = () => {
        navigation.navigate("BlueToothScanHome");
    }




    //const bodyTextColor = theme['add_product_list_name_color'] || theme["onBody"];

   // const bodyTextColor = theme["onBody"];
    //console.log("bodyTextColor",bodyTextColor)

    const {bgColor,textColor,headerBackgroundColor,headerTextColor} = baseColors;
    const bodyTextColor = textColor;
    
    useEffect(()=> {
        // refresh on theme change
    },[theme])



    return (
        <SafeAreaView style={{flex:1,backgroundColor:theme['color--bg']}}>
            <HeaderWithMenu title={t('SCREEN_TITLE_SETTINGS')}/> 
            <View>
                <LineWithIcon rightChevron iconColor={bodyTextColor} color={bodyTextColor} textStyle = {{fontSize:22}} fullTouchable callback={_goPassword} text={t("Password")}/>
            </View>
            <View>
                <LineWithIcon rightChevron iconColor={bodyTextColor} color={bodyTextColor} textStyle = {{fontSize:22}} fullTouchable callback={_goWifi} text={t("addProduct:WIFI_CONFIGURATION")}/>
            </View>
            <View>
                <LineWithIcon rightChevron iconColor={bodyTextColor} color={bodyTextColor} textStyle = {{fontSize:22}} fullTouchable callback={_goBluetooth} text={"BlueTooth Devs"}/>
            </View>
            { isTester && 
            <View>
                <LineWithIcon rightChevron iconColor={bodyTextColor} color={bodyTextColor} textStyle = {{fontSize:22}} fullTouchable callback={_goUdpAudit} text={t("Audit")}/>
            </View>
            }
          
           
                     
        </SafeAreaView>   
   
)
    };

export default SettingsScreen;

const titleStyle = {}