import '_brand/templates/components/objects/common/locales'
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useObject } from '_hooks/object';
import { useTheme } from '_theming/themeProvider';

import { iconsJs } from '_brand/utils/iconsJs';
import { MultiPurposeWidgetLine } from "_brand/templates/components/objects/common/MultiPurposeWidgetLine";
import { RoutineWidgetLine } from "_brand/templates/components/objects/common/RoutineWidgetLine";
import { RoutineWidgetIcon } from '_brand/templates/components/objects/common/RoutineWidgetIcon';

/**
 * Shutter Details content 
 * 
 * @param {Object} props
 * @param {number} props.itemId
 * @param {object} props.statuses
 * @param {UseObject} props.uObject
 * 
 */
export const GatesCommonRoutineWidget = (props) => {
    const { itemId, whichShutter } = props;
    const { t, i18n } = useTranslation();
    const tns = "common";
    const { theme } = useTheme();




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
    const gateName = uObject?.name;
    const status = uObject?.statuses?.status
    const traits = uObject?.objectDatas?.traits;
    const isObjectConnected = uObject?.connected;
    console.log("DISCONNECTED :", isObjectConnected)

    const typeNature = uObject?.statuses?.__user_typeNature;

    const [currentActive, setCurrentActive] = useState();
    const [stateIcon, setStateIcon] = useState([]);
    const [isBSO, setIsBSO] = useState(traits?.includes("Rotation"))
    const [isToggleMode, setIsToggleMode] = useState(!traits?.includes("Open")) // true => non toggle
    const [statusMsg, setStatusMsg] = useState("");

    console.log("STATUS ::::::: ", status)

    const icons = [
        iconsJs.upIcon,
        iconsJs.downIcon,
    ]

    function capitalizeFirstLetter(str) {

        // converting first letter to uppercase
        const capitalized = str.charAt(0).toUpperCase() + str.slice(1);

        return capitalized;
    }



    useEffect(() => {
        if (status == 'down' || status == 'closed') {
            setStateIcon([iconsJs.gateCloseIcon]);
            const msg = `${t(tns + ":" + "GATE_CLOSED")}`
            setStatusMsg(msg)
        } else if (status == 'up' || status == 'open') {
            setStateIcon([iconsJs.gateOpenIcon]);
            const msg = `${t(tns + ":" + "GATE_OPENED")}`
            setStatusMsg(msg)
        } else {
            setStateIcon([iconsJs.gateSomewhereIcon]);
            const msg = `${t(tns + ":" + "GATE_AJAR")}`
            setStatusMsg(msg)
        }


    }, [currentActive, statusMsg, status,]);


    useEffect(() => {

    }, [stateIcon])


    const handleIconPress = (iconId) => {
        console.log("Pressed : ", iconId);

        if (iconId == "OPEN/OPEN/"+`${itemId}`) {
            setCurrentActive(iconId);
            //uObject?.execute("ACTION",{mArgs:[{name:'level',value:10}]});
            uObject?.execute("OPEN");
        }

        if (iconId == "CLOSE/CLOSE/"+`${itemId}`) {
            setCurrentActive(iconId);
            uObject?.execute("CLOSE");
        }
    }
    const sendCurrentActive = (id) => {
        setActive(id);
    }

    const [actionActive, setActionActive] = useState(false)
    useEffect(() => {

    }, [actionActive])

    const handleActionPress = () => {
        uObject?.execute("ACTION");
        setActionActive(true)
        setTimeout(() => {
            setActionActive(false)
        }, 1000)
        console.log("Action Press");

    }

    const handleRoutinePress = () => {
        console.log("YUUUUPIIII")
    }

    const shadow = {
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.8,
        elevation: 8,
        shadowColor: '#000000',
    }

    const handlePress = ()=>{
        console.log("Tuile Pressed")
    }
    return (
        <Pressable disabled={true} onPress={handlePress} style={{ flex: 1, width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center', marginHorizontal: 0, borderRadius: 12, }}>

            <View style={{
                flex: 1, width: '100%', backgroundColor: 'transparent', flexDirection: 'row', alignItems: 'center',
                justifyContent: 'space-between', borderRadius: 12,
            }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginLeft: 10, backgroundColor: 'transparent' }}>

                    <View  
                        style={{ flexDirection: 'row', width:'38%',height:'100%', justifyContent: 'space-between', alignItems: 'center', 
                                marginLeft: 0, backgroundColor: 'transparent',
                            }}
                        >
                        <RoutineWidgetIcon itemId={itemId} iconSize={42} isLabelUp={true} withBorder={false}/>
                    </View>
                </View>

                <View style={{ backgroundColor: 'transparent', alignItems: 'center', width: '60%'}}>
                    <Text
                        style={{
                            alignItems: 'center', justifyContent: 'center', backgroundColor: 'transparent', marginBottom: 5, marginTop: 0,
                            fontSize: 14, fontWeight: "400", flexWrap: 'wrap', color: textColor
                        }}
                    >
                        {gateName}
                    </Text>
                        <>
                                <RoutineWidgetLine
                                    itemId={itemId}
                                    icons={icons}
                                    isPressable={true}
                                    onPress={handleRoutinePress}
                                    onLongPress={handleRoutinePress}
                                    iconWrapperStyle={[styles.iconDisplay, { borderColor: textColor }]}
                                    isShadow={true}
                                />
                            
                        </>
                </View>
            </View>

        </Pressable>
    )
}

const styles = StyleSheet.create({
    iconDisplay: {
        flexDirection: 'row',
        marginRight: 25,
        marginLeft: 20,
        marginTop: 5,
        marginBottom: 5,
        borderWidth: 1,
        borderRadius: 7,
        justifyContent: 'space-evenly'
        //backgroundColor:'white'
    },
    groupIconWrapper: {
        flexDirection: 'row',
        backgroundColor: 'transparent'
    },


})