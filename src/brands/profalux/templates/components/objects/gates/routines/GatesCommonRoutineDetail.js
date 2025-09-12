import '_brand/templates/components/objects/common/locales'
import React, { useState, useEffect, useRef } from 'react';
import { SafeAreaView, View, Text, StyleSheet, Pressable } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

import { useTranslation } from 'react-i18next';
import { useTheme } from '_theming/themeProvider';
import {useSelector,useDispatch} from "react-redux";

import { useObject } from '_hooks/object';

import { iconsJs } from '_brand/utils/iconsJs';
import { MultiPurposeWidgetLine } from "_brand/templates/components/objects/common/MultiPurposeWidgetLine";
import { BottomDeleteSheet } from '_brand/templates/components/objects/common/BottomDeleteSheet';
import { deleteObject } from '_api/objects';
import * as Actions from '_actions/objects';
import Toast from 'react-native-root-toast';

import { RoutineWidgetLine } from "_brand/templates/components/objects/common/RoutineWidgetLine";
import {useScenario} from '_brand/templates/screens/routines/hook/useScenario'
import { RoutineWidgetIcon } from '_brand/templates/components/objects/common/RoutineWidgetIcon';


export const GatesCommonRoutineDetail = (props) => {
    const { itemId, setKebab, traits } = props;

    const uScenario = useScenario();
    const { isRoutine, actionsByItemId } = uScenario;
    const dispatch = useDispatch();

    const gloIsConnected = useSelector(state => state?.network?.isConnected);
    const gloServerIsDown = useSelector(state => state?.network?.serverIsDown);
    const netInfoIsConnected = (gloIsConnected == true && gloServerIsDown == false);
    // Shutter Object all infos
    const uObject = useObject(itemId);
    const typeName = uObject?.objectDatas?.typeName;
    const connected = uObject?.objectDatas?.connected;
    console.log("UOBJECT TO CHECK :", uObject)
    const traitsCheck = uObject?.objectDatas?.traits;
    const shutterLevel = uObject?.statuses?.level
    const status = uObject?.statuses?.status;
    const typeNature = uObject?.statuses?.__user_typeNature;
    let picto868;
    if (typeNature == "store") {
        picto868 = [iconsJs.store868Icon]
    } else if (typeNature == "bso") {
        picto868 = [iconsJs.bso868Icon]
    } else { picto868 = [iconsJs.vr868Icon] }


    console.log(" GET STATUS :", status);

    const [currentActive, setCurrentActive] = useState();
    const [levelMessage, setLevelMessage] = useState("");
    const [stateIcon, setStateIcon] = useState([])
    const [isToggleMode, setIsToggleMode] = useState(!traits?.includes("Open")) // true => non toggle
    const [statusMsg, setStatusMsg] = useState("");


    const { t, i18n } = useTranslation();
    const tns = "common";

    const { theme } = useTheme();

    const navigation = useNavigation();
    const route = useRoute();
    const navigationParams = route?.params || {};


    const icons = [
        iconsJs.upIcon,
        iconsJs.downIcon,
    ]

    useEffect(() => {

    }, [stateIcon])


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

        if (iconId == 'OPEN/OPEN/'+`${itemId}`) {
            setCurrentActive(iconId);
            if(isRoutine){
            }else{
                uObject?.execute("OPEN");
            }
        }

        if (iconId == 'CLOSE/CLOSE/'+`${itemId}`) {
            setCurrentActive(iconId);
            if(isRoutine){
            }else{
                uObject?.execute("CLOSE");
            }
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

    const shadow = {
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.8,
        elevation: 8,
        shadowColor: '#000000',
    }


    //////////-------- Dealing with kebab menu
    const options = [
        {
            id: "modify",
            title: `${t(tns + ":" + "KEBAB_MODIFY")}`,
            iconJSName: iconsJs.modifyIcon.name,
            action: () => kebabUpdateAction()
        },
        {
            id: 'delete',
            title: `${t(tns + ":" + "KEBAB_DELETE")}`,
            iconJSName: iconsJs.deleteIcon.name,
            action: () => kebabDeleteAction()
        },
    ]
    //////////////////////////
    const actionSheetRef = useRef(null);
    const kebabDeleteAction = () => {
        actionSheetRef.current?.present()
        //  actionSheetRef.current?.show()
    }

    ////////////////////////
    // Show the setting icon on header of level 2 widget 
    useEffect(() => {

        if (setKebab) {
            setKebab(options)
        }
    }, []);

    const kebabUpdateAction = () => {
        const typeName = uObject?.objectDatas?.typeName;
        (typeName === 'composite') ?
            navigation.navigate('GroupModifyScreen', { itemPicked: itemId })
            :
            navigation.navigate('ProductSettings', { 'typeName': typeName, itemId: itemId });
    }


    const handleCancel = () => {
        console.log('Delete canceled');
        actionSheetRef.current?.dismiss();
    }

    const handleDelete = async () => {
        console.log("Deleted itemId :", itemId)
        const res = await deleteObject(itemId).catch((err) => { console.log(err) });
        if (res.errCode == 200) {
            Toast.show(
                `${t(tns + ":" + "TOAST_DELETE")}`,
                {
                    backgroundColor: 'black',
                    textColor: 'white',
                    textStyle: { fontSize: 16, fontWeight: '600' },
                    containerStyle: { width: '80%', height: 100, justifyContent: 'center', alignItems: 'center', borderRadius: 10, borderColor: borderColor, borderWidth: 2 },
                    position: -350,
                    duration: 2000,
                }
            );
            navigation.goBack()
            const action = Actions.objectDelete(itemId);
            dispatch(action)
        }
        actionSheetRef.current?.dismiss();
    }


    const testColor = theme?.onBody || 'yellow';
    const borderColor = theme?.prflxBorderColor || 'orange';
    const bgcolor = theme?.prflxContaintBgColor || 'white';
    const lineWidgetBgColor = theme?.prflxVerticalMultiIconsBgColor || "white";
    const textColor = theme?.prflxTextColor || 'black'


    const handleRoutinePress = () => {
        console.log("YUUUUPIIII")
    }

    return (
        <SafeAreaView style={styles.mainBody}>
            <View style={{
                position: 'absolute', zIndex: (connected == false || !netInfoIsConnected) ? 1 : 0,
                backgroundColor: (connected == false || !netInfoIsConnected) ? theme['card--color--deactivated-overlay'] : 'transparent',
                width: '100%', height: '100%', borderRadius: 12, opacity: 0.6
            }}
            />
            <View style={[styles.bodyWrapper, { flex: 1, backgroundColor: bgcolor, borderColor: borderColor }]}>
                <Text style={{ fontSize: 20, fontWeight: "bold", color: textColor, backgroundColor: 'transparent', textAlign: 'left', marginBottom: 10 }}>
                    {statusMsg}
                </Text>

                <View style={styles.topBody}>
                    <MultiPurposeWidgetLine
                        icons={stateIcon}
                        isPressable={false}
                        iconSize={73}
                        //onPress = {handleOnPress} 
                        //onLongPress = {handleOnPress}
                        active={sendCurrentActive}
                    />
                </View>

                <View style={styles.middleBody}>
                        <View style={{
                            backgroundColor: '#EBF1F5', borderColor: '#3E495E',
                            borderWidth: 1, borderRadius: 12, height: 113, width: 177, justifyContent: 'center', alignItems: 'center'
                        }}>

                            <RoutineWidgetLine
                                itemId={itemId}
                                icons={icons}
                                isPressable={true}
                                onPress={handleRoutinePress}
                                onLongPress={handleRoutinePress}
                                iconWrapperStyle={[styles.iconDisplay, { borderColor: textColor }]}
                                isShadow={true}
                            />

                        </View>
                </View>

            </View>

            <BottomDeleteSheet
                myRef={actionSheetRef}
                handleCancel={handleCancel}
                handleDelete={handleDelete}
            />
        </SafeAreaView>
    );

}

const styles = StyleSheet.create({
    mainBody: {
        borderRadius: 10,
        margin: 10,
    },
    bodyWrapper: {
        flexDirection: 'column',
        justifyContent: 'center',
        padding: 23,
        borderWidth: 2,
        borderRadius: 12,
    },
    topBody: {
        backgroundColor: 'transparent',
        alignItems: 'flex-start',
    },
    middleBody: {
        backgroundColor: 'transparent',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        marginTop: 50,
        padding: 5
    },
    iconDisplay: {
        flexDirection: 'column',
        margin: 10,
        borderWidth: 2,
        borderRadius: 7,
    },
    groupIconWrapper: {
        marginHorizontal: 12.5,
        borderRadius: 12,
        borderWidth: 1,

    },
    footView: {
        marginTop: 57,
        marginBottom: 54,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    },
    textStyle: {
        marginTop: 2,
        fontSize: 18,
    }


});