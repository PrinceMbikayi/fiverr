import '_brand/templates/screens/addObject/locales'
import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigation, useRoute, CommonActions } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import PagerView from 'react-native-pager-view';
import { useTheme } from '_theming/themeProvider';
import { ChoixDongleRadio868 } from '_brand/templates/screens/addObject/components/ChoixDongleRadio868';
import { InstructionBranchDongle } from '_brand/templates/screens/addObject/components/InstructionBranchDongle';
import { UserObjectTypeChoice } from '_brand/templates/screens/addObject/components/UserObjectTypeChoice';
import Button from '_brand/templates/components/ui/Button';
import { Body } from '_brand/templates/screens/addObject/components/Body';
import { LoadingAnimation } from '_brand/templates/screens/addObject/components/LoadingAnimation';
import { AddObjectCountDownTasks } from '_brand/templates/screens/addObject/components/AddObjectCountDownTasks';
import { TestObjectBeforeAdding } from '_brand/templates/screens/addObject/components/TestObjectBeforeAdding';
import { ModifyNewAddedObject } from '_brand/templates/screens/addObject/components/ModifyNewAddedObject';
import { HeaderScreen } from '_brand/templates/screens/addObject/components/HeaderScreen';
import { CardImageArrow } from '_brand/templates/screens/addObject/components/addBoxComponents/CardImageArrow';

import Toast from 'react-native-root-toast';
import { myToast } from '_brand/templates/components/ui/myToast';
import { getObjectsByTypeName } from '_helpers/selectors';
import { getObjectById } from '_helpers/objects';
import { Api } from "_api";
import * as Actions from '_actions/objects';
import { deleteObject } from '_api/objects';
import { useKeepAwake } from '@sayem314/react-native-keep-awake';


export const SolarAssistantProcess = () => {

    useKeepAwake();
    const pagerRef = useRef(null);
    const currentPageRef = useRef(0)

    const { t, i18n } = useTranslation();
    const tns = "addObject";
    const dispatch = useDispatch();

    const navigation = useNavigation();
    const route = useRoute();
    const navigationParams = route?.params || {};
    const { myBoxDongleId:idDongle, gatewayObjectId} = navigationParams 
    console.log('NAV_PARAMS_G :', idDongle, gatewayObjectId);//idDongle, boxId

    const [allStates, setAllStates] = useState({ currentPage: 0 });
    const [showContent, setShowContent] = useState(false);
    const [showModifyScreen, setShowModifyScreen] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [itemId, setItemId] = useState();
    const [chooseTypeNature, setChooseTypeNature] = useState("")
    const [showTestObject, setShowTestObject] = useState(false);
    const [loading, setLoading] = useState(true);
    const [active, setActive] = useState("");
    const [refresh, setRefresh] = useState(0);
    const [integratedOrDeported, setIntegrateOrDeported] = useState("integrated")
    const [isWaiting, setIsWaiting] = useState(false);

    const { theme } = useTheme();
    const bgcolor = theme?.prflxbgColor || 'white';
    const textColor = theme?.prflxTextColor || 'black'

    //-------- Scan for dongle and object type name-------
    const loadShutter868 = useSelector(state => getObjectsByTypeName(state, "Rolling_Shutter_Profalux"));
    const storeShutter868Ref = useRef(JSON.stringify(loadShutter868));


   // const idDongle = dongleId //dongleList?.[dongleList?.length - 1];

    ////####----------Begin managing Pager View navigation

    console.log("currentPage changed", allStates.currentPage)

    const updateState = (newStates) => {
        setAllStates({ allStates, ...newStates });
    }

    const goBack = (index) => {
        const nextIndex = currentPageRef.current - 1;
        currentPageRef.current = nextIndex;
        //console.log("in Go Back",nextIndex)
        if (nextIndex < 0) {
            // navigation.goBack(2);
            navigation.goBack();
        } else {
            updateState({ 'currentPage': nextIndex });
            pagerRef.current.setPage(nextIndex);
        }

    };

    const goNextPage = () => {
        const currentPage = allStates.currentPage;
        const nextIndex = currentPage + 1;
        updateState({ "currentPage": nextIndex })
        pagerRef.current.setPage(nextIndex);
    }

    const goPage = (index) => {
        const currentPage = allStates.currentPage;
        currentPageRef.current = index;
        updateState({ "currentPage": index })
        if (pagerRef.current) pagerRef.current.setPage(index);;
    }

    const onPageSelected = (e) => {
        const position = e.nativeEvent.position;
        const index = updateState({ "currentPage": position })
        currentPageRef.current = position;
    }

    ////####-------------End managing Pager View navigation
    useEffect(() => {

        if (allStates.currentPage == 2) {
            setRefresh(prevKey => prevKey + 1)
            pagerRef.current?.setPage(2);
        }
    }, [allStates.currentPage]);

    useEffect(() => {
        console.log('IS_WAITING :', isWaiting);
    }, [isWaiting]);

    useEffect(() => {
        console.log('SHOW_OBJECT :', showTestObject);
    }, [showTestObject]);

    useEffect(() => {
        console.log('NEW_868_ID :', itemId);
    }, [itemId]);


    // const handleDongleRadioNext = () => {
    //     const dongleData = getObjectById(idDongle)
    //     console.log('DONGLE_INFOS :', dongleData);
    //     const dongleConnected = dongleData?.connected

    //     if(dongleConnected){
    //         pagerRef.current?.setPage(0);
    //         goPage(0);
    //     }else{
    //         const message = `${t(tns + ":" + "DONGLE_PRESENT_BUT_NOT_CONNECTED")}`
    //         myToast(message)
    //     }
    // }


    const handleLoadingGoback = () => {
        //setLoading(false);
        goBack();
    }

    const handlePress = (item) => {
        if (item == "vr") {
            setChooseTypeNature("vr");
            //setChooseTypeNature("Rolling_Shutter_Ezsp");
            //setActive(!active)
        }
        if (item == "store") setChooseTypeNature("store");//setChooseTypeNature("Shade_Ezsp");
        if (item == "bso") setChooseTypeNature("bso");//setChooseTypeNature("SwitchEzsp");
    }

    const handleValidatePairing = async () => {
        console.log('CHECK_1 :', idDongle);
        setIsWaiting(true)
        goPage(2);
        const response = await Api.executeAction(idDongle, "APPAIRAGE", { oArgs: [{ name: 'duration', value: 1 }] })
        console.log("RESPONSE :", response)
        setIsPlaying(true);
    }

    const new868Id = useRef(null);


    const onTimerComplete = () => {
        if (allStates.currentPage == 2) {
            const initialShutter868List = JSON.parse(storeShutter868Ref.current)
            const whichNewObject = loadShutter868.filter(x => !initialShutter868List?.includes(x));
            console.log("WHICH OBJECT_868 :", whichNewObject)
            if (whichNewObject.length != 0) {
                //console.log("Here I am new object :", whichNewObject);
                setShowTestObject(true);
                const idObj = whichNewObject[whichNewObject.length - 1]
                setItemId(idObj);
                new868Id.current = idObj;
                console.log(" CHECK ID REF :", new868Id.current)
                goPage(3)
            } else {
                goPage(3)
            }
        }
    }

    const handleIconPress = (iconId) => {
        console.log("CHECK_ICON_ID_PRESSED:", iconId)
    }


    const handleRestart = () => {
        if (itemId && itemId != undefined) {
            const action = Actions.objectDelete(itemId);
            dispatch(action)
            goPage(1)
            setTimeout(async () => {
                const res = await deleteObject(itemId).catch((err) => { console.log(err) });
                console.log('DELETE_FANTOME :', res);
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
                }

            }, 1000)
        }
    }

    const handleEquipWorks = () => {
        //console.log("Handle Equip Works : ")
        setShowModifyScreen(true);
        // uObject?.addStatus("__user_typeNature",chooseTypeNature);
        // uObject?.updateStatus('__user_typeNature',chooseTypeNature);
        goPage(4);
    }

    const handleRetourNoFountObject = () => {
        if (itemId && itemId != undefined) {
            const action = Actions.objectDelete(itemId);
            dispatch(action)
            goPage(1)
            setTimeout(async () => {
                const res = await deleteObject(itemId).catch((err) => { console.log(err) });
                console.log('DELETE_FANTOME :', res);
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
                }

            }, 1000)
        }else{
            goPage(1)
            //pagerRef.current?.setPage(1);
        }
    }


    ///////// RENDER OTHER METHOD
    const RenderLoading = () => {
        return (
            <View>
                <LoadingAnimation
                    topText="Recherche du Dongle Radio, Veuillez patienter  SVP"
                />
            </View>
        )
    }

    const RenderNoDongle = () => {
        return (
            <Body>
                <View style={{ marginBottom: 25 }}>
                    <Text> {t(tns + ":" + "NO_DONGLE_FOUND")}</Text>
                </View>
            </Body>
        )
    }


    const handleIntegratedRadioNext = () => {
        pagerRef.current?.setPage(1)
        setIntegrateOrDeported("integrated")
    }
    const handleDeportedRadioNext = () => {
        pagerRef.current?.setPage(1)
        setIntegrateOrDeported("deported")
    }

    const onWaitingComplete = () => {
        setIsWaiting(false)
    }

    const RenderBody = (props) => {
        const { topText, textDisplay1, textDisplay2, bottomText } = props;
        return (
            <Body style={{ marginTop: !topText ? 20 : 10, backgroundColor:'transparent' }}>
                {
                    topText &&
                    <View style={{ marginBottom: 25 }}>
                        <Text style={styles.text}> {topText}</Text>
                    </View>
                }
                <View style ={{width:'98%',}}>
                    <CardImageArrow
                        withNextArrow={true}
                        onPressNextArrow={handleIntegratedRadioNext}
                        //textStyle={{marginRight:30}}
                        imageSource={require('_brand/templates/screens/addObject/images/radio-integre.png')}
                        innerWidthPercent={'90%'}
                        imgStyle={{ width: 110, height: 60}}
                        textDisplay={textDisplay1}

                    />

                    <CardImageArrow
                        onPressNextArrow={handleDeportedRadioNext}
                        withNextArrow={true}
                        //textStyle={{marginRight:30}}
                        imageSource={require('_brand/templates/screens/addObject/images/radio-deporte.png')}
                        innerWidthPercent={'90%'}
                        imgStyle={{ width: 110, height: 60 }}
                        textDisplay={textDisplay2}

                    />
                </View>

                {
                    bottomText &&
                    <View style={{ justifyContent: 'center', alignItems: 'center', marginBottom: 25, width: 332, height: 132, backgroundColor: 'transparent' }}>
                        <Text style={styles.text}>{bottomText}</Text>
                    </View>
                }
            </Body>
        )
    }

    const IntegratedRadio = () => {

        return (
            <View style={{ marginBottom: 40 }}>
                <Body>
                    <View>
                        <AddObjectCountDownTasks isTimerPlaying={isPlaying} duration={60} onComplete={onTimerComplete} refresh={refresh} />
                    </View>
                    <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 25, width: 332, backgroundColor: 'transparent', flex: 1 }}>
                        <Text style={[styles.text, { marginTop: 10, textAlign: 'auto' }]}>
                            {t(tns + ":" + "WITH_REMOTE_60S_MANIP")} :
                        </Text>
                        <Text style={[styles.text, { marginTop: 10, textAlign: 'auto' }]}>
                            {'\u2022'}{t(tns + ":" + "PRESS_UP_LEAVE_EQUIP_STOP")}
                            {'\u2022'} {t(tns + ":" + "PRESS_DOWN_LEAVE_4_BLADES")}
                            {'\u2022'} {t(tns + ":" + "PRESS_STOP")}
                            {'\u2022'} {t(tns + ":" + "PRESS_UP_LEAVE_EQUIP_STOP")}
                        </Text>
                        <Text style={[styles.text, { marginTop: 5, textAlign: 'auto' }]}>
                            {t(tns + ":" + "WAIT_COUNT_DOWN")}
                        </Text>
                    </View>
                    {/* <View style={[styles.validateButton, { color: textColor, marginTop: 10, marginBottom:40 }]}>
                        <Button onPress={onTimerComplete} altStyle titleColor='white' title={t(tns + ":" + "VALIDATE")} bgColor={textColor} noBorder />
                    </View> */}
                </Body>
            </View>
        )
    }

    const DeportedRadio = () => {
        return (
            <View>
                <Body>
                    <View>
                        <AddObjectCountDownTasks isTimerPlaying={isPlaying} duration={60} onComplete={onTimerComplete} refresh={refresh} />
                    </View>
                    <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 25, width: 332, backgroundColor: 'transparent', flex: 1 }}>
                        <Text style={[styles.text, { marginTop: 10, textAlign: 'auto' }]}>
                            {t(tns + ":" + "WITH_REMOTE_60S_MANIP")} :
                        </Text>
                        <Text style={[styles.text, { marginTop: 20, textAlign: 'auto' }]}>
                            {'\u2022'} {t(tns + ":" + "UP")} {'\n'}
                            {'\u2022'} {t(tns + ":" + "STOP")} {'\n'}
                            {'\u2022'} {t(tns + ":" + "DOWN")} {'\n'}
                            {'\u2022'} {t(tns + ":" + "STOP")} {'\n'}
                            {'\u2022'} {t(tns + ":" + "UP")} {'\n'}
                            {'\u2022'} {t(tns + ":" + "STOP")} {'\n'}
                        </Text>
                        <Text style={[styles.text, { marginTop: 5, textAlign: 'auto' }]}>
                            {t(tns + ":" + "WAIT_COUNT_DOWN")}
                        </Text>
                    </View>
                    {/* <View style={[styles.validateButton, { color: textColor, marginTop: 10, marginBottom:40 }]}>
                        <Button onPress={onTimerComplete} altStyle titleColor='white' title={t(tns + ":" + "VALIDATE")} bgColor={textColor} noBorder />
                    </View> */}
                </Body>
            </View>
        )
    }


    const resetNavigation = ()=>{
        pagerRef.current?.setPage(0)
        // Reset SolarAssistantStack to initial route = SolarAssistantHomeScreen
        navigation.popToTop()
        //Reset AddObjectStack to initial route = AddObject
        navigation.dispatch({
            ...CommonActions.reset({
              index: 0,
              routes: [{ name: "AddObject" }]
            })
          });
          
    }

    return (
        <SafeAreaView style={{ height: '100%', backgroundColor: 'transparent' }}>

            <PagerView
                style={[{ flex: 1, backgroundColor: bgcolor }]}
                ref={pagerRef}
                initialPage={0}
                scrollEnabled={false}
                onPageSelected={onPageSelected}
            >

                <View key="0" style={{ alignItems: 'center', justifyContent: 'flex-start', backgroundColor: 'transparent', paddingTop: 20 }} >
                    <HeaderScreen title={`${t(tns + ":" + "EQUIP_CHOICE")}`} goBack={handleLoadingGoback} />
                        <RenderBody
                            topText={t(tns + ":" + "CHOOSE_EQUIP_TO_INSTALL")}
                            textDisplay1={t(tns + ":" + "SOLAR_OR_RADIO_EQUIP")}
                            textDisplay2={t(tns + ":" + "EQUIP_868_RADIO_DEPOR")}
                            bottomText={t(tns + ":" + "IN_CASE_DOUBTS")}
                        />
                </View>

                <View key='1' style={{ alignItems: 'center', justifyContent: 'flex-start', backgroundColor: 'transparent', paddingTop: 20 }}>
                    <HeaderScreen title={t(tns + ":" + "EQUIP_CHOICE")} goBack={goBack} />
                    <View style={{backgroundColor:'transparent', flex:1, justifyContent:'flex-start', alignItems:'center'}}>
                        <View style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: 'transparent', marginTop: 20 }}>
                            <Text style={styles.text}>
                                {t(tns + ":" + "CHOOSE_TYPE_EQUIP_TO_ADD")}
                            </Text>
                        </View>

                        <View>
                            <UserObjectTypeChoice
                                onPressHandler={handlePress}
                            />

                        </View>

                        <View style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: 'transparent' }}>
                            <Text style={[styles.text]}>

                                {t(tns + ":" + "WITH_REMOTE_CHECK_EQUIP_WORKS")}
                            </Text>
                            <Text style={[styles.text]}>

                                {'\u2022'} {t(tns + ":" + "SET_EQUIPS_MID_WAY")}

                            </Text>
                            <Text style={[styles.text]}>

                                {'\u2022'} {t(tns + ":" + "CHECK_REMOTE_CONTROL_ONLY_ADDED_EQUIP")}
                            </Text>
                            <Text style={[styles.text]}>
                                {t(tns + ":" + "IF_MULTI_EQUIPS_CONTROLED_CHANGE_REMOTE")}
                            </Text>
                        </View>
                        <View style={[styles.validateButton, { color: textColor, marginBottom:40,}]}>
                            <Button onPress={handleValidatePairing} altStyle titleColor='white' title={t(tns + ":" + "VALIDATE")} bgColor={textColor} noBorder />
                        </View>
                    </View>
                </View>

                <View key='2' style={{ alignItems: 'center', justifyContent: 'flex-start', backgroundColor: 'transparent', paddingTop: 20 }}>
                    <HeaderScreen title={t(tns + ":" + `${isWaiting ? "PAIRING" : "ADD_EQUIP"}`)} withBack={false} goBack={() => { setIsPlaying(false); setIsWaiting(false); goBack() }} />
                    <View style={{ justifyContent:'flex-start', alignItems:'center', flex:1, backgroundColor:'transparent'}}>
                        {isWaiting ?
                            <View style={{ justifyContent:'flex-start', alignItems:'center', flex:1}}>
                                <View style={{ marginTop: 30, marginBottom: 40, justifyContent: 'center', alignItems: 'center' }}>
                                    <Text style={styles.text}>{t(tns + ":" + "WAIT_PAIRING")}</Text>
                                </View>
                                <AddObjectCountDownTasks isTimerPlaying={isWaiting} duration={10} onComplete={onWaitingComplete} refresh={refresh} />
                            </View>
                            :
                            <View>
                                {
                                    integratedOrDeported == "integrated" ?
                                        <IntegratedRadio />
                                        :
                                        <DeportedRadio />
                                }
                            </View>
                        }
                    </View>
                </View>

                <View key='3' style={{ alignItems: 'center', justifyContent: 'flex-start', backgroundColor: 'transparent', paddingTop: 20 }}>
                    <HeaderScreen title={t(tns + ":" + "ADD_EQUIP")} withBack={false} goBack={() => { goBack(); setRefresh(prevKey => prevKey + 1); console.log("GOOOOOO") }} />
                    <Body>
                        {
                            showTestObject ?
                                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                    <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 25, backgroundColor: 'transparent' }}>
                                        <Text style={[styles.text, { marginTop: 0, textAlign: 'center' }]}>
                                            {t(tns + ":" + "CHECK_EQUIP_WORKS")}
                                        </Text>
                                    </View>

                                    <View>
                                        {(itemId != null && itemId != undefined) &&
                                            <TestObjectBeforeAdding itemId={itemId} typeNature={chooseTypeNature} handleIconPress={handleIconPress} />
                                        }
                                    </View>

                                    <View style={[styles.validateButton, { color: textColor, marginTop: 10 }]}>
                                        <Button onPress={handleEquipWorks} altStyle titleColor='white' title={t(tns + ":" + "EQUIP_WORKS")} bgColor={textColor} noBorder />
                                    </View>

                                    <View style={[styles.validateButton, { color: textColor, marginTop: 20 }]}>
                                        <Button onPress={handleRestart} altStyle titleColor='white' title={t(tns + ":" + "RESTART")} bgColor={textColor} noBorder />
                                    </View>
                                </View>
                                :
                                <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 200 }}>
                                    <Text> {t(tns + ":" + "NO_NEW_OBJECT_DETECTED")} </Text>
                                    <View style={[styles.validateButton, { color: textColor }]}>
                                        <Button onPress={handleRetourNoFountObject} altStyle titleColor='white' title={t(tns + ":" + "BACK")} bgColor={textColor} noBorder />
                                    </View>
                                </View>
                        }
                    </Body>
                </View>

                <View key='4' style={{ alignItems: 'center', justifyContent: 'flex-start', backgroundColor: 'transparent', paddingTop: 20 }}>
                    <HeaderScreen title={t(tns + ":" + "ADD_EQUIP")} goBack={() => { setIsPlaying(false); setIsWaiting(false); goBack() }} />
                    <Body>
                        {showModifyScreen &&
                            <View style={{ marginTop: 15 }}>
                                <ModifyNewAddedObject itemId={itemId} chooseTypeNature={chooseTypeNature} callBackSetPage={resetNavigation} />
                            </View>
                        }
                        {/* <View style={[styles.validateButton, {color:textColor, marginTop:10}]}>
                                                <Button onPress={goNextPage} altStyle titleColor='white' title={t(tns + ":" + "VALIDATE")} bgColor={textColor} noBorder />
                                            </View> */}
                    </Body>
                </View>

            </PagerView>
        </SafeAreaView>

    )
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'transparent',
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerStyle: {
        justifyContent: 'center',
        borderBottomColor: 'orange',
        borderBottomWidth: 2,
        height: '8%',
        backgroundColor: "#FFFFFF",
        marginBottom: 0
    },
    pager: {
        flex: 1,
        //   alignSelf: "stretch",
        //   width: "100%",
        //   height:"100%",
    },
    bodyWrapper: {
        margin: 20,
        //flexDirection:'column',
        // justifyContent:'center',
        // alignItems:'center',
        padding: 21,
        borderWidth: 2,
        borderRadius: 12,
    },
    bodyContent: {
        flex: 1,
        margin: 11,
        justifyContent: 'space-evenly',
        padding: 11,
        borderColor: 'orange',
        borderWidth: 2,
        borderRadius: 15,
        backgroundColor: 'white'
    },
    bodyStyle: {
        backgroundColor: 'transparent',
        flex: 1, flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    scrollWrapper: {
        marginTop: 5,
        paddingHorizontal: 0,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'stretch'
    },
    text: {
        backgroundColor:'transparent',
        fontSize: 16,
        fontWeight: '400',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        flexWrap: 'wrap',
        lineHeight: 20,
        marginVertical: 10,
        color: '#3E495E'
    },
    validateButton: {
        minWidth: 200,
        height: 50,
        marginTop: 50,
    }
});
