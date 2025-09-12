import React from 'react';
import { View,ScrollView,Pressable,SafeAreaView, StyleSheet, StatusBar} from 'react-native';
import {ThemeProvider} from 'styled-components/native';
import { useNavigation, useRoute } from '@react-navigation/native';

//-----------------------------------------------------

import { useTheme } from '_theming/themeProvider';
import { HeaderWithBack } from '_brand/templates/components/headers/header-with-back';

const ScreenContainer = (props) => {

    const {headerTitle} = props;
    const navigation = useNavigation();
    const { theme} = useTheme();
    
    
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

    const goBack = () => {

        navigation.goBack();
    }
    
    

    return (
            <SafeAreaView style={{height:'100%', backgroundColor:'white'}}>
                <StatusBar no_hidden={true} barStyle="dark-content"/>
                {/* <View style={{flex:1, backgroundColor:'red', justifyContent:'flex-end', alignItems:'flex-end'}}>

                </View> */}
            

            <View style={{flex:1, backgroundColor:'white',}}>
                <View   style={{backgroundColor:'transparent' || headerBgColor, alignItems:'center',justifyContent:'flex-end'}}>
                        <HeaderWithBack
                            //title={uObject.name}
                            title={headerTitle}
                            //titleMarginLeft = {40}
                            backSVG centered
                            goBack={{ goBack}}
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
    headerStyle:{
        justifyContent:'flex-end',
        borderBottomColor:'orange',
        borderBottomWidth:2,
        backgroundColor:"#FFFFFF",
        marginTop:-20,
        width:'100%'
      },
      bodyWrapper:{
        flex:1,
        flexDirection:'column',
        backgroundColor:'#EBF1F5',
        //padding:10,
      },
})