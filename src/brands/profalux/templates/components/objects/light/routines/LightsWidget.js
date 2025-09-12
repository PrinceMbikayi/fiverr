import React, {useEffect} from 'react';
import { View,StyleSheet, Text} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '_theming/themeProvider';

import {LightPlugRoutine}  from '_brand/templates/components/objects/light/components/LightPlugRoutine';
import {useAppGlobal} from '_helpers/appGlobalProvider';
import {useScenario} from '_brand/templates/screens/routines/hook/useScenario'
import { RoutineWidgetLine } from "_brand/templates/components/objects/common/RoutineWidgetLine";


export const LightsWidget = (props) =>{

    const {itemId, bodyStyle, iconSize} = props;

    const { t, i18n } = useTranslation();
    const tns = "rollingShutter";8
    const {theme} = useTheme();  

    const borderColor = theme?.prflxBorderColor||'orange';

    const uScenario = useScenario();
    const { isRoutine, actionsByItemId } = uScenario;

    useEffect(()=> {
        console.log("USE SCENARIO:",actionsByItemId)
    },[actionsByItemId]);
  
    return(
        <View style={{backgroundColor:'transparent', borderColor:borderColor, borderRadius:10}}>
            <View>
                <LightPlugRoutine itemId = {itemId} iconSize = {40} isLight isRoutine={isRoutine}/>
            </View>
        </View>
    );
}
