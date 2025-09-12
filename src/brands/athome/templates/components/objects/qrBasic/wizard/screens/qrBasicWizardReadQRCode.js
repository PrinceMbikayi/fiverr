import React from 'react';
import { View, SafeAreaView,ScrollView} from 'react-native';
import { useTranslation } from 'react-i18next';
import styled,{ThemeProvider} from 'styled-components/native';

//--------------------------------------------------
import { useTheme } from '_theming/themeProvider';
import {H1,P,VSeparator} from  '_brand/templates/styled'; 

// relative path below : doorkeeper got its own components folder
import Header from '../../components/ui/header';

import InfoCircle from '_brand/images/icons/app/InfoCircleR';

const QrBasicReadQRCodeScreenTemplate = (props) => {

    const {children,goBack} = props;
    const { t, i18n } = useTranslation();
    const { theme,baseColors} = useTheme();
    const {bgColor,textColor,headerBackgroundColor,headerTextColor} = baseColors;   
    const title = t("qrbasic:SCAN_PAGE_HEADER") || "";    
    //----------------------------------
    const bodyTextColor = textColor;
    const backgroundColor = 'white' || bgColor;
    const styledTheme = {'textColor':textColor};

    const showInfos = () => {
        console.log("demo")
    }


    //-----------------------------------
    return (
        <ThemeProvider theme={styledTheme}>
            <SafeAreaView style={{flex:1,backgroundColor:backgroundColor}}>            
            <Header title={title} goBack={goBack} noShadow bgColor="white" backSVG centered extraButtons={[{action:showInfos,svgr:<InfoCircle/>}]}/>        
            <Body style={{backgroundColor:'white'}}>  
                <View style={{width:'100%',aspectRatio:1,overflow:'hidden',backgroundColor:'black',alignItems:'center',justifyContent:'center'}}>      
                    {children}
                </View>
                <ScrollView style={{padding:16,paddingBottom:0,marginBottom:0}}>                
                    <H1>{t("qrbasic:SCAN_PAGE_TITLE")}</H1>
                    <VSeparator/>
                    <P>{t("qrbasic:SCAN_PAGE_BODY")}</P>
                </ScrollView> 
            </Body>        
        </SafeAreaView>
        </ThemeProvider>
    )                
}

export default QrBasicReadQRCodeScreenTemplate

const Body= styled.View`
    flex:1; 
`;