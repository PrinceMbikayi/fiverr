import React, { useState, useRef, useEffect } from "react";
import { View, Text, Pressable, Dimensions } from 'react-native';
import { useTheme } from '_theming/themeProvider';
import { iconsJs } from '_brand/utils/iconsJs';


export const RenderGroupIconByState = (props) => {

    const { iconColor, iconSize, groupId, groupTypeName, uniType, componentTypes, groupStatus} = props;
    let myGroupStatus = groupStatus || "up";
    let myGroupTypeName = groupTypeName || "heterogeneous";

    console.log('GROUP_PROPS :', props, myGroupStatus, myGroupTypeName);

    console.log('PROPS_RENDER_ICON_GROUP:', props);
    const getGroupNatureByComponentTypes = (componentTypes)=>{
        let classType;
        if(componentTypes.includes("LightEzsp") || componentTypes.includes("SwitchEzsp")){
            classType = "lightPlug"
        }else{
            classType = "shutters"
        }
        console.log('PROPS_RENDER_ICON_GROUP_1:', classType);
        return classType
    }

    const getGroupUniType = (groupTypeName, componentTypes)=>{
        let groupUniType;
        if(groupTypeName == "heterogeneous"){
            groupUniType = getGroupNatureByComponentTypes(componentTypes)
        }else{
            groupUniType = groupTypeName
        }
        console.log('PROPS_RENDER_ICON_GROUP_2:', groupUniType);
        return groupUniType
    }


    const groupTypeNameConfig = {
        "heterogeneous":{
            "lightPlug":{open:"groupLightOnIcon", close:"groupLightOffIcon", unknown:"groupLightOnIcon"},
            "shutters":{open:"groupShutterHeteroOpenIcon", close:"groupShuttersIcon", unknown:"groupShutterHeteroOpenIcon"},
            // garage:{open:"gateOpenIcon", someWhere:"gateSomewhereIcon",close:"gateCloseIcon"},
            // gate:{open:"gateOpenIcon", someWhere:"gateSomewhereIcon",close:"gateCloseIcon"},
        },
        "homogeneous":{
            "Venetian_Shutter_Ezsp":{open:"bsoOpenIcon", close:"bsoCloseIcon", unknown:"bsoLevel50Icon"},
            "Rolling_Shutter_Ezsp":{open:"vrOpenIcon", close:"vrCloseIcon", unknown:"vrLevel50Icon"},
            "Shade_Ezsp":{open:"storeOpenIcon",close:"storeCloseIcon", unknown:"store3Icon"},
            "Garage_Door_Ezsp":{open:"garageOpenIcon", unknown:"garageSomewhereIcon",close:"garageCloseIcon"},
            "Garage_Door_Toggle_Ezsp":{open:"garageOpenIcon", unknown:"garageSomewhereIcon",close:"garageCloseIcon"},
            "Gate_Ezsp":{open:"gateOpenIcon", unknown:"gateSomewhereIcon",close:"gateCloseIcon"},
            "Garage_Door_Toggle_Ezsp":{open:"gateOpenIcon", unknown:"gateSomewhereIcon",close:"gateCloseIcon"},
            "Rolling_Shutter_Profalux":{open:"vr868Icon",close:"vr868Icon", unknown:"vr868Icon"},
            "LightEzsp":{open:"lightOnIcon", close:"lightOffIcon", unknown:'lightOnIcon'},
            "SwitchEzsp":{open:"plugOnIcon", close:"plugOffIcon", unknown:"plugOnIcon"}
        }
    }
    const getIconMode = (groupStatus)=>{
        let iconMode;
        if(groupStatus == "up" || groupStatus =="on"){
            iconMode="open"
        }else if(groupStatus == "down" || groupStatus =="off"){
            iconMode = "close"
        }else if(groupStatus == undefined){
            iconMode = "unknown"
        }else{iconMode = "unknown"}
        return iconMode
    }

    const getIcon = (groupStatus, groupId)=>{
        const iconMode = getIconMode(groupStatus)
        let groupNature = myGroupTypeName == "heterogeneous" ? myGroupTypeName : "homogeneous" 

        const groupUniType = getGroupUniType(myGroupTypeName, componentTypes, uniType)
        console.log('ICON_STATE :',groupUniType,myGroupTypeName)
        const iconName = groupId ? groupTypeNameConfig[groupNature][groupUniType][iconMode] : "groupShutterHeteroOpenIcon"
        return iconsJs[iconName]
    }

    let iconName;

    iconName = getIcon(myGroupStatus, groupId) 
    console.log('ICON_BY_STATE_2 :',iconName);

    return (
        <View style={{width:iconSize, height:iconSize, marginLeft:10, backgroundColor:'transparent'}}>
            {groupId &&
                <iconName.name color={iconColor}/>
            }
        </View>
    )
}
