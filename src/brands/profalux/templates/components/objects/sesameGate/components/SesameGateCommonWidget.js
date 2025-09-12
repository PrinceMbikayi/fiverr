import '_brand/templates/components/objects/common/locales'
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useObject } from '_hooks/object';
import { useTheme } from '_theming/themeProvider';

import { iconsJs } from '_brand/utils/iconsJs';
import { MultiPurposeWidgetLine } from "_brand/templates/components/objects/common/MultiPurposeWidgetLine";
import { RoutineWidgetLine } from "_brand/templates/components/objects/common/RoutineWidgetLine";
import {useScenario} from '_brand/templates/screens/routines/hook/useScenario'

/**
 * Shutter Details content 
 * 
 * @param {Object} props
 * @param {number} props.itemId
 * @param {object} props.statuses
 * @param {UseObject} props.uObject
 * 
 */
export const SesameGateCommonWidget = (props) => {
    const { itemId, whichShutter } = props;
    const { t, i18n } = useTranslation();
    const tns = "common";
    const { theme } = useTheme();


    const uScenario = useScenario();
    const { isRoutine, actionsByItemId } = uScenario;
    console.log("IS ROUTINE GATE:", uScenario)


    const borderColor = theme?.prflxBorderColor || 'orange';
    const bgcolor = theme?.prflxContaintBgColor || 'white';
    const lineWidgetBgColor = theme?.prflxVerticalMultiIconsBgColor || "white";
    const textColor = theme?.prflxTextColor || 'black'

    const uObject = useObject(itemId);
    const typeName = uObject?.objectDatas?.typeName;
    console.log("TELL ME YOUR TYPE NAME :", typeName);
    //.widgetReferenceDatas.statusDictionary
    console.log("SHUTTER ALL INFOS : ", uObject);
    // shutter level 
    const homeGateName = uObject?.name;
    const status = uObject?.statuses?.status
    const isObjectConnected = uObject?.connected;
    console.log("DISCONNECTED :", status)

    const typeNature = uObject?.statuses?.__user_typeNature;

    const [currentActive, setCurrentActive] = useState();
    const [stateIcon, setStateIcon] = useState([]);
    const [statusMsg, setStatusMsg] = useState("");

    console.log("STATUS ::::::: ", status)

    const icons = [
        iconsJs.upIcon,
        iconsJs.stopIcon,
       iconsJs.downIcon,
    ]


    useEffect(() => {
        if (status == 'down' || status == 'close') {
            setStateIcon([iconsJs.garageCloseIcon]);
            const msg = `${t(tns + ":" + "HOME_GATE_CLOSED")}`
            setStatusMsg(msg)
        } else if (status == 'up' || status == 'open') {
            setStateIcon([iconsJs.garageOpenIcon]);
            const msg = `${t(tns + ":" + "HOME_GATE_OPENED")}`
            setStatusMsg(msg)
        } else {
            setStateIcon([iconsJs.garageSomewhereIcon]);
            const msg = `${t(tns + ":" + "HOME_GATE_AJAR")}`
            setStatusMsg(msg)
        }


    }, [currentActive, statusMsg, status,]);


    useEffect(() => {

    }, [stateIcon])


    const handleIconPress = (iconId) => {
        console.log("Pressed : ", iconId);

        if (iconId == "OPEN/OPEN/"+`${itemId}`) {
            setCurrentActive(iconId);
            uObject?.execute("OPEN");
        }

        if (iconId == "CLOSE/CLOSE/"+`${itemId}`) {
            setCurrentActive(iconId);
            uObject?.execute("CLOSE");
            //uObject?.execute("CLOSE");
        }
        if (iconId == "STOP/STOP/"+`${itemId}`) {
            setCurrentActive(iconId);
            uObject?.execute("STOP");
        }
    }
    const sendCurrentActive = (id) => {
        setActive(id);
    }

    const [actionActive, setActionActive] = useState(false)
    useEffect(() => {

    }, [actionActive])


    const shadow = {
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.8,
        elevation: 8,
        shadowColor: '#000000',
    }

    return (
        <Pressable disabled={true} onPress={() => console.log("Tuile Pressed")} style={{ flex: 1, width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center', borderRadius: 12, }}>

            <View style={{
                flex: 1, width: '100%', backgroundColor: 'transparent', flexDirection: 'row', alignItems: 'center',
                justifyContent: 'space-between', borderRadius: 12,
            }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginLeft: 10, backgroundColor: 'transparent' }}>

                    <MultiPurposeWidgetLine
                        isPressable={false}
                        icons={stateIcon}
                        iconSize={48}
                        onPress={handleIconPress}
                        onLongPress={handleIconPress}
                        iconWrapperStyle={[{ borderColor: textColor }]}
                        iconGroupWrapperStyle={[{ alignItems: 'center', justifyContent: 'center', borderColor: 'transparent', borderWidth: 1, backgroundColor: 'transparent' }]}
                        isShadow={false}
                    />
                </View>
                <View style={{ flexDirection: 'column', marginHorizontal: 5, backgroundColor: 'transparent'}}>
                    <Text ellipsizeMode='tail' style={{ fontSize: 14, fontWeight: "400", color: textColor, flexWrap: 'nowrap', backgroundColor: 'transparent', textAlign: 'center', marginLeft:0 }}>
                        {statusMsg}
                    </Text>
                </View>
                <View style={{ backgroundColor: 'transparent', alignItems: 'center', width: '55%', }}>
                    <Text
                        style={{
                            alignItems: 'center', justifyContent: 'center', backgroundColor: 'transparent', marginBottom: 5, marginTop: 0,
                            fontSize: 14, fontWeight: "400", flexWrap: 'wrap', color: textColor
                        }}
                    >
                        {homeGateName}
                    </Text>
                        <MultiPurposeWidgetLine
                            itemId={itemId}
                            icons={icons}
                            isPressable={true}
                            onPress={handleIconPress}
                            onLongPress={handleIconPress}
                            active={sendCurrentActive}
                            iconWrapperStyle={[styles.iconDisplay, { borderColor: textColor }]}
                            isShadow={true}
                        />
                </View>
            </View>

        </Pressable>
    )
}

const styles = StyleSheet.create({
    iconDisplay: {
        flexDirection: 'row',
        marginRight: 0,
        marginLeft: 0,
        marginTop: 5,
        marginBottom: 5,
        borderWidth: 1,
        borderRadius: 7,
        justifyContent: 'space-evenly'
    },
    groupIconWrapper: {
        flexDirection: 'row',
        backgroundColor: 'transparent'
    },


})