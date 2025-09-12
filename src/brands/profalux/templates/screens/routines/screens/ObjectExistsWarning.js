import '_brand/templates/screens/routines/locales'
import React, { useEffect, useRef } from 'react';
import { SafeAreaView, StyleSheet, View, Text, ScrollView, StatusBar } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useStore, useSelector } from "react-redux";
import { useTheme } from '_theming/themeProvider'

import { HeaderWithBack } from '_brand/templates/components/headers/header-with-back';
import Button from '_brand/templates/components/ui/Button';
import { RoutineAddForm } from '_brand/templates/screens/routines/components/RoutineAddForm';
//import { useScenarioContextSaveActionContext } from '_brand/templates/screens/routines/hook';
// import {useScenarioContextSaveActionContext} from '_brand/templates/screens/routines/hook/useScenarioContextSaveActionContext'
import {useScenario} from '_brand/templates/screens/routines/hook/useScenario'
import { getObjectsByNames } from '_helpers/selectors';
import { myToast } from '_brand/templates/components/ui/myToast';
import { getObjectById } from '_helpers/objects';
import { useObject } from '_hooks/object';




export const ObjectExistsWarning = (props)=>{

    const {itemId, onHide, article, bgColor="red", textColor="white", duration=3000} = props

    const uObject = useObject(itemId)
    const typeName = uObject?.objectDatas?.typeName
    console.log('CHECKKKKK :', uObject);

     
    const TYPENAME_TEXT = {
        "Venetian_Shutter_Ezsp":{text:"BSO_EXISTS"},
        "Rolling_Shutter_Ezsp":{text:"VOLET_EXISTS"},
        "Shade_Ezsp":{text:"STORE_EXISTS"},
        "Rolling_Shutter_Profalux":{text:"SOLAR_EQUIP_EXISTS"},
        "Garage_Door_Ezsp":{text:"GARAGE_DOOR_EXISTS"},
        "Garage_Door_Toggle_Ezsp":{text:"GARAGE_DOOR_EXISTS"},
        "Gate_Ezsp":{text:"GATE_EXISTS"},
        "Gate_Toggle_Ezsp":{text:"GATE_EXISTS"},
        "EzspProbe":{text:"PROBE_EXISTS"},
        "SwitchEzsp":{text:"SWITCH_EXISTS"},
        "LightEzsp":{text:"LIGHT_EXISTS"},
        "Associations":{text:"ROUTINE_EXISTS"},
        "NetatmoOutdoorProbe":{text:"PROBE_EXISTS"},
        "NetatmoRainGauge":{text:"PROBE_EXISTS"},
        "NetatmoStation":{text:"PROBE_EXISTS"},
        "NetatmoWindGauge":{text:"PROBE_EXISTS"},
        "Netatmo":{text:"PROBE_EXISTS"},
        "composite":{text:"COMPOSITE_EXISTS"},
        "application":{text:"OBJECT_EXISTS"},



    }

    const { t, i18n } = useTranslation();
    const tns = "routine";

    useEffect(()=> {
        const myText = TYPENAME_TEXT[typeName].text
        const myMessage = `${t(tns + ":" + myText)}`|| "OBJECT_EXISTS"    
        myToast(myMessage, bgColor, textColor, duration, onHide)
    },[]);

    return(
        <View>
        </View>
    )
}