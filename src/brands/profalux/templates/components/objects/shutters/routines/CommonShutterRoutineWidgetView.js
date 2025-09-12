import '_brand/templates/components/objects/common/locales'
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useObject } from '_hooks/object';
import { useTheme } from '_theming/themeProvider';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigation, useRoute } from '@react-navigation/native';

import { iconsJs } from '_brand/utils/iconsJs';
import { MultiPurposeWidgetLine } from "_brand/templates/components/objects/common/MultiPurposeWidgetLine";
import { RoutineWidgetLine } from "_brand/templates/components/objects/common/RoutineWidgetLine";
import {useScenario} from '_brand/templates/screens/routines/hook/useScenario'
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
export const CommonShutterRoutineWidgetView = (props) => {
    const { itemId, isScenario } = props;


    const uScenario = useScenario();
    const { isRoutine, actionsByItemId, selectedAction } = uScenario;

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

    const uObject = useObject(itemId);
    const typeName = uObject?.objectDatas?.typeName;

    const connected = uObject?.objectDatas?.connected;
    // shutter level 
    const shutterLevel = uObject?.statuses?.level
    const shutterName = uObject?.name;
    const status = uObject?.statuses?.status
    const traits = uObject?.objectDatas?.traits;
    const isObjectConnected = uObject?.connected;
    console.log("DISCONNECTED :", isObjectConnected)

    const typeNature = uObject?.statuses?.__user_typeNature;

    const [currentActive, setCurrentActive] = useState();
    const [stateIcon, setStateIcon] = useState([]);
    const [isBSO, setIsBSO] = useState(traits?.includes("Rotation"))
    
    const [activeAction, setActiveAction] = useState("");
    
    const [sceneAction, setSceneAction] = useState("");
    
    // Change Icon according to selected routine action
    const [whichClick, setWhichClick] = useState("");


  

    let picto868;
    if (typeNature == "store") {
        picto868 = [iconsJs.store868Icon]
    } else if (typeNature == "bso") {
        picto868 = [iconsJs.bso868Icon]
    } else { picto868 = [iconsJs.vr868Icon] }

    let  icons = [
        iconsJs.upIcon,
        iconsJs.downIcon,
        iconsJs.favIcon,

    ]
   

    function range(start, end) {
        if (start === end) return [start];
        return [start, ...range(start + 1, end)];
    }
    const openRange = range(90, 100);
    const levelRange75 = range(75, 89);
    const levelRange50 = range(50, 74);
    const levelRange25 = range(25, 49);
    const closeRange = range(0, 24);


    useEffect(() => {

    }, [activeAction]);


    useEffect(() => {
        console.log("CHECK IS ROUTINE :::::", isRoutine);
    }, [isRoutine])
    useEffect(() => {
        console.log("WIDGET FOR SCENARIO :", isScenario, sceneAction)
    }, [sceneAction])

    useEffect(() => {
        console.log("ACTIVE_STATUS :", status)
        const statusLevel = Number(shutterLevel);


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
    }, [currentActive, shutterLevel, isObjectConnected, status, typeNature]);



    const handleIconPress = (iconId) => {

        console.log("Cas_Routine ? :", iconId, selectedAction)
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
                <View  
                    style={{ flexDirection: 'row', width:'38%',height:'100%', justifyContent: 'space-between', alignItems: 'center', 
                             marginLeft: 10, backgroundColor: 'transparent',
                           }}
                    >
                    <RoutineWidgetIcon itemId={itemId} iconSize={42} isLabelUp={true} withBorder={true}/>
                </View>
                
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
        marginLeft: 15,
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