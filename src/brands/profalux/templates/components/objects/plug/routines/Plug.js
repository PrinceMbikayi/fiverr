import React from 'react';
import { View, StyleSheet, Text} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '_theming/themeProvider';

import {LightPlugRoutine}  from '_brand/templates/components/objects/light/components/LightPlugRoutine';



export const Plug = (props) =>{

    const {itemId, bodyStyle, iconSize,isRoutine} = props;

    console.log("PROPS_PLUG :", props)

    const { t, i18n } = useTranslation();
    const tns = "rollingShutter";8
    const {theme} = useTheme();  

    const borderColor = theme?.prflxBorderColor||'orange';



  
    return(
        <View style={{backgroundColor:'transparent', borderColor:borderColor, borderRadius:10}}>
            <View>
               
                <LightPlugRoutine itemId = {itemId} iconSize = {40} isPlug isRoutine={isRoutine}/>
            </View>
        </View>
    );
}


const styles = StyleSheet.create({
    bodyWrapper:{
        flexDirection:'column',
        justifyContent:'flex-start',
        borderWidth:1, 
        borderRadius:12,
    },
    bodyStyle:{
        backgroundColor:'transparent',
        flex:1,flexDirection:'column',
        alignItems:'flex-start', 
        justifyContent:'flex-start',
    }
})
