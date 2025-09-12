import React from 'react';
import { View,ScrollView,Pressable,SafeAreaView} from 'react-native';
import {ThemeProvider} from 'styled-components/native';

//-----------------------------------------------------

import { useTheme } from '_theming/themeProvider';
import { HeaderWithBack } from '_components/headers/header-with-back';

const ScreenContainer = (props) => {

    const {headerTitle,lightStyle} = props;
    
    const { theme,baseColors} = useTheme();
    const {bgColor,notextColor,headerBackgroundColor,headerTextColor} = baseColors; 
    
    
    const textColor = lightStyle ? 'black' : 'white';
    const styledTheme = {'textColor':textColor};
    const lightBgColor = lightStyle ? "white" : null

    return (
        <SafeAreaView style={{flex:1,backgroundColor:lightBgColor || theme.primary_2_darker || 'black' || theme['body-with-cards']}}>
            <View style={{minHeight:84}}>
                <HeaderWithBack backSVG color={textColor} centered title={headerTitle} noShadow bgColor="transparent" hideBurger /> 
            </View>           
            <ScrollView style={{padding:15,paddingTop:0,backgroundColor:"transparent",flex:1}}>     
                <ThemeProvider theme={styledTheme}>            
                    {props.children}      
                </ThemeProvider>
            </ScrollView> 
        </SafeAreaView>
        
    )        
}

export default ScreenContainer