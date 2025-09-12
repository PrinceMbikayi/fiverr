import '_brand/templates/components/objects/common/locales'
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useObject } from '_hooks/object';
import { useTheme } from '_theming/themeProvider';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigation, useRoute } from '@react-navigation/native';

import { iconsJs } from '_brand/utils/iconsJs';
import { MultiPurposeWidgetLine } from "_brand/templates/components/objects/common/MultiPurposeWidgetLine";
import { EcoShuttersActionsIcons } from "_brand/templates/screens/routines/screens/applicationScreen/components/EcoShuttersActionsIcons";
import { RoutineWidgetLine } from "_brand/templates/components/objects/common/RoutineWidgetLine";
import {useScenario} from '_brand/templates/screens/routines/hook/useScenario'
import { RoutineWidgetIcon } from '_brand/templates/components/objects/common/RoutineWidgetIcon';
import { EcoConfortWidgetIcon } from '_brand/templates/screens/routines/screens/applicationScreen/components/EcoConfortWidgetIcon';
import RightChevron from '_brand/images/icons/app/profaluxIconJs/RightChevron';
import { useEcoConfort } from '_brand/templates/screens/routines/hook/useEcoConfort'

/**
 * Shutter Details content 
 * 
 * @param {Object} props
 * @param {number} props.itemId
 * @param {object} props.statuses
 * @param {UseObject} props.uObject
 * 
 */
export const EcoConfortCommonShutterWidget = (props) => {
    const { itemId, typeName, callBack } = props;

    const uEcoConfort = useEcoConfort();
    const { 
            ecoConfSelectedAction, setEcoConfSelectedAction
        } = uEcoConfort;

    console.log("SELECTED_ECO_ACTION :", ecoConfSelectedAction)
    console.log('FIRST_FIRST :', itemId, typeName);

    const navigation = useNavigation();
    const route = useRoute();
    
    const { t, i18n } = useTranslation();
    const tns = "common";
    const { theme } = useTheme();
    const textColor = theme?.prflxTextColor || 'black'

    let  icons = [
        iconsJs.upIcon,
        iconsJs.downIcon,
        iconsJs.hemstitchIcon,
        iconsJs.favIcon,

    ]

    const nameConfig = {
        "Rolling_Shutter_Ezsp": "VR",
        "Venetian_Shutter_Ezsp": "BSO",
        "Shade_Ezsp": "Store",
    }

    const handleIconPress = (iconId) => {
       console.log("SELECTED_ECO_ACTION :", "Clicked :",  iconId, "Updated :", ecoConfSelectedAction)
       callBack(iconId)
    }

    // const sendCurrentActive = (id) => {
    //     setActive(id);
    // }

    const goDetail = ()=>{
        console.log('GO_LEVEL_2 :', itemId);
        navigation.navigate("EcoConfortCommonShutterDetails",{itemId:itemId, typeName:typeName}) 
    }

    return (
        <View 
            style={{flex:1,height:80,padding:0, flexDirection:'row', justifyContent:'center', marginBottom:10,
            alignItems:'center', backgroundColor:'white', borderRadius:12, borderWidth:1, borderColor:'orange'}}
            >
            <View style={{width:'40%',paddingLeft:10, height:'100%', backgroundColor:'transparent', justifyContent:'center'}}>
                <EcoConfortWidgetIcon itemId={itemId} typeName={typeName} iconSize={48} isLabelUp={true} withBorder={true} marginRight={10}/>
            </View>

            <View style={{width:'55%', height:'100%', backgroundColor:'transparent', justifyContent:'center', alignItems:'center'}}>
                <View>
                    <Text
                        style={{
                            alignItems: 'center', justifyContent: 'center', backgroundColor: 'transparent', marginBottom: 5,
                            fontSize: 14, fontWeight: "400", flexWrap: 'wrap', color: textColor
                        }}
                        >
                       {/* {nameConfig[typeName]} */}
                    </Text>
                </View>
                <EcoShuttersActionsIcons
                    itemId={itemId}
                    typeName={typeName}
                    icons={icons}
                    iconSize={38}
                    isPressable={true}
                    onPress={handleIconPress}
                    onLongPress={handleIconPress}
                    //active={sendCurrentActive}
                    iconWrapperStyle={[styles.iconDisplay, { borderColor: textColor }]}
                    isShadow={true}
                />
            </View>

            {/* <TouchableOpacity 
                onPress={goDetail}
                style={{width:'10%', height:'100%', backgroundColor:'transparent', paddingRight:5, opacity:0.5, justifyContent:'center', alignItems:'flex-end'  
                }}>
                <View style={{width:25, height:25}}>
                    <RightChevron color={textColor}/>   
                </View>
            </TouchableOpacity> */}

        </View>
    )
}

const styles = StyleSheet.create({
    iconDisplay: {
        flexDirection: 'row',
        marginLeft: 5,
        marginTop: 4,
        marginBottom: 5,
        borderWidth: 1,
        borderRadius: 7,
        justifyContent: 'space-evenly'
    },
    groupIconWrapper: {
        flexDirection: 'row',
        borderRadius:12,
        backgroundColor: 'transparent'
    },
})