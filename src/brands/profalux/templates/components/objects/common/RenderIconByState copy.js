import React, { useState, useRef, useEffect } from "react";
import { View, Text, Pressable, Dimensions } from 'react-native';
import { useTheme } from '_theming/themeProvider';
import { iconsJs } from '_brand/utils/iconsJs';


export const RenderIconByState = (props) => {

    const { iconColor, iconSize, typeName, levelState} = props;
    console.log('TYPENAME_LEVEL_STATE :', typeName, levelState);

    let myTypeName = typeName ? typeName:"Rolling_Shutter_Ezsp";

    const ICON_BY_STATE = {
        "Venetian_Shutter_Ezsp":{open:"bsoOpenIcon", level25:"bsoLevel25Icon",level50:"bsoLevel50Icon", level75:"bsoLevel75Icon", close:"bsoCloseIcon", noLevel:"bsoLevel50Icon"},
        "Rolling_Shutter_Ezsp":{open:"vrOpenIcon", level25:"vrLevel25Icon",level50:"vrLevel50Icon", level75:"vrLevel75Icon", close:"vrCloseIcon", noLevel:"vrLevel50Icon"},
        "Shade_Ezsp":{open:"storeOpenIcon", level25:"store4Icon",level50:"store3Icon", level75:"store2Icon", close:"storeCloseIcon", noLevel:"store3Icon"},
        // "Shade_Ezsp":{open:"vrOpenIcon", level25:"vrLevel25Icon",level50:"vrLevel50Icon", level75:"vrLevel75Icon", close:"vrCloseIcon", noLevel:"vrLevel50Icon"},
        "Garage_Door_Ezsp":{open:"garageOpenIcon", someWhere:"garageSomewhereIcon",close:"garageCloseIcon"},
        "Garage_Door_Toggle_Ezsp":{open:"garageOpenIcon", someWhere:"garageSomewhereIcon",close:"garageCloseIcon"},
        "Gate_Ezsp":{open:"gateOpenIcon", someWhere:"gateSomewhereIcon",close:"gateCloseIcon"},
        "Garage_Door_Toggle_Ezsp":{open:"gateOpenIcon", someWhere:"gateSomewhereIcon",close:"gateCloseIcon"},
        "Rolling_Shutter_Profalux":"vr868Icon"
        // "Rolling_Shutter_Profalux":{
        //     "bso":"bso868Icon", 
        //     "store":"store868Icon", 
        //     "volet":"vr868Icon",
        // }
    }

    function range(start, end) {
        if (start === end) return [start];
        return [start, ...range(start + 1, end)];
    }


    const iconConfig = {
        "Venetian_Shutter_Ezsp":{'0-10':"bsoCloseIcon", '11-35':"bsoLevel25Icon", '36-65':"bsoLevel50Icon", '66-89':"bsoLevel75Icon", '90-100':"bsoOpenIcon",},
        "Rolling_Shutter_Ezsp":{'0-10':"vrCloseIcon", '11-35':"vrLevel25Icon", '36-65':"vrLevel50Icon", '66-89':"vrLevel75Icon", '90-100':"vrOpenIcon"},
        "Shade_Ezsp":{'0-10':"storeCloseIcon", '11-35':"store4Icon", '36-65':"store3Icon", '66-89':"store2Icon", '90-100':"storeOpenIcon"},
        "Garage_Door_Ezsp":{open:"garageOpenIcon", someWhere:"garageSomewhereIcon",close:"garageCloseIcon"},
        "Garage_Door_Toggle_Ezsp":{open:"garageOpenIcon", someWhere:"garageSomewhereIcon",close:"garageCloseIcon"},
        "Gate_Ezsp":{open:"gateOpenIcon", someWhere:"gateSomewhereIcon",close:"gateCloseIcon"},
        "Garage_Door_Toggle_Ezsp":{open:"gateOpenIcon", someWhere:"gateSomewhereIcon",close:"gateCloseIcon"},
        "Rolling_Shutter_Profalux":{'0-10':"vr868Icon", '11-35':"vr868Icon", '36-65':"vr868Icon", '66-89':"vr868Icon", '90-100':"vr868Icon"},
        "undefined":{'0-10':"vr868Icon", '11-35':"vr868Icon", '36-65':"vr868Icon", '66-89':"vr868Icon", '90-100':"vr868Icon"},
        // "Rolling_Shutter_Profalux":{
        //     "bso":"bso868Icon", 
        //     "store":"store868Icon", 
        //     "volet":"vr868Icon",
        // }
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

    console.log('TEST_GET_INTERVAL_ICON :', getIntervalIcon(101));

    const getIcon = (level, typeName)=>{
        let iconName
        const interval = getIntervalIcon(level);
        iconName = iconConfig[typeName][interval]
        return iconsJs[iconName]
    }

    // const getIcon = (levelState)=>{
    //     let level;
    //     let iconMode;
    //     let iconName;

    //     if(levelState <0){
    //         level = 0
    //     }else if(levelState >100){
    //         level = 100
    //     }else{level = levelState}
    //     const closeRange = range(0, 10);
    //     const level25Range = range(11, 35);
    //     const level50Range = range(36, 65);
    //     const level75Range = range(66, 89);
    //     const openRange = range(90, 100);

    //     if(closeRange?.includes(level)){
    //         iconMode = "close"
    //     }
    //     if(level25Range?.includes(level)){
    //         iconMode = "level25"
    //     }
    //     if(level50Range?.includes(level)){
    //         iconMode = "level50"
    //     }
    //     if(level75Range?.includes(level)){
    //         iconMode = "level75"
    //     }
    //     if(openRange?.includes(level)){
    //         iconMode = "open"
    //     }
    //     if(level == undefined){
    //         iconMode = "noLevel"
    //     }

    //     switch(myTypeName){
    //         case "Rolling_Shutter_Profalux":
    //             iconName = "vr868Icon";
    //             break;
    //         case undefined:
    //             iconName = "vr868Icon";
    //             break
    //         default:
    //             iconName = myTypeName ? ICON_BY_STATE[myTypeName][iconMode] : "vrOpenIcon"
    //         }

    //     console.log('ICON_BY_STATE :', iconName);
    //     return iconsJs[iconName]
    // }

    //const IconName = getIcon(levelState) 
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
