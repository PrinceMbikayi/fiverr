import '_brand/templates/components/objects/common/locales'
import React, { useState, useEffect, useRef } from 'react';
import { SafeAreaView, View, Text, StyleSheet } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '_theming/themeProvider';
import { useSelector, useDispatch } from 'react-redux';
import { useObject } from '_hooks/object';
import { iconsJs } from '_brand/utils/iconsJs';
import { MultiPurposeWidgetLine } from "_brand/templates/components/objects/common/MultiPurposeWidgetLine";
import { RoutineWidgetLine } from "_brand/templates/components/objects/common/RoutineWidgetLine";
import { BottomDeleteSheet } from '_brand/templates/components/objects/common/BottomDeleteSheet';
import { deleteObject } from '_api/objects';
import * as Actions from '_actions/objects';
import Toast from 'react-native-root-toast';

import { removeItemFromUserFav } from '_brand/utils/removeItemFromUserFav';
import {useScenario} from '_brand/templates/screens/routines/hook/useScenario'
import { RoutineWidgetIcon } from '_brand/templates/components/objects/common/RoutineWidgetIcon';


export const CommonShutterRoutineDetailsView = (props) => {
    const { itemId, setKebab, traits } = props;



    const uScenario = useScenario();
    const { updateActions, isRoutine } = uScenario;
    console.log("ISROUTINE DETAIL", isRoutine)

    const gloIsConnected = useSelector(state => state?.network?.isConnected);
    const gloServerIsDown = useSelector(state => state?.network?.serverIsDown);
    const netInfoIsConnected = (gloIsConnected == true && gloServerIsDown == false);
    const dispatch = useDispatch();
    // Shutter Object all infos
    const uObject = useObject(itemId);
    const typeName = uObject?.objectDatas?.typeName;
    const connected = uObject?.objectDatas?.connected;
    console.log("UOBJECT TO CHECK :", JSON.stringify(uObject));
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
    const [isBSO, setIsBSO] = useState(traits?.includes("Rotation"));
    const [isStore, setIsStrore] = useState(traits?.includes("Rotation"));

    const [activeAction, setActiveAction] = useState("");
    const [isTiltActive, setIsTiltActive] = useState("");

    useEffect(() => {

    }, [isTiltActive])
    useEffect(() => {

    }, [activeAction])


    const { t, i18n } = useTranslation();
    const tns = "common";
    const { theme } = useTheme();

    const navigation = useNavigation();




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
        const statusLevel = Number(shutterLevel);
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
    }, [shutterLevel]);

    useEffect(() => {

    }, [currentActive])

    useEffect(() => {

    }, [status])

    useEffect(() => {
        console.log("TRAITSCHECK :", traitsCheck)
    }, [traitsCheck])
    useEffect(() => {
        console.log("TRAITS :", traits)
    }, [traits])


    const handleOnPress = (iconId) => {
        console.log("MY ICON ID :", iconId)
        if (iconId === 'FAV_CALL_1/FAV_CALL_1/' + `${itemId}`) {
            const action = 'FAV_CALL_1/FAV_CALL_1/' + `${itemId}`;
            setCurrentActive(iconId);
            if (isRoutine) {
                updateActions(action)
                setActiveAction(iconId)
            } else {

                uObject?.execute("FAV_CALL_1");
            }
        }
        if (iconId === "STOP/STOP/" + `${itemId}`) {
            setCurrentActive(iconId);
            uObject.execute("STOP");
        }
        if (iconId === "LEVEL/10/" + `${itemId}`) {
            const action = "LEVEL/10/" + `${itemId}`;
            setCurrentActive(iconId);
            if (isRoutine) {
                updateActions(action)
                setActiveAction(iconId)
            } else {
                uObject.execute("LEVEL", { mArgs: [{ name: 'level', value: 10 }] });
            }
        }

        // Level opening
        if (iconId === 'OPEN/OPEN/' + `${itemId}`) {
            const action = "OPEN/OPEN/" + `${itemId}`
            setCurrentActive(iconId);
            if (isRoutine) {
            } else {
                uObject.execute("OPEN");
            }
        }
        if (iconId === 'LEVEL/25/' + `${itemId}`) {
            const action = "LEVEL/25/" + `${itemId}`
            setCurrentActive(iconId);
            if (isRoutine) {
            } else {
                uObject.execute("LEVEL", { mArgs: [{ name: 'level', value: 75 }] });
            }
        }
        if (iconId === 'LEVEL/50/' + `${itemId}`) {
            const action = "LEVEL/50/" + `${itemId}`
            setCurrentActive(iconId);
            if (isRoutine) {
            } else {
                uObject.execute("LEVEL", { mArgs: [{ name: 'level', value: 50 }] });
            }
        }
        if (iconId === 'LEVEL/75/' + `${itemId}`) {
            const action = "LEVEL/75/" + `${itemId}`
            setCurrentActive(iconId);
            if (isRoutine) {
            } else {
                uObject.execute("LEVEL", { mArgs: [{ name: 'level', value: 25 }] });
            }
        }

        if (iconId === 'CLOSE/CLOSE/' + `${itemId}`) {
            const action = "CLOSE/CLOSE/" + `${itemId}`
            setCurrentActive(iconId);
            if (isRoutine) {
            } else {
                uObject.execute("CLOSE");
            }
        }

        if (iconId === "TILT/0/" + `${itemId}`) {
            const action = "TILT/0/" + `${itemId}`
            setCurrentActive(iconId);
            if (isRoutine) {
            } else {
                uObject.execute("TILT", { mArgs: [{ name: 'angle', value: 0 }] });
            }
        }
        if (iconId === "TILT/22/" + `${itemId}`) {
            const action = "TILT/22/" + `${itemId}`
            setCurrentActive(iconId);
            if (isRoutine) {
            } else {
                uObject.execute("TILT", { mArgs: [{ name: 'angle', value: 22 }] });
            }
        }
        if (iconId === "TILT/45/" + `${itemId}`) {
            const action = "TILT/45/" + `${itemId}`
            setCurrentActive(iconId);
            if (isRoutine) {
            } else {
                uObject.execute("TILT", { mArgs: [{ name: 'angle', value: 45 }] });
            }
        }
        if (iconId === "TILT/67/" + `${itemId}`) {
            const action = "TILT/67/" + `${itemId}`
            setCurrentActive(iconId);
            if (isRoutine) {
            } else {
                uObject.execute("TILT", { mArgs: [{ name: 'angle', value: 67 }] });
            }
        }
        if (iconId === "TILT/90/" + `${itemId}`) {
            const action = "TILT/90/" + `${itemId}`
            setCurrentActive(iconId);
            if (isRoutine) {
            } else {
                uObject.execute("TILT", { mArgs: [{ name: 'angle', value: 90 }] });
            }
        }

    }

    const handleOnLongPress = (iconId) => {
        if (iconId === 'FAV_CALL_1/FAV_CALL_1/') {
            setCurrentActive(iconId);
            uObject.execute("FAV_SET_1");
            setTimeout(() => {
                setCurrentActive();
                Toast.show(
                    "Favorite position set ",
                    {
                        backgroundColor: 'black',
                        textColor: 'white',
                        textStyle: { fontSize: 16, fontWeight: '600' },
                        containerStyle: { width: '80%', height: 100, justifyContent: 'center', alignItems: 'center', borderRadius: 10, borderColor: borderColor, borderWidth: 2 },
                        //position: Toast.positions.CENTER,
                        position: -350,
                        duration: 3000,
                        onHide: () => { }
                    }
                );
            }, 1000);
        }
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
        // variable "itemPicked" below, is what the GroupModifyScreen needs to be transfered via route params
        const typeName = uObject?.objectDatas?.typeName;
        (typeName === 'composite') ?
            navigation.navigate('GroupModifyScreen', { itemPicked: itemId })
            :
            navigation.navigate('ProductSettings', { 'typeName': typeName, itemId: itemId });
    }


    const handleCancel = () => {
        actionSheetRef.current?.dismiss();
    }

    const handleDelete = async () => {
        console.log("Deleted itemId :", itemId)
        const res = await deleteObject(itemId).catch((err) => { console.log(err) });
        if (res.errCode == 200) {
            await removeItemFromUserFav(itemId)
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

    const sendCurrentActive = (id) => {
        setActive(id);
    }

    const testColor = theme?.onBody || 'yellow';
    const borderColor = theme?.prflxBorderColor || 'orange';
    const bgcolor = theme?.prflxContaintBgColor || 'white';
    const lineWidgetBgColor = theme?.prflxVerticalMultiIconsBgColor || "white";
    const textColor = theme?.prflxTextColor || 'black'

    let iconsCol1;
    let iconsCol2;
    const iconStop = [iconsJs.stopIcon];

    if (!traitsCheck?.includes("Position")) {
        iconsCol1 = [
            iconsJs.favIcon,
        ];
    } else {
        iconsCol1 = [
            iconsJs.favIcon,
            iconsJs.ajarIcon,
        ];
    }
    if (!traitsCheck?.includes("Position")) {
        iconsCol2 = [
            iconsJs.upIcon,
            iconsJs.stopIcon,
            iconsJs.downIcon
        ];
    } else {
        iconsCol2 = [
            iconsJs.upIcon,
            iconsJs.open25perIcon,
            iconsJs.open50perIcon,
            iconsJs.open75perIcon,
            iconsJs.downIcon
        ];
    }

    const iconsCol3 = [
        iconsJs.bsoLame0degIcon,
        iconsJs.bsoLame22degIcon,
        iconsJs.bsoLame45degIcon,
        iconsJs.bsoLame67degIcon,
        iconsJs.bsoLame90degIcon,
    ]


    // console.log("Hello ICON HHH :", iconsCol2)

    const onPressHandler = (id) => {
        console.log("Coucou :", id)
    }

    return (
        <SafeAreaView style={styles.mainBody}>
            <View style={[styles.bodyWrapper, { flex: 1, backgroundColor: bgcolor, borderColor: borderColor }]}>
                {traits?.includes("Position") ?
                    <Text style={{ fontSize: 20, fontWeight: '600', marginBottom: 20 }}>
                        {t(tns + ":" + "OPENED_AT") + " " + shutterLevel + '%'}
                    </Text>
                    :
                    <Text style={{ fontSize: 20, fontWeight: '600', marginBottom: 20 }}>
                        {t(tns + ":" + "UNDEFINED_POSITION")}
                    </Text>
                }
                {/* <View  
                    style={{ flexDirection: 'row', width:'38%',height:'100%', justifyContent: 'space-between', alignItems: 'center', 
                             marginLeft: 10, backgroundColor: 'transparent',
                           }}
                    >
                    <RoutineWidgetIcon itemId={itemId} iconSize={42}/>
                </View> */}

                <View style={styles.middleBody}>
                    <View>
                            <RoutineWidgetLine
                                activeAction={activeAction}
                                itemId={itemId}
                                icons={iconsCol1}
                                iconSize={52}
                                onPress={handleOnPress}
                                onLongPress={handleOnLongPress}
                                active={sendCurrentActive}
                                iconWrapperStyle={[styles.iconDisplay, { borderColor: textColor }]}
                                iconGroupWrapperStyle={[styles.groupIconWrapper, { backgroundColor: lineWidgetBgColor, borderColor: textColor }]}
                                isShadow={true}
                            />
                    </View>
                    <View>
                            <RoutineWidgetLine
                                activeAction={activeAction}
                                itemId={itemId}
                                icons={iconsCol2}
                                iconSize={52}
                                onPress={handleOnPress}
                                onLongPress={handleOnPress}
                                active={sendCurrentActive}
                                iconWrapperStyle={[styles.iconDisplay, { borderColor: textColor }]}
                                iconGroupWrapperStyle={[styles.groupIconWrapper, { backgroundColor: lineWidgetBgColor, borderColor: textColor }]}
                                isShadow={true}
                            />
                    </View>
                    {
                        isBSO &&
                        <View>
                                <RoutineWidgetLine
                                    isTiltActive={activeAction}
                                    itemId={itemId}
                                    icons={iconsCol3}
                                    iconSize={52}
                                    onPress={handleOnPress}
                                    onLongPress={handleOnPress}
                                    active={sendCurrentActive}
                                    iconWrapperStyle={[styles.iconDisplay, { borderColor: textColor }]}
                                    iconGroupWrapperStyle={[styles.groupIconWrapper, { backgroundColor: lineWidgetBgColor, borderColor: textColor }]}
                                    isShadow={true}
                                />
                        </View>
                    }
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
        height: '100%',
        borderRadius: 10,
        margin: 10
    },
    bodyWrapper: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-start',
        padding: 23,
        borderWidth: 1,
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
        marginTop: 31,
        padding: 5
    },
    iconDisplay: {
        flexDirection: 'column',
        margin: 10,
        borderWidth: 1,
        borderRadius: 7,
        //backgroundColor:'white'
    },
    groupIconWrapper: {

        marginHorizontal: 12.5,
        borderRadius: 12,
        borderWidth: 1,
        // marginBottom:100

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