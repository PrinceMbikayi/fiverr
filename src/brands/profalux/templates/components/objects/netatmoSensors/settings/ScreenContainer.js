import React from 'react';
import { View,ScrollView,Pressable,SafeAreaView, StyleSheet, StatusBar} from 'react-native';
import {ThemeProvider} from 'styled-components/native';
import { useNavigation, useRoute } from '@react-navigation/native';

//-----------------------------------------------------

import { useTheme } from '_theming/themeProvider';
import { HeaderWithBack } from '_brand/templates/components/headers/header-with-back';




const ScreenContainer = (props) => {

    const {headerTitle, goBackSpec, noHeader=false} = props;
    const navigation = useNavigation();
    const { theme} = useTheme();
    
    
    const styledTheme = {'textColor':textColor};

    const borderColor = theme?.prflxBorderColor||'orange';
    const textColor = theme?.prflxTextColor||'black';
    const headerBgColor = theme?.prflxHeaderBackground || '#FFFFFF'


    const goBack = () => {

        navigation.goBack();
    }

    

    return (
            <SafeAreaView style={{height:'100%', backgroundColor:'white'}}>
                <StatusBar no_hidden={true} barStyle="dark-content"/>
            

            <View style={{flex:1, backgroundColor:'white',}}>
                {noHeader == false &&
                    <View style={{backgroundColor:'transparent' || headerBgColor, alignItems:'center',justifyContent:'flex-end'}}>
                            <HeaderWithBack
                                //title={uObject.name}
                                title={headerTitle}
                                //titleMarginLeft = {40}
                                backSVG centered
                                goBack={{goBack}}
                                noShadow
                            />
                    </View> 
                }
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
        paddingHorizontal:5,
        // paddingTop:0,
        // paddingBottom:10,
        //marginVertical:10,
        width:'100%',
      },
})