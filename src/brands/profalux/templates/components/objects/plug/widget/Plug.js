import React, { useEffect, useState } from 'react';
import { View, StyleSheet} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '_theming/themeProvider';

import { LightPlugWidget } from '_brand/templates/components/objects/light/components/LightPlugWidget';
import { PlugDetails } from '_brand/templates/components/objects/plug/widget/PlugDetails';
import {useScenario} from '_brand/templates/screens/routines/hook/useScenario'



export const Plug = (props) =>{

    const {itemId, bodyStyle, iconSize,isRoutine} = props;

    console.log("PROPS_PLUG :", props)

    const { t, i18n } = useTranslation();
    const tns = "rollingShutter";8
    const {theme} = useTheme();  

    const borderColor = theme?.prflxBorderColor||'orange';

    const uScenario = useScenario();
    const { actionsByItemId } = uScenario;

    useEffect(()=> {
        console.log("USE SCENARIO:",actionsByItemId)
    },[actionsByItemId]);


  
    return(
        <View style={{backgroundColor:'transparent', borderColor:borderColor, borderRadius:10}}>
            <View>
                {/* <PlugDetails itemId = {itemId} iconSize = {52} bodyStyle={styles.bodyStyle}/> */}
                <LightPlugWidget itemId = {itemId} iconSize = {40} isPlug isRoutine={isRoutine}/>
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
