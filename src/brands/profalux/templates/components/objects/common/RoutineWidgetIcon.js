import '_brand/templates/components/objects/common/locales'
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useObject } from '_hooks/object';
import { useTheme } from '_theming/themeProvider';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigation, useRoute } from '@react-navigation/native';

import { iconsJs } from '_brand/utils/iconsJs';
import {useScenario} from '_brand/templates/screens/routines/hook/useScenario'
import routineIconActionConfig from "_brand/templates/screens/routines/config/routineIconActionConfig"
import { RenderRoutineActionIcon } from '_brand/templates/components/objects/common/RenderRoutineActionIcon'; 



export const RoutineWidgetIcon = (props)=>{
    const {iconLable, itemId, iconSize, isLabelUp, withBorder, isRound} = props

    const uScenario = useScenario();
    const { actionsByItemId } = uScenario;

    const uObject = useObject(itemId);
    const typeName = uObject?.objectDatas?.typeName;

    const { t, i18n } = useTranslation();
    const tns = "routine";

    const { theme } = useTheme();
    const borderColor = theme?.prflxBorderColor || 'orange';
    const iconthemeColor = theme?.prflxIconColor || 'white';
    const textColor = theme?.prflxTextColor || 'black'
    const iconthemebgColor = 'white';

    console.log("ACTION_W :",actionsByItemId, itemId)
    //const newAction = `myActions_${id}`;
    const objectKeyPrefix = "myActions"
    const myKey = objectKeyPrefix + "_" + itemId;
    const myActions = actionsByItemId?.[myKey] || []

    useEffect(() => {
        console.log("ROUTINE WIDGET:", itemId, myActions)

    }, [myActions]);

    let content;


    const RenderQuestionMark = () =>{
        const actionSpec = "NOACTION"
        const configObject = routineIconActionConfig[typeName][actionSpec];
        let iconName = configObject?.iconName;
        console.log('CONFIG_OBJECT_routineIconActionConfig_1 :', configObject, iconName);
        const label = configObject?.label;
        return(
            <View style={{flexDirection:'row', alignItems:'center', justifyContent:'space-between'}}>
                <RenderRoutineActionIcon 
                    iconName = {iconName} iconSize ={iconSize}
                    label={label} isLabelUp={isLabelUp} withBorder={withBorder} borderColor={borderColor} 
                    textColor={"#bdb8b8"} itemId = {itemId}
                />

            </View>
        )
    }


    const RenderIconState = (value)=>{
        let content;
        const valueLength = value.length;
        if(valueLength == 0) content = RenderQuestionMark()

        for(let item of value ){

            const actionTitle = item.split("/").splice(0,1)
            const actionSpec = item.split("/").splice(0,2).join("/")
            const configObject = routineIconActionConfig[typeName][actionSpec];
            let iconName = configObject?.iconName;
            console.log('CONFIG_OBJECT_routineIconActionConfig_2 :', configObject, iconName);
            //const icon = iconsJs[configObject?.iconName]
            const label = configObject?.label || "Level state";
            const idForTest = actionSpec + "/" + itemId;
            console.log("Hello_:", actionSpec);
            const isActive = myActions.indexOf(idForTest) != -1
            console.log('MY_ACTION :', myActions);
            const id = item.split("/").pop()

            if(itemId == id){
                if(valueLength == 1){
                    console.log('RR_YY_1 :',actionTitle[0]);
                    content = (<View>
                                    <RenderRoutineActionIcon 
                                        iconName = {iconName} iconSize ={iconSize}
                                        label={label} isLabelUp={isLabelUp} withBorder={withBorder} borderColor={borderColor} 
                                        textColor={textColor} itemId = {itemId} isActive ={isActive} isTilt={actionTitle[0]}
                                    />
                                </View>
                    )
                }else{
                    for(let i of actionTitle){
                        // In case of two actions in same Equipment (BSO case), LEVEL IS PRIORITIZED // '\u00B0'
                        if(i == "TILT") continue; // We skip the TILT action in order to display the LEVEL or FAV
                        content = <RenderRoutineActionIcon 
                            iconName = {iconName} iconSize ={iconSize}
                            label={label} isLabelUp={isLabelUp} withBorder={withBorder} borderColor={borderColor} 
                            textColor={textColor} itemId = {itemId} isActive ={isActive}
                        />
                    }
                }
            }

        }//ehh

        return content
    }


    console.log('AA :', actionsByItemId);
    for (let key in actionsByItemId){
        const value = actionsByItemId[key]
        const id = Number(key.split("_").pop())
        console.log('AA :', value, id);
        if(itemId == id){
            content = RenderIconState(value)
        }

    }

    return(
        <View style={{}}>
            {content}
        </View>
    )
}