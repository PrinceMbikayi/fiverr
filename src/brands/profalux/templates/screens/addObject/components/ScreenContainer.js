import React from 'react';
import { View,ScrollView,SafeAreaView, StyleSheet} from 'react-native';
import {ThemeProvider} from 'styled-components/native';

//-----------------------------------------------------

import { useTheme } from '_theming/themeProvider';
import { HeaderWithBack } from '_components/headers/header-with-back';

const ScreenContainer = (props) => {

    const {headerTitle} = props;
    
    const { theme,baseColors} = useTheme();
    const {bgColor,notextColor,headerBackgroundColor,headerTextColor} = baseColors; 
    
    
    const textColor = 'white';
    const styledTheme = {'textColor':textColor};
    

    return (
        <SafeAreaView style={{backgroundColor:'#FFFFFF'}}>
            <View style={styles.headerStyle}>
                <HeaderWithBack backSVG color='black' centered title={headerTitle} noShadow bgColor="transparent" hideBurger /> 
            </View>           
            <ScrollView style={styles.bodyWrapper}>     
                <ThemeProvider theme={styledTheme}>            
                    {props.children}      
                </ThemeProvider>
            </ScrollView> 
        </SafeAreaView>
        
    )        
}

export default ScreenContainer

const styles = StyleSheet.create({
    headerStyle:{
        justifyContent:'center',
        alignItems:'center',
        borderBottomColor:'orange',
        borderBottomWidth:2,
        height:'6%',
        backgroundColor:"transparent"
      },
      bodyWrapper:{
        flex:1,
        flexDirection:'column',
        backgroundColor:'#EBF1F5',
        padding:15,
        width:'100%'
      },
})