import React from 'react';
import { View,ScrollView,Pressable,SafeAreaView, StyleSheet} from 'react-native';
import {ThemeProvider} from 'styled-components/native';
import { useNavigation, useRoute } from '@react-navigation/native';

//-----------------------------------------------------

import { useTheme } from '_theming/themeProvider';
import { HeaderWithBack } from '_brand/templates/components/headers/header-with-back';

const ScreenContainer = (props) => {

    const {headerTitle, goBack} = props;
    const navigation = useNavigation();
    const { theme,baseColors} = useTheme();
    const {bgColor,notextColor,headerBackgroundColor,headerTextColor} = baseColors; 
    
    
    const styledTheme = {'textColor':textColor};

    const testColor = theme?.onBody||'yellow';
    const borderColor = theme?.prflxBorderColor||'orange';
    const containerBgcolor = theme?.prflxContaintBgColor||'white';
    const bgcolor = theme?.prflxbgColor||'white';
    const lineWidgetBgColor = theme?.prflxVerticalMultiIconsBgColor||"white";
    const textColor = theme?.prflxTextColor||'black';
    const headerBgColor = theme?.prflxHeaderBackground || '#FFFFFF'
    const iconColor = theme?.prflxIconColor || "#3E495E";
    const iconBgColor = theme?.prflxIconbgColor || "#FFFFFF";


    return (
        <SafeAreaView style={{height:'100%',backgroundColor:'#FFFFFF', justifyContent:'center',}}>

            <View style={{flex:1, backgroundColor:'white',}}>
                <View style={{backgroundColor:'transparent' || headerBgColor, alignItems:'center',justifyContent:'flex-end'}}>
                    <HeaderWithBack
                        //title={uObject.name}
                        title={headerTitle}
                        backSVG centered
                        goBack={goBack}
                        noShadow
                    />
                </View>        
                    <ScrollView style={styles.bodyWrapper}>     
                        <ThemeProvider theme={styledTheme}>            
                            {props.children}      
                        </ThemeProvider>
                    </ScrollView> 
            </View>
        </SafeAreaView>
        
    )        
}

export default ScreenContainer

const styles = StyleSheet.create({
      bodyWrapper:{
        flex:1,
        flexDirection:'column',
        backgroundColor:'#EBF1F5',
        padding:10,
      },
})