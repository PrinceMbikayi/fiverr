import React from 'react';
import {useRef,useState,useEffect} from 'react';
import { View,Text,ScrollView,Pressable,SafeAreaView} from 'react-native';
import { useWindowDimensions} from 'react-native';
import styled,{ThemeProvider} from 'styled-components/native';

//-----------------------------------------------------

import { useTheme } from '_theming/themeProvider';
import { HeaderWithBack } from '_components/headers/header-with-back';

const TwoColorsBodyContainer = (props) => {

    const {headerTitle,lightStyle} = props;

    
    const {top = <Text>no Top</Text>,bottom =<Text>no Bottom</Text>} = props
    const { theme,baseColors} = useTheme();
    const {bgColor,notextColor,headerBackgroundColor,headerTextColor} = baseColors; 
    
    
    const textColor = lightStyle ? 'black' : 'white';
    const styledTheme = {'textColor':textColor};
    const lightBgColor = lightStyle ? "white" : null

    

    return (
        <ThemeProvider theme={styledTheme}>           
           <View style={{flex:1,backgroundColor:'black'}} >               
                <TopView>
                   {top}                   
                </TopView>          
                <View style={{flex:1}}>
                   {bottom}
                </View>               
            </View>
           
       </ThemeProvider>  
        
    )        
}

export default TwoColorsBodyContainer

const TopView = styled.View`
                    padding-top:48px;
                   min-height:120px;
                   background-color:white;
                   padding-bottom:32px;
                   border-bottom-left-radius:32px;
                   border-bottom-right-radius:32px;
                   padding-left:16px;
                   padding-right:16px; 
                   align-items:center; 
                `;