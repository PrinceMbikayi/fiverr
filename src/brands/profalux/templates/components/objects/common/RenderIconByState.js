import React, { useState, useRef, useEffect } from "react";
import { View, Text, Pressable, Dimensions } from 'react-native';
import { useTheme } from '_theming/themeProvider';
import { iconsJs } from '_brand/utils/iconsJs';


export const RenderIconByState = (props) => {

    const { iconColor, iconSize, typeName, levelState} = props;
    console.log('TYPENAME_LEVEL_STATE :', typeName, levelState);

    const iconConfig = {
        "Venetian_Shutter_Ezsp":{'0-10':"bsoCloseIcon", '11-35':"bsoLevel25Icon", '36-65':"bsoLevel50Icon", '66-89':"bsoLevel75Icon", '90-100':"bsoOpenIcon",},
        "Rolling_Shutter_Ezsp":{'0-10':"vrCloseIcon", '11-35':"vrLevel25Icon", '36-65':"vrLevel50Icon", '66-89':"vrLevel75Icon", '90-100':"vrOpenIcon"},
        "Shade_Ezsp":{'0-10':"storeCloseIcon", '11-35':"store4Icon", '36-65':"store3Icon", '66-89':"store2Icon", '90-100':"storeOpenIcon"},
        "Garage_Door_Ezsp":{open:"garageOpenIcon", someWhere:"garageSomewhereIcon",close:"garageCloseIcon"},
        "Garage_Door_Toggle_Ezsp":{open:"garageOpenIcon", someWhere:"garageSomewhereIcon",close:"garageCloseIcon"},
        "Gate_Ezsp":{open:"gateOpenIcon", someWhere:"gateSomewhereIcon",close:"gateCloseIcon"},
        "Garage_Door_Toggle_Ezsp":{open:"gateOpenIcon", someWhere:"gateSomewhereIcon",close:"gateCloseIcon"},
        "Rolling_Shutter_Profalux":{'0-10':"vr868Icon", '11-35':"vr868Icon", '36-65':"vr868Icon", '66-89':"vr868Icon", '90-100':"vr868Icon"},
        "undefined":{'0-10':"vrCloseIcon", '11-35':"vrLevel25Icon", '36-65':"vrLevel50Icon", '66-89':"vrLevel75Icon", '90-100':"vrOpenIcon"},
    };

    const getIntervalIcon = (number)=>{
        let level = number<= 0 ? 0 : number>=100 ? 100 : number;
        if (level >= 0 && level <= 10) return "0-10";
        if (level >= 11 && level <= 35) return "11-35";
        if (level >= 36 && level <= 65) return "36-65";
        if (level >= 66 && level <= 89) return "66-89";
        if (level >= 90 && level <= 100) return "90-100";
        if(level == undefined) return "36-65";
        
    }

    const getIcon = (level, typeName)=>{
        let iconName
        const interval = getIntervalIcon(level);
        console.log('LEVEL_YO :', interval);
        iconName = iconConfig[typeName][interval]
        return iconsJs[iconName]
    }

    const IconName = getIcon(levelState, typeName) 
    console.log('ICON_BY_STATE_2 :',IconName);
    return (
        <View style={{width:iconSize, height:iconSize, marginLeft:10, backgroundColor:'transparent'}}>
            {typeName &&
                <IconName.name color={iconColor}/>
            }
        </View>
    )
}
