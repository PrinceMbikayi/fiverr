import '_brand/templates/components/objects/common/locales'
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useObject } from '_hooks/object';
import { useTheme } from '_theming/themeProvider';
import { useSelector } from 'react-redux';
import {  useRoute } from '@react-navigation/native';

import { iconsJs } from '_brand/utils/iconsJs';
import { MultiPurposeWidgetLine } from "_brand/templates/components/objects/common/MultiPurposeWidgetLine";
import {useScenario} from '_brand/templates/screens/routines/hook/useScenario'
import { RoutineWidgetLine } from "_brand/templates/components/objects/common/RoutineWidgetLine";

/**
 * Shutter Details content 
 * 
 * @param {Object} props
 * @param {number} props.itemId
 * @param {object} props.statuses
 * @param {UseObject} props.uObject
 * 
 */
export const HomoGroupShuttersRoutineWidget = (props) => {
    const { itemId, isScenario, sendScenarioAction } = props;
    console.log("PROPSSSSSSSSS ", props)


    const uScenario = useScenario();
    const { isRoutine, actionsByItemId } = uScenario;

    useEffect(() => {
        console.log("USE SCENARIO:", actionsByItemId)
    }, [actionsByItemId]);

    const route = useRoute();
    const routeName = route.name;
    const { t, i18n } = useTranslation();
    const tns = "common";
    const { theme } = useTheme();

    const gloIsConnected = useSelector(state => state?.network?.isConnected);
    const gloServerIsDown = useSelector(state => state?.network?.serverIsDown);
    const netInfoIsConnected = (gloIsConnected == true && gloServerIsDown == false);

    const textColor = theme?.prflxTextColor || 'black'

    console.log("PIXEL HAAA", itemId);
    const uObject = useObject(itemId);
    const typeName = uObject?.objectDatas?.typeName;
    console.log("TELL_ME_YOUR_TYPE_NAME :", typeName);
    console.log("SHUTTER ALL INFOS : ", uObject?.objectDatas?.connected);

    const connected = uObject?.objectDatas?.connected;
    // shutter level 
    const shutterLevel = uObject?.statuses?.level
    const shutterName = uObject?.name;
    const status = uObject?.statuses?.status
    const traits = uObject?.objectDatas?.traits;
    const isObjectConnected = uObject?.connected;
    console.log("CONNECTED :", isObjectConnected)

    const typeNature = uObject?.statuses?.__user_typeNature;

    const [currentActive, setCurrentActive] = useState();
    const [stateIcon, setStateIcon] = useState([]);
    const [isBSO, setIsBSO] = useState(traits?.includes("Rotation"))

    const [activeAction, setActiveAction] = useState("");

    const [sceneAction, setSceneAction] = useState("");






    let picto868;
    if (typeNature == "store") {
        picto868 = [iconsJs.store868Icon]
    } else if (typeNature == "bso") {
        picto868 = [iconsJs.bso868Icon]
    } else { picto868 = [iconsJs.vr868Icon] }

    let icons = [
            iconsJs.upIcon,
            iconsJs.downIcon,
            iconsJs.favIcon,

        ]

    function range(start, end) {
        if (start === end) return [start];
        return [start, ...range(start + 1, end)];
    }
    const openRange = range(90, 100);
    const levelRange75 = range(66, 89);
    const levelRange50 = range(36, 65);
    const levelRange25 = range(11, 35);
    const closeRange = range(0, 10);


    useEffect(() => {

    }, [activeAction]);


    useEffect(() => {
        console.log("CHECK IS ROUTINE :::::", isRoutine);
        //console.log("YOU ARE AT PAGE :::::", routeName);
    }, [isRoutine])
    useEffect(() => {
        console.log("WIDGET FOR SCENARIO :", isScenario, sceneAction)
    }, [sceneAction])

    useEffect(() => {
        const tempStatus = shutterLevel
        let statusLevel =  tempStatus != undefined ?  Number(tempStatus) : tempStatus;
        console.log('SHOW_STATUS :', statusLevel);

        if (status == "unknown") setStateIcon(picto868);
        if (closeRange?.includes(statusLevel)) {
            isBSO ? setStateIcon([iconsJs.bsoCloseIcon]) : setStateIcon([iconsJs.vrCloseIcon]);
        }

        if (openRange?.includes(statusLevel)) {
            isBSO ? setStateIcon([iconsJs.bsoOpenIcon]) : setStateIcon([iconsJs.vrOpenIcon]);
        }

        if (levelRange25?.includes(statusLevel)) {
            isBSO ? setStateIcon([iconsJs.bsoLevel25Icon]) : setStateIcon([iconsJs.vrLevel75Icon]);
        }

        if (levelRange50?.includes(statusLevel)) {
            isBSO ? setStateIcon([iconsJs.bsoLevel50Icon]) : setStateIcon([iconsJs.vrLevel50Icon]);
        }
        if (levelRange75?.includes(statusLevel)) {
            isBSO ? setStateIcon([iconsJs.bsoLevel75Icon]) : setStateIcon([iconsJs.vrLevel25Icon]);
        }
        if(statusLevel == undefined){
            isBSO ? setStateIcon([iconsJs.bsoLevel50Icon]) : setStateIcon([iconsJs.vrLevel50Icon]);
        }
    }, [currentActive, shutterLevel, isObjectConnected, status, typeNature]);


    const changeIconActiveState = (id, newValue) => {
        const updatedIsActive = {
            ...isActive,
            [id]: newValue,
        };

        setIsActive(updatedIsActive);
    };

    const handleIconPress = (iconId) => {

        console.log("Cas Routine ? :", isRoutine, iconId)
        if (iconId == 'OPEN/OPEN/' + `${itemId}`) {
            setCurrentActive(iconId);
            if (isRoutine == true) {
                console.log("JE SUIS PRESSE :", 'OPEN/OPEN/' + `${itemId}`)
            } else {
                uObject?.execute("OPEN");
                console.log("JE SUIS PRESSE :", 'OPEN/OPEN/' + `${itemId}`)
            }
        }
        if (iconId == 'STOP/STOP/' + `${itemId}`) {
            setCurrentActive(iconId);
            uObject?.execute("STOP");
        }
        if (iconId == 'CLOSE/CLOSE/' + `${itemId}`) {
            console.log("JE SUIS PRESSE FERMER:", iconId)
            setCurrentActive(iconId);
            if (isRoutine) {
            } else {
                uObject?.execute("CLOSE");
                console.log("JE SUIS PRESSE :", 'OPEN/OPEN/' + `${itemId}`)
            }

        }
        if (iconId == 'FAV_CALL_1/FAV_CALL_1/' + `${itemId}`) {
            console.log("favPos pressed")
            setCurrentActive(iconId);
            if (isRoutine) {
                console.log("JE SUIS PRESSE:", iconId)

            } else {
                uObject?.execute("FAV_CALL_1");
            }
        }
    }

    const sendCurrentActive = (id) => {
        setActive(id);
    }


    return (
        <Pressable disabled={true} onPress={() => console.log("Tuile Pressed")} style={{ justifyContent: 'center', alignItems: 'center', marginHorizontal: 0, borderRadius: 12, }}>

            <View style={{
                flex: 1, width: '100%', backgroundColor: 'transparent', marginVertical: 5, flexDirection: 'row', alignItems: 'center',
                justifyContent: 'space-between', borderRadius: 12,
            }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginLeft: 10, backgroundColor: 'transparent' }}>
                    <MultiPurposeWidgetLine
                        isPressable={false}
                        icons={(typeName === "Rolling_Shutter_Profalux") ? picto868 : stateIcon}
                        iconSize={48}
                        onPress={handleIconPress}
                        onLongPress={handleIconPress}
                        iconWrapperStyle={[{ borderColor: textColor }]}
                        iconGroupWrapperStyle={[{ alignItems: 'center', justifyContent: 'center', borderColor: 'transparent', borderWidth: 1, backgroundColor: 'transparent' }]}
                        isShadow={false}
                    />
                </View>

                <View style={{backgroundColor: 'transparent', width:'18%', height:'100%'}}></View>

                <View style={{ backgroundColor: 'transparent', alignItems: 'center', width: '60%', }}>
                    <Text
                        style={{
                            alignItems: 'center', justifyContent: 'center', backgroundColor: 'transparent', marginBottom: 5, marginTop: 0,
                            fontSize: 14, fontWeight: "400", flexWrap: 'wrap', color: textColor
                        }}
                    >
                        {shutterName}
                    </Text>
                    <RoutineWidgetLine
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
        marginLeft: 15,//5
        marginTop: 4,
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