import React from 'react';
import {Text, View, ScrollView, SafeAreaView, useWindowDimensions} from 'react-native';
import {useTranslation} from 'react-i18next';
//-----------------------------------------------------
import styled,{ThemeProvider} from 'styled-components/native';
import {H1, H2, H3,  P, VSeparator, H2_HTML_STYLE} from '_brand/templates/styled';

import ScanScreen  from '_src/brands/profalux/templates/components/objects/bluetoothPairing/wizard/screens/scan';
import { useNavigation,useRoute } from '@react-navigation/native';

//---- render HTML
import RenderHtml from 'react-native-render-html';
import { devicesConfig } from '_src/brands/profalux/templates/components/objects/bluetoothPairing/ble/devicesConfig';
import { HeaderScreen } from '_brand/templates/screens/addObject/components/HeaderScreen';
import { useTheme } from '_theming/themeProvider';

//const tns = "motor";
const tns = "addObject";
const htmlStyles = {"base":{fontSize:18,lineHeight:24}}

const Advice = () => {
    const {t} = useTranslation();
    const { width } = useWindowDimensions();
    const source = { html: '<p>'+t(tns+":"+'BLE_NOT_FOUND_HELP_MORE')+'</p>' };
     console.log("source ===>",source)
     const helpSource = { html: '<p>'+t(tns+":"+'BLE_NOT_FOUND_HELP')+'</p>' };

    console.log("source : ",source,H2_HTML_STYLE)
    return ( 
        <>
            {/*<H2>{t(tns+":"+'BLE_NOT_FOUND_HELP')}</H2>*/}
           
            <WarningWrapper>
                <RenderHtml contentWidth={width} source={source} baseStyle={{fontSize:18,lineHeight:24}}/>
            </WarningWrapper>
            <VSeparator/>
            <RenderHtml contentWidth={width} source={helpSource} baseStyle={{fontSize:18,lineHeight:24}}/>
           
           
            <VSeparator/>
            <View style={{height:220}}>
               <Text>Illustration !!!!!</Text>
            </View>
        </>
    )
}


    export const BoardgateScan = (props) => {
    
    const {goNext} = props;

    const { t, i18n } = useTranslation();
    const tns = "addObject";
    const { theme } = useTheme();
    const bgcolor = theme?.prflxbgColor || 'white';
    const textColor = theme?.prflxTextColor || 'black'
    
    const navigation = useNavigation();
    const route = useRoute();
    const navParams = route?.params || {}; 

    console.log("[BoardgateScan] -------------> navPArams",navParams)
    const allCharacteristics = navParams?.allCharacteristics || {};


    const onSelectDevice = (device) => {
        console.log("[BoardgateScan] onSelectDevice",device);
        console.log("[BoardgateScan] props",props);
        if (props.addProduct) {
            props.addProduct(device);
        }
        
        //navigation.navigate("BleEquipmentCreateOnServer", {device: device, allCharacteristics: allCharacteristics});
    }

        const handleBack = () => {
        navigation.navigate("garageDoorBleAssistantHomeScreen")
    }


    return (
        <View style={{  backgroundColor: bgcolor || "pink", paddingTop: 0,height: '100%' }}>
            <ScanScreen  allCharacteristics={devicesConfig} onSelectDevice={onSelectDevice}/> 
        </View>
        
    )
}


//export default BoardgateScan

const WarningWrapper = styled.View`
      background-color:${props => props.bgColor || "#FFF4EB"};
      border-radius:${props => props.radius || 16}px;
      padding : 16px;
      border-color:#E27A2E;
      border-width:2px;
     
`;